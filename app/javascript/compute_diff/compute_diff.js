import { calculateSimilarityTable } from "compute_diff/calculate_similarity_table";
import { createChangeHistory } from "compute_diff/create_change_history";
/**
 * @typedef {import("compute_diff/create_change_history").Edit} Edit
 */

/**
 * @param {string[]} originalLines
 * @param {string[]} modifiedLines
 * @returns {Edit[]}
 */
export function computeDiff(originalLines, modifiedLines) {
  const scoreGrid = calculateSimilarityTable(originalLines, modifiedLines);

  return createChangeHistory(scoreGrid, originalLines, modifiedLines);
}
