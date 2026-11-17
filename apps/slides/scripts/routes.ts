/*
 * Calcule les itinéraires GPS de la carte DevFest City, en privilégiant les grands axes.
 *
 * Les routes sont lues dans le masque (devfest-city-map-mask.webp, aligné sur la carte) : grands axes en
 * blanc, petites rues en gris, le reste en noir. Les positions sont lues dans map-markers.json, dans
 * l'ordre du parcours. Écrit les chemins SVG dans routes.generated.json et une image de contrôle dans
 * scripts/routes-preview.png.
 *
 * Usage : bun run routes
 */

import { writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import sharp from 'sharp';
import markers from '../src/lib/components/map/map-markers.json';

const ROOT = resolve(import.meta.dir, '..');
const MAP_IMAGE = resolve(ROOT, 'src/lib/assets/slides/map/devfest-city-map.webp');
const MASK_IMAGE = resolve(ROOT, 'src/lib/assets/slides/map/devfest-city-map-mask.webp');
const ROUTES_FILE = resolve(ROOT, 'src/lib/components/map/routes.generated.json');
const PREVIEW_FILE = resolve(ROOT, 'scripts/routes-preview.png');

const SMOOTHING = 10; // écart-type du lissage, en pixels
const POINT_SPACING = 10; // distance entre deux points du chemin SVG, en pixels
const ROAD_THRESHOLD = 60; // luminosité minimale d'une route (petites rues comprises) dans le masque
const MAIN_ROAD_THRESHOLD = 200; // luminosité minimale d'un grand axe dans le masque
const ROAD_HALF_WIDTH = 5; // demi-largeur des grands axes, en pixels
const SIDE_STREET_COST = 30; // coût d'un pixel de petite rue : le GPS fait le détour par les grands axes
const OFF_ROAD_COST = 10000; // coût d'un pixel hors route : le chemin ne sort de la route qu'en dernier recours

type Point = { x: number; y: number };
type PositionName = keyof typeof markers;
type Route = { name: string; start: PositionName; end: PositionName };

/*  Grille de pixels : un pixel est repéré par son index (y * width + x)  */
type Grid = { width: number; height: number };

type RoadMap = Grid & {
	road: Uint8Array; // 1 si route (toutes)
	mainRoad: Uint8Array; // 1 si grand axe
};

/*  8 voisins : décalage en x, en y, et longueur du pas  */
const NEIGHBOURS = [
	[-1, -1, Math.SQRT2],
	[0, -1, 1],
	[1, -1, Math.SQRT2],
	[-1, 0, 1],
	[1, 0, 1],
	[-1, 1, Math.SQRT2],
	[0, 1, 1],
	[1, 1, Math.SQRT2]
] as const;

function* neighboursOf(grid: Grid, index: number): Generator<[number, number]> {
	const x = index % grid.width;
	const y = Math.floor(index / grid.width);
	for (const [dx, dy, length] of NEIGHBOURS) {
		const nx = x + dx;
		const ny = y + dy;
		if (nx >= 0 && nx < grid.width && ny >= 0 && ny < grid.height) {
			yield [ny * grid.width + nx, length];
		}
	}
}

/*  Itinéraires : d'une position à la suivante, dans l'ordre de map-markers.json  */
function itineraryRoutes(): Route[] {
	const names = Object.keys(markers) as PositionName[];
	return names.slice(1).map((end, i) => ({ name: `to-${end}`, start: names[i], end }));
}

/*  Pixels de route (toutes) et de grands axes, d'après la luminosité du masque  */
async function loadRoads(): Promise<RoadMap> {
	const { data, info } = await sharp(MASK_IMAGE)
		.greyscale()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const road = new Uint8Array(data.length);
	const mainRoad = new Uint8Array(data.length);
	for (let i = 0; i < data.length; i++) {
		road[i] = data[i] > ROAD_THRESHOLD ? 1 : 0;
		mainRoad[i] = data[i] > MAIN_ROAD_THRESHOLD ? 1 : 0;
	}
	return { width: info.width, height: info.height, road, mainRoad };
}

/*  Distance (en pas) au bord de la route, plafonnée à ROAD_HALF_WIDTH : parcours en largeur depuis le hors-route  */
function distanceToRoadEdge(roads: RoadMap): Uint8Array {
	const distance = new Uint8Array(roads.road.length).fill(ROAD_HALF_WIDTH);
	const queue = new Int32Array(roads.road.length);
	let head = 0;
	let tail = 0;
	for (let i = 0; i < roads.road.length; i++) {
		if (!roads.road[i]) {
			distance[i] = 0;
			queue[tail++] = i;
		}
	}
	while (head < tail) {
		const current = queue[head++];
		const next = distance[current] + 1;
		if (next >= ROAD_HALF_WIDTH) continue;
		for (const [neighbour] of neighboursOf(roads, current)) {
			if (distance[neighbour] > next) {
				distance[neighbour] = next;
				queue[tail++] = neighbour;
			}
		}
	}
	return distance;
}

/*  Coût de passage : grands axes moins chers que les petites rues, minimal au centre de la route  */
function roadCost(roads: RoadMap): Float64Array {
	const distance = distanceToRoadEdge(roads);
	const cost = new Float64Array(roads.road.length);
	for (let i = 0; i < cost.length; i++) {
		const base = roads.mainRoad[i] ? 1 : roads.road[i] ? SIDE_STREET_COST : OFF_ROAD_COST;
		cost[i] = base / (1 + distance[i]) ** 2;
	}
	return cost;
}

/*  Pixel de route le plus proche de la position  */
function snapToRoad(roads: RoadMap, position: Point): number {
	let nearest = -1;
	let nearestDistance = Infinity;
	for (let i = 0; i < roads.road.length; i++) {
		if (!roads.road[i]) continue;
		const d =
			((i % roads.width) - position.x) ** 2 + (Math.floor(i / roads.width) - position.y) ** 2;
		if (d < nearestDistance) {
			nearest = i;
			nearestDistance = d;
		}
	}
	return nearest;
}

/*  File de priorité minimale (tas binaire) d'index de pixels, triés par coût  */
class MinHeap {
	private indexes: number[] = [];
	private priorities: number[] = [];

	get size(): number {
		return this.indexes.length;
	}

	push(index: number, priority: number): void {
		this.indexes.push(index);
		this.priorities.push(priority);
		this.siftUp(this.indexes.length - 1);
	}

	pop(): number {
		const top = this.indexes[0];
		const lastIndex = this.indexes.pop()!;
		const lastPriority = this.priorities.pop()!;
		if (this.indexes.length > 0) {
			this.indexes[0] = lastIndex;
			this.priorities[0] = lastPriority;
			this.siftDown(0);
		}
		return top;
	}

	private siftUp(i: number): void {
		while (i > 0) {
			const parent = (i - 1) >> 1;
			if (this.priorities[parent] <= this.priorities[i]) return;
			this.swap(i, parent);
			i = parent;
		}
	}

	private siftDown(i: number): void {
		for (;;) {
			const left = 2 * i + 1;
			const right = left + 1;
			let smallest = i;
			if (left < this.size && this.priorities[left] < this.priorities[smallest]) smallest = left;
			if (right < this.size && this.priorities[right] < this.priorities[smallest]) smallest = right;
			if (smallest === i) return;
			this.swap(i, smallest);
			i = smallest;
		}
	}

	private swap(a: number, b: number): void {
		[this.indexes[a], this.indexes[b]] = [this.indexes[b], this.indexes[a]];
		[this.priorities[a], this.priorities[b]] = [this.priorities[b], this.priorities[a]];
	}
}

/*
 * Plus court chemin pondéré (Dijkstra, 8 voisins) : le coût d'un pas est la moyenne des coûts des
 * deux pixels multipliée par la longueur du pas, comme MCP_Geometric de scikit-image.
 */
function shortestPath(grid: Grid, cost: Float64Array, start: number, end: number): Point[] {
	const total = new Float64Array(cost.length).fill(Infinity);
	const previous = new Int32Array(cost.length).fill(-1);
	const heap = new MinHeap();
	total[start] = 0;
	heap.push(start, 0);

	while (heap.size > 0) {
		const current = heap.pop();
		if (current === end) break;
		for (const [neighbour, length] of neighboursOf(grid, current)) {
			const candidate = total[current] + ((cost[current] + cost[neighbour]) / 2) * length;
			if (candidate < total[neighbour]) {
				total[neighbour] = candidate;
				previous[neighbour] = current;
				heap.push(neighbour, candidate);
			}
		}
	}

	const path: Point[] = [];
	for (let i = end; i !== -1; i = previous[i]) {
		path.push({ x: i % grid.width, y: Math.floor(i / grid.width) });
	}
	return path.reverse();
}

/*  Filtre gaussien 1D, bords prolongés par la valeur la plus proche  */
function gaussianFilter(values: number[], sigma: number): number[] {
	const radius = Math.ceil(4 * sigma);
	const kernel = Array.from({ length: 2 * radius + 1 }, (_, i) =>
		Math.exp(-((i - radius) ** 2) / (2 * sigma ** 2))
	);
	const sum = kernel.reduce((a, b) => a + b, 0);
	return values.map(
		(_, i) =>
			kernel.reduce((acc, weight, k) => {
				const j = Math.min(values.length - 1, Math.max(0, i + k - radius));
				return acc + values[j] * weight;
			}, 0) / sum
	);
}

/*  Interpolation linéaire de `values` (définies aux abscisses croissantes `xs`) en `x`  */
function interpolate(x: number, xs: number[], values: number[]): number {
	let i = 1;
	while (i < xs.length - 1 && xs[i] < x) i++;
	const t = xs[i] === xs[i - 1] ? 0 : (x - xs[i - 1]) / (xs[i] - xs[i - 1]);
	return values[i - 1] + t * (values[i] - values[i - 1]);
}

/*  Lisse le chemin pixel par pixel et le rééchantillonne à intervalles réguliers  */
function smooth(pixels: Point[], start: Point, end: Point): Point[] {
	const xs = gaussianFilter(
		pixels.map((p) => p.x),
		SMOOTHING
	);
	const ys = gaussianFilter(
		pixels.map((p) => p.y),
		SMOOTHING
	);

	const distances = [0];
	for (let i = 1; i < xs.length; i++) {
		distances.push(distances[i - 1] + Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1]));
	}
	const length = distances.at(-1)!;
	const count = Math.max(2, Math.round(length / POINT_SPACING));
	const points = Array.from({ length: count }, (_, i) => {
		const d = (length * i) / (count - 1);
		return { x: interpolate(d, distances, xs), y: interpolate(d, distances, ys) };
	});

	// Le chemin part et arrive exactement sur les positions des marqueurs
	return [start, ...points.slice(1, -1), end];
}

