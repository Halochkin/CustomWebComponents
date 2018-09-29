## Css priority of the slots
CSS cascading is a mechanism by which more than one CSS rule can be applied to an HTML document element. 
####

The priority order with CSS is as follows:
1. Element : `a {color: red;}` - has the lowest priority.
2. Class selector : `.className{color: red;}`.
3. ID selector : `#idname{color: red;}`.
4. Inline style : `<a id="idname" style="color: green;">text<a>` - the id is ignored if the `#idname` declaration has already tried to define the `color` property. Other properties can still be read.
5. `!important` : a `{color: blue! Important; }` - it's the only way to override the built-in style.

The feature of the `slot` element is that it has the lowest priority among all the elements.<br>
But the above priority rules for the` slot ' element work a bit differently. If we apply them, we get the following priority sequence:
1. Slot element: `slot {color:red}`
2. ShadowDOM innerHTML style `#shadowRoot <style> slot {color:red} </style>`
3. Class selector : `.slotClassName {color: red}`
4. ID selector : `#slotID {color: red}`
5. Slot with preudo-element : `slot:not([name]){color: red}`
6. Inline style : `<slot style="color: red;"></slot>`
7. Spetial slot pseudo-element ::slotted(element) : `::slotted(span)`
####
It is important to note that !important does not work with`slot'
### Reference
1. [Pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
2. [::slotted()](https://developer.mozilla.org/en-US/docs/Web/CSS/::slotted)
