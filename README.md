# Site Dra. Maria Fernanda Vieira Bruno

Site institucional da Dra. Maria Fernanda Vieira Bruno.

## V3 — retrato central e narrativa por scroll

- Capa clara que sobe com a rolagem e revela o retrato central iluminado.
- Um único retrato permanece no centro durante quatro capítulos: visão, experiência, atuação e Legal Ops.
- Textos sobem pelas laterais. Cada capítulo ocupa seu próprio espaço no documento e desaparece ao sair da tela, inclusive ao voltar pelo scroll.
- Card de apresentação com inclinação suave ao ponteiro e iluminação difusa girando atrás.
- Menu com âncoras reais, links diretos, navegação por teclado e menu móvel.
- Conteúdo sobre Legal Ops, Direito Bancário e Recuperação de Créditos.
- Em telas estreitas, baixas ou com preferência por movimento reduzido, o conteúdo segue uma sequência estática e legível.

## Estrutura

- index.html: estrutura semântica, conteúdo e links.
- styles.css: composição, iluminação, responsividade e movimento reduzido.
- script.js: animações de scroll, menu e inclinação do card. Sem dependências de execução.
- assets/: retratos profissionais otimizados em SVG autocontido.
- preview.html: ferramenta de revisão em larguras de celular, tablet e notebook.

O retrato do escritório foi restaurado a partir do WebP completo. O arquivo anterior continha uma mensagem de saída truncada e não era um SVG válido.

## Próxima foto

Os retratos atuais permanecem como material provisório para o novo enquadramento. Para reproduzir a composição branca da referência, usar uma foto vertical, centralizada, da cabeça até abaixo da cintura, com blazer branco, cabelo preso e fundo branco uniforme. Preservar margens ao redor do corpo e da cabeça. Fumaça e iluminação são produzidas pelo CSS, sem incorporá-las à foto. Substituir o retrato central em `.main-portrait` e o retrato do card em `.card-image`, atualizando o texto alternativo quando necessário.

## Verificação

- JavaScript verificado com `node --check script.js`.
- Âncoras e caminhos locais conferidos; os três SVGs e os seus dados WebP foram decodificados e validados.
- Revisão no GitHub Pages: capa, scroll para frente e para trás, menu, card e foto do escritório.
- Revisão responsiva em 390 × 844, 320 × 740 e 1280 × 720; menu móvel e ausência de rolagem horizontal conferidos.

Atuação em todo o Brasil. WhatsApp temporário: (11) 9999-9999.

Abra `index.html` em um navegador ou sirva a pasta com `python -m http.server 4173`. A publicação usa o workflow existente `.github/workflows/pages-v3.yml`.

> Pré-produção: branch v3-referencia-interativa.
> Publicação: GitHub Pages.
