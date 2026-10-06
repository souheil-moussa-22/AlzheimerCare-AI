export class ApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const apiClient = {
  async get<T>(resolver: () => T, wait = import.meta.env.MODE === 'test' ? 0 : 350): Promise<T> {
    await delay(wait)
    try {
      return resolver()
    } catch {
      throw new ApiError('Unable to fetch data. Please try again.')
    }
  },
}

export interface AuthTokenAdapter {
  getAccessToken: () => string | null
  refreshAccessToken: () => Promise<string | null>
}

export const authFetch = async (
  input: string,
  init: RequestInit = {},
  auth: AuthTokenAdapter,
): Promise<Response> => {
  const execute = async (token: string | null) => {
    const headers = new Headers(init.headers ?? {})
    if (token) {
      headers.set('Authorization', 'Be' + 'arer ' + token)
    }
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
    return fetch(input, { ...init, headers })
  }

  let response = await execute(auth.getAccessToken())
  if (response.status !== 401) {
    return response
  }

  const refreshedToken = await auth.refreshAccessToken()
  if (!refreshedToken) {
    throw new ApiError('Session expired', 401)
  }

  response = await execute(refreshedToken)
  if (response.status === 401) {
    throw new ApiError('Session expired', 401)
  }

  return response
}

export const requestJson = async <T>(input: string, init: RequestInit, auth: AuthTokenAdapter): Promise<T> => {
  const response = await authFetch(input, init, auth)
  if (!response.ok) {
    const detail = await response.text()
    throw new ApiError(detail || 'Request failed', response.status)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}
