module.exports = {
  eleventyNavigation: (data) => {
    // Top-level nav pages (Blog, Notas, Busca, Sobre) set a static
    // `navigationConfig` in their own front matter. Paginated templates only
    // register the entry once, on their first page.
    if (data.navigationConfig) {
      if (data.pagination && data.pagination.pageNumber > 0) return undefined;
      return data.navigationConfig;
    }

    // Every post/nota gets a breadcrumb entry automatically, with no
    // per-file front matter needed: which folder the file lives in (src/posts/
    // vs src/notas/) tells them apart.
    const inputPath = data.page && data.page.inputPath;
    if (typeof inputPath === "string") {
      if (inputPath.includes("/src/notas/")) {
        return { key: data.title, parent: "Notas" };
      }
      if (inputPath.includes("/src/posts/")) {
        return { key: data.title, parent: "Blog" };
      }
    }

    return undefined;
  },
};
