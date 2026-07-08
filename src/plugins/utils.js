module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("limit", (array, n) => array.slice(0, n));

  eleventyConfig.addFilter("numberFormat", (n) => Number(n).toLocaleString("pt-BR"));

  eleventyConfig.addFilter("readingTime", (html) => {
    const text = (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const words = text ? text.split(" ").filter(Boolean).length : 0;
    return Math.max(1, Math.round(words / 200));
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
};
