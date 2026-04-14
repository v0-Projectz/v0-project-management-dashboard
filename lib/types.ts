export interface Credential {
  id: string
  label: string
  username: string
  password: string
}

export interface EmailSettings {
  email: string
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpPass: string
}

export interface Task {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

export interface Project {
  id: string
  name: string
  thumbnail?: string
  localPath: string
  liveUrl?: string
  status: 'local' | 'live'
  credentials: Credential[]
  emailSettings?: EmailSettings
  tasks: Task[]
  createdAt: Date
  updatedAt: Date
}

export type WizardStep = 'identity' | 'connectivity' | 'credentials' | 'status'

export type ViewType = 'dashboard' | 'settings' | 'help'

export type PathFormat = 'windows' | 'mac'

export interface AppSettings {
  email: string
  pathFormat: PathFormat
  smtp: {
    host: string
    port: string
    apiKey: string
  }
}
