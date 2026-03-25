import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TaskListPage from './pages/TaskListPage'
import AnalyticsPage from './pages/AnalyticsPage'
import LandingPage from './pages/LandingPage'
import OverviewPage from './pages/OverviewPage'
import WorkspacePage from './pages/WorkspacePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path="tasks" element={<TaskListPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route
          path="projects"
          element={
            <WorkspacePage
              title="Projects"
              description="Track active projects based on latest task activity."
              emptyLabel="No projects found yet. Create a task to start one."
            />
          }
        />
        <Route
          path="calendar"
          element={
            <WorkspacePage
              title="Calendar"
              description="Upcoming work ordered by task due dates."
              emptyLabel="No upcoming deadlines yet."
            />
          }
        />
        <Route
          path="messages"
          element={
            <WorkspacePage
              title="Messages"
              description="Recent conversations simulated from task updates."
              emptyLabel="No recent messages."
            />
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
