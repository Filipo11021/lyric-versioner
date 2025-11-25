import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["tab", "panel"];

  connect() {
    // Show first tab by default if none active
    if (
      !this.tabTargets.some((tab) => tab.classList.contains("border-blue-500"))
    ) {
      this.showTab(this.tabTargets[0].dataset.tab);
    }
  }

  switch(event) {
    event.preventDefault();
    this.showTab(event.currentTarget.dataset.tab);
  }

  showTab(tabName) {
    this.tabTargets.forEach((tab) => {
      if (tab.dataset.tab === tabName) {
        tab.classList.add("border-blue-500", "text-blue-600");
        tab.classList.remove(
          "border-transparent",
          "text-gray-500",
          "hover:text-gray-700"
        );
      } else {
        tab.classList.remove("border-blue-500", "text-blue-600");
        tab.classList.add(
          "border-transparent",
          "text-gray-500",
          "hover:text-gray-700"
        );
      }
    });

    this.panelTargets.forEach((panel) => {
      if (panel.dataset.panel === tabName) {
        panel.classList.remove("hidden");
      } else {
        panel.classList.add("hidden");
      }
    });
  }
}


