/*  Courbe passant par tous les points (Catmull-Rom convertie en Bézier cubiques)  */
function toSvgPath(points: Point[]): string {
	const commands = [`M ${points[0].x.toFixed(0)} ${points[0].y.toFixed(0)}`];
	for (let i = 0; i < points.length - 1; i++) {
		const p0 = points[Math.max(i - 1, 0)];
		const p1 = points[i];
		const p2 = points[i + 1];
		const p3 = points[Math.min(i + 2, points.length - 1)];
		const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
		const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
		commands.push(
			`C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(0)} ${p2.y.toFixed(0)}`
		);
	}
	return commands.join(' ');
}

function findRoute(roads: RoadMap, cost: Float64Array, route: Route): Point[] {
	const start = markers[route.start];
	const end = markers[route.end];
	const pixels = shortestPath(roads, cost, snapToRoad(roads, start), snapToRoad(roads, end));
	return smooth(pixels, start, end);
}

/*  Carte avec les grands axes en bleu, les itinéraires en rose et les positions nommées  */
async function drawPreview(roads: RoadMap, paths: Record<string, string>): Promise<void> {
	const mainRoadOverlay = Buffer.alloc(roads.width * roads.height * 4);
	roads.mainRoad.forEach((isMainRoad, i) => {
		if (isMainRoad) mainRoadOverlay.set([0, 120, 255, 128], i * 4);
	});

	const routes = Object.values(paths)
		.map((d) => `<path d="${d}" fill="none" stroke="#ff2e88" stroke-width="4"/>`)
		.join('');
	const positions = Object.entries(markers)
		.map(
			([name, { x, y }]) =>
				`<circle cx="${x}" cy="${y}" r="8" fill="#0c0819"/>` +
				`<text x="${x + 12}" y="${y + 5}" font-family="sans-serif" font-size="16" fill="#0c0819">${name}</text>`
		)
		.join('');
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${roads.width}" height="${roads.height}">${routes}${positions}</svg>`;

	await sharp(MAP_IMAGE)
		.composite([
			{ input: mainRoadOverlay, raw: { width: roads.width, height: roads.height, channels: 4 } },
			{ input: Buffer.from(svg) }
		])
		.png()
		.toFile(PREVIEW_FILE);
}

async function main(): Promise<void> {
	const roads = await loadRoads();
	const cost = roadCost(roads);

	const paths: Record<string, string> = {};
	for (const route of itineraryRoutes()) {
		paths[route.name] = toSvgPath(findRoute(roads, cost, route));
	}

	await writeFile(ROUTES_FILE, JSON.stringify(paths, null, '\t') + '\n');
	await drawPreview(roads, paths);
	console.log(
		`${Object.keys(paths).length} itinéraire(s) écrit(s) dans ${relative(ROOT, ROUTES_FILE)}`
	);
	console.log(`Contrôle visuel : ${relative(ROOT, PREVIEW_FILE)}`);
}

await main();
