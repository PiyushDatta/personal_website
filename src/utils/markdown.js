const countWords = (markdown = '') =>
  markdown
    .split(/\s+/)
    .map((token) => token.replace(/\W/g, ''))
    .filter((token) => token.length).length;

const estimateReadingTime = (wordCount, wordsPerMinute = 200) =>
  Math.max(1, Math.ceil(wordCount / wordsPerMinute));

export { countWords, estimateReadingTime };
