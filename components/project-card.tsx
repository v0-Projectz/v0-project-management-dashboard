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

/**
 * Tauri 2.0 Hook Placeholder
 * Replace this function with Rust shell commands when exporting to Tauri desktop.
 */
const handleOpenPath = (path: string, action: 'cursor' | 'explorer' | 'terminal' = 'explorer') => {
  console.log('[Tauri Hook Ready]', action, path)
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
}

export function ProjectCard({ project, onSelect, onDelete, onOpenVault, onEdit }: ProjectCardProps) {
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
      className="group relative rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
      style={{ 
        backgroundColor: '#1c1c1c', 
        border: '1px solid #2a2a2a' 
      }}
      onClick={onSelect}
    >
      {/* Thumbnail Area */}
      <div className="aspect-video relative overflow-hidden" style={{ backgroundColor: '#252525' }}>
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
              style={{ backgroundColor: '#2a2a2a' }}
            >
              <MonitorPlay className="w-8 h-8" style={{ color: '#888888' }} />
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
            backgroundColor: project.status === 'live' ? '#4ADE80' : '#2a2a2a',
            color: project.status === 'live' ? '#121212' : '#888888'
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
          className="absolute top-3 left-3 w-8 h-8 rounded-lg backdrop-blur-sm flex items-center justify-center transition-all hover:bg-[#1c1c1c]"
          style={{ 
            backgroundColor: 'rgba(18, 18, 18, 0.8)',
            color: '#888888'
          }}
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Overlay on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
          style={{ backgroundColor: 'rgba(18, 18, 18, 0.9)' }}
        >
          <Button
            size="sm"
            className="h-8 text-xs gap-1.5"
            style={{ backgroundColor: '#2a2a2a', color: '#f5f5f5' }}
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
            style={{ backgroundColor: '#2a2a2a', color: '#f5f5f5' }}
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
            <h3 className="font-medium truncate" style={{ color: '#f5f5f5' }}>{project.name}</h3>
            <p className="text-xs truncate mt-0.5" style={{ color: '#888888' }}>
              {project.localPath}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" style={{ color: '#888888' }}>
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48"
              style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
            >
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                style={{ color: '#f5f5f5' }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenVault()
                }}
                style={{ color: '#f5f5f5' }}
              >
                <Key className="w-4 h-4 mr-2" />
                Open Vault
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ backgroundColor: '#2a2a2a' }} />
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenInCursor()
                }}
                style={{ color: '#f5f5f5' }}
              >
                <MonitorPlay className="w-4 h-4 mr-2" />
                Open in Cursor
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation()
                  handleOpenInExplorer()
                }}
                style={{ color: '#f5f5f5' }}
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
                  style={{ color: '#f5f5f5' }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Live URL
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator style={{ backgroundColor: '#2a2a2a' }} />
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
            <span className="text-xs" style={{ color: '#888888' }}>Progress</span>
            <span className="text-xs font-medium" style={{ color: '#4ADE80' }}>{calculatedProgress}%</span>
          </div>
          <div 
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: '#2a2a2a' }}
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
        <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid #2a2a2a' }}>
          <div className="flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5" style={{ color: '#888888' }} />
            <span className="text-xs" style={{ color: '#888888' }}>
              {project.credentials.length} credentials
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div 
              className="w-1.5 h-1.5 rounded-full"
              style={{ 
                backgroundColor: project.tasks.filter(t => !t.completed).length > 0 ? '#4ADE80' : '#888888' 
              }}
            />
            <span className="text-xs" style={{ color: '#888888' }}>
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
