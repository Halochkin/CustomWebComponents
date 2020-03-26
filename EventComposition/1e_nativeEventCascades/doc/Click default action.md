# Click default action

### 1. Input `type = "Checkbox / radio"`





#### checkbox
Default behavior for `<input type ="checkbox">` element has next algorithm:

The input element represents a two-state control that represents the element's checkedness state. 
1. If element is not mutable (`disable` attribute is set), then return.

1. If the element's `checkedness` state is true, the control represents a positive selection, and if it is false, a negative selection.
2. If the element's `indeterminate` IDL attribute is set to true, then the control's selection should be obscured as if the control was in a third, indeterminate, state.
    >In addition to the `checked` and `unchecked` states, there is a third state a checkbox can be in: `indeterminate`. This is a state in which it's impossible to say whether the item is toggled on or off. This is set using the HTMLInputElement object's indeterminate property via JavaScript (it cannot be set using an HTML attribute):
  A checkbox in the indeterminate state has a horizontal line in the box (it looks somewhat like a hyphen or minus sign) instead of a check/tick in most browsers.
  
    ```html
      <input type="checkbox">
      
      <script >
          let element = document.querySelector("input");
          element.indeterminate = true;
      </script>
      ```

2. Set `checked` attribute value to its opposite (i.e. true if it is false, false if it is true) and set this element's `indeterminate` attribute to false.

 





If this element's type attribute is in the Radio Button state, then get a reference to the element in this element's radio button group that has its checkedness set to true, if any, and then set this element's checkedness to true.






```html
<input type="radio">
<input type="checkbox">
```

 

### `audio` / `video` with controls attribute
Why understand audio / video reaction to click? The audio and video elements are good examples of complex web components that provide the web app with resources not otherwise provided in the dom. Thus, many web components will echo these elements, not necessarily by providing multimedia content, but by providing a custom, specialized communication channel to a server or a custom graphical element or a custom language parsing element. In the lightdom, the audio and video elements echo the old object/embed pattern that web components will also echo.
