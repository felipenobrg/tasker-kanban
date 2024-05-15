export type AxiosError  = {
  code: string
  response: {
    data: {
      error: boolean
      message: string
    }
  }
} 