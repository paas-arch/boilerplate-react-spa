import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { createNote, noteKeys } from '@/entities/note'
import { Alert, AlertDescription, Button, Label, Textarea } from '@/shared/ui'
import { noteCreateSchema, type NoteCreateValues } from '../model/schema'

export function NoteCreateForm() {
  const queryClient = useQueryClient()
  const form = useForm<NoteCreateValues>({
    resolver: zodResolver(noteCreateSchema),
    defaultValues: { text: '' },
  })
  const create = useMutation({
    mutationFn: (values: NoteCreateValues) => createNote(values.text),
    onSuccess: async () => {
      form.reset()
      await queryClient.invalidateQueries({ queryKey: noteKeys.list })
    },
  })
  const error = form.formState.errors.text?.message

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) => create.mutate(values))}
      className="grid gap-3"
    >
      <div className="grid gap-2">
        <Label htmlFor="note-text">Новая заметка</Label>
        <Textarea
          id="note-text"
          rows={3}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'note-text-error' : undefined}
          {...form.register('text')}
        />
        {error ? (
          <p id="note-text-error" role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </div>
      {create.isError ? (
        <Alert variant="destructive">
          <AlertDescription>{create.error.message}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={create.isPending} className="justify-self-start">
        {create.isPending ? 'Сохраняем…' : 'Добавить'}
      </Button>
    </form>
  )
}
