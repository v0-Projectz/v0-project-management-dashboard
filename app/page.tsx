'use client'

import { useAppStore } from '@/lib/store'
import { LoginScreen } from '@/components/login-screen'
import { Dashboard } from '@/components/dashboard'

export default function Home() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return <Dashboard />
}
