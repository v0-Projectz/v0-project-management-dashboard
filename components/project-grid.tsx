'use client'

import { FolderKanban, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProjectCard } from './project-card'
import { useAppStore } from '@/lib/store'

interface ProjectGridProps {
  onAddProject: () => void
  onSelectProject: (id: string) => void
  onOpenVault: (id: string) => void
}

export function ProjectGrid({ onAddProject, onSelectProject, onOpenVault }: ProjectGridProps) {
  const projects = useAppStore((s) => s.projects)
  const deleteProject = useAppStore((s) => s.deleteProject)

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center mb-6">
          <FolderKanban className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-medium text-foreground mb-2">No projects yet</h2>
        <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
          Get started by creating your first project. Track credentials, manage tasks, and keep everything organized.
        </p>
        <Button onClick={onAddProject} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Your First Project
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-2xl font-semibold text-foreground">{projects.length}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Projects</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-2xl font-semibold text-primary">
              {projects.filter(p => p.status === 'live').length}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Live</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-2xl font-semibold text-foreground">
              {projects.filter(p => p.status === 'local').length}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Local</p>
          </div>
        </div>
        <Button onClick={onAddProject} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onSelect={() => onSelectProject(project.id)}
            onDelete={() => deleteProject(project.id)}
            onOpenVault={() => onOpenVault(project.id)}
          />
        ))}
      </div>
    </div>
  )
}
