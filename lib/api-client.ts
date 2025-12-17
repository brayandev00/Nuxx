import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

interface RequestOptions extends RequestInit {
    data?: any
    params?: Record<string, string>
}

class ApiClient {
    private async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { data, params, headers, ...customConfig } = options

        const token = localStorage.getItem("token")

        // Build URL with query params
        const url = new URL(`${API_URL}${endpoint}`)
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, value)
                }
            })
        }

        const config: RequestInit = {
            ...customConfig,
            headers: {
                ...(data instanceof FormData ? {} : { "Content-Type": "application/json" }),
                ...(token && { Authorization: `Bearer ${token}` }),
                ...headers,
            },
            body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
        }

        try {
            const response = await fetch(url.toString(), config)

            // Handle 401 Unauthorized globally
            if (response.status === 401) {
                localStorage.removeItem("token")
                localStorage.removeItem("nuux_session")
                // Only redirect if not already on login page to avoid loops
                if (!window.location.pathname.startsWith("/login")) {
                    window.location.href = "/login"
                }
                throw new Error("Sesión expirada")
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: response.statusText }))
                throw new Error(errorData.detail || "Error en la petición")
            }

            // Handle empty responses (like 204 No Content)
            if (response.status === 204) {
                return {} as T
            }

            return await response.json()
        } catch (error: any) {
            console.error(`API Error [${endpoint}]:`, error)
            const message = error.message || "Error de conexión con el servidor"
            // Don't toast for session expired as it handles redirect
            if (message !== "Sesión expirada") {
                toast.error(message)
            }
            throw error
        }
    }

    get<T = any>(endpoint: string, params?: Record<string, string>) {
        return this.request<T>(endpoint, { method: "GET", params })
    }

    post<T = any>(endpoint: string, data?: any) {
        return this.request<T>(endpoint, { method: "POST", data })
    }

    put<T = any>(endpoint: string, data?: any) {
        return this.request<T>(endpoint, { method: "PUT", data })
    }

    delete<T = any>(endpoint: string) {
        return this.request<T>(endpoint, { method: "DELETE" })
    }

    patch<T = any>(endpoint: string, data?: any) {
        return this.request<T>(endpoint, { method: "PATCH", data })
    }
}

export const apiClient = new ApiClient()
