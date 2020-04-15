# chapter 3 invalid visualization, multiple checkValidity showing the last error message, reportValidity dispatching multiple invalid events, but showing the first error message only. 
 
 
 # this is  heap of useful information, unordered
 
 
 
  
 
 
 
 
 ### Some useful information
 
 
 Where items allow entering text (e.g. text, url or search), it is possible to provide a list of useful suggestions for the user. The browser may offer them based on the user's previous input (controlled by the autofill attribute mentioned earlier), but sometimes we may want to offer a range of predefined terms. Implement this last option with a `<datalist>` element. The `<datalist>` contains a list of sentences, each of which is contained in an option child element.
 
 ```html
<input type="text" list="options">
<datalist id="options">
 <option>A</option>
 <option>B</option>
 <option>C</option>
 </datalist>
```
 The `<datalist>` element is not render on the page and should not be close to the `input` that refers to it; it can be placed anywhere in the markup. To create a link between the input field, in which the user will enter data, and the `<datalist>` item containing sentences, the first one uses the `id` value of the latter as the value of its own `list` attribute.
 This association between `id` and list attributes means that multiple inputs can refer to the same datalist element, if required.
 
 
### What happens if several validation rules are violated, for example if several require fields are not filled in? 
 
 Nothing will happen until the user clicks the button to submit the form. Only then will the browser start checking the fields _from top to bottom_. 
 
 When it meets the first incorrect value, it stops further checking, cancels the submission of the form and displays an error message next to the field that caused the error. (In addition, if the area with the error field is out of screen when filling out the form, the browser scrolls the screen to make sure that the field is at the top of the page.) Once the user has corrected this error and pressed the button again to submit the form, the browser will stop at the next input error and the process will repeat.