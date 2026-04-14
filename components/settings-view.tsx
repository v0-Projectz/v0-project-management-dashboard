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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppStore } from '@/lib/store'

export function SettingsView() {
  const { appSettings, updateAppSettings, masterPassword, changeMasterPassword } = useAppStore()
  
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
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account, preferences, and SMTP configuration
        </p>
      </div>

      {/* Profile Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Profile
          </CardTitle>
          <CardDescription>
            Manage your master password and email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-muted/50 border-border max-w-md"
            />
          </div>

          {/* Change Password */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Change Master Password</span>
            </div>
            
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-xs text-muted-foreground">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-muted/50 border-border pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-xs text-muted-foreground">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-muted/50 border-border pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-xs text-muted-foreground">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-muted/50 border-border"
                />
              </div>

              {passwordMessage && (
                <div className={`flex items-center gap-2 text-sm ${passwordMessage.type === 'success' ? 'text-primary' : 'text-destructive'}`}>
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
              >
                Update Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Preferences */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Monitor className="w-5 h-5 text-primary" />
            App Preferences
          </CardTitle>
          <CardDescription>
            Configure application behavior and display settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  {pathFormat === 'windows' ? (
                    <Monitor className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Apple className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Local Path Format</p>
                  <p className="text-xs text-muted-foreground">
                    {pathFormat === 'windows' 
                      ? 'Windows style: C:\\Projects\\my-project' 
                      : 'Mac style: /Users/name/Projects/my-project'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Windows</span>
                <Switch
                  checked={pathFormat === 'mac'}
                  onCheckedChange={(checked) => setPathFormat(checked ? 'mac' : 'windows')}
                />
                <span className="text-xs text-primary">Mac</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMTP Configuration */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            SMTP Configuration
          </CardTitle>
          <CardDescription>
            Configure Brevo/SMTP settings for email notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host" className="text-xs text-muted-foreground">
                SMTP Host
              </Label>
              <Input
                id="smtp-host"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                placeholder="smtp-relay.brevo.com"
                className="bg-muted/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port" className="text-xs text-muted-foreground">
                Port
              </Label>
              <Input
                id="smtp-port"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                placeholder="587"
                className="bg-muted/50 border-border"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtp-api-key" className="text-xs text-muted-foreground">
              API Key
            </Label>
            <div className="relative">
              <Input
                id="smtp-api-key"
                type={showApiKey ? 'text' : 'password'}
                value={smtpApiKey}
                onChange={(e) => setSmtpApiKey(e.target.value)}
                placeholder="xkeysib-xxxxxxxx"
                className="bg-muted/50 border-border pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your API key from your Brevo account settings
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-4">
        {saveMessage && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <CheckCircle className="w-4 h-4" />
            {saveMessage}
          </div>
        )}
        <div className="ml-auto">
          <Button onClick={handleSaveSettings} className="gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
