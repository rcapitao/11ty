const { state: buildMode } = require("../plugins/buildMode.js");
const { getPublishDateTime } = require("../plugins/publishTime.js");

function isPostOrNota(data) {
  const inputPath = data.page && data.page.inputPath;
  return typeof inputPath === "string" && (inputPath.includes("/src/notas/") || inputPath.includes("/src/posts/"));
}

module.exports = {
  // Posts/notas normally set an explicit `permalink`, but it's optional in
  // the Pages CMS form: if it's left blank, derive it from the file's own
  // slug (same one used for its filename) instead of failing the build. If
  // it is set, normalize a missing trailing slash rather than trusting
  // every front matter permalink to be well-formed (Eleventy fails the
  // build otherwise, unable to tell a directory from an extension-less file).
  //
  // Also handles `draft: true` (Pages CMS field): a draft post/nota isn't
  // written to disk at all, except while previewing locally (npm start), so
  // you can still see it on your machine before it's ready to publish.
  permalink: (data) => {
    if (!isPostOrNota(data)) return data.permalink;

    if (data.draft && !buildMode.isServing) return false;

    if (typeof data.permalink === "string" && data.permalink.length > 0) {
      return data.permalink.endsWith("/") ? data.permalink : `${data.permalink}/`;
    }

    const slug = data.page.filePathStem.replace(/\/index$/, "").split("/").pop();
    return `/blog/${slug}/`;
  },

  // The full publish moment (date + time), used to display "às HH:MM" on
  // the post/nota and to decide when a scheduled one goes live. `time`
  // ("HH:MM") is an optional Pages CMS field; when it's not set, the time
  // of day defaults to the file's first git commit instead of midnight.
  publishDateTime: (data) => {
    if (!isPostOrNota(data)) return undefined;
    return getPublishDateTime(data);
  },

  // A post/nota with a publish date/time in the future still gets built at
  // its URL (so you can share/preview the link ahead of time), but stays
  // out of collections — blog listing, home, tags, feeds, "posts
  // relacionados" — until that moment arrives. Drafts are excluded the
  // same way, as a safety net in case one ever ends up referenced
  // somewhere despite not being written to disk. Doesn't apply while
  // previewing locally.
  eleventyExcludeFromCollections: (data) => {
    if (!isPostOrNota(data) || buildMode.isServing) return data.eleventyExcludeFromCollections;

    if (data.draft) return true;

    return getPublishDateTime(data) > new Date() ? true : data.eleventyExcludeFromCollections;
  },

  eleventyNavigation: (data) => {
    // Top-level nav pages (Blog, Busca, Sobre) set a static
    // `navigationConfig` in their own front matter. Paginated templates only
    // register the entry once, on their first page.
    if (data.navigationConfig) {
      if (data.pagination && data.pagination.pageNumber > 0) return undefined;
      return data.navigationConfig;
    }

    // Every post/nota gets a breadcrumb entry automatically, with no
    // per-file front matter needed: posts and notas share the same Blog
    // section, which folder the file lives in (src/posts/ vs src/notas/)
    // only decides the URL namespace.
    if (isPostOrNota(data)) {
      return { key: data.title, parent: "Blog" };
    }

    return undefined;
  },
};
