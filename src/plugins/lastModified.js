const { execSync } = require("child_process");

const MONTH_NAMES_FULL = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

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

// First commit that added the file, used as the post's "publish time" — %aI
// preserves the author's original timezone offset, which we read verbatim
// instead of converting to the build machine's local time.
function getGitFirstCommitIso(filePath) {
  try {
    const output = execSync(`git log --format=%aI --follow -- "${filePath}"`, {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    if (!output) return null;
    const lines = output.split("\n").filter(Boolean);
    return lines[lines.length - 1] || null;
  } catch (error) {
    return null;
  }
}

function formatDateTimeLabel(year, month, day, hour, minute) {
  const dayLabel = String(day).padStart(2, "0");
  return `${dayLabel} de ${MONTH_NAMES_FULL[month]} de ${year} às ${hour}:${minute}`;
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

  eleventyConfig.addFilter("publishDateTime", function (page) {
    // The date comes from front matter (same as everywhere else on the site);
    // git history only supplies the time of day, since file moves/squash
    // merges make git's own commit date unreliable as a "publish date".
    const date = new Date(page.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const gitIso = getGitFirstCommitIso(page.inputPath);
    const timeMatch = gitIso && gitIso.match(/T(\d{2}):(\d{2})/);
    const hour = timeMatch ? timeMatch[1] : "00";
    const minute = timeMatch ? timeMatch[2] : "00";

    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T${hour}:${minute}:00`;
    const label = formatDateTimeLabel(year, month, day, hour, minute);
    return { iso, label };
  });
};
