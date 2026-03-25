import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import useDebounce from '../hooks/useDebounce'
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../services/task.service'

const TaskListPage = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingTask, setEditingTask] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 6,
  })
  const debouncedSearch = useDebounce(filters.search)

  const queryParams = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  )

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const data = await getTasks(queryParams)
      setTasks(data.tasks)
      setPagination(data.pagination)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const normalizePayload = (payload) => ({
    ...payload,
    dueDate: payload.dueDate || null,
  })

  useEffect(() => {
    fetchTasks()
  }, [debouncedSearch, filters.status, filters.priority, filters.sortBy, filters.order, filters.page])

  const handleCreate = async (payload) => {
    const normalized = normalizePayload(payload)
    const optimisticTask = { ...normalized, _id: `temp-${Date.now()}` }
    setTasks((prev) => [optimisticTask, ...prev])
    try {
      await createTask(normalized)
      toast.success('Task created')
      fetchTasks()
    } catch (error) {
      setTasks((prev) => prev.filter((task) => task._id !== optimisticTask._id))
      toast.error(error.response?.data?.message || 'Create failed')
    }
  }

  const handleUpdate = async (payload) => {
    const id = editingTask._id
    const normalized = normalizePayload(payload)
    const prevTasks = tasks
    setTasks((current) => current.map((task) => (task._id === id ? { ...task, ...normalized } : task)))
    setEditingTask(null)
    try {
      await updateTask(id, normalized)
      toast.success('Task updated')
      fetchTasks()
    } catch (error) {
      setTasks(prevTasks)
      toast.error(error.response?.data?.message || 'Update failed')
    }
  }

  const handleDelete = async (task) => {
    const prevTasks = tasks
    setTasks((current) => current.filter((item) => item._id !== task._id))
    try {
      await deleteTask(task._id)
      toast.success('Task deleted')
      fetchTasks()
    } catch (error) {
      setTasks(prevTasks)
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  const handleMarkDone = async (task) => {
    const prevTasks = tasks
    setTasks((current) =>
      current.map((item) => (item._id === task._id ? { ...item, status: 'Done' } : item)),
    )
    try {
      await updateTask(task._id, { status: 'Done' })
      toast.success('Task marked as done')
      fetchTasks()
    } catch (error) {
      setTasks(prevTasks)
      toast.error(error.response?.data?.message || 'Update failed')
    }
  }

  const field =
    'rounded-xl border-2 border-black bg-white px-3 py-2 text-sm font-medium text-black shadow-[2px_2px_0_0_#000]'

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]">
        <h2 className="font-display mb-3 text-xl font-bold text-black">Create Task</h2>
        <TaskForm onSubmit={handleCreate} submitLabel="Create Task" />
      </div>

      <div className="rounded-2xl border-2 border-black bg-brand-cream/80 p-4 shadow-[4px_4px_0_0_#000]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value, page: 1 }))}
            placeholder="Search by title"
            className={field}
          />
          <select value={filters.status} onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value, page: 1 }))} className={field}>
            <option value="">All Status</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <select value={filters.priority} onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value, page: 1 }))} className={field}>
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select value={filters.sortBy} onChange={(event) => setFilters((prev) => ({ ...prev, sortBy: event.target.value }))} className={field}>
            <option value="createdAt">Sort: Created</option>
            <option value="dueDate">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
          </select>
          <select value={filters.order} onChange={(event) => setFilters((prev) => ({ ...prev, order: event.target.value }))} className={field}>
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      {editingTask && (
        <div className="rounded-2xl border-2 border-black bg-brand-yellow/40 p-4 shadow-[4px_4px_0_0_#000]">
          <h3 className="mb-2 font-display text-sm font-bold text-black">Editing task</h3>
          <TaskForm
            initialValues={{
              ...editingTask,
              dueDate: editingTask.dueDate?.slice(0, 10) || '',
            }}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
            onCancel={() => setEditingTask(null)}
          />
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {loading ? (
          <p className="text-sm font-bold text-black/50">Loading tasks...</p>
        ) : tasks.length ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={setEditingTask}
              onDelete={handleDelete}
              onMarkDone={handleMarkDone}
            />
          ))
        ) : (
          <p className="text-sm font-bold text-black/50">No tasks found for current filters.</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-black/60">
          Page {pagination.page} of {pagination.totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={pagination.page <= 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
            className="rounded-xl border-2 border-black bg-white px-3 py-2 text-sm font-bold shadow-[2px_2px_0_0_#000] disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
            className="rounded-xl border-2 border-black bg-white px-3 py-2 text-sm font-bold shadow-[2px_2px_0_0_#000] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}

export default TaskListPage
