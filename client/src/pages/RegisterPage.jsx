import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/useAuth'

const inputClass =
  'w-full rounded-2xl border-2 border-black bg-white px-4 py-3 text-sm font-medium text-black placeholder:text-black/40 shadow-[4px_4px_0_0_#000] focus:outline-none focus:ring-2 focus:ring-brand-pink dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-white/30'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register: registerAccount, loading, isAuthenticated, authReady } = useAuth()

  // Already authenticated in this app — redirect to app after render.
  useEffect(() => {
    if (authReady && isAuthenticated) {
      navigate('/app', { replace: true })
    }
  }, [authReady, isAuthenticated, navigate])
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (values) => {
    try {
      await registerAccount(values)
      toast.success('Account created')
      navigate('/app')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-cream p-4 dark:bg-black">
      <div className="w-full max-w-md rounded-[1.75rem] border-2 border-black bg-white p-8 shadow-[8px_8px_0_0_#000] dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-6 flex items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-black bg-brand-orange shadow-[3px_3px_0_0_#000] dark:border-slate-700">
            <img src="/LOGO.png" alt="Clutter" className="h-7 w-7" />
          </span>
          <span className="font-display text-xl font-bold">Clutter</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-black dark:text-white">Create account</h1>
        <p className="mt-1 text-sm font-medium text-black/60 dark:text-white/70">Start shipping with a workspace that feels intentional.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <input {...register('name', { required: 'Name is required' })} placeholder="Name" className={inputClass} />
          {errors.name && <p className="-mt-2 text-xs font-bold text-brand-orange">{errors.name.message}</p>}
          <input {...register('email', { required: 'Email is required' })} placeholder="Email" className={inputClass} />
          {errors.email && <p className="-mt-2 text-xs font-bold text-brand-orange">{errors.email.message}</p>}
          <input
            type="password"
            {...register('password', { required: 'Password is required', minLength: 8 })}
            placeholder="Password (min 8 chars)"
            className={inputClass}
          />
          {errors.password && (
            <p className="-mt-2 text-xs font-bold text-brand-orange">Password should be at least 8 characters.</p>
          )}
          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-2xl border-2 border-black bg-brand-green py-3 text-sm font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] disabled:opacity-50 dark:border-slate-700"
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm font-medium text-black/60 dark:text-white/70">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-orange underline decoration-2 underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
