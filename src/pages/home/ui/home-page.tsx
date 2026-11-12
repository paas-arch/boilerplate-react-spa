import { useQuery } from '@tanstack/react-query'
import { listNotes, noteKeys } from '@/entities/note'
import { NoteCreateForm } from '@/features/note-create'
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageLoader,
} from '@/shared/ui'

const dateFormat = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium', timeStyle: 'short' })

// Страница-пример: ходит в бэкенд из шаблона go-backend. Замени её своей.
export function HomePage() {
  const notes = useQuery({ queryKey: noteKeys.list, queryFn: ({ signal }) => listNotes(signal) })

  return (
    <main className="mx-auto grid w-full max-w-2xl gap-6 p-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Заметки</CardTitle>
          <CardDescription>Пример: страница читает и пишет данные через бэкенд.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <NoteCreateForm />
          {notes.isPending ? <PageLoader /> : null}
          {notes.isError ? (
            <Alert variant="destructive">
              <AlertDescription className="grid gap-3">
                <span>Не удалось загрузить заметки: {notes.error.message}</span>
                <Button
                  type="button"
                  variant="outline"
                  className="justify-self-start"
                  onClick={() => void notes.refetch()}
                >
                  Повторить
                </Button>
              </AlertDescription>
            </Alert>
          ) : null}
          {notes.isSuccess && notes.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">Заметок пока нет.</p>
          ) : null}
          {notes.isSuccess && notes.data.length > 0 ? (
            <ul className="grid gap-3">
              {notes.data.map((note) => (
                <li key={note.id} className="rounded-md border p-3">
                  <p className="whitespace-pre-wrap break-words">{note.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {dateFormat.format(new Date(note.createdAt))}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>
    </main>
  )
}
