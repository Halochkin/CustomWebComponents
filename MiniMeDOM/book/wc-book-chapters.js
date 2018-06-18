import {ChildrenChangedMixin} from "https://unpkg.com/children-changed-callback@1.1.0/src/ChildrenChangedMixin.js";
import {SizeChangedMixin} from "https://rawgit.com/orstavik/JoiComponents/master/src/SizeChangedMixin.js";

export class WcBook extends ChildrenChangedMixin(HTMLElement) {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this._newChapterListener = this.doRender.bind(this);
    this._clickListener = this.pageNavigation.bind(this);
    this._resizeListener = s =>
      this.sizeChangedCallback({
        width: window.innerWidth,
      });
  }

  connectedCallback() {
    window.addEventListener("resize", this._resizeListener);
    this.shadowRoot.innerHTML = `
    <style>
    :host{
    display: grid;
     grid-template-areas: 
        "aside" 
        "article";  
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }
  :host([size="large"]) {
    grid-template-areas: "aside article";  
    grid-template-columns: 1fr 3fr;
  }
  :host([size="small"]) {
    font-size: 4vw;
  }
  wc-index {                                                                                 
    grid-area: aside;
    background: #c2ecf9;
    cursor: default; 
  }
  article {
    grid-area: article;
    overflow-wrap: break-word;
    background: #fff1c2;
    float: left;
  }
</style>
<aside id="asides">
</aside>
<article >
  <slot></slot>
</article>
`;
    this.addEventListener("new-chapter", this._newChapterListener);
    this.shadowRoot.children[1].addEventListener("click", this._clickListener);


  }

  disconnectedCallback() {
    this.addEventListener("new-chapter", this._newChapterListener);
  }

  pageNavigation(e){
    let title = e.path[0];
  }

  getChapters() {
    const chapters = [];
    this.getVisibleChildren().filter((c) => c instanceof WcChapter).forEach((c) => {
      chapters.push(c.getChapters());
    });
    return chapters;
  }

  renderChapters(chapters) {
    for (let i of Array.from(chapters)) {
      for (let a of i) {
        for (let b of a) {
          this.appendAside(b);
        }
      }
    }
  }

  appendAside(text) {
    let a = document.createElement("li");
    a.innerText = text;
    this.shadowRoot.children[1].appendChild(a);
  }

  doRender() {
    if (this._renderChapters)
      return;
    this._renderChapters = requestAnimationFrame(() => {
      this.renderChapters(this.getChapters());
      this._renderChapters = undefined;
    });
  }

  sizeChangedCallback({width}) {
    const w =
      width > 1000 ? "large" : width > 800 ? "medium" : "small";
    document.getElementsByTagName("responsive-layout");
    this.setAttribute("size", w);
  }
}

export class WcChapter extends ChildrenChangedMixin(HTMLElement) {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `<slot></slot>`;
    this.dispatchEvent(new CustomEvent("new-chapter", {composed: true, bubbles: true}));
  }

  getChapters() {
    const childChapters = this.getVisibleChildren().filter(c => c instanceof WcChapter);
    return [[this.getAttribute("title")], childChapters.map(c => c.getChapters())];
  }
}
