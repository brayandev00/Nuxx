const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiRequestOptions extends RequestInit {
    data?: any;
}

export async function apiRequest<T = any>(
    endpoint: string,
    method: RequestMethod = 'GET',
    options: ApiRequestOptions = {}
): Promise<T> {
    const { data, headers, ...customConfig } = options;

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        ...customConfig,
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);

        if (!response.ok) {
            // Handle specific error status codes here if needed
            const errorBody = await response.text();
            throw new Error(`API Error: ${response.status} - ${errorBody || response.statusText}`);
        }

        // Check if response has content before parsing
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json() as Promise<T>;
        } else {
            // Return text or null depending on what you expect from void endpoints
            return (await response.text()) as unknown as T;
        }
    } catch (error) {
        console.error('API Request Failed:', error);
        throw error;
    }
}

export const api = {
    get: <T>(endpoint: string, options?: ApiRequestOptions) => apiRequest<T>(endpoint, 'GET', options),
    post: <T>(endpoint: string, data: any, options?: ApiRequestOptions) => apiRequest<T>(endpoint, 'POST', { ...options, data }),
    put: <T>(endpoint: string, data: any, options?: ApiRequestOptions) => apiRequest<T>(endpoint, 'PUT', { ...options, data }),
    delete: <T>(endpoint: string, options?: ApiRequestOptions) => apiRequest<T>(endpoint, 'DELETE', options),
    patch: <T>(endpoint: string, data: any, options?: ApiRequestOptions) => apiRequest<T>(endpoint, 'PATCH', { ...options, data }),
};
