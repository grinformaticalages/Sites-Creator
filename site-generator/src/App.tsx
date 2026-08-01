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
                <div className="form-group">
                  <label>Endereço:</label>
                  <input
                    type="text"
                    value={siteData.businessInfo.address}
                    onChange={(e) => setSiteData({ 
                      ...siteData, 
                      businessInfo: { ...siteData.businessInfo, address: e.target.value } 
                    })}
                    placeholder="Rua, Número - Cidade, Estado"
                  />
                </div>
              </div>
            </section>

            <section className="config-section">
              <h2>3️⃣ Cores e Design</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Cor Primária:</label>
                  <input
                    type="color"
                    value={siteData.colors.primary}
                    onChange={(e) => setSiteData({ 
                      ...siteData, 
                      colors: { ...siteData.colors, primary: e.target.value } 
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Cor Secundária:</label>
                  <input
                    type="color"
                    value={siteData.colors.secondary}
                    onChange={(e) => setSiteData({ 
                      ...siteData, 
                      colors: { ...siteData.colors, secondary: e.target.value } 
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Cor de Destaque:</label>
                  <input
                    type="color"
                    value={siteData.colors.accent}
                    onChange={(e) => setSiteData({ 
                      ...siteData, 
                      colors: { ...siteData.colors, accent: e.target.value } 
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Fonte dos Títulos:</label>
                  <select
                    value={siteData.fonts.heading}
                    onChange={(e) => setSiteData({ 
                      ...siteData, 
                      fonts: { ...siteData.fonts, heading: e.target.value } 
                    })}
                  >
                    <option value="Poppins">Poppins</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Oswald">Oswald</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Fonte do Corpo:</label>
                  <select
                    value={siteData.fonts.body}
                    onChange={(e) => setSiteData({ 
                      ...siteData, 
                      fonts: { ...siteData.fonts, body: e.target.value } 
                    })}
                  >
                    <option value="Inter">Inter</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Lato">Lato</option>
                    <option value="Source Sans Pro">Source Sans Pro</option>
                    <option value="Nunito">Nunito</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="config-section">
              <h2>4️⃣ Seções do Site</h2>
              <p className="section-hint">Selecione as seções que seu site terá:</p>
              <div className="sections-grid">
                {(availableSections[siteData.template as keyof typeof availableSections] || []).map((section) => (
                  <label key={section} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={siteData.sections.includes(section)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSiteData({ 
                            ...siteData, 
                            sections: [...siteData.sections, section] 
                          })
                        } else {
                          setSiteData({ 
                            ...siteData, 
                            sections: siteData.sections.filter(s => s !== section) 
                          })
                        }
                      }}
                    />
                    <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="config-section">
              <h2>5️⃣ Recursos Avançados</h2>
              <div className="features-grid">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={siteData.features.seo}
                    onChange={(e) => setSiteData({ 
                      ...siteData, 
                      features: { ...siteData.features, seo: e.target.checked } 
                    })}
                  />
                  <span>🔍 SEO Otimizado</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={siteData.features.analytics}
                    onChange={(e) => setSiteData({ 
                      ...siteData, 
                      features: { ...siteData.features, analytics: e.target.checked } 
                    })}
                  />
                  <span>📊 Google Analytics</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={siteData.features.contactForm}
                    onChange={(e) => setSiteData({ 
                      ...siteData, 
                      features: { ...siteData.features, contactForm: e.target.checked } 
                    })}
                  />
                  <span>📧 Formulário de Contato</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={siteData.features.newsletter}
                    onChange={(e) => setSiteData({ 
                      ...siteData, 
                      features: { ...siteData.features, newsletter: e.target.checked } 
                    })}
                  />
                  <span>📰 Newsletter</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={siteData.features.darkMode}
                    onChange={(e) => setSiteData({ 
                      ...siteData, 
                      features: { ...siteData.features, darkMode: e.target.checked } 
                    })}
                  />
                  <span>🌙 Dark Mode</span>
                </label>
              </div>
            </section>

            <section className="config-section">
              <h2>6️⃣ Redes Sociais</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Instagram:</label>
                  <input
                    type="text"
                    value={siteData.businessInfo.socialMedia.instagram}
                    onChange={(e) => setSiteData({ 
                      ...siteData, 
                      businessInfo: { ...siteData.businessInfo, socialMedia: { ...siteData.businessInfo.socialMedia, instagram: e.target.value } } 
                    })}
                    placeholder="@seuinstagram"
                  />
                </div>
                <div className="form-group">
                  <label>Facebook:</label>
                  <input
                    type="text"
                    value={siteData.businessInfo.socialMedia.facebook}
                    onChange={(e) => setSiteData({ 
                      ...siteData, 
                      businessInfo: { ...siteData.businessInfo, socialMedia: { ...siteData.businessInfo.socialMedia, facebook: e.target.value } } 
                    })}
                    placeholder="seufacebook"
                  />
                </div>
                <div className="form-group">
                  <label>LinkedIn:</label>
                  <input
                    type="text"
                    value={siteData.businessInfo.socialMedia.linkedin}
                    onChange={(e) => setSiteData({ 
                      ...siteData, 
                      businessInfo: { ...siteData.businessInfo, socialMedia: { ...siteData.businessInfo.socialMedia, linkedin: e.target.value } } 
                    })}
                    placeholder="sua-empresa"
                  />
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'preview' && (
          <section className="preview-section">
            <h2>👁️ Preview ao Vivo</h2>
            <div className="preview-container">
              <iframe
                srcDoc={previewIframe}
                title="Preview do Site"
                className="preview-frame"
                sandbox="allow-scripts"
              />
            </div>
          </section>
        )}

        <footer className="footer">
          <div className="export-section">
            {exportStatus.message && (
              <div className={`status-message ${exportStatus.type}`}>
                {exportStatus.message}
              </div>
            )}
            <button
              className="export-button"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? '⏳ Exportando...' : '🚀 Exportar Site Completo'}
            </button>
            <p className="export-hint">
              {window.electronAPI 
                ? `O site será salvo em uma pasta no seu computador (${window.electronAPI.platform})`
                : 'Funcionalidade completa disponível no aplicativo desktop'}
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

// Função para gerar o HTML preview
function generatePreviewHtml(data: SiteData): string {
  const googleFonts = `https://fonts.googleapis.com/css2?family=${data.fonts.heading.replace(/\s+/g, '+')}&family=${data.fonts.body.replace(/\s+/g, '+')}&display=swap`
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${googleFonts}" rel="stylesheet">
  <style>
    :root {
      --primary: ${data.colors.primary};
      --secondary: ${data.colors.secondary};
      --accent: ${data.colors.accent};
      --font-heading: '${data.fonts.heading}', sans-serif;
      --font-body: '${data.fonts.body}', sans-serif;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: var(--font-body);
      line-height: 1.6;
      color: #333;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
      font-weight: 700;
    }
    
    .hero {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      padding: 100px 20px;
      text-align: center;
    }
    
    .hero h1 {
      font-size: 3rem;
      margin-bottom: 20px;
    }
    
    .hero p {
      font-size: 1.5rem;
      opacity: 0.9;
    }
    
    .btn {
      display: inline-block;
      background: var(--accent);
      color: white;
      padding: 15px 40px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      margin-top: 30px;
      transition: transform 0.3s ease;
    }
    
    .btn:hover {
      transform: translateY(-3px);
    }
    
    section {
      padding: 80px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 40px;
      margin-top: 40px;
    }
    
    .feature-card {
      padding: 30px;
      border-radius: 10px;
      background: #f8f9fa;
      text-align: center;
    }
    
    .feature-card h3 {
      color: var(--primary);
      margin: 20px 0 10px;
    }
    
    footer {
      background: var(--secondary);
      color: white;
      padding: 60px 20px;
      text-align: center;
    }
    
    .social-links {
      margin-top: 20px;
    }
    
    .social-links a {
      color: white;
      margin: 0 10px;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="hero">
    <h1>${data.name}</h1>
    <p>${data.description}</p>
    <a href="#contact" class="btn">Saiba Mais</a>
  </div>
  
  ${data.sections.includes('features') ? `
  <section class="features">
    <h2 style="text-align: center; margin-bottom: 40px;">Nossos Diferenciais</h2>
    <div class="features">
      <div class="feature-card">
        <div style="font-size: 3rem;">⭐</div>
        <h3>Qualidade Premium</h3>
        <p>Produtos e serviços de alta qualidade</p>
      </div>
      <div class="feature-card">
        <div style="font-size: 3rem;">🚀</div>
        <h3>Entrega Rápida</h3>
        <p>Rapidez e eficiência no atendimento</p>
      </div>
      <div class="feature-card">
        <div style="font-size: 3rem;">💎</div>
        <h3>Suporte 24/7</h3>
        <p>Estamos sempre disponíveis para você</p>
      </div>
    </div>
  </section>
  ` : ''}
  
  <footer>
    <h3>${data.name}</h3>
    <p>${data.businessInfo.address}</p>
    <p>${data.businessInfo.phone} | ${data.businessInfo.email}</p>
    <div class="social-links">
      ${data.businessInfo.socialMedia.instagram ? `<a href="#">Instagram</a>` : ''}
      ${data.businessInfo.socialMedia.facebook ? `<a href="#">Facebook</a>` : ''}
      ${data.businessInfo.socialMedia.linkedin ? `<a href="#">LinkedIn</a>` : ''}
    </div>
    <p style="margin-top: 30px; opacity: 0.7;">© ${new Date().getFullYear()} ${data.name}. Todos os direitos reservados.</p>
  </footer>
</body>
</html>
  `.trim()
}

export default App
