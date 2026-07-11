const MONTH_NAMES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const MONTH_NAMES_FULL = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const WEEKDAY_NAMES = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const WORDS_PER_MINUTE = 200;

const fs = require("fs");

// Reads the raw markdown body (front matter stripped) straight off disk instead
// of using the rendered `templateContent`, since that's only populated once a
// given item has itself been compiled — accessing it from another page's filter
// throws TemplateContentPrematureUseError depending on build order.
function readBody(inputPath) {
  const raw = fs.readFileSync(inputPath, "utf8");
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
}

function countImages(body) {
  const markdownImages = body.match(/!\[[^\]]*\]\([^)]*\)/g) || [];
  const htmlImages = body.match(/<img\b/gi) || [];
  return markdownImages.length + htmlImages.length;
}

function countWords(body) {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#>*_~`|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text ? text.split(" ").filter(Boolean).length : 0;
}

// UTC-based day index, used so bucketing doesn't depend on the build machine's timezone.
function utcDayIndex(date) {
  return Math.floor(date.getTime() / 86400000);
}

// Epoch (Jan 1 1970) was a Thursday, so shift by 3 to get Monday-start week indexes.
function utcWeekIndex(date) {
  return Math.floor((utcDayIndex(date) + 3) / 7);
}

function utcWeekdayMonFirst(date) {
  return (date.getUTCDay() + 6) % 7; // 0 = Monday ... 6 = Sunday
}

function longestConsecutiveRun(sortedUniqueIndexes) {
  if (!sortedUniqueIndexes.length) return 0;
  let max = 1;
  let current = 1;
  for (let i = 1; i < sortedUniqueIndexes.length; i++) {
    current = sortedUniqueIndexes[i] === sortedUniqueIndexes[i - 1] + 1 ? current + 1 : 1;
    if (current > max) max = current;
  }
  return max;
}

function currentConsecutiveRun(sortedUniqueIndexes, todayIndex) {
  if (!sortedUniqueIndexes.length) return 0;
  const last = sortedUniqueIndexes[sortedUniqueIndexes.length - 1];
  if (todayIndex - last > 1) return 0;
  let length = 1;
  for (let i = sortedUniqueIndexes.length - 1; i > 0; i--) {
    if (sortedUniqueIndexes[i] === sortedUniqueIndexes[i - 1] + 1) {
      length += 1;
    } else {
      break;
    }
  }
  return length;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("blogStats", function (posts, notas) {
    const all = [...posts, ...notas];

    const entries = all.map((item) => {
      const body = readBody(item.inputPath);
      return {
        item,
        date: new Date(item.date),
        words: countWords(body),
        images: countImages(body),
      };
    });
    entries.forEach((entry) => {
      entry.minutes = Math.max(1, Math.round(entry.words / WORDS_PER_MINUTE));
    });

    const totalItems = entries.length;
    const totalWords = entries.reduce((sum, e) => sum + e.words, 0);
    const totalImages = entries.reduce((sum, e) => sum + e.images, 0);
    const avgWords = totalItems ? Math.round(totalWords / totalItems) : 0;

    const byDate = [...entries].sort((a, b) => a.date - b.date);
    const firstDate = byDate.length ? byDate[0].date : null;
    const lastDate = byDate.length ? byDate[byDate.length - 1].date : null;
    const daysWriting = firstDate && lastDate ? Math.round((lastDate - firstDate) / 86400000) : 0;

    const totalMinutes = entries.reduce((sum, e) => sum + e.minutes, 0);
    const avgMinutes = totalItems ? Math.round(totalMinutes / totalItems) : 0;
    const byWordCount = [...entries].sort((a, b) => b.words - a.words);
    const longestEntry = byWordCount[0];
    const shortestEntry = byWordCount[byWordCount.length - 1];
    const toReadingSummary = (entry) =>
      entry && {
        title: entry.item.data.title,
        url: entry.item.url,
        words: entry.words,
        minutes: entry.minutes,
      };

    const yearMap = new Map();
    for (const entry of entries) {
      const year = entry.date.getUTCFullYear();
      if (!yearMap.has(year)) yearMap.set(year, { year, count: 0, words: 0 });
      const bucket = yearMap.get(year);
      bucket.count += 1;
      bucket.words += entry.words;
    }
    const byYear = [...yearMap.values()].sort((a, b) => a.year - b.year);
    const maxYearCount = Math.max(1, ...byYear.map((y) => y.count));
    byYear.forEach((y) => { y.pct = Math.round((y.count / maxYearCount) * 100); });

    const monthCounts = new Array(12).fill(0);
    for (const entry of entries) monthCounts[entry.date.getUTCMonth()] += 1;
    const maxMonthCount = Math.max(1, ...monthCounts);
    const byMonthOfYear = monthCounts.map((count, i) => ({
      name: MONTH_NAMES[i],
      count,
      pct: Math.round((count / maxMonthCount) * 100),
    }));

    const weekdayCounts = new Array(7).fill(0);
    for (const entry of entries) weekdayCounts[utcWeekdayMonFirst(entry.date)] += 1;
    const maxWeekdayCount = Math.max(1, ...weekdayCounts);
    const byWeekday = weekdayCounts.map((count, i) => ({
      name: WEEKDAY_NAMES[i],
      count,
      pct: Math.round((count / maxWeekdayCount) * 100),
    }));

    const weekIndexes = [...new Set(byDate.map((e) => utcWeekIndex(e.date)))].sort((a, b) => a - b);
    const todayWeekIndex = utcWeekIndex(new Date());
    const streak = {
      current: currentConsecutiveRun(weekIndexes, todayWeekIndex),
      longest: longestConsecutiveRun(weekIndexes),
    };

    // "posts"/"notas" mark content type, not topic — they'd dwarf every
    // other tag here (one is on ~80% of all content), so they're excluded
    // from this topic-focused ranking.
    const STRUCTURAL_TAGS = new Set(["posts", "notas"]);
    const tagCounts = new Map();
    for (const item of all) {
      for (const tag of item.data.tags || []) {
        if (STRUCTURAL_TAGS.has(tag)) continue;
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }
    const tags = [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pt-BR"))
      .map(([tag, count]) => ({ tag, count }));
    const maxTagCount = Math.max(1, ...tags.map((t) => t.count));
    tags.forEach((t) => { t.weight = Math.max(1, Math.min(5, Math.ceil((t.count / maxTagCount) * 5))); });

    const currentYear = new Date().getUTCFullYear();
    const thisYearEntries = entries.filter((e) => e.date.getUTCFullYear() === currentYear);
    const thisYearWords = thisYearEntries.reduce((sum, e) => sum + e.words, 0);
    const thisYearMonthCounts = new Array(12).fill(0);
    thisYearEntries.forEach((e) => { thisYearMonthCounts[e.date.getUTCMonth()] += 1; });
    let topMonthIndex = 0;
    thisYearMonthCounts.forEach((count, i) => {
      if (count > thisYearMonthCounts[topMonthIndex]) topMonthIndex = i;
    });

    return {
      totalPosts: posts.length,
      totalNotas: notas.length,
      totalItems,
      totalWords,
      avgWords,
      totalImages,
      firstDate,
      lastDate,
      daysWriting,
      readingTime: {
        totalMinutes,
        avgMinutes,
        longest: toReadingSummary(longestEntry),
        shortest: toReadingSummary(shortestEntry),
      },
      byYear,
      byMonthOfYear,
      byWeekday,
      streak,
      tags,
      yearRecap: {
        year: currentYear,
        count: thisYearEntries.length,
        words: thisYearWords,
        topMonth: thisYearEntries.length
          ? { name: MONTH_NAMES_FULL[topMonthIndex], count: thisYearMonthCounts[topMonthIndex] }
          : null,
      },
    };
  });
};
