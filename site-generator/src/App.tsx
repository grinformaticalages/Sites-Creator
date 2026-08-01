import { useState, useEffect } from 'react'
import './index.css'

// Declaração para a API do Electron
declare global {
  interface Window {
    electronAPI?: {
      exportSite: (siteData: any) => Promise<{ success: boolean; message: string; path?: string }>
      platform: string
    }
  }
}

interface SiteData {
  name: string
  template: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  fonts: {
    heading: string
    body: string
  }
  sections: string[]
  features: {
    seo: boolean
    analytics: boolean
    contactForm: boolean
    newsletter: boolean
    darkMode: boolean
  }
  businessInfo: {
    email: string
    phone: string
    address: string
    socialMedia: {
      instagram: string
      facebook: string
      linkedin: string
    }
  }
}

function App() {
  const [siteData, setSiteData] = useState<SiteData>({
    name: 'The Kings of Burguer',
    template: 'landing-page',
    description: 'O melhor hambúrguer artesanal da cidade',
    colors: {
      primary: '#dc2626',
      secondary: '#1e293b',
      accent: '#f59e0b'
    },
    fonts: {
      heading: 'Poppins',
      body: 'Inter'
    },
    sections: ['hero', 'about', 'menu', 'testimonials', 'contact'],
    features: {
      seo: true,
      analytics: false,
      contactForm: true,
      newsletter: true,
      darkMode: false
    },
    businessInfo: {
      email: 'contato@thekings.com.br',
      phone: '(11) 99999-9999',
      address: 'Rua dos Sabores, 123 - São Paulo, SP',
      socialMedia: {
        instagram: '@thekingsburguer',
        facebook: 'thekingsburguer',
        linkedin: ''
      }
    }
  })
  const [exportStatus, setExportStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' })
  const [isExporting, setIsExporting] = useState(false)
  const [activeTab, setActiveTab] = useState<'config' | 'preview'>('config')
  const [previewIframe, setPreviewIframe] = useState('')

  // Gera preview em tempo real
  useEffect(() => {
    const previewHtml = generatePreviewHtml(siteData)
    setPreviewIframe(previewHtml)
  }, [siteData])

  const handleExport = async () => {
    setIsExporting(true)
    setExportStatus({ type: null, message: '' })

    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.exportSite(siteData)
        
        if (result.success) {
          setExportStatus({ 
            type: 'success', 
            message: `✅ Site exportado com sucesso! ${result.path}` 
          })
        } else {
          setExportStatus({ 
            type: 'error', 
            message: `❌ ${result.message}` 
          })
        }
      } else {
        setExportStatus({ 
          type: 'success', 
          message: `🌐 Modo navegador: Site "${siteData.name}" pronto! (Funcionalidade completa no app desktop)` 
        })
      }
    } catch (error) {
      setExportStatus({ 
        type: 'error', 
        message: `❌ Erro: ${(error as Error).message}` 
      })
    } finally {
      setIsExporting(false)
    }
  }

  const templates = [
    { id: 'landing-page', name: 'Landing Page', description: 'Página única focada em conversão', icon: '🎯' },
    { id: 'restaurant', name: 'Restaurante', description: 'Cardápio, reservas e delivery', icon: '🍔' },
    { id: 'portfolio', name: 'Portfólio', description: 'Ideal para profissionais criativos', icon: '🎨' },
    { id: 'ecommerce', name: 'E-commerce', description: 'Loja virtual completa', icon: '🛒' },
    { id: 'corporate', name: 'Corporativo', description: 'Site institucional empresarial', icon: '🏢' },
    { id: 'blog', name: 'Blog', description: 'Artigos e conteúdo', icon: '📝' }
  ]

  const availableSections = {
    'landing-page': ['hero', 'features', 'benefits', 'testimonials', 'cta', 'contact', 'faq'],
    'restaurant': ['hero', 'about', 'menu', 'gallery', 'testimonials', 'location', 'reservation', 'contact'],
    'portfolio': ['hero', 'about', 'skills', 'projects', 'testimonials', 'contact'],
    'ecommerce': ['hero', 'featured-products', 'categories', 'benefits', 'testimonials', 'newsletter', 'contact'],
    'corporate': ['hero', 'about', 'services', 'team', 'clients', 'testimonials', 'contact', 'careers'],
    'blog': ['hero', 'featured-posts', 'categories', 'about', 'newsletter', 'contact']
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🚀 Construtor de Sites Pro</h1>
          <p className="subtitle">Crie sites profissionais completos e prontos para vender</p>
        </div>
        <div className="header-actions">
          <button 
            className={`tab-button ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            ⚙️ Configurar
          </button>
          <button 
            className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            👁️ Preview
          </button>
        </div>
      </header>

      <main className="main-content">
        {activeTab === 'config' && (
          <>
            <section className="config-section">
              <h2>1️⃣ Template</h2>
              <div className="templates-grid">
                {templates.map((t) => (
                  <div
                    key={t.id}
                    className={`template-card ${siteData.template === t.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSiteData({ 
                        ...siteData, 
                        template: t.id,
                        sections: availableSections[t.id as keyof typeof availableSections]?.slice(0, 5) || []
                      })
                    }}
                  >
                    <div className="template-icon">{t.icon}</div>
                    <h3>{t.name}</h3>
                    <p>{t.description}</p>
                    {siteData.template === t.id && <div className="checkmark">✓</div>}
                  </div>
                ))}
              </div>
            </section>

            <section className="config-section">
              <h2>2️⃣ Informações do Site</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nome do Site/Empresa:</label>
                  <input
                    type="text"
                    value={siteData.name}
                    onChange={(e) => setSiteData({ ...siteData, name: e.target.value })}
                    placeholder="Ex: The Kings of Burguer"
                  />
                </div>
                <div className="form-group">
                  <label>Descrição/Slogan:</label>
                  <input
                    type="text"
                    value={siteData.description}
                    onChange={(e) => setSiteData({ ...siteData, description: e.target.value })}
                    placeholder="Ex: O melhor hambúrguer artesanal"
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={siteData.businessInfo.email}
                    onChange={(e) => setSiteData({ 
                      ...siteData, 
                      businessInfo: { ...siteData.businessInfo, email: e.target.value } 
                    })}
                    placeholder="contato@empresa.com"
                  />
                </div>
                <div className="form-group">
                  <label>Telefone:</label>
                  <input
                    type="tel"
                    value={siteData.businessInfo.phone}
                    onChange={(e) => setSiteData({ 
                      ...siteData, 
                      businessInfo: { ...siteData.businessInfo, phone: e.target.value } 
                    })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div clas