# GRID — Assets ausentes ou não verificados

Atualizado em: 05/11/2026 (Fase 01/02 — parcial)

## A. Nenhum arquivo foi baixado

Os 30 arquivos com URL identificada (ver `docs/site-audit.md`, seção 11) **ainda não foram baixados nem validados**. O sandbox de execução está sem acesso à rede. Portanto nenhum deles pode ser contado como "extraído".

Verificação pendente para cada arquivo: download concluído, arquivo abre localmente, dimensões e formato conferem com a URL.

## B. Assets sem URL identificada

| Elemento | Onde aparece | Motivo | Hipótese |
|---|---|---|---|
| Imagens dos 4 cards de projeto | Home › Work, `/project` | O HTML textual trouxe só o `alt` | Provavelmente as imagens principais 1640×1640 de cada projeto. A captura mostra: Nova Grid = retrato com brinco; Lumo Well = bolsa vermelha com monograma; Viron Labs = figura em roxo com jaqueta azul; Kora & Co = retrato em tons escuros. Conteúdo compatível, mas o vínculo com os arquivos continua não confirmado |
| Imagem do bloco "próximo projeto" (alt "stationery mockup") | Final de cada página de projeto | URL não exposta | Pode ser um arquivo próprio ou a imagem principal do projeto seguinte |
| Fontes (`@font-face`, arquivos WOFF/WOFF2) | Todo o site | Fetch não expõe CSS | Fontes provavelmente hospedadas em `framerusercontent.com` (não confirmado) |
| Favicon | Todo o site | Não aparece nos metadados lidos | — |
| Ícones / SVGs (setas, botões, menu) | Possivelmente botões e menu | Fetch não expõe SVG inline nem CSS | Não se sabe se existem; nenhum foi visto no texto |
| Elementos gráficos do hero além da imagem principal | Home › Hero | Só foi visto o texto e 1 imagem | — |
| Backgrounds por CSS (`background-image`) | Desconhecido | CSS não acessível | — |
| Vídeos / Lottie / canvas | Desconhecido | Não verificável | — |

## C. Como resolver

Requer ou (1) rede habilitada no sandbox para baixar as URLs da seção A e do `site-audit.md`, ou (2) execução local de um script Playwright que registre requisições de rede e estilos computados, e salve o resultado para análise.

## D. Observações vindas da captura da Home (1920px)

- Os 6 logos de Brands são **placeholders genéricos** ("LOGO", "IPSUM", "logoipsum"); os 5 arquivos únicos continuam sem download.
- O hero parece usar **uma única imagem de fundo** (vermelho com textura de vidro) com o wordmark `GRID©` por cima. O wordmark parece ser **texto/forma**, não imagem, mas isso não foi confirmado (pode ser SVG ou texto em fonte).
- O `alt` das imagens de Process não descreve o conteúdo. Ao implementar, usar descrições próprias e corretas.
- As fotografias de projeto parecem fotografia de moda/publicidade profissional. Uma delas mostra uma bolsa com padrão de monograma que lembra uma grife conhecida. Isso reforça a necessidade de **confirmar a licença** antes de reutilizar os arquivos.
