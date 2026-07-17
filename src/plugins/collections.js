module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/**/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();
    const items = collectionApi.getFilteredByGlob("src/posts/**/*.md");
    items.forEach((post) => {
      for (const tag of post.data.tags || []) {
        tags.add(tag);
      }
    });
    return [...tags].sort((a, b) => a.localeCompare(b, "pt-BR"));
  });

  // Redirect pages: posts/páginas can set an `alias` field (one or more old
  // paths) in the CMS, and a page gets generated at each of those paths that
  // redirects to the item's current permalink — see alias-redirect.njk.
  eleventyConfig.addCollection("aliases", (collectionApi) => {
    const items = [
      ...collectionApi.getFilteredByGlob("src/posts/**/*.md"),
      ...collectionApi.getFilteredByGlob("src/pages/**/*.md"),
    ];
    const redirects = [];
    items.forEach((item) => {
      const aliases = item.data.alias;
      if (!aliases) return;
      const list = Array.isArray(aliases) ? aliases : [aliases];
      list.forEach((from) => {
        if (from) redirects.push({ from, to: item.url });
      });
    });
    return redirects;
  });
};
