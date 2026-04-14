'use client'

import { FolderKanban, Plus, Search } from 'lucide-react'
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

export function ProjectGrid({ projects, searchQuery, onAddProject, onSelectProject, onOpenVault, onEditProject }: ProjectGridProps) {
  const allProjects = useAppStore((s) => s.projects)
  const deleteProject = useAppStore((s) => s.deleteProject)

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

      {/* Bento Grid */}
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
    </div>
  )
}
