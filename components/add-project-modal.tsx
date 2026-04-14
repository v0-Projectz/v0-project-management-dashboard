'use client'

import { useState } from 'react'
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Link2, 
  Key, 
  Radio,
  Plus,
  Trash2,
  Check,
  ImageIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/lib/store'
import type { Credential, WizardStep } from '@/lib/types'

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

const steps: { id: WizardStep; label: string; icon: React.ElementType }[] = [
  { id: 'identity', label: 'Identity', icon: User },
  { id: 'connectivity', label: 'Connectivity', icon: Link2 },
  { id: 'credentials', label: 'Credentials', icon: Key },
  { id: 'status', label: 'Status', icon: Radio },
]

export function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  const addProject = useAppStore((s) => s.addProject)
  
  const [currentStep, setCurrentStep] = useState<WizardStep>('identity')
  
  // Form state
  const [name, setName] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [localPath, setLocalPath] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [credentials, setCredentials] = useState<Omit<Credential, 'id'>[]>([])
  const [status, setStatus] = useState<'local' | 'live'>('local')

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id)
    }
  }

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id)
    }
  }

  const handleAddCredential = () => {
    setCredentials([...credentials, { label: '', username: '', password: '' }])
  }

  const handleUpdateCredential = (index: number, field: keyof Omit<Credential, 'id'>, value: string) => {
    const updated = [...credentials]
    updated[index] = { ...updated[index], [field]: value }
    setCredentials(updated)
  }

  const handleRemoveCredential = (index: number) => {
    setCredentials(credentials.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    addProject({
      name,
      thumbnail: thumbnail || undefined,
      localPath,
      liveUrl: liveUrl || undefined,
      status,
      credentials: credentials.map((c, i) => ({ ...c, id: `cred-${i}` })),
      tasks: [],
    })
    handleClose()
  }

  const handleClose = () => {
    // Reset form
    setCurrentStep('identity')
    setName('')
    setThumbnail('')
    setLocalPath('')
    setLiveUrl('')
    setCredentials([])
    setStatus('local')
    onClose()
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'identity':
        return name.trim().length > 0
      case 'connectivity':
        return localPath.trim().length > 0
      case 'credentials':
        return true // Optional step
      case 'status':
        return true
      default:
        return false
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm" 
        style={{ backgroundColor: 'rgba(18, 18, 18, 0.8)' }}
        onClick={handleClose} 
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #2a2a2a' }}
        >
          <h2 className="text-lg font-semibold" style={{ color: '#f5f5f5' }}>New Project</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-md transition-colors"
            style={{ color: '#888888' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicators */}
        <div 
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #2a2a2a' }}
        >
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = index < currentStepIndex
            
            return (
              <div key={step.id} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{ 
                      backgroundColor: isActive ? '#4ADE80' : isCompleted ? 'rgba(74, 222, 128, 0.2)' : '#2a2a2a',
                      color: isActive ? '#121212' : isCompleted ? '#4ADE80' : '#888888'
                    }}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className="text-xs font-medium hidden sm:block"
                    style={{ color: isActive ? '#f5f5f5' : '#888888' }}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className="w-8 h-px mx-2"
                    style={{ backgroundColor: isCompleted ? '#4ADE80' : '#2a2a2a' }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Content */}
        <div className="p-6 min-h-[280px]">
          {/* Step 1: Identity */}
          {currentStep === 'identity' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" style={{ color: '#f5f5f5' }}>Project Name</Label>
                <Input
                  id="name"
                  placeholder="My Awesome Project"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ backgroundColor: '#252525', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail" style={{ color: '#f5f5f5' }}>Thumbnail URL (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="thumbnail"
                    placeholder="https://example.com/image.jpg"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    style={{ backgroundColor: '#252525', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                  />
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    type="button"
                    style={{ backgroundColor: '#2a2a2a', color: '#888888' }}
                  >
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs" style={{ color: '#888888' }}>
                  Add a screenshot or logo for visual identification
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Connectivity */}
          {currentStep === 'connectivity' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="localPath" style={{ color: '#f5f5f5' }}>Local Path</Label>
                <Input
                  id="localPath"
                  placeholder="C:\Projects\my-project"
                  value={localPath}
                  onChange={(e) => setLocalPath(e.target.value)}
                  className="font-mono text-sm"
                  style={{ backgroundColor: '#252525', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                  autoFocus
                />
                <p className="text-xs" style={{ color: '#888888' }}>
                  Full path to your project directory
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="liveUrl" style={{ color: '#f5f5f5' }}>Live URL (Optional)</Label>
                <Input
                  id="liveUrl"
                  placeholder="https://myproject.com"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  style={{ backgroundColor: '#252525', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                />
                <p className="text-xs" style={{ color: '#888888' }}>
                  Production website URL if deployed
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Credentials */}
          {currentStep === 'credentials' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium" style={{ color: '#f5f5f5' }}>Vault Entries</h3>
                  <p className="text-xs" style={{ color: '#888888' }}>
                    Store login credentials securely
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleAddCredential}
                  className="gap-1.5"
                  style={{ backgroundColor: '#4ADE80', color: '#121212' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </Button>
              </div>

              {credentials.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Key className="w-8 h-8 mb-2" style={{ color: '#888888' }} />
                  <p className="text-sm" style={{ color: '#888888' }}>
                    No credentials added yet
                  </p>
                  <p className="text-xs" style={{ color: '#888888' }}>
                    Click &quot;Add&quot; to store login details
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {credentials.map((cred, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg space-y-2"
                      style={{ backgroundColor: '#252525', border: '1px solid #2a2a2a' }}
                    >
                      <div className="flex items-center justify-between">
                        <Input
                          placeholder="Label (e.g., WP Admin)"
                          value={cred.label}
                          onChange={(e) => handleUpdateCredential(index, 'label', e.target.value)}
                          className="h-8 text-sm"
                          style={{ backgroundColor: '#1c1c1c', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-2"
                          style={{ color: '#888888' }}
                          onClick={() => handleRemoveCredential(index)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Username"
                          value={cred.username}
                          onChange={(e) => handleUpdateCredential(index, 'username', e.target.value)}
                          className="h-8 text-sm"
                          style={{ backgroundColor: '#1c1c1c', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                        />
                        <Input
                          type="password"
                          placeholder="Password"
                          value={cred.password}
                          onChange={(e) => handleUpdateCredential(index, 'password', e.target.value)}
                          className="h-8 text-sm"
                          style={{ backgroundColor: '#1c1c1c', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Status */}
          {currentStep === 'status' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1" style={{ color: '#f5f5f5' }}>Project Status</h3>
                <p className="text-xs" style={{ color: '#888888' }}>
                  Is this project running locally or deployed live?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('local')}
                  className="p-4 rounded-xl border-2 transition-all text-left"
                  style={{ 
                    borderColor: status === 'local' ? '#4ADE80' : '#2a2a2a',
                    backgroundColor: status === 'local' ? 'rgba(74, 222, 128, 0.1)' : 'transparent'
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: status === 'local' ? '#4ADE80' : '#888888' }}
                    >
                      {status === 'local' && (
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4ADE80' }} />
                      )}
                    </div>
                    <span className="font-medium" style={{ color: '#f5f5f5' }}>Local</span>
                  </div>
                  <p className="text-xs" style={{ color: '#888888' }}>
                    Development environment
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('live')}
                  className="p-4 rounded-xl border-2 transition-all text-left"
                  style={{ 
                    borderColor: status === 'live' ? '#4ADE80' : '#2a2a2a',
                    backgroundColor: status === 'live' ? 'rgba(74, 222, 128, 0.1)' : 'transparent'
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: status === 'live' ? '#4ADE80' : '#888888' }}
                    >
                      {status === 'live' && (
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4ADE80' }} />
                      )}
                    </div>
                    <span className="font-medium" style={{ color: '#f5f5f5' }}>Live</span>
                  </div>
                  <p className="text-xs" style={{ color: '#888888' }}>
                    Deployed to production
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: '1px solid #2a2a2a', backgroundColor: '#1a1a1a' }}
        >
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className="gap-1.5"
            style={{ color: currentStepIndex === 0 ? '#555555' : '#888888' }}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStepIndex === steps.length - 1 ? (
            <Button 
              onClick={handleSubmit} 
              disabled={!canProceed()} 
              className="gap-1.5"
              style={{ backgroundColor: '#4ADE80', color: '#121212' }}
            >
              Create Project
              <Check className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              disabled={!canProceed()} 
              className="gap-1.5"
              style={{ backgroundColor: '#4ADE80', color: '#121212' }}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
