# GRID — Auditoria do site original

Site de referência: https://gridagency.framer.website/
Data da auditoria: 05/11/2026
Status: **Fase 01 PARCIAL** — conteúdo e estrutura mapeados; referência visual **apenas da Home em 1920px** (seção 14, a partir de uma captura enviada pelo usuário); estilos computados, fontes, breakpoints, hover, animações reais e as demais páginas **não verificados** (seção 12).

---

## 1. Método e limitações

### O que foi feito
Leitura do HTML renderizado (via fetch de texto/markdown) das 8 páginas do site. Isso fornece: textos, hierarquia de headings, links reais, `alt` de imagens, URLs de imagens com dimensões, metadados.

### O que NÃO foi possível neste ambiente
- Não há navegador neste ambiente: **eu não capturei screenshots**. O único material visual é **1 captura full-page da Home em 1920px**, enviada pelo usuário (analisada na seção 14). Não existe captura de `/project`, `/about`, `/contact`, das páginas de projeto, nem de 1440 / 1280 / 768 / 390 / 360.
- O fetch retorna conteúdo textual: **não expõe CSS, estilos computados, `@font-face`, requisições de rede nem JS**.
- A rede do sandbox de execução está desabilitada: **nenhum asset foi baixado**.
- O índice de busca do Framer (`searchIndex-tuWpv2jMExo7.json`) aparece nos metadados, mas o fetch recusou a URL por não constar como link nos resultados.
- Uma busca pela página do template no marketplace do Framer não retornou o template (apenas outros). Fontes e licença não foram confirmadas por essa via.

As seções 1–13 não contêm valores visuais. Os únicos valores medidos estão na seção 14 e valem **somente para a Home em 1920px**. Easing, duração e delay de animação continuam sem medição.

---

## 2. Metadados do template

| Campo | Valor |
|---|---|
| Gerador | Framer `f8e97a5` |
| ID do site Framer | `2ZRlbFT5Ndz6Ln3h8LsuPo` |
| Descrição (meta) | "GRID is a modern Framer template for creative agencies, design studios, and digital teams. Showcase your work, services, and creative vision with a refined website built for branding studios, web designers, UI/UX designers, and creative professionals." |
| `og:image` (Home/Project/About/Contact) | `framerusercontent.com/images/OsE5QdUMfpNXi1SCH70SPHvFc4.png` |
| Autor ("Designed by", rodapé) | Akinbinu Akintayo — https://www.framer.com/@akinbinu-akintayo/?tab=templates |
| `<title>` Home, Project, About, Contact | `GRID©` |
| `<title>` páginas de projeto | `<Nome> - Waheedi` |
| `og:image` páginas de projeto | primeira imagem da galeria de cada projeto |

**Observação de licença:** o site é um template do Framer, e o rodapé credita o autor. Textos, imagens e identidade visual pertencem ao autor do template e são licenciados para quem o adquire dentro do Framer. Reutilizar os assets em um site independente exige verificar a licença. Isto não foi verificado.

---

## 3. Mapa de rotas (descobertas pelos links reais)

| Rota | Título da página | Observação |
|---|---|---|
| `/` | GRID© | Home |
| `/#services` | — | Âncora na Home |
| `/#process` | — | Âncora na Home |
| `/project` | GRID© | Listagem |
| `/project/nova-grid` | Nova Grid - Waheedi | |
| `/project/lumo-wellness` | Lumo Well - Waheedi | **slug ≠ nome** |
| `/project/viron` | Viron Labs - Waheedi | **slug ≠ nome** |
| `/project/kora-co` | Kora & Co - Waheedi | |
| `/about` | GRID© | |
| `/contact` | GRID© | |

Os slugs `lumo-wellness` e `viron` diferem dos nomes exibidos ("Lumo Well", "Viron Labs").

Não foi possível confirmar a ausência de outras rotas (sitemap não acessado, índice de busca bloqueado). Nenhum link para rota adicional aparece em nenhuma das 8 páginas lidas.

**Navegação entre projetos (loop circular):** Nova Grid → Lumo → Viron → Kora → Nova → …

---

## 4. Componentes globais

### Header (idêntico em todas as páginas)
- Logo: texto `Grid®` (link para `/`). Aparece duas vezes no HTML (ver seção 9).
- Links: Work → `/project` · Studio → `/about` · Services → `/#services` · Process → `/#process` · Contact → `/contact`
- Botão de texto: `Menu` (provável gatilho do menu mobile — **comportamento não observado**)

