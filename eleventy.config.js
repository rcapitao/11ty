const pluginRss = require("@11ty/eleventy-plugin-rss").default;
const utilsPlugin = require("./plugins/utils.js");
const datesPlugin = require("./plugins/dates.js");
const archivePlugin = require("./plugins/archive.js");
const collectionsPlugin = require("./plugins/collections.js");

const PATH_PREFIX = "/11ty/";

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(utilsPlugin);
  eleventyConfig.addPlugin(datesPlugin);
  eleventyConfig.addPlugin(archivePlugin);
  eleventyConfig.addPlugin(collectionsPlugin);

  eleventyConfig.addGlobalData("pathPrefix", PATH_PREFIX);

  eleventyConfig.addPassthroughCopy("src/css");

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
