'use client'

import { useState, useEffect } from 'react'
import { X, Upload, FolderOpen, Globe, ImageIcon, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAppStore } from '@/lib/store'
import type { Project } from '@/lib/types'

interface EditProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function EditProjectModal({ project, isOpen, onClose }: EditProjectModalProps) {
  const updateProject = useAppStore((s) => s.updateProject)
  
  const [name, setName] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [localPath, setLocalPath] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [status, setStatus] = useState<'local' | 'live'>('local')
  const [activeTab, setActiveTab] = useState<'identity' | 'connectivity' | 'status'>('identity')

  useEffect(() => {
    if (project) {
      setName(project.name)
      setThumbnail(project.thumbnail || '')
      setLocalPath(project.localPath)
      setLiveUrl(project.liveUrl || '')
      setStatus(project.status)
    }
  }, [project])

  const handleSave = () => {
    if (!project) return
    
    updateProject(project.id, {
      name,
      thumbnail: thumbnail || undefined,
      localPath,
      liveUrl: liveUrl || undefined,
      status,
    })
    onClose()
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnail(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!project || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm" 
        style={{ backgroundColor: 'rgba(18, 18, 18, 0.8)' }}
        onClick={onClose} 
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
          <h2 className="text-lg font-semibold" style={{ color: '#f5f5f5' }}>Edit Project</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md transition-colors"
            style={{ color: '#888888' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-3" style={{ borderBottom: '1px solid #2a2a2a' }}>
          <div 
            className="grid grid-cols-3 rounded-lg p-1"
            style={{ backgroundColor: '#252525' }}
          >
            {(['identity', 'connectivity', 'status'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3 py-2 rounded-md text-xs font-medium transition-colors capitalize"
                style={{ 
                  backgroundColor: activeTab === tab ? '#2a2a2a' : 'transparent',
                  color: activeTab === tab ? '#f5f5f5' : '#888888'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[280px]">
          {/* Identity Tab */}
          {activeTab === 'identity' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-sm" style={{ color: '#888888' }}>
                  Project Name
                </Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Awesome Project"
                  style={{ backgroundColor: '#252525', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm" style={{ color: '#888888' }}>Thumbnail</Label>
                <div className="flex gap-3">
                  <div 
                    className="w-32 h-20 rounded-lg overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: '#252525', border: '1px solid #2a2a2a' }}
                  >
                    {thumbnail ? (
                      <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8" style={{ color: '#888888' }} />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                      />
                      <div 
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed transition-colors text-sm"
                        style={{ borderColor: '#2a2a2a', color: '#888888' }}
                      >
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </div>
                    </label>
                    {thumbnail && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setThumbnail('')}
                        className="text-xs"
                        style={{ color: '#888888' }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Connectivity Tab */}
          {activeTab === 'connectivity' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-path" className="text-sm flex items-center gap-2" style={{ color: '#888888' }}>
                  <FolderOpen className="w-4 h-4" />
                  Local Path
                </Label>
                <Input
                  id="edit-path"
                  value={localPath}
                  onChange={(e) => setLocalPath(e.target.value)}
                  placeholder="C:\Projects\my-project"
                  className="font-mono text-sm"
                  style={{ backgroundColor: '#252525', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-url" className="text-sm flex items-center gap-2" style={{ color: '#888888' }}>
                  <Globe className="w-4 h-4" />
                  Live URL
                </Label>
                <Input
                  id="edit-url"
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://myproject.com"
                  style={{ backgroundColor: '#252525', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                />
              </div>
            </div>
          )}

          {/* Status Tab */}
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: '#252525', border: '1px solid #2a2a2a' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#f5f5f5' }}>Project Status</p>
                    <p className="text-xs mt-1" style={{ color: '#888888' }}>
                      {status === 'live' ? 'Project is live and accessible online' : 'Project is in local development'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: '#888888' }}>Local</span>
                    <Switch
                      checked={status === 'live'}
                      onCheckedChange={(checked) => setStatus(checked ? 'live' : 'local')}
                    />
                    <span className="text-xs" style={{ color: '#4ADE80' }}>Live</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#252525', border: '1px solid #2a2a2a' }}
                >
                  <p className="text-2xl font-semibold" style={{ color: '#f5f5f5' }}>{project.credentials.length}</p>
                  <p className="text-xs" style={{ color: '#888888' }}>Credentials</p>
                </div>
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#252525', border: '1px solid #2a2a2a' }}
                >
                  <p className="text-2xl font-semibold" style={{ color: '#f5f5f5' }}>{project.tasks.length}</p>
                  <p className="text-xs" style={{ color: '#888888' }}>Tasks</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="flex justify-end gap-2 px-6 py-4"
          style={{ borderTop: '1px solid #2a2a2a', backgroundColor: '#1a1a1a' }}
        >
          <Button 
            variant="ghost" 
            onClick={onClose}
            style={{ color: '#888888' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="gap-2"
            style={{ backgroundColor: '#4ADE80', color: '#121212' }}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
