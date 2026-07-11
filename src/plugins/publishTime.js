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

function getGitLastCommitTime(filePath) {
  try {
    const output = execSync(`git log --follow -1 --format=%aI -- "${filePath}"`, {
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

// The Pages CMS "date" field has a time picker built in (options.time:
// true), so `date` alone can already carry a real publish time. But it
// defaults new entries to midnight rather than the current time, and
// every post/nota written before this feature existed is date-only (also
// midnight once parsed) — so midnight UTC is treated as "no time set" and
// filled in with the hour the file was first committed, instead of
// silently publishing everything at 00:00.
function getPublishDateTime(data) {
  const publishedAt = new Date(data.date);
  const hasExplicitTime = publishedAt.getUTCHours() !== 0 || publishedAt.getUTCMinutes() !== 0;
  if (hasExplicitTime) return publishedAt;

  const inputPath = data.page && data.page.inputPath;
  const gitTime = inputPath ? getGitFirstCommitTime(inputPath) : null;
  if (gitTime) {
    publishedAt.setUTCHours(gitTime.getUTCHours(), gitTime.getUTCMinutes(), 0, 0);
  }
  return publishedAt;
}

// "Atualizado em" only tracks commits from this feature's launch onward.
// Every post/nota that existed before it got touched by bulk maintenance
// (URL migration, adding the `posts` tag, moving images, etc.) — comparing
// against each file's own first commit would make practically all of them
// read as "updated today", which isn't a real content revision. Comparing
// against a fixed cutover instead means only genuine edits made after this
// shipped (through Pages CMS or otherwise) count.
const UPDATED_TRACKING_STARTS_AT = new Date("2026-07-11T04:00:00.000Z");

function getUpdatedDateTime(data) {
  const inputPath = data.page && data.page.inputPath;
  if (!inputPath) return null;

  const lastCommit = getGitLastCommitTime(inputPath);
  if (!lastCommit || lastCommit <= UPDATED_TRACKING_STARTS_AT) return null;

  return lastCommit;
}

module.exports = { getPublishDateTime, getUpdatedDateTime };
