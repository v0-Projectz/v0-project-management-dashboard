'use client'

import { useState } from 'react'
import { Users, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAppStore } from '@/lib/store'
import type { RegisteredUser } from '@/lib/types'

interface UserManagementModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UserManagementModal({ isOpen, onClose }: UserManagementModalProps) {
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [tempPassword, setTempPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const { users, inviteUser, deleteUser, user } = useAppStore()

  const isAdmin = user?.role === 'admin'

  const handleInviteUser = () => {
    if (!username.trim() || !email.trim() || !tempPassword.trim()) {
      setMessage({ type: 'error', text: 'All fields are required' })
      return
    }

    if (tempPassword.length < 6) {
      setMessage({ type: 'error', text: 'Temporary password must be at least 6 characters' })
      return
    }

    if (users.some(u => u.username === username)) {
      setMessage({ type: 'error', text: 'Username already exists' })
      return
    }

    inviteUser(username, email, tempPassword)
    setMessage({ type: 'success', text: 'User invited successfully! Credentials sent via email.' })
    setUsername('')
    setEmail('')
    setTempPassword('')
    setTimeout(() => {
      setShowInviteForm(false)
      setMessage(null)
    }, 2000)
  }

  const handleDeleteUser = (userId: string) => {
    if (deleteUser(userId)) {
      setMessage({ type: 'success', text: 'User deleted successfully' })
      setDeleteConfirm(null)
      setTimeout(() => setMessage(null), 2000)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" style={{ color: '#f5f5f5' }}>
            <Users className="w-5 h-5" style={{ color: '#4ADE80' }} />
            User Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invite New User Section */}
          {isAdmin && (
            <div className="space-y-4">
              <button
                onClick={() => setShowInviteForm(!showInviteForm)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors w-full"
                style={{ backgroundColor: '#252525', color: '#4ADE80' }}
              >
                <Plus className="w-4 h-4" />
                Invite New User
              </button>

              {showInviteForm && (
                <div className="p-4 rounded-lg space-y-4" style={{ backgroundColor: '#252525', border: '1px solid #2a2a2a' }}>
                  <div className="space-y-2">
                    <Label htmlFor="invite-username" className="text-sm" style={{ color: '#888888' }}>
                      Username
                    </Label>
                    <Input
                      id="invite-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="new_user"
                      style={{ backgroundColor: '#1c1c1c', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invite-email" className="text-sm" style={{ color: '#888888' }}>
                      Email Address
                    </Label>
                    <Input
                      id="invite-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      style={{ backgroundColor: '#1c1c1c', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invite-password" className="text-sm" style={{ color: '#888888' }}>
                      Temporary Master Password
                    </Label>
                    <Input
                      id="invite-password"
                      type="password"
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      style={{ backgroundColor: '#1c1c1c', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                    />
                    <p className="text-xs" style={{ color: '#666666' }}>
                      User will be prompted to change this password on first login
                    </p>
                  </div>

                  {message && (
                    <div 
                      className="flex items-center gap-2 text-sm"
                      style={{ color: message.type === 'success' ? '#4ADE80' : '#EF4444' }}
                    >
                      {message.type === 'success' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      {message.text}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={handleInviteUser}
                      className="flex-1"
                      style={{ backgroundColor: '#4ADE80', color: '#121212' }}
                    >
                      Send Invite
                    </Button>
                    <Button
                      onClick={() => setShowInviteForm(false)}
                      style={{ backgroundColor: '#252525', color: '#f5f5f5', borderColor: '#2a2a2a' }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Users List */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium" style={{ color: '#f5f5f5' }}>
              Registered Users ({users.length + 1})
            </h3>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {/* Current User */}
              {user && (
                <div 
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: '#252525', border: '1px solid #4ADE80' }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#f5f5f5' }}>
                      {user.username}
                      <span className="ml-2 text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#4ADE80', color: '#121212' }}>
                        Admin
                      </span>
                      {user.role === 'admin' && (
                        <span className="ml-2 text-xs" style={{ color: '#4ADE80' }}>(You)</span>
                      )}
                    </p>
                    <p className="text-xs" style={{ color: '#888888' }}>{user.email}</p>
                  </div>
                </div>
              )}

              {/* Other Users */}
              {users.map((u) => (
                <div 
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: '#252525', border: '1px solid #2a2a2a' }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#f5f5f5' }}>
                      {u.username}
                      <span className="ml-2 text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#2a2a2a', color: '#888888' }}>
                        {u.role || 'User'}
                      </span>
                    </p>
                    <p className="text-xs" style={{ color: '#888888' }}>{u.email}</p>
                  </div>
                  {isAdmin && (
                    <>
                      {deleteConfirm === u.id ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleDeleteUser(u.id)}
                            style={{ backgroundColor: '#EF4444', color: '#ffffff' }}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setDeleteConfirm(null)}
                            style={{ backgroundColor: '#2a2a2a', color: '#f5f5f5' }}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(u.id)}
                          className="p-2 rounded-lg transition-colors hover:bg-red-900/20"
                          style={{ color: '#EF4444' }}
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
