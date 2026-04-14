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
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-foreground text-sm">Task Pulse</h3>
          {totalCount > 0 && (
            <span className="text-xs text-muted-foreground">
              {completedCount}/{totalCount}
            </span>
          )}
        </div>
        {!isAdding && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="px-4 py-2 border-b border-border bg-muted/30">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="max-h-64 overflow-y-auto">
        {project.tasks.length === 0 && !isAdding ? (
          <div className="px-4 py-8 text-center">
            <Circle className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">No tasks yet</p>
            <button
              onClick={() => setIsAdding(true)}
              className="text-xs text-primary hover:underline mt-1"
            >
              Add your first task
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {project.tasks.map((task) => (
              <li
                key={task.id}
                className="group flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors"
              >
                <button
                  onClick={() => toggleTask(project.id, task.id)}
                  className="flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>
                <span
                  className={cn(
                    'flex-1 text-sm transition-colors',
                    task.completed
                      ? 'text-muted-foreground line-through'
                      : 'text-foreground'
                  )}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => deleteTask(project.id, task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add Task Input */}
        {isAdding && (
          <div className="flex items-center gap-2 px-4 py-2 border-t border-border">
            <Input
              placeholder="Add a task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 text-sm bg-input"
              autoFocus
            />
            <Button size="sm" className="h-8" onClick={handleAddTask}>
              Add
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
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
