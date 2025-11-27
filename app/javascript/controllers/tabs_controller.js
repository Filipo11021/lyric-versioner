import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["tab", "panel"];

  connect() {
    const isAnyTabSelected = this.tabTargets.some(
      (tab) => tab.getAttribute("aria-selected") === "true"
    );

    if (!isAnyTabSelected) {
      const nameOfFirstTab = this.getTabName(this.tabTargets[0]);
      this.showTab(nameOfFirstTab);
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  switch(event) {
    event.preventDefault();
    this.showTab(this.getTabName(event.currentTarget));
  }

  /**
   * @param {KeyboardEvent} event
   */
  keydown(event) {
    const target = event.currentTarget;
    const index = this.tabTargets.indexOf(target);
    let newIndex = index;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        newIndex = index - 1;
        if (newIndex < 0) newIndex = this.tabTargets.length - 1;
        break;
      case "ArrowRight":
        event.preventDefault();
        newIndex = index + 1;
        if (newIndex >= this.tabTargets.length) newIndex = 0;
        break;
      default:
        return;
    }

    const newTab = this.tabTargets[newIndex];
    this.showTab(this.getTabName(newTab));
    newTab.focus();
  }

  /**
   * @param {HTMLElement} tab
   * @returns {string}
   */
  getTabName(tab) {
    return tab.dataset.tab;
  }

  /**
   * @param {string} selectedTabName
   */
  showTab(selectedTabName) {
    for (const tab of this.tabTargets) {
      const isSelected = tab.dataset.tab === selectedTabName;
      tab.setAttribute("aria-selected", isSelected);
    }

    for (const panel of this.panelTargets) {
      if (panel.dataset.panel === selectedTabName) {
        panel.classList.remove("hidden");
      } else {
        panel.classList.add("hidden");
      }
    }
  }
}
