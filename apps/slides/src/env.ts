import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	API_MODE: {
		public: true,
		static: true,
		description: 'Enable local authentication demos (live) or disable them (offline).',
		schema: (value): 'live' | 'offline' => {
			if (value === undefined) return 'live';
			if (value === 'live' || value === 'offline') return value;
			throw new Error('API_MODE must be "live" or "offline"');
		}
	}
});
