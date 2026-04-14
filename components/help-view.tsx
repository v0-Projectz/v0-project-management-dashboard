'use client'

import { useState } from 'react'
import { 
  Search, 
  BookOpen, 
  Code, 
  Workflow, 
  HelpCircle, 
  FolderOpen,
  Key,
  Globe,
  Server,
  Zap,
  Monitor
} from 'lucide-react'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'
import { useAppStore } from '@/lib/store'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

interface GuideItem {
  id: string
  title: string
  description: string
  steps: string[]
  category: string
}

const faqItems: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I add a new project?',
    answer: 'Click the "+ Add Project" button in the sidebar or on the dashboard. Follow the 4-step wizard to set up your project: Identity (name & thumbnail), Connectivity (local path & URL), Credentials (vault entries), and Status (local vs live).',
    category: 'getting-started',
  },
  {
    id: 'faq-2',
    question: 'Where are my credentials stored?',
    answer: 'All credentials are stored locally in your browser using encrypted localStorage. Your data never leaves your machine. The master password encrypts access to the vault.',
    category: 'security',
  },
  {
    id: 'faq-3',
    question: 'How do I open a project in VS Code / Cursor?',
    answer: 'Click on a project card and hover over it to reveal quick actions. Click "Cursor" to open the project in your default code editor. This uses the vscode:// protocol.',
    category: 'workflow',
  },
  {
    id: 'faq-4',
    question: 'Can I change my master password?',
    answer: 'Yes! Go to Settings > Profile and use the "Change Master Password" section. You will need to enter your current password to confirm the change.',
    category: 'security',
  },
  {
    id: 'faq-5',
    question: 'What is the difference between Local and Live status?',
    answer: 'Local status indicates a project is in development on your machine. Live status means the project has been deployed and has a public URL. This helps you track deployment status.',
    category: 'workflow',
  },
  {
    id: 'faq-6',
    question: 'How do I configure SMTP for email notifications?',
    answer: 'Go to Settings > SMTP Configuration. Enter your Brevo (or other SMTP provider) host, port, and API key. Common settings: Host: smtp-relay.brevo.com, Port: 587.',
    category: 'settings',
  },
  {
    id: 'faq-7',
    question: 'Can I export my project data?',
    answer: 'Project data is stored in localStorage under the key "msc-projectz-storage". You can export this data by copying the localStorage value from your browser developer tools.',
    category: 'data',
  },
  {
    id: 'faq-8',
    question: 'What happens if I forget my master password?',
    answer: 'Currently, there is no password recovery option as your data is encrypted locally. You would need to clear your localStorage and start fresh. We recommend using a password manager.',
    category: 'security',
  },
]

const workflowGuides: GuideItem[] = [
  {
    id: 'guide-1',
    title: 'Setting Up Your First Project',
    description: 'Complete walkthrough for creating and configuring a new project in MSC-Projectz.',
    category: 'getting-started',
    steps: [
      'Click "+ Add Project" in the sidebar',
      'Enter a project name and optionally upload a thumbnail',
      'Set the local file path where your project lives',
      'Add any credentials needed (WP-Admin, FTP, etc.)',
      'Set the project status to Local or Live',
      'Click "Create Project" to finish setup',
    ],
  },
  {
    id: 'guide-2',
    title: 'Managing Project Credentials',
    description: 'Learn how to securely store and organize login credentials for each project.',
    category: 'security',
    steps: [
      'Open the Project Vault by clicking "Open Vault" on any project card',
      'Click "+ Add Credential" to add a new entry',
      'Enter a label (e.g., "WP-Admin"), username, and password',
      'Use the eye icon to show/hide passwords',
      'Click the copy icon to copy credentials to clipboard',
      'Delete credentials using the trash icon',
    ],
  },
  {
    id: 'guide-3',
    title: 'Using the Task Pulse Feature',
    description: 'Track progress and manage to-do items for each project.',
    category: 'workflow',
    steps: [
      'Click on a project card to select it',
      'The Task Pulse panel appears on the right side',
      'Type a new task and press Enter to add it',
      'Click the checkbox to mark tasks as complete',
      'View completion progress at the top of the panel',
      'Tasks are saved automatically per project',
    ],
  },
  {
    id: 'guide-4',
    title: 'Configuring SMTP Email Settings',
    description: 'Set up Brevo or other SMTP providers for email functionality.',
    category: 'settings',
    steps: [
      'Navigate to Settings from the sidebar',
      'Scroll to SMTP Configuration section',
      'Enter your SMTP host (e.g., smtp-relay.brevo.com)',
      'Set the port (typically 587 for TLS)',
      'Enter your API key from your email provider',
      'Click "Save Settings" to store your configuration',
    ],
  },
  {
    id: 'guide-5',
    title: 'Editing Project Details',
    description: 'Update project information, thumbnails, and connectivity settings.',
    category: 'workflow',
    steps: [
      'Locate the project card you want to edit',
      'Click the Settings icon (gear) in the top-left of the thumbnail',
      'Or use the dropdown menu and select "Edit Project"',
      'Update the project name, thumbnail, paths, or status',
      'Click "Save Changes" to apply your updates',
    ],
  },
]

const categories = [
  { id: 'all', label: 'All Topics' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'security', label: 'Security' },
  { id: 'settings', label: 'Settings' },
  { id: 'data', label: 'Data' },
]

