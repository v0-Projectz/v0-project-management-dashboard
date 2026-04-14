'use client'

import { useState, useMemo } from 'react'
import { 
  Inbox, 
  Archive, 
  Plus, 
  Check, 
  FolderOpen,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

type TabType = 'inbox' | 'archived'

export function GlobalTasksView() {
  const [activeTab, setActiveTab] = useState<TabType>('inbox')
  const [quickAddText, setQuickAddText] = useState('')
  const [expandedProjects, setExpandedProjects] = useState<string[]>([])
  
  const projects = useAppStore((s) => s.projects)
  const toggleTask = useAppStore((s) => s.toggleTask)
  const archiveTask = useAppStore((s) => s.archiveTask)
  const addTask = useAppStore((s) => s.addTask)
  
  // Get all incomplete tasks grouped by project
  const inboxTasks = useMemo(() => {
    const grouped: Record<string, { projectId: string; projectName: string; tasks: { id: string; title: string; completed: boolean; createdAt: Date }[] }> = {}
    
    projects.forEach((project) => {
      const incompleteTasks = project.tasks.filter((t) => !t.completed && !t.archived)
      if (incompleteTasks.length > 0) {
        grouped[project.id] = {
          projectId: project.id,
          projectName: project.name,
          tasks: incompleteTasks,
        }
      }
    })
    
    return grouped
  }, [projects])
  
  // Get all archived/completed tasks grouped by project
  const archivedTasks = useMemo(() => {
    const grouped: Record<string, { projectId: string; projectName: string; tasks: { id: string; title: string; completed: boolean; createdAt: Date }[] }> = {}
    
    projects.forEach((project) => {
      const completedTasks = project.tasks.filter((t) => t.completed || t.archived)
      if (completedTasks.length > 0) {
        grouped[project.id] = {
          projectId: project.id,
          projectName: project.name,
          tasks: completedTasks,
        }
      }
    })
    
    return grouped
  }, [projects])
  
  const toggleProjectExpanded = (projectId: string) => {
    setExpandedProjects((prev) => 
      prev.includes(projectId) 
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    )
  }
  
  const handleQuickAdd = () => {
    if (!quickAddText.trim() || projects.length === 0) return
    
    // Add to first project by default
    addTask(projects[0].id, quickAddText.trim())
    setQuickAddText('')
  }
  
  const handleTaskToggle = (projectId: string, taskId: string) => {
    toggleTask(projectId, taskId)
    // Auto-archive when completed
    setTimeout(() => {
      archiveTask(projectId, taskId)
    }, 500)
  }
  
  const inboxCount = Object.values(inboxTasks).reduce((sum, group) => sum + group.tasks.length, 0)
  const archivedCount = Object.values(archivedTasks).reduce((sum, group) => sum + group.tasks.length, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1" style={{ color: '#f5f5f5' }}>
          Global Tasks
        </h1>
        <p className="text-sm" style={{ color: '#888888' }}>
          Command center for all project tasks
        </p>
      </div>

      {/* Tabs */}
      <div 
        className="flex gap-1 p-1 rounded-lg w-fit"
        style={{ backgroundColor: '#1c1c1c' }}
      >
        <button
          onClick={() => setActiveTab('inbox')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors'
          )}
          style={{ 
            backgroundColor: activeTab === 'inbox' ? '#4ADE80' : 'transparent',
            color: activeTab === 'inbox' ? '#121212' : '#888888'
          }}
        >
          <Inbox className="w-4 h-4" />
          My Inbox
          {inboxCount > 0 && (
            <span 
              className="px-1.5 py-0.5 rounded text-xs"
              style={{ 
                backgroundColor: activeTab === 'inbox' ? 'rgba(18,18,18,0.2)' : 'rgba(74,222,128,0.2)',
                color: activeTab === 'inbox' ? '#121212' : '#4ADE80'
              }}
            >
              {inboxCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('archived')}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors'
          )}
          style={{ 
            backgroundColor: activeTab === 'archived' ? '#4ADE80' : 'transparent',
            color: activeTab === 'archived' ? '#121212' : '#888888'
          }}
        >
          <Archive className="w-4 h-4" />
          Archived
          {archivedCount > 0 && (
            <span 
              className="px-1.5 py-0.5 rounded text-xs"
              style={{ 
                backgroundColor: activeTab === 'archived' ? 'rgba(18,18,18,0.2)' : '#2a2a2a',
                color: activeTab === 'archived' ? '#121212' : '#888888'
              }}
            >
              {archivedCount}
            </span>
          )}
        </button>
      </div>

      {/* Quick Add (Inbox only) */}
      {activeTab === 'inbox' && (
        <div 
          className="flex gap-2 p-4 rounded-xl"
          style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
        >
          <Input
            placeholder={projects.length > 0 ? `Quick add task to ${projects[0].name}...` : 'Add a project first...'}
            value={quickAddText}
            onChange={(e) => setQuickAddText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
            disabled={projects.length === 0}
            style={{ backgroundColor: '#252525', borderColor: '#2a2a2a', color: '#f5f5f5' }}
          />
          <Button 
            onClick={handleQuickAdd}
            disabled={!quickAddText.trim() || projects.length === 0}
            className="gap-1.5"
            style={{ backgroundColor: '#4ADE80', color: '#121212' }}
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {activeTab === 'inbox' && (
          Object.keys(inboxTasks).length === 0 ? (
            <div 
              className="flex flex-col items-center justify-center py-16 rounded-xl"
              style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
            >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: '#252525' }}
              >
                <Inbox className="w-8 h-8" style={{ color: '#4ADE80' }} />
              </div>
              <h3 className="font-medium mb-1" style={{ color: '#f5f5f5' }}>Inbox Zero</h3>
              <p className="text-sm text-center max-w-xs" style={{ color: '#888888' }}>
                No pending tasks. Add tasks from project cards or use Quick Add above.
              </p>
            </div>
          ) : (
            Object.values(inboxTasks).map((group) => (
              <div 
                key={group.projectId}
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
              >
                <button
                  onClick={() => toggleProjectExpanded(group.projectId)}
                  className="w-full flex items-center justify-between p-4 hover:bg-[#252525] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)' }}
                    >
                      <FolderOpen className="w-4 h-4" style={{ color: '#4ADE80' }} />
                    </div>
                    <span className="font-medium" style={{ color: '#f5f5f5' }}>{group.projectName}</span>
                    <span 
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ backgroundColor: '#2a2a2a', color: '#888888' }}
                    >
                      {group.tasks.length} task{group.tasks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {expandedProjects.includes(group.projectId) ? (
                    <ChevronDown className="w-4 h-4" style={{ color: '#888888' }} />
                  ) : (
                    <ChevronRight className="w-4 h-4" style={{ color: '#888888' }} />
                  )}
                </button>
                
                {expandedProjects.includes(group.projectId) && (
                  <div style={{ borderTop: '1px solid #2a2a2a' }}>
                    {group.tasks.map((task) => (
                      <div 
                        key={task.id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#252525] transition-all"
                        style={{ borderBottom: '1px solid #2a2a2a' }}
                      >
                        <button
                          onClick={() => handleTaskToggle(group.projectId, task.id)}
                          className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors hover:border-[#4ADE80]"
                          style={{ borderColor: '#2a2a2a' }}
                        >
                          {task.completed && <Check className="w-3 h-3" style={{ color: '#4ADE80' }} />}
                        </button>
                        <span 
                          className={cn('flex-1', task.completed && 'line-through')}
                          style={{ color: task.completed ? '#888888' : '#f5f5f5' }}
                        >
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )
        )}

        {activeTab === 'archived' && (
          Object.keys(archivedTasks).length === 0 ? (
            <div 
              className="flex flex-col items-center justify-center py-16 rounded-xl"
              style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
            >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: '#252525' }}
              >
                <Archive className="w-8 h-8" style={{ color: '#888888' }} />
              </div>
              <h3 className="font-medium mb-1" style={{ color: '#f5f5f5' }}>No Archived Tasks</h3>
              <p className="text-sm text-center max-w-xs" style={{ color: '#888888' }}>
                Completed tasks will appear here.
              </p>
            </div>
          ) : (
            Object.values(archivedTasks).map((group) => (
              <div 
                key={group.projectId}
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
              >
                <button
                  onClick={() => toggleProjectExpanded(group.projectId)}
                  className="w-full flex items-center justify-between p-4 hover:bg-[#252525] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#2a2a2a' }}
                    >
                      <FolderOpen className="w-4 h-4" style={{ color: '#888888' }} />
                    </div>
                    <span className="font-medium" style={{ color: '#888888' }}>{group.projectName}</span>
                    <span 
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ backgroundColor: '#2a2a2a', color: '#888888' }}
                    >
                      {group.tasks.length} archived
                    </span>
                  </div>
                  {expandedProjects.includes(group.projectId) ? (
                    <ChevronDown className="w-4 h-4" style={{ color: '#888888' }} />
                  ) : (
                    <ChevronRight className="w-4 h-4" style={{ color: '#888888' }} />
                  )}
                </button>
                
                {expandedProjects.includes(group.projectId) && (
                  <div style={{ borderTop: '1px solid #2a2a2a' }}>
                    {group.tasks.map((task) => (
                      <div 
                        key={task.id}
                        className="flex items-center gap-3 px-4 py-3"
                        style={{ borderBottom: '1px solid #2a2a2a' }}
                      >
                        <div 
                          className="w-5 h-5 rounded flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)' }}
                        >
                          <Check className="w-3 h-3" style={{ color: '#4ADE80' }} />
                        </div>
                        <span className="flex-1 line-through" style={{ color: '#888888' }}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )
        )}
      </div>
    </div>
  )
}
