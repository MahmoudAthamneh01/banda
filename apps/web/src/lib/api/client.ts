function getApiBase() {
    const fallback = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001/api';
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || fallback).replace(/\/$/, '');

    if (!apiBase) {
        throw new Error('NEXT_PUBLIC_API_URL is required when running the production web app');
    }

    return apiBase;
}

interface ApiOptions extends RequestInit {
    token?: string;
}

export class ApiClient {
    private static async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
        const { token, headers, ...rest } = options;

        // Auto-inject token from localStorage if client-side and not provided
        let authToken = token;
        if (!authToken && typeof window !== 'undefined') {
            authToken = localStorage.getItem('token') || undefined;
        }

        const defaultHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        };

        const config: RequestInit = {
            headers: { ...defaultHeaders, ...headers },
            ...rest,
        };

        try {
            const res = await fetch(`${getApiBase()}${endpoint}`, config);

            if (!res.ok) {
                // Handle 401/403 specifically if needed (e.g., redirect to login)
                const errorData = await res.json().catch(() => ({}));
                const message =
                    errorData.error?.message ||
                    errorData.message ||
                    (typeof errorData.error === 'string' ? errorData.error : undefined) ||
                    `API Error: ${res.status}`;
                throw new Error(message);
            }

            return res.json() as Promise<T>;
        } catch (error) {
            console.error(`API Call Failed: ${endpoint}`, error);
            throw error;
        }
    }

    static get<T>(endpoint: string, options?: ApiOptions) {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    static post<T>(endpoint: string, body: any, options?: ApiOptions) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    static patch<T>(endpoint: string, body: any, options?: ApiOptions) {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body)
        });
    }
}
