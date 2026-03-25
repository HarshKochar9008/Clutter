import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export function LandingHeaderAuth({ signInBtnClass, signUpBtnClass }) {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return (
      <Link to="/app" className={signInBtnClass}>
        Open app{user?.name ? ` (${user.name.charAt(0).toUpperCase()})` : ''}
      </Link>
    )
  }

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

export function LandingHeroAuth({ heroLoginClass, heroCtaClass }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return (
      <Link to="/app" className={heroCtaClass}>
        Open app
        <ArrowRight size={18} strokeWidth={2.5} />
      </Link>
    )
  }

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

export function LandingPricingAuth({ pricingCtaClass }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return (
      <Link to="/app" className={pricingCtaClass}>
        Go to dashboard
      </Link>
    )
  }

  return (
    <Link to="/register" className={pricingCtaClass}>
      Create account
    </Link>
  )
}
