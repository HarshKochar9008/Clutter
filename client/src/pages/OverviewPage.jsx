import { useEffect, useState } from 'react'
import {
  Calendar,
  Check,
  ChevronDown,
  FolderPlus,
  Hourglass,
  LayoutGrid,
  MessageSquare,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getTaskAnalytics, getTasks } from '../services/task.service'

const GANTT_BARS = [
  { id: 1, title: 'Sprint planning', range: 'Apr 23 – Apr 27', left: '8%', width: '22%', strip: 'bg-brand-yellow' },
  { id: 2, title: 'Design review', range: 'Apr 25 – Apr 30', left: '35%', width: '28%', strip: 'bg-brand-green' },
  { id: 3, title: 'API integration', range: 'May 1 – May 8', left: '58%', width: '32%', strip: 'bg-brand-pink' },
]

const MESSAGES = [
  { name: 'Alex M.', time: '12:45 PM', preview: 'Can we move the deadline to Friday?' },
  { name: 'Jordan K.', time: '11:02 AM', preview: 'Shared the new mockups in Figma.' },
  { name: 'Sam R.', time: 'Yesterday', preview: 'LGTM on the roadmap draft.' },
]

const TODAY_TASKS = [
  { title: 'Client call — Plant Pals', duration: '30 min', done: false, icon: 'call' },
  { title: 'Create sprint backlog', duration: '1 h', done: true, icon: 'doc' },
  { title: 'Review analytics export', duration: '45 min', done: false, icon: 'chart' },
]

