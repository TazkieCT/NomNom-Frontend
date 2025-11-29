export interface User {
  id: string
  username: string
  email: string
  role: 'customer' | 'seller'
}

export function getToken(): string | null {
  return localStorage.getItem('token')
}

export function getUser(): User | null {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function logout(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function getAuthHeader(): Record<string, string> {
  const token = getToken()
  if (!token) return {}
  return {
    'Authorization': `Bearer ${token}`
  }
}

export function isTokenExpired(): boolean {
  const token = getToken()
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiry = payload.exp * 1000
    return Date.now() >= expiry
  } catch {
    return true
  }
}
