# How to style slot.childNodes?

There are two main methods to stylize a slot element:
1. Regular css rules;
2. `:slotted()` CSS pseudo-element.

//They both can be used, but it is worth paying attention to their features and priorities of their combined application.

Let's consider their application on the example of a slotted span-element.

###  Regular CSS rules
A CSS rule-set consists of a selector and a declaration block: The selector points to the HTML element you want to style. <br>
Feature of regular CSS rules that they have a higher priority when using in the innerHTML.
#### Example 1
```javascript
 class Inner extends HTMLElement {
    constructor(){
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML= `
  <style>
       span { 
        color: blue;
        font-weight: bold;
        border-bottom: 5px solid lightblue; 
       }
 </style>
 <slot><span>inner fallback title</span></slot>`;
    }
  }
```
```html
<style> 
span { 
    color: green;
    font-weight: italic;
    border-top: 5px solid lightgreen; 
  }
</style>
1: inner empty <inner-el></inner-el>
2: inner with span <inner-el><span> top span</span></inner-el>
3: inner with slot-span <inner-el><slot><span> top slot span</span></slot></inner-el>
```
##### Results:
1: The blue "inner fallback title" text with lightblue border-bottom. Because innerHTML style has the highest priority;<br>
2:,3: The green text with lightgrent border-top. Because they both have a <span> as a child and the style from innerHTML does not apply to the children of the element. And therefore was applied the style with a DOM.

#### Example 1.2
Consider an example in which a new class uses an existing class as part of `innerHTML`. The style would stay the same.
```javascript
 class MiddleMom extends HTMLElement {
    constructor(){
      ...
      this.shadowRoot.innerHTML= `
  <style>
        span { 
          color: pink;
          font-style: italic;
          border-left: 5px solid pink; 
        }
 </style>
 <inner-el><slot></slot></inner-el>`;
    }
  }
```
```html
4: gentlemom empty: <middle-mom></middle-mom>
5: gentlemom with span: <middle-mom><span> top span</span></middle-mom>
6: gentlemom top slot-span: <middle-mom><slot><span> top slot span</span></slot></middle-mom>
```
##### Results:
4: Empty string. Because it does not have a span element and the text inside to which the style can be applied;<br>
5:,6: The same as in previous example.

#### Example 1.3
Let's change the previous example and add a span element inside the slot in innerHTML
```javascript 
 class MiddlePap extends HTMLElement {
    constructor(){
      ...
      this.shadowRoot.innerHTML= `
  <style>
        span { 
          color: violet;
          font-style: italic;
          border-right: 5px solid darkblue; 
        }
 </style>
 <inner-el><slot><span> middle fallback title .</span></slot></inner-el>
    }
  }
```
```html
7: gentlepap empty: <middle-pap></middle-pap>
8: gentlepap with span: <middle-pap><span> top span</span></middle-pap>
9: gentlepap top slot-span: <middle-pap><slot><span> top slot span</span></slot></middle-pap>
```
##### Results:
7: The "middle fallback title ." text with style from innerHTML. Because it is both `span` and `style` elements in the innerHTML and the selector matches the element. According to this principle, 1 element is stylized. 
8:,9: The same as in example 1.1.

### Conclusion the use of regular CSS rules.
Regular CSS rules apply directly to an element depending on its scope. You cannot directly style an element that is in the shadowDOM from the lightDOM and vice versa. 
*** 
### :slotted() CSS pseudo-element
The :slotted() CSS pseudo-element represents any element that has been placed into a slot inside an HTML template.This only works when used inside CSS placed within a shadow DOM.

Despite the fact that the speed with which the elements of the slot is almost instantaneous-the human eye
does not perceive the moment of applying the style to the slot element and therefore it seems that the 
style was applied from the beginning.
#### Selectors of the ::slotted(...) pseudo-element
In the parameters of the pseudo-element there should be a selector that indicates which nodes should be selected, the following are the options that can be used as a selector

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

