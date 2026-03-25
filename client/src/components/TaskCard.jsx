const badgeClass = {
  Low: 'bg-brand-green/40 text-black border-black',
  Medium: 'bg-brand-yellow/70 text-black border-black',
  High: 'bg-brand-pink/60 text-black border-black',
}

const TaskCard = ({ task, onEdit, onDelete, onMarkDone }) => {
  return (
    <article className="rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
      <div className="mb-2 flex items-start justify-between gap-4">
        <h3 className="font-display text-base font-bold text-black">{task.title}</h3>
        <span className={`rounded-full border-2 px-2 py-1 text-xs font-bold ${badgeClass[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <p className="mb-3 text-sm font-medium text-black/70">{task.description || 'No description provided.'}</p>
      <div className="mb-4 flex flex-wrap gap-2 text-xs font-bold">
        <span className="rounded-lg border-2 border-black bg-brand-cream px-2 py-1 text-black">{task.status}</span>
        <span className="rounded-lg border-2 border-black bg-white px-2 py-1 text-black">
          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {task.status !== 'Done' && (
          <button
            type="button"
            onClick={() => onMarkDone(task)}
            className="rounded-xl border-2 border-black bg-brand-green px-3 py-2 text-xs font-bold text-black shadow-[2px_2px_0_0_#000]"
          >
            Mark Done
          </button>
        )}
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded-xl border-2 border-black bg-white px-3 py-2 text-xs font-bold text-black shadow-[2px_2px_0_0_#000]"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="rounded-xl border-2 border-black bg-brand-pink/50 px-3 py-2 text-xs font-bold text-black shadow-[2px_2px_0_0_#000]"
        >
          Delete
        </button>
      </div>
    </article>
  )
}

export default TaskCard
