import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

// Запросы к бэкенду в тестах подменяй так: vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response(...)))
describe('приложение', () => {
  it('открывает стартовую страницу', async () => {
    window.history.replaceState({}, '', '/')
    render(<App />)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Hello World' }),
    ).toBeInTheDocument()
  })

  it('неизвестный адрес ведёт на стартовую страницу', async () => {
    window.history.replaceState({}, '', '/net-takoy-stranitsy')
    render(<App />)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Hello World' }),
    ).toBeInTheDocument()
    expect(window.location.pathname).toBe('/')
  })
})
