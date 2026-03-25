import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getTasks } from '../services/task.service'

const WorkspacePage = ({ title, description, emptyLabel }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTasks({ sortBy: 'updatedAt', order: 'desc', page: 1, limit: 6 })
        setItems(data.tasks || [])
      } catch {
        toast.error(`Could not load ${title.toLowerCase()}`)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [title])

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-display text-3xl font-bold text-black dark:text-white">{title}</h1>
        <p className="mt-1 text-sm text-black/65 dark:text-white/70">{description}</p>
      </div>

      <div className="rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000] dark:border-slate-700 dark:bg-slate-900/60">
        {loading ? (
          <p className="text-sm font-bold text-black/50 dark:text-white/60">Loading...</p>
        ) : items.length ? (
          <ul className="space-y-2">
            {items.map((task) => (
              <li
                key={task._id}
                className="rounded-xl border-2 border-black/20 bg-brand-cream/50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/40"
              >
                <p className="text-sm font-bold text-black dark:text-white">{task.title}</p>
                <p className="text-xs text-black/60 dark:text-white/60">
                  {task.status} · {task.priority}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm font-bold text-black/50 dark:text-white/60">{emptyLabel}</p>
        )}
      </div>
    </section>
  )
}

export default WorkspacePage
