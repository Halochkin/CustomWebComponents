import {ChildrenChangedMixin} from "https://unpkg.com/children-changed-callback@1.1.0/src/ChildrenChangedMixin.js";
import {SizeChangedMixin} from "https://cdn.rawgit.com/orstavik/JoiComponents/master/src/SizeChangedMixin.js";

export class WcChapter
  extends ChildrenChangedMixin(HTMLElement) {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `<slot></slot>`;
    this.dispatchEvent(
      new CustomEvent("new-chapter", {composed: true, bubbles: true})
    );
  }

  getSubChapters(pos) {
    let id = "chapter" + pos.join(".");
    this.id = id;
    let result = [[pos, this.getAttribute("title")]];
    const childChapters = this.getVisibleChildren().filter(c => c instanceof WcChapter);
    for (let i = 0; i < childChapters.length; i++) {
      let child = childChapters[i];
      result = result.concat(child.getSubChapters(pos.concat([i + 1])));
    }
    return result;
  }
}

