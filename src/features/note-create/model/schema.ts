import { z } from 'zod'

// Тот же предел, что проверяет бэкенд: ошибка видна до запроса.
export const noteCreateSchema = z.object({
  text: z.string().trim().min(1, 'Введите текст заметки').max(500, 'Не больше 500 знаков'),
})

export type NoteCreateValues = z.infer<typeof noteCreateSchema>
