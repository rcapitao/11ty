module.exports = class {
  data() {
    return {
      permalink: "/search-index.json",
      eleventyExcludeFromCollections: true,
    };
  }

  render({ collections }) {
    const items = collections.posts.map((post) => ({
      title: post.data.title,
      url: post.url,
      date: post.date,
    }));

    return JSON.stringify(items);
  }
};
