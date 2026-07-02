# 11ty

Blog construído com [Eleventy](https://www.11ty.dev/).

## Como usar

```bash
npm install
npm start    # inicia o servidor local em http://localhost:8080
npm run build # gera o site estático em _site/
```

## Estrutura

- `src/posts/` — arquivos Markdown com os posts do blog
- `src/_includes/` — layouts (base.njk, post.njk)
- `src/_data/metadata.json` — informações do site (título, descrição, autor)
- `src/css/` — estilos
- `eleventy.config.js` — configuração do Eleventy

Para criar um novo post, adicione um arquivo `.md` em `src/posts/` seguindo o modelo dos posts existentes (front matter com `layout`, `title`, `date` e `permalink`).
