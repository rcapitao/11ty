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
  // Mostra a data absoluta (não "X atrás"): num site estático, um texto relativo
  // calculado em build fica congelado no HTML e vai ficando errado conforme o
  // tempo passa sem um novo deploy.
  eleventyConfig.addShortcode("lastModified", function () {
    const date = getGitLastModified(this.page.inputPath) || new Date(this.page.date);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  });
};
