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

Para criar um novo post, adicione um arquivo `.md` em `src/posts/` seguindo o modelo dos posts existentes (front matter com `layout`, `title`, `date` e `permalink`).

## Gestão do blog via Pages CMS

O arquivo `.pages.yml` na raiz do repositório configura o [Pages CMS](https://pagescms.org/), uma interface web para criar e editar posts e notas direto no GitHub, sem precisar mexer em Markdown manualmente.

Para usar:

1. Instale o [GitHub App do Pages CMS](https://github.com/marketplace/pages-cms) na sua conta e autorize o acesso a este repositório.
2. Acesse [app.pagescms.org](https://app.pagescms.org/) e faça login com o GitHub.
3. Abra o projeto `rcapitao.com` — as coleções **Posts** e **Notas** aparecem prontas para edição, com os mesmos campos do front matter (`title`, `date`, `permalink`, `tags`, `meta_description`, `meta_image`) e um editor rich-text para o conteúdo.
4. Imagens enviadas pelo editor são salvas em `src/assets/img/uploads/` e publicadas em `/assets/img/uploads/`.

Cada alteração feita pelo Pages CMS vira um commit neste repositório, então o deploy (`.github/workflows/deploy.yml`) roda normalmente ao salvar.

> Posts/notas que usam uma subpasta própria com imagens locais (ex.: `src/posts/<slug>/index.md`) não aparecem na listagem do Pages CMS — continue editando esses diretamente no repositório.