### Footer (idêntico em todas as páginas)
- Título: `Grid©`
- Email (texto): `47thegreatt@gmail.com` — href: `mailto:47thgreatt@gmail.com` *(diverge do texto)*
- Telefone (texto): `+47 (0) 47 47 477` — href: `tel:123445789` *(diverge do texto)*
- `/Social`: X (Twitter) https://x.com/47thegreat_ · Linkedin https://www.linkedin.com/in/akinbinuakintayo/ · Instagram https://www.instagram.com/47thegreat · Behance https://www.behance.net/creative47
- `/Nav`: Home `/` · Work `/project` · Studio `/about` · Services `/#services` · Contact `/contact` (sem "Process")
- Wordmark `GRID©`
- Crédito: "Designed by" + avatar (`uNMWjq9rMQXg01hjnRX0T6EoV8.png`, 1080×1080) + "Akinbinu Akintayo"
- `Back to top` → link para `/` (comportamento de scroll **não observado**)
- Selo Framer ("Create a free website with Framer…") — é injetado pela hospedagem `framer.website`, não faz parte do design.

---

## 5. Home (`/`) — seção por seção

Ordem observada no HTML:

### A. Hero
- Imagem: `YW8HSxOagJ9n2ox0OjdrR3EBp8.png` (1808×2400)
- Três rótulos em caixa-alta (h3): `ART DIRECTION`, `BRAND DESIGN`, `WEB DESIGN`, cada um repetido 3×
- Texto institucional: `BUILDING DISTINCTIVE VISUAL EXPERIENCES THAT HELP BRANDS STAND OUT AND CONNECT.` (h3 + parágrafo duplicado)
- Wordmark `GRID©` repetido 3×

### B. Work
- h1 `Work` · legenda `(Selected Project)`
- 4 cards, cada um um link:
  | Projeto | Categorias | Destino |
  |---|---|---|
  | Nova Grid | Brand, Graphic | `/project/nova-grid` |
  | Lumo Well | Graphic, Brand | `/project/lumo-wellness` |
  | Viron Labs | Brand, Web | `/project/viron` |
  | Kora & Co | Web, Art Direction | `/project/kora-co` |
- `alt` dos cards: "elegant portrait", "elegant bag", "portrait", "portrait"
- Link `View all` → `/project`

### C. About
- h1 `About` · legenda `(Who am I)`
- Heading (variante A): "A digital design studio focused on creating refined brand identities and seamless web experiences."
- Heading (variante B): "A digital design studio focused on creating refined simple brand identities and functional seamless web experiences."
- Imagem: `4hsBNFGSbvNOMV3kSyJST82O8.png` (900×1200), alt "black and white portrait"
- Parágrafos: 3 (apresentação de "Waheedi Gabriel", colaborações com "Framer, Nike, Google, and Amazon", e texto sobre brand/web design) — copiar do HTML original na implementação
- Link `Read more` → `/about`

### D. Service
- h1 `Service` · legenda `(What I do)`
- 1 Branding — "Crafting distinctive, memorable brands that connect, communicate, and stand out in any market."
- 2 Web Design — "Designing seamless, user-focused websites that look great and perform even better."
- 3 Art Design — "Creating visually compelling designs that bring your ideas to life and capture attention instantly."
- Âncora de destino: `/#services` (ID exato do elemento **não verificado**)

### E. Brands
- h1 `Brands` · legenda `(Past Clients)`
- 6 slots de logo, 5 arquivos únicos (o 5º e o 6º slot usam o mesmo arquivo). Cada slot aparece 2× na Home (3× no About). Ver seção 8.

### F. Process
- h1 `Process` · legenda `(What I do)`
- 01 Discovery — "Understanding your goals, audience, and vision to lay a strong strategic foundation." — `W3i4rr08W4yS2rB2GJ4YAlSGw.png` (1280×1699), alt "avant garde portrait"
- 02 Strategy — "Defining a clear direction with insights and planning that guide every creative decision." — `Y5TM2FuQsmk4zgwW18RCeg47QXo.png`, alt "silhouette on orange"
- 03 Design — "Transforming ideas into visually compelling, functional solutions that align with your brand." — `IA6xgWlZJIOJtN0e5GOl7fNoGDA.png`, alt "red hat portrait"
- 04 Delivery — "Refining, finalizing, and launching with precision to ensure everything performs seamlessly." — `7j65JcqYI4j5TpXipMn5fRNg4Ns.png`, alt "serene portrait flowers"
- Âncora de destino: `/#process`

