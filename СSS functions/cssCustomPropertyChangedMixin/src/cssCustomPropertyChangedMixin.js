const ChildrenList = Symbol("childrenList");
const styleChanged = Symbol("styleChangedFunction");
const mutationObserver = Symbol("mautationObserv");
const NewStyleArray = Symbol("NewstyleArray");
const OldNewStyleArray = Symbol("oldNewstyleArray");

function getChildren(parent, attributes) {
  for (let i = 0; i < attributes.length; i++) {
    window.requestAnimationFrame(parent.propertyList);
  }
}

function arrayEquals(a, b) {
  return b && a && a.length === b.length && a.every((v, i) => v === b[i]);
}

//  cssCustomPropertyChangedMixin provides  styleChangedCallback(name, newValue, oldValue) which is called every
// time custom CSS properties are changed.
// To start tracking the necessary properties, specify them in the function  observedStyleProperties()
//                         static get observedStyleProperties() {
//                         return ["--custom-prop1", "--custom-prop2" ....]
//                         }
// The styleChangedCallback returns the following arguments:
//                         name: The name of the modified parameter;
//                         newValue: actual value;
//                         oldValue: previous value.
//
// If you change several tracked properties at the same time, two separate `styleChangedCallbacks` will be produced.
// One for each changed parameter.
// In the case if the new value of the property is equal to the previous one - `styleChangedCallbacks`, will not be called.

 // @param Base class that extends HTMLElement
 // @returns {cssCustomPropertyChangedMixin} class that extends HTMLElement

export const cssCustomPropertyChangedMixin = function (Base) {
  return class extends Base {

    constructor() {
      super();
      this[NewStyleArray] = [];
      this[OldNewStyleArray] = [];
      this[ChildrenList] = [];
      this.propertyList = this._getPropertyValue.bind(this, this.constructor.observedStyleProperties);
    }

    _getPropertyValue(attributes) {
      if (this[OldNewStyleArray].length >= attributes.length)
        return;
      for (let attr of attributes) {
        let style = getComputedStyle(this).getPropertyValue(attr);
        this[OldNewStyleArray].push([attr, style]);
      }
    }

    connectedCallback() {
      if (super.connectedCallback) super.connectedCallback();
      this[mutationObserver]();
      this[ChildrenList] = getChildren(this, this.constructor.observedStyleProperties);
    }
    disconnectedCallback(){
      if (super.disconnectedCallback) super.disconnectedCallback();
    }

    [mutationObserver](e) {
      let observer = new MutationObserver(() => this[styleChanged]());
      observer.observe(this, {attributes: true});
    }

    [styleChanged]() {
      let attributeArr = this.constructor.observedStyleProperties;
      if (!attributeArr)
        return;
      for (let i = 0; i < attributeArr.length; i++) {
        let style = getComputedStyle(this).getPropertyValue(attributeArr[i]);
        this[NewStyleArray].push([attributeArr[i], style]);
        if (arrayEquals(this[NewStyleArray][i], this[OldNewStyleArray][i])){
          this.clearStyle();
          return
        }
        this.styleChangedCallback && this.styleChangedCallback(this[OldNewStyleArray][i][0], this[NewStyleArray][i][1], this[OldNewStyleArray][i][1]);
      }
      this.clearStyle();
    }

    clearStyle() {
      this[OldNewStyleArray] = this[NewStyleArray];
      this[NewStyleArray] = [];
    }
  }
};
