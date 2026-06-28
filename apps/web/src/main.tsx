import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { initSentry } from './lib/sentry'
import './lib/speech'   // initialize __speech debug global
import './index.css'

initSentry()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('./routes/splash'),
  },
  {
    path: '/game',
    lazy: () => import('./routes/game'),
  },
  {
    path: '/lobby',
    lazy: () => import('./routes/lobby'),
  },
  {
    path: '/room/:roomId',
    lazy: () => import('./routes/room'),
  },
  {
    path: '/dashboard',
    lazy: () => import('./routes/dashboard'),
  },
  {
    path: '/leaderboard',
    lazy: () => import('./routes/leaderboard'),
  },
  {
    path: '/achievements',
    lazy: () => import('./routes/achievements'),
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
