

export class ScoreGrid {
  /**
   * @type {number[][]}
   */
  #grid;

  constructor(height, width) {
    this.#grid = Array.from({ length: height + 1 }, () =>
      Array(width + 1).fill(0)
    );
  }

  /**
   * @param {number} originalIndex
   * @param {number} modifiedIndex
   * @returns {number}
   */
  getScore(originalIndex, modifiedIndex) {
    return this.#grid[originalIndex][modifiedIndex];
  }

  /**
   * @param {number} originalIndex
   * @param {number} modifiedIndex
   * @param {number} score
   */
  setScore(originalIndex, modifiedIndex, score) {
    this.#grid[originalIndex][modifiedIndex] = score;
  }

  /**
   * @param {number} originalIndex
   * @param {number} modifiedIndex
   * @returns {number}
   */
  scoreIfMatch(originalIndex, modifiedIndex) {
    return this.#grid[originalIndex - 1][modifiedIndex - 1] + 1;
  }

  /**
   * @param {number} originalIndex
   * @param {number} modifiedIndex
   * @returns {number}
   */
  scoreIfDeleted(originalIndex, modifiedIndex) {
    return this.#grid[originalIndex - 1][modifiedIndex];
  }

  /**
   * @param {number} originalIndex
   * @param {number} modifiedIndex
   * @returns {number}
   */
  scoreIfAdded(originalIndex, modifiedIndex) {
    return this.#grid[originalIndex][modifiedIndex - 1];
  }
}

/**
 * Generates the scoring matrix based on matching lines.
 *
 * @param {string[]} originalLines
 * @param {string[]} modifiedLines
 * @returns {ScoreGrid} The scoring grid.
 */
export function calculateSimilarityTable(originalLines, modifiedLines) {
  const height = originalLines.length;
  const width = modifiedLines.length;
  const scoreGrid = new ScoreGrid(height, width);

  for (let originalIndex = 1; originalIndex <= height; originalIndex++) {
    for (let modifiedIndex = 1; modifiedIndex <= width; modifiedIndex++) {
      const linesMatch =
        originalLines[originalIndex - 1] === modifiedLines[modifiedIndex - 1];

      if (linesMatch) {
        const matchScore = scoreGrid.scoreIfMatch(originalIndex, modifiedIndex);
        scoreGrid.setScore(originalIndex, modifiedIndex, matchScore);
        continue;
      }

      const bestNonMatchingScore = Math.max(
        scoreGrid.scoreIfDeleted(originalIndex, modifiedIndex),
        scoreGrid.scoreIfAdded(originalIndex, modifiedIndex)
      );

      scoreGrid.setScore(originalIndex, modifiedIndex, bestNonMatchingScore);
    }
  }

  return scoreGrid;
}
