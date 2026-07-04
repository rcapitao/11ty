const pluginRss = require("@11ty/eleventy-plugin-rss").default;

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addPassthroughCopy("src/css");

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return new Date(dateObj).toISOString().split("T")[0];
  });

  eleventyConfig.addFilter("shortDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  const MONTH_NAMES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  eleventyConfig.addFilter("groupPostsByYearMonth", (posts) => {
    const years = new Map();

    for (const post of posts) {
      const date = new Date(post.date);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (!years.has(year)) years.set(year, new Map());
      const months = years.get(year);
      if (!months.has(month)) months.set(month, []);
      months.get(month).push(post);
    }

    return [...years.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([year, months]) => {
        const monthGroups = [...months.entries()]
          .sort((a, b) => b[0] - a[0])
          .map(([month, monthPosts]) => ({
            id: `${year}-${String(month + 1).padStart(2, "0")}`,
            name: MONTH_NAMES[month],
            count: monthPosts.length,
            posts: monthPosts,
          }));

        return {
          id: `${year}`,
          year,
          count: monthGroups.reduce((sum, m) => sum + m.count, 0),
          months: monthGroups,
        };
      });
  });

  eleventyConfig.addFilter("uniqueTags", (posts) => {
    const tags = new Set();
    for (const post of posts) {
      for (const tag of post.data.tags || []) {
        tags.add(tag);
      }
    }
    return [...tags].sort((a, b) => a.localeCompare(b, "pt-BR"));
  });

  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("blogPosts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .filter((post) => (post.data.tags || []).includes("blog"))
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("notasPosts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .filter((post) => (post.data.tags || []).includes("notas"))
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();
    collectionApi.getFilteredByGlob("src/posts/*.md").forEach((post) => {
      for (const tag of post.data.tags || []) {
        tags.add(tag);
      }
    });
    return [...tags].sort((a, b) => a.localeCompare(b, "pt-BR"));
  });

  return {
    pathPrefix: "/11ty/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
