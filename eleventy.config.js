const pluginRss = require("@11ty/eleventy-plugin-rss").default;
const pluginNavigation = require("@11ty/eleventy-navigation");
const utilsPlugin = require("./src/plugins/utils.js");
const datesPlugin = require("./src/plugins/dates.js");
const archivePlugin = require("./src/plugins/archive.js");
const collectionsPlugin = require("./src/plugins/collections.js");
const lastModifiedPlugin = require("./src/plugins/lastModified.js");

const PATH_PREFIX = "/rcapitao.com/";

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(utilsPlugin);
  eleventyConfig.addPlugin(datesPlugin);
  eleventyConfig.addPlugin(archivePlugin);
  eleventyConfig.addPlugin(collectionsPlugin);
  eleventyConfig.addPlugin(lastModifiedPlugin);
  eleventyConfig.addPlugin(pluginNavigation);

  eleventyConfig.addGlobalData("pathPrefix", PATH_PREFIX);

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/posts/**/*.{png,jpg,jpeg,gif,webp,svg}");
  // This bundle's permalink is under /notas/ (tagged "notas"), which diverges from its
  // src/posts/ source path, so its image needs an explicit passthrough remap to match.
  eleventyConfig.addPassthroughCopy({
    "src/posts/como-desativar-o-compartilhamento-de-dados-para-ia-no-linkedin/image-6.webp":
      "notas/como-desativar-o-compartilhamento-de-dados-para-ia-no-linkedin/image-6.webp",
  });

  return {
    pathPrefix: PATH_PREFIX,
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
