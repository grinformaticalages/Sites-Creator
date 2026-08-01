# 🚀 Gerador de Sites

Um aplicativo simples para gerar sites HTML básicos. Este é o MVP (Mínimo Produto Viável) que evoluirá com o tempo.

## Tecnologia Utilizada

- **React** com TypeScript
- **Vite** como bundler e dev server
- **Windows** como plataforma alvo

## Funcionalidades Atuais (MVP)

- ✅ Inserir nome do site
- ✅ Gerar HTML básico automaticamente
- ✅ Visualizar prévia do código gerado
- ✅ Baixar arquivo HTML gerado

## Como Usar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

O servidor de desenvolvimento iniciará em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.

### Preview da Build

```bash
npm run preview
```

## Próximos Passos (Roadmap)

- [ ] Adicionar mais templates de sites
- [ ] Personalização de cores e fontes
- [ ] Adicionar múltiplas páginas
- [ ] Exportar como projeto completo
- [ ] Interface mais avançada
- [ ] Empacotar como aplicativo Windows (.exe)

## Estrutura do Projeto

```
site-generator/
├── src/
│   ├── App.tsx          # Componente principal
│   ├── main.tsx         # Ponto de entrada
│   └── index.css        # Estilos globais
├── index.html           # HTML base
├── package.json         # Dependências e scripts
├── tsconfig.json        # Configuração TypeScript
└── vite.config.ts       # Configuração Vite
```

## Licença

ISC
