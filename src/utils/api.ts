import { getAuthHeader, logout } from './auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requiresAuth = false, headers = {}, ...restOptions } = options

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  }

  if (requiresAuth) {
    Object.assign(requestHeaders, getAuthHeader())
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...restOptions,
      headers: requestHeaders,
    })

    const data = await response.json()

    if (response.status === 401) {
      logout()
      window.location.href = '/signin'
      throw new Error('Session expired. Please login again.')
    }

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`)
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An unexpected error occurred')
  }
}

export const api = {
  get: <T>(endpoint: string, requiresAuth = false) =>
    apiRequest<T>(endpoint, { method: 'GET', requiresAuth }),

  post: <T>(endpoint: string, body: any, requiresAuth = false) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      requiresAuth,
    }),

  put: <T>(endpoint: string, body: any, requiresAuth = false) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      requiresAuth,
    }),

  delete: <T>(endpoint: string, requiresAuth = false) =>
    apiRequest<T>(endpoint, { method: 'DELETE', requiresAuth }),
}
