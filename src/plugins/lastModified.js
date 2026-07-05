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

function timeAgo(date) {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years >= 1) return years === 1 ? "1 ano" : `${years} anos`;
  if (months >= 1) return months === 1 ? "1 mês" : `${months} meses`;
  if (days >= 1) return days === 1 ? "1 dia" : `${days} dias`;
  if (hours >= 1) return hours === 1 ? "1 hora" : `${hours} horas`;
  if (minutes >= 1) return minutes === 1 ? "1 minuto" : `${minutes} minutos`;
  return "poucos segundos";
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("lastModified", function () {
    const date = getGitLastModified(this.page.inputPath) || new Date(this.page.date);
    return timeAgo(date);
  });
};