### G. Reviews
- h1 `Reviews` · legenda `(Testimonials)`
- Citação: "Working with him was seamless from start to finish. He understood our vision and transformed it into a brand and website that truly stands out."
- Autor: Jane Janet — Founder - Podolski
- Imagem: `scfybtmOehXLT8XdPRjFd7M.png` (1280×1699), alt "futuristic fashion"

### H. Stats
- h1 `Stats` · legenda `(Facts)`
- 47+ — Projects Delivered — "Across branding, web, and product design, delivering tailored solutions that meet both user needs and business goals."
- 98% — Client Satisfaction — "Consistently high client ratings driven by clear communication, reliability, and thoughtful design execution."
- 10+ — Years of Experience — "Hands-on experience crafting intuitive, visually compelling designs across multiple industries and platforms."
- 12+ — Design Awards — "Recognized for excellence in visual design, user experience, and creative innovation across industry platforms."

### I. Contact CTA
- h1 em duas linhas: `Let's build something` / `great together`
- Botão/link `Contact` → `/contact`
- Imagem: `DkyFLmBYvs0vQpa51WP8ZjGf67c.png` (1920×2549), alt "elegant portrait in hat" — bloco repetido 3×

### J. Footer
Ver seção 4.

---

## 6. `/project`

- h1 `Projects`
- Mesmos 4 cards da Home (mesmas categorias e links), sem "View all"
- Footer global

---

## 7. `/about`

- Heading de abertura: "Waheedi is an independent studio based in Oke Mapo, dedicated to crafting thoughtful, visually striking work across design, storytelling, illustration and digital experiences."
- 2 parágrafos institucionais ("At its core, Waheedi is driven by curiosity…", "Whether collaborating with brands, individuals, or communities…")
- Contadores (h1 + h2), ordem: `Projects`, `Awards`, `Clients`, `Experience`. O texto bruto de todos é `47+0+`. Isso indica um componente de contagem animada cujos valores finais **não puderam ser determinados** sem renderizar.
- Imagem "group team": `NNSUobq8lPFNxj8uNsBHBLm7Ijw.png` (1200×840)
- Heading: "Rooted in a deep appreciation for culture and detail, the studio blends contemporary aesthetics with purposeful creativity."
- `(Clients)` — faixa de logos (6 slots × 3 cópias)
- `(Services)`:
  - Digital Design — "Creating cohesive visual experiences for digital platforms, from interfaces to brand touchpoints, with a focus on clarity, usability, and impact."
  - Web Design — "Designing responsive, user-focused websites that balance aesthetics and functionality, ensuring a seamless experience across devices."
  - Graphic Design — "Crafting bold and meaningful visuals—from brand identities to marketing materials—that communicate ideas clearly and memorably."
  - Web Dev — "Building fast, reliable, and scalable websites using modern technologies, turning design concepts into fully functional digital products."
- `(Awards)`:
  - 10x Site of the Day — Awwards
  - 20x Brand Identity — Behance
  - 2x Site of the Month — Awwards
  - 8x Site of the Day — Mobila
- `Partners` (equipe), 900×1200, alt "professional portrait man":
  - Sodiki Podolski — Design Director — `uIqeedrkCSH1iICvTDthpX5fyo.png`
  - Baliki Cole — Web Designer — `Di5KDyNsx3GqWUDomLgsRhwUhxI.png`
  - Toheebu Will — Brand Strategist — `t1bDp0TCUgX43tjqOir5r0eaL0.png`
  - Blesso Smith — Growth Head — `Bv2gNJRPzaPzVKQCWLJz1KpmO8.png`
- Contact CTA (igual à Home) e Footer global

---

## 8. `/contact`

