import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Calendar,
  LayoutGrid,
  MessageSquare,
  Search,
  Settings,
  Sun,
  Users,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
    isActive
      ? 'text-brand-orange'
      : 'text-black hover:bg-black/5'
  }`

const DashboardLayout = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-brand-cream font-sans text-black">
      <header className="border-b-2 border-black bg-brand-cream">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => navigate('/app')}
              className="flex items-center gap-2"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-brand-orange text-black shadow-[3px_3px_0_0_#000]">
                <Sun size={22} strokeWidth={2.5} />
              </span>
              <span className="font-display text-xl font-bold tracking-tight">Clutter</span>
            </button>
            <nav className="flex max-w-[100vw] flex-wrap items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
              <NavLink to="/app" end className={navLinkClass}>
                <LayoutGrid size={18} strokeWidth={2.5} />
                Overview
              </NavLink>
              <NavLink to="/app/tasks" className={navLinkClass}>
                Tasks
              </NavLink>
              <NavLink to="/app/analytics" className={navLinkClass}>
                Analytics
              </NavLink>
              <span className="cursor-not-allowed px-3 py-2 text-sm font-bold text-black/35">
                Projects
              </span>
              <span className="cursor-not-allowed px-3 py-2 text-sm font-bold text-black/35">
                Team
              </span>
              <span className="cursor-not-allowed px-3 py-2 text-sm font-bold text-black/35">
                <span className="inline-flex items-center gap-2">
                  <Calendar size={18} />
                  Calendar
                </span>
              </span>
              <span className="relative inline-flex cursor-not-allowed items-center gap-2 px-3 py-2 text-sm font-bold text-black/35">
                <MessageSquare size={18} />
                Messages
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-black bg-brand-green px-1 text-[10px] font-bold text-black">
                  5
                </span>
              </span>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white shadow-[2px_2px_0_0_#000]"
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white shadow-[2px_2px_0_0_#000]"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-brand-yellow text-xs font-bold shadow-[2px_2px_0_0_#000]"
              title={user?.name}
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? <Users size={18} />}
            </span>
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="rounded-xl border-2 border-black bg-black px-3 py-2 text-xs font-bold text-white shadow-[3px_3px_0_0_#EB7B26]"
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
