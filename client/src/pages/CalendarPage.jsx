import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { getTasks, updateTask } from '../services/task.service'

const toDateKey = (value) => {
  if (!value) return null
  const str = String(value)

  // If it's already a `YYYY-MM-DD` string, just use it.
  if (str.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10)

  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null

  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const toPrettyDate = (dateKey) => {
  // `dateKey` is expected to be `YYYY-MM-DD`.
  const [y, m, d] = dateKey.split('-').map((n) => Number(n))
  const dt = new Date(y, (m || 1) - 1, d || 1)
  return dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

const addMonths = (date, delta) => {
  const d = new Date(date)
  d.setMonth(d.getMonth() + delta)
  return d
}

const priorityDotClass = {
  High: 'bg-brand-pink',
  Medium: 'bg-brand-yellow',
  Low: 'bg-brand-green',
}

const CalendarPage = () => {
  const [cursorMonth, setCursorMonth] = useState(() => new Date())
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])

  const todayKey = useMemo(() => toDateKey(new Date()), [])
  const [selectedDayKey, setSelectedDayKey] = useState(() => todayKey)
  const [expandedTaskId, setExpandedTaskId] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // Backend clamps `limit` to <= 50.
        const data = await getTasks({ sortBy: 'dueDate', order: 'asc', limit: 50, page: 1 })
        setTasks(data.tasks || [])
      } catch {
        toast.error('Could not load calendar tasks')
        setTasks([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  useEffect(() => {
    // Keep the right panel clean when the selected date changes.
    setExpandedTaskId(null)
  }, [selectedDayKey])

  const tasksByDate = useMemo(() => {
    const map = new Map()
    for (const t of tasks) {
      const key = toDateKey(t?.dueDate)
      if (!key) continue
      const list = map.get(key) || []
      list.push(t)
      map.set(key, list)
    }

    // Sort consistently within each day.
    for (const [key, list] of map.entries()) {
      map.set(
        key,
        [...list].sort((a, b) => {
          if (a.status === b.status) return String(a.title).localeCompare(String(b.title))
          // Put non-done first.
          return a.status === 'Done' ? 1 : -1
        }),
      )
    }

    return map
  }, [tasks])

  const selectedTasks = useMemo(() => tasksByDate.get(selectedDayKey) || [], [tasksByDate, selectedDayKey])

  const monthStart = useMemo(() => new Date(cursorMonth.getFullYear(), cursorMonth.getMonth(), 1), [cursorMonth])
  const monthEnd = useMemo(() => new Date(cursorMonth.getFullYear(), cursorMonth.getMonth() + 1, 0), [cursorMonth])

  const daysInMonth = monthEnd.getDate()
  const firstDayIndex = monthStart.getDay() // Sun=0 ... Sat=6

  const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7
  const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const monthLabel = monthStart.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  const shiftMonth = (delta) => {
    const next = addMonths(cursorMonth, delta)
    setCursorMonth(next)

    // If the selected day isn't in the new month, reset to the 1st of that month.
    const nextKey = toDateKey(new Date(next.getFullYear(), next.getMonth(), 1))
    setSelectedDayKey((prev) => {
      if (!prev) return nextKey
      return prev.slice(0, 7) === nextKey.slice(0, 7) ? prev : nextKey
    })
  }

  const handleDayClick = (dateKey) => {
    if (!dateKey) return
    setSelectedDayKey(dateKey)
  }

  const markDone = async (task) => {
    if (!task || task.status === 'Done') return

    const prevTasks = tasks
    setTasks((current) => current.map((t) => (t._id === task._id ? { ...t, status: 'Done' } : t)))

    try {
      await updateTask(task._id, { status: 'Done' })
      toast.success('Task marked complete')
    } catch {
      setTasks(prevTasks)
      toast.error('Could not update task')
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-black dark:text-white">Calendar</h1>
        <p className="mt-1 text-sm text-black/65 dark:text-white/70">
          Click a day to see tasks due that date. Completed tasks stay compact.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border-2 border-black bg-white p-4 shadow-[6px_6px_0_0_#000] dark:border-slate-700 dark:bg-slate-900/60">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CalendarDays size={20} className="text-brand-pink" strokeWidth={2.5} />
              <p className="font-display text-lg font-bold text-black dark:text-white">{monthLabel}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="rounded-xl border-2 border-black bg-white px-3 py-2 text-xs font-bold shadow-[2px_2px_0_0_#000] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  const now = new Date()
                  setCursorMonth(now)
                  setSelectedDayKey(toDateKey(now))
                }}
                className="rounded-xl border-2 border-black bg-brand-cream px-3 py-2 text-xs font-bold shadow-[2px_2px_0_0_#000] dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="rounded-xl border-2 border-black bg-white px-3 py-2 text-xs font-bold shadow-[2px_2px_0_0_#000] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekLabels.map((w) => (
              <div key={w} className="px-1 py-1 text-center text-[11px] font-bold text-black/60 dark:text-white/60">
                {w}
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-2">
            {Array.from({ length: totalCells }).map((_, idx) => {
              const dayNum = idx - firstDayIndex + 1
              const inMonth = dayNum >= 1 && dayNum <= daysInMonth
              const dateKey = inMonth ? toDateKey(new Date(cursorMonth.getFullYear(), cursorMonth.getMonth(), dayNum)) : null
              const dayTasks = dateKey ? tasksByDate.get(dateKey) || [] : []

              const isToday = dateKey && dateKey === todayKey
              const isSelected = dateKey && dateKey === selectedDayKey

              return (
                <div key={`${idx}-${dateKey || 'x'}`} className="min-h-[90px]">
                  <button
                    type="button"
                    onClick={() => handleDayClick(dateKey)}
                    disabled={!inMonth}
                    className={[
                      'relative flex h-full w-full flex-col overflow-hidden rounded-xl border-2 border-black bg-white p-2 text-left shadow-[2px_2px_0_0_#000] transition',
                      'dark:border-slate-700 dark:bg-slate-900/60 dark:text-white',
                      !inMonth ? 'pointer-events-none opacity-20' : '',
                      isToday ? 'border-brand-orange bg-brand-orange/15' : '',
                      isSelected ? 'border-brand-orange bg-brand-orange/20' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12px] font-bold text-black/70 dark:text-white/70">{inMonth ? dayNum : ''}</span>
                      {dayTasks.length ? (
                        <span className="text-[10px] font-bold text-black/50 dark:text-white/60">{dayTasks.length}</span>
                      ) : null}
                    </div>

                    {dayTasks.length ? (
                      <div className="mt-2 space-y-1">
                        {dayTasks.slice(0, 3).map((t) => (
                          <div
                            key={t._id}
                            className={[
                              'flex items-center gap-1 overflow-hidden rounded-md border border-black/15 bg-brand-cream/60 px-1 py-0.5',
                              'dark:border-white/10 dark:bg-slate-800/40',
                              t.status === 'Done' ? 'opacity-70' : '',
                            ].join(' ')}
                            title={`${t.title} (${t.status})`}
                          >
                            {t.status === 'Done' ? (
                              <Check size={12} className="text-black/50 dark:text-white/50" strokeWidth={3} />
                            ) : (
                              <span className={`h-2 w-2 shrink-0 rounded-full border border-black/20 ${priorityDotClass[t.priority] || 'bg-brand-yellow'}`} />
                            )}
                            <span className="truncate text-[10px] font-bold text-black/70 dark:text-white/70">{t.title}</span>
                          </div>
                        ))}

                        {dayTasks.length > 3 ? (
                          <div className="text-[10px] font-bold text-black/55 dark:text-white/60">+{dayTasks.length - 3} more</div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="mt-auto text-[10px] font-bold text-black/40 dark:text-white/40">—</div>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-2xl border-2 border-black bg-white p-4 shadow-[6px_6px_0_0_#000] dark:border-slate-700 dark:bg-slate-900/60">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-lg font-bold text-black dark:text-white">{selectedDayKey ? toPrettyDate(selectedDayKey) : 'Select a day'}</p>
                <p className="mt-1 text-xs font-bold text-black/60 dark:text-white/60">
                  {selectedTasks.length ? `${selectedTasks.length} task${selectedTasks.length === 1 ? '' : 's'}` : 'No tasks due'}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-black bg-brand-cream text-black shadow-[2px_2px_0_0_#000] dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                <Clock size={18} strokeWidth={2.5} />
              </div>
            </div>

            {loading ? (
              <p className="text-sm font-bold text-black/50 dark:text-white/60">Loading tasks...</p>
            ) : selectedTasks.length ? (
              <ul className="space-y-2">
                {selectedTasks.map((t) => {
                  const isExpanded = expandedTaskId === t._id
                  const canExpand = t.status !== 'Done' // Completed tasks shouldn't reveal “more”.

                  return (
                    <li key={t._id} className="rounded-xl border-2 border-black/15 bg-brand-cream/45 p-3 dark:border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          if (!canExpand) return
                          setExpandedTaskId((prev) => (prev === t._id ? null : t._id))
                        }}
                        className="flex w-full items-start justify-between gap-3 text-left"
                        aria-label={canExpand ? 'Toggle task details' : 'Task completed'}
                      >
                        <div className="min-w-0">
                          <p
                            className={[
                              'truncate text-sm font-bold',
                              t.status === 'Done' ? 'text-black/40 dark:text-white/40 line-through' : 'text-black dark:text-white',
                            ].join(' ')}
                          >
                            {t.title}
                          </p>
                          <p className="mt-1 text-[11px] font-bold text-black/60 dark:text-white/60">
                            {t.status} · {t.priority}
                          </p>
                        </div>

                        {canExpand ? (
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white text-[10px] font-bold shadow-[2px_2px_0_0_#000] dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                            {isExpanded ? '−' : '+'}
                          </span>
                        ) : (
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white text-[10px] font-bold shadow-[2px_2px_0_0_#000] dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                            <Check size={14} strokeWidth={3} className="text-black/60 dark:text-white/60" />
                          </span>
                        )}
                      </button>

                      {isExpanded ? (
                        <div className="mt-2 space-y-2">
                          <p className="text-xs font-medium text-black/70 dark:text-white/70">{t.description || 'No description provided.'}</p>

                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[11px] font-bold text-black/60 dark:text-white/60">
                              Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'}
                            </p>
                            <button
                              type="button"
                              onClick={() => markDone(t)}
                              className="rounded-xl border-2 border-black bg-brand-green px-3 py-2 text-xs font-bold text-black shadow-[2px_2px_0_0_#000] dark:border-slate-700 dark:bg-brand-green/30"
                            >
                              Mark Done
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-sm font-bold text-black/50 dark:text-white/60">No tasks for this day.</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default CalendarPage

