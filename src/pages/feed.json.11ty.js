module.exports = class {
  data() {
    return {
      permalink: "/feed.json",
      eleventyExcludeFromCollections: true,
    };
  }

  render({ collections, metadata, pathPrefix }) {
    const siteUrl = metadata.url + pathPrefix.replace(/\/$/, "");

    const feed = {
      version: "https://jsonfeed.org/version/1.1",
      title: metadata.title,
      home_page_url: `${siteUrl}/`,
      feed_url: `${siteUrl}/feed.json`,
      description: metadata.description,
      author: { name: metadata.author },
      items: collections.posts.map((post) => ({
        id: siteUrl + post.url,
        url: siteUrl + post.url,
        title: post.data.title,
        content_html: post.templateContent,
        date_published: new Date(post.date).toISOString(),
      })),
    };

    return JSON.stringify(feed, null, 2);
  }
};
