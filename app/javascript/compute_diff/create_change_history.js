/**
 * @typedef {import("./calculate_similarity_table.js").ScoreGrid} ScoreGrid
 */

/**
 * @typedef {"eq" | "add" | "del"} ActionType
 */

/**
 * @typedef {Object} Edit
 * @property {ActionType} type
 * @property {string} line
 */

/**
 * @param {ScoreGrid} scoreGrid
 * @param {string[]} originalLines
 * @param {string[]} modifiedLines
 * @returns {Edit[]}
 */
export function createChangeHistory(scoreGrid, originalLines, modifiedLines) {
  /** @type {Edit[]} */
  const history = [];

  let originalIndex = originalLines.length;
  let modifiedIndex = modifiedLines.length;

  while (originalIndex > 0 || modifiedIndex > 0) {
    const type = getActionType(
      scoreGrid,
      originalLines,
      modifiedLines,
      originalIndex,
      modifiedIndex
    );

    switch (type) {
      case "eq":
        history.push({ type, line: modifiedLines[modifiedIndex - 1] });
        originalIndex -= 1;
        modifiedIndex -= 1;
        break;
      case "add":
        history.push({ type, line: modifiedLines[modifiedIndex - 1] });
        modifiedIndex -= 1;
        break;
      case "del":
        history.push({ type, line: originalLines[originalIndex - 1] });
        originalIndex -= 1;
        break;
    }
  }

  return history.reverse();
}

/**
 * @param {ScoreGrid} scoreGrid
 * @param {string[]} originalLines
 * @param {string[]} modifiedLines
 * @param {number} originalIndex
 * @param {number} modifiedIndex
 * @returns {ActionType}
 */
function getActionType(
  scoreGrid,
  originalLines,
  modifiedLines,
  originalIndex,
  modifiedIndex
) {
  if (isEqual(originalLines, modifiedLines, originalIndex, modifiedIndex)) {
    const line = modifiedLines[modifiedIndex - 1];
    if (
      preferAddOverEqWhenScoresAreTheSame(
        line,
        scoreGrid,
        originalIndex,
        modifiedIndex
      )
    ) {
      return "add";
    }
    return "eq";
  }

  if (isAddition(scoreGrid, originalIndex, modifiedIndex)) {
    return "add";
  }

  return "del";
}

/**
 * @param {string[]} originalLines
 * @param {string[]} modifiedLines
 * @param {number} originalIndex
 * @param {number} modifiedIndex
 * @returns {boolean}
 */
function isEqual(originalLines, modifiedLines, originalIndex, modifiedIndex) {
  return (
    originalIndex > 0 &&
    modifiedIndex > 0 &&
    originalLines[originalIndex - 1] === modifiedLines[modifiedIndex - 1]
  );
}

/**
 * @param {string} line
 * @param {ScoreGrid} scoreGrid
 * @param {number} originalIndex
 * @param {number} modifiedIndex
 * @returns {boolean}
 */
function preferAddOverEqWhenScoresAreTheSame(
  line,
  scoreGrid,
  originalIndex,
  modifiedIndex
) {
  const isEmptyLine = line.trim() === "";
  if (isEmptyLine) return false;

  const currentScore = scoreGrid.getScore(originalIndex, modifiedIndex);
  const scoreIfAdded = scoreGrid.scoreIfAdded(originalIndex, modifiedIndex);
  return currentScore === scoreIfAdded;
}

/**
 * @param {ScoreGrid} scoreGrid
 * @param {number} originalIndex
 * @param {number} modifiedIndex
 * @returns {boolean}
 */
function isAddition(scoreGrid, originalIndex, modifiedIndex) {
  const atModifiedStart = modifiedIndex === 0;
  const atOriginalStart = originalIndex === 0;

  if (atModifiedStart) return false;
  if (atOriginalStart) return true;

  const scoreIfAdded = scoreGrid.scoreIfAdded(originalIndex, modifiedIndex);
  const scoreIfDeleted = scoreGrid.scoreIfDeleted(originalIndex, modifiedIndex);
  const shouldAdd = scoreIfAdded > scoreIfDeleted;

  return shouldAdd;
}
