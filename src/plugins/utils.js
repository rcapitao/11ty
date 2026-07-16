module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("limit", (array, n) => array.slice(0, n));

  eleventyConfig.addFilter("numberFormat", (n) => Number(n).toLocaleString("pt-BR"));

  // Posts that share at least one tag with the current item, ranked by how
  // many tags they share (then by most recent) — used for "posts relacionados".
  eleventyConfig.addFilter("relatedContent", (items, currentUrl, currentTags, limit = 5) => {
    const currentTagSet = new Set(currentTags || []);
    if (!currentTagSet.size) return [];

    return items
      .filter((item) => item.url !== currentUrl)
      .map((item) => ({
        item,
        shared: (item.data.tags || []).filter((tag) => currentTagSet.has(tag)).length,
      }))
      .filter((entry) => entry.shared > 0)
      .sort((a, b) => b.shared - a.shared || b.item.date - a.item.date)
      .slice(0, limit)
      .map((entry) => entry.item);
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
};
