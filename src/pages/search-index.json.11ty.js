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
    const items = collections.content
      .filter((item) => item.data.title && item.url)
      .map((item) => ({
        title: item.data.title,
        url: item.url,
        date: item.date,
        tags: item.data.tags || [],
        content: stripHtml(item.templateContent || ""),
      }));

    return JSON.stringify(items);
  }
};
