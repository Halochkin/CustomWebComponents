# Problem: style creep of parent slot

In the previous [article](https://github.com/Halochkin/Components/blob/master/Articles/CSS/How%20to%20style%20slot.childNodes%3F.md) we
described the ways of styling `slot.childNodes`. This article describes the problem of unwanted styles (creep) that come from somewhere you don't expect.



#### 1. `dispalay: block`
Adding this parameter inside shadowRoot causes the style to be applied to all elements that match the selector outside of shadowRoot.<br>
This effect will apply even to other classes that use this class in the shadowDOM. It is worth noting that this effect is applied only to non-inherited parameters. It is most noticeable when you use the general selector `(*)` independently regular CSS or:: slotted

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
2:,3: The green default text with lightgreen top border. Because they both have a span as a child and the style from innerHTML does not apply to the children of the element. And therefore was applied the style with a DOM.
### Reality 
1: Will have a double border bottom (One for the slot element that reserves space, and the second directly for the span element that is slotted.)<br>
2:,3: Will have both lightblue border bottom and lightgreen top border despite the fact that should have only top border.<br>
### What is the reason?
The reason is that the `display: block` increases the style scope from shadowDOM to lightDOM. 

### alternative (test)

<table>
    <thead>
        <tr>
            <th></th> 
            <th>Expectation</th>
            <th>Why?</th>
            <th>Reality</th>
            <th>Reason</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1:</td>
            <td> Blue "inner fallback title" text with lightblue bottom border</td>
            <td>Because the element is in the shadowRoot and styled directly from the innerHTML</td>
            <td> As expected, but with a **double** lightblue bottom border</td>
            <td rowspan=4> `display: block` increases the style scope from shadowDOM to lightDOM </td>
        </tr>
        <tr>
            <td>2:</td>
            <td rowspan=2> The green inner text with lightgreen top border</td>
            <td rowspan=2>they both have a as a child and the style from innerHTML does not apply to the children of the element. And therefore was applied the style with a DOM</td> 
            <td rowspan=2> Both lightblue bottom border and lightgreen top border despite the fact that should have only top border</td>
        </tr>
        <tr>
            <td>3:</td>
        </tr>
    </tbody>
</table>

Try it on [Codepen.io](https://codepen.io/Halochkin/pen/Edyqmq?editors=1000)
***
Let's look at another simple example of styling using: host. Now we have two elements, the second uses the first in the shadowRoot.

```javascript
 class Inner extends HTMLElement {
    constructor(){
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML= `
<style>
  :host { 
    color: blue;
    display: block;
    height: 30px;
    background: yellow;
    font-weight: bold;
    border-bottom: 5px solid lightblue; 
  }
</style>
-><slot><span>inner fallback title</span></slot>`;
    }
  }

  class MiddleMom extends HTMLElement {
    constructor(){
     ...
      this.shadowRoot.innerHTML= `
<style>
  :host { 
    color: red;
    font-style: italic;
    border-right: 5px solid red; 
  }
</style>
<inner-el><slot></slot></inner-el>`;
    }
  }
```
```html
gentlemom top slot span: <middle-mom><slot><span>top slot span</span></slot></middle-mom>
```
### Expectation 
"top slot span" blue text inside a yellow block with a light blue bottom border and an inherited red right border
### Reality 
Right red border located under the element on the left border
### Reason 
This property transfers an empty text node located in the innerHTML MiddleMom class under the element and applies the value of the left border to it. Because the node is empty, the right border is in place of the left. 
### Solution
If you cannot avoid using display: block, add this parameter to all classes that use the element inside of which this parameter is set.
But note that this does not completely solve the problem. Because the boundary values will be applied to different elements. You may notice that the transition between the two borders looks like a diagonal rather than a vertical or horizontal as shown in the example<br>
### Try it on [Codepen.io](https://codepen.io/Halochkin/pen/JmGzNg?editors=1000)







# NOT Finished


### Example 

```html
<script>
  class Inner extends HTMLElement {
    constructor(){
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML= `
<style>
  * { 
    color: blue;
    // display: block;
    font-weight: bold;
    border-bottom: 5px solid lightblue; 
  }
</style>
-><slot><span>inner fallback title</span></slot>
`;
    }
  }

  class MiddleMom extends HTMLElement {
    constructor(){
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML= `
<style>
  * { 
    color: red;
    font-style: italic;
    border-right: 5px solid red; 
  }
</style>
<inner-el><slot></slot></inner-el>
`;
    }
  }
  class MiddlePap extends HTMLElement {
    constructor(){
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML= `
<style>
  * { 
    color: red;
    font-style: italic;
    border-right: 5px solid pink; 
  }
</style>
<inner-el><slot><span>middle fallback title</span></slot></inner-el>
`;
    }
  }
  customElements.define("inner-el", Inner);
  customElements.define("middle-mom", MiddleMom); 
  customElements.define("middle-pap", MiddlePap); 
</script>


<h1>How to style slots 1? regular css rules</h1>
<style>
  span { 
    color: green;
    text-decoration: underline;
    border-top: 5px solid lightgreen; 
  }
</style>
<hr>
1: inner empty <inner-el></inner-el>
<hr>
2: inner with span <inner-el><span>top span</span></inner-el>
<hr>
3: inner with slot-span <inner-el><slot><span>top slot span</span></slot></inner-el>
<hr>
4: gentlemom empty: <middle-mom></middle-mom>
<hr>
5: gentlemom top span: <middle-mom><span>top span</span></middle-mom>
<hr>
6: gentlemom top slot span: <middle-mom><slot><span>top slot span</span></slot></middle-mom>
<hr>
7: gentlepap empty: <middle-pap></middle-pap>
<hr>
8: gentlepap top span: <middle-pap><span>top span</span></middle-pap>
<hr>
9: gentlepap top slot span: <middle-pap><slot><span>top slot span</span></slot></middle-pap>
<hr>
```
### Result 
![result](https://github.com/Halochkin/Components/blob/master/Images/Css/result_regular_Css.PNG)
