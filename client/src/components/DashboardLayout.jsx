import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Calendar,
  FolderKanban,
  LayoutGrid,
  MessageSquare,
  Search,
  Settings,
  Sun,
  Users,
  Users2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

const navLinkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
    isActive
      ? 'text-brand-orange'
      : 'text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10'
  }`

const DashboardLayout = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [searchValue, setSearchValue] = useState('')
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    // Default must be light unless the user explicitly chose dark.
    if (saved === 'true') return true
    return false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  const links = [
    { to: '/app', label: 'Overview', end: true, icon: LayoutGrid },
    { to: '/app/tasks', label: 'Tasks' },
    { to: '/app/analytics', label: 'Analytics' },
    { to: '/app/projects', label: 'Projects', icon: FolderKanban },
    { to: '/app/calendar', label: 'Calendar', icon: Calendar },
    { to: '/app/messages', label: 'Messages', icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-brand-cream font-sans text-black dark:bg-black dark:text-white">
      <header className="border-b-2 border-black bg-brand-cream dark:border-slate-700 dark:bg-black">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => navigate('/app')}
              className="flex items-center gap-2"
            >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-brand-orange text-black shadow-[3px_3px_0_0_#000]">
                  <img src="/LOGO.png" alt="Clutter" className="h-7 w-7" />
                </span>
              <span className="font-display text-xl font-bold tracking-tight">Clutter</span>
            </button>
            <nav className="flex max-w-full flex-wrap items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
              {links.map((link) => {
                const Icon = link.icon
                return (
                  <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
                    {Icon ? <Icon size={18} strokeWidth={2.5} /> : null}
                    {link.label}
                  </NavLink>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/app/analytics')}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white shadow-[2px_2px_0_0_#000] dark:border-slate-700 dark:bg-slate-900"
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>
            <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode((prev) => !prev)} />
            <form
              onSubmit={(event) => {
                event.preventDefault()
                const query = searchValue.trim()
                if (!query) {
                  toast('Type something to search in tasks')
                  return
                }
                navigate(`/app/tasks?q=${encodeURIComponent(query)}`)
              }}
              className="hidden items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1.5 shadow-[2px_2px_0_0_#000] dark:border-slate-700 dark:bg-slate-900 md:flex"
            >
              <Search size={16} />
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search tasks"
                className="w-28 bg-transparent text-xs font-semibold outline-none dark:text-white"
              />
            </form>
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-brand-yellow text-xs font-bold shadow-[2px_2px_0_0_#000] dark:border-slate-700"
              title={user?.name}
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? <Users size={18} />}
            </span>
            <button
              type="button"
              onClick={async () => {
                await logout()
                navigate('/login')
              }}
              className="rounded-xl border-2 border-black bg-black px-3 py-2 text-xs font-bold text-white shadow-[3px_3px_0_0_#EB7B26] dark:border-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6">
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
