const PATH_PREFIX = "/11ty";

module.exports = class {
  data() {
    return {
      pagination: {
        data: "collections.tagList",
        size: 1,
        alias: "tag",
      },
      permalink: (data) => `/tags/${data.tag}/feed.json`,
      eleventyExcludeFromCollections: true,
    };
  }

  render({ collections, metadata, tag }) {
    const siteUrl = metadata.url + PATH_PREFIX;
    const posts = collections.posts.filter((post) => (post.data.tags || []).includes(tag));

    const feed = {
      version: "https://jsonfeed.org/version/1.1",
      title: `${metadata.title} — #${tag}`,
      home_page_url: `${siteUrl}/tags/${tag}/`,
      feed_url: `${siteUrl}/tags/${tag}/feed.json`,
      description: metadata.description,
      author: { name: metadata.author },
      items: posts.map((post) => ({
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
