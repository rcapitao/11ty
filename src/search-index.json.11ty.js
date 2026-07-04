function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = class {
  data() {
    return {
      permalink: "/search-index.json",
      eleventyExcludeFromCollections: true,
    };
  }

  render({ collections }) {
    const items = collections.all
      .filter((item) => item.data.title && item.url && !item.data.pagination)
      .map((item) => ({
        title: item.data.title,
        url: item.url,
        date: item.date,
        content: stripHtml(item.templateContent || ""),
      }));

    return JSON.stringify(items);
  }
};
