import {} from "../src/joi2.js";

class UpdatedButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = `
<style>
  /*the selectors must target the slot, so that they will not be overridden by other selectors on the host node*/
  :host([href]) slot { 
    color: blue; 
    text-decoration: underline; 
    text-decoration-color: blue;
  }

  :host(:focus) { 
    border: 1px solid orange; 
  }
  
  div{
    display: inline-block;
    background-color: rgb(240, 240, 240);
    border: 1px solid #a4a3a3;
    font: 400 13.3333px Arial;
    padding: 2px 6px;
    }
    
  div:hover{
     border: 1px solid  gray;
  }
  
</style>

 <div>
  <span>
   <slot></slot>
  </span>
 </div>`;//the span added here is to allow the shadowDOM to contain a tabindex value itself.

  }

  static get observedAttributes() {
    return ["type"];
  }

  //we only observe the href attribute
  attributeChangedCallback(name, oldValue, newValue) {
    if (!name || name !== "type")
      return;
    if (newValue === "reset")
      this.addEventListener("click", e => e.setDefault(e => this._resetAction(e)));
    else if (newValue === "submit")
      this.addEventListener("click", e => e.setDefault(e => this._submitAction(e)));
  }

  getForm(e) {
    for (let element of e.composedPath()) {
      if (element.tagName === "FORM")
        return element;
    }
  }

  _resetAction(e) {
    const resetEvent = new Event("reset", {composed: true, bubbles: true});
    this.dispatchEvent(resetEvent);
    if (resetEvent.defaultPrevented)
      return;
    const form = this.getForm(e);
    if (form)
      form.reset(); // or clear its values customary, by iterate forms children and clear its innerText value
  }

  _submitAction(e) {
    const submitEvent = new Event("submit", {composed: true, bubbles: true});
    this.dispatchEvent(submitEvent);
    if (submitEvent.defaultPrevented)
      return;
    const form = this.getForm(e);
    if (form)
      form.requestSubmit();
  }
}

customElements.define("updated-button", UpdatedButton);