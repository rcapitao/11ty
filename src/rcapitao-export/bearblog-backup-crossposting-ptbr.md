---
title: Bearblog Backup e Crossposting (pt-BR)
slug: bearblog-backup-crossposting-ptbr
published_date: 2026-06-23T21:58:00+00:00
tags: inteligencia-artificial, produtividade
publish: true
make_discoverable: true
is_page: false
meta_description: Como usei o Claude para criar automações de backup e distribuição de conteúdo do meu blog, mesmo sem nunca ter programado antes.
meta_image: https://bear-images.sfo2.cdn.digitaloceanspaces.com/rcapitao/bearblog-backup-e-crossposting-pt-br.webp
---

Sempre fui apaixonado por tecnologia e produtividade. Acompanho novidades, testo metodologias, gosto de entender como as coisas funcionam por trás. Mas programação nunca foi meu terreno.  

Até pouco tempo atrás, eu diria sem hesitar que automação e linguagem de programação eram coisas para outras pessoas, não para um advogado como eu. Resolvi testar isso usando o Claude e o resultado me surpreendeu, consegui criar dois scripts funcionais, sem nunca ter escrito uma linha de código antes.  

1. [Bearblog Backup](tab:https://github.com/rcapitao/bearblog-backup)  
2. [Bearblog Crossposting](tab:https://github.com/rcapitao/bearblog-crossposting)  

O primeiro faz o backup diário dos posts do meu blog hospedado no [Bearblog](tab:https://bearblog.dev), lendo o feed Atom, salvando tudo em markdown e baixando as imagens automaticamente. O segundo cuida do crossposting, ou seja, sempre que publico algo novo, ele distribui o conteúdo para as minhas redes sociais [Mastodon](tab:https://mastodon.social/@rcapitao) e [Bluesky](tab:https://bsky.app/profile/rcapitao.com), lendo o feed RSS do meu blog.  

Os dois scripts estão rodando, hospedados no Github, e já fazem parte da minha rotina. Vou ajustando e acrescentando configurações conforme a necessidade aparece.  

O que mais me marcou nesse processo não foi a automação em si, mas a sensação de autonomia. A IA não substituiu meu raciocínio, ela ampliou o que eu já conseguia fazer. E isso muda a forma como encaro qualquer ferramenta nova, inclusive no meu trabalho com privacidade e dados.  

Documentei tudo, desde a execução até como adaptar para outros blogs no [Bearblog](tab:https://bearblog.dev), caso alguém queira aproveitar.  

Como essa automação interessa para todos os usuários dessa plataforma, fiz também um post em [inglês](/bearblog-backup-and-crossposting-en/) para ter um alcance maior.  

<div class="reply-email">  
<a href="https://letterbird.co/rcapitao?subject=Re:%20{{ post_title }}" target="_blank">Comente por e-mail</a>  
</div>  

<meta name="fediverse:creator" content="@rcapitao@mastodon.social">