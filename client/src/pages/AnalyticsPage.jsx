import { useEffect, useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import toast from 'react-hot-toast'
import { getTaskAnalytics } from '../services/task.service'

const COLORS = ['#0BC56D', '#FFCE62']

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTaskAnalytics()
        setAnalytics(data)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Unable to load analytics')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const chartData = useMemo(
    () => [
      { name: 'Completed', value: analytics.completed },
      { name: 'Pending', value: analytics.pending },
    ],
    [analytics],
  )

  if (loading) {
    return <p className="font-bold text-black/50">Loading analytics...</p>
  }

  return (
    <section className="space-y-6">
      <h1 className="font-display text-3xl font-bold text-black">Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total tasks', value: analytics.total, bg: 'bg-brand-cream' },
          { label: 'Completed', value: analytics.completed, bg: 'bg-brand-green/50' },
          { label: 'Pending', value: analytics.pending, bg: 'bg-brand-yellow/60' },
          { label: 'Completion %', value: `${analytics.completionRate}%`, bg: 'bg-brand-pink/50' },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-2xl border-2 border-black p-4 shadow-[4px_4px_0_0_#000] ${item.bg}`}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-black/60">{item.label}</p>
            <p className="font-display mt-1 text-3xl font-bold text-black">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-[6px_6px_0_0_#000]">
        <h3 className="font-display mb-4 text-lg font-bold text-black">Task mix</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                stroke="#000"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}

export default AnalyticsPage