export function HelpView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTab, setActiveTab] = useState<'faq' | 'guides'>('faq')
  const setCurrentView = useAppStore((s) => s.setCurrentView)

  const filteredFAQs = faqItems.filter((item) => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const filteredGuides = workflowGuides.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started': return <Zap className="w-3.5 h-3.5" />
      case 'workflow': return <Workflow className="w-3.5 h-3.5" />
      case 'security': return <Key className="w-3.5 h-3.5" />
      case 'settings': return <Server className="w-3.5 h-3.5" />
      case 'data': return <FolderOpen className="w-3.5 h-3.5" />
      default: return <HelpCircle className="w-3.5 h-3.5" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)' }}
          >
            <BookOpen className="w-5 h-5" style={{ color: '#4ADE80' }} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: '#f5f5f5' }}>Help & Documentation</h1>
            <p className="text-sm" style={{ color: '#888888' }}>
              Developer FAQ and workflow guides for MSC-Projectz
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#888888' }} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documentation..."
          className="w-full pl-10 pr-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2"
          style={{ 
            backgroundColor: '#1c1c1c', 
            border: '1px solid #2a2a2a',
            color: '#f5f5f5'
          }}
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ 
              backgroundColor: activeCategory === cat.id ? '#4ADE80' : '#2a2a2a',
              color: activeCategory === cat.id ? '#121212' : '#888888'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div 
          className="inline-flex rounded-lg p-1"
          style={{ backgroundColor: '#1c1c1c' }}
        >
          <button
            onClick={() => setActiveTab('faq')}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{ 
              backgroundColor: activeTab === 'faq' ? '#2a2a2a' : 'transparent',
              color: activeTab === 'faq' ? '#f5f5f5' : '#888888'
            }}
          >
            <Code className="w-4 h-4" />
            Developer FAQ
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{ 
              backgroundColor: activeTab === 'guides' ? '#2a2a2a' : 'transparent',
              color: activeTab === 'guides' ? '#f5f5f5' : '#888888'
            }}
          >
            <Workflow className="w-4 h-4" />
            Workflow Guides
          </button>
        </div>
      </div>

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-2">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 mx-auto mb-3" style={{ color: '#888888' }} />
              <p style={{ color: '#888888' }}>No matching questions found</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-2">
              {filteredFAQs.map((item) => (
                <AccordionItem 
                  key={item.id} 
                  value={item.id}
                  className="rounded-lg px-4"
                  style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-start gap-3 text-left">
                      <span 
                        className="flex-shrink-0 flex items-center gap-1.5 text-xs px-2 py-1 rounded"
                        style={{ backgroundColor: '#2a2a2a', color: '#888888' }}
                      >
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </span>
                      <span className="font-medium" style={{ color: '#f5f5f5' }}>{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pl-[88px]" style={{ color: '#888888' }}>
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      )}

      {/* Guides Tab */}
      {activeTab === 'guides' && (
        <div className="space-y-4">
          {filteredGuides.length === 0 ? (
            <div className="text-center py-12">
              <Workflow className="w-12 h-12 mx-auto mb-3" style={{ color: '#888888' }} />
              <p style={{ color: '#888888' }}>No matching guides found</p>
            </div>
          ) : (
            filteredGuides.map((guide) => (
              <div 
                key={guide.id}
                className="rounded-xl p-5 transition-colors"
                style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="flex items-center gap-1.5 text-xs px-2 py-1 rounded"
                        style={{ backgroundColor: '#2a2a2a', color: '#888888' }}
                      >
                        {getCategoryIcon(guide.category)}
                        {guide.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg" style={{ color: '#f5f5f5' }}>{guide.title}</h3>
                    <p className="text-sm mt-1" style={{ color: '#888888' }}>{guide.description}</p>
                  </div>
                </div>
                
                <div 
                  className="rounded-lg p-4"
                  style={{ backgroundColor: '#252525' }}
                >
                  <p 
                    className="text-xs font-medium uppercase tracking-wider mb-3"
                    style={{ color: '#888888' }}
                  >
                    Steps
                  </p>
                  <ol className="space-y-2">
                    {guide.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <span 
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium"
                          style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)', color: '#4ADE80' }}
                        >
                          {index + 1}
                        </span>
                        <span style={{ color: '#888888' }}>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Quick Links */}
      <div 
        className="mt-8 p-4 rounded-xl"
        style={{ backgroundColor: '#1c1c1c', border: '1px solid #2a2a2a' }}
      >
        <h3 className="text-sm font-medium mb-3" style={{ color: '#f5f5f5' }}>Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm"
            style={{ backgroundColor: '#252525', border: '1px solid #2a2a2a', color: '#888888' }}
          >
            <Monitor className="w-4 h-4" />
            Dashboard
          </button>
          <button 
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm"
            style={{ backgroundColor: '#252525', border: '1px solid #2a2a2a', color: '#888888' }}
          >
            <Key className="w-4 h-4" />
            Credentials
          </button>
          <button 
            onClick={() => setCurrentView('settings')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm"
            style={{ backgroundColor: '#252525', border: '1px solid #2a2a2a', color: '#888888' }}
          >
            <Server className="w-4 h-4" />
            SMTP Setup
          </button>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm"
            style={{ backgroundColor: '#252525', border: '1px solid #2a2a2a', color: '#888888' }}
          >
            <Globe className="w-4 h-4" />
            Live Projects
          </button>
        </div>
      </div>
    </div>
  )
}
