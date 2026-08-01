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

// Função para gerar o HTML completo do site
function generatePreviewHtml(data: SiteData): string {
  const googleFonts = `https://fonts.googleapis.com/css2?family=${data.fonts.heading.replace(/\s+/g, '+')}&family=${data.fonts.body.replace(/\s+/g, '+')}&display=swap`
  
  // CSS Base profissional
  const baseStyles = `
    :root {
      --primary: ${data.colors.primary};
      --secondary: ${data.colors.secondary};
      --accent: ${data.colors.accent};
      --font-heading: '${data.fonts.heading}', sans-serif;
      --font-body: '${data.fonts.body}', sans-serif;
      --dark: #1a1a2e;
      --light: #f8f9fa;
      --gray: #6c757d;
      --success: #28a745;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    html { scroll-behavior: smooth; }
    
    body {
      font-family: var(--font-body);
      line-height: 1.6;
      color: #333;
      overflow-x: hidden;
    }
    
    ${data.features.darkMode ? `
    @media (prefers-color-scheme: dark) {
      body {
        background: #0f0f23;
        color: #e0e0e0;
      }
      .card, .feature-card, .project-card {
        background: #1a1a2e !important;
      }
    }
    ` : ''}
    
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
      font-weight: 700;
      line-height: 1.2;
    }
    
    img { max-width: 100%; height: auto; }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .btn {
      display: inline-block;
      background: var(--accent);
      color: white;
      padding: 15px 40px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }
    
    .btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    
    .btn-secondary {
      background: transparent;
      border: 2px solid white;
    }
    
    section {
      padding: 80px 20px;
    }
    
    .section-title {
      text-align: center;
      margin-bottom: 60px;
    }
    
    .section-title h2 {
      font-size: 2.5rem;
      color: var(--secondary);
      margin-bottom: 15px;
    }
    
    .section-title p {
      color: var(--gray);
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto;
    }
    
    /* Header */
    header {
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      position: fixed;
      width: 100%;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    }
    
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary);
      text-decoration: none;
    }
    
    .nav-links {
      display: flex;
      gap: 30px;
      list-style: none;
    }
    
    .nav-links a {
      text-decoration: none;
      color: var(--secondary);
      font-weight: 500;
      transition: color 0.3s ease;
    }
    
    .nav-links a:hover {
      color: var(--primary);
    }
    
    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      padding: 180px 20px 120px;
      text-align: center;
      min-height: 90vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .hero h1 {
      font-size: 3.5rem;
      margin-bottom: 20px;
      animation: fadeInUp 0.8s ease;
    }
    
    .hero p {
      font-size: 1.5rem;
      opacity: 0.95;
      margin-bottom: 40px;
      animation: fadeInUp 0.8s ease 0.2s both;
    }
    
    .hero-buttons {
      animation: fadeInUp 0.8s ease 0.4s both;
    }
    
    .hero-buttons .btn {
      margin: 0 10px;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Cards Grid */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 40px;
      margin-top: 40px;
    }
    
    .card, .feature-card, .project-card, .team-card {
      padding: 40px 30px;
      border-radius: 15px;
      background: white;
      box-shadow: 0 5px 30px rgba(0,0,0,0.08);
      transition: all 0.3s ease;
      text-align: center;
    }
    
    .card:hover, .feature-card:hover, .project-card:hover, .team-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 50px rgba(0,0,0,0.15);
    }
    
    .card-icon {
      font-size: 3.5rem;
      margin-bottom: 20px;
    }
    
    .card h3 {
      color: var(--primary);
      margin: 20px 0 15px;
      font-size: 1.5rem;
    }
    
    .card p {
      color: var(--gray);
      line-height: 1.8;
    }
    
    /* Footer */
    footer {
      background: var(--secondary);
      color: white;
      padding: 80px 20px 40px;
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .footer-section h3 {
      margin-bottom: 20px;
      font-size: 1.3rem;
    }
    
    .footer-section p, .footer-section a {
      color: rgba(255,255,255,0.8);
      line-height: 2;
      text-decoration: none;
      display: block;
    }
    
    .footer-section a:hover {
      color: var(--accent);
    }
    
    .social-links {
      display: flex;
      gap: 15px;
      margin-top: 20px;
    }
    
    .social-links a {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    
    .social-links a:hover {
      background: var(--accent);
      transform: translateY(-3px);
    }
    
    .footer-bottom {
      text-align: center;
      padding-top: 40px;
      margin-top: 40px;
      border-top: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.6);
    }
    
    /* Forms */
    .form-group {
      margin-bottom: 25px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--secondary);
    }
    
    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 15px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-family: var(--font-body);
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }
    
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: var(--primary);
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .hero h1 { font-size: 2.5rem; }
      .hero p { font-size: 1.2rem; }
      .nav-links { display: none; }
      .section-title h2 { font-size: 2rem; }
    }
  `

  // Gera seções dinâmicas baseadas no template e seções selecionadas
  const generateSection = (sectionName: string): string => {
    switch(sectionName) {
      case 'about':
        return `
        <section id="about" style="background: var(--light);">
          <div class="container">
            <div class="section-title">
              <h2>Sobre Nós</h2>
              <p>Conheça nossa história e missão</p>
            </div>
            <div class="grid">
              <div class="card" style="text-align: left;">
                <h3>Nossa História</h3>
                <p>Fundada com paixão e dedicação, ${data.name} tem se destacado no mercado pela qualidade excepcional e atendimento personalizado. Nossa trajetória é marcada pela busca constante da excelência.</p>
              </div>
              <div class="card" style="text-align: left;">
                <h3>Nossa Missão</h3>
                <p>${data.description}. Comprometidos em oferecer a melhor experiência para nossos clientes, combinando tradição, inovação e sustentabilidade em tudo o que fazemos.</p>
              </div>
              <div class="card" style="text-align: left;">
                <h3>Nossos Valores</h3>
                <p>• Qualidade inegociável<br>• Atendimento humanizado<br>• Sustentabilidade<br>• Inovação constante<br>• Respeito ao cliente</p>
              </div>
            </div>
          </div>
        </section>`

      case 'features':
      case 'benefits':
        return `
        <section id="features">
          <div class="container">
            <div class="section-title">
              <h2>Nossos Diferenciais</h2>
              <p>O que nos torna especiais</p>
            </div>
            <div class="grid">
              <div class="feature-card">
                <div class="card-icon">⭐</div>
                <h3>Qualidade Premium</h3>
                <p>Produtos e serviços de alta qualidade, selecionados rigorosamente para garantir sua satisfação.</p>
              </div>
              <div class="feature-card">
                <div class="card-icon">🚀</div>
                <h3>Entrega Rápida</h3>
                <p>Rapidez e eficiência no atendimento, porque sabemos que seu tempo é valioso.</p>
              </div>
              <div class="feature-card">
                <div class="card-icon">💎</div>
                <h3>Suporte 24/7</h3>
                <p>Equipe dedicada disponível a qualquer momento para atender suas necessidades.</p>
              </div>
              <div class="feature-card">
                <div class="card-icon">🔒</div>
                <h3>Segurança Total</h3>
                <p>Seus dados e transações protegidos com a mais alta tecnologia de segurança.</p>
              </div>
              <div class="feature-card">
                <div class="card-icon">🌟</div>
                <h3>Experiência Única</h3>
                <p>Cada interação é pensada para proporcionar uma experiência memorável.</p>
              </div>
              <div class="feature-card">
                <div class="card-icon">💚</div>
                <h3>Sustentabilidade</h3>
                <p>Compromisso com o meio ambiente em todas as nossas operações.</p>
              </div>
            </div>
          </div>
        </section>`

      case 'services':
        return `
        <section id="services" style="background: var(--light);">
          <div class="container">
            <div class="section-title">
              <h2>Nossos Serviços</h2>
              <p>Soluções completas para você</p>
            </div>
            <div class="grid">
              <div class="card">
                <div class="card-icon">🎯</div>
                <h3>Consultoria Especializada</h3>
                <p>Análise completa e estratégias personalizadas para o seu negócio.</p>
              </div>
              <div class="card">
                <div class="card-icon">⚙️</div>
                <h3>Implementação</h3>
                <p>Colocamos em prática tudo o que foi planejado com excelência.</p>
              </div>
              <div class="card">
                <div class="card-icon">📊</div>
                <h3>Acompanhamento</h3>
                <p>Monitoramento contínuo para garantir os melhores resultados.</p>
              </div>
            </div>
          </div>
        </section>`

      case 'menu':
        return `
        <section id="menu">
          <div class="container">
            <div class="section-title">
              <h2>Nosso Cardápio</h2>
              <p>Sabores inesquecíveis preparados com amor</p>
            </div>
            <div class="grid">
              <div class="card">
                <div class="card-icon">🍔</div>
                <h3>Burger Clássico</h3>
                <p>Pão artesanal, blend 180g, queijo cheddar, bacon crocante e molho especial.</p>
                <p style="color: var(--primary); font-weight: 700; margin-top: 15px;">R$ 32,90</p>
              </div>
              <div class="card">
                <div class="card-icon">🍟</div>
                <h3>Burger Duplo</h3>
                <p>Dois blends 180g, dobro de queijo, cebola caramelizada e molho da casa.</p>
                <p style="color: var(--primary); font-weight: 700; margin-top: 15px;">R$ 45,90</p>
              </div>
              <div class="card">
                <div class="card-icon">🥗</div>
                <h3>Burger Vegano</h3>
                <p>Pão vegano, burger de grão-de-bico, saladas frescas e molho tahine.</p>
                <p style="color: var(--primary); font-weight: 700; margin-top: 15px;">R$ 38,90</p>
              </div>
            </div>
          </div>
        </section>`

      case 'testimonials':
        return `
        <section id="testimonials" style="background: var(--light);">
          <div class="container">
            <div class="section-title">
              <h2>O Que Dizem Nossos Clientes</h2>
              <p>Depoimentos reais de quem já experimentou</p>
            </div>
            <div class="grid">
              <div class="card" style="text-align: left;">
                <p style="font-style: italic; margin-bottom: 20px;">"Simplesmente incrível! A qualidade superou todas as minhas expectativas. Recomendo de olhos fechados!"</p>
                <strong style="color: var(--primary);">Maria Silva</strong>
                <p style="color: var(--gray); font-size: 0.9rem;">Empresária</p>
              </div>
              <div class="card" style="text-align: left;">
                <p style="font-style: italic; margin-bottom: 20px;">"Atendimento impecável e produto de primeira linha. Já sou cliente fiel há anos!"</p>
                <strong style="color: var(--primary);">João Santos</strong>
                <p style="color: var(--gray); font-size: 0.9rem;">Advogado</p>
              </div>
              <div class="card" style="text-align: left;">
                <p style="font-style: italic; margin-bottom: 20px;">"Melhor custo-benefício que encontrei no mercado. Equipe super atenciosa!"</p>
                <strong style="color: var(--primary);">Ana Costa</strong>
                <p style="color: var(--gray); font-size: 0.9rem;">Designer</p>
              </div>
            </div>
          </div>
        </section>`

      case 'contact':
        return `
        <section id="contact">
          <div class="container">
            <div class="section-title">
              <h2>Entre em Contato</h2>
              <p>Estamos prontos para atender você</p>
            </div>
            <div class="grid">
              <div class="card" style="text-align: left;">
                <h3>Informações de Contato</h3>
                <p style="margin: 20px 0;"><strong>📍 Endereço:</strong><br>${data.businessInfo.address}</p>
                <p style="margin: 20px 0;"><strong>📞 Telefone:</strong><br>${data.businessInfo.phone}</p>
                <p style="margin: 20px 0;"><strong>📧 Email:</strong><br>${data.businessInfo.email}</p>
                <div class="social-links" style="margin-top: 30px;">
                  ${data.businessInfo.socialMedia.instagram ? `<a href="https://instagram.com/${data.businessInfo.socialMedia.instagram.replace('@', '')}" target="_blank">📷</a>` : ''}
                  ${data.businessInfo.socialMedia.facebook ? `<a href="https://facebook.com/${data.businessInfo.socialMedia.facebook}" target="_blank">📘</a>` : ''}
                  ${data.businessInfo.socialMedia.linkedin ? `<a href="https://linkedin.com/company/${data.businessInfo.socialMedia.linkedin}" target="_blank">💼</a>` : ''}
                </div>
              </div>
              <div class="card">
                ${data.features.contactForm ? `
                <h3 style="margin-bottom: 25px;">Envie uma Mensagem</h3>
                <form onsubmit="event.preventDefault(); alert('Mensagem enviada com sucesso!');">
                  <div class="form-group">
                    <label>Nome Completo</label>
                    <input type="text" placeholder="Seu nome" required />
                  </div>
                  <div class="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="seu@email.com" required />
                  </div>
                  <div class="form-group">
                    <label>Mensagem</label>
                    <textarea rows="4" placeholder="Como podemos ajudar?" required></textarea>
                  </div>
                  <button type="submit" class="btn" style="width: 100%;">Enviar Mensagem</button>
                </form>
                ` : '<p style="text-align: center; padding: 40px 0;">Entre em contato pelos canais acima!</p>'}
              </div>
            </div>
          </div>
        </section>`

      case 'cta':
        return `
        <section id="cta" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; text-align: center;">
          <div class="container">
            <h2 style="font-size: 2.5rem; margin-bottom: 20px;">Pronto para Começar?</h2>
            <p style="font-size: 1.2rem; opacity: 0.95; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">${data.description}. Não perca mais tempo, entre em contato agora mesmo!</p>
            <a href="#contact" class="btn btn-secondary">Falar com Especialista</a>
          </div>
        </section>`

      case 'faq':
        return `
        <section id="faq" style="background: var(--light);">
          <div class="container">
            <div class="section-title">
              <h2>Perguntas Frequentes</h2>
              <p>Tire suas dúvidas aqui</p>
            </div>
            <div style="max-width: 800px; margin: 0 auto;">
              <div class="card" style="text-align: left; margin-bottom: 20px;">
                <h4 style="color: var(--primary); margin-bottom: 10px;">❓ Como faço um pedido?</h4>
                <p style="color: var(--gray);">Você pode fazer seu pedido através do nosso site, aplicativo ou ligando diretamente para nós.</p>
              </div>
              <div class="card" style="text-align: left; margin-bottom: 20px;">
                <h4 style="color: var(--primary); margin-bottom: 10px;">❓ Quais formas de pagamento vocês aceitam?</h4>
                <p style="color: var(--gray);">Aceitamos cartões de crédito, débito, PIX e dinheiro.</p>
              </div>
              <div class="card" style="text-align: left;">
                <h4 style="color: var(--primary); margin-bottom: 10px;">❓ Qual o prazo de entrega?</h4>
                <p style="color: var(--gray);">O prazo varia de 30 minutos a 1 hora, dependendo da sua localização.</p>
              </div>
            </div>
          </div>
        </section>`

      case 'gallery':
        return `
        <section id="gallery">
          <div class="container">
            <div class="section-title">
              <h2>Galeria de Fotos</h2>
              <p>Confira um pouco do nosso trabalho</p>
            </div>
            <div class="grid">
              <div class="card" style="padding: 0; overflow: hidden;">
                <div style="height: 250px; background: linear-gradient(45deg, var(--primary), var(--accent)); display: flex; align-items: center; justify-content: center; color: white; font-size: 4rem;">📸</div>
              </div>
              <div class="card" style="padding: 0; overflow: hidden;">
                <div style="height: 250px; background: linear-gradient(45deg, var(--secondary), var(--primary)); display: flex; align-items: center; justify-content: center; color: white; font-size: 4rem;">🎨</div>
              </div>
              <div class="card" style="padding: 0; overflow: hidden;">
                <div style="height: 250px; background: linear-gradient(45deg, var(--accent), var(--secondary)); display: flex; align-items: center; justify-content: center; color: white; font-size: 4rem;">✨</div>
              </div>
            </div>
          </div>
        </section>`

      case 'team':
        return `
        <section id="team" style="background: var(--light);">
          <div class="container">
            <div class="section-title">
              <h2>Nossa Equipe</h2>
              <p>Conheça os profissionais por trás do sucesso</p>
            </div>
            <div class="grid">
              <div class="team-card">
                <div class="card-icon">👤</div>
                <h3>Carlos Mendes</h3>
                <p style="color: var(--primary); font-weight: 600;">CEO & Fundador</p>
                <p style="margin-top: 15px; color: var(--gray);">20 anos de experiência no mercado.</p>
              </div>
              <div class="team-card">
                <div class="card-icon">👤</div>
                <h3>Fernanda Lima</h3>
                <p style="color: var(--primary); font-weight: 600;">Diretora de Operações</p>
                <p style="margin-top: 15px; color: var(--gray);">Especialista em gestão de processos.</p>
              </div>
              <div class="team-card">
                <div class="card-icon">👤</div>
                <h3>Ricardo Souza</h3>
                <p style="color: var(--primary); font-weight: 600;">Head de Tecnologia</p>
                <p style="margin-top: 15px; color: var(--gray);">Inovador e apaixonado por tecnologia.</p>
              </div>
            </div>
          </div>
        </section>`

      case 'clients':
        return `
        <section id="clients">
          <div class="container">
            <div class="section-title">
              <h2>Clientes Atendidos</h2>
              <p>Empresas que confiam em nosso trabalho</p>
            </div>
            <div class="grid">
              <div class="card">
                <div class="card-icon">🏢</div>
                <h3>Empresa A</h3>
                <p>Parceria desde 2020</p>
              </div>
              <div class="card">
                <div class="card-icon">🏭</div>
                <h3>Indústria B</h3>
                <p>Parceria desde 2019</p>
              </div>
              <div class="card">
                <div class="card-icon">🛒</div>
                <h3>Varejo C</h3>
                <p>Parceria desde 2021</p>
              </div>
              <div class="card">
                <div class="card-icon">💼</div>
                <h3>Serviços D</h3>
                <p>Parceria desde 2018</p>
              </div>
            </div>
          </div>
        </section>`

      case 'location':
        return `
        <section id="location" style="background: var(--light);">
          <div class="container">
            <div class="section-title">
              <h2>Nossa Localização</h2>
              <p>Venha nos visitar</p>
            </div>
            <div class="card">
              <div style="height: 400px; background: linear-gradient(45deg, var(--primary), var(--secondary)); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                📍 ${data.businessInfo.address}<br><br>
                <span style="opacity: 0.8;">(Mapa interativo seria inserido aqui)</span>
              </div>
            </div>
          </div>
        </section>`

      case 'reservation':
        return `
        <section id="reservation">
          <div class="container">
            <div class="section-title">
              <h2>Faça sua Reserva</h2>
              <p>Garanta seu lugar conosco</p>
            </div>
            <div class="card" style="max-width: 600px; margin: 0 auto;">
              <form onsubmit="event.preventDefault(); alert('Reserva solicitada! Entraremos em contato.');">
                <div class="form-grid">
                  <div class="form-group">
                    <label>Nome</label>
                    <input type="text" required />
                  </div>
                  <div class="form-group">
                    <label>Telefone</label>
                    <input type="tel" required />
                  </div>
                </div>
                <div class="form-grid">
                  <div class="form-group">
                    <label>Data</label>
                    <input type="date" required />
                  </div>
                  <div class="form-group">
                    <label>Horário</label>
                    <input type="time" required />
                  </div>
                </div>
                <div class="form-group">
                  <label>Número de Pessoas</label>
                  <input type="number" min="1" required />
                </div>
                <button type="submit" class="btn" style="width: 100%;">Reservar Mesa</button>
              </form>
            </div>
          </div>
        </section>`

      case 'projects':
      case 'portfolio':
        return `
        <section id="projects">
          <div class="container">
            <div class="section-title">
              <h2>Projetos Recentes</h2>
              <p>Confira alguns dos nossos trabalhos</p>
            </div>
            <div class="grid">
              <div class="project-card">
                <div style="height: 200px; background: linear-gradient(45deg, var(--primary), var(--accent)); border-radius: 10px; margin-bottom: 20px;"></div>
                <h3>Projeto Alpha</h3>
                <p style="color: var(--gray);">Desenvolvimento de solução inovadora para o setor financeiro.</p>
              </div>
              <div class="project-card">
                <div style="height: 200px; background: linear-gradient(45deg, var(--secondary), var(--primary)); border-radius: 10px; margin-bottom: 20px;"></div>
                <h3>Projeto Beta</h3>
                <p style="color: var(--gray);">Plataforma e-commerce com integração completa.</p>
              </div>
              <div class="project-card">
                <div style="height: 200px; background: linear-gradient(45deg, var(--accent), var(--secondary)); border-radius: 10px; margin-bottom: 20px;"></div>
                <h3>Projeto Gamma</h3>
                <p style="color: var(--gray);">Aplicativo mobile com mais de 100k downloads.</p>
              </div>
            </div>
          </div>
        </section>`

      case 'skills':
        return `
        <section id="skills" style="background: var(--light);">
          <div class="container">
            <div class="section-title">
              <h2>Habilidades</h2>
              <p>Competências técnicas e profissionais</p>
            </div>
            <div class="grid">
              <div class="card">
                <div class="card-icon">💻</div>
                <h3>Desenvolvimento Web</h3>
                <p>HTML, CSS, JavaScript, React, Node.js</p>
              </div>
              <div class="card">
                <div class="card-icon">🎨</div>
                <h3>Design UI/UX</h3>
                <p>Figma, Adobe XD, Prototipagem</p>
              </div>
              <div class="card">
                <div class="card-icon">📱</div>
                <h3>Mobile</h3>
                <p>React Native, Flutter, iOS, Android</p>
              </div>
            </div>
          </div>
        </section>`

      case 'featured-products':
        return `
        <section id="featured-products">
          <div class="container">
            <div class="section-title">
              <h2>Produtos em Destaque</h2>
              <p>Os mais vendidos da loja</p>
            </div>
            <div class="grid">
              <div class="card">
                <div style="height: 250px; background: linear-gradient(45deg, var(--primary), var(--accent)); border-radius: 10px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 4rem;">🛍️</div>
                <h3>Produto Premium</h3>
                <p style="color: var(--gray); margin: 15px 0;">Descrição completa do produto com detalhes e benefícios.</p>
                <p style="color: var(--primary); font-size: 1.5rem; font-weight: 700;">R$ 299,90</p>
                <button class="btn" style="width: 100%; margin-top: 20px;">Comprar Agora</button>
              </div>
              <div class="card">
                <div style="height: 250px; background: linear-gradient(45deg, var(--secondary), var(--primary)); border-radius: 10px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 4rem;">🎁</div>
                <h3>Edição Limitada</h3>
                <p style="color: var(--gray); margin: 15px 0;">Produto exclusivo com características especiais.</p>
                <p style="color: var(--primary); font-size: 1.5rem; font-weight: 700;">R$ 449,90</p>
                <button class="btn" style="width: 100%; margin-top: 20px;">Comprar Agora</button>
              </div>
              <div class="card">
                <div style="height: 250px; background: linear-gradient(45deg, var(--accent), var(--secondary)); border-radius: 10px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 4rem;">⭐</div>
                <h3>Kit Completo</h3>
                <p style="color: var(--gray); margin: 15px 0;">Solução completa com todos os acessórios.</p>
                <p style="color: var(--primary); font-size: 1.5rem; font-weight: 700;">R$ 599,90</p>
                <button class="btn" style="width: 100%; margin-top: 20px;">Comprar Agora</button>
              </div>
            </div>
          </div>
        </section>`

      case 'categories':
        return `
        <section id="categories" style="background: var(--light);">
          <div class="container">
            <div class="section-title">
              <h2>Categorias</h2>
              <p>Explore nossos produtos por categoria</p>
            </div>
            <div class="grid">
              <div class="card">
                <div class="card-icon">📦</div>
                <h3>Categoria A</h3>
                <p style="color: var(--gray);">12 produtos</p>
              </div>
              <div class="card">
                <div class="card-icon">🎯</div>
                <h3>Categoria B</h3>
                <p style="color: var(--gray);">8 produtos</p>
              </div>
              <div class="card">
                <div class="card-icon">✨</div>
                <h3>Categoria C</h3>
                <p style="color: var(--gray);">15 produtos</p>
              </div>
              <div class="card">
                <div class="card-icon">🔥</div>
                <h3>Categoria D</h3>
                <p style="color: var(--gray);">6 produtos</p>
              </div>
            </div>
          </div>
        </section>`

      case 'newsletter':
        return `
        <section id="newsletter" style="background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; text-align: center;">
          <div class="container">
            <h2 style="font-size: 2.5rem; margin-bottom: 20px;">Assine Nossa Newsletter</h2>
            <p style="font-size: 1.2rem; opacity: 0.95; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">Receba novidades, promoções exclusivas e conteúdo especial diretamente no seu email.</p>
            ${data.features.newsletter ? `
            <form onsubmit="event.preventDefault(); alert('Inscrito com sucesso!');" style="max-width: 500px; margin: 0 auto; display: flex; gap: 15px;">
              <input type="email" placeholder="Seu melhor email" style="flex: 1; padding: 15px 25px; border-radius: 50px; border: none; font-size: 1rem;" required />
              <button type="submit" class="btn btn-secondary">Inscrever</button>
            </form>
            ` : '<p style="opacity: 0.8;">Funcionalidade de newsletter disponível na versão completa.</p>'}
          </div>
        </section>`

      case 'featured-posts':
        return `
        <section id="featured-posts">
          <div class="container">
            <div class="section-title">
              <h2>Posts em Destaque</h2>
              <p>Conteúdo selecionado para você</p>
            </div>
            <div class="grid">
              <div class="card" style="text-align: left;">
                <div style="height: 200px; background: linear-gradient(45deg, var(--primary), var(--accent)); border-radius: 10px; margin-bottom: 20px;"></div>
                <h3 style="font-size: 1.3rem;">Título do Artigo 1</h3>
                <p style="color: var(--gray); margin: 15px 0;">Resumo do artigo com as principais informações para atrair o leitor.</p>
                <a href="#" style="color: var(--primary); font-weight: 600; text-decoration: none;">Ler mais →</a>
              </div>
              <div class="card" style="text-align: left;">
                <div style="height: 200px; background: linear-gradient(45deg, var(--secondary), var(--primary)); border-radius: 10px; margin-bottom: 20px;"></div>
                <h3 style="font-size: 1.3rem;">Título do Artigo 2</h3>
                <p style="color: var(--gray); margin: 15px 0;">Resumo do artigo com as principais informações para atrair o leitor.</p>
                <a href="#" style="color: var(--primary); font-weight: 600; text-decoration: none;">Ler mais →</a>
              </div>
              <div class="card" style="text-align: left;">
                <div style="height: 200px; background: linear-gradient(45deg, var(--accent), var(--secondary)); border-radius: 10px; margin-bottom: 20px;"></div>
                <h3 style="font-size: 1.3rem;">Título do Artigo 3</h3>
                <p style="color: var(--gray); margin: 15px 0;">Resumo do artigo com as principais informações para atrair o leitor.</p>
                <a href="#" style="color: var(--primary); font-weight: 600; text-decoration: none;">Ler mais →</a>
              </div>
            </div>
          </div>
        </section>`

      case 'careers':
        return `
        <section id="careers" style="background: var(--light);">
          <div class="container">
            <div class="section-title">
              <h2>Carreiras</h2>
              <p>Junte-se ao nosso time</p>
            </div>
            <div style="max-width: 800px; margin: 0 auto;">
              <div class="card" style="text-align: left; margin-bottom: 20px;">
                <h3 style="color: var(--primary);">Desenvolvedor Full Stack</h3>
                <p style="color: var(--gray); margin: 10px 0;">São Paulo, SP • Remoto</p>
                <p style="margin-top: 15px;">Procuramos desenvolvedor experiente para atuar em projetos desafiadores.</p>
                <button class="btn" style="margin-top: 20px;">Candidatar-se</button>
              </div>
              <div class="card" style="text-align: left; margin-bottom: 20px;">
                <h3 style="color: var(--primary);">Designer UI/UX</h3>
                <p style="color: var(--gray); margin: 10px 0;">Rio de Janeiro, RJ • Híbrido</p>
                <p style="margin-top: 15px;">Criativo e apaixonado por experiências digitais incríveis.</p>
                <button class="btn" style="margin-top: 20px;">Candidatar-se</button>
              </div>
            </div>
          </div>
        </section>`

      default:
        return ''
    }
  }

  // Gera SEO meta tags
  const seoTags = data.features.seo ? `
  <meta name="description" content="${data.description}">
  <meta name="keywords" content="${data.name}, ${data.template}, site profissional">
  <meta name="author" content="${data.name}">
  <meta property="og:title" content="${data.name}">
  <meta property="og:description" content="${data.description}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="robots" content="index, follow">
  ` : ''

  // Gera Google Analytics
  const analyticsScript = data.features.analytics ? `
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  </script>
  ` : ''

  // Monta o HTML completo
  const sectionsHtml = data.sections.map(section => generateSection(section)).join('\n')

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.name} - ${data.description}</title>
  ${seoTags}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${googleFonts}" rel="stylesheet">
  ${analyticsScript}
  <style>${baseStyles}</style>
