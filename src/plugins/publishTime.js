const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

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

function stripFrontMatter(content) {
  const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?([\s\S]*)$/);
  return match ? match[1].trim() : content.trim();
}

function getCommitHashesNewestFirst(filePath) {
  try {
    const output = execSync(`git log --follow --format=%H -- "${filePath}"`, {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    return output ? output.split("\n") : [];
  } catch (error) {
    return [];
  }
}

function getFileAtCommit(commitHash, filePath) {
  try {
    return execSync(`git show ${commitHash}:"${filePath}"`, {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "ignore"],
    }).toString();
  } catch (error) {
    return null;
  }
}

function getCommitTime(commitHash) {
  try {
    const output = execSync(`git show -s --format=%aI ${commitHash}`, {
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

// "Atualizado em" only fires when the post/nota's body — the text after
// front matter — actually changed, not whenever any commit touches the
// file. Otherwise routine maintenance (retagging everything, migrating
// URLs, fixing a broken image path, correcting the publish date) would
// make practically every post claim to have been "updated today", which
// isn't a real content revision from the reader's point of view. Walks
// commits newest-to-oldest and returns the time of the most recent one
// where the body actually differs from the version right before it.
function getUpdatedDateTime(data) {
  const inputPath = data.page && data.page.inputPath;
  if (!inputPath) return null;

  const hashes = getCommitHashesNewestFirst(inputPath);
  if (hashes.length < 2) return null;

  let currentBody;
  try {
    currentBody = stripFrontMatter(fs.readFileSync(path.join(process.cwd(), inputPath), "utf8"));
  } catch (error) {
    return null;
  }

  for (let i = 0; i < hashes.length - 1; i++) {
    const olderContent = getFileAtCommit(hashes[i + 1], inputPath);
    if (olderContent === null) continue;

    const olderBody = stripFrontMatter(olderContent);
    if (olderBody !== currentBody) {
      return getCommitTime(hashes[i]);
    }
  }

  return null;
}

module.exports = { getPublishDateTime, getUpdatedDateTime };
