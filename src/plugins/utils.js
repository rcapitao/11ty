module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("limit", (array, n) => array.slice(0, n));

  eleventyConfig.addFilter("numberFormat", (n) => Number(n).toLocaleString("pt-BR"));

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
};