- h1: "Let’s create something extraordinary together" (apóstrofo tipográfico `’`, diferente do `'` usado no CTA da Home)
- h2: `GET IN TOUCH`
- Formulário, rótulos em caixa-alta: `FIRST NAME`, `LAST NAME`, `EMAIL`, `MESSAGE`, botão `SUBMIT`
- Texto de fallback no HTML: "Enable JavaScript to submit this form." — é o formulário nativo do Framer. **Destino de envio e mensagens de validação/sucesso/erro não foram observados.**
- Bloco "Address": `Maple Avenue` / `Manchester M1 4BT, United Kingdom`
- Bloco "Inquiries": `47thegreatt@gmail.com`
- Escritórios:
  - Imagem `UNQCwOaTsglPv8wWE6z1X1ee9o.jpg` (3634×5451), alt "city skyscraper"
  - Imagem `TDrwTxp0gB6mb5dpa7DRbp8y3zk.jpg` (2092×2789), alt "city skyscraper"
  - Legendas, nesta ordem no HTML: "New York Office" / "221B Baker Street, London, United Kingdom" / "London Office" / "742 Evergreen Terrace, Sprinfield, United States"
  - **A associação imagem↔legenda não pôde ser confirmada** (a ordem no HTML pode não refletir o layout).
- Footer global

---

## 9. Páginas de projeto

Estrutura comum: título (h1) → resumo (h2) → metadados Client / Year / Deliverable → imagem principal 1640×1640 → Problem / Solution / Results → galeria de 4 imagens → bloco "próximo projeto" (heading com o primeiro nome do próximo projeto + imagem-link com alt "stationery mockup") → Footer.

| | Nova Grid | Lumo Well | Viron Labs | Kora & Co |
|---|---|---|---|---|
| Slug | `nova-grid` | `lumo-wellness` | `viron` | `kora-co` |
| Client | Nova Grid | Lumo | Viron | Kora |
| Year | 2026 | 2026 | 2026 | 2026 |
| Deliverable | Brand, Graphic | Graphic, Brand | Brand, Web | Web, Art Direction |
| Imagem principal | `Af6atAB1qceum72Z7qB4TePemvI.png` (alt "elegant portrait") | `VJJvcBr3MM7hKxVWrcl5CUdDC8.png` (alt "elegant bag") | `w0hRvEU68fiTIlmwtk7K9SoPh1Q.png` (alt "portrait") | `jpGS3v2jePVXTBtGgmibBeNWY.png` (alt "portrait") |
| Galeria (ordem) | hGUB… · GseM… · mXiG… · jsbK… | GseM… · hGUB… · PG3w… · mXiG… | PG3w… · jsbK… · hGUB… · GseM… | mXiG… · PG3w… · GseM… · hGUB… |
| Próximo projeto | Lumo | Viron | Kora | Nova |

Os textos de resumo, Problem, Solution e Results de cada projeto foram capturados integralmente e serão copiados do HTML original na implementação. Pontos de atenção de conteúdo (mantidos como no original):
- Nova Grid: o texto usa "NovaGrid" (sem espaço).
- Viron Labs: o texto usa "Vireon Labs" / "Vireon" (grafia diferente do nome do projeto).
- A galeria de cada projeto reaproveita as mesmas 5 imagens em ordens diferentes.
- A 1ª imagem da galeria de cada projeto é a `og:image` da respectiva página.

---

## 10. Descobertas estruturais importantes

### 10.1 Elementos duplicados no HTML
O pedido original perguntava se duplicatas servem a animações de loop. A evidência aponta para **duas causas distintas**:

1. **Variantes responsivas do Framer (causa mais provável para a maioria).** O Framer renderiza no HTML uma versão por breakpoint (Desktop/Tablet/Phone) e oculta as demais via CSS. Evidências:
   - O heading "About" da Home aparece em duas versões com **texto diferente** ("…refined brand identities…" vs "…refined simple brand identities and functional…").
   - Em `/about`, as legendas dos prêmios diferem entre cópias: "Awwards" vs "Awards"; "Behance" vs "Bydau".
   - O Footer e o Contact CTA aparecem 3× (compatível com 3 breakpoints).
2. ~~Clones de ticker/marquee (logos)~~ — **hipótese anterior refutada para desktop.** Na captura de 1920px os logos aparecem como grade estática 3×2 de 6 tiles, sem marquee (seção 14.5). As cópias extras (2× na Home, 3× no About) são, portanto, mais provavelmente variantes de outros breakpoints. Um marquee em tablet/mobile pode existir, mas **não foi verificado**.

**Isso é hipótese, não confirmação.** Exige inspecionar o DOM/CSS renderizado (classes de breakpoint, `display:none`, `animation`/`transform` nos tickers).

### 10.2 Consequência para o projeto
Como o conteúdo difere entre variantes, a reconstrução precisa decidir, por breakpoint, qual texto usar. Sem screenshots em 390/768/1440 não há como saber qual variante é visível em cada largura.

### 10.3 Inconsistências do template (dados do autor original)
- `mailto:47thgreatt@gmail.com` ≠ texto `47thegreatt@gmail.com`
- `tel:123445789` ≠ texto `+47 (0) 47 47 477`
- "Sprinfield" (grafia do original)
- Endereços e legendas de escritório incoerentes (Nova York ↔ Londres)
- Redes sociais apontam para perfis pessoais do autor do template

**Decisão pendente do usuário:** manter exatamente como no original (fidelidade) ou substituir por dados próprios.

---

## 11. Inventário de assets (URLs identificadas — nenhuma baixada)

Prefixo: `https://framerusercontent.com/images/`

| Arquivo | Dimensões | Uso | Status |
|---|---|---|---|
| `OsE5QdUMfpNXi1SCH70SPHvFc4.png` | — | og:image global | URL identificada |
| `YW8HSxOagJ9n2ox0OjdrR3EBp8.png` | 1808×2400 | Hero | URL identificada |
| `4hsBNFGSbvNOMV3kSyJST82O8.png` | 900×1200 | Home › About | URL identificada |
| `nLCHAaDNV3gUEopzzUw5gPNHg.png` | 250×56 | Logo cliente 1 | URL identificada |
| `qWiEuoiNYuoZtDjQNqI7bpq0nFY.png` | 228×54 | Logo cliente 2 | URL identificada |
| `8AEd1sF232xdskvyAeGOoZ5vc.png` | 200×80 | Logo cliente 3 | URL identificada |
| `0KpRZ9dBtIzz6d1xOA0nCeEWc0I.png` | 238×60 | Logo cliente 4 | URL identificada |
| `noHfjhJgknBOCWnO241ISWB3ctE.png` | 200×102 | Logos cliente 5 e 6 | URL identificada |
| `W3i4rr08W4yS2rB2GJ4YAlSGw.png` | 1280×1699 | Process 01 | URL identificada |
| `Y5TM2FuQsmk4zgwW18RCeg47QXo.png` | 1280×1699 | Process 02 | URL identificada |
| `IA6xgWlZJIOJtN0e5GOl7fNoGDA.png` | 1280×1699 | Process 03 | URL identificada |
| `7j65JcqYI4j5TpXipMn5fRNg4Ns.png` | 1280×1699 | Process 04 | URL identificada |
| `scfybtmOehXLT8XdPRjFd7M.png` | 1280×1699 | Reviews | URL identificada |
| `DkyFLmBYvs0vQpa51WP8ZjGf67c.png` | 1920×2549 | Contact CTA | URL identificada |
| `uNMWjq9rMQXg01hjnRX0T6EoV8.png` | 1080×1080 | Footer (avatar do autor) | URL identificada |
| `NNSUobq8lPFNxj8uNsBHBLm7Ijw.png` | 1200×840 | About › group team | URL identificada |
| `uIqeedrkCSH1iICvTDthpX5fyo.png` | 900×1200 | About › Sodiki Podolski | URL identificada |
| `Di5KDyNsx3GqWUDomLgsRhwUhxI.png` | 900×1200 | About › Baliki Cole | URL identificada |
| `t1bDp0TCUgX43tjqOir5r0eaL0.png` | 900×1200 | About › Toheebu Will | URL identificada |
| `Bv2gNJRPzaPzVKQCWLJz1KpmO8.png` | 900×1200 | About › Blesso Smith | URL identificada |
| `UNQCwOaTsglPv8wWE6z1X1ee9o.jpg` | 3634×5451 | Contact › escritório 1 | URL identificada |
| `TDrwTxp0gB6mb5dpa7DRbp8y3zk.jpg` | 2092×2789 | Contact › escritório 2 | URL identificada |
| `Af6atAB1qceum72Z7qB4TePemvI.png` | 1640×1640 | Nova Grid › principal | URL identificada |
| `VJJvcBr3MM7hKxVWrcl5CUdDC8.png` | 1640×1640 | Lumo Well › principal | URL identificada |
| `w0hRvEU68fiTIlmwtk7K9SoPh1Q.png` | 1640×1640 | Viron Labs › principal | URL identificada |
| `jpGS3v2jePVXTBtGgmibBeNWY.png` | 1640×1640 | Kora & Co › principal | URL identificada |
| `hGUB4bwROyNRGhLqlovAxryiI.png` | 876×1200 | Galeria (pool) | URL identificada |
| `GseMenoRjwfTQZCvi7DNWP0ZFgw.png` | 898×1200 | Galeria (pool) | URL identificada |
| `mXiGtQIBIW4TJ0Z6WkjdEq4Og.png` | 876×1200 | Galeria (pool) | URL identificada |
| `jsbK3eyAUJrgMaJBoXFTRy5yFc.png` | 876×1200 | Galeria (pool) | URL identificada |
| `PG3weNsbriAp37CQp98sxKg5lU4.png` | 876×1200 | Galeria (pool) | URL identificada |

