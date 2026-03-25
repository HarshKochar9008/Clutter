import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/useAuth'

const inputClass =
  'w-full rounded-2xl border-2 border-black bg-white px-4 py-3 text-sm font-medium text-black placeholder:text-black/40 shadow-[4px_4px_0_0_#000] focus:outline-none focus:ring-2 focus:ring-brand-orange dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-white/30'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, loading, isAuthenticated, authReady } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  // Already authenticated in this app — redirect to app after render.
  useEffect(() => {
    if (authReady && isAuthenticated) {
      navigate('/app', { replace: true })
    }
  }, [authReady, isAuthenticated, navigate])
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (values) => {
    try {
      await login(values)
      toast.success('Welcome back!')
      navigate('/app')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
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
        <h1 className="font-display text-2xl font-bold text-black dark:text-white">Sign in</h1>
        <p className="mt-1 text-sm font-medium text-black/60 dark:text-white/70">Welcome back — pick up where you left off.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <input {...register('email', { required: 'Email is required' })} placeholder="Email" className={inputClass} />
            {errors.email && <p className="mt-2 text-xs font-bold text-brand-orange">{errors.email.message}</p>}
          </div>
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                placeholder="Password"
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} strokeWidth={2.5} /> : <Eye size={18} strokeWidth={2.5} />}
              </button>
            </div>
            {errors.password && <p className="mt-2 text-xs font-bold text-brand-orange">{errors.password.message} </p>}
            <Link to="/forgot-password" className="text-sm font-medium text-brand-orange underline decoration-2 underline-offset-4">Forgot password?</Link>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-2xl border-2 border-black bg-brand-orange py-3 text-sm font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] disabled:opacity-50 dark:border-slate-700"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm font-medium text-black/60 dark:text-white/70">
          New here?{' '}
          <Link to="/register" className="font-bold text-brand-orange underline decoration-2 underline-offset-4">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
