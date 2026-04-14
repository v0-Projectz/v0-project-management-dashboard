'use client'

import { 
  LayoutDashboard, 
  FolderKanban, 
  Settings, 
  HelpCircle,
  LogOut,
  Plus,
  ChevronLeft,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  onAddProject: () => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
]

export function DashboardSidebar({ collapsed, onToggle, onAddProject }: SidebarProps) {
  const logout = useAppStore((s) => s.logout)
  const projects = useAppStore((s) => s.projects)

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-40',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center w-full')}>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-sidebar-foreground">MSC-Projectz</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Command Center
              </span>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-sidebar-foreground"
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
            'w-full bg-primary text-primary-foreground hover:bg-primary/90',
            collapsed ? 'px-0' : 'justify-start gap-2'
          )}
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
            const isActive = item.id === 'dashboard'
            return (
              <li key={item.id}>
                <button
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-foreground'
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
                    collapsed && 'justify-center px-0'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && item.id === 'projects' && (
                    <span className="ml-auto text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
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
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={logout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Lock Vault</span>}
        </button>
      </div>

      {/* Collapse Toggle (when collapsed) */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3 h-3 rotate-180" />
        </button>
      )}
    </aside>
  )
}
