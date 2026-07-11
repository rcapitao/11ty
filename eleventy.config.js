const { InputPathToUrlTransformPlugin } = require("@11ty/eleventy");
const pluginRss = require("@11ty/eleventy-plugin-rss").default;
const pluginNavigation = require("@11ty/eleventy-navigation");
const utilsPlugin = require("./src/plugins/utils.js");
const datesPlugin = require("./src/plugins/dates.js");
const archivePlugin = require("./src/plugins/archive.js");
const collectionsPlugin = require("./src/plugins/collections.js");
const lastModifiedPlugin = require("./src/plugins/lastModified.js");
const statsPlugin = require("./src/plugins/stats.js");
const buildModePlugin = require("./src/plugins/buildMode.js");

const PATH_PREFIX = "/rcapitao.com/";

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(utilsPlugin);
  eleventyConfig.addPlugin(datesPlugin);
  eleventyConfig.addPlugin(archivePlugin);
  eleventyConfig.addPlugin(collectionsPlugin);
  eleventyConfig.addPlugin(lastModifiedPlugin);
  eleventyConfig.addPlugin(statsPlugin);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(buildModePlugin);

  eleventyConfig.addGlobalData("pathPrefix", PATH_PREFIX);

  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/img");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/posts/**/*.{png,jpg,jpeg,gif,webp,svg}");
  eleventyConfig.addPassthroughCopy("src/notas/**/*.{png,jpg,jpeg,gif,webp,svg}");

  return {
    pathPrefix: PATH_PREFIX,
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
    },
  };
};
