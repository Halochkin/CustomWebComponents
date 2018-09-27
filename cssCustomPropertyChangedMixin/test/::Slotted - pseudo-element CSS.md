# ::slotted() pseudo-element
The :slotted() CSS pseudo-element represents any element that has been placed into a slot inside an HTML template.This only works when used inside CSS placed within a shadow DOM.

Despite the fact that the speed with which the elements of the slot is almost instantaneous-the human eye
does not perceive the moment of applying the style to the slot element and therefore it seems that the 
style was applied from the beginning. To better understand, let's look at an example in which we 
will consider how to use the pseudo-element `::slotted` and the result of their application.
### Selectors
1. `::slotted(*)` - application to all slotted elements
2. `::slotted(h1)` - application to slotted elements with a specific tagname
3. `::slotted(b[slot="title"])` - application to slotted elements with a specific tagname and attribute
4. `::slotted(list-item[someattribute="somevalue"])` - you can also use custom attributes
5. `::slotted(list-item[slot="item"][ id="someid"])` - or multiple attributes
6.  `::slotted(list-item[id="first"]:hover)` - it is also possible to assist with other pseudo-elements

### Example
This example demonstrates how to apply selectors to a pseudo-element :slotted and also demonstrates the result of applying them.
```html
<button>Slot new items and test the ::slotted pseudo attribute</button>           [1]
<shopping-list>
    <b slot="title"> slotted Title</b>
    <list-item id="first" slot="item">tennis socks;</list-item>                   [2]
    <list-item someattribute="somevalue" slot="item">tennis rocket;</list-item>
    <list-item id="third" slot="item">tennis balls.</list-item>
    <a>Milk</a>                                                                   [3]
    <a>Bread</a>
    <a>Cheese</a>
</shopping-list>
```

```javascript
class ShoppingList extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: "open"});                                          [4]
      this.shadowRoot.innerHTML = `
<style>
    :host {
        display: grid;
        background-color: #abdaeb;
        font-size: 30px;
    }
    slot[name="item"] {                                                           [5]
        display: grid;
    }
    ::slotted(*){
    color: black;
    }
    ::slotted(b[slot="title"]){                                                   [5a]
          color: blue;
    } 
    ::slotted(b[slot="title"]:hover){                                             [5b]
          color: red;
    }
    ::slotted(list-item[id="first"]){                                             [5c]
        color: gold;
    }
    ::slotted(list-item[someattribute="somevalue"]){                              [5d]
        color: #ff3d31;
    }
    ::slotted(list-item[slot="item"][ id="third"]){                               [5e]
        color: #19f710;
    }
</style>
<h1>Not slotted Title <slot name="title"></slot></h1>
<slot id="items"></slot>`;
      this.slotted = e => this.slottedFunc();
    }

    connectedCallback() {
      document.querySelector("button").addEventListener("click", this.slotted)
    }

    slottedFunc() {
      this.shadowRoot.getElementById("items").setAttribute("name", "item");       [6]
    }
  }
   class ListItem extends HTMLElement {
    constructor() {
      super();
    }
  }
  customElements.define("shopping-list", ShoppingList);
  customElements.define("list-item", ListItem);
```
1. Add a button that allows to slot the elements.
2. In the `<list-item>` block we will add various attributes that will be used as selectors.
3. Add the values that will be added by default.
4. Remember that `::slotted()` works when used inside CSS placed within a shadow DOM.
5. A variety of applications of selectors.
6. A function that is activated by pressing the button and activates the slot for the elements.
### Try it on [Codepen.io](https://codepen.io/Halochkin/pen/QVovwK?editors=0010)

### References 
1. [MDN `::Slotted()`](https://developer.mozilla.org/en-US/docs/Web/CSS/::slotted);
2. [W3C `Selecting Slot-Assigned Content: the ::slotted() pseudo-element`](https://drafts.csswg.org/css-scoping/#slotted-pseudo)

