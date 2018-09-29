# CSS priority of the slots
CSS cascading is a mechanism by which more than one CSS rule can be applied to an HTML document element. 
####
 Rules can originate from various sources: internal and external style sheets, by inheritance, from parent elements, classes or ID to the selector tag, style attribute, etc., Because in these cases often there is a conflict of styles was created a system of priorities: in the end, apply the style, which comes from a source with a higher priority.
#### 
The priority order with CSS is as follows:
1. Element : `a {color: red;}` - has the lowest priority.
2. Class selector : `.className{color: red;}`.
3. ID selector : `#idname{color: red;}`.
4. Inline style : `<a id="idname" style="color: green;">text<a>` - the id is ignored if the `#idname` declaration has already tried to define the `color` property. Other properties can still be read.
5. `!important` : a `{color: blue! Important; }` - it's the only way to override the built-in style.

The feature of the `slot` element is that it has the lowest priority among all the elements.<br>
But the above priority rules for the` slot ' element work a bit differently. If we apply them, we get the following priority sequence:
1. Slot element: `slot {color:red;}`
2. ShadowDOM innerHTML style `#shadowRoot <style> slot {color:orange;} </style>`
3. Class selector : `.slotClassName {color: yellow;}`
4. Slot with preudo-element : `slot:not([name]){color: skyblue;}`
5. ID selector : `#slotID {color: green;}`
6. Inline style : `<slot style="color: blue;"></slot>`
7. Spetial slot pseudo-element ::slotted(element) : `::slotted(span){color: violet;}`
####
It is important to note that !important does not work with`slot'.
***
### Example
In this example, we'll look at the priorities of applying CSS styles to slots
```html
<script>
  class BlueHeader extends HTMLElement {
    constructor(){
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML +=`                         //[1] 
       <style> 
            slot {color: blue;}                             //[1.1] 
            ::slotted(span) {color: green; }                //[1.2] 
       </style>
      <slot><span>Blue title</span></slot>`;
    }
  }
  customElements.define("blue-header", BlueHeader);

  class RedPage extends HTMLElement {
    constructor(){
      super();
      this.attachShadow({mode: "open"});
       this.shadowRoot.innerHTML +=`                        //[2]
        <style> 
            slot {color: red;}                              //[2.1]
            ::slotted(span) {color: green; }                //[2.2]
        </style>
       <blue-header><slot name="header">Red title</slot></blue-header>
       <slot>red content</slot>`;
    }
  }
  customElements.define("red-page", RedPage); 
</script>

<style>                                                     //[3]
  slot {color:red;}                                         //[3.1]
  .slotClassName {color: yellow;}                           //[3.2]
  slot:not([name]) { color: aqua; }                         //[3.3]
  #slotID {color: green;}                                   //[3.4]
  ::slotted(*) {color: azure; }                             //[3.5]
//span { color: green; background: lightgreen; }            //[3.6]
</style>

<h1>GreenBook.html</h1>
<h2>Page 1</h2>
<red-page id="gentleMom">
  <span slot="header">Green title</span>
  <span>green content.</span>
</red-page>
<h2>Page 2</h2>
<red-page id="gentleMom2"></red-page>
<h2>Headers</h2>
<blue-header></blue-header>
<blue-header><span>Green header 1</span></blue-header>
<blue-header><slot class="slotClassName" id="slotID" ><span>Green header 2</span></slot></blue-header>
```
1. Add a style using the shadowRoot of the custom element; 
1.1. Applied to "Blue title" because they are nested slots inside `blue-header` element,  and the nested elements inherit properties from their parents.
1.2. Will be apply to the "Green header 1". It also applies the style from step 1.1. but because the pseudo-element has the highest priority, "Green header 1" will be green;
2. Make the same as with previous one
2.1. Will be applied to "Red title" and "red content";
2.2. Applied to "Green title" and "green content", because they was slotted in the span.
3. The priority of applying styles described above. Let's try applying styles to "Green header 2";
3.1. It has the lowest priority, so it will be applied only if there are no style selectors with the highest priority;
3.2. Will not be applied because there are selectors with the highest priority;
3.3. The same;
3.4. Green color will be applied, because there are no items matching the `::slotted(*)` pseudo-element;
3.5. If there are no matches, the lowest priority selector will be applied
3.6. We have specifically commented out the selector to demonstrate the priority sequence of the `slot`;<br>
### [See example and try to uncomment the selector on Codepen.io](https://codepen.io/Halochkin/pen/oagZYa?editors=1000);
***
### Reference
1. [Pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
2. [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/::slotted)
