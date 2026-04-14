'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project, Task, Credential, EmailSettings, ViewType, AppSettings, User, AuthView, ProjectViewMode } from './types'

interface AppState {
  isAuthenticated: boolean
  masterPassword: string | null
  user: User | null
  projects: Project[]
  selectedProjectId: string | null
  currentView: ViewType
  authView: AuthView
  appSettings: AppSettings
  
  // Auth actions
  setMasterPassword: (password: string) => void
  changeMasterPassword: (oldPassword: string, newPassword: string) => boolean
  login: (username: string, password: string) => boolean
  signup: (username: string, email: string, password: string) => boolean
  logout: () => void
  setAuthView: (view: AuthView) => void
  
  // User actions
  updateUser: (updates: Partial<User>) => void
  
  // Navigation
  setCurrentView: (view: ViewType) => void
  
  // App Settings
  updateAppSettings: (settings: Partial<AppSettings>) => void
  toggleTheme: () => void
  setProjectViewMode: (mode: ProjectViewMode) => void
  
  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  selectProject: (id: string | null) => void
  updateProjectProgress: (id: string, progress: number) => void
  
  // Credential actions
  addCredential: (projectId: string, credential: Omit<Credential, 'id'>) => void
  updateCredential: (projectId: string, credentialId: string, updates: Partial<Credential>) => void
  deleteCredential: (projectId: string, credentialId: string) => void
  
  // Email settings actions
  updateEmailSettings: (projectId: string, settings: EmailSettings) => void
  
  // Task actions
  addTask: (projectId: string, title: string) => void
  toggleTask: (projectId: string, taskId: string) => void
  deleteTask: (projectId: string, taskId: string) => void
}

const generateId = () => Math.random().toString(36).substring(2, 15)

const defaultAppSettings: AppSettings = {
  email: '',
  pathFormat: 'windows',
  theme: 'dark',
  projectViewMode: 'grid',
  smtp: {
    incomingHost: 'mail.spacemail.com',
    incomingPort: '993',
    outgoingHost: 'mail.spacemail.com',
    outgoingPort: '465',
    username: '',
    password: '',
    ssl: true,
  },
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      masterPassword: null,
      user: null,
      projects: [],
      selectedProjectId: null,
      currentView: 'dashboard',
      authView: 'login',
      appSettings: defaultAppSettings,

      setMasterPassword: (password) => set({ masterPassword: password }),
      
      changeMasterPassword: (oldPassword, newPassword) => {
        const { masterPassword } = get()
        if (oldPassword === masterPassword) {
          set({ masterPassword: newPassword })
          return true
        }
        return false
      },
      
      login: (username, password) => {
        const { masterPassword, user } = get()
        // First time setup or correct password
        if (!masterPassword || password === masterPassword) {
          set({ 
            isAuthenticated: true, 
            masterPassword: password,
            user: user || { username, email: '' }
          })
          return true
        }
        return false
      },
      
      signup: (username, email, password) => {
        set({ 
          isAuthenticated: true, 
          masterPassword: password,
          user: { username, email },
          authView: 'login'
        })
        return true
      },
      
      logout: () => set({ isAuthenticated: false, currentView: 'dashboard' }),
      
      setAuthView: (view) => set({ authView: view }),
      
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }))
      },
      
      setCurrentView: (view) => set({ currentView: view }),
      
      updateAppSettings: (settings) => {
        set((state) => ({
          appSettings: { ...state.appSettings, ...settings },
        }))
      },
      
      toggleTheme: () => {
        set((state) => ({
          appSettings: { 
            ...state.appSettings, 
            theme: state.appSettings.theme === 'dark' ? 'light' : 'dark' 
          },
        }))
      },
      
      setProjectViewMode: (mode) => {
        set((state) => ({
          appSettings: { ...state.appSettings, projectViewMode: mode },
        }))
      },

      addProject: (project) => {
        const newProject: Project = {
          ...project,
          id: generateId(),
          progress: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ projects: [...state.projects, newProject] }))
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
          ),
        }))
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId,
        }))
      },

      selectProject: (id) => set({ selectedProjectId: id }),
      
      updateProjectProgress: (id, progress) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, progress: Math.min(100, Math.max(0, progress)), updatedAt: new Date() } : p
          ),
        }))
      },

      addCredential: (projectId, credential) => {
        const newCredential: Credential = { ...credential, id: generateId() }
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, credentials: [...p.credentials, newCredential], updatedAt: new Date() }
              : p
          ),
        }))
      },

      updateCredential: (projectId, credentialId, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  credentials: p.credentials.map((c) =>
                    c.id === credentialId ? { ...c, ...updates } : c
                  ),
                  updatedAt: new Date(),
                }
              : p
          ),
        }))
      },

      deleteCredential: (projectId, credentialId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  credentials: p.credentials.filter((c) => c.id !== credentialId),
                  updatedAt: new Date(),
                }
              : p
          ),
        }))
      },

      updateEmailSettings: (projectId, settings) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, emailSettings: settings, updatedAt: new Date() }
              : p
          ),
        }))
      },

      addTask: (projectId, title) => {
        const newTask: Task = {
          id: generateId(),
          title,
          completed: false,
          createdAt: new Date(),
        }
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, tasks: [...p.tasks, newTask], updatedAt: new Date() }
              : p
          ),
        }))
      },

      toggleTask: (projectId, taskId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  tasks: p.tasks.map((t) =>
                    t.id === taskId ? { ...t, completed: !t.completed } : t
                  ),
                  updatedAt: new Date(),
                }
              : p
          ),
        }))
      },

      deleteTask: (projectId, taskId) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  tasks: p.tasks.filter((t) => t.id !== taskId),
                  updatedAt: new Date(),
                }
              : p
          ),
        }))
      },
    }),
    {
      name: 'msc-projectz-storage',
    }
  )
)
