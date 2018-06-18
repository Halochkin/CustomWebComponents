import {ChildrenChangedMixin} from "https://unpkg.com/children-changed-callback@1.1.0/src/ChildrenChangedMixin.js";
import {SizeChangedMixin} from "https://cdn.rawgit.com/orstavik/JoiComponents/master/src/SizeChangedMixin.js";
import {WcChapter} from "./WcBookChapter.js";

export class WcBook extends SizeChangedMixin(ChildrenChangedMixin(HTMLElement)) {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.render();
    this._newChapterListener = this.doRender.bind(this);
    this._menuListener = this.smallMenu.bind(this);
    this._navigation = this.navigation.bind(this);
    this._dropMenu = this.dropMenu.bind(this);
    this._switchChapter = this.switchChapter.bind(this);
  }

  render() {
    this.innerHTML = `
    <wc-chapter  title="Web components basics">
        <wc-chapter title="Pattern: CreateElement">Pattern1_CreateElement</wc-chapter>
        <wc-chapter title="Pattern: Create a shadowDom">Pattern2_shadowDom</wc-chapter>
        <wc-chapter title="Pattern: attributeChangedCallback">Pattern4_AttributeReaction</wc-chapter>
    </wc-chapter>
    <wc-chapter title="Isolated Functional mixins and life cycle hooks">
        <wc-chapter title="Discussion IsolatedFunctionalMixin">Discussion_IsolatedFunctionalMixin</wc-chapter>
        <wc-chapter title="Mixin1 ChildrenChangedMixin">Mixin1_ChildrenChangedMixin</wc-chapter>
        <wc-chapter title="Mixin2 SizeChangedMixin">Mixin2_SizeChangedMixin</wc-chapter>
        <wc-chapter title="Mixin4 FirstConnectedMixin">Mixin4_FirstConnectedMixin</wc-chapter>
        <wc-chapter title="Mixin5 EnterViewMixin">Mixin5_EnterViewMixin</wc-chapter>
        <wc-chapter title="Pattern1 ReactiveMethod">Pattern1_ReactiveMethod</wc-chapter>
        <wc-chapter title="Pattern2 FunctionalMixin">Pattern2_FunctionalMixin</wc-chapter>
    </wc-chapter>
    <wc-chapter title="ComposedEvents and Gestures in JS">
        <wc-chapter title="Mixin1 DragFlingGesture">Mixin1_DragFlingGesture</wc-chapter>
        <wc-chapter title="Mixin2 FlingEventMixin">Mixin2_FlingEventMixin</wc-chapter>
        <wc-chapter title="Mixin3 PinchGesture">Mixin3_PinchGesture</wc-chapter>
        <wc-chapter title="Pattern1 ComposedEvents">Pattern1_ComposedEvents</wc-chapter>
        <wc-chapter title="Pattern2 InvadeAndRetreat">Pattern2_InvadeAndRetreat</wc-chapter>
        <wc-chapter title="Problem conflicting gestures">Problem_conflicting_gestures</wc-chapter>
    </wc-chapter>
    <wc-chapter title="Patterns for HTML Composition">
        <wc-chapter title="Intro HTML-Lists">Intro_HTML-Lists</wc-chapter>
        <wc-chapter title="Pattern1 FosterParentChild">Pattern1_FosterParentChild</wc-chapter>
        <wc-chapter title="Pattern2 HelicopterParentChild">Pattern2_HelicopterParentChild</wc-chapter>
        <!--<wc-chapter title="Pattern3 CulDeSacElements">Pattern3_CulDeSacElements</wc-chapter>-->
        <wc-chapter title="Pattern4 MiniMe">Pattern4_MiniMe</wc-chapter>
    </wc-chapter>
    <wc-chapter title="Style">
        <wc-chapter title="Discussion mediaqueries pseudoelements">Discussion_mediaqueries_pseudoelements</wc-chapter>
        <wc-chapter title="Intro Style in web comps">Intro_Style_in_web_comps</wc-chapter>
        <wc-chapter title="Pattern1 this style rocks">Pattern1_this_style_is_not_my_style</wc-chapter>
        <wc-chapter title="Pattern2 host with style">Pattern2_host_with_style</wc-chapter>
        <wc-chapter title="Pattern3 css variables">Pattern3_css_variables</wc-chapter>
        <wc-chapter title="Pattern4 css pseudo elements">Pattern4_css_pseudo_elements</wc-chapter>
        <wc-chapter title="Pattern5 ResponsiveLayout ">Pattern5_ResponsiveLayout</wc-chapter>
    </wc-chapter>
    <wc-chapter title="How to polyfill web components?">
        <wc-chapter title="Discussion sync vs async polyfilling">Discussion_sync_vs_async_polyfilling</wc-chapter>
        <wc-chapter title="Intro Polyfills">Intro_Polyfills</wc-chapter>
        <wc-chapter title="Pattern1 FeatureDetection">Pattern1_FeatureDetection</wc-chapter>
        <wc-chapter title="Pattern2 LoadScript title">Pattern2_LoadScript</wc-chapter>
        <wc-chapter title="Pattern3 FeatureDetectAndPolyfill">Pattern3_FeatureDetectAndPolyfill</wc-chapter>
        <wc-chapter title="Pattern4 BatchCustomElementUpgrades">Pattern4_BatchCustomElementUpgrades</wc-chapter>
        <wc-chapter title="Pattern5 QueAndRecallFunctions">Pattern5_QueAndRecallFunctions</wc-chapter>
        <wc-chapter title="Pattern6 FeatureDetectAndPolyfillAsync">Pattern6_FeatureDetectAndPolyfillAsync</wc-chapter>
    </wc-chapter>
`
  }


  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.innerHTML = `
<style></style>
<header id="header">
<a id="titles">The native web components cookbook</a>
    <div id="menubtn" >
      <div class="icon"></div>
      <div class="icon"></div>
      <div class="icon"></div>
    </div>
</header>
<div id="navigation"></div>
  <book-menu>
    Index
  </book-menu>
  <article>
    <slot></slot>
  </article>
  <link href="style.css" rel="stylesheet">
`;
    this.shadowRoot.children[3].addEventListener("click", this._switchChapter);
    this.addEventListener("new-chapter", this._newChapterListener);
    this.shadowRoot.children[3].addEventListener("click", this._navigation);
    setTimeout(() => this.doRender(), 10);
    setTimeout(() => this.letLinks(), 20);
    setTimeout(() => this.clearInner(), 30);
    setTimeout(() => this.loadContent(1), 40);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.shadowRoot.children[3].removeEventListener("click", this._switchChapter);
    this.removeEventListener("new-chapter", this._newChapterListener);
    this.shadowRoot.children[3].removeEventListener("click", this._navigation);
  }

  // clear default innerHTML
  clearInner() {
    for (let a of this.children) {
      for (let b of a.children) {
        b.innerHTML = "";
      }
    }
  }

  clearPrevious(prev) {
    for (let a of this.children[prev].children) {
      a.innerHTML = "";
    }
  }

