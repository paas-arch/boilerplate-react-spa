import { Spinner } from './spinner'

export function PageLoader() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6" aria-live="polite">
      <Spinner className="size-6 text-muted-foreground" />
      <span className="sr-only">Загрузка…</span>
    </main>
  )
}
