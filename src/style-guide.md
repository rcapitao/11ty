---
layout: base.njk
title: Guia de estilo
permalink: /style-guide/
---
# Guia de estilo

Esta página reúne os principais elementos de conteúdo para conferir como cada um fica com o tema atual. Ela não aparece no Blog nem em nenhum menu — acesse direto por `/style-guide/`.

## Título nível 2

### Título nível 3

#### Título nível 4

Um parágrafo normal com **texto em negrito**, *texto em itálico*, `código inline` e um <mark>trecho destacado</mark>. Também temos um [link externo](https://www.11ty.dev/) e um [link interno](/blog/).

## Listas

- Item de lista não ordenada
- Outro item
  - Item aninhado
  - Outro item aninhado
- Último item

1. Primeiro item ordenado
2. Segundo item ordenado
3. Terceiro item ordenado

## Citação

> Esta é uma citação em bloco, usada para destacar uma frase ou trecho de outra fonte.
>
> Pode ter mais de um parágrafo.

## Bloco de código

```js
function ola(nome) {
  return `Olá, ${nome}!`;
}
```

## Divisor curvo

<span class="curve"></span>

## Botões de webring

Existem quatro variantes de estilo para o botão de webring. Todas usam a classe `webring-link` junto com uma segunda classe que define a borda: `webring-pill`, `webring-rounded`, `webring-dashed` ou `webring-ghost`.

<div class="webring">
  <a class="webring-link webring-pill" href="#">← Webring → (pill)</a>
</div>

<div class="webring">
  <a class="webring-link webring-rounded" href="#">← Webring → (rounded)</a>
</div>

<div class="webring">
  <a class="webring-link webring-dashed" href="#">← Webring → (dashed)</a>
</div>

<div class="webring">
  <a class="webring-link webring-ghost" href="#">← Webring → (ghost)</a>
</div>

Para usar em uma página, post ou nota, cole o HTML abaixo direto no arquivo (mesma lógica do divisor curvo): funciona em qualquer arquivo `.md` da pasta `src/posts/` ou em páginas soltas como esta. Escolha **uma** das quatro classes de borda — não é preciso repetir o bloco quatro vezes como acima, isso foi só para comparar os estilos.

```html
<div class="webring">
  <a class="webring-link webring-pill" href="https://exemplo.com">← Webring →</a>
</div>
```

Troque o `href` pelo link real do webring e o texto do link pelo que fizer sentido (ex.: nome do webring, ou "Anterior"/"Próximo" separados em dois links dentro do mesmo `<div class="webring">`).

## Tabela

| Coluna A | Coluna B | Coluna C |
| --- | --- | --- |
| valor 1  | valor 2  | valor 3  |
| valor 4  | valor 5  | valor 6  |

## Imagem

![Favicon do blog](/img/favicon.png)

## Linha horizontal

Acima desta linha:

---

Abaixo desta linha.