Total: **30 arquivos únicos** com URL conhecida. Os parâmetros `?width=&height=` nas URLs são redimensionamentos do CDN do Framer; o arquivo original completo é obtido **sem** esses parâmetros (a verificar no download).

Assets **sem URL identificada** → ver `docs/missing-assets.md`.

---

## 12. Itens NÃO auditados (Fase 01 pendente)

| Item do checklist original | Status |
|---|---|
| Screenshots em scroll (1440 / 1280 / 768 / 390 / 360) | ❌ não feito (existe só 1 captura da Home em 1920px) |
| Largura máxima do conteúdo, margens, paddings | 🟡 medido só na Home 1920px (14.1) |
| Tamanhos, pesos, letter-spacing, line-height, text-transform | ❌ não medido |
| Famílias tipográficas e arquivos de fonte | ❌ não identificado |
| Paleta de cores, backgrounds | 🟡 medida só na Home 1920px (14.2) |
| Bordas, divisores, arredondamentos | 🟡 medidos só na Home 1920px (14.1) |
| Hover (links, cards, botões) | ❌ não observado |
| Comportamento do header no scroll | ❌ não observado |
| Menu mobile (abertura, animação, itens) | ❌ não observado |
| Animações de entrada/saída, reveal, parallax, marquee (velocidade, easing, delay) | 🟡 tipos inferidos de um frame estático (14.6); velocidade, easing e delay ❌ |
| Animação dos contadores (valores finais do About, duração) | ❌ não observado |
| Layout em cada breakpoint e breakpoints reais do Framer | ❌ não observado |
| Comportamento do formulário (validação, estados, destino) | ❌ não observado |
| Comportamento de "Back to top" | ❌ não observado |
| Transições entre páginas | ❌ não observado |
| URLs das imagens dos cards de projeto e do bloco "próximo projeto" | ❌ não expostas pelo fetch |
| Favicon | ❌ não identificado |

---

## 13. Hipóteses a confirmar (não tratar como fato)

1. As imagens dos cards de projeto são as mesmas imagens principais 1640×1640. Os `alt` coincidem e, na captura, o conteúdo dos cards bate com eles (retrato / bolsa vermelha), mas o `alt` das imagens de Process não descreve o conteúdo (14.5), então essa evidência é fraca.
2. A imagem do bloco "próximo projeto" (alt "stationery mockup") é um arquivo próprio ou a imagem principal do projeto seguinte.
3. O Framer exporta 3 breakpoints (Desktop/Tablet/Phone) e as duplicatas de texto são variantes responsivas.
4. `47+0+` no About é o estado bruto de um contador animado. Na Home, o "10+" aparece com faixas horizontais e os quatro números com deslocamentos verticais diferentes, o que sugere animação de números rolando (roll/odômetro). Hipótese sobre um único frame.


---

## 14. Referência visual — Home em 1920px (captura enviada pelo usuário)

### 14.0 Escopo e confiabilidade
- Arquivo: `screencapture-gridagency-framer-website-2026-11-05-08_31_20.png`, **1920×15279 px**, somente a Home.
- **Medido** = lido por pixel no arquivo original. **Estimado** = lido visualmente em versão reduzida (±15%).
- É uma captura full-page de **um único frame**. As animações de scroll estavam em estados intermediários: há textos borrados ou cortados, linhas e textos apagados, imagens parcialmente reveladas. **Cores/opacidades de elementos apagados não são valores finais.**
- O header aparece sobreposto aos rótulos do hero (`Grid®` sobre `ART DIRECTION`). Pode ser artefato do header fixo na captura full-page ou comportamento real: **não confirmado**.
- O selo "Made in Framer" no canto inferior direito é da hospedagem e não faz parte do design.

