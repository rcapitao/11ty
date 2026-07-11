const { execSync } = require("child_process");

function getGitFirstCommitTime(filePath) {
  try {
    const output = execSync(`git log --follow --format=%aI -- "${filePath}"`, {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    if (!output) return null;
    const lines = output.split("\n");
    return new Date(lines[lines.length - 1]);
  } catch (error) {
    return null;
  }
}

// Combines the front matter `date` (day) with an explicit `time` ("HH:MM"),
// or — if no time was set — the time of day the file was first committed,
// so "hora da publicação" defaults to when the post actually went out
// instead of silently landing on midnight.
function getPublishDateTime(data) {
  const day = new Date(data.date);

  if (typeof data.time === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(data.time.trim())) {
    const [hours, minutes] = data.time.trim().split(":").map(Number);
    const combined = new Date(day);
    combined.setUTCHours(hours, minutes, 0, 0);
    return combined;
  }

  const inputPath = data.page && data.page.inputPath;
  const gitTime = inputPath ? getGitFirstCommitTime(inputPath) : null;
  const combined = new Date(day);
  if (gitTime) {
    combined.setUTCHours(gitTime.getUTCHours(), gitTime.getUTCMinutes(), 0, 0);
  }
  return combined;
}

module.exports = { getPublishDateTime };
