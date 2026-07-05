module.exports = function (eleventyConfig) {
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/**/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("notas", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/posts/**/*.md")
      .filter((post) => post.data.tags && post.data.tags.includes("notas"))
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();
    collectionApi.getFilteredByGlob("src/posts/**/*.md").forEach((post) => {
      for (const tag of post.data.tags || []) {
        tags.add(tag);
      }
    });
    return [...tags].sort((a, b) => a.localeCompare(b, "pt-BR"));
  });
};
