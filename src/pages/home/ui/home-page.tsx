import { Fragment, useState, type ReactNode } from 'react'
import { ArrowUpRight, Copy, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from 'cn'
import { Button, ToggleGroup, ToggleGroupItem } from '@/shared/ui'
import logoUrl from './paas-logo.svg'

const PAAS_URL = 'https://paas.tech'
const PANEL_URL = 'https://app.paas.tech'
const DOCS_URL = 'https://docs.paas.tech'
const FSD_DOCS_URL = 'https://fsd.how'

const stack = [
  ['React', 'React', 'https://react.dev'],
  ['Vite', 'Vite', 'https://vite.dev'],
  ['TypeScript', 'TypeScript', 'https://www.typescriptlang.org'],
  ['Feature-Sliced Design', 'FSD', FSD_DOCS_URL],
]

const prompts = [
  [
    'Кофейня',
    'Замени стартовую страницу на сайт кофейни «Зерно» на Покровке: меню с ценами, фото зала, часы работы и кнопка «Забронировать столик». Тёплые цвета, крупная типографика, всё на русском.',
  ],
  [
    'Портфолио',
    'Замени стартовую страницу на портфолио фотографа: сетка лучших работ, страница «Обо мне», цены на съёмку и кнопка «Записаться на съёмку». Светлый минималистичный стиль, всё на русском.',
  ],
  [
    'Запись к мастеру',
    'Замени стартовую страницу на сайт барбершопа «Бритва»: услуги с ценами и длительностью, выбор мастера, свободное время на неделю и форма записи. Строгий тёмный стиль, всё на русском.',
  ],
]

const steps = [
  ['Вставьте промпт в агента', 'Он перепишет страницу и сам проверит, что всё собирается.'],
  ['Скажите «закоммить и запушь»', 'Панель увидит новый код в main и соберёт версию.'],
  ['Нажмите «Раскатить» в панели', 'Через минуту по этому адресу откроется новая версия.'],
]

// Третий элемент — признак скила: у скилов в списке стоит «/».
const toolkit: [string, string, boolean?][] = [
  [
    'AGENTS.md',
    'Правила для любого агента: что нельзя трогать, куда класть код и как с вами общаться.',
  ],
  [
    'frontend-design',
    'Помогает выбрать шрифты, цвета и раскладку, чтобы сайт не выглядел шаблонным.',
    true,
  ],
  ['shadcn', 'Добавляет и настраивает готовые компоненты: кнопки, формы, окна.', true],
  ['feature-sliced-design', 'Подсказывает, в какой слой положить новый экран или функцию.', true],
  [
    'webapp-testing',
    'Открывает сайт в браузере, проверяет, что всё работает, и снимает скриншоты.',
    true,
  ],
  [
    'yarn verify',
    'Проверки, которые агент запускает сам, прежде чем сказать «готово»: линтер, структура кода, тесты, сборка.',
  ],
]

const layers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.93em] text-foreground">
      {children}
    </code>
  )
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-muted-foreground hover:text-foreground hover:underline"
    >
      {children}
    </a>
  )
}

