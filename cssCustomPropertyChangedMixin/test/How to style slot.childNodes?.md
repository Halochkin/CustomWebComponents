# How to style slot.childNodes?

There are two main methods to stylize a slot element:
1. Regular css rules;
2. `:slotted()` CSS pseudo-element.

//They both can be used, but it is worth paying attention to their features and priorities of their combined application.

Let's consider their application on the example of a slotted span-element.

## 1. Regular CSS rules
A CSS rule-set consists of a selector and a declaration block: The selector points to the HTML element you want to style. <br>
Feature of regular CSS rules that they have a higher priority when using in the innerHTML.
### Example 1.1
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
### Results:
1: The blue "inner fallback title" text with lightblue border-bottom. Because the element is in the shadowRoot and styled directly from the innerHTML;<br>
2:,3: The green default text with lightgreen top border. Because they both have a <span> as a child and the style from innerHTML does not apply to the children of the element. And therefore was applied the style with a DOM.

### Example 1.2
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
<style>...</style>
4: gentlemom empty: <middle-mom></middle-mom>
5: gentlemom with span: <middle-mom><span> top span</span></middle-mom>
6: gentlemom top slot-span: <middle-mom><slot><span> top slot span</span></slot></middle-mom>
```
#### Results:
4: Empty string. Because it does not have a span element and the text inside to which the style can be applied;<br>
5:,6: The same as in previous example.

### Example 1.3
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
<style>...</style>
7: gentlepap empty: <middle-pap></middle-pap>
8: gentlepap with span: <middle-pap><span> top span</span></middle-pap>
9: gentlepap top slot-span: <middle-pap><slot><span> top slot span</span></slot></middle-pap>
```
##### Results:
7: The "middle fallback title ." text with style from innerHTML (violet color and darkblue left border). Because it is both `span` and `style` elements in the innerHTML and the selector matches the element. According to this principle, 1 element is stylized.<br>
8:,9: The same as in example 1.1.

### Summary of usage regular CSS rules.
Regular CSS rules apply directly to an element depending on its scope. You cannot directly style an element that is in the shadowDOM from the lightDOM and vice versa. 
*** 
## 2. ::slotted() CSS pseudo-element
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

We use the previous examples, but instead of regular CSS rules we use `::slotted(*)`.
### Example 2.1
```javascript
 class Inner extends HTMLElement {
    constructor(){
      ...
      this.shadowRoot.innerHTML= `
  <style>
       ::slotted(*) { 
        color: brown;
        font-weight: bold;
        border-bottom: 5px solid yellow; 
       }
 </style>
 <slot><span>inner fallback title</span></slot>`;
    }
  }
```
```html
<style> 
 ::slotted(*) { 
    color: yellow;
    font-weight: italic;
    border-top: 5px solid yellow; 
  }
</style>
1: inner empty <inner-el></inner-el>
2: inner with span <inner-el><span> top span</span></inner-el>
3: inner with slot-span <inner-el><slot><span> top slot span</span></slot></inner-el>
```
##### Results:
Now the result looks different<br>
1: Uncolored "inner fallback title". Because the custom element does not have a placed `span` element as a child. <br>
2: The brown default text with yellow border-bottom. Because the custom element has a `span` element as a child that is slotted and applied to it style from innerHTML<br>
3: The brown default text without yellow border-bottom. This is due to the fact that there are a number of properties that automatically borrow the values of the corresponding property of its parent. Such as a `color`. This means that the pseudo-selector has assigned a color to the slot element, and span is its child and inherits the color value. It is important to note that such parameters as: border, background are not inherited.<br>

### Example 2.2
Consider the second example which very similar to 1.2. Outer style the same.
```javascript
 class MiddleMom extends HTMLElement {
    constructor(){
      ...
      this.shadowRoot.innerHTML= `
  <style>
       ::slotted(*) { 
        color: red;
        font-style: bold;
        border-left: 5px solid red; 
       }
 </style>
 <inner-el><slot></slot></inner-el>`;
    }
  }
```
```html
<style>...</style>
4: gentlemom empty: <middle-mom></middle-mom>
5: gentlemom with span: <middle-mom><span> top span</span></middle-mom>
6: gentlemom top slot-span: <middle-mom><slot><span> top slot span</span></slot></middle-mom>
```
#### Results:
Now we have:<br>
4: Empty. Because `middle-mom` has no any children or text inside<br>
5: The red text with yellow bottom border and red left border. This is because the element has a span as a child, which is sorted in Inner class and at first he used brown color as the bottom border and yellow and then sotiritsa back. This happens because the element has a lot inside the innerHTML. After the element is slotted for the second time, it is assigned a color - red and a red left border is added<br>
6: Just a red text. The reason for the lack of a border is that the element has a slot like a child that has a span like a child, and when you slot the style is applied to the slot element rather than to its child that inherits the color value <br>
### Example 2.3 
Consider the third example, in which inside inner-el there is a slot element having span as a child. The same as example 1.3.
```javascript
 class MiddleMom extends HTMLElement {
    constructor(){
      ...
      this.shadowRoot.innerHTML= `
  <style>
       ::slotted(*) { 
        color: orange;
        font-style: bold;
        border-left: 5px solid orange; 
       }
 </style>
