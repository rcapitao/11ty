# rcapitao.com

Blog construído com [Eleventy](https://www.11ty.dev/).

## Como usar

```bash
npm install
npm start    # inicia o servidor local em http://localhost:8080
npm run build # gera o site estático em _site/
```

## Estrutura

- `src/posts/` — arquivos Markdown com os posts e notas do blog
- `src/pages/` — páginas estáticas que não são posts nem notas (home, sobre, busca, blog, notas, tags, feeds, etc.)
- `src/_layouts/` — layouts (base.njk, post.njk, nota.njk)
- `src/_includes/` — partials reutilizáveis (ex.: pagination-nav.njk)
- `src/_data/` — dados globais (metadata.json, eleventyComputed.js)
- `src/assets/` — CSS e imagens (`assets/css/`, `assets/img/`)
- `src/plugins/` — filtros, coleções e shortcodes do Eleventy
- `eleventy.config.js` — configuração do Eleventy

Para criar um novo post, adicione um arquivo `.md` em `src/posts/` seguindo o modelo dos posts existentes (front matter com `layout`, `title`, `date` e `permalink`). Não há interface de administração/CMS neste projeto — a edição é sempre direta nos arquivos Markdown, e cada alteração vira um commit normal neste repositório, disparando o deploy (`.github/workflows/deploy.yml`).

Posts e notas ficam em pastas separadas (`src/posts/` e `src/notas/`), mas publicam na mesma URL `/blog/<slug>/` — a distinção entre os dois é feita pelas tags `posts`/`notas` (cada arquivo já sai com a tag certa) e aparece como um selo "Post"/"Nota" ao lado do título nas listagens.

O histórico de mudanças no site (novidades, ajustes de design, correções) fica documentado na página pública [`/changelog/`](https://rcapitao.com/changelog/) (`src/pages/changelog.md`).

### Data de publicação e "atualizado em"

O campo `date` de posts e notas leva dia **e horário** (ex.: `2026-07-14T21:00:00.000-03:00`). É a data/hora de publicação e não deve ser alterada depois — editar o post não mexe nela. O horário é sempre tratado como horário de Brasília (`America/Sao_Paulo`), independente do fuso do servidor que gera o site.

O "atualizado em" **não é um campo do front matter**: é calculado automaticamente (`src/plugins/publishTime.js`), comparando o conteúdo do post em cada commit do Git, e só aparece quando o corpo do texto realmente mudou desde a publicação (edições de metadado, como corrigir uma tag, não contam). Hoje essa informação é só para gestão interna — não aparece na página pública.

Não existe agendamento: um post/nota com `date` no futuro publica imediatamente. Use o campo `draft: true` para impedir a publicação enquanto o conteúdo não estiver pronto.
