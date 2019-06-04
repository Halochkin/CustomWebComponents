## cssCustomPropertyChangedMixin 
cssCustomPropertyChangedMixin provides `styleChangedCallback(name, newValue, oldValue)` which is called every
 time custom CSS properties are changed.
 ###
 To start tracking the necessary properties, specify them in the function `observedStyles()`<br>
 
 ```javascript
            static get observedStyleProperties() {
              return ["--custom-prop1", "--custom-prop2" ....]
              }
 ```
                         
 The styleChangedCallback returns the following arguments:

`name`: The name of the modified parameter;<br>
`newValue`: actual value;<br>
`oldValue`: previous value.<br>

 If you change several tracked properties at the same time, two separate `styleChangedCallbacks` will be produced.
 One for each changed parameter.<br>
 In the case if the new value of the property is equal to the previous one - `styleChangedCallback`, `will not` be called.

### Example
Let's look at a simple example of using custom CSS properties. When you click on the object, it will change color to random.
```css
  test-block {
            background-color: var(--custom-css-prop-1);               //[1a]
        }

  #first {
            height: 40px;
            width: 40px;
            background-color: var(--custom-css-prop-2);               //[1a]
        }
```

```html
<test-block>
  <div id="first"></div>
</test-block>
```

```javascript
import {cssCustomPropertyChangedMixin} from "./src/StyleChangedMixin.js";

  class TestBlock extends StyleChangedMixin(HTMLElement) {

   constructor() {
      super();
      this.style.height = "150px";
      this.style.width = "150px";
      this.style.display = "block";
      this.style.setProperty("--custom-css-prop-1", "orange");         //[1]
      this.style.setProperty("--custom-css-prop-2", "red");
      this.style.setProperty("--custom-css-prop-3", "");
      this.style.setProperty("--custom-css-prop-4", 44);
      this.changeStyletrigger = e => this.changeStyle();
      }

    static get observedStyles() {
      return ["--custom-css-prop-1", "--custom-css-prop-2", "--custom-css-prop-3", "--custom-css-prop-4"];
    }

    connectedCallback() {
      if (super.connectedCallback) super.connectedCallback();
      this.addEventListener("click", this.changeStyletrigger);         //[2]
    }

    styleChangedCallback(name, newValue, oldValue) {
      console.log(name, newValue, oldValue);                           //[7]           
    }

    changeStyle() {
      this.style.setProperty("--custom-css-prop-1", "blue");           //[3]
      this.style.setProperty("--custom-css-prop-2", "red");            //[4]
      this.style.setProperty("--custom-css-prop-3", 22);               //[5]
      this.style.setProperty("--custom-css-prop-4", true);             //[6]
    }
  }

  customElements.define("test-block", TestBlock)
  ```
  1.  Define the default values of custom properties.<br>
  1a. Instead of the standard color value for the background, we use a custom property.
  2. Let's add an event listener for "click" events that will call the background change function.
  3. Change the default background color for the first property (--custom-prop1).
  4. Let's make sure that if you change the parameter to the same value, the callback will not work.
  5. Let's try adding a number.
  6. What about the boolean value.
  7. Check the results: <br>
  `--custom-css-prop-1 blue orange`.<br>
  `--custom-css-prop-3  22`<br>
  `--custom-css-prop-4  44 true`<br>
 ### Try it yourself on [codepen](https://codepen.io/Halochkin/pen/QVZgEw?editors=1111)
 
 ### Discussion: problems of using the getComputedStyle() method
 When we call the `getComputedStyle`, we need only to get the computed property. When we make the changes, it is important that the changes work from top to bottom, left to right. The top changes might influence the styles of the lower elements, but the callbacks should not work the other way round. 
 >"The values returned by getComputedStyle are known as resolved values. These are usually the same as the CSS 2.1 computed values, but for some older properties like width, height or padding, they are instead the used values. Originally, CSS 2.0 defined the computed values to be the "ready to be used" final values of properties after cascading and inheritance, but CSS 2.1 redefined computed values as pre-layout, and used values as post-layout. For CSS 2.0 properties, the getComputedStyle function returns the old meaning of computed values, now called used values. An example of difference between pre- and post-layout values includes the resolution of percentages that represent the width or the height of an element (also known as its layout), as those will be replaced by their pixel equivalent only in the used value case." [MDN window.getComputedStyle()](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle)<br>
 
 A simple method to achieve this is to keep a double map, storing each node by its level.
But, this is also a guestimate, as elements might be moved around during the styleChangedCallbacks.
Ok, so that means that when we add an element, we need to register which document that host node belongs to. And sort that element under that document. And sort its position under that document.
we also need to clearly specify that styleChangedCallback() should ONLY alter the shadowDOM, *not* the lightDOM! <br>
###
Ok, so when we add an element, we register that element under a document. That document is registered in a leveled map. And each element in the map, will be registered as to their levels from the top node. How many parents to the top. 
Then, when we run, we run from top to bottom, we keep track of the position in the maps, which document, which level, which iteration in that level, which node in that document, which level for that node, and which iteration of that level.
No. We just keep track of elements already processed.
And then the level and number of documents, and the level and number of the elements in that document. 
if an element moves, then we must make sure that these pointers are both receiving these changes, and not affected by these changes. mutable and immutable.
I think we should have two sets. Processed documents, processed elements (per document).
This means that when we are working on a document, we iterate from the start always. And then 
once the document is finished, then it cannot be altered.
###
The preliminary conclusion is: the elements should be called back in document order, allowing higher up element to influence lower elements within the same cycle.
And that the rule for both `resizeCallback()` and `styleChangedCallback()` is that they only should affect shadowDom, and make sure no events/side effects from their changes propagate up to the lightdom.
And that is it. With these two premises, i think it will be almost quick enough and simple to relate to. Break the second rule, and your elements just won't be processed in the same raf, you changes might be delayed a raf. Cause flickering, but no app stopping bug.

 
 
 ### References
 1. [Custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
  
  
