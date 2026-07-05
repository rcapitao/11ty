---
layout: base.njk
title: Guia de estilo
date: 2026-07-05
permalink: /style-guide/
meta_description: "Guia de estilo com os elementos de conteúdo do blog e como usá-los em posts, notas e páginas."
meta_image: ""
---
# Guia de estilo

Esta página reúne os principais elementos de conteúdo para conferir como cada um fica com o tema atual, e explica como usar cada um deles em uma página, post ou nota. Ela não aparece no Blog nem em nenhum menu — acesse direto por `/style-guide/`.

## Título nível 2

### Título nível 3

#### Título nível 4

Títulos são criados com `#` no início da linha: um `#` para nível 1 (reservado ao título da página), `##` para nível 2, `###` para nível 3 e `####` para nível 4. Cole isso em qualquer post, nota ou página:

```md
## Título nível 2

### Título nível 3

#### Título nível 4
```

Um parágrafo normal com **texto em negrito**, *texto em itálico*, `código inline` e um <mark>trecho destacado</mark>. Também temos um [link externo](https://www.11ty.dev/) e um [link interno](/blog/).

Cada um desses estilos usa uma sintaxe própria do Markdown (o `<mark>` é a única exceção — é uma tag HTML colada direto no texto):

```md
**texto em negrito**, *texto em itálico*, `código inline` e um <mark>trecho destacado</mark>.

[link externo](https://www.11ty.dev/) e um [link interno](/blog/).
```

## Listas

- Item de lista não ordenada
- Outro item
  - Item aninhado
  - Outro item aninhado
- Último item

1. Primeiro item ordenado
2. Segundo item ordenado
3. Terceiro item ordenado

Listas não ordenadas usam `-` e listas ordenadas usam `1.`, `2.`, etc. Itens aninhados são indentados com dois espaços:

```md
- Item de lista não ordenada
- Outro item
  - Item aninhado
  - Outro item aninhado
- Último item

1. Primeiro item ordenado
2. Segundo item ordenado
3. Terceiro item ordenado
```

## Citação

> Esta é uma citação em bloco, usada para destacar uma frase ou trecho de outra fonte.
>
> Pode ter mais de um parágrafo.

Cada linha da citação começa com `>`. Para separar parágrafos dentro da mesma citação, use uma linha só com `>`:

```md
> Esta é uma citação em bloco, usada para destacar uma frase ou trecho de outra fonte.
>
> Pode ter mais de um parágrafo.
```

## Bloco de código

```js
function ola(nome) {
  return `Olá, ${nome}!`;
}
```

Blocos de código usam três crases (\`\`\`) antes e depois do código, com o nome da linguagem logo após as crases de abertura (opcional, mas ativa o destaque de sintaxe). O botão de copiar no canto do bloco é automático — é injetado por JavaScript em qualquer `pre` da página, não precisa incluir nada além do código:

````md
```js
function ola(nome) {
  return `Olá, ${nome}!`;
}
```
````

## Divisor curvo

<span class="curve"></span>

É uma tag HTML colada direto no arquivo, sem nenhum texto dentro:

```html
<span class="curve"></span>
```

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

## Cards

Cartão simples com título (com ícone opcional) e um parágrafo de descrição, usado por exemplo na página [Diretório](/diretorio/).

<div class="card">
  <h4><i class="fa-solid fa-circle-info"></i> <a href="/sobre/">Título do card</a></h4>
  <p>Um parágrafo curto descrevendo do que se trata este link ou seção.</p>
</div>

Cole o HTML abaixo em qualquer página, post ou nota, trocando o link, o ícone e o texto:

```html
<div class="card">
  <h4><i class="fa-solid fa-circle-info"></i> <a href="/sobre/">Título do card</a></h4>
  <p>Um parágrafo curto descrevendo do que se trata este link ou seção.</p>
</div>
```

O ícone (`<i class="fa-solid ...">`) é opcional — pode remover se não quiser usar Font Awesome.

## Tabela

| Coluna A | Coluna B | Coluna C |
| --- | --- | --- |
| valor 1  | valor 2  | valor 3  |
| valor 4  | valor 5  | valor 6  |

A primeira linha define o cabeçalho, a segunda linha (só com `---`) separa o cabeçalho do corpo, e as demais linhas são os dados. As barras verticais `|` não precisam estar alinhadas para funcionar:

```md
| Coluna A | Coluna B | Coluna C |
| --- | --- | --- |
| valor 1  | valor 2  | valor 3  |
| valor 4  | valor 5  | valor 6  |
```

## Imagem

![Guia de estilo](/assets/img/style-guide.png)

Sintaxe padrão de imagem do Markdown: `!` seguido do texto alternativo entre colchetes e do caminho do arquivo entre parênteses. Por padrão a imagem ocupa a largura total do texto. Para imagens de um post específico (como as importadas com bundle), use o caminho relativo ao arquivo, ex. `image.webp`:

```md
![Guia de estilo](/assets/img/style-guide.png)
```

### Diminuir o tamanho da imagem

Para exibir a imagem menor que a largura total, troque o Markdown pela tag HTML `<img>` e adicione a classe `img-small` ou `img-medium`:

<img src="/assets/img/style-guide.png" alt="Guia de estilo (pequena)" class="img-small">

<img src="/assets/img/style-guide.png" alt="Guia de estilo (média)" class="img-medium">

```html
<img src="/assets/img/style-guide.png" alt="Guia de estilo (pequena)" class="img-small">

<img src="/assets/img/style-guide.png" alt="Guia de estilo (média)" class="img-medium">
```

## Foto estilo Polaroid

Pensado para a foto da página Sobre: envolve a imagem numa moldura branca levemente rotacionada, com uma legenda em itálico embaixo, imitando uma foto polaroid.

<div class="polaroid">
  <img src="/assets/img/style-guide.png" alt="Guia de estilo" class="img-medium">
  <em>Legenda da foto</em>
</div>

Use um `<div class="polaroid">` envolvendo a `<img>` (pode combinar com `img-small` ou `img-medium` para controlar o tamanho) e um `<em>` com a legenda:

```html
<div class="polaroid">
  <img src="/assets/img/foto.jpg" alt="Descrição da foto" class="img-medium">
  <em>Legenda da foto</em>
</div>
```

## Linha horizontal

Acima desta linha:

---

Abaixo desta linha.

Uma linha com só três hífens (`---`) numa linha própria, com uma linha em branco antes e depois:

```md
Acima desta linha:

---

Abaixo desta linha.
```
