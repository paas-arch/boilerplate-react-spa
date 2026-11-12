import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function mockFetch() {
  const fetchMock = vi.fn<typeof fetch>()
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const note = { id: 1, text: 'первая заметка', createdAt: '2026-11-12T10:00:00Z' }

describe('заметки', () => {
  it('показывает заметки от бэкенда', async () => {
    const fetchMock = mockFetch().mockResolvedValue(jsonResponse({ notes: [note] }))
    window.history.replaceState({}, '', '/')
    render(<App />)

    expect(await screen.findByText('первая заметка')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith('/api/v1/notes.get', expect.anything())
  })

  it('добавляет заметку и перечитывает список', async () => {
    const fetchMock = mockFetch()
      .mockResolvedValueOnce(jsonResponse({ notes: [] }))
      .mockResolvedValueOnce(jsonResponse(note))
      .mockResolvedValueOnce(jsonResponse({ notes: [note] }))
    const user = userEvent.setup()
    window.history.replaceState({}, '', '/')
    render(<App />)

    expect(await screen.findByText('Заметок пока нет.')).toBeInTheDocument()
    await user.type(screen.getByLabelText('Новая заметка'), '  первая заметка  ')
    await user.click(screen.getByRole('button', { name: 'Добавить' }))

    expect(await screen.findByText('первая заметка')).toBeInTheDocument()
    expect(fetchMock.mock.calls[1][0]).toBe('/api/v1/notes.create')
    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body))).toEqual({ text: 'первая заметка' })
  })

  it('не отправляет пустую заметку', async () => {
    const fetchMock = mockFetch().mockResolvedValue(jsonResponse({ notes: [] }))
    const user = userEvent.setup()
    window.history.replaceState({}, '', '/')
    render(<App />)

    await screen.findByText('Заметок пока нет.')
    await user.click(screen.getByRole('button', { name: 'Добавить' }))

    expect(await screen.findByText('Введите текст заметки')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('показывает текст ошибки бэкенда', async () => {
    mockFetch().mockResolvedValue(
      jsonResponse({ status: 'error', message: 'База недоступна' }, 500),
    )
    window.history.replaceState({}, '', '/')
    render(<App />)

    expect(
      await screen.findByText('Не удалось загрузить заметки: База недоступна'),
    ).toBeInTheDocument()
  })
})
