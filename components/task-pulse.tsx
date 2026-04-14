'use client'

import { useState } from 'react'
import { Plus, X, CheckCircle2, Circle, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import type { Project } from '@/lib/types'

interface TaskPulseProps {
  project: Project
}

export function TaskPulse({ project }: TaskPulseProps) {
  const { addTask, toggleTask, deleteTask } = useAppStore()
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(project.id, newTaskTitle.trim())
      setNewTaskTitle('')
      setIsAdding(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask()
    } else if (e.key === 'Escape') {
      setIsAdding(false)
      setNewTaskTitle('')
    }
  }

  const completedCount = project.tasks.filter((t) => t.completed).length
  const totalCount = project.tasks.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div 
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid #2a2a2a' }}
      >
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-sm" style={{ color: '#f5f5f5' }}>Task Pulse</h3>
          {totalCount > 0 && (
            <span className="text-xs" style={{ color: '#888888' }}>
              {completedCount}/{totalCount}
            </span>
          )}
        </div>
        {!isAdding && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            style={{ color: '#888888' }}
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div 
          className="px-4 py-2"
          style={{ borderBottom: '1px solid #2a2a2a', backgroundColor: '#1a1a1a' }}
        >
          <div 
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: '#2a2a2a' }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: '#4ADE80' }}
            />
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="max-h-64 overflow-y-auto">
        {project.tasks.length === 0 && !isAdding ? (
          <div className="px-4 py-8 text-center">
            <Circle className="w-8 h-8 mx-auto mb-2 opacity-50" style={{ color: '#888888' }} />
            <p className="text-sm" style={{ color: '#888888' }}>No tasks yet</p>
            <button
              onClick={() => setIsAdding(true)}
              className="text-xs mt-1"
              style={{ color: '#4ADE80' }}
            >
              Add your first task
            </button>
          </div>
        ) : (
          <ul>
            {project.tasks.map((task) => (
              <li
                key={task.id}
                className="group flex items-center gap-3 px-4 py-2.5 transition-colors"
                style={{ borderBottom: '1px solid #2a2a2a' }}
              >
                <button
                  onClick={() => toggleTask(project.id, task.id)}
                  className="flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4" style={{ color: '#4ADE80' }} />
                  ) : (
                    <Circle className="w-4 h-4 transition-colors" style={{ color: '#888888' }} />
                  )}
                </button>
                <span
                  className={cn(
                    'flex-1 text-sm transition-colors',
                    task.completed && 'line-through'
                  )}
                  style={{ color: task.completed ? '#888888' : '#f5f5f5' }}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => deleteTask(project.id, task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 transition-all"
                  style={{ color: '#888888' }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add Task Input */}
        {isAdding && (
          <div 
            className="flex items-center gap-2 px-4 py-2"
            style={{ borderTop: '1px solid #2a2a2a' }}
          >
            <Input
              placeholder="Add a task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 text-sm"
              style={{ backgroundColor: '#252525', borderColor: '#2a2a2a', color: '#f5f5f5' }}
              autoFocus
            />
            <Button 
              size="sm" 
              className="h-8" 
              onClick={handleAddTask}
              style={{ backgroundColor: '#4ADE80', color: '#121212' }}
            >
              Add
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              style={{ color: '#888888' }}
              onClick={() => {
                setIsAdding(false)
                setNewTaskTitle('')
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
