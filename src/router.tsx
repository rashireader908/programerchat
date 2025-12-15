import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { LoginForm } from './components/auth/LoginForm'
import { SignUpForm } from './components/auth/SignUpForm'
import { VerificationFlow } from './components/auth/VerificationFlow'
import { Dashboard } from './pages/Dashboard'
import { Queue } from './pages/Queue'
import { Conversation } from './pages/Conversation'
import { Profile } from './pages/Profile'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Header } from './components/layout/Header'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <Outlet />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/signup',
    element: <SignUpForm />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/verification',
        element: <ProtectedRoute><VerificationFlow /></ProtectedRoute>,
      },
      {
        path: '/dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: '/queue',
        element: <ProtectedRoute><Queue /></ProtectedRoute>,
      },
      {
        path: '/conversation/:id?',
        element: <ProtectedRoute><Conversation /></ProtectedRoute>,
      },
      {
        path: '/profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
])

