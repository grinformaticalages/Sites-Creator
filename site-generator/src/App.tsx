import { useState } from 'react'

function App() {
  const [siteName, setSiteName] = useState('Meu Site')
  const [generatedHTML, setGeneratedHTML] = useState('')

  const generateSite = () => {
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteName}</title>
</head>
<body>
    <h1>Bem-vindo ao ${siteName}!</h1>
    <p>Este site foi gerado automaticamente.</p>
</body>
</html>`
    setGeneratedHTML(html)
  }

  const downloadSite = () => {
    if (!generatedHTML) return
    
    const blob = new Blob([generatedHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'index.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 Gerador de Sites</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Nome do Site:{' '}
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            style={{ padding: '8px', marginLeft: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </label>
      </div>

      <button
        onClick={generateSite}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
      >
        Gerar Site
      </button>

      {generatedHTML && (
        <button
          onClick={downloadSite}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Baixar HTML
        </button>
      )}

      {generatedHTML && (
        <div style={{ marginTop: '20px' }}>
          <h3>Prévia do código:</h3>
          <pre
            style={{
              backgroundColor: '#f4f4f4',
              padding: '15px',
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '400px'
            }}
          >
            {generatedHTML}
          </pre>
        </div>
      )}
    </div>
  )
}

export default App
