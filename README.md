# GRID Agency — Portfolio Clone

Um clone de alta fidelidade do site [GRID Agency (Framer)](https://gridagency.framer.website/), construído com **React 19**, **Vite**, **Tailwind CSS v4**, **Framer Motion** e **Lenis Smooth Scroll**.

Inclui o efeito completo de **Sticky Stacking Sections (Scroll Overlap)**, onde cada seção fixa na rolagem e é suavemente sobreposta pela seção seguinte em camadas tridimensionais, preservando a responsividade e o desempenho.

---

## ✨ Funcionalidades & Efeitos

- **Sticky Stacking Sections (Scroll Overlap)**:
  - Hero inicial ocupa 100vh e permanece fixo no topo (`position: sticky`, `top: 0`, `z-index: 10`).
  - Conforme a página rola, as seções subsequentes (`Work`, `About`, `Services`, `Brands`, `Process`, `Reviews`, `Stats`, `Contact CTA` e `Footer`) sobem e cobrem a seção anterior em profundidade progressiva (`z-10` a `z-100`).
  - Suporte inteligente a seções altas (> 100vh) através do componente dinâmico [`StackSection.jsx`](src/components/StackSection.jsx) com `ResizeObserver` (`top: min(0, vh - height)`).
  - Sem quebras de overflow: uso de `overflow-x: clip` no `html`/`body` para assegurar suporte total a `sticky`.
- **Lenis Smooth Scroll**:
  - Rolagem cinética ultra-suave com inércia natural (`lerp: 0.1`, `smoothWheel: true`), perfeitamente integrada aos cálculos de layout.
- **Tipografia e Design System**:
  - Família tipográfica **Switzer** (Fontshare, pesos 400 a 900) e **Inter Display** idênticas ao original.
  - Paleta com preto puro (`#000000`), superfícies `#0a0a0a` / `#111111`, bordas finas com tons translúcidos e acentos em vermelho degradê.
  - Giant Wordmark `GRID©` responsivo no Hero e Footer.
- **Rotas e Páginas**:
  - `/`: Página inicial completa com todas as seções (Hero, Work, About, Services, Brands, Process, Reviews, Stats, CTA, Footer).
  - `/project`: Galeria completa de cases selecionados.
  - `/project/:slug`: Páginas de detalhes individuais dos projetos (`nova-grid`, `lumo-wellness`, `viron`, `kora-co`) com problema, solução, resultados, galeria de imagens e navegação circular.
  - `/about`: História do estúdio, estatísticas em contadores animados, equipe e prêmios.
  - `/contact`: Formulário interativo com validação de campos, feedback visual de envio e informações de escritórios.
- **Micro-interações**:
  - Animação de contadores numéricos suaves com `easeOutExpo`.
  - Destaque palavra por palavra guiado por scroll na seção de Reviews.
  - Header fixo com efeito backdrop-blur (`z-[999]`) e gaveta de menu responsivo para mobile.

---

## 🛠️ Tecnologias

- **Framework:** [React 19](https://react.dev/)
- **Bundler:** [Vite 8](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Rolagem Suave:** [Lenis](https://lenis.darkroom.engineering/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Tipografia:** Switzer (Fontshare) & Inter Display

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js ≥ 20
- npm ou pnpm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/MMagnoDev/port.git
cd port

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Build de Produção

```bash
# Gerar bundle otimizado
npm run build

# Pré-visualizar a versão de produção
npm run preview
```

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── AnimatedCounter.jsx       # Contador numérico animado
│   ├── BlurRevealHeading.jsx     # Título com efeito blur reveal
│   ├── ContactCTA.jsx            # Banner de chamada com degradê
│   ├── Footer.jsx                # Rodapé com wordmark gigante e back-to-top
│   ├── Header.jsx                # Navegação fixa superior e menu mobile
│   ├── ScrollWordHighlight.jsx   # Destaque de texto por palavra sincronizado ao scroll
│   ├── StackSection.jsx          # Container de sticky stacking com cálculo dinâmico
│   └── Wordmark.jsx              # Logo vetorial SVG
├── data/
│   └── siteData.js               # Conteúdo, projetos, serviços e marcas
├── pages/
│   ├── HomePage.jsx              # Landing page completa com sticky stacking
│   ├── ProjectsPage.jsx          # Lista de projetos selecionados
│   ├── ProjectDetailPage.jsx     # Detalhes do case de estudo
│   ├── AboutPage.jsx             # Sobre o estúdio e equipe
│   └── ContactPage.jsx           # Formulário de contato e locais
├── App.jsx                       # Roteamento SPA e inicialização do Lenis
├── index.css                     # Importação de fontes e regras de overflow
└── main.jsx                      # Ponto de entrada da aplicação
```

---

## 📄 Licença

Este projeto foi desenvolvido para fins de demonstração técnica e portfólio. Todos os direitos dos assets visuais pertencem aos seus respectivos autores originais.
