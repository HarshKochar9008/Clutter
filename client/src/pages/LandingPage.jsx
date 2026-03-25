import TopographicBg from '../components/TopographicBg'
import {
  LandingHeaderAuth,
  LandingHeroAuth,
  LandingPricingAuth,
} from '../components/LandingAuthControls.jsx'
import { ArrowRight, Sparkles } from 'lucide-react'

const signInBtnClass =
  'rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm transition hover:bg-white/10 hover:text-white'
const signUpBtnClass =
  'rounded-xl border-2 border-white bg-white px-4 py-2 text-sm font-bold text-black shadow-[4px_4px_0_0_rgba(235,123,38,0.9)] transition hover:translate-x-0.5 hover:translate-y-0.5'
const heroLoginClass =
  'inline-flex items-center justify-center rounded-2xl border-2 border-white/90 bg-white/5 px-5 py-3.5 text-sm font-bold text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.4)] backdrop-blur-sm transition hover:bg-white/15'
const heroCtaClass =
  'inline-flex items-center gap-2 rounded-2xl border-2 border-brand-orange bg-brand-orange px-6 py-3.5 text-sm font-bold text-black shadow-[6px_6px_0_0_#000] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0_0_#000]'
const pricingCtaClass =
  'mt-8 inline-flex rounded-2xl border-2 border-brand-green bg-brand-green px-8 py-3 text-sm font-bold text-black shadow-[6px_6px_0_0_#fff]'

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#141414] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgb(13, 64, 231),transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(11,197,109,0.22),transparent_55%)]" />
      <TopographicBg />

      <div className="relative z-10">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 md:px-6">
          <div className="flex items-center gap-2">
            <img src="/logo1.png" alt="Clutter" className="h-10 w-10" />
            <span className="font-display text-lg font-bold tracking-tight">Clutter</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
            <a href="#product" className="hover:text-white">
              Product
            </a>
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <LandingHeaderAuth signInBtnClass={signInBtnClass} signUpBtnClass={signUpBtnClass} />
          </div>
        </header>

        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-24 pt-8 md:grid-cols-2 md:px-6 md:pt-12">
          <div>

            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
              Turn daily clutter into{' '}
              <span className="bg-gradient-to-r from-brand-yellow via-brand-orange to-white/100 bg-clip-text text-transparent">
                clear priorities
              </span>
              — and ship faster.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/65">
              Scan what matters in seconds, move work with momentum, and track delivery without
              the noise.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <LandingHeroAuth heroLoginClass={heroLoginClass} heroCtaClass={heroCtaClass} />
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white/90 backdrop-blur-sm transition hover:bg-white/10 hover:-translate-y-0.5"
              >
                See how it works
                <ArrowRight size={18} strokeWidth={2.5} />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-pink/30 via-brand-yellow/20 to-brand-green/20 blur-3xl" />
            <div className="relative rounded-[1.75rem] border-2 border-white/15 bg-white/5 p-4 shadow-[12px_12px_0_0_rgba(0,0,0,0.35)] transition hover:-translate-y-1 md:p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-sm font-bold text-white/90">Clutter Board</span>
                <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-sm">
                  Live
                </span>
              </div>

                
                <img
                  src="/Task.png"
                  alt="Clutter dashboard preview"
                  className="relative h-full w-full rounded-[1.75rem] object-cover"
                  loading="lazy"
                />

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur-sm">
                  Priority you can scan
                </span>
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur-sm">
                  Delivery-ready tracking
                </span>
              </div>
            </div>
          </div>
        </section>
        <section id="product" className="border-t border-white/10 bg-black/40 py-16">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Priority you can see',
                  body: 'Color-coded urgency so the team always knows what ships first.',
                  color: 'bg-brand-orange',
                },
                {
                  title: 'Momentum, not noise',
                  body: 'Neubrutalist UI: thick borders, zero fluff, pure execution.',
                  color: 'bg-brand-yellow',
                },
                {
                  title: 'Ship with confidence',
                  body: 'Analytics and timelines that match how real teams work.',
                  color: 'bg-brand-green',
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border-2 border-white/15 bg-white/5 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10"
                >
                  <div className={`mb-4 h-2 w-12 rounded-full ${item.color}`} />
                  <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/65">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="border-t border-white/10 bg-black/25 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid gap-10 md:grid-cols-12 md:items-center rounded-[2rem] border border-white/15 bg-white/5 p-4 backdrop-blur-sm shadow-[12px_12px_0_0_rgba(0,0,0,0.25)]">
              <div className="md:col-span-5">
                <h2 className="font-display mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                  Clutter <span className="text-brand-yellow">looks like</span> momentum.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
                  One place to scan priorities, move work through progress, and see delivery-ready
                  status—without the noise.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-brand-orange" />
                    <p className="text-xs font-semibold text-white/80">Scan priorities in seconds</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-brand-yellow" />
                    <p className="text-xs font-semibold text-white/80">Momentum over noise</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-brand-green" />
                    <p className="text-xs font-semibold text-white/80">Delivery-ready tracking</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7">
                <figure className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 shadow-[0_30px_120px_-70px_rgba(0,0,0,0.9)]">
                  <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_20%_10%,rgba(235,123,38,0.24),transparent_45%),radial-gradient(circle_at_80%_90%,rgba(11,197,109,0.18),transparent_48%)]" />

                  <img
                    src="/mock1.png"
                    alt="Project reference dashboard mockup"
                    className="relative z-10 h-full w-full object-cover"
                    loading="lazy"
                  />

                  <figcaption className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-xs font-semibold text-white/80 backdrop-blur-sm">
                    Live priorities + progress + delivery
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>


        <section id="features" className="py-16">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
                <span className="text-brand-yellow font-display text-3xl md:text-5xl font-bold">100k</span>
                <span className="mt-2 text-sm font-semibold text-white/80">Experiences</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
                <span className="text-brand-yellow font-display text-3xl md:text-5xl font-bold">96%</span>
                <span className="mt-2 text-sm font-semibold text-white/80">On-Time</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
                <span className="text-brand-yellow font-display text-3xl md:text-5xl font-bold">238k</span>
                <span className="mt-2 text-sm font-semibold text-white/80">People</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
                <span className="text-brand-yellow font-display text-3xl md:text-5xl font-bold">100%</span>
                <span className="mt-2 text-sm font-semibold text-white/80">Clarity</span>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="border-t border-white/10 pb-20 pt-10">
          <div className="mx-auto max-w-xl px-4 text-center md:px-6">
            <h2 className="font-display text-2xl font-bold text-white">Ready when you are.</h2>
            <p className="mt-3 text-sm text-white/60">
              Same palette. Same brutalist precision. Start free — upgrade when your team scales.
            </p>
            <LandingPricingAuth pricingCtaClass={pricingCtaClass} />
          </div>
        </section>
      </div>
    </div>
  )
}

export default LandingPage
