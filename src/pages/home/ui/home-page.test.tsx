import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { HomePage } from './home-page'

describe('карточка первого промпта', () => {
  it('переключает пример и копирует выбранный промпт', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    expect(screen.getByText(/кофейни «Зерно»/)).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Портфолио' }))
    expect(screen.getByText(/портфолио фотографа/)).toBeInTheDocument()
    expect(screen.queryByText(/кофейни «Зерно»/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Скопировать промпт' }))
    expect(await navigator.clipboard.readText()).toMatch(/^Замени стартовую страницу на портфолио/)
  })
})
