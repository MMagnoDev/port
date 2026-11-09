# Kit de auditoria do GRID (Playwright)

Fecha as lacunas das Fases 01 e 02: mede estilos, fontes, breakpoints, hover, header, menu mobile, formulário e animações do site original, e baixa os assets com verificação.

> **Status de validação.** O kit foi testado de ponta a ponta contra uma página local (`selftest/`), onde reproduziu valores conhecidos (durações de 800ms/400ms e curva `cubic-bezier(.44,0,.56,1)` medidas corretamente; variantes responsivas e header que esconde ao rolar detectados; POSTs do formulário interceptados). **Ele ainda não rodou contra `gridagency.framer.website`**, porque o ambiente onde foi escrito não tem acesso à internet. Se algum seletor não casar com o DOM real do Framer, o script registra o erro em `output/errors.json` e segue em frente.

## Requisitos

- Node.js ≥ 20
- Internet (para abrir o site e baixar os assets)

## Passo a passo

```bash
cd tools/audit
npm install
npx playwright install chromium

npm run selftest        # opcional: confirma que o kit funciona na sua máquina (sem internet)
npm run capture:quick   # teste rápido no site real: só Home em 1440px (~1 min)
npm run capture         # execução completa (veja o tempo abaixo)
npm run summarize       # gera output/SUMMARY.md e output/summary.json
npm run assets          # baixa os 31 assets do manifesto + fontes/SVGs descobertos
```

Tempo estimado da captura completa: 8 rotas × 6 larguras + probes ≈ **20–30 minutos**. Para reduzir: `node capture.mjs --viewports 1440,768,390` ou `--pages /,/about`.

## Opções do `capture.mjs`

| Opção | Efeito |
|---|---|
| `--quick` | Só Home em 1440px + probe do header |
| `--pages /,/about` | Só essas rotas (sem crawl) |
| `--viewports 1440,390` | Só essas larguras (padrão: 1920, 1440, 1280, 768, 390, 360) |
| `--skip hover,form` | Pula probes: `header`, `menu`, `hover`, `form`, `backtotop`, `transitions` |
| `--scroll-wait 2000` | Espera por parada de scroll em ms (padrão 1100). **Aumente se houver reveals mais longos que ~1s**, senão o estilo é gravado com a animação ainda em andamento |
| `--video` | Grava vídeo de cada captura |
| `--headed` | Navegador visível |
| `--no-fullpage` | Não tira o screenshot full-page (o Chromium limita a ~16.384px de altura; as capturas por scroll cobrem a página inteira) |
| `--base`, `--out` | Alvo e pasta de saída customizados |

## O que a captura produz (`output/`)

```
SUMMARY.md / summary.json        resumo compacto  ← o que me enviar
routes.json                      rotas descobertas por crawl (links reais)
meta.json                        data, versão do navegador, viewports
errors.json                      probes que falharam
framer-assets.json               URLs do CDN do Framer vistas na rede
fonts/                           arquivos de fonte baixados pelo navegador
svg/  svg-inline/                SVGs de rede e SVGs inline (ícones, wordmark)
<pagina>/<largura>/
   full.png                      screenshot da página inteira
   scroll-00.png …               screenshots a cada 80% da altura da viewport
   viewport-initial.png          estado após o carregamento
   source.html                   HTML original (SSR) com todas as variantes
   extract.json                  estilos computados + inventário (textos, imagens, SVGs, links, variantes)
   anim.json                     amostras de opacity/transform/filter por frame + Web Animations API
   network.json                  requisições, erros de console, falhas
_probes/
   header-<w>/   menu-<w>/   hover-<pagina>-<w>/   form-<w>/   backtotop-<w>/   transitions-<w>/
```

## O que me enviar para fechar as Fases 01 e 02

1. `output/SUMMARY.md` e `output/summary.json` (são pequenos).
2. `output/fonts/` (os arquivos de fonte).
3. Os screenshots `output/<pagina>/<largura>/full.png` de pelo menos **1440, 768 e 390** para cada página, e `output/_probes/*` (menu aberto, estados do formulário, hover).
4. `docs/assets-report.md` (ou o trecho "Falhas" que o downloader imprime).

Com isso eu consigo: identificar a família tipográfica, fixar os tokens (tamanhos, line-height, tracking, espaçamentos por breakpoint), saber qual variante aparece em cada largura, reproduzir easing/duração, e só então começar o Design System e o código.

## Segurança do formulário

O probe do formulário **nunca envia nada de verdade**. Todo `POST/PUT/PATCH` é interceptado no navegador e respondido localmente (200 para simular sucesso, 500 para simular erro), com cabeçalhos CORS simulados. Os dados de teste (`audit@example.com`, etc.) não saem da sua máquina. O endpoint e o formato do corpo ficam registrados em `form.json` para a integração futura.

## Limitações conhecidas

- **Resolução de animação ≈ 16ms** (1 frame). Curvas muito próximas (ex.: `.44,0,.56,1` vs ease-in-out `.42,0,.58,1`) não se distinguem por amostragem; a diferença visual é desprezível.
- O amostrador de animação roda a cada frame e pode atrasar levemente páginas muito pesadas. Valores de duração são aproximados.
- Animações **ligadas ao scroll** (ex.: palavra a palavra na citação) aparecem como rajadas de mudança de opacidade; a relação exata com a posição de scroll precisa ser inferida dos vídeos (`--video`) e dos screenshots por parada.
- O probe do header procura o logo (`<a>` com texto `Grid®`). Se o logo não for um link, o header não é marcado e o relatório mostra "n/d".
- Dimensões dos assets vêm dos parâmetros das URLs do site. O downloader compara com o arquivo real e avisa se divergirem.

## Assets: direitos de uso

Textos, fotografias e a identidade visual pertencem ao autor do template (crédito no rodapé do site). Confirme a licença antes de reutilizar os arquivos baixados num site seu.

## Downloader (`download-assets.mjs`)

Para cada item do `asset-manifest.json`: baixa o original (sem parâmetros de redimensionamento), rejeita respostas que não sejam imagem (ex.: HTML de erro), grava, **relê do disco**, confere os bytes, detecta o formato real e compara as dimensões. Tudo é registrado em `docs/assets-report.json` e `.md`. Falhas saem com código 1 e uma lista pronta para copiar em `docs/missing-assets.md`.
