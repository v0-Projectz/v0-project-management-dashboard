'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  X, 
  Plus, 
  Check, 
  Trash2, 
  Pencil,
  FolderOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Project, Task } from '@/lib/types'

interface TaskDrawerProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
}

export function TaskDrawer({ isOpen, onClose, project }: TaskDrawerProps) {
  const [newTaskText, setNewTaskText] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)
  
  const addTask = useAppStore((s) => s.addTask)
  const toggleTask = useAppStore((s) => s.toggleTask)
  const deleteTask = useAppStore((s) => s.deleteTask)
  const updateProject = useAppStore((s) => s.updateProject)
  const appSettings = useAppStore((s) => s.appSettings)
  const projects = useAppStore((s) => s.projects)
  
  // Get live project data from store
  const liveProject = projects.find(p => p.id === project?.id) || project
  
  const isDark = appSettings.theme === 'dark'
  
  // Theme colors
  const bgColor = isDark ? '#121212' : '#FFFFFF'
  const surfaceColor = isDark ? '#1c1c1c' : '#F9FAFB'
  const borderColor = isDark ? '#2a2a2a' : '#E5E7EB'
  const textColor = isDark ? '#f5f5f5' : '#111827'
  const mutedColor = isDark ? '#888888' : '#6B7280'
  
  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingTaskId])
  
  const handleAddTask = () => {
    if (!newTaskText.trim() || !liveProject) return
    addTask(liveProject.id, newTaskText.trim())
    setNewTaskText('')
  }
  
  const handleToggleTask = (taskId: string) => {
    if (!liveProject) return
    toggleTask(liveProject.id, taskId)
  }
  
  const handleDeleteTask = (taskId: string) => {
    if (!liveProject) return
    deleteTask(liveProject.id, taskId)
  }
  
  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id)
    setEditingText(task.title)
  }
  
  const handleSaveEdit = () => {
    if (!liveProject || !editingTaskId || !editingText.trim()) {
      setEditingTaskId(null)
      return
    }
    
    const updatedTasks = liveProject.tasks.map(t => 
      t.id === editingTaskId ? { ...t, title: editingText.trim() } : t
    )
    
    updateProject(liveProject.id, { tasks: updatedTasks })
    setEditingTaskId(null)
    setEditingText('')
  }
  
  const handleKeyDown = (e: React.KeyboardEvent, action: 'add' | 'edit') => {
    if (e.key === 'Enter') {
      if (action === 'add') handleAddTask()
      else handleSaveEdit()
    }
    if (e.key === 'Escape' && action === 'edit') {
      setEditingTaskId(null)
    }
  }
  
  if (!liveProject) return null
  
  const incompleteTasks = liveProject.tasks.filter(t => !t.completed && !t.archived)
  const completedTasks = liveProject.tasks.filter(t => t.completed || t.archived)
  const totalTasks = liveProject.tasks.length
  const completedCount = completedTasks.length
  const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          'fixed inset-0 z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div
        className={cn(
          'fixed right-0 top-0 h-screen w-full max-w-md z-50 transform transition-transform duration-300 ease-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ 
          backgroundColor: bgColor,
          borderLeft: `1px solid ${borderColor}`
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${borderColor}` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)' }}
            >
              <FolderOpen className="w-5 h-5" style={{ color: '#4ADE80' }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: textColor }}>{liveProject.name}</h2>
              <p className="text-xs truncate max-w-[200px]" style={{ color: mutedColor }}>
                {liveProject.localPath}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-opacity-10"
            style={{ color: mutedColor }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Progress Summary */}
        <div 
          className="p-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${borderColor}` }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: textColor }}>Task Progress</span>
            <span className="text-sm font-semibold" style={{ color: '#4ADE80' }}>{progress}%</span>
          </div>
          <div 
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: isDark ? '#2a2a2a' : '#E5E7EB' }}
          >
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: '#4ADE80' }}
            />
          </div>
          <p className="text-xs mt-2" style={{ color: mutedColor }}>
            {completedCount} of {totalTasks} tasks completed
          </p>
        </div>
        
        {/* Add Task Input */}
        <div className="p-4 flex-shrink-0" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'add')}
              style={{ 
                backgroundColor: surfaceColor, 
                borderColor, 
                color: textColor 
              }}
            />
            <Button 
              onClick={handleAddTask}
              disabled={!newTaskText.trim()}
              size="icon"
              style={{ backgroundColor: '#4ADE80', color: '#121212' }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Task List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Incomplete Tasks */}
          {incompleteTasks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: mutedColor }}>
                Active ({incompleteTasks.length})
              </h3>
              <div className="space-y-2">
                {incompleteTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="group flex items-center gap-3 p-3 rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: surfaceColor,
                      border: `1px solid ${borderColor}`
                    }}
                  >
                    <button
                      onClick={() => handleToggleTask(task.id)}
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
                        onKeyDown={(e) => handleKeyDown(e, 'edit')}
                        onBlur={handleSaveEdit}
                        className="flex-1 h-8 text-sm"
                        style={{ 
                          backgroundColor: bgColor, 
                          borderColor: '#4ADE80', 
                          color: textColor 
                        }}
                      />
                    ) : (
                      <span 
                        className="flex-1 text-sm cursor-pointer"
                        style={{ color: textColor }}
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
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 rounded transition-colors hover:text-red-500"
                        style={{ color: mutedColor }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: mutedColor }}>
                Completed ({completedTasks.length})
              </h3>
              <div className="space-y-2">
                {completedTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="group flex items-center gap-3 p-3 rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: surfaceColor,
                      border: `1px solid ${borderColor}`,
                      opacity: 0.6
                    }}
                  >
                    <div 
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)' }}
                    >
                      <Check className="w-3 h-3" style={{ color: '#4ADE80' }} />
                    </div>
                    <span 
                      className="flex-1 text-sm line-through"
                      style={{ color: mutedColor }}
                    >
                      {task.title}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 rounded transition-colors opacity-0 group-hover:opacity-100 hover:text-red-500"
                      style={{ color: mutedColor }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {incompleteTasks.length === 0 && completedTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: surfaceColor }}
              >
                <Check className="w-8 h-8" style={{ color: '#4ADE80' }} />
              </div>
              <h3 className="font-medium mb-1" style={{ color: textColor }}>No Tasks Yet</h3>
              <p className="text-sm text-center max-w-xs" style={{ color: mutedColor }}>
                Add your first task using the input above
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
