const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

module.exports = function (eleventyConfig) {
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

  eleventyConfig.addFilter("tagsWithCounts", (posts) => {
    const counts = new Map();
    for (const post of posts) {
      for (const tag of post.data.tags || []) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], "pt-BR"))
      .map(([tag, count]) => ({ tag, count }));
  });
};
