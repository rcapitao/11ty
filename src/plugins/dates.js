// Dates are stored as real UTC instants, but readers (and the author) are
// in Brazil, so every filter that shows a date/time on the page renders it
// in Brazil's timezone, not the build server's (GitHub Actions runs in
// UTC) — otherwise a post authored at 14:45 in São Paulo would display as
// 17:45, three hours ahead of what was actually typed.
const AUTHOR_TIMEZONE = "America/Sao_Paulo";

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: AUTHOR_TIMEZONE,
    });
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return new Date(dateObj).toISOString().split("T")[0];
  });

  eleventyConfig.addFilter("isoDateTime", (dateObj) => {
    return new Date(dateObj).toISOString();
  });

  eleventyConfig.addFilter("shortDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: AUTHOR_TIMEZONE,
    });
  });

  eleventyConfig.addFilter("shortTime", (dateObj) => {
    return new Date(dateObj).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: AUTHOR_TIMEZONE,
    });
  });
};
