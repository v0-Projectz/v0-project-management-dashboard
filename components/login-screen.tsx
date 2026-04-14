'use client'

import { useState } from 'react'
import { Shield, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'

export function LoginScreen() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, masterPassword } = useAppStore()
  const isFirstTime = !masterPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate auth delay
    await new Promise((r) => setTimeout(r, 500))

    if (!password.trim()) {
      setError('Master password is required')
      setIsLoading(false)
      return
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters')
      setIsLoading(false)
      return
    }

    const success = login(password)
    if (!success) {
      setError('Invalid master password')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {/* Vader Vault Logo */}
      <div className="flex flex-col items-center gap-6 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Lock className="w-3 h-3 text-primary-foreground" />
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Vader Vault
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isFirstTime ? 'Create your master password' : 'Enter your master password'}
          </p>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Master Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 bg-card border-border pr-12 text-foreground placeholder:text-muted-foreground focus:ring-primary"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Authenticating...</span>
            </div>
          ) : isFirstTime ? (
            'Create Vault'
          ) : (
            'Unlock Vault'
          )}
        </Button>

        {!isFirstTime && (
          <button
            type="button"
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Forgot Password?
          </button>
        )}
      </form>

      {/* Footer */}
      <div className="absolute bottom-6 text-xs text-muted-foreground">
        Powered by the MSC Media Engine
      </div>
    </div>
  )
}
