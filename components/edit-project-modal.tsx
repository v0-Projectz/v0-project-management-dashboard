'use client'

import { useState, useEffect } from 'react'
import { X, Upload, FolderOpen, Globe, ImageIcon, Save } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

  if (!project) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            Edit Project
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="identity" className="mt-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="identity" className="text-xs">Identity</TabsTrigger>
            <TabsTrigger value="connectivity" className="text-xs">Connectivity</TabsTrigger>
            <TabsTrigger value="status" className="text-xs">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="mt-4 space-y-4">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-sm text-muted-foreground">
                Project Name
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Awesome Project"
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Thumbnail</Label>
              <div className="flex gap-3">
                <div className="w-32 h-20 rounded-lg bg-muted/50 border border-border overflow-hidden flex items-center justify-center">
                  {thumbnail ? (
                    <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
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
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border hover:border-primary/50 transition-colors text-sm text-muted-foreground hover:text-foreground">
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </div>
                  </label>
                  {thumbnail && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setThumbnail('')}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="connectivity" className="mt-4 space-y-4">
            {/* Local Path */}
            <div className="space-y-2">
              <Label htmlFor="edit-path" className="text-sm text-muted-foreground flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Local Path
              </Label>
              <Input
                id="edit-path"
                value={localPath}
                onChange={(e) => setLocalPath(e.target.value)}
                placeholder="C:\Projects\my-project"
                className="bg-muted/50 border-border font-mono text-sm"
              />
            </div>

            {/* Live URL */}
            <div className="space-y-2">
              <Label htmlFor="edit-url" className="text-sm text-muted-foreground flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Live URL
              </Label>
              <Input
                id="edit-url"
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://myproject.com"
                className="bg-muted/50 border-border"
              />
            </div>
          </TabsContent>

          <TabsContent value="status" className="mt-4 space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Project Status</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {status === 'live' ? 'Project is live and accessible online' : 'Project is in local development'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Local</span>
                  <Switch
                    checked={status === 'live'}
                    onCheckedChange={(checked) => setStatus(checked ? 'live' : 'local')}
                  />
                  <span className="text-xs text-primary">Live</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-2xl font-semibold text-foreground">{project.credentials.length}</p>
                <p className="text-xs text-muted-foreground">Credentials</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-2xl font-semibold text-foreground">{project.tasks.length}</p>
                <p className="text-xs text-muted-foreground">Tasks</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
