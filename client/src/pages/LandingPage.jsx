import TopographicBg from '../components/TopographicBg'
import {
  LandingHeaderAuth,
  LandingHeroAuth,
  LandingPricingAuth,
} from '../components/LandingAuthControls.jsx'

const signInBtnClass =
  'rounded-xl px-3 py-2 text-sm font-semibold text-white/90 hover:text-white'
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
    <div className="relative min-h-screen overflow-hidden bg-[#504e4e] text-white">
      <TopographicBg />

      <div className="relative z-10">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 md:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/20 bg-brand-orange text-lg">
              ☀
            </span>
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
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
              Manage all your daily tasks at once today.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/65">
              With this platform, you can find the priority of your tasks so your activities become
              efficient — built on a bold palette you can feel.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <LandingHeroAuth heroLoginClass={heroLoginClass} heroCtaClass={heroCtaClass} />
              <a href="#how" className="text-sm font-semibold text-white underline decoration-brand-yellow decoration-2 underline-offset-4">
                How it works?
              </a>
            </div>
            <p id="how" className="mt-12 text-sm text-white/45">
              We are trusted by 1000+ companies
            </p>
            <div className="mt-4 flex flex-wrap gap-6 opacity-50 grayscale">
              {['Framer', 'Dropbox', 'Webflow', 'Notion', 'Squarespace'].map((name) => (
                <span key={name} className="text-xs font-bold uppercase tracking-widest text-white">
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-pink/30 via-brand-yellow/20 to-brand-green/20 blur-3xl" />
            <div className="relative rounded-[1.75rem] border-2 border-white/15 bg-white p-4 text-black shadow-[12px_12px_0_0_rgba(0,0,0,0.5)] md:p-5">
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className="font-display text-sm font-bold">Project Plant Pals</span>
                <span className="rounded-full border-2 border-black bg-brand-yellow px-3 py-1 text-xs font-bold">
                  Board
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border-2 border-black bg-brand-green/30 p-3">
                  <p className="text-[10px] font-bold uppercase text-black/60">Backlog</p>
                  <p className="mt-1 font-display text-sm font-bold">Website &amp; Mobile</p>
                  <p className="mt-2 text-[10px] text-black/55">4 checklist items</p>
                </div>
                <div className="rounded-2xl border-2 border-black bg-brand-pink/40 p-3">
                  <p className="text-[10px] font-bold uppercase text-black/60">In progress</p>
                  <p className="mt-1 font-display text-sm font-bold">Branding</p>
                  <p className="mt-2 text-[10px] text-black/55">3 checklist items</p>
                </div>
              </div>
              <div className="mt-3 rounded-2xl border-2 border-black bg-brand-cream p-3">
                <span className="inline-block rounded-md border border-black bg-black px-2 py-0.5 text-[10px] font-bold text-white">
                  Design
                </span>
                <p className="mt-2 text-sm font-semibold leading-snug">
                  Create a concept for the homepage and about us.
                </p>
                <p className="mt-2 text-xs text-black/50">Jan 12 · 3 comments</p>
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
                  className="rounded-2xl border-2 border-white/15 bg-white/5 p-6 backdrop-blur-sm"
                >
                  <div className={`mb-4 h-2 w-12 rounded-full ${item.color}`} />
                  <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/65">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-16">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <p className="font-display text-center text-3xl font-bold text-white md:text-4xl">
              100k experiences · 96% on-time · 238k people · 100% clarity
            </p>
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
