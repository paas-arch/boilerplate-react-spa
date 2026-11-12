import { useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApiError } from '@/shared/api'

// Повторяем только сбои сети: ответ бэкенда с ошибкой показываем сразу, повтор его не изменит.
const retryNetworkErrors = (failureCount: number, error: Error) =>
  !(error instanceof ApiError) && failureCount < 2

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false, retry: retryNetworkErrors },
          mutations: { retry: false },
        },
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
