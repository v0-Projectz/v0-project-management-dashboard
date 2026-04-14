'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { 
  Inbox, 
  Archive, 
  Plus, 
  Check, 
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Task } from '@/lib/types'

type TabType = 'inbox' | 'archived'

export function GlobalTasksView() {
  const [activeTab, setActiveTab] = useState<TabType>('inbox')
  const [quickAddText, setQuickAddText] = useState('')
  const [expandedProjects, setExpandedProjects] = useState<string[]>([])
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)
  
  const projects = useAppStore((s) => s.projects)
  const toggleTask = useAppStore((s) => s.toggleTask)
  const archiveTask = useAppStore((s) => s.archiveTask)
  const deleteTask = useAppStore((s) => s.deleteTask)
  const addTask = useAppStore((s) => s.addTask)
  const updateProject = useAppStore((s) => s.updateProject)
  const appSettings = useAppStore((s) => s.appSettings)
  
  const isDark = appSettings.theme === 'dark'
  
  // Theme colors
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const mutedColor = isDark ? '#888888' : '#6B7280'
  const cardBg = isDark ? '#1c1c1c' : '#FFFFFF'
  const borderColor = isDark ? '#2a2a2a' : '#E5E7EB'
  const surfaceBg = isDark ? '#252525' : '#F9FAFB'
  const hoverBg = isDark ? '#252525' : '#F3F4F6'
  
  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingTaskId])
  
  // Get all incomplete tasks grouped by project
  const inboxTasks = useMemo(() => {
    const grouped: Record<string, { projectId: string; projectName: string; tasks: Task[] }> = {}
    
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
    const grouped: Record<string, { projectId: string; projectName: string; tasks: Task[] }> = {}
    
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
  
  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id)
    setEditingText(task.title)
  }
  
  const handleSaveEdit = (projectId: string) => {
    if (!editingTaskId || !editingText.trim()) {
      setEditingTaskId(null)
      return
    }
    
    const project = projects.find(p => p.id === projectId)
    if (!project) return
    
    const updatedTasks = project.tasks.map(t => 
      t.id === editingTaskId ? { ...t, title: editingText.trim() } : t
    )
    
    updateProject(projectId, { tasks: updatedTasks })
    setEditingTaskId(null)
    setEditingText('')
  }
  
  const inboxCount = Object.values(inboxTasks).reduce((sum, group) => sum + group.tasks.length, 0)
  const archivedCount = Object.values(archivedTasks).reduce((sum, group) => sum + group.tasks.length, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-1" style={{ color: textColor }}>
          Tasks
        </h1>
        <p className="text-sm" style={{ color: mutedColor }}>
          Command center for all project tasks
        </p>
      </div>

      {/* Tabs */}
      <div 
        className={cn('flex gap-1 p-1 rounded-lg w-fit', !isDark && 'card-shadow')}
        style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
      >
        <button
          onClick={() => setActiveTab('inbox')}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          style={{ 
            backgroundColor: activeTab === 'inbox' ? '#4ADE80' : 'transparent',
            color: activeTab === 'inbox' ? '#121212' : mutedColor
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
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          style={{ 
            backgroundColor: activeTab === 'archived' ? '#4ADE80' : 'transparent',
            color: activeTab === 'archived' ? '#121212' : mutedColor
          }}
        >
          <Archive className="w-4 h-4" />
          Archived
          {archivedCount > 0 && (
            <span 
              className="px-1.5 py-0.5 rounded text-xs"
              style={{ 
                backgroundColor: activeTab === 'archived' ? 'rgba(18,18,18,0.2)' : (isDark ? '#2a2a2a' : '#E5E7EB'),
                color: activeTab === 'archived' ? '#121212' : mutedColor
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
          className={cn('flex gap-2 p-4 rounded-xl', !isDark && 'card-shadow')}
          style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
        >
          <Input
            placeholder={projects.length > 0 ? `Quick add task to ${projects[0].name}...` : 'Add a project first...'}
            value={quickAddText}
            onChange={(e) => setQuickAddText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
            disabled={projects.length === 0}
            style={{ backgroundColor: surfaceBg, borderColor, color: textColor }}
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
              className={cn('flex flex-col items-center justify-center py-16 rounded-xl', !isDark && 'card-shadow')}
              style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
            >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: surfaceBg }}
              >
                <Inbox className="w-8 h-8" style={{ color: '#4ADE80' }} />
              </div>
              <h3 className="font-medium mb-1" style={{ color: textColor }}>Inbox Zero</h3>
              <p className="text-sm text-center max-w-xs" style={{ color: mutedColor }}>
                No pending tasks. Add tasks from project cards or use Quick Add above.
              </p>
            </div>
          ) : (
            Object.values(inboxTasks).map((group) => (
              <div 
                key={group.projectId}
                className={cn('rounded-xl overflow-hidden', !isDark && 'card-shadow')}
                style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
              >
                <button
                  onClick={() => toggleProjectExpanded(group.projectId)}
                  className="w-full flex items-center justify-between p-4 transition-colors"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)' }}
                    >
                      <FolderOpen className="w-4 h-4" style={{ color: '#4ADE80' }} />
                    </div>
                    <span className="font-medium" style={{ color: textColor }}>{group.projectName}</span>
                    <span 
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ backgroundColor: isDark ? '#2a2a2a' : '#E5E7EB', color: mutedColor }}
                    >
                      {group.tasks.length} task{group.tasks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {expandedProjects.includes(group.projectId) ? (
                    <ChevronDown className="w-4 h-4" style={{ color: mutedColor }} />
                  ) : (
                    <ChevronRight className="w-4 h-4" style={{ color: mutedColor }} />
                  )}
                </button>
                
                {expandedProjects.includes(group.projectId) && (
                  <div style={{ borderTop: `1px solid ${borderColor}` }}>
                    {group.tasks.map((task) => (
                      <div 
                        key={task.id}
                        className="group flex items-center gap-3 px-4 py-3 transition-all"
                        style={{ borderBottom: `1px solid ${borderColor}` }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <button
                          onClick={() => handleTaskToggle(group.projectId, task.id)}
                          className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0"
                          style={{ borderColor: '#4ADE80' }}
                        >
                          {task.completed && <Check className="w-3 h-3" style={{ color: '#4ADE80' }} />}
                        </button>
                        
                        {editingTaskId === task.id ? (
                          <Input
                            ref={editInputRef}
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(group.projectId)
                              if (e.key === 'Escape') setEditingTaskId(null)
                            }}
                            onBlur={() => handleSaveEdit(group.projectId)}
                            className="flex-1 h-8 text-sm"
                            style={{ backgroundColor: cardBg, borderColor: '#4ADE80', color: textColor }}
                          />
                        ) : (
                          <span 
                            className={cn('flex-1 cursor-pointer', task.completed && 'line-through')}
                            style={{ color: task.completed ? mutedColor : textColor }}
                            onClick={() => handleStartEdit(task)}
                          >
                            {task.title}
                          </span>
                        )}
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEdit(task)}
                            className="p-1.5 rounded transition-colors"
                            style={{ color: mutedColor }}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTask(group.projectId, task.id)}
                            className="p-1.5 rounded transition-colors hover:text-red-500"
                            style={{ color: mutedColor }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
              className={cn('flex flex-col items-center justify-center py-16 rounded-xl', !isDark && 'card-shadow')}
              style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
            >
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: surfaceBg }}
              >
                <Archive className="w-8 h-8" style={{ color: mutedColor }} />
              </div>
              <h3 className="font-medium mb-1" style={{ color: textColor }}>No Archived Tasks</h3>
              <p className="text-sm text-center max-w-xs" style={{ color: mutedColor }}>
                Completed tasks will appear here.
              </p>
            </div>
          ) : (
            Object.values(archivedTasks).map((group) => (
              <div 
                key={group.projectId}
                className={cn('rounded-xl overflow-hidden', !isDark && 'card-shadow')}
                style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
              >
                <button
                  onClick={() => toggleProjectExpanded(group.projectId)}
                  className="w-full flex items-center justify-between p-4 transition-colors"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverBg}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: isDark ? '#2a2a2a' : '#E5E7EB' }}
                    >
                      <FolderOpen className="w-4 h-4" style={{ color: mutedColor }} />
                    </div>
                    <span className="font-medium" style={{ color: mutedColor }}>{group.projectName}</span>
                    <span 
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ backgroundColor: isDark ? '#2a2a2a' : '#E5E7EB', color: mutedColor }}
                    >
                      {group.tasks.length} archived
                    </span>
                  </div>
                  {expandedProjects.includes(group.projectId) ? (
                    <ChevronDown className="w-4 h-4" style={{ color: mutedColor }} />
                  ) : (
                    <ChevronRight className="w-4 h-4" style={{ color: mutedColor }} />
                  )}
                </button>
                
                {expandedProjects.includes(group.projectId) && (
                  <div style={{ borderTop: `1px solid ${borderColor}` }}>
                    {group.tasks.map((task) => (
                      <div 
                        key={task.id}
                        className="group flex items-center gap-3 px-4 py-3"
                        style={{ borderBottom: `1px solid ${borderColor}` }}
                      >
                        <div 
                          className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)' }}
                        >
                          <Check className="w-3 h-3" style={{ color: '#4ADE80' }} />
                        </div>
                        <span className="flex-1 line-through" style={{ color: mutedColor }}>
                          {task.title}
                        </span>
                        <button
                          onClick={() => deleteTask(group.projectId, task.id)}
                          className="p-1.5 rounded transition-colors opacity-0 group-hover:opacity-100 hover:text-red-500"
                          style={{ color: mutedColor }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
