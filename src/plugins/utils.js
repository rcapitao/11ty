module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("limit", (array, n) => array.slice(0, n));

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
};
