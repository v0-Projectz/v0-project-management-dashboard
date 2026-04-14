'use client'

import { ExternalLink, FolderOpen, MonitorPlay, MoreVertical, Trash2, Key, Settings } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Project } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'

/**
 * Tauri 2.0 Hook Placeholder
 * Replace this function with Rust shell commands when exporting to Tauri desktop.
 */
const handleOpenPath = (path: string, action: 'cursor' | 'explorer' | 'terminal' = 'explorer') => {
  switch (action) {
    case 'cursor':
      window.open(`vscode://file/${path}`, '_blank')
      break
    case 'explorer':
      navigator.clipboard.writeText(path)
      break
    case 'terminal':
      navigator.clipboard.writeText(`cd "${path}"`)
      break
  }
}

interface ProjectCardProps {
  project: Project
  onSelect: () => void
  onDelete: () => void
  onOpenVault: () => void
  onEdit: () => void
  onOpenTaskDrawer?: () => void
}

export function ProjectCard({ project, onSelect, onDelete, onOpenVault, onEdit, onOpenTaskDrawer }: ProjectCardProps) {
  const appSettings = useAppStore((s) => s.appSettings)
  const isDark = appSettings.theme === 'dark'
  
  // Theme colors
  const cardBg = isDark ? '#1c1c1c' : '#FFFFFF'
  const borderColor = isDark ? '#2a2a2a' : '#E5E7EB'
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const mutedColor = isDark ? '#888888' : '#6B7280'
  const surfaceBg = isDark ? '#252525' : '#F9FAFB'
  const overlayBg = isDark ? 'rgba(18, 18, 18, 0.9)' : 'rgba(255, 255, 255, 0.95)'
  const buttonBg = isDark ? '#2a2a2a' : '#F3F4F6'
  
  const handleOpenInCursor = () => {
    handleOpenPath(project.localPath, 'cursor')
  }

  const handleOpenInExplorer = () => {
    handleOpenPath(project.localPath, 'explorer')
  }

  const handleOpenLiveUrl = () => {
    if (project.liveUrl) {
      window.open(project.liveUrl, '_blank')
    }
  }

  // Calculate progress from tasks
  const totalTasks = project.tasks.length
  const completedTasks = project.tasks.filter(t => t.completed).length
  const calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (project.progress || 0)

  return (
    <div
      className={cn(
        'group relative rounded-xl overflow-hidden transition-all duration-200 cursor-pointer',
        !isDark && 'card-shadow hover:card-shadow-lg'
      )}
      style={{ 
        backgroundColor: cardBg, 
        border: `1px solid ${borderColor}` 
      }}
      onClick={onSelect}
    >
      {/* Thumbnail Area */}
      <div className="aspect-video relative overflow-hidden" style={{ backgroundColor: surfaceBg }}>
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: isDark ? '#2a2a2a' : '#E5E7EB' }}
            >
              <MonitorPlay className="w-8 h-8" style={{ color: mutedColor }} />
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <Badge
          className={cn(
            'absolute top-3 right-3 uppercase text-[10px] font-semibold tracking-wider border-0',
            project.status === 'live'
              ? 'text-[#121212]'
              : ''
          )}
          style={{
            backgroundColor: project.status === 'live' ? '#4ADE80' : (isDark ? '#2a2a2a' : '#E5E7EB'),
            color: project.status === 'live' ? '#121212' : mutedColor
          }}
        >
          {project.status}
        </Badge>

        {/* Settings Icon - Always visible */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          className="absolute top-3 left-3 w-8 h-8 rounded-lg backdrop-blur-sm flex items-center justify-center transition-all"
          style={{ 
            backgroundColor: isDark ? 'rgba(18, 18, 18, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            color: mutedColor
          }}
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Overlay on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
          style={{ backgroundColor: overlayBg }}
        >
          <Button
            size="sm"
            className="h-8 text-xs gap-1.5"
            style={{ backgroundColor: buttonBg, color: textColor }}
            onClick={(e) => {
              e.stopPropagation()
              handleOpenInCursor()
            }}
          >
            <MonitorPlay className="w-3.5 h-3.5" />
            Cursor
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs gap-1.5"
            style={{ backgroundColor: buttonBg, color: textColor }}
            onClick={(e) => {
              e.stopPropagation()
              handleOpenInExplorer()
            }}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Explorer
          </Button>
          {project.liveUrl && (
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5"
              style={{ backgroundColor: '#4ADE80', color: '#121212' }}
              onClick={(e) => {
                e.stopPropagation()
                handleOpenLiveUrl()
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate" style={{ color: textColor }}>{project.name}</h3>
            <p className="text-xs truncate mt-0.5" style={{ color: mutedColor }}>
              {project.localPath}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" style={{ color: mutedColor }}>
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48"
              style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
            >
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                style={{ color: textColor }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenVault()
                }}
                style={{ color: textColor }}
              >
                <Key className="w-4 h-4 mr-2" />
                Open Vault
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ backgroundColor: borderColor }} />
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenInCursor()
                }}
                style={{ color: textColor }}
              >
                <MonitorPlay className="w-4 h-4 mr-2" />
                Open in Cursor
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenInExplorer()
                }}
                style={{ color: textColor }}
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Copy Path
              </DropdownMenuItem>
              {project.liveUrl && (
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenLiveUrl()
                  }}
                  style={{ color: textColor }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Live URL
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator style={{ backgroundColor: borderColor }} />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                style={{ color: '#EF4444' }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs" style={{ color: mutedColor }}>Progress</span>
            <span className="text-xs font-medium" style={{ color: '#4ADE80' }}>{calculatedProgress}%</span>
          </div>
          <div 
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: isDark ? '#2a2a2a' : '#E5E7EB' }}
          >
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${calculatedProgress}%`,
                backgroundColor: '#4ADE80'
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
          <div className="flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5" style={{ color: mutedColor }} />
            <span className="text-xs" style={{ color: mutedColor }}>
              {project.credentials.length} credentials
            </span>
          </div>
          {/* Clickable Progress Circle - Opens Task Drawer */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenTaskDrawer?.()
            }}
            className="flex items-center gap-1.5 transition-transform hover:scale-110"
            title="Open task drawer"
          >
            <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke={isDark ? '#2a2a2a' : '#E5E7EB'}
                strokeWidth="2"
              />
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="#4ADE80"
                strokeWidth="2"
                strokeDasharray={`${(completedTasks / Math.max(totalTasks, 1)) * 50.3} 50.3`}
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xs" style={{ color: mutedColor }}>
              {completedTasks}/{totalTasks} tasks
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
