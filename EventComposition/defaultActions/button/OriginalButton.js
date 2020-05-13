import {} from "../src/joi2.js";

class OriginalButton extends HTMLElement {
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


    this._formElement = this.getForm(this);

    // this.addEventListener("click", e => e.setDefault(this._defaultAction || this._submitAction.bind(this)));

    // this._defaultAction = this._submitAction.bind(this);  //submit by default


  }

  static get observedAttributes() {
    return ["type"];
  }

  //we only observe the href attribute
  attributeChangedCallback(name, oldValue, newValue) {
    if (!name || name !== "type")
      return;

    if (newValue === "reset" && oldValue)
      this._resetAction();
    // this._defaultAction = this._resetAction();

    if ((newValue === "submit" || newValue === null) && oldValue)
      this._submitAction();
    // this._defaultAction = this._submitAction();


  }

  getForm(element) {
    // for (let element of e.composedPath()) {
    // if (element.tagName === "FORM")
    //   return element;
    let parent = element.parentNode;
    while (parent.tagName !== "FORM")
      parent = parent.parentNode;
    return parent;


  }

  _resetAction() {
    if (this._formElement)
      this._formElement.reset(); // or clear its values customary, by iterate forms children and clear its innerText value
  }

  _submitAction() {
    if (this._formElement)
      this._formElement.requestSubmit();
  }
}

customElements.define("original-button", OriginalButton);