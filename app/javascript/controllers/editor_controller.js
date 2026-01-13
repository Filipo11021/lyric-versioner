import { Controller } from "@hotwired/stimulus";
import { computeDiff } from "compute_diff/compute_diff";
/**
 * @typedef {import("compute_diff/create_change_history").Edit} Edit
 */

/**
 * @typedef {'eq' | 'add' | 'del' | 'mod'} EditType
 */

/**
 * @typedef {Object} LineInfo
 * @property {EditType} type
 * @property {number} deletionsAfter
 * @property {number} [deletionsBefore]
 */

/**
 * @typedef {Object} ProcessingState
 * @property {number} editIndex
 * @property {number} currentLineIndex
 */

const LINE_STYLE = {
  eq: { symbol: "\u00A0", className: "text-gray-300" },
  add: {
    symbol: "+",
    className: "text-green-500 font-bold bg-green-50/30",
  },
  mod: {
    symbol: "~",
    className: "text-yellow-600 font-bold bg-yellow-50/30",
  },
};

export default class extends Controller {
  static targets = ["input", "diffStatus"];
  static values = { originalContent: String };

  connect() {
    const originalValue = this.originalContentValue;
    this.originalContent =
      originalValue === "" ? [] : originalValue.split("\n");
    this.inputTarget.value = originalValue;

    this.updateDiffStatus();
    this.syncScroll();
  }

  updateDiffStatus() {
    const currentLines = this.getCurrentLines();
    const edits = computeDiff(this.originalContent, currentLines);
    const lineInfo = this.processEdits(edits, currentLines.length);

    this.renderDiffStatus(lineInfo);
  }

  /**
   * @returns {string[]}
   */
  getCurrentLines() {
    const value = this.inputTarget.value;
    return value === "" ? [] : value.split("\n");
  }

  /**
   * @param {Edit[]} edits
   * @param {number} totalLines
   * @returns {LineInfo[]}
   */
  processEdits(edits, totalLines) {
    const lineInfo = this.initializeLineInfo(totalLines);
    const state = { editIndex: 0, currentLineIndex: 0 };

    while (state.editIndex < edits.length) {
      const edit = edits[state.editIndex];

      if (edit.type === "del") {
        state.editIndex += this.processDeletionBlock(edits, state, lineInfo);
      } else if (edit.type === "add") {
        state.editIndex += this.processAdditionBlock(edits, state, lineInfo);
      } else {
        this.processEqualLine(state);
      }
    }

    return lineInfo;
  }

  /**
   * @param {number} totalLines
   * @returns {LineInfo[]}
   */
  initializeLineInfo(totalLines) {
    return Array.from({ length: totalLines }, () => ({
      type: "eq",
      deletionsAfter: 0,
    }));
  }

  /**
   * @param {Edit[]} edits
   * @param {ProcessingState} state
   * @param {LineInfo[]} lineInfo
   * @returns {number}
   */
  processDeletionBlock(edits, state, lineInfo) {
    const deletionCount = this.countConsecutiveEdits(
      edits,
      state.editIndex,
      "del"
    );
    const additionCount = this.countConsecutiveEdits(
      edits,
      state.editIndex + deletionCount,
      "add"
    );

    if (additionCount > 0) {
      return this.processModificationBlock(
        deletionCount,
        additionCount,
        state,
        lineInfo
      );
    }

    this.attachDeletionsToLine(lineInfo, state.currentLineIndex, deletionCount);
    return deletionCount;
  }

  /**
   * @param {Edit[]} edits
   * @param {ProcessingState} state
   * @param {LineInfo[]} lineInfo
   * @returns {number}
   */
  processAdditionBlock(edits, state, lineInfo) {
    const additionCount = this.countConsecutiveEdits(
      edits,
      state.editIndex,
      "add"
    );
    const deletionCount = this.countConsecutiveEdits(
      edits,
      state.editIndex + additionCount,
      "del"
    );

    if (deletionCount > 0) {
      const modificationCount = Math.min(additionCount, deletionCount);
      this.markLinesAsModified(
        state.currentLineIndex,
        modificationCount,
        lineInfo
      );

      const excessAdditions = additionCount - modificationCount;
      this.markLinesAsAdded(
        state.currentLineIndex + modificationCount,
        excessAdditions,
        lineInfo
      );

      const excessDeletions = deletionCount - modificationCount;
      this.attachDeletionsToLine(
        lineInfo,
        state.currentLineIndex + additionCount,
        excessDeletions
      );

      state.currentLineIndex += additionCount;
      return additionCount + deletionCount;
    }

    this.markLineAsAdded(state.currentLineIndex, lineInfo);
    state.currentLineIndex++;
    return 1;
  }

  /**
   * @param {number} deletionCount
   * @param {number} additionCount
   * @param {ProcessingState} state
   * @param {LineInfo[]} lineInfo
   * @returns {number}
   */
  processModificationBlock(deletionCount, additionCount, state, lineInfo) {
    const modificationCount = Math.min(deletionCount, additionCount);
    this.markLinesAsModified(
      state.currentLineIndex,
      modificationCount,
      lineInfo
    );

    const excessDeletions = deletionCount - modificationCount;
    this.attachDeletionsToLine(
      lineInfo,
      state.currentLineIndex + modificationCount,
      excessDeletions
    );

    state.currentLineIndex += modificationCount;
    return deletionCount + modificationCount;
  }

  /**
   * @param {ProcessingState} state
   */
  processEqualLine(state) {
    state.currentLineIndex++;
    state.editIndex++;
  }

  /**
   * @param {Edit[]} edits
   * @param {number} startIndex
   * @param {EditType} editType
   * @returns {number}
   */
  countConsecutiveEdits(edits, startIndex, editType) {
    let count = 0;
    let index = startIndex;

    while (index < edits.length && edits[index].type === editType) {
      count++;
      index++;
    }

    return count;
  }

  /**
   * @param {number} startIndex
   * @param {number} count
   * @param {LineInfo[]} lineInfo
   */
  markLinesAsModified(startIndex, count, lineInfo) {
    for (let i = 0; i < count; i++) {
      this.setLineType(startIndex + i, "mod", lineInfo);
    }
  }

  /**
   * @param {number} startIndex
   * @param {number} count
   * @param {LineInfo[]} lineInfo
   */
  markLinesAsAdded(startIndex, count, lineInfo) {
    for (let i = 0; i < count; i++) {
      this.markLineAsAdded(startIndex + i, lineInfo);
    }
  }

  /**
   * @param {number} lineIndex
   * @param {LineInfo[]} lineInfo
   */
  markLineAsAdded(lineIndex, lineInfo) {
    this.setLineType(lineIndex, "add", lineInfo);
  }

  /**
   * @param {number} lineIndex
   * @param {EditType} type
   * @param {LineInfo[]} lineInfo
   */
  setLineType(lineIndex, type, lineInfo) {
    if (lineIndex < lineInfo.length) {
      lineInfo[lineIndex].type = type;
    }
  }

  /**
   * @param {LineInfo[]} lineInfo
   * @param {number} currentLineIndex
   * @param {number} deletionCount
   */
  attachDeletionsToLine(lineInfo, currentLineIndex, deletionCount) {
    if (deletionCount === 0) return;

    const hasNoPreviousLine = currentLineIndex === 0;
    const hasNoLines = lineInfo.length === 0;

    if (hasNoPreviousLine && !hasNoLines) {
      lineInfo[0].deletionsBefore =
        (lineInfo[0].deletionsBefore || 0) + deletionCount;
    } else if (!hasNoPreviousLine) {
      lineInfo[currentLineIndex - 1].deletionsAfter += deletionCount;
    }
  }

  /**
   * @param {LineInfo[]} lineInfo
   * @returns {void}
   */
  renderDiffStatus(lineInfo) {
    this.diffStatusTarget.innerHTML = "";
    const fragment = document.createDocumentFragment();

    lineInfo.forEach((info, index) => {
      this.appendDeletionMarkerIfNeeded(fragment, info, index);
      this.appendLineElement(fragment, info, index);
      this.appendDeletionsAfterIfNeeded(fragment, info);
    });

    this.diffStatusTarget.appendChild(fragment);
  }

  /**
   * @param {DocumentFragment} fragment
   * @param {LineInfo} info
   * @param {number} lineIndex
   * @returns {void}
   */
  appendDeletionMarkerIfNeeded(fragment, info, lineIndex) {
    if (lineIndex === 0 && info.deletionsBefore > 0) {
      fragment.appendChild(this.renderDeletionMarker(info.deletionsBefore));
    }
  }

  /**
   * @param {DocumentFragment} fragment
   * @param {LineInfo} info
   * @param {number} lineIndex
   * @returns {void}
   */
  appendLineElement(fragment, info, lineIndex) {
    const lineNumber = lineIndex + 1;
    const style = LINE_STYLE[info.type];
    fragment.appendChild(
      this.renderLine(lineNumber, style.symbol, style.className)
    );
  }

  /**
   * @param {DocumentFragment} fragment
   * @param {LineInfo} info
   * @returns {void}
   */
  appendDeletionsAfterIfNeeded(fragment, info) {
    if (info.deletionsAfter > 0) {
      fragment.appendChild(this.renderDeletionMarker(info.deletionsAfter));
    }
  }

  /**
   * @param {number} number
   * @param {string} symbol
   * @param {string} className
   * @returns {HTMLElement}
   */
  renderLine(number, symbol, className) {
    const div = document.createElement("div");
    div.classList.add(
      "flex",
      "justify-between",
      "items-center",
      "h-[28px]",
      "px-1"
    );

    if (className) {
      div.classList.add(...className.split(" "));
    }

    const numberSpan = document.createElement("span");
    numberSpan.classList.add(
      "text-xs",
      "w-6",
      "text-right",
      "mr-2",
      "select-none",
      "opacity-60",
      "font-mono"
    );
    numberSpan.textContent = number.toString();

    const symbolSpan = document.createElement("span");
    symbolSpan.classList.add(
      "font-mono",
      "font-bold",
      "w-3",
      "text-center",
      "select-none"
    );
    symbolSpan.textContent = symbol;

    div.appendChild(numberSpan);
    div.appendChild(symbolSpan);

    return div;
  }

  /**
   * @param {number} count
   * @returns {HTMLElement}
   */
  renderDeletionMarker(count) {
    const div = document.createElement("div");
    div.classList.add(
      "flex",
      "justify-center",
      "items-center",
      "h-[12px]",
      "bg-red-100",
      "border-y",
      "border-red-300",
      "cursor-pointer",
      "hover:bg-red-200",
      "transition-colors"
    );

    const label = document.createElement("span");
    label.classList.add(
      "text-[10px]",
      "text-red-600",
      "font-medium",
      "select-none"
    );
    label.textContent = `−${count} line${count > 1 ? "s" : ""}`;

    div.appendChild(label);

    return div;
  }

  syncScroll() {
    this.diffStatusTarget.scrollTop = this.inputTarget.scrollTop;
  }

  onInput() {
    this.updateDiffStatus();
  }
}
