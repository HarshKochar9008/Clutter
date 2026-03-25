const ThemeToggle = ({ darkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
    >
      {darkMode ? 'Light' : 'Dark'}
    </button>
  )
}

export default ThemeToggle
