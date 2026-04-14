'use client'

import { useState } from 'react'
import { Search, Sun, Moon, LayoutGrid, List } from 'lucide-react'
import Image from 'next/image'
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
  const user = useAppStore((s) => s.user)
  const appSettings = useAppStore((s) => s.appSettings)
  const toggleTheme = useAppStore((s) => s.toggleTheme)
  const setProjectViewMode = useAppStore((s) => s.setProjectViewMode)

  const isDark = appSettings.theme === 'dark'

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard'
      case 'settings': return 'Settings'
      case 'help': return 'Help & Documentation'
      default: return 'Dashboard'
    }
  }

  const bgColor = isDark ? '#121212' : '#f5f5f5'
  const surfaceColor = isDark ? '#1c1c1c' : '#ffffff'
  const borderColor = isDark ? '#2a2a2a' : '#e0e0e0'
  const textColor = isDark ? '#f5f5f5' : '#121212'
  const mutedColor = isDark ? '#888888' : '#666666'

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
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
            backgroundColor: isDark ? 'rgba(18, 18, 18, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
            backdropFilter: 'blur(8px)',
            borderBottom: `1px solid ${borderColor}` 
          }}
        >
          <div className="flex items-center gap-4">
            {/* MSC Icon and User Info */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden" style={{ backgroundColor: surfaceColor, border: `1px solid ${borderColor}` }}>
                <Image 
                  src="/msc-icon.png" 
                  alt="MSC" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
              </div>
              {user && (
                <span className="text-sm font-medium" style={{ color: textColor }}>
                  {user.username}
                </span>
              )}
            </div>
            
            <div className="h-6 w-px" style={{ backgroundColor: borderColor }} />
            
            <h1 className="text-lg font-semibold" style={{ color: textColor }}>{getViewTitle()}</h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#4ADE80' }} />
              <span className="text-xs" style={{ color: mutedColor }}>System Online</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Toggle (Bento Grid / List) */}
            {currentView === 'dashboard' && (
              <div 
                className="flex items-center p-1 rounded-lg"
                style={{ backgroundColor: surfaceColor, border: `1px solid ${borderColor}` }}
              >
                <button
                  onClick={() => setProjectViewMode('grid')}
                  className="p-2 rounded-md transition-colors"
                  style={{ 
                    backgroundColor: appSettings.projectViewMode === 'grid' ? '#4ADE80' : 'transparent',
                    color: appSettings.projectViewMode === 'grid' ? '#121212' : mutedColor
                  }}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setProjectViewMode('list')}
                  className="p-2 rounded-md transition-colors"
                  style={{ 
                    backgroundColor: appSettings.projectViewMode === 'list' ? '#4ADE80' : 'transparent',
                    color: appSettings.projectViewMode === 'list' ? '#121212' : mutedColor
                  }}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Search Field */}
            {currentView === 'dashboard' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: mutedColor }} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg text-sm w-64 focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: surfaceColor, 
                    border: `1px solid ${borderColor}`,
                    color: textColor
                  }}
                />
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: surfaceColor, 
                border: `1px solid ${borderColor}`,
                color: mutedColor
              }}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center gap-3 text-xs" style={{ color: mutedColor }}>
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
        <footer className="fixed bottom-0 right-0 p-4 text-xs" style={{ color: mutedColor }}>
          Powered by the MSC Media Engine
        </footer>
      </main>
    </div>
  )
}
