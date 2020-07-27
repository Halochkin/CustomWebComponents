/*
* Having the element declare statically which element it wishes to add to events of a particular type, and then have a unified algorithm
* for choosing the defaultAction combination, makes it much simpler to look at the dom and see which defaultActions will occur for whoch events
* (essentially look at the dom at repeat the declarative designation and resolution of the defaultActions).

* If the rules for adding default actions inside the web component can be made much more of this, then that,
* but not if so, then this again, and btw check this server resource first while you are at it, things become messy, fast.
* Also, a declarative approach ensures sync processing, which an imperative approach doesn't. If there were imperative functions,
* then developers might mistakenly try to use microtasks and macrotasks before adding the defaultAction, which wouldn't work.
*
2. A declarative approach is safer to implement. It doesn't care about the event phase.
3. A declarative approach can be put into a static getter, like static get observedAttributes().
4. Sidenote: the pattern in the native elements of assigning the defaultAction to the details, not summary, and the select, not option, is wrong.
* This kind of assignment require very complex parsing of the event path. Instead, the summary/option element should find the
* relevant HelicopterParent details/select in the ensuing path when it searches for the function. Fixing this design bug in the browser
* cleares up a whole big mess in the assignment of defaultActions.

*
* When we check for HelicopterParentChild relationships when we assign default actions, we start with the child, and then the child is the entry point,
* and the parent the exit point. Which should enable us to form this as querySelectors:
*
Select > option
Select > optgroup > option
But not "select option".
*
The querySelector would be written in the reverse order parent to child, to make it echo the css/js syntax.
* And then the question remains to be seen if the defaultAction should not be associated with the parent, and not the child again..
* Hm.. Doesn't matter much, but if we associate with the parent, then we have the same structure as the platform.
* */

class Alink extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = `
    <style>
    :host([href]) slot{
    color: blue;
    }
    </style>
    <span><slot></slot></span>`;
    this.shadowRoot.children[1].firstChild.addEventListener("click", e => e.setDefault(this._onClick.bind(this)));
    this._innerSpan = this.shadowRoot.children[1];
    this._innerSlot = this._innerSpan.firstChild;
    this.newHref = undefined;
  }

  _onClick(e) {
    if (this.newHref)
      location.href = this.newHref;
  }

  static get observedAttributes() {
    return ["href"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.newHref = newValue;
  }
}

customElements.define("a-link", Alink);


function customLink() {
  const aLink = document.createElement("a-link");
  aLink.setAttribute("href", "#hash");
  aLink.innerText = "Click me";
  // const innerSpan = aLink.shadowRoot.children[1];
  // const innerSlot = innerSpan.firstChild;

  document.body.appendChild(aLink)

  const usecase = [
    aLink._innerSlot, [
      aLink._innerSpan,
      [aLink]
    ]
  ]


  Object.freeze(usecase, true);
  return usecase;
}

export const useCasesSetDefault = {

  customLink

};
Object.freeze(useCasesSetDefault, true);