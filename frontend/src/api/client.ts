export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiError'
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
