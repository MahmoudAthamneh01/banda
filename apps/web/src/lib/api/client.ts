const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
            const res = await fetch(`${API_BASE}${endpoint}`, config);

            if (!res.ok) {
                // Handle 401/403 specifically if needed (e.g., redirect to login)
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `API Error: ${res.status}`);
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
}