function PromptCard() {
  const [example, setExample] = useState(prompts[0][0])
  const prompt = prompts.find(([name]) => name === example)![1]

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt)
      toast.success('Промпт скопирован')
    } catch {
      // Буфер обмена недоступен на сайтах без https: текст можно выделить и скопировать вручную.
      toast.error('Не удалось скопировать. Выделите текст промпта и скопируйте вручную.')
    }
  }

  return (
    <section className="rounded-[14px] bg-linear-to-r from-brand to-brand-secondary p-px shadow-[0_24px_80px] shadow-brand/10">
      <div className="overflow-hidden rounded-[13px] bg-card">
        <div className="flex flex-col gap-3 border-b px-4 py-3.5 lg:flex-row lg:items-center lg:justify-between lg:px-5">
          <p className="flex items-center gap-2.5 font-mono text-xs text-subtle-foreground">
            <Sparkles className="size-3.5 text-brand" />
            <span className="lg:hidden">первый промпт для агента</span>
            <span className="max-lg:hidden">
              первый промпт · вставьте в Claude Code, Codex или Cursor
            </span>
          </p>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            spacing={1.5}
            value={example}
            onValueChange={(value) => value && setExample(value)}
            aria-label="Пример промпта"
          >
            {prompts.map(([name]) => (
              <ToggleGroupItem
                key={name}
                value={name}
                className="h-auto rounded-full px-2.5 py-1 text-xs font-normal data-[state=off]:text-subtle-foreground"
              >
                {name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="flex gap-3 px-4 pt-5 pb-[18px] lg:gap-5 lg:px-7 lg:pt-7 lg:pb-6">
          <span className="font-mono text-[17px] text-brand lg:text-[22px]">&gt;</span>
          <p className="text-[17px]/[25px] lg:text-[22px]/8">{prompt}</p>
        </div>

        <div className="flex flex-col gap-3.5 px-4 pb-4 lg:flex-row lg:items-center lg:justify-between lg:pr-5 lg:pb-5 lg:pl-7">
          <p className="font-mono text-xs/[18px] text-subtle-foreground">
            агент сам найдёт src/pages/home и правила в AGENTS.md
          </p>
          <Button onClick={() => void copyPrompt()}>
            <Copy data-icon="inline-start" />
            Скопировать промпт
          </Button>
        </div>
      </div>
    </section>
  )
}

// Стартовая страница шаблона: замени её первой страницей приложения.
export function HomePage() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-brand to-brand-secondary" />
      <div className="pointer-events-none absolute -top-[340px] -left-[120px] size-[760px] bg-radial from-brand/15 to-transparent to-70% lg:-top-[380px] lg:left-1/2 lg:h-[346px] lg:w-[843px]" />

      <div className="relative mx-auto flex w-full max-w-[1240px] flex-1 flex-col px-5">
        <header className="flex h-16 shrink-0 items-center justify-between lg:h-[88px]">
          <img src={logoUrl} alt="PaaS" width={109} height={24} />
          <p className="font-mono text-xs text-subtle-foreground">
            <span className="text-muted-foreground">{window.location.hostname}</span>
            <span className="max-lg:hidden"> / шаблон Frontend</span>
          </p>
        </header>

        <main className="flex flex-1 flex-col gap-14 pt-7 pb-10 lg:gap-[72px] lg:pt-12 lg:pb-6">
          <div className="flex flex-col gap-9 lg:gap-14">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-[18px] lg:max-w-[760px] lg:gap-6">
                <h1 className="text-[56px]/[56px] font-semibold tracking-[-2px] lg:text-[120px]/[114px] lg:tracking-[-5px]">
                  Hello World
                </h1>
                <p className="text-base/[25px] text-muted-foreground lg:max-w-[560px] lg:text-[17px]/[26px]">
                  Сайт уже открывается по этому адресу. Расскажите ИИ-агенту, какой сайт вам нужен,
                  и он заменит эту страницу вашей.
                </p>
              </div>
              <div className="flex gap-3 *:max-lg:flex-1">
                <Button asChild variant="secondary" size="lg">
                  <a href={PANEL_URL} target="_blank" rel="noreferrer">
                    Открыть панель
                    <ArrowUpRight data-icon="inline-end" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href={DOCS_URL} target="_blank" rel="noreferrer">
                    Документация
                  </a>
                </Button>
              </div>
            </div>

            <PromptCard />

            <ol className="flex flex-col lg:flex-row lg:gap-6">
              {steps.map(([title, note], index) => (
                <li
                  key={title}
                  className="flex flex-1 gap-4 border-t py-[18px] lg:flex-col lg:gap-3.5 lg:pt-5 lg:pb-0"
                >
                  <span
                    className={cn(
                      'w-10 text-[28px] font-light tracking-[-1px] text-subtle-foreground lg:text-[40px]',
                      index === 0 && 'text-brand',
                    )}
                  >
                    0{index + 1}
                  </span>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-[17px] font-medium">{title}</span>
                    <span className="text-sm/[21px] text-muted-foreground">{note}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
            <section className="flex min-w-0 flex-1 flex-col gap-6">
              <div className="flex flex-col gap-2">
                <p className="font-mono text-xs text-subtle-foreground">уже в репозитории</p>
                <h2 className="text-xl font-semibold tracking-[-0.3px]">
                  Агент знает, как здесь всё устроено
                </h2>
                <p className="text-sm/[22px] text-muted-foreground">
                  Фреймворк и устройство проекта агент узнает из этих файлов, прежде чем начнёт
                  писать код.
                </p>
              </div>
              <ul className="flex flex-col divide-y rounded-lg border">
                {toolkit.map(([term, description, isSkill]) => (
                  <li key={term} className="flex flex-col gap-1.5 px-4 py-3.5 lg:flex-row lg:gap-5">
                    <span className="flex gap-2 font-mono text-[13px] lg:w-[180px] lg:shrink-0">
                      {isSkill ? <span className="text-brand">/</span> : null}
                      {term}
                    </span>
                    <span className="text-[13px]/5 text-muted-foreground">{description}</span>
                  </li>
                ))}
              </ul>
              <p className="flex flex-wrap items-center gap-x-1.5 gap-y-2 font-mono text-xs text-subtle-foreground">
                <span className="text-brand">/</span> скилы для Claude Code и Codex лежат в
                <InlineCode>.agents/skills</InlineCode> и <InlineCode>.claude/skills</InlineCode>
              </p>
            </section>

            <section className="flex flex-col gap-4 lg:w-[340px] lg:shrink-0 lg:pt-6">
              <h3 className="text-sm font-medium">Архитектура Feature-Sliced Design</h3>
              <ul className="flex flex-col gap-1.5 overflow-hidden rounded-lg border font-mono text-[13px]">
                {layers.map((layer) => (
                  <li
                    key={layer}
                    className={cn(
                      'flex h-10 items-center justify-center text-muted-foreground',
                      layer === 'pages' && 'bg-brand/10 text-brand',
                    )}
                  >
                    {layer}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col items-center gap-2.5">
                <p className="font-mono text-xs text-subtle-foreground">
                  слой берёт код только из слоёв ниже
                </p>
                <a
                  href={FSD_DOCS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
                >
                  Документация FSD
                  <ArrowUpRight className="size-[15px]" />
                </a>
              </div>
            </section>
          </div>
        </main>

        <footer className="flex shrink-0 flex-col gap-2.5 border-t py-5 font-mono text-xs text-subtle-foreground lg:h-[72px] lg:flex-row lg:items-center lg:justify-between lg:py-0">
          <p>
            {stack.map(([name, short, href], index) => (
              <Fragment key={name}>
                {index > 0 ? ' · ' : null}
                <FooterLink href={href}>
                  <span className="lg:hidden">{short}</span>
                  <span className="max-lg:hidden">{name}</span>
                </FooterLink>
              </Fragment>
            ))}
          </p>
          <p>
            Раскатано в <FooterLink href={PAAS_URL}>PaaS</FooterLink>
          </p>
        </footer>
      </div>
    </div>
  )
}
