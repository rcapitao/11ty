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
};
