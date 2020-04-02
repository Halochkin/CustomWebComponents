# Problem: Problem: ehm.. %em?
A pattern that illustrate how the em and % are altered by styles inside shadowDOM.

First, let's remember what em is.
`Em` is a relative unit, i.e. it indicates the relation to the font size (`font-size`) of the current item or viewport size.
By default (when no style sheet is attached to a page) the browser sets the font size of the web pages to **16 pixels**,
so that _the default value of 1em is 16 pixels_.
This means that the sizes specified in `em` will decrease or increase with the font. Given that the font size is usually
 defined by the parent and can be changed in exactly one place, this is very convenient.

### Example

So, if a web component has a `div` element around its _slot_, and then 
sets a `font-size ` CSS property on that div, then the `em` dimensions is altered in the lightDOM.
If the div wrapped around the slot has a width size, then the width % of the lightDOM child is altered. 

```html
<h3>em</h3>
<div style="font-size: 1em">Default text size</div>
<my-webcomp>
    <div id="b1" style="font-size: 1.5em">This text is 1.5 times larger relative to the text above</div>        <!--[1.1]-->
</my-webcomp>
<div id="с" style="font-size: 2em">My size is twice larger as the default text size</div>          <!--[2]-->
    <hr>
<h3>%</h3>
<div style="font-size: 100%">Default text size</div>
<my-webcomp>
    <div style="font-size: 130%">This text is 130% larger relative to the text above</div>
</my-webcomp>


<script>
  class MyWebcomponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
        <div id="a" style="font-size: 30px;">My size is 30 px. And it is defined inside shadowDOM          //[1]
            <slot></slot>
        </div>`;
    }
  }

  customElements.define("my-webcomp", MyWebcomponent);
</script>
```

1. `my-webcomp` custom element has a `<slot>` wrapped in `div#a` element (which has `font-size: 30px` CSS property).
    1.  `div#b1` will be placed inside the `<slot>` (located inside shadowDOM), then `1.5em` will be obtained relative to 
    the parent element `div#a`, which font-size is equal to 30px. (30 * 1.5 = 45px).
2. Since `div#c `is inside lightDOM, `2em` will be obtained relatively _default text-size, which equals 16px_ (2*16 = 32px).

Example with % works in a similar way, the sizes are relative to the parent container.


Try it on [codepen](https://codepen.io/Halochkin/pen/eqJxOd)

### References
* [MDN: CSS Numeric values](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Values_and_units#Numeric_values)
* [MDN: CSS Percentages](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Values_and_units#Percentages)