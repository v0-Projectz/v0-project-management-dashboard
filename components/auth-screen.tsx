'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff, AlertCircle, User, Mail, ArrowLeft, Send } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import type { AuthView } from '@/lib/types'

export function AuthScreen() {
  const { login, signup, masterPassword, authView, setAuthView } = useAppStore()
  
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const isFirstTime = !masterPassword

  const resetForm = () => {
    setUsername('')
    setEmail('')
    setPassword('')
    setError('')
    setShowPassword(false)
    setEmailSent(false)
  }

  const handleViewChange = (view: AuthView) => {
    resetForm()
    setAuthView(view)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 500))

    if (!username.trim()) {
      setError('Username is required')
      setIsLoading(false)
      return
    }

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

    const success = login(username, password)
    if (!success) {
      setError('Invalid master password')
    }
    setIsLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 500))

    if (!username.trim()) {
      setError('Username is required')
      setIsLoading(false)
      return
    }

    if (!email.trim()) {
      setError('Email is required')
      setIsLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

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

    signup(username, email, password)
    setIsLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 1000))

    if (!email.trim()) {
      setError('Email is required')
      setIsLoading(false)
      return
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }

    // Simulate sending recovery email via Spacemail SMTP
    setEmailSent(true)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#121212' }}>
      {/* Logo */}
      <div className="flex flex-col items-center gap-6 mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#2a2a2a] flex items-center justify-center" style={{ backgroundColor: '#1c1c1c' }}>
            <Image 
              src="/msc-icon.png" 
              alt="MSC-Projectz" 
              width={96} 
              height={96}
              className="object-contain"
              loading="eager"
              priority
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4ADE80' }}>
            <Lock className="w-4 h-4" style={{ color: '#121212' }} />
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: '#f5f5f5' }}>
            {authView === 'login' && 'Vader Vault'}
            {authView === 'signup' && 'Create Account'}
            {authView === 'forgot-password' && 'Password Recovery'}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#888888' }}>
            {authView === 'login' && (isFirstTime ? 'Create your account to get started' : 'Enter your credentials')}
            {authView === 'signup' && 'Set up your new vault account'}
            {authView === 'forgot-password' && 'Enter your email to receive a recovery link'}
          </p>
        </div>
      </div>

      {/* Login Form */}
      {authView === 'login' && (
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 pl-12"
              style={{ 
                backgroundColor: '#1c1c1c', 
                borderColor: '#2a2a2a', 
                color: '#f5f5f5' 
              }}
              autoFocus
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#888888' }} />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Master Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 pl-12 pr-12"
              style={{ 
                backgroundColor: '#1c1c1c', 
                borderColor: '#2a2a2a', 
                color: '#f5f5f5' 
              }}
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#888888' }} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: '#888888' }}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm" style={{ color: '#EF4444' }}>
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 font-medium"
            style={{ backgroundColor: '#4ADE80', color: '#121212' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#121212]/30 border-t-[#121212] rounded-full animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : isFirstTime ? 'Create Vault' : 'Unlock Vault'}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => handleViewChange('forgot-password')}
              className="transition-colors hover:text-[#f5f5f5]"
              style={{ color: '#888888' }}
            >
              Forgot Password?
            </button>
            {isFirstTime && (
              <button
                type="button"
                onClick={() => handleViewChange('signup')}
                className="transition-colors hover:text-[#4ADE80]"
                style={{ color: '#4ADE80' }}
              >
                Create Account
              </button>
            )}
          </div>
        </form>
      )}

      {/* Signup Form */}
      {authView === 'signup' && (
        <form onSubmit={handleSignup} className="w-full max-w-sm space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 pl-12"
              style={{ 
                backgroundColor: '#1c1c1c', 
                borderColor: '#2a2a2a', 
                color: '#f5f5f5' 
              }}
              autoFocus
            />
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#888888' }} />
          </div>

          <div className="relative">
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 pl-12"
              style={{ 
                backgroundColor: '#1c1c1c', 
                borderColor: '#2a2a2a', 
                color: '#f5f5f5' 
              }}
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#888888' }} />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Master Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 pl-12 pr-12"
              style={{ 
                backgroundColor: '#1c1c1c', 
                borderColor: '#2a2a2a', 
                color: '#f5f5f5' 
              }}
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#888888' }} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: '#888888' }}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm" style={{ color: '#EF4444' }}>
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 font-medium"
            style={{ backgroundColor: '#4ADE80', color: '#121212' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#121212]/30 border-t-[#121212] rounded-full animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : 'Create Account'}
          </Button>

          <button
            type="button"
            onClick={() => handleViewChange('login')}
            className="w-full flex items-center justify-center gap-2 text-sm transition-colors hover:text-[#f5f5f5]"
            style={{ color: '#888888' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </form>
      )}

      {/* Forgot Password Form */}
      {authView === 'forgot-password' && (
        <form onSubmit={handleForgotPassword} className="w-full max-w-sm space-y-4">
          {!emailSent ? (
            <>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-12"
                  style={{ 
                    backgroundColor: '#1c1c1c', 
                    borderColor: '#2a2a2a', 
                    color: '#f5f5f5' 
                  }}
                  autoFocus
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#888888' }} />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm" style={{ color: '#EF4444' }}>
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 font-medium"
                style={{ backgroundColor: '#4ADE80', color: '#121212' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#121212]/30 border-t-[#121212] rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    <span>Send Recovery Link</span>
                  </div>
                )}
              </Button>
            </>
          ) : (
            <div className="text-center p-6 rounded-lg" style={{ backgroundColor: '#1c1c1c', borderColor: '#2a2a2a' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#4ADE80' }}>
                <Mail className="w-8 h-8" style={{ color: '#121212' }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: '#f5f5f5' }}>Check Your Email</h3>
              <p className="text-sm" style={{ color: '#888888' }}>
                We&apos;ve sent a recovery link to <span style={{ color: '#4ADE80' }}>{email}</span>
              </p>
              <p className="text-xs mt-2" style={{ color: '#666666' }}>
                Powered by Spacemail SMTP
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => handleViewChange('login')}
            className="w-full flex items-center justify-center gap-2 text-sm transition-colors hover:text-[#f5f5f5]"
            style={{ color: '#888888' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </form>
      )}

      {/* Footer */}
      <div className="absolute bottom-6 text-xs" style={{ color: '#888888' }}>
        Powered by the MSC Media Engine
      </div>
    </div>
  )
}
