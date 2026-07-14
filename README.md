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

Para criar um novo post, adicione um arquivo `.md` em `src/posts/` seguindo o modelo dos posts existentes (front matter com `layout`, `title`, `date` e `permalink`). Também é possível editar pelo [Sveltia CMS](#gestão-do-blog-via-sveltia-cms), direto pelo navegador.

Posts e notas ficam em pastas separadas (`src/posts/` e `src/notas/`), mas publicam na mesma URL `/blog/<slug>/` — a distinção entre os dois é feita pelas tags `posts`/`notas` (cada arquivo já sai com a tag certa) e aparece como um selo "Post"/"Nota" ao lado do título nas listagens.

O histórico de mudanças no site (novidades, ajustes de design, correções) fica documentado na página pública [`/changelog/`](https://rcapitao.com/changelog/) (`src/pages/changelog.md`).

## Gestão do blog via Sveltia CMS

O arquivo `src/admin/config.yml` configura o [Sveltia CMS](https://sveltiacms.app/en/), um sucessor moderno e leve do Decap/Netlify CMS — interface web para criar e editar posts, notas e páginas direto no GitHub, sem precisar mexer em Markdown manualmente. O admin fica publicado em `/admin/` (`src/admin/index.html` + `src/admin/config.yml`, copiados como passthrough pelo Eleventy).

As coleções **Posts**, **Notas** e **Páginas** aparecem prontas para edição, com os mesmos campos do front matter (`title`, `date`, `draft`, `permalink`, `tags`, `meta_description`, `meta_image`). Posts e notas continuam com formulários separados (facilita publicar cada tipo), mesmo saindo na mesma URL `/blog/`. Imagens enviadas pelo editor são salvas em `src/assets/img/uploads/` e publicadas em `/assets/img/uploads/`.

Cada alteração feita pelo Sveltia CMS vira um commit neste repositório, então o deploy (`.github/workflows/deploy.yml`) roda normalmente ao salvar.

> Posts/notas que usam uma subpasta própria com imagens locais (ex.: `src/posts/<slug>/index.md`) não aparecem na listagem do Sveltia CMS — continue editando esses diretamente no repositório.

> O campo **Tags** usa uma lista fixa de opções. Para adicionar uma tag nova, inclua ela também na lista `options` do campo `tags` em `src/admin/config.yml` (existe em duplicidade, para a coleção `posts` e para `notas`).

### Autenticação (importante: este site roda no GitHub Pages, não na Netlify)

O backend `github` do Sveltia CMS exige um provedor OAuth para autenticar o login com GitHub. Como este projeto é publicado pelo GitHub Actions/GitHub Pages (não Netlify), é preciso apontar `base_url` (`src/admin/config.yml`) para um provedor OAuth externo antes do admin funcionar — o valor de exemplo (`https://SUBSTITUA-PELO-SEU-WORKER-CLOUDFLARE`) precisa ser trocado.

A opção recomendada é o [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth), um Cloudflare Worker feito pelo mesmo autor do Sveltia CMS especificamente para esse fim:

1. Crie um [GitHub OAuth App](https://github.com/settings/applications/new) com **Authorization callback URL** = `<URL do worker>/callback` (pode ajustar depois de fazer o deploy).
2. Faça o deploy do worker (botão "Deploy to Cloudflare Workers" no README do repositório, ou `wrangler deploy`).
3. No Cloudflare, configure as variáveis do worker: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (secret) e `ALLOWED_DOMAINS` (ex.: `rcapitao.github.io,localhost:8080`).
4. Atualize o **Authorization callback URL** do OAuth App com a URL real do worker.
5. Troque `base_url` em `src/admin/config.yml` pela URL do worker.

### Data de publicação e "atualizado em"

O campo `date` de posts e notas tem um seletor de dia **e horário** (widget `datetime`). É a data/hora de publicação e não deve ser alterada depois — editar o post não mexe nela. O horário é sempre tratado como horário de Brasília (`America/Sao_Paulo`), independente do fuso do servidor que gera o site.

O "atualizado em" **não é um campo do CMS**: é calculado automaticamente (`src/plugins/publishTime.js`), comparando o conteúdo do post em cada commit do Git, e só aparece quando o corpo do texto realmente mudou desde a publicação (edições de metadado, como corrigir uma tag, não contam). Hoje essa informação é só para gestão interna — não aparece na página pública.

Não existe agendamento: um post/nota com `date` no futuro publica imediatamente. Use o campo `draft` para impedir a publicação enquanto o conteúdo não estiver pronto.
