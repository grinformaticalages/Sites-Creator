import { useState } from 'react'
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
  }
}

function App() {
  const [siteData, setSiteData] = useState<SiteData>({
    name: 'Meu Site',
    template: 'basic',
    description: 'Um site incrível gerado automaticamente',
    colors: {
      primary: '#2563eb',
      secondary: '#7c3aed'
    }
  })
  const [exportStatus, setExportStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' })
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    setExportStatus({ type: null, message: '' })

    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.exportSite(siteData)
        
        if (result.success) {
          setExportStatus({ 
            type: 'success', 
            message: `✅ ${result.message}` 
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
    { id: 'basic', name: 'Site Básico', description: 'Home, sobre, serviços e contato' },
    { id: 'landing-page', name: 'Landing Page', description: 'Página única focada em conversão' },
    { id: 'portfolio', name: 'Portfólio', description: 'Ideal para profissionais criativos' },
    { id: 'ecommerce', name: 'E-commerce', description: 'Loja virtual com produtos' },
    { id: 'blog', name: 'Blog', description: 'Site para artigos e conteúdo' }
  ]

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 Construtor de Sites</h1>
        <p className="subtitle">Crie sites completos com estrutura profissional</p>
      </header>

      <main className="main-content">
        <section className="config-section">
          <h2>1️⃣ Configurações</h2>
          <div className="form-group">
            <label>Nome do Site:</label>
            <input
              type="text"
              value={siteData.name}
              onChange={(e) => setSiteData({ ...siteData, name: e.target.value })}
              placeholder="Ex: Minha Empresa"
            />
          </div>
          <div className="form-group">
            <label>Descrição:</label>
            <textarea
              value={siteData.description}
              onChange={(e) => setSiteData({ ...siteData, description: e.target.value })}
              rows={3}
            />
          </div>
        </section>

        <section className="config-section">
          <h2>2️⃣ Template</h2>
          <div className="templates-grid">
            {templates.map((t) => (
              <div
                key={t.id}
                className={`template-card ${siteData.template === t.id ? 'selected' : ''}`}
                onClick={() => setSiteData({ ...siteData, template: t.id })}
              >
                <h3>{t.name}</h3>
                <p>{t.description}</p>
                {siteData.template === t.id && <div className="checkmark">✓</div>}
              </div>
            ))}
          </div>
        </section>

        <section className="config-section">
          <h2>3️⃣ Cores</h2>
          <div className="colors-config">
            <div className="color-picker">
              <label>Primária:</label>
              <input
                type="color"
                value={siteData.colors.primary}
                onChange={(e) => setSiteData({ ...siteData, colors: { ...siteData.colors, primary: e.target.value } })}
              />
              <span>{siteData.colors.primary}</span>
            </div>
            <div className="color-picker">
              <label>Secundária:</label>
              <input
                type="color"
                value={siteData.colors.secondary}
                onChange={(e) => setSiteData({ ...siteData, colors: { ...siteData.colors, secondary: e.target.value } })}
              />
              <span>{siteData.colors.secondary}</span>
            </div>
          </div>
        </section>

        <section className="preview-section">
          <h2>👁️ Estrutura Gerada</h2>
          <div className="structure-preview">
            <div className="file-tree">
              <div className="folder">
                <span>📁 {siteData.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}/</span>
                <div className="files">
                  <div className="file">📄 index.html</div>
                  <div className="file">📁 css/style.css</div>
                  <div className="file">📁 js/main.js</div>
                  <div className="file">📁 images/</div>
                  <div className="file">📖 README.md</div>
                </div>
              </div>
            </div>
            <div className="features-list">
              <h3>Incluso:</h3>
              <ul>
                <li>✅ HTML5 responsivo</li>
                <li>✅ CSS moderno</li>
                <li>✅ JavaScript interativo</li>
                <li>✅ Smooth scroll</li>
                <li>✅ Formulário funcional</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="export-section">
          <button className="export-button" onClick={handleExport} disabled={isExporting || !siteData.name.trim()}>
            {isExporting ? '⏳ Exportando...' : '💾 Exportar Site Completo'}
          </button>
          {exportStatus.type && (
            <div className={`status-message ${exportStatus.type}`}>{exportStatus.message}</div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Construtor de Sites v1.0 - Electron + React + TypeScript</p>
      </footer>
    </div>
  )
}

export default App
