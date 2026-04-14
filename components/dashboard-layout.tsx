'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { DashboardSidebar } from './dashboard-sidebar'
import { useAppStore } from '@/lib/store'

interface DashboardLayoutProps {
  children: React.ReactNode
  onAddProject: () => void
}

export function DashboardLayout({ children, onAddProject }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const currentView = useAppStore((s) => s.currentView)

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard'
      case 'settings': return 'Settings'
      case 'help': return 'Help & Documentation'
      default: return 'Dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onAddProject={onAddProject}
      />
      
      {/* Main Content */}
      <main
        className={cn(
          'transition-all duration-300 min-h-screen',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        {/* Header Bar */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-foreground">{getViewTitle()}</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">System Online</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        <footer className="fixed bottom-0 right-0 p-4 text-xs text-muted-foreground">
          Powered by the MSC Media Engine
        </footer>
      </main>
    </div>
  )
}