//let subchapters links
  letLinks() {
    let chapters = this.children;
    this.link = [];
    for (let i of chapters) {
      let link1 = [];
      this.link.push(link1);
      for (let a of i.children) {
        link1.push(a.innerText);
      }
    }
    return this.link;
  }


  switchChapter(e) {
    if (this.shadowRoot.activeElement.className === "subchapter")
      return;
    this.prevchose = [];
    let prev = this.i || 1;
    this.clearPrevious(prev - 1);  //clear previous chapter after choosing new chapter
    this.i = parseInt(this.shadowRoot.activeElement.hash.slice(-1));
    this.prevchose.push(this.i, prev);
    if (this.prevchose[0] !== this.prevchose[1]) {
      this.shadowRoot.children[3].children[this.prevchose[0] - 1].setAttribute("active", "");
      this.shadowRoot.children[3].children[this.prevchose[1] - 1].removeAttribute("active");
    }
    this.loadContent(this.i);  //load new chapter
  }


  loadContent(num) {
    let subchapterslink = this.link[num - 1];
    for (let b = 0; b < subchapterslink.length; b++) {
      this.children[num - 1].children[b].innerHTML = `<mark-down src="https://raw.githubusercontent.com/orstavik/JoiComponents/master/book/${this.children[num - 1].id}/${subchapterslink[b]}.md" ></mark-down>`
    }
  }

//delete previous chapter from viewport
  clearPrevious(prev) {
    for (let a of this.children[prev].children) {
      a.innerHTML = "";
    }
  }

  sizeChangedCallback({width}) {
    const w = width > 1000 ? "large" : "small";
    this.setAttribute("size", w);
    this.style.display = "grid";
    w === "small" ? this.setViewSmall() : this.setViewLarge();
  }

  setViewSmall() {
    this.shadowRoot.children[1].children[1].addEventListener("click", this._dropMenu);
    this.shadowRoot.children[1].children[1].style.display = "block";
    this.shadowRoot.children[3].addEventListener("click", this._menuListener);
    this.shadowRoot.children[3].addEventListener("click", this._navigation);
  }

  setViewLarge() {
    this.shadowRoot.children[1].children[1].removeEventListener("click", this._dropMenu);
    this.shadowRoot.children[1].children[1].style.display = "none";
    this.shadowRoot.children[3].removeEventListener("click", this._menuListener);
    this.shadowRoot.children[3].style.display = "block";
  }

  smallMenu() {
    if (this.shadowRoot.activeElement.className === "mainchapter")
      return;
    this.shadowRoot.children[3].style.display = this.shadowRoot.children[3].style.display === "block" ? "none" : "block";
  }

  dropMenu() {
    this.shadowRoot.children[3].style.display = this.shadowRoot.children[3].style.display === "block" ? "none" : "block";
  }


  navigation() {
    let chapters = this.getMainChapters();
    let chapt = this.shadowRoot.activeElement.innerText;
    for (let one of chapters) {
      let chapter = parseInt(chapt);
      let a = one[0][0];
      if (chapter === a && one[0].length === 1) {
        return this.shadowRoot.children[2].innerHTML = `<a>Chapter ${chapter}: ${one[1]} > ${chapt}</a>`
      }
      if (isNaN(chapter)) {
        return this.shadowRoot.children[2].innerHTML = `<a></a>`
      }
    }

  }

  getMainChapters() {
    let result = [];
    let chapters = this.getVisibleChildren().filter((c) => c instanceof WcChapter);
    for (let i = 0; i < chapters.length; i++) {
      let c = chapters[i];
      result = result.concat(c.getSubChapters([i + 1]));
    }
    return result;
  }

  doRender() {
    if (this._renderChapters)
      return;
    this._renderChapters = requestAnimationFrame(() => {
      this.shadowRoot.children[3].appendChildren(this.getMainChapters());
      this._renderChapters = undefined;
    });
  }
}

customElements.define("wc-book", WcBook);
customElements.define("wc-chapter", WcChapter);





