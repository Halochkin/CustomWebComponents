 class TreeNode extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML = "<slot></slot>";
      this.shadowRoot.children[0].addEventListener("click", this.onClick.bind(this));
      this.__expectedOpen = undefined;
    }
      
    static get observedAttributes() {
      return ["open"];
    }

    closeChildren() {
      if (this.children)
        for (let child of this.children) {
          if (child.tagName === "TREE-NODE" && child.hasAttribute("open"))
            child.removeAttribute("open");
        }
    }

    openOtherChildren() {
      const parent = this.parentNode;
      // for (let child of parent.children) {
      //   if (child.tagName && child.tagName === "TREE-NODE" && !child.hasAttribute("open")) {
      //     child.setAttribute("open", "");
      //   }
      // }

      if (parent.tagName && parent.tagName === "TREE-NODE" && !parent.hasAttribute("open")) {
        parent.__expectedOpen = "";
        parent.setAttribute("open", "");
      }
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "selected") {
        if (!this.__isSetup)
        //the initial callbacks are skipped in favor of equivalent cleanup based on slotCallback
          return;
        if (newValue === this.__expectedSelect) {
          this.__expectedSelect = undefined;
          return;
        }
        this.unSelectAllOthers(this);
      }
      if (name === "open") {
        if (newValue === this.__expectedOpen) {
          this.__expectedOpen = undefined;
          return;
        }
        newValue === null ? this.closeChildren() : this.openOtherChildren();
      }
    }

    onClick(e) {
      e.stopPropagation();

      this.hasAttribute("open")
        ? this.removeAttribute("open")
        : this.setAttribute("open", "");
    }
  }

  customElements.define("tree-node", TreeNode);
