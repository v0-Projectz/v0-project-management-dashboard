'use client'

import { useState } from 'react'
import { 
  X, 
  Key, 
  Mail, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Copy, 
  Check,
  Server,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/lib/store'
import type { Project, Credential, EmailSettings } from '@/lib/types'

interface ProjectVaultProps {
  project: Project
  isOpen: boolean
  onClose: () => void
}

export function ProjectVault({ project, isOpen, onClose }: ProjectVaultProps) {
  const { addCredential, updateCredential, deleteCredential, updateEmailSettings } = useAppStore()
  
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [emailExpanded, setEmailExpanded] = useState(false)
  
  // New credential form
  const [newCredential, setNewCredential] = useState({ label: '', username: '', password: '' })
  const [showNewForm, setShowNewForm] = useState(false)

  // Email settings form
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(
    project.emailSettings || {
      email: '',
      smtpHost: '',
      smtpPort: '',
      smtpUser: '',
      smtpPass: '',
    }
  )

  const togglePassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleCopy = async (text: string, fieldId: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(fieldId)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleAddCredential = () => {
    if (newCredential.label && newCredential.username) {
      addCredential(project.id, newCredential)
      setNewCredential({ label: '', username: '', password: '' })
      setShowNewForm(false)
    }
  }

  const handleSaveEmailSettings = () => {
    updateEmailSettings(project.id, emailSettings)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm" 
        style={{ backgroundColor: 'rgba(18, 18, 18, 0.8)' }}
        onClick={onClose} 
      />
      
      {/* Slide-out Panel */}
      <div 
        className="relative w-full max-w-md h-full overflow-hidden flex flex-col animate-in slide-in-from-right duration-300"
        style={{ backgroundColor: '#1c1c1c', borderLeft: '1px solid #2a2a2a' }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #2a2a2a' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)' }}
            >
              <Key className="w-5 h-5" style={{ color: '#4ADE80' }} />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: '#f5f5f5' }}>{project.name}</h2>
              <p className="text-xs" style={{ color: '#888888' }}>Project Vault</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md transition-colors"
            style={{ color: '#888888' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Credentials Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4" style={{ color: '#4ADE80' }} />
                <h3 className="font-medium" style={{ color: '#f5f5f5' }}>Credentials</h3>
                <span 
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: '#2a2a2a', color: '#888888' }}
                >
                  {project.credentials.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewForm(!showNewForm)}
                className="gap-1.5 h-8"
                style={{ color: '#888888' }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </Button>
            </div>

            {/* New Credential Form */}
            {showNewForm && (
              <div 
                className="p-4 rounded-lg mb-4 space-y-3"
                style={{ backgroundColor: '#252525', border: '1px solid #2a2a2a' }}
              >
                <Input
                  placeholder="Label (e.g., WP Admin)"
                  value={newCredential.label}
                  onChange={(e) => setNewCredential({ ...newCredential, label: e.target.value })}
                  className="h-9"
                  style={{ backgroundColor: '#1c1c1c', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                />
                <Input
                  placeholder="Username"
                  value={newCredential.username}
                  onChange={(e) => setNewCredential({ ...newCredential, username: e.target.value })}
                  className="h-9"
                  style={{ backgroundColor: '#1c1c1c', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={newCredential.password}
                  onChange={(e) => setNewCredential({ ...newCredential, password: e.target.value })}
                  className="h-9"
                  style={{ backgroundColor: '#1c1c1c', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleAddCredential} 
                    className="flex-1"
                    style={{ backgroundColor: '#4ADE80', color: '#121212' }}
                  >
                    Add Credential
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowNewForm(false)
                      setNewCredential({ label: '', username: '', password: '' })
                    }}
                    style={{ color: '#888888' }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Credential List */}
            {project.credentials.length === 0 && !showNewForm ? (
              <div className="text-center py-8">
                <Key className="w-8 h-8 mx-auto mb-2 opacity-50" style={{ color: '#888888' }} />
                <p className="text-sm" style={{ color: '#888888' }}>No credentials stored</p>
              </div>
            ) : (
              <div className="space-y-3">
                {project.credentials.map((cred) => (
                  <CredentialItem
                    key={cred.id}
                    credential={cred}
                    showPassword={showPasswords[cred.id] || false}
                    copiedField={copiedField}
                    onTogglePassword={() => togglePassword(cred.id)}
                    onCopy={(text, fieldId) => handleCopy(text, fieldId)}
                    onUpdate={(updates) => updateCredential(project.id, cred.id, updates)}
                    onDelete={() => deleteCredential(project.id, cred.id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Email & SMTP Section */}
          <section>
            <button
              onClick={() => setEmailExpanded(!emailExpanded)}
              className="w-full flex items-center justify-between py-2 text-left"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" style={{ color: '#4ADE80' }} />
                <h3 className="font-medium" style={{ color: '#f5f5f5' }}>Email & SMTP</h3>
              </div>
              {emailExpanded ? (
                <ChevronUp className="w-4 h-4" style={{ color: '#888888' }} />
              ) : (
                <ChevronDown className="w-4 h-4" style={{ color: '#888888' }} />
              )}
            </button>

            {emailExpanded && (
              <div 
                className="mt-4 p-4 rounded-lg space-y-4"
                style={{ backgroundColor: '#252525', border: '1px solid #2a2a2a' }}
              >
                <div className="space-y-2">
                  <Label className="text-xs" style={{ color: '#888888' }}>Email Address</Label>
                  <Input
                    placeholder="admin@example.com"
                    value={emailSettings.email}
                    onChange={(e) => setEmailSettings({ ...emailSettings, email: e.target.value })}
                    className="h-9"
                    style={{ backgroundColor: '#1c1c1c', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                  />
                </div>

                <div className="pt-2" style={{ borderTop: '1px solid #2a2a2a' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Server className="w-3.5 h-3.5" style={{ color: '#888888' }} />
                    <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#888888' }}>
                      SMTP Settings
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs" style={{ color: '#888888' }}>Host</Label>
                      <Input
                        placeholder="smtp.example.com"
                        value={emailSettings.smtpHost}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                        className="h-9 text-sm"
                        style={{ backgroundColor: '#1c1c1c', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs" style={{ color: '#888888' }}>Port</Label>
                      <Input
                        placeholder="587"
                        value={emailSettings.smtpPort}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                        className="h-9 text-sm"
                        style={{ backgroundColor: '#1c1c1c', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="space-y-2">
                      <Label className="text-xs" style={{ color: '#888888' }}>Username</Label>
                      <Input
                        placeholder="smtp_user"
                        value={emailSettings.smtpUser}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                        className="h-9 text-sm"
                        style={{ backgroundColor: '#1c1c1c', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs" style={{ color: '#888888' }}>Password</Label>
                      <Input
                        type="password"
                        placeholder="smtp_pass"
                        value={emailSettings.smtpPass}
                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpPass: e.target.value })}
                        className="h-9 text-sm"
                        style={{ backgroundColor: '#1c1c1c', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  size="sm" 
                  onClick={handleSaveEmailSettings} 
                  className="w-full"
                  style={{ backgroundColor: '#4ADE80', color: '#121212' }}
                >
                  Save Email Settings
                </Button>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div 
          className="px-6 py-4 text-center"
          style={{ borderTop: '1px solid #2a2a2a' }}
        >
          <p className="text-xs" style={{ color: '#888888' }}>
            All credentials are stored locally and encrypted
          </p>
        </div>
      </div>
    </div>
  )
}

// Credential Item Component
interface CredentialItemProps {
  credential: Credential
  showPassword: boolean
  copiedField: string | null
  onTogglePassword: () => void
  onCopy: (text: string, fieldId: string) => void
  onUpdate: (updates: Partial<Credential>) => void
  onDelete: () => void
}

function CredentialItem({
  credential,
  showPassword,
  copiedField,
  onTogglePassword,
  onCopy,
  onDelete,
}: CredentialItemProps) {
  return (
    <div 
      className="p-4 rounded-lg"
      style={{ backgroundColor: '#252525', border: '1px solid #2a2a2a' }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium" style={{ color: '#f5f5f5' }}>{credential.label}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          style={{ color: '#888888' }}
          onClick={onDelete}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Username Row */}
      <div className="flex items-center gap-2 mb-2">
        <div 
          className="flex-1 rounded px-3 py-1.5 text-sm font-mono"
          style={{ backgroundColor: '#1c1c1c', color: '#f5f5f5' }}
        >
          {credential.username}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          style={{ color: '#888888' }}
          onClick={() => onCopy(credential.username, `${credential.id}-user`)}
        >
          {copiedField === `${credential.id}-user` ? (
            <Check className="w-3.5 h-3.5" style={{ color: '#4ADE80' }} />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>

      {/* Password Row */}
      <div className="flex items-center gap-2">
        <div 
          className="flex-1 rounded px-3 py-1.5 text-sm font-mono"
          style={{ backgroundColor: '#1c1c1c', color: '#f5f5f5' }}
        >
          {showPassword ? credential.password : '••••••••'}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          style={{ color: '#888888' }}
          onClick={onTogglePassword}
        >
          {showPassword ? (
            <EyeOff className="w-3.5 h-3.5" />
          ) : (
            <Eye className="w-3.5 h-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          style={{ color: '#888888' }}
          onClick={() => onCopy(credential.password, `${credential.id}-pass`)}
        >
          {copiedField === `${credential.id}-pass` ? (
            <Check className="w-3.5 h-3.5" style={{ color: '#4ADE80' }} />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
    </div>
  )
}
