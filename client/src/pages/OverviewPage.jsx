import { useEffect, useMemo, useState } from 'react'
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
import { getTaskAnalytics, getTasks, updateTask } from '../services/task.service'

const stripByPriority = {
  High: 'bg-brand-pink',
  Medium: 'bg-brand-yellow',
  Low: 'bg-brand-green',
}

const prettyDate = (value) =>
  new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

const OverviewPage = () => {
  const [view, setView] = useState('timeline')
  const [stats, setStats] = useState({ upcoming: 0, progress: 0, done: 0 })
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [analytics, todoRes, progRes, tasksRes] = await Promise.all([
          getTaskAnalytics(),
          getTasks({ status: 'Todo', limit: 1, page: 1 }),
          getTasks({ status: 'In Progress', limit: 1, page: 1 }),
          getTasks({ sortBy: 'dueDate', order: 'asc', limit: 50, page: 1 }),
        ])
        setStats({
          upcoming: todoRes.pagination?.total ?? 0,
          progress: progRes.pagination?.total ?? 0,
          done: analytics.completed,
        })
        setTasks(tasksRes.tasks || [])
      } catch {
        toast.error('Could not load overview stats')
        setStats({ upcoming: 0, progress: 0, done: 0 })
      }
    }
    load()
  }, [])

  const timelineBars = useMemo(() => {
    const withDueDates = tasks.filter((task) => task.dueDate)
    const first = withDueDates[0]
    const baseDate = first ? new Date(first.dueDate) : new Date()
    return withDueDates.slice(0, 3).map((task, index) => {
      const due = new Date(task.dueDate)
      const dayOffset = Math.max(0, Math.ceil((due - baseDate) / (1000 * 60 * 60 * 24)))
      return {
        id: task._id,
        title: task.title,
        range: `${prettyDate(task.createdAt || Date.now())} - ${prettyDate(task.dueDate)}`,
        left: `${Math.min(70, dayOffset * 6)}%`,
        width: `${Math.max(20, 34 - index * 4)}%`,
        strip: stripByPriority[task.priority] || 'bg-brand-yellow',
      }
    })
  }, [tasks])

  const recentActivity = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 3)
        .map((task) => ({
          id: task._id,
          name: task.title,
          time: prettyDate(task.updatedAt || Date.now()),
          preview: `${task.status} · ${task.priority} priority`,
        })),
    [tasks],
  )

  const todaysTasks = useMemo(() => {
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
    const todayEnd = todayStart + 24 * 60 * 60 * 1000
    const dueToday = tasks.filter((task) => {
      if (!task.dueDate) return false
      const due = new Date(task.dueDate).getTime()
      return due >= todayStart && due < todayEnd
    })
    return (dueToday.length ? dueToday : tasks).slice(0, 3)
  }, [tasks])

  const markDone = async (taskId) => {
    try {
      await updateTask(taskId, { status: 'Done' })
      setTasks((current) =>
        current.map((task) => (task._id === taskId ? { ...task, status: 'Done' } : task)),
      )
      setStats((current) => ({
        ...current,
        progress: Math.max(0, current.progress - 1),
        done: current.done + 1,
      }))
      toast.success('Task marked complete')
    } catch {
      toast.error('Could not update task')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-black dark:text-white md:text-4xl">
            Overview
          </h1>
          <p className="mt-1 text-sm text-black/70 dark:text-white/70">
            Track projects, deadlines, and team momentum in one brutalist canvas.
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast('Create projects from the Tasks page')}
          className="inline-flex items-center gap-2 rounded-2xl border-2 border-black bg-brand-orange px-4 py-2.5 text-sm font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] dark:border-slate-700"
        >
          <FolderPlus size={18} strokeWidth={2.5} />
          Add New Project
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="relative overflow-hidden rounded-2xl border-2 border-black bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <Calendar className="absolute -right-2 -top-2 h-24 w-24 text-brand-pink/25" strokeWidth={1} />
          <p className="text-sm font-semibold text-black dark:text-white">Upcoming tasks</p>
          <p className="mt-2 font-display text-4xl font-bold text-black dark:text-white">{stats.upcoming}</p>
          <div className="mt-3 inline-block rounded-lg bg-brand-pink px-2 py-1 text-xs font-bold text-black dark:text-white">
            Todo
          </div>
        </article>
        <article className="relative overflow-hidden rounded-2xl border-2 border-black bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <Hourglass className="absolute -right-2 -top-2 h-24 w-24 text-brand-yellow/30" strokeWidth={1} />
          <p className="text-sm font-semibold text-black dark:text-white">In-progress</p>
          <p className="mt-2 font-display text-4xl font-bold text-black dark:text-white">{stats.progress}</p>
          <div className="mt-3 inline-block rounded-lg bg-brand-yellow px-2 py-1 text-xs font-bold text-black dark:text-white">
            Active
          </div>
        </article>
        <article className="relative overflow-hidden rounded-2xl border-2 border-black bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <Check className="absolute -right-2 -top-2 h-24 w-24 text-brand-green/25" strokeWidth={1} />
          <p className="text-sm font-semibold text-black dark:text-white">Completed</p>
          <p className="mt-2 font-display text-4xl font-bold text-black dark:text-white">{stats.done}</p>
          <div className="mt-3 inline-block rounded-lg bg-brand-green px-2 py-1 text-xs font-bold text-black dark:text-white">
            Done
          </div>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              Project Plant Pals
              <ChevronDown size={18} />
            </button>
            <div className="flex rounded-xl border-2 border-black bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setView('timeline')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                  view === 'timeline'
                    ? 'bg-brand-orange text-black dark:text-black'
                    : 'text-black/60 dark:text-white/60'
                }`}
              >
                Timeline
              </button>
              <button
                type="button"
                onClick={() => setView('board')}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold ${
                  view === 'board'
                    ? 'bg-brand-orange text-black dark:text-black'
                    : 'text-black/60 dark:text-white/60'
                }`}
              >
                <LayoutGrid size={14} />
                Board
              </button>
            </div>
          </div>

          {view === 'timeline' ? (
            <div className="overflow-x-auto rounded-2xl border-2 border-black bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <div className="mb-4 flex min-w-[640px] gap-2 border-b-2 border-black/10 pb-2 text-xs font-bold uppercase tracking-wider text-black/50 dark:border-white/10 dark:text-white/50">
                <span className="w-24 shrink-0">Month</span>
                <div className="flex flex-1 justify-between">
                  <span>Apr</span>
                  <span>May</span>
                </div>
              </div>
              <div className="relative min-h-[200px] min-w-[640px] rounded-xl bg-brand-cream/80 dark:bg-slate-900/60">
                <div className="absolute inset-0 flex">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="flex-1 border-l border-dashed border-black/15 first:border-l-0 dark:border-white/10"
                    />
                  ))}
                </div>
                <div className="relative space-y-6 p-4 pt-8">
                  {timelineBars.map((bar) => (
                    <div key={bar.id} className="relative h-14">
                      <div
                        className="absolute top-0 h-full rounded-xl border-2 border-black bg-white shadow-[3px_3px_0_0_#000] dark:border-slate-700 dark:bg-slate-900"
                        style={{ left: bar.left, width: bar.width }}
                      >
                        <div className={`h-2 rounded-t-[10px] ${bar.strip}`} />
                        <div className="px-3 py-1.5">
                          <p className="text-xs font-bold text-black dark:text-white">{bar.title}</p>
                          <p className="text-[10px] font-medium text-black/60 dark:text-white/60">{bar.range}</p>
                          <div className="mt-1 flex -space-x-1">
                            {['bg-brand-pink', 'bg-brand-yellow', 'bg-brand-green'].map((c) => (
                              <span
                                key={c}
                                className={`h-5 w-5 rounded-full border-2 border-black dark:border-slate-700 ${c}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!timelineBars.length ? (
                    <p className="px-2 text-sm font-bold text-black/50 dark:text-white/50">
                      No upcoming tasks yet. Add tasks with due dates to populate the timeline.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-black bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <div className="grid gap-3 md:grid-cols-3">
                {['Todo', 'In Progress', 'Done'].map((status) => (
                  <div
                    key={status}
                    className="rounded-xl border-2 border-black/20 bg-brand-cream/50 p-3 dark:border-slate-700/30 dark:bg-slate-900/40"
                  >
                    <h3 className="text-xs font-bold uppercase text-black/60 dark:text-white/60">{status}</h3>
                    <ul className="mt-3 space-y-2">
                      {tasks
                        .filter((task) => task.status === status)
                        .slice(0, 3)
                        .map((task) => (
                          <li
                            key={task._id}
                            className="rounded-lg border border-black/20 bg-white p-2 dark:border-slate-700/30 dark:bg-slate-900/60"
                          >
                            <p className="truncate text-sm font-bold text-black dark:text-white">{task.title}</p>
                            <p className="text-[11px] text-black/55 dark:text-white/55">{task.priority}</p>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border-2 border-black bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-black dark:text-white">Recent messages</h2>
              <button type="button" className="text-xs font-bold text-brand-orange underline">
                View all
              </button>
            </div>
            <ul className="divide-y-2 divide-black/10 dark:divide-white/10">
              {recentActivity.map((m) => (
                <li key={m.id} className="flex gap-3 py-3 first:pt-0">
                  <span className="h-10 w-10 shrink-0 rounded-full border-2 border-black bg-brand-yellow dark:border-slate-700" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-black dark:text-white">{m.name}</span>
                      <span className="text-[10px] font-medium text-black/50 dark:text-white/50">{m.time}</span>
                    </div>
                    <p className="truncate text-xs text-black/70 dark:text-white/70">{m.preview}</p>
                  </div>
                </li>
              ))}
              {!recentActivity.length ? (
                <li className="py-3 text-xs font-bold text-black/50 dark:text-white/50">No recent activity.</li>
              ) : null}
            </ul>
          </section>

          <section className="rounded-2xl border-2 border-black bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60">
            <h2 className="font-display mb-4 text-lg font-bold text-black dark:text-white">Today&apos;s tasks</h2>
            <ul className="space-y-3">
              {todaysTasks.map((t) => (
                <li
                  key={t._id}
                  className="flex items-center gap-3 rounded-xl border-2 border-black/15 bg-brand-cream/50 p-3 dark:border-slate-700/30 dark:bg-slate-900/40"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-black dark:border-slate-700 ${
                      t.status === 'Done' ? 'bg-black/10 dark:bg-white/10' : 'bg-white dark:bg-slate-800'
                    }`}
                  >
                    <MessageSquare
                      size={16}
                      className={
                        t.status === 'Done' ? 'text-black/30 dark:text-white/30' : 'text-black dark:text-white'
                      }
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-bold ${
                        t.status === 'Done'
                          ? 'text-black/40 line-through dark:text-white/40'
                          : 'text-black dark:text-white'
                      }`}
                    >
                      {t.title}
                    </p>
                    <p className="text-xs text-black/50 dark:text-white/50">
                      {t.dueDate ? `Due ${prettyDate(t.dueDate)}` : 'No due date'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => markDone(t._id)}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black dark:border-slate-700 ${
                      t.status === 'Done'
                        ? 'bg-brand-orange text-black dark:text-black'
                        : 'bg-white dark:bg-slate-800'
                    }`}
                    aria-label={t.status === 'Done' ? 'Completed' : 'Mark complete'}
                  >
                    {t.status === 'Done' ? <Check size={18} strokeWidth={3} /> : null}
                  </button>
                </li>
              ))}
              {!todaysTasks.length ? (
                <li className="text-xs font-bold text-black/50 dark:text-white/50">No tasks yet.</li>
              ) : null}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default OverviewPage