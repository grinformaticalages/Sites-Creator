# 🚀 Construtor de Sites - Electron Desktop App

Um aplicativo desktop para Windows que gera sites completos com estrutura profissional.

## 🎯 Objetivo

Criar um **Construtor de Sites** onde o usuário:
1. Abre o app desktop (Electron)
2. Escolhe um template de site
3. Customiza cores, textos e informações
4. Vê preview da estrutura ao vivo
5. Clica em "Exportar" e o app cria uma pasta completa com todos os arquivos do site

## 📁 Estrutura do Projeto

```
site-generator/
├── electron/              # Código Electron (backend do desktop)
│   ├── main.js           # Processo principal do Electron
│   └── preload.js        # Ponte segura entre renderer e main
├── src/                  # Código React (frontend/UI)
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Entry point do React
│   └── index.css         # Estilos da interface
├── dist/                 # Build de produção (gerado automaticamente)
├── release/              # Instalador Windows (.exe) gerado
├── package.json          # Dependências e scripts
└── README.md             # Este arquivo
```

## 🛠️ Tecnologias

- **Electron** - Framework para apps desktop
- **React + TypeScript** - Interface moderna e tipada
- **Vite** - Build tool rápido
- **electron-builder** - Empacotamento para Windows

## 🚀 Como Usar

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento (apenas UI no navegador)
npm run dev

# Rodar como app Electron (requer build prévio)
npm run electron:start
```

### Build e Distribuição

```bash
# Build de produção
npm run build

# Criar instalador Windows (.exe)
npm run electron:build
```

O instalador será gerado na pasta `release/`.

## 📤 Estrutura do Site Gerado

Quando o usuário exporta um site, é criada esta estrutura:

```
NomeDoSite/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos personalizados
├── js/
│   └── main.js         # JavaScript interativo
├── images/             # Pasta para imagens
└── README.md           # Documentação do site
```

## 🎨 Templates Disponíveis

1. **Site Básico** - Home, sobre, serviços e contato
2. **Landing Page** - Página única focada em conversão
3. **Portfólio** - Ideal para profissionais criativos
4. **E-commerce** - Loja virtual com produtos
5. **Blog** - Site para artigos e conteúdo

## 🔮 Próximas Evoluções

- [ ] Mais templates especializados
- [ ] Upload de imagens personalizadas
- [ ] Integração com bancos de dados (Firebase, Supabase)
- [ ] Deploy automático em nuvem (Vercel, Netlify)
- [ ] Múltiplas páginas no site gerado
- [ ] SEO configurável
- [ ] Analytics integrado
- [ ] Temas escuro/claro

## 📝 Notas

- O app funciona offline após instalado
- Os sites gerados são 100% estáticos (HTML/CSS/JS)
- Compatível com qualquer hospedagem web
- Sem necessidade de backend para sites básicos

---

**Versão:** 1.0  
**Licença:** MIT
