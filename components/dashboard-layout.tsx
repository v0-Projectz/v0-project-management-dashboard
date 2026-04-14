'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DashboardSidebar } from './dashboard-sidebar'
import { useAppStore } from '@/lib/store'

interface DashboardLayoutProps {
  children: React.ReactNode
  onAddProject: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function DashboardLayout({ children, onAddProject, searchQuery, onSearchChange }: DashboardLayoutProps) {
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
    <div className="min-h-screen" style={{ backgroundColor: '#121212' }}>
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
        <header 
          className="h-16 sticky top-0 z-30 flex items-center justify-between px-6"
          style={{ 
            backgroundColor: 'rgba(18, 18, 18, 0.8)', 
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid #2a2a2a' 
          }}
        >
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold" style={{ color: '#f5f5f5' }}>{getViewTitle()}</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#4ADE80' }} />
              <span className="text-xs" style={{ color: '#888888' }}>System Online</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search Field */}
            {currentView === 'dashboard' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#888888' }} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg text-sm w-64 focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: '#1c1c1c', 
                    border: '1px solid #2a2a2a',
                    color: '#f5f5f5'
                  }}
                />
              </div>
            )}
            
            <div className="flex items-center gap-3 text-xs" style={{ color: '#888888' }}>
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              <span>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        <footer className="fixed bottom-0 right-0 p-4 text-xs" style={{ color: '#888888' }}>
          Powered by the MSC Media Engine
        </footer>
      </main>
    </div>
  )
}
