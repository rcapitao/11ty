const { state: buildMode } = require("../plugins/buildMode.js");
const { getPublishDateTime, getUpdatedDateTime } = require("../plugins/publishTime.js");

function isPost(data) {
  const inputPath = data.page && data.page.inputPath;
  return typeof inputPath === "string" && inputPath.includes("/src/posts/");
}

module.exports = {
  // Posts normally set an explicit `permalink`, but it's optional in the CMS
  // form: if it's left blank, derive it from the file's own slug (same one
  // used for its filename) instead of failing the build. If it is set,
  // normalize a missing trailing slash rather than trusting every front
  // matter permalink to be well-formed (Eleventy fails the build otherwise,
  // unable to tell a directory from an extension-less file).
  //
  // Also handles `draft: true` (CMS field): a draft post isn't written to
  // disk at all, except while previewing locally (npm start), so you can
  // still see it on your machine before it's ready to publish.
  permalink: (data) => {
    if (!isPost(data)) return data.permalink;

    if (data.draft && !buildMode.isServing) return false;

    if (typeof data.permalink === "string" && data.permalink.length > 0) {
      return data.permalink.endsWith("/") ? data.permalink : `${data.permalink}/`;
    }

    const slug = data.page.filePathStem.replace(/\/index$/, "").split("/").pop();
    return `/blog/${slug}/`;
  },

  // The full publish moment (date + time), used to display "às HH:MM" on
  // the post. The CMS "date" field has a time picker built in; when it's
  // left at midnight, the time of day defaults to the file's first git
  // commit instead (see publishTime.js).
  publishDateTime: (data) => {
    if (!isPost(data)) return undefined;
    return getPublishDateTime(data);
  },

  // "Atualizado em" is entirely automatic — derived from git, not a field
  // you fill in — so editing a post can never overwrite its publish date.
  // `date` always stays the original publish moment; this only shows up
  // once the file has been committed again since then (see publishTime.js).
  updated: (data) => {
    if (!isPost(data)) return data.updated;
    return getUpdatedDateTime(data) || undefined;
  },

  // Drafts are excluded from collections — blog listing, home, tags, feeds,
  // "posts relacionados" — as a safety net in case one ever ends up
  // referenced somewhere despite not being written to disk. Doesn't apply
  // while previewing locally.
  eleventyExcludeFromCollections: (data) => {
    if (!isPost(data) || buildMode.isServing) return data.eleventyExcludeFromCollections;

    return data.draft ? true : data.eleventyExcludeFromCollections;
  },

  eleventyNavigation: (data) => {
    // Top-level nav pages (Blog, Busca, Sobre) set a static
    // `navigationConfig` in their own front matter. Paginated templates only
    // register the entry once, on their first page.
    if (data.navigationConfig) {
      if (data.pagination && data.pagination.pageNumber > 0) return undefined;
      return data.navigationConfig;
    }

    // Every post gets a breadcrumb entry automatically, with no per-file
    // front matter needed.
    if (isPost(data)) {
      return { key: data.title, parent: "Blog" };
    }

    // Regular pages can opt into a breadcrumb parent (CMS field
    // `breadcrumbParent`), nesting them under one of the top-level nav
    // sections above instead of showing only "Home / <título>".
    if (data.breadcrumbParent) {
      return { key: data.title, parent: data.breadcrumbParent };
    }

    return undefined;
  },
};
