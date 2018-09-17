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
