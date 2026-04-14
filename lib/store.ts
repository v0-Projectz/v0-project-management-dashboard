'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Project, Task, Credential, EmailSettings, ViewType, AppSettings } from './types'

interface AppState {
  isAuthenticated: boolean
  masterPassword: string | null
  projects: Project[]
  selectedProjectId: string | null
  currentView: ViewType
  appSettings: AppSettings
  
  // Auth actions
  setMasterPassword: (password: string) => void
  changeMasterPassword: (oldPassword: string, newPassword: string) => boolean
  login: (password: string) => boolean
  logout: () => void
  
  // Navigation
  setCurrentView: (view: ViewType) => void
  
  // App Settings
  updateAppSettings: (settings: Partial<AppSettings>) => void
  
  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  selectProject: (id: string | null) => void
  
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
  smtp: {
    host: '',
    port: '587',
    apiKey: '',
  },
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      masterPassword: null,
      projects: [],
      selectedProjectId: null,
      currentView: 'dashboard',
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
      
      login: (password) => {
        const { masterPassword } = get()
        // First time setup or correct password
        if (!masterPassword || password === masterPassword) {
          set({ isAuthenticated: true, masterPassword: password })
          return true
        }
        return false
      },
      
      logout: () => set({ isAuthenticated: false, currentView: 'dashboard' }),
      
      setCurrentView: (view) => set({ currentView: view }),
      
      updateAppSettings: (settings) => {
        set((state) => ({
          appSettings: { ...state.appSettings, ...settings },
        }))
      },

      addProject: (project) => {
        const newProject: Project = {
          ...project,
          id: generateId(),
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
