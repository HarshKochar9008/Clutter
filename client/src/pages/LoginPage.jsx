import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { SignInButton, useAuth as useClerkAuth } from '@clerk/react'

const hasClerkKey = () => Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim())

const inputClass =
  'w-full rounded-2xl border-2 border-black bg-white px-4 py-3 text-sm font-medium text-black placeholder:text-black/40 shadow-[4px_4px_0_0_#000] focus:outline-none focus:ring-2 focus:ring-brand-orange dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-white/30'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, loading, isAuthenticated, authReady } = useAuth()
  const { isLoaded: clerkIsLoaded, userId: clerkUserId } = useClerkAuth()

  // Already signed in via Clerk — redirect to app after render
  useEffect(() => {
    // Only redirect once the *app session* exists (backend sync succeeded).
    // This prevents redirect loops when Clerk auth exists but backend sync fails.
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

        {hasClerkKey() && clerkIsLoaded && !clerkUserId && (
          <div className="mt-6">
            <SignInButton mode="modal" fallbackRedirectUrl="/app" signUpFallbackRedirectUrl="/app">
              <button
                type="button"
                className="w-full rounded-2xl border-2 border-black bg-white py-3 text-sm font-bold text-black shadow-[4px_4px_0_0_#000] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                Continue with Clerk
              </button>
            </SignInButton>
            <div className="my-4 flex items-center gap-3">
              <span className="h-[2px] w-full bg-black/20 dark:bg-white/20" />
              <span className="text-xs font-bold text-black/60 dark:text-white/60">OR</span>
              <span className="h-[2px] w-full bg-black/20 dark:bg-white/20" />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <input {...register('email', { required: 'Email is required' })} placeholder="Email" className={inputClass} />
            {errors.email && <p className="mt-2 text-xs font-bold text-brand-orange">{errors.email.message}</p>}
          </div>
          <div>
            <input type="password" {...register('password', { required: 'Password is required' })} placeholder="Password" className={inputClass} />
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
