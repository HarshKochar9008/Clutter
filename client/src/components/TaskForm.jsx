import { useForm } from 'react-hook-form'

const field =
  'w-full rounded-xl border-2 border-black bg-white px-3 py-2 text-sm font-medium text-black shadow-[3px_3px_0_0_#000] focus:outline-none focus:ring-2 focus:ring-brand-orange'

const TaskForm = ({ onSubmit, initialValues, submitLabel, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues || {
      title: '',
      description: '',
      status: 'Todo',
      priority: 'Medium',
      dueDate: '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <input
          {...register('title', { required: 'Title is required' })}
          placeholder="Task title"
          className={field}
        />
        {errors.title && <p className="mt-1 text-xs font-bold text-brand-orange">{errors.title.message}</p>}
      </div>
      <textarea
        {...register('description')}
        rows={3}
        placeholder="Description"
        className={field}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <select {...register('status')} className={field}>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <select {...register('priority')} className={field}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input type="date" {...register('dueDate')} className={field} />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border-2 border-black bg-brand-cream px-4 py-2 text-sm font-bold text-black shadow-[3px_3px_0_0_#000]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-xl border-2 border-black bg-brand-orange px-4 py-2 text-sm font-bold text-black shadow-[3px_3px_0_0_#000]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

export default TaskForm
