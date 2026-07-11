// Tracks whether Eleventy is running "npm start" (serve/watch) vs a real
// build ("npm run build"), so eleventyComputed.js can skip draft/scheduled
// hiding while previewing locally. Exported as mutable state (not a plain
// value) because eleventyComputed.js is loaded once, before this plugin's
// "eleventy.before" event has fired for the first time.
const state = { isServing: false };

module.exports = function (eleventyConfig) {
  eleventyConfig.on("eleventy.before", ({ runMode }) => {
    state.isServing = runMode === "serve" || runMode === "watch";
  });
};

module.exports.state = state;
