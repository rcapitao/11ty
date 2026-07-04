const pluginRss = require("@11ty/eleventy-plugin-rss").default;
const utilsPlugin = require("./src/plugins/utils.js");
const datesPlugin = require("./src/plugins/dates.js");
const archivePlugin = require("./src/plugins/archive.js");
const collectionsPlugin = require("./src/plugins/collections.js");

const PATH_PREFIX = "/rcapitao.com/";

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(utilsPlugin);
  eleventyConfig.addPlugin(datesPlugin);
  eleventyConfig.addPlugin(archivePlugin);
  eleventyConfig.addPlugin(collectionsPlugin);

  eleventyConfig.addGlobalData("pathPrefix", PATH_PREFIX);

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/img");

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
