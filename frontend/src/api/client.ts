export const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  status?: number
  fieldErrors: Record<string, string[]> = {}

  constructor(message: string, status?: number, fieldErrors: Record<string, string[]> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
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

const defaultMessages: Record<number, string> = {
  400: 'Please check the submitted values.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  502: 'The identity provider is unavailable. Please try again.',
}

const parseError = async (response: Response): Promise<ApiError> => {
  const fallback = defaultMessages[response.status] ?? 'Request failed'
  const text = await response.text()
  let data: unknown = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = null
  }
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const record = data as Record<string, unknown>
    if (typeof record.detail === 'string') {
      return new ApiError(record.detail, response.status)
    }
    const fieldErrors: Record<string, string[]> = {}
    for (const [field, value] of Object.entries(record)) {
      if (Array.isArray(value)) fieldErrors[field] = value.map(String)
      else if (typeof value === 'string') fieldErrors[field] = [value]
    }
    return new ApiError(Object.values(fieldErrors)[0]?.[0] ?? fallback, response.status, fieldErrors)
  }
  return new ApiError(fallback, response.status)
}

export const requestJson = async <T>(input: string, init: RequestInit, auth: AuthTokenAdapter): Promise<T> => {
  const response = await authFetch(input, init, auth)
  if (!response.ok) {
    throw await parseError(response)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}
