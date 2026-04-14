'use client'

import { 
  LayoutDashboard, 
  Settings, 
  HelpCircle,
  LogOut,
  Plus,
  ChevronLeft
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import type { ViewType } from '@/lib/types'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  onAddProject: () => void
}

const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
]

export function DashboardSidebar({ collapsed, onToggle, onAddProject }: SidebarProps) {
  const logout = useAppStore((s) => s.logout)
  const projects = useAppStore((s) => s.projects)
  const currentView = useAppStore((s) => s.currentView)
  const setCurrentView = useAppStore((s) => s.setCurrentView)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 z-40',
        collapsed ? 'w-16' : 'w-64'
      )}
      style={{ backgroundColor: '#1a1a1a', borderRight: '1px solid #2a2a2a' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4" style={{ borderBottom: '1px solid #2a2a2a' }}>
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center w-full')}>
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
            <Image 
              src="/msc-icon.png" 
              alt="MSC" 
              width={40} 
              height={40}
              className="object-contain"
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm" style={{ color: '#f5f5f5' }}>MSC-Projectz</span>
              <span className="text-[10px] uppercase tracking-wider" style={{ color: '#888888' }}>
                Command Center
              </span>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md transition-colors hover:bg-[#2a2a2a]"
            style={{ color: '#888888' }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Add Project Button */}
      <div className={cn('p-3', collapsed && 'px-2')}>
        <Button
          onClick={onAddProject}
          className={cn(
            'w-full',
            collapsed ? 'px-0' : 'justify-start gap-2'
          )}
          style={{ backgroundColor: '#4ADE80', color: '#121212' }}
          size={collapsed ? 'icon' : 'default'}
        >
          <Plus className="w-4 h-4" />
          {!collapsed && <span>Add Project</span>}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm',
                    collapsed && 'justify-center px-0'
                  )}
                  style={{ 
                    backgroundColor: isActive ? '#2a2a2a' : 'transparent',
                    color: isActive ? '#f5f5f5' : '#888888'
                  }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && item.id === 'dashboard' && (
                    <span 
                      className="ml-auto text-xs px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)', color: '#4ADE80' }}
                    >
                      {projects.length}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3" style={{ borderTop: '1px solid #2a2a2a' }}>
        <button
          onClick={() => {
            // Clear all localStorage keys before logout
            localStorage.clear()
            logout()
            // Force page reload to reset all state
            window.location.reload()
          }}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm hover:bg-red-500/10',
            collapsed && 'justify-center px-0'
          )}
          style={{ color: '#888888' }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle (when collapsed) */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a', color: '#888888' }}
        >
          <ChevronLeft className="w-3 h-3 rotate-180" />
        </button>
      )}
    </aside>
  )
}
