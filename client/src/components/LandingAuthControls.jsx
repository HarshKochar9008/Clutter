import { Link } from 'react-router-dom'
import { useAuth, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import { ArrowRight } from 'lucide-react'

const hasClerkKey = () => Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim())

/**
 * Clerk's <Show> renders nothing while auth is loading. Without a publishable key,
 * loading may never complete — so we always show /login and /register until Clerk is ready.
 */
export function LandingHeaderAuth({ signInBtnClass, signUpBtnClass }) {
  const { isLoaded, userId } = useAuth()

  if (!hasClerkKey() || !isLoaded) {
    return (
      <>
        <Link to="/login" className={signInBtnClass}>
          Login
        </Link>
        <Link to="/register" className={signUpBtnClass}>
          Sign up
        </Link>
      </>
    )
  }

  if (userId) {
    return (
      <UserButton
        appearance={{
          elements: {
            avatarBox: 'h-9 w-9 border-2 border-white/30',
          },
        }}
      />
    )
  }

  return (
    <>
      <SignInButton mode="modal">
        <button type="button" className={signInBtnClass}>
          Login
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button type="button" className={signUpBtnClass}>
          Sign up
        </button>
      </SignUpButton>
    </>
  )
}

export function LandingHeroAuth({ heroLoginClass, heroCtaClass }) {
  const { isLoaded, userId } = useAuth()

  if (!hasClerkKey() || !isLoaded) {
    return (
      <>
        <Link to="/login" className={heroLoginClass}>
          Log in
        </Link>
        <Link to="/register" className={heroCtaClass}>
          Sign up
          <ArrowRight size={18} strokeWidth={2.5} />
        </Link>
      </>
    )
  }

  if (userId) {
    return (
      <Link to="/app" className={heroCtaClass}>
        Open app
        <ArrowRight size={18} strokeWidth={2.5} />
      </Link>
    )
  }

  return (
    <>
      <SignInButton mode="modal">
        <button type="button" className={heroLoginClass}>
          Log in
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button type="button" className={heroCtaClass}>
          Sign up
          <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </SignUpButton>
    </>
  )
}

export function LandingPricingAuth({ pricingCtaClass }) {
  const { isLoaded, userId } = useAuth()

  if (!hasClerkKey() || !isLoaded) {
    return (
      <Link to="/register" className={pricingCtaClass}>
        Create account
      </Link>
    )
  }

  if (userId) {
    return (
      <Link to="/app" className={pricingCtaClass}>
        Go to dashboard
      </Link>
    )
  }

  return (
    <SignUpButton mode="modal">
      <button type="button" className={pricingCtaClass}>
        Create account
      </button>
    </SignUpButton>
  )
}