<inner-el><slot><span> middle fallback title .</span></slot></inner-el>`;
    }
  }
```
```html
<style>...</style>
7: gentlepap empty: <middle-mom></middle-mom>
8: gentlepap with span: <middle-mom><span> top span</span></middle-mom>
9: gentlepap top slot-span: <middle-mom><slot><span> top slot span</span></slot></middle-mom>
```
#### Results:
7: Now the element contain "middle fallback title ." without style. Еhe element just use text from innerHTML and it is not slotted, so the style does not apply to it<br>
6:,7: The same as in previous example.

### Summary of usage ::slotted() CSS pseudo-element
 ::slotted() works only on the "top" assigned nodes. You can't use ::slotted to target slotted descendants, meaning that styling non-inheritable css properties (background and border) is impossible for the inner layer.
 ***
 ## Combined use of regular CSS rules and ::slotted() CSS pseudo-element
 So we got to the most interesting. Due to the fact that regular CSS rules has the highest priority than ::slotted() let's look at some examples:
### Example 3.1
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
        ::slotted(*) { 
        color: yellow;
        font-weight: bold;
        border-bottom: 5px solid yellow; 
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
 ::slotted(*) { 
    color: brown;
    font-weight: italic;
    border-top: 5px solid yellow; 
  }
</style>
1: inner empty <inner-el></inner-el>
2: inner with span <inner-el><span> top span</span></inner-el>
3: inner with slot-span <inner-el><slot><span> top slot span</span></slot></inner-el>
```
### Results:
1: The blue "inner fallback title" text with lightblue border-bottom.<br>
2: Green text with both green top border and yellow bottom border<br>
3: The green text with lightgreen top border.<br>
### Example 3.2
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
       ::slotted(*) { 
        color: red;
        font-style: bold;
        border-left: 5px solid red; 
       }
 </style>
 <inner-el><slot></slot></inner-el>`;
    }
  }
```
```html
<style>...</style>
4: gentlemom empty: <middle-mom></middle-mom>
5: gentlemom with span: <middle-mom><span> top span</span></middle-mom>
6: gentlemom top slot-span: <middle-mom><slot><span> top slot span</span></slot></middle-mom>
```
#### Results:
4: Empty<br>
5: Green text with yellow bottom border, lightgreen and red left border<br>
6: Green  text with only lightgreen top border.
### Example 3.3
```javascript
 class MiddleMom extends HTMLElement {
    constructor(){
      ...
      this.shadowRoot.innerHTML= `
  <style>
       span { 
          color: violet;
          font-style: italic;
          border-right: 5px solid darkblue; 
        }
       ::slotted(*) { 
        color: orange;
        font-style: bold;
        border-left: 5px solid orange; 
       }
 </style>
<inner-el><slot><span> middle fallback title .</span></slot></inner-el>`;
    }
  }
```
```html
<style>...</style>
7: gentlepap empty: <middle-mom></middle-mom>
8: gentlepap with span: <middle-mom><span> top span</span></middle-mom>
9: gentlepap top slot-span: <middle-mom><slot><span> top slot span</span></slot></middle-mom>
```
#### Results:
7: The "middle fallback title ." text with style from innerHTML (violet color and darkblue left border).<br>
8: The green text with lightgreen top, yellow bottom and orange yellow borders.<br>
9: The green default text with lightgreen top border.<br>
This combination of borders is possible because the element fits several selectors, and each assigns its own value to the border.
#### Try the demo on [Codepen](https://codepen.io/Halochkin/pen/oagZYa?editors=1000);

### References 
1. [MDN `::Slotted()`](https://developer.mozilla.org/en-US/docs/Web/CSS/::slotted);
2. [W3C `Selecting Slot-Assigned Content: the ::slotted() pseudo-element`](https://drafts.csswg.org/css-scoping/#slotted-pseudo)
3. [Css Inheritance](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Cascade_and_inheritance)

