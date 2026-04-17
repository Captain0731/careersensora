import { TOKEN_KEY } from './session';

export { TOKEN_KEY };

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
		public data?: unknown
	) {
		super(message);
		this.name = 'ApiError';
	}
}

/**
 * Calls `/api/v1/*` on the same origin. `next.config.ts` rewrites that path to Django
 * (`BACKEND_URL`, default http://127.0.0.1:8000). Restart `next dev` after changing `.env.local`.
 */
function apiV1Prefix(): string {
	return '/api/v1';
}

export type ApiRequestInit = RequestInit & { skipAuth?: boolean };

async function request<T>(endpoint: string, options: ApiRequestInit = {}): Promise<T> {
	const { skipAuth, ...rest } = options;
	const headers = new Headers(rest.headers);

	if (!headers.has('Content-Type') && !(rest.body instanceof FormData)) {
		headers.set('Content-Type', 'application/json');
	}

	if (!skipAuth && typeof window !== 'undefined') {
		const token = window.localStorage.getItem(TOKEN_KEY);
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}
	}

	const config: RequestInit = {
		...rest,
		headers,
	};

	const url = `${apiV1Prefix()}${endpoint}`;

	try {
		const response = await fetch(url, config);

		let data: unknown;
		try {
			data = await response.json();
		} catch {
			data = null;
		}

		if (!response.ok) {
			if (response.status === 401 && typeof window !== 'undefined') {
				window.localStorage.removeItem(TOKEN_KEY);
				window.location.href = '/get-access';
			}
			const errData = data as { detail?: string } | null;
			throw new ApiError(response.status, errData?.detail || 'An error occurred', data);
		}

		return data as T;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new Error(error instanceof Error ? error.message : 'Network error');
	}
}

export const apiClient = {
	get: <T>(endpoint: string, options?: ApiRequestInit) => request<T>(endpoint, { ...options, method: 'GET' }),
	post: <T>(endpoint: string, body: unknown, options?: ApiRequestInit) =>
		request<T>(endpoint, {
			...options,
			method: 'POST',
			body: body instanceof FormData ? body : JSON.stringify(body),
		}),
	put: <T>(endpoint: string, body: unknown, options?: ApiRequestInit) =>
		request<T>(endpoint, {
			...options,
			method: 'PUT',
			body: body instanceof FormData ? body : JSON.stringify(body),
		}),
	patch: <T>(endpoint: string, body: unknown, options?: ApiRequestInit) =>
		request<T>(endpoint, {
			...options,
			method: 'PATCH',
			body: body instanceof FormData ? body : JSON.stringify(body),
		}),
	delete: <T>(endpoint: string, options?: ApiRequestInit) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};
