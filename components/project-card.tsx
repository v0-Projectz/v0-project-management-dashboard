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

interface ProjectCardProps {
  project: Project
  onSelect: () => void
  onDelete: () => void
  onOpenVault: () => void
  onEdit: () => void
}

export function ProjectCard({ project, onSelect, onDelete, onOpenVault, onEdit }: ProjectCardProps) {
  const handleOpenInCursor = () => {
    window.open(`vscode://file/${project.localPath}`, '_blank')
  }

  const handleOpenInExplorer = () => {
    navigator.clipboard.writeText(project.localPath)
  }

  const handleOpenLiveUrl = () => {
    if (project.liveUrl) {
      window.open(project.liveUrl, '_blank')
    }
  }

  return (
    <div
      className="group relative bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-200 cursor-pointer"
      onClick={onSelect}
    >
      {/* Thumbnail Area */}
      <div className="aspect-video bg-muted/50 relative overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-xl bg-border/50 flex items-center justify-center">
              <MonitorPlay className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <Badge
          className={cn(
            'absolute top-3 right-3 uppercase text-[10px] font-semibold tracking-wider',
            project.status === 'live'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {project.status}
        </Badge>

        {/* Settings Icon - Always visible */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-all"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 text-xs gap-1.5"
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
            variant="secondary"
            className="h-8 text-xs gap-1.5"
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
              variant="secondary"
              className="h-8 text-xs gap-1.5"
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
            <h3 className="font-medium text-foreground truncate">{project.name}</h3>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {project.localPath}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}>
                <Settings className="w-4 h-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                onOpenVault()
              }}>
                <Key className="w-4 h-4 mr-2" />
                Open Vault
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                handleOpenInCursor()
              }}>
                <MonitorPlay className="w-4 h-4 mr-2" />
                Open in Cursor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation()
                handleOpenInExplorer()
              }}>
                <FolderOpen className="w-4 h-4 mr-2" />
                Copy Path
              </DropdownMenuItem>
              {project.liveUrl && (
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation()
                  handleOpenLiveUrl()
                }}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Live URL
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {project.credentials.length} credentials
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={cn(
              'w-1.5 h-1.5 rounded-full',
              project.tasks.filter(t => !t.completed).length > 0 ? 'bg-primary' : 'bg-muted-foreground'
            )} />
            <span className="text-xs text-muted-foreground">
              {project.tasks.filter(t => !t.completed).length} tasks
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
