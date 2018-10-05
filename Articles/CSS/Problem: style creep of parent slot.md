# Problem: style creep of parent slot.

In the previous [article](https://github.com/Halochkin/Components/blob/master/Articles/CSS/How%20to%20style%20slot.childNodes%3F.md) we
described the ways of styling `slot.childNodes`. This article describes the problem of unwanted styles (creep) that come from somewhere you 
don't expect.


#### 1. `dispalay: block`
Adding this parameter inside shadowRoot causes the style to be applied to all elements that match the selector outside of shadowRoot.<br>
This effect will apply even to other classes that use this class in shadowDOM. It is worth noting that this effect is applied only to non-inherited parameters. It is most noticeable when you use the general selector `(*)` independently regular CSS or:: slotted

Let's look at an example:

     
```javascript
 class Inner extends HTMLElement {
    constructor(){
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML= `
  <style>
       span, slot { 
        dispay: block;
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
### Expectation 
1: The blue "inner fallback title" text with lightblue border-bottom. Because the element is in the shadowRoot and styled directly from the innerHTML; <br>
2:,3: The green default text with lightgreen top border. Because they both have a as a child and the style from innerHTML does not apply to the children of the element. And therefore was applied the style with a DOM.
### Reality 
1: Will have a double border bottom (One for the slot element that reserves space, and the second directly for the span element that is slotted.)<br>
2:,3: Will have both lightblue border bottom and lightgreen top border despite the fact that should have only top border.<br>
### What is the reason?
The reason is that the `display: block` increases the style scope from shadowDOM to lightDOM. 

