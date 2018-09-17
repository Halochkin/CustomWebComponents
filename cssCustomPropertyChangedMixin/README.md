### cssCustomPropertyChangedMixin 
cssCustomPropertyChangedMixin provides `styleChangedCallback(name, newValue, oldValue)` which is called every
 time custom CSS properties are changed.
 ###
 To start tracking the necessary properties, specify them in the function `observedStyleProperties()`<br>
 
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

#### Example
Let's look at a simple example of using custom CSS properties. When you click on the object, it will change color to random.
```css
  test-block {
            background-color: var(--custom-prop1);            //[1a]
        }

  #first {
            height: 40px;
            width: 40px;
            background-color: var(--custom-prop2);            //[1a]
        }
```

```html
<test-block>
  <div id="first"></div>
</test-block>
```

```javascript
import {cssCustomPropertyChangedMixin} from "./src/cssCustomPropertyChangedMixin.js";

  class TestBlock extends cssCustomPropertyChangedMixin(HTMLElement) {

    constructor() {
      super();
      this.style.height = "50px";
      this.style.width = "50px";
      this.style.display = "block";
      this.style.setProperty("--custom-prop1", "orange");         //[1]
      this.style.setProperty("--custom-prop2", "red");
      this.changeStyletrigger = e => this.changeStyle();
    }

    static get observedStyleProperties() {
      return ["--custom-prop1", "--custom-prop2"]
    }

    connectedCallback() {
      if (super.connectedCallback) super.connectedCallback();
      this.addEventListener("click", this.changeStyletrigger);    //[2]
    }

    styleChangedCallback(name, newValue, oldValue) {
      console.log(name, newValue, oldValue);                      //[5]           
    }

    changeStyle() {
      this.style.setProperty("--custom-prop1", "blue");           //[3]
      this.style.setProperty("--custom-prop2", "red");            //[4]
    }
  }

  customElements.define("test-block", TestBlock)
  ```
  1.  Define the default values of custom properties.
  1a. Instead of the standard color for the background, we use a custom property.
  2. Let's add an event listener for "click" events that will call the background change function.
  3. Change the default background color for the first property (--custom-prop1).
  4. Let's make sure that if you change the parameter to the same value, the callback will not work.
  5. Check the results: `--custom-prop1 blue orange`.
 #### Try it yourself on [codepen](https://codepen.io/Halochkin/pen/QVZgEw?editors=1111)
 
 ### References
 1.[Custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
  
  
