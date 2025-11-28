const base_url = import.meta.env.PUBLIC_BACKEND_BASE_URL;

class UnauthorizedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UnauthorizedError";
	}
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
	const response = await fetch(`${base_url}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers
		},
		credentials: "include"
	});

	if (!response.ok) {
		if (response.status === 401) {
			try {
				const errorDetail = await response.json();
				throw new UnauthorizedError(errorDetail.message || "Unauthorized");
			} catch (e) {
				throw new UnauthorizedError("Unauthorized");
			}
		}

		console.error(`API request failed: ${response.status} ${response.statusText}`);
		throw new Error(`API request failed: ${response.status} ${response.statusText}`);
	}

	if (response.status === 204) {
		return {} as T;
	}

	return response.json();
}
