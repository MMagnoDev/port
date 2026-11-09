# GRID — Progresso

Última atualização: 05/11/2026 (após receber a captura da Home em 1920px)

| Fase | Status | Resumo |
|---|---|---|
| 01 — Auditoria | 🟡 **Parcial** | Conteúdo, rotas, links e textos das 8 páginas: feito. Referência visual **só da Home em 1920px** (captura do usuário): medidas, cores e tipos de animação registrados. Fontes, estilos computados, breakpoints, hover, header, menu mobile e demais páginas: **não feito**. |
| 02 — Extração de assets | 🔴 **Bloqueada** | 30 URLs identificadas; **0 arquivos baixados** (sem rede no sandbox). URLs de imagens de cards, fontes e favicon não identificadas. |
| 03 — Design system | ⚪ Não iniciada | Depende de CSS/estilos computados da Fase 01. |
| 04 — Tecnologias / setup | ⚪ Não iniciada | |
| 05 — Componentes globais | ⚪ Não iniciada | |
| 06 — Home | ⚪ Não iniciada | |
| 07 — Páginas internas | ⚪ Não iniciada | |
| 08 — Animações | ⚪ Não iniciada | Depende da observação de animações. |
| 09 — Responsividade | ⚪ Não iniciada | |
| 10 — Comparação visual | ⚪ Não iniciada | |
| 11 — Testes funcionais | ⚪ Não iniciada | |

## Fase 01 — detalhe

**Concluído**
- Mapa de rotas (8 URLs reais; slugs `lumo-wellness` e `viron` divergem dos nomes).
- Texto completo de todas as seções.
- Links de navegação, rodapé e redes sociais.
- Hipótese estrutural sobre duplicatas (variantes responsivas do Framer + clones de marquee).
- Inconsistências do template documentadas.

**Concluído com a captura (somente Home, 1920px)**
- Margens, largura útil (1800px), gaps, tamanhos de cards/tiles, raios (~25px), alturas de hero/CTA/footer (medido por pixel).
- Paleta da Home (`#000`, `#fff`, `#b3b3b3`, footer branco, cinza `#6f6f6f`).
- Estrutura visual de cada seção e tipos de animação inferidos (14.6).
- Correções: Brands é grade 3×2 (não marquee); footer é branco; `alt` das imagens de Process não descreve o conteúdo.

**Pendente**
- Screenshots de `/project`, `/about`, `/contact` e das 4 páginas de projeto
- Screenshots em 1440 / 1280 / 768 / 390 / 360
- Família tipográfica e valores computados de fonte
- Breakpoints reais e reorganização do layout
- Hover, header no scroll, menu mobile
- Duração, easing e delay das animações
- Comportamento do formulário
- Valores finais dos contadores do About

## Arquivos criados

- `docs/site-audit.md`
- `docs/missing-assets.md`
- `docs/progress.md`

## Critérios de aceitação (seção 14 do briefing)

Nenhum critério foi atendido ainda.
