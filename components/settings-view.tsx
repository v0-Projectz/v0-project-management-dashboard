'use client'

import { useState } from 'react'
import { 
  User, 
  Mail, 
  Lock, 
  Server, 
  Monitor, 
  Apple, 
  Save, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAppStore } from '@/lib/store'

export function SettingsView() {
  const { appSettings, updateAppSettings, changeMasterPassword } = useAppStore()
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [email, setEmail] = useState(appSettings.email)
  const [pathFormat, setPathFormat] = useState(appSettings.pathFormat)
  const [smtpHost, setSmtpHost] = useState(appSettings.smtp.host)
  const [smtpPort, setSmtpPort] = useState(appSettings.smtp.port)
  const [smtpApiKey, setSmtpApiKey] = useState(appSettings.smtp.apiKey)
  const [showApiKey, setShowApiKey] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }
    
    const success = changeMasterPassword(currentPassword, newPassword)
    if (success) {
      setPasswordMessage({ type: 'success', text: 'Password changed successfully' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setPasswordMessage({ type: 'error', text: 'Current password is incorrect' })
    }
    
    setTimeout(() => setPasswordMessage(null), 3000)
  }

  const handleSaveSettings = () => {
    updateAppSettings({
      email,
      pathFormat,
      smtp: {
        host: smtpHost,
        port: smtpPort,
        apiKey: smtpApiKey,
      },
    })
    setSaveMessage('Settings saved successfully')
    setTimeout(() => setSaveMessage(null), 3000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold" style={{ color: '#f5f5f5' }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: '#888888' }}>
          Manage your account, preferences, and SMTP configuration
        </p>
      </div>

      {/* Profile Section */}
      <div 
        className="rounded-xl p-6"
        style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
      >
        <div className="mb-6">
          <h2 className="text-lg font-medium flex items-center gap-2" style={{ color: '#f5f5f5' }}>
            <User className="w-5 h-5" style={{ color: '#4ADE80' }} />
            Profile
          </h2>
          <p className="text-sm mt-1" style={{ color: '#888888' }}>
            Manage your master password and email address
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm flex items-center gap-2" style={{ color: '#888888' }}>
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="max-w-md"
              style={{ backgroundColor: '#252525', borderColor: '#2a2a2a', color: '#f5f5f5' }}
            />
          </div>

          {/* Change Password */}
          <div className="pt-4" style={{ borderTop: '1px solid #2a2a2a' }}>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4" style={{ color: '#888888' }} />
              <span className="text-sm font-medium" style={{ color: '#f5f5f5' }}>Change Master Password</span>
            </div>
            
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-xs" style={{ color: '#888888' }}>
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pr-10"
                    style={{ backgroundColor: '#252525', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#888888' }}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-xs" style={{ color: '#888888' }}>
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                    style={{ backgroundColor: '#252525', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#888888' }}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-xs" style={{ color: '#888888' }}>
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ backgroundColor: '#252525', borderColor: '#2a2a2a', color: '#f5f5f5' }}
                />
              </div>

              {passwordMessage && (
                <div 
                  className="flex items-center gap-2 text-sm"
                  style={{ color: passwordMessage.type === 'success' ? '#4ADE80' : '#EF4444' }}
                >
                  {passwordMessage.type === 'success' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {passwordMessage.text}
                </div>
              )}

              <Button 
                onClick={handleChangePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword}
                className="mt-2"
                style={{ backgroundColor: '#4ADE80', color: '#121212' }}
              >
                Update Password
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div 
        className="rounded-xl p-6"
        style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
      >
        <div className="mb-6">
          <h2 className="text-lg font-medium flex items-center gap-2" style={{ color: '#f5f5f5' }}>
            <Monitor className="w-5 h-5" style={{ color: '#4ADE80' }} />
            App Preferences
          </h2>
          <p className="text-sm mt-1" style={{ color: '#888888' }}>
            Configure application behavior and display settings
          </p>
        </div>
        
        <div 
          className="p-4 rounded-lg"
          style={{ backgroundColor: '#252525', border: '1px solid #2a2a2a' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#1c1c1c' }}
              >
                {pathFormat === 'windows' ? (
                  <Monitor className="w-5 h-5" style={{ color: '#888888' }} />
                ) : (
                  <Apple className="w-5 h-5" style={{ color: '#888888' }} />
                )}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#f5f5f5' }}>Local Path Format</p>
                <p className="text-xs" style={{ color: '#888888' }}>
                  {pathFormat === 'windows' 
                    ? 'Windows style: C:\\Projects\\my-project' 
                    : 'Mac style: /Users/name/Projects/my-project'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: '#888888' }}>Windows</span>
              <Switch
                checked={pathFormat === 'mac'}
                onCheckedChange={(checked) => setPathFormat(checked ? 'mac' : 'windows')}
              />
              <span className="text-xs" style={{ color: '#4ADE80' }}>Mac</span>
            </div>
          </div>
        </div>
      </div>

      {/* SMTP Configuration */}
      <div 
        className="rounded-xl p-6"
        style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
      >
        <div className="mb-6">
          <h2 className="text-lg font-medium flex items-center gap-2" style={{ color: '#f5f5f5' }}>
            <Server className="w-5 h-5" style={{ color: '#4ADE80' }} />
            SMTP Configuration
          </h2>
          <p className="text-sm mt-1" style={{ color: '#888888' }}>
            Configure Brevo/SMTP settings for email notifications
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host" className="text-xs" style={{ color: '#888888' }}>
                SMTP Host
              </Label>
              <Input
                id="smtp-host"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                placeholder="smtp-relay.brevo.com"
                style={{ backgroundColor: '#252525', borderColor: '#2a2a2a', color: '#f5f5f5' }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port" className="text-xs" style={{ color: '#888888' }}>
                Port
              </Label>
              <Input
                id="smtp-port"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                placeholder="587"
                style={{ backgroundColor: '#252525', borderColor: '#2a2a2a', color: '#f5f5f5' }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtp-api-key" className="text-xs" style={{ color: '#888888' }}>
              API Key
            </Label>
            <div className="relative">
              <Input
                id="smtp-api-key"
                type={showApiKey ? 'text' : 'password'}
                value={smtpApiKey}
                onChange={(e) => setSmtpApiKey(e.target.value)}
                placeholder="xkeysib-xxxxxxxx"
                className="pr-10 font-mono"
                style={{ backgroundColor: '#252525', borderColor: '#2a2a2a', color: '#f5f5f5' }}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: '#888888' }}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs" style={{ color: '#888888' }}>
              Get your API key from your Brevo account settings
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-4">
        {saveMessage && (
          <div className="flex items-center gap-2 text-sm" style={{ color: '#4ADE80' }}>
            <CheckCircle className="w-4 h-4" />
            {saveMessage}
          </div>
        )}
        <div className="ml-auto">
          <Button 
            onClick={handleSaveSettings} 
            className="gap-2"
            style={{ backgroundColor: '#4ADE80', color: '#121212' }}
          >
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