</head>
<body>
  <!-- Header -->
  <header>
    <nav>
      <a href="#" class="logo">${data.name}</a>
      <ul class="nav-links">
        ${data.sections.includes('about') ? '<li><a href="#about">Sobre</a></li>' : ''}
        ${data.sections.includes('services') || data.sections.includes('features') ? '<li><a href="#features">Serviços</a></li>' : ''}
        ${data.sections.includes('menu') || data.sections.includes('featured-products') ? '<li><a href="#menu">Cardápio</a></li>' : ''}
        ${data.sections.includes('testimonials') ? '<li><a href="#testimonials">Depoimentos</a></li>' : ''}
        ${data.sections.includes('contact') ? '<li><a href="#contact">Contato</a></li>' : ''}
      </ul>
      <a href="#contact" class="btn">Fale Conosco</a>
    </nav>
  </header>

  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <h1>${data.name}</h1>
      <p>${data.description}</p>
      <div class="hero-buttons">
        <a href="#contact" class="btn">Começar Agora</a>
        <a href="#about" class="btn btn-secondary">Saiba Mais</a>
      </div>
    </div>
  </section>

  <!-- Seções Dinâmicas -->
  ${sectionsHtml}

  <!-- Footer -->
  <footer>
    <div class="footer-content">
      <div class="footer-section">
        <h3>${data.name}</h3>
        <p>${data.description}</p>
        <div class="social-links">
          ${data.businessInfo.socialMedia.instagram ? `<a href="https://instagram.com/${data.businessInfo.socialMedia.instagram.replace('@', '')}" target="_blank" title="Instagram">📷</a>` : ''}
          ${data.businessInfo.socialMedia.facebook ? `<a href="https://facebook.com/${data.businessInfo.socialMedia.facebook}" target="_blank" title="Facebook">📘</a>` : ''}
          ${data.businessInfo.socialMedia.linkedin ? `<a href="https://linkedin.com/company/${data.businessInfo.socialMedia.linkedin}" target="_blank" title="LinkedIn">💼</a>` : ''}
        </div>
      </div>
      <div class="footer-section">
        <h3>Contato</h3>
        <p>📍 ${data.businessInfo.address}</p>
        <p>📞 ${data.businessInfo.phone}</p>
        <p>📧 ${data.businessInfo.email}</p>
      </div>
      <div class="footer-section">
        <h3>Links Rápidos</h3>
        ${data.sections.includes('about') ? '<a href="#about">Sobre Nós</a>' : ''}
        ${data.sections.includes('services') ? '<a href="#services">Serviços</a>' : ''}
        ${data.sections.includes('testimonials') ? '<a href="#testimonials">Depoimentos</a>' : ''}
        <a href="#contact">Fale Conosco</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} ${data.name}. Todos os direitos reservados.</p>
    </div>
  </footer>
</body>
</html>
  `.trim()
}

export default App
