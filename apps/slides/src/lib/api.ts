import { API_MODE } from '$app/env/public';

export const apiAvailable = API_MODE === 'live';
