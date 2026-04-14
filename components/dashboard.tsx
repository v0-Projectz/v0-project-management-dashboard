'use client'

import { useState } from 'react'
import { DashboardLayout } from './dashboard-layout'
import { ProjectGrid } from './project-grid'
import { AddProjectModal } from './add-project-modal'
import { ProjectVault } from './project-vault'
import { TaskPulse } from './task-pulse'
import { useAppStore } from '@/lib/store'
import { X } from 'lucide-react'

export function Dashboard() {
  const [addProjectOpen, setAddProjectOpen] = useState(false)
  const [vaultProjectId, setVaultProjectId] = useState<string | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  
  const projects = useAppStore((s) => s.projects)
  
  const vaultProject = projects.find((p) => p.id === vaultProjectId)
  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  return (
    <DashboardLayout onAddProject={() => setAddProjectOpen(true)}>
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <ProjectGrid
            onAddProject={() => setAddProjectOpen(true)}
            onSelectProject={(id) => setSelectedProjectId(id)}
            onOpenVault={(id) => setVaultProjectId(id)}
          />
        </div>

        {/* Right Sidebar - Task Pulse for selected project */}
        {selectedProject && (
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-foreground">{selectedProject.name}</h2>
                <button
                  onClick={() => setSelectedProjectId(null)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <TaskPulse project={selectedProject} />
            </div>
          </div>
        )}
      </div>

      {/* Modals & Panels */}
      <AddProjectModal
        isOpen={addProjectOpen}
        onClose={() => setAddProjectOpen(false)}
      />

      {vaultProject && (
        <ProjectVault
          project={vaultProject}
          isOpen={!!vaultProjectId}
          onClose={() => setVaultProjectId(null)}
        />
      )}
    </DashboardLayout>
  )
}
