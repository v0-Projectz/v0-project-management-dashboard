'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  X, 
  Plus, 
  Trash2, 
  Pencil,
  FolderOpen,
  Circle,
  Clock,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Project, Task, TaskStatus } from '@/lib/types'

interface TaskDrawerProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
}

// Status configuration
const statusConfig: Record<TaskStatus, { label: string; icon: typeof Circle; color: string; bgColor: string }> = {
  'todo': { 
    label: 'To Do', 
    icon: Circle, 
    color: '#888888',
    bgColor: 'rgba(136, 136, 136, 0.1)'
  },
  'in-progress': { 
    label: 'In Progress', 
    icon: Clock, 
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.1)'
  },
  'done': { 
    label: 'Done', 
    icon: CheckCircle2, 
    color: '#4ADE80',
    bgColor: 'rgba(74, 222, 128, 0.1)'
  },
}

export function TaskDrawer({ isOpen, onClose, project }: TaskDrawerProps) {
  const [newTaskText, setNewTaskText] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)
  
  const addTask = useAppStore((s) => s.addTask)
  const cycleTaskStatus = useAppStore((s) => s.cycleTaskStatus)
  const updateTaskTitle = useAppStore((s) => s.updateTaskTitle)
  const deleteTask = useAppStore((s) => s.deleteTask)
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
  
  const handleCycleStatus = (taskId: string) => {
    if (!liveProject) return
    cycleTaskStatus(liveProject.id, taskId)
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
    updateTaskTitle(liveProject.id, editingTaskId, editingText.trim())
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
  
  // Separate tasks by status
  const todoTasks = liveProject.tasks.filter(t => (t.status || 'todo') === 'todo' && !t.archived)
  const inProgressTasks = liveProject.tasks.filter(t => t.status === 'in-progress' && !t.archived)
  const doneTasks = liveProject.tasks.filter(t => t.status === 'done' || t.archived)
  
  const totalTasks = liveProject.tasks.length
  const completedCount = doneTasks.length
  const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0

  const renderTask = (task: Task) => {
    const status = task.status || 'todo'
    const config = statusConfig[status]
    const StatusIcon = config.icon
    const isDone = status === 'done'
    const isInProgress = status === 'in-progress'
    
    return (
      <div 
        key={task.id}
        className={cn(
          'group flex items-center gap-3 p-3 rounded-lg transition-all',
          isDone && 'opacity-60'
        )}
        style={{ 
          backgroundColor: isInProgress 
            ? (isDark ? 'rgba(245, 158, 11, 0.05)' : 'rgba(245, 158, 11, 0.08)')
            : surfaceColor,
          border: `1px solid ${isInProgress ? 'rgba(245, 158, 11, 0.3)' : borderColor}`,
          boxShadow: isInProgress ? '0 0 12px rgba(245, 158, 11, 0.1)' : 'none'
        }}
      >
        {/* Status Badge - Clickable */}
        <button
          onClick={() => handleCycleStatus(task.id)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md transition-all hover:scale-105 flex-shrink-0"
          style={{ backgroundColor: config.bgColor }}
          title={`Status: ${config.label} (click to change)`}
        >
          <StatusIcon className="w-3.5 h-3.5" style={{ color: config.color }} />
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: config.color }}>
            {config.label}
          </span>
        </button>
        
        {/* Task Title - Editable */}
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
            className={cn(
              'flex-1 text-sm cursor-pointer transition-colors hover:opacity-80',
              isDone && 'line-through'
            )}
            style={{ color: isDone ? mutedColor : textColor }}
            onClick={() => handleStartEdit(task)}
          >
            {task.title}
          </span>
        )}
        
        {/* Actions */}
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
    )
  }

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
          <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: mutedColor }}>
            <span className="flex items-center gap-1">
              <Circle className="w-3 h-3" style={{ color: '#888888' }} />
              {todoTasks.length} To Do
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" style={{ color: '#F59E0B' }} />
              {inProgressTasks.length} In Progress
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" style={{ color: '#4ADE80' }} />
              {doneTasks.length} Done
            </span>
          </div>
        </div>
        
        {/* Add Task Input */}
        <div className="p-4 flex-shrink-0" style={{ borderBottom: `1px solid ${borderColor}` }}>
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'add')}
              className="text-base"
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
          {/* To Do Tasks */}
          {todoTasks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: mutedColor }}>
                <Circle className="w-3 h-3" style={{ color: '#888888' }} />
                To Do ({todoTasks.length})
              </h3>
              <div className="space-y-2">
                {todoTasks.map(renderTask)}
              </div>
            </div>
          )}
          
          {/* In Progress Tasks */}
          {inProgressTasks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: '#F59E0B' }}>
                <Clock className="w-3 h-3" />
                In Progress ({inProgressTasks.length})
              </h3>
              <div className="space-y-2">
                {inProgressTasks.map(renderTask)}
              </div>
            </div>
          )}
          
          {/* Done Tasks */}
          {doneTasks.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: '#4ADE80' }}>
                <CheckCircle2 className="w-3 h-3" />
                Done ({doneTasks.length})
              </h3>
              <div className="space-y-2">
                {doneTasks.map(renderTask)}
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {todoTasks.length === 0 && inProgressTasks.length === 0 && doneTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: surfaceColor }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: '#4ADE80' }} />
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
