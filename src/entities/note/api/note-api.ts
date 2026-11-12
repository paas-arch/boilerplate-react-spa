import { apiRequest, type ApiSchemas } from '@/shared/api'

export type Note = ApiSchemas['Note']

export const noteKeys = {
  list: ['notes'] as const,
}

export async function listNotes(signal?: AbortSignal): Promise<Note[]> {
  const data = await apiRequest<ApiSchemas['NotesResponse']>('/api/v1/notes.get', { signal })
  return data.notes
}

export function createNote(text: string): Promise<Note> {
  return apiRequest<Note>('/api/v1/notes.create', {
    method: 'POST',
    body: { text } satisfies ApiSchemas['NoteCreateRequest'],
  })
}
