#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const TYPES = {
  post: {
    layout: "post.njk",
    dir: "src/posts",
    urlPrefix: "/blog/",
    defaultTags: ["posts"],
  },
  nota: {
    layout: "nota.njk",
    dir: "src/notas",
    urlPrefix: "/blog/",
    defaultTags: ["notas"],
  },
};

function slugify(title) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function readExistingTags() {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/_data/tagDescriptions.json"), "utf8"));
    return Object.keys(data).sort();
  } catch (error) {
    return [];
  }
}

function main() {
  const [, , type, ...titleParts] = process.argv;
  const config = TYPES[type];
  const title = titleParts.join(" ").trim();

  if (!config || !title) {
    console.error("Uso: npm run new-post -- \"Título do post\"  (ou npm run new-nota -- \"Título da nota\")");
    process.exit(1);
  }

  const slug = slugify(title);
  if (!slug) {
    console.error("Não consegui gerar um slug a partir desse título.");
    process.exit(1);
  }

  const filePath = path.join(process.cwd(), config.dir, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    console.error(`Já existe um arquivo em ${path.relative(process.cwd(), filePath)}.`);
    process.exit(1);
  }

  const tagsBlock = config.defaultTags.length
    ? config.defaultTags.map((tag) => `  - ${tag}`).join("\n")
    : "  - ";

  const frontMatter = `---
layout: ${config.layout}
title: "${title}"
date: ${todayIso()}
permalink: ${config.urlPrefix}${slug}/
tags:
${tagsBlock}
meta_description: ""
meta_image: ""
---
`;

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, frontMatter);

  console.log(`Criado: ${path.relative(process.cwd(), filePath)}`);
  console.log(`URL: ${config.urlPrefix}${slug}/`);

  const existingTags = readExistingTags();
  if (existingTags.length) {
    console.log(`Tags existentes: ${existingTags.join(", ")}`);
  }
  console.log('Preencha "tags" e "meta_description", escreva o conteúdo abaixo do front matter e rode "npm start" para pré-visualizar.');
}

main();
