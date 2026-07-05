module.exports = {
  eleventyNavigation: (data) => {
    // Top-level nav pages (Início, Blog, Notas, Busca, Sobre) set a static
    // `navigationConfig` in their own front matter. Paginated templates only
    // register the entry once, on their first page.
    if (data.navigationConfig) {
      if (data.pagination && data.pagination.pageNumber > 0) return undefined;
      return data.navigationConfig;
    }

    // Every post/nota gets a breadcrumb entry automatically, with no
    // per-file front matter needed: any file under src/posts/ has a `tags`
    // array, and the "notas" tag tells posts and notas apart.
    if (Array.isArray(data.tags)) {
      const isNota = data.tags.includes("notas");
      return { key: data.title, parent: isNota ? "Notas" : "Blog" };
    }

    return undefined;
  },
};