const OverviewPage = () => {
  const [view, setView] = useState('timeline')
  const [stats, setStats] = useState({ upcoming: 0, progress: 0, done: 0 })

  useEffect(() => {
    const load = async () => {
      try {
        const [analytics, todoRes, progRes] = await Promise.all([
          getTaskAnalytics(),
          getTasks({ status: 'Todo', limit: 1, page: 1 }),
          getTasks({ status: 'In Progress', limit: 1, page: 1 }),
        ])
        setStats({
          upcoming: todoRes.pagination?.total ?? 0,
          progress: progRes.pagination?.total ?? 0,
          done: analytics.completed,
        })
      } catch {
        toast.error('Could not load overview stats')
        setStats({ upcoming: 40, progress: 24, done: 75 })
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-black md:text-4xl">
            Overview
          </h1>
          <p className="mt-1 text-sm text-black/70">
            Track projects, deadlines, and team momentum in one brutalist canvas.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-2xl border-2 border-black bg-brand-orange px-4 py-2.5 text-sm font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000]"
        >
          <FolderPlus size={18} strokeWidth={2.5} />
          Add New Project
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="relative overflow-hidden rounded-2xl border-2 border-black bg-white p-5">
          <Calendar className="absolute -right-2 -top-2 h-24 w-24 text-brand-pink/25" strokeWidth={1} />
          <p className="text-sm font-semibold text-black">Upcoming tasks</p>
          <p className="mt-2 font-display text-4xl font-bold text-black">{stats.upcoming}</p>
          <div className="mt-3 inline-block rounded-lg bg-brand-pink px-2 py-1 text-xs font-bold text-black">
            Todo
          </div>
        </article>
        <article className="relative overflow-hidden rounded-2xl border-2 border-black bg-white p-5">
          <Hourglass className="absolute -right-2 -top-2 h-24 w-24 text-brand-yellow/30" strokeWidth={1} />
          <p className="text-sm font-semibold text-black">In-progress</p>
          <p className="mt-2 font-display text-4xl font-bold text-black">{stats.progress}</p>
          <div className="mt-3 inline-block rounded-lg bg-brand-yellow px-2 py-1 text-xs font-bold text-black">
            Active
          </div>
        </article>
        <article className="relative overflow-hidden rounded-2xl border-2 border-black bg-white p-5">
          <Check className="absolute -right-2 -top-2 h-24 w-24 text-brand-green/25" strokeWidth={1} />
          <p className="text-sm font-semibold text-black">Completed</p>
          <p className="mt-2 font-display text-4xl font-bold text-black">{stats.done}</p>
          <div className="mt-3 inline-block rounded-lg bg-brand-green px-2 py-1 text-xs font-bold text-black">
            Done
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black"
            >
              Project Plant Pals
              <ChevronDown size={18} />
            </button>
            <div className="flex rounded-xl border-2 border-black bg-white p-1">
              <button
                type="button"
                onClick={() => setView('timeline')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                  view === 'timeline' ? 'bg-brand-orange text-black' : 'text-black/60'
                }`}
              >
                Timeline
              </button>
              <button
                type="button"
                onClick={() => setView('board')}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold ${
                  view === 'board' ? 'bg-brand-orange text-black' : 'text-black/60'
                }`}
              >
                <LayoutGrid size={14} />
                Board
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border-2 border-black bg-white p-4">
            <div className="mb-4 flex min-w-[640px] gap-2 border-b-2 border-black/10 pb-2 text-xs font-bold uppercase tracking-wider text-black/50">
              <span className="w-24 shrink-0">Month</span>
              <div className="flex flex-1 justify-between">
                <span>Apr</span>
                <span>May</span>
              </div>
            </div>
            <div className="relative min-h-[200px] min-w-[640px] rounded-xl bg-brand-cream/80">
              <div className="absolute inset-0 flex">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="flex-1 border-l border-dashed border-black/15 first:border-l-0"
                  />
                ))}
              </div>
              <div className="relative space-y-6 p-4 pt-8">
                {GANTT_BARS.map((bar) => (
                  <div key={bar.id} className="relative h-14">
                    <div
                      className="absolute top-0 h-full rounded-xl border-2 border-black bg-white shadow-[3px_3px_0_0_#000]"
                      style={{ left: bar.left, width: bar.width }}
                    >
                      <div className={`h-2 rounded-t-[10px] ${bar.strip}`} />
                      <div className="px-3 py-1.5">
                        <p className="text-xs font-bold text-black">{bar.title}</p>
                        <p className="text-[10px] font-medium text-black/60">{bar.range}</p>
                        <div className="mt-1 flex -space-x-1">
                          {['bg-brand-pink', 'bg-brand-yellow', 'bg-brand-green'].map((c) => (
                            <span
                              key={c}
                              className={`h-5 w-5 rounded-full border-2 border-black ${c}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border-2 border-black bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-black">Recent messages</h2>
              <button type="button" className="text-xs font-bold text-brand-orange underline">
                View all
              </button>
            </div>
            <ul className="divide-y-2 divide-black/10">
              {MESSAGES.map((m) => (
                <li key={m.name} className="flex gap-3 py-3 first:pt-0">
                  <span className="h-10 w-10 shrink-0 rounded-full border-2 border-black bg-brand-yellow" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-black">{m.name}</span>
                      <span className="text-[10px] font-medium text-black/50">{m.time}</span>
                    </div>
                    <p className="truncate text-xs text-black/70">{m.preview}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border-2 border-black bg-white p-4">
            <h2 className="font-display mb-4 text-lg font-bold text-black">Today&apos;s tasks</h2>
            <ul className="space-y-3">
              {TODAY_TASKS.map((t) => (
                <li
                  key={t.title}
                  className="flex items-center gap-3 rounded-xl border-2 border-black/15 bg-brand-cream/50 p-3"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-black ${
                      t.done ? 'bg-black/10' : 'bg-white'
                    }`}
                  >
                    <MessageSquare size={16} className={t.done ? 'text-black/30' : 'text-black'} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-bold ${
                        t.done ? 'text-black/40 line-through' : 'text-black'
                      }`}
                    >
                      {t.title}
                    </p>
                    <p className="text-xs text-black/50">{t.duration}</p>
                  </div>
                  <button
                    type="button"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black ${
                      t.done ? 'bg-brand-orange text-black' : 'bg-white'
                    }`}
                    aria-label={t.done ? 'Completed' : 'Mark complete'}
                  >
                    {t.done ? <Check size={18} strokeWidth={3} /> : null}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default OverviewPage
