---
layout: base.njk
title: Changelog
date: 2026-07-14
permalink: /changelog/
meta_description: "Registro das mudanças feitas neste blog: novidades, ajustes de design e correções, em ordem cronológica."
meta_image: ""
---
# Changelog

Um registro das mudanças feitas neste blog — novidades, ajustes de design, correções de bugs — desde que saí do [Bearblog](https://bearblog.dev) e passei a manter minha própria versão. Atualizado conforme o site evolui.

### 14 de julho de 2026

- Removido o [Pages CMS](https://pagescms.org/) como interface de edição do blog — voltei a editar os posts, notas e páginas direto nos arquivos Markdown do repositório.

### 12 de julho de 2026

- Removido o agendamento de publicações: um post/nota com data futura passa a publicar imediatamente, sem ficar escondido até a data chegar.
- Corrigido um bug de fuso horário que fazia posts agendados publicarem horas antes do horário definido.

### 11 de julho de 2026

- Separadas de vez a "data de publicação" (fixa, definida uma única vez) e o "atualizado em" (calculado automaticamente a partir do histórico do blog, sem precisar preencher nada).
- Importadas as datas e horários reais de publicação de todos os posts e notas, resgatados do blog original.
- O "atualizado em" deixou de aparecer na página pública — passa a ser só informação interna de gestão.
- Padronizado o espaçamento entre título, data e tags para ficar igual em posts e notas.
- Corrigido um pequeno deslocamento horizontal da página ao navegar entre uma publicação e outra.

### 10 de julho de 2026

- Configurado o [Pages CMS](https://pagescms.org/) como interface de edição do blog, direto pelo navegador.
- Unificados Blog e Notas numa única seção (`/blog/`), diferenciados por um selo "Post"/"Nota".
- URL de publicações passou a ser opcional, gerada automaticamente a partir do título.
- Imagens de posts e notas centralizadas em uma única pasta, nomeadas pelo slug da publicação.
- Adicionado o link do Diretório no rodapé; a home passou a mostrar as 10 publicações mais recentes.
- Restaurados os cards do Diretório e simplificado o "Comente por e-mail" para um link com ícone.
- Corrigido o gráfico de barras da página de Estatísticas estourando no celular.

### 8 de julho de 2026

- Adicionada a página de [Estatísticas](/estatisticas/) do blog.
- Horário de publicação e tags passaram a aparecer ao lado da data em posts e notas.
- Homepage reconstruída, com widget de status do Mastodon.
- Adicionada a página de [Certificações](/certificacoes/).
- Rodapé reorganizado com ícones (RSS, Estatísticas).

### 7 de julho de 2026

- Menu reorganizado: ícone de busca adicionado, botão de tema movido para perto do título.

### 5 de julho de 2026

- Adicionado o "Comente por e-mail" a todos os posts e notas.
- Estrutura de pastas do projeto reorganizada; posts e notas separados em pastas próprias.
- Nome do site alterado para Rafael Capitão.
- Importadas as páginas Agora, Contato, Diretório, Redes sociais e Uses.

### 4 de julho de 2026

- Paginação de 25 itens por página no Blog e nas Notas.
- Ajustes de rodapé de paginação, cabeçalhos de arquivo e filtros de busca por ano e tag.

### Antes de julho de 2026

- Até então eu publicava no [Bearblog](https://bearblog.dev). Saí de lá para construir este blog do zero, com [Eleventy](https://www.11ty.dev/), trazendo todo o conteúdo publicado anteriormente — incluindo as datas reais de cada post e nota.