### 14.1 Layout e medidas (medido, exceto onde indicado)
| Item | Valor |
|---|---|
| Altura total da página | 15279px |
| Margem lateral / largura do conteúdo | 60px / 1800px (divisores vão de x=60 a x=1859) |
| Fundo da página | `#000000` |
| Hero | y 0→875px, terminando em linha branca de 3px (y 875–877). Provável 100vh da janela de captura (a confirmar) |
| Divisores de seção | 1px, largura total do conteúdo; cor máxima ≈ `#a4a4a4` (valores menores = animação em curso) |
| Work: cards | 2 colunas de **882px**, gap **36px** (x 60–941 e 978–1859) |
| Services: linhas | divisores a cada **227px** (y 5637 / 5864 / 6091); a 1ª linha tem ≈ 36px a mais acima |
| Brands: tiles | grade **3×2**, tiles **584×584px** (1:1), gap **24px**, y 6586–7777 |
| Raio dos cantos | tiles Brands ≈ **26px**; card do CTA ≈ **25px** (provável token único de ~24–26px; cards de projeto e imagens de Process parecem usar valor parecido — não medido) |
| About: imagem | x 60–653 (**594px** de largura) |
| CTA: card | x 60–1859, y 12939–13958 (**1800×1020px**) |
| Espaço CTA → footer | 157px |
| Footer | começa em y 14115, altura **1164px** |

### 14.2 Cores (medido)
| Uso | Valor |
|---|---|
| Fundo geral | `#000000` |
| Texto principal | `#ffffff` |
| Cinza secundário (legendas "(…)", categorias, parágrafos) | `#b3b3b3` (= branco a 70%) |
| Tiles de Brands | `#b3b3b3`; logos em azul-ardósia escuro (tom exato não medido) |
| Footer: fundo | `#ffffff` (**o footer é branco, não preto**) |
| Footer: wordmark | preto |
| Footer: textos secundários | ≈ `#6f6f6f` |
| Hero | gradiente vermelho (≈ `#ce0310` no topo) → preto; wordmark `GRID©` em gradiente ciano → branco, com a textura da imagem visível através das letras (possível blend mode — não confirmado) |

### 14.3 Seções (observado)
- **Header:** `Grid®` à esquerda (x=60); `Work Studio Services Process` agrupados começando ≈ no centro da página (x≈960); `Contact` alinhado à direita (x até 1860). Peso bold, tracking apertado.
- **Hero:** imagem de fundo vermelha com textura de vidro canelado; `GRID©` gigante ocupando quase toda a largura; três rótulos em caixa-alta empilhados no canto superior esquerdo; texto institucional em caixa-alta, bold, em bloco de 4 linhas à direita (início ≈ x 1410).
- **Work:** título + legenda `(Selected Project)` à direita + divisor; grade 2×2; abaixo de cada imagem, nome (bold, grande) à esquerda e categorias (cinza, menor) alinhadas à direita; `View all` + seta `→` alinhado à direita, grande.
- **About:** título + legenda `(Who am I)` + divisor; 3 colunas: foto P&B (594px, cantos arredondados), parágrafo 1 (início ≈ x 714), parágrafo 2 (≈ x 1284); `Read more •` (sublinhado, ponto, cinza) abaixo do parágrafo 1. O heading longo ("A digital design studio…") **não aparece na captura** (provavelmente ainda não revelado pela animação).
- **Service:** 3 linhas com numeral grande à esquerda, título ≈ x 960 (centro) e descrição ≈ x 1410, separadas por divisores de 1px.
- **Brands:** grade 3×2 de tiles cinza `#b3b3b3` com logos placeholder ("LOGO", "IPSUM", "logoipsum").
- **Process:** 4 linhas em 3 colunas: numeral grande (x=60), imagem **recortada em paisagem** (x ≈ 510–1120, ≈ 610px de largura, cantos arredondados), título grande e descrição alinhada à base da imagem (x ≈ 1215). Altura de linha estimada em 550–610px.
- **Reviews:** citação centralizada em tipografia grande, bloco começando ≈ x 520; abaixo, avatar (≈ 263×250px, cantos arredondados) com nome em bold e cargo em cinza ao lado, alinhados à esquerda do bloco da citação.
- **Stats:** 4 colunas, passo ≈ 491px (x ≈ 60 / 552 / 1045 / 1536); número grande, rótulo bold branco, descrição cinza com largura máxima ≈ 320px.
- **CTA:** card arredondado 1800×1020 com imagem desfocada vermelho/laranja (retrato), headline branca centralizada em 2 linhas com apóstrofo reto (`Let's`); botão `Contact` quase invisível no frame (fade-in tardio ou texto de baixo contraste).
- **Footer:** fundo branco. Linha superior: email e telefone grandes em cinza à esquerda; colunas `/Social` e `/Nav` pequenas à direita. Abaixo, wordmark `GRID©` preto gigante ocupando toda a largura, com a base levemente cortada. Linha inferior: `Designed by` + avatar circular + `Akinbinu Akintayo` à esquerda; `Back to top ↑` à direita.

