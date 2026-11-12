import { useState } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { HomePage } from '@/pages/home'

// Новая страница — новый маршрут здесь; адреса под /api заняты бэкендом.
const routes = [
  { path: '/', element: <HomePage /> },
  { path: '*', element: <Navigate to="/" replace /> },
]

export function AppRouter() {
  const [router] = useState(() => createBrowserRouter(routes))
  return <RouterProvider router={router} />
}
