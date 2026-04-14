'use client'

import { FolderKanban, Plus, Search, ExternalLink, FolderOpen, MonitorPlay, Settings, Key, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectCard } from './project-card'
import { useAppStore } from '@/lib/store'
import type { Project } from '@/lib/types'

interface ProjectGridProps {
  projects: Project[]
  searchQuery: string
  onAddProject: () => void
  onSelectProject: (id: string) => void
  onOpenVault: (id: string) => void
  onEditProject: (id: string) => void
}

function ProjectListItem({ 
  project, 
  onSelect, 
  onDelete, 
  onOpenVault, 
  onEdit 
}: { 
  project: Project
  onSelect: () => void
  onDelete: () => void
  onOpenVault: () => void
  onEdit: () => void
}) {
  const totalTasks = project.tasks.length
  const completedTasks = project.tasks.filter(t => t.completed).length
  const calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (project.progress || 0)

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
      className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-[#252525] cursor-pointer"
      style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
      onClick={onSelect}
    >
      {/* Thumbnail */}
      <div 
        className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: '#252525' }}
      >
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          <MonitorPlay className="w-6 h-6" style={{ color: '#888888' }} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium truncate" style={{ color: '#f5f5f5' }}>{project.name}</h3>
          <span 
            className="px-2 py-0.5 text-[10px] uppercase font-semibold rounded"
            style={{ 
              backgroundColor: project.status === 'live' ? '#4ADE80' : '#2a2a2a',
              color: project.status === 'live' ? '#121212' : '#888888'
            }}
          >
            {project.status}
          </span>
        </div>
        <p className="text-xs truncate mt-0.5" style={{ color: '#888888' }}>{project.localPath}</p>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex-1 h-1.5 rounded-full max-w-32" style={{ backgroundColor: '#2a2a2a' }}>
            <div 
              className="h-full rounded-full"
              style={{ width: `${calculatedProgress}%`, backgroundColor: '#4ADE80' }}
            />
          </div>
          <span className="text-xs" style={{ color: '#4ADE80' }}>{calculatedProgress}%</span>
          <span className="text-xs" style={{ color: '#888888' }}>{completedTasks}/{totalTasks} tasks</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          style={{ color: '#888888' }}
          onClick={handleOpenInCursor}
          title="Open in Cursor"
        >
          <MonitorPlay className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          style={{ color: '#888888' }}
          onClick={handleOpenInExplorer}
          title="Copy Path"
        >
          <FolderOpen className="w-4 h-4" />
        </Button>
        {project.liveUrl && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            style={{ color: '#4ADE80' }}
            onClick={handleOpenLiveUrl}
            title="Open Live URL"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}
        <div className="w-px h-6" style={{ backgroundColor: '#2a2a2a' }} />
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          style={{ color: '#888888' }}
          onClick={onOpenVault}
          title="Open Vault"
        >
          <Key className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          style={{ color: '#888888' }}
          onClick={onEdit}
          title="Edit Project"
        >
          <Settings className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
          style={{ color: '#EF4444' }}
          onClick={onDelete}
          title="Delete Project"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export function ProjectGrid({ projects, searchQuery, onAddProject, onSelectProject, onOpenVault, onEditProject }: ProjectGridProps) {
  const allProjects = useAppStore((s) => s.projects)
  const deleteProject = useAppStore((s) => s.deleteProject)
  const appSettings = useAppStore((s) => s.appSettings)
  const viewMode = appSettings.projectViewMode

  if (allProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div 
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
        >
          <FolderKanban className="w-10 h-10" style={{ color: '#888888' }} />
        </div>
        <h2 className="text-lg font-medium mb-2" style={{ color: '#f5f5f5' }}>No projects yet</h2>
        <p className="text-sm mb-6 text-center max-w-md" style={{ color: '#888888' }}>
          Get started by creating your first project. Track credentials, manage tasks, and keep everything organized.
        </p>
        <Button 
          onClick={onAddProject} 
          className="gap-2"
          style={{ backgroundColor: '#4ADE80', color: '#121212' }}
        >
          <Plus className="w-4 h-4" />
          Add Your First Project
        </Button>
      </div>
    )
  }

  // Show no results message when search returns empty
  if (projects.length === 0 && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div 
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
        >
          <Search className="w-10 h-10" style={{ color: '#888888' }} />
        </div>
        <h2 className="text-lg font-medium mb-2" style={{ color: '#f5f5f5' }}>No projects found</h2>
        <p className="text-sm mb-6 text-center max-w-md" style={{ color: '#888888' }}>
          No projects match &quot;{searchQuery}&quot;. Try a different search term.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-2xl font-semibold" style={{ color: '#f5f5f5' }}>{allProjects.length}</p>
            <p className="text-xs uppercase tracking-wider" style={{ color: '#888888' }}>Total Projects</p>
          </div>
          <div className="w-px h-8" style={{ backgroundColor: '#2a2a2a' }} />
          <div>
            <p className="text-2xl font-semibold" style={{ color: '#4ADE80' }}>
              {allProjects.filter(p => p.status === 'live').length}
            </p>
            <p className="text-xs uppercase tracking-wider" style={{ color: '#888888' }}>Live</p>
          </div>
          <div className="w-px h-8" style={{ backgroundColor: '#2a2a2a' }} />
          <div>
            <p className="text-2xl font-semibold" style={{ color: '#f5f5f5' }}>
              {allProjects.filter(p => p.status === 'local').length}
            </p>
            <p className="text-xs uppercase tracking-wider" style={{ color: '#888888' }}>Local</p>
          </div>
        </div>
        <Button 
          onClick={onAddProject} 
          size="sm" 
          className="gap-2"
          style={{ backgroundColor: '#4ADE80', color: '#121212' }}
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      {/* Search Results Indicator */}
      {searchQuery && (
        <p className="text-sm" style={{ color: '#888888' }}>
          Showing {projects.length} result{projects.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
        </p>
      )}

      {/* Grid or List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={() => onSelectProject(project.id)}
              onDelete={() => deleteProject(project.id)}
              onOpenVault={() => onOpenVault(project.id)}
              onEdit={() => onEditProject(project.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              onSelect={() => onSelectProject(project.id)}
              onDelete={() => deleteProject(project.id)}
              onOpenVault={() => onOpenVault(project.id)}
              onEdit={() => onEditProject(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