### 14.4 Tipografia (estimado — não confirmado por CSS)
- Grotesca neo-realista em **bold**, com **tracking bem negativo** e line-height apertado (≈ 0.9–1.05) nos títulos. Visualmente próxima de Helvetica Now / Neue Haas Grotesk / Inter Display. **A família não foi identificada**; confirmar com `@font-face`/computed style antes de escolher.
- Hierarquia: títulos de seção, citação, headline do CTA e números de Stats na mesma ordem de grandeza (cap-height ≈ 64px, fonte ≈ 88–96px); numerais de Services e Process maiores; nomes de card ≈ 40px; textos corridos e legendas bold em cinza `#b3b3b3`.
- Legendas entre parênteses (`(Selected Project)`, `(Who am I)`…) alinhadas à direita da linha do título.

### 14.5 Correções às hipóteses e afirmações anteriores
1. **Brands não é marquee no desktop:** é grade estática 3×2.
2. **O footer é branco** (e não preto, como se poderia supor pelo restante da página).
3. **`alt` das imagens de Process não descreve o conteúdo:** "avant garde portrait" (Discovery) mostra a traseira de um carro esportivo escuro; "silhouette on orange" (Strategy) é uma silhueta em tons de azul-marinho; "red hat portrait" (Design) mostra uma flor azul em fundo claro; "serene portrait flowers" (Delivery) mostra uma colher com sobremesa e cereja. Na implementação, não copiar esses `alt`: escrever descrições corretas.
4. **As imagens de Process são exibidas em recorte paisagem**, embora o arquivo seja retrato (1280×1699): `object-fit: cover` num contêiner largo.
5. Os logos de Brands são **placeholders genéricos** ("LOGO", "IPSUM", "logoipsum"), não clientes reais.

### 14.6 Animações inferidas de um único frame (tipo sim; tempo/easing não)
- **Títulos de seção:** revelação por letra da esquerda para a direita, com **blur** nas últimas letras e máscara de corte (visto em Work, About, Service, Brands, Process, Reviews, Stats).
- **Divisores:** surgem com opacidade progressiva (valores observados de 53 a 168).
- **Services:** numerais, títulos e descrições entram com fade; o numeral `3` aparece cortado por máscara.
- **Process:** numerais e títulos parecem subir de dentro de uma máscara (cortados no topo); a linha 1 está acesa e as linhas 2–4 apagadas, o que sugere estado ligado ao scroll.
- **Reviews:** a citação acende **palavra por palavra** (`Working` branco, `with` mais escuro, `him` e `was` quase apagados), provavelmente ligado ao scroll.
- **Stats:** números com deslocamento vertical diferente entre colunas e faixas horizontais em `10+` → possível animação de números rolando, com stagger.
- **Imagens (cards, About):** faixa inferior desalinhada dentro da imagem, compatível com parallax/zoom da imagem dentro de uma máscara arredondada. Hipótese.
- **CTA:** o botão `Contact` está quase invisível no frame (fade-in tardio).
- **Hero:** estático no frame; nenhuma animação observável.

### 14.7 O que a captura NÃO resolve
Família e arquivos de fonte; valores computados (font-size, line-height, letter-spacing); breakpoints; layout em tablet/mobile; menu mobile; comportamento do header; hover; durações/easing/delays; páginas `/project`, `/about`, `/contact` e as 4 páginas de projeto; os valores finais dos contadores do About; a cor final dos elementos que estavam apagados.
