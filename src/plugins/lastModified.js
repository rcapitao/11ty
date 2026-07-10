const { execSync } = require("child_process");

function getGitLastModified(filePath) {
  try {
    const output = execSync(`git log -1 --format=%aI -- "${filePath}"`, {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    return output ? new Date(output) : null;
  } catch (error) {
    return null;
  }
}

module.exports = function (eleventyConfig) {
  // Emite a data real da última modificação (do git) num <time datetime="">,
  // com a data absoluta como texto/fallback. O "X atrás" é calculado no
  // navegador (script em base.njk) a partir desse datetime — assim o texto
  // reflete o momento em que a página é vista, em vez de ficar congelado com
  // o valor calculado no build (que ficaria cada vez mais errado sem deploys).
  eleventyConfig.addShortcode("lastModified", function () {
    const date = getGitLastModified(this.page.inputPath) || new Date(this.page.date);
    const iso = date.toISOString();
    const fallback = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    return `<time class="js-time-ago" datetime="${iso}">${fallback}</time>`;
  });
};
