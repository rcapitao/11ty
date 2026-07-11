module.exports = {
  // Posts/notas normally set an explicit `permalink`, but it's optional in
  // the Pages CMS form: if it's left blank, derive it from the file's own
  // slug (same one used for its filename) instead of failing the build. If
  // it is set, normalize a missing trailing slash rather than trusting
  // every front matter permalink to be well-formed (Eleventy fails the
  // build otherwise, unable to tell a directory from an extension-less file).
  permalink: (data) => {
    const inputPath = data.page && data.page.inputPath;
    const isPostOrNota = typeof inputPath === "string" && (inputPath.includes("/src/notas/") || inputPath.includes("/src/posts/"));
    if (!isPostOrNota) return data.permalink;

    if (typeof data.permalink === "string" && data.permalink.length > 0) {
      return data.permalink.endsWith("/") ? data.permalink : `${data.permalink}/`;
    }

    const slug = data.page.filePathStem.replace(/\/index$/, "").split("/").pop();
    return `/blog/${slug}/`;
  },

  eleventyNavigation: (data) => {
    // Top-level nav pages (Blog, Busca, Sobre) set a static
    // `navigationConfig` in their own front matter. Paginated templates only
    // register the entry once, on their first page.
    if (data.navigationConfig) {
      if (data.pagination && data.pagination.pageNumber > 0) return undefined;
      return data.navigationConfig;
    }

    // Every post/nota gets a breadcrumb entry automatically, with no
    // per-file front matter needed: posts and notas share the same Blog
    // section, which folder the file lives in (src/posts/ vs src/notas/)
    // only decides the URL namespace.
    const inputPath = data.page && data.page.inputPath;
    if (typeof inputPath === "string") {
      if (inputPath.includes("/src/notas/") || inputPath.includes("/src/posts/")) {
        return { key: data.title, parent: "Blog" };
      }
    }

    return undefined;
  },
};
