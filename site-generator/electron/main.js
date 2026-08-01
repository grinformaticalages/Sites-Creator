const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    icon: path.join(__dirname, '../public/icon.ico'),
    titleBarStyle: 'default',
    frame: true
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handler para exportar o site
ipcMain.handle('export-site', async (event, siteData) => {
  try {
    // Abre diálogo para selecionar pasta de destino
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory', 'createDirectory'],
      title: 'Selecione a pasta para salvar o site',
      buttonLabel: 'Selecionar Pasta'
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, message: 'Operação cancelada' };
    }

    const outputPath = result.filePaths[0];
    
    // Cria estrutura completa do site baseado no template
    await generateSiteStructure(outputPath, siteData);

    return { 
      success: true, 
      message: `Site gerado com sucesso em: ${outputPath}`,
      path: outputPath
    };
  } catch (error) {
    console.error('Erro ao exportar site:', error);
    return { success: false, message: error.message };
  }
});

async function generateSiteStructure(basePath, siteData) {
  const { name, template, colors, pages, features } = siteData;
  
  // Cria pasta principal do site
  const siteFolder = path.join(basePath, name.replace(/[^a-z0-9]/gi, '-').toLowerCase());
  
  if (!fs.existsSync(siteFolder)) {
    fs.mkdirSync(siteFolder, { recursive: true });
  }

  // Gera arquivos baseados no template selecionado
  switch (template) {
    case 'landing-page':
      await generateLandingPage(siteFolder, siteData);
      break;
    case 'portfolio':
      await generatePortfolio(siteFolder, siteData);
      break;
    case 'ecommerce':
      await generateEcommerce(siteFolder, siteData);
      break;
    case 'blog':
      await generateBlog(siteFolder, siteData);
      break;
    default:
      await generateBasicSite(siteFolder, siteData);
  }
}

async function generateBasicSite(siteFolder, siteData) {
  const { name, colors, description } = siteData;

  // Cria index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="logo">${name}</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">Sobre</a></li>
                <li><a href="#services">Serviços</a></li>
                <li><a href="#contact">Contato</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            <h1>Bem-vindo ao ${name}</h1>
            <p>${description || 'Seu site incrível começa aqui'}</p>
            <button class="cta-button">Saiba Mais</button>
        </section>

        <section id="about" class="about">
            <h2>Sobre Nós</h2>
            <p>Informações sobre sua empresa ou projeto.</p>
        </section>

        <section id="services" class="services">
            <h2>Nossos Serviços</h2>
            <div class="service-grid">
                <div class="service-card">
                    <h3>Serviço 1</h3>
                    <p>Descrição do serviço</p>
                </div>
                <div class="service-card">
                    <h3>Serviço 2</h3>
                    <p>Descrição do serviço</p>
                </div>
                <div class="service-card">
                    <h3>Serviço 3</h3>
                    <p>Descrição do serviço</p>
                </div>
            </div>
        </section>

        <section id="contact" class="contact">
            <h2>Contato</h2>
            <form class="contact-form">
                <input type="text" placeholder="Seu nome" required>
                <input type="email" placeholder="Seu email" required>
                <textarea placeholder="Sua mensagem"></textarea>
                <button type="submit">Enviar</button>
            </form>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 ${name}. Todos os direitos reservados.</p>
    </footer>

    <script src="js/main.js"></script>
</body>
</html>`;

  // Cria CSS
  const cssContent = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 5%;
    background-color: ${colors?.primary || '#2563eb'};
    color: white;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
    transition: opacity 0.3s;
}

.nav-links a:hover {
    opacity: 0.8;
}

.hero {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: linear-gradient(135deg, ${colors?.primary || '#2563eb'}, ${colors?.secondary || '#7c3aed'});
    color: white;
    padding: 0 20px;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.cta-button {
    padding: 1rem 2rem;
    background-color: white;
    color: ${colors?.primary || '#2563eb'};
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    margin-top: 2rem;
    transition: transform 0.3s;
}

.cta-button:hover {
    transform: scale(1.05);
}

section {
    padding: 5rem 10%;
}

.about, .services, .contact {
    background-color: #f9fafb;
}

.service-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.service-card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 500px;
    margin: 2rem auto;
}

.contact-form input,
.contact-form textarea {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

.contact-form textarea {
    min-height: 150px;
    resize: vertical;
}

.contact-form button {
    padding: 1rem;
    background-color: ${colors?.primary || '#2563eb'};
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.contact-form button:hover {
    background-color: ${colors?.secondary || '#7c3aed'};
}

footer {
    background-color: #1f2937;
    color: white;
    text-align: center;
    padding: 2rem;
}`;

  // Cria JavaScript
  const jsContent = `// Smooth scrolling para navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Animação simples ao fazer scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});

// Formulário de contato
document.querySelector('.contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Obrigado pelo contato! Respondemos em breve.');
    e.target.reset();
});`;

  // Cria diretórios
  const cssDir = path.join(siteFolder, 'css');
  const jsDir = path.join(siteFolder, 'js');
  const imagesDir = path.join(siteFolder, 'images');

  [cssDir, jsDir, imagesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Escreve arquivos
  fs.writeFileSync(path.join(siteFolder, 'index.html'), indexHtml);
  fs.writeFileSync(path.join(cssDir, 'style.css'), cssContent);
  fs.writeFileSync(path.join(jsDir, 'main.js'), jsContent);

  // Cria README do site gerado
  const readmeContent = `# ${name}

Site gerado automaticamente pelo Site Generator.

## Estrutura

\`\`\`
${name}/
├── index.html      # Página principal
├── css/
│   └── style.css   # Estilos
├── js/
│   └── main.js     # JavaScript
└── images/         # Imagens do site
\`\`\`

## Como usar

Basta abrir o arquivo \`index.html\` em um navegador.

## Personalização

Edite os arquivos CSS e JS conforme necessário.
`;

  fs.writeFileSync(path.join(siteFolder, 'README.md'), readmeContent);
}

// Templates adicionais (simplificados para exemplo)
async function generateLandingPage(siteFolder, siteData) {
  // Implementação similar ao generateBasicSite mas com estrutura de landing page
  await generateBasicSite(siteFolder, siteData);
}

async function generatePortfolio(siteFolder, siteData) {
  await generateBasicSite(siteFolder, siteData);
}

async function generateEcommerce(siteFolder, siteData) {
  await generateBasicSite(siteFolder, siteData);
}

async function generateBlog(siteFolder, siteData) {
  await generateBasicSite(siteFolder, siteData);
}
