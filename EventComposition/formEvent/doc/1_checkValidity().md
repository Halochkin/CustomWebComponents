# WhatIs: `<input>` validity?

## WhatIs: `checkValidity()` and `invalid` event?

The `.checkValidity()` can be called on input elements: `<input>`, `<select>` and `<textarea>`.
The `.checkValidity()` method checks whether the input element has any constraints and whether it satisfies them. If the input element's data matches the given constraints, the `.checkValidity()` returns true; if the input element's data doesn't match the given constraints, the `.checkValidity()` dispatches a `invalid` event at the element, and then returns `false`.

> You can call `.checkValidity()` on `<form>` elements too. `.checkValidity()` then returns true iff all the `<form>` element's input elements are valid.

The invalid event is dispatched sync on the input element that fails its validity test. The `invalid` event doesn't bubble, but it is cancellable: calling `.preventDefault()` on an `invalid` event will allow the `<form>` to be submitted even if this `invalid` event was dispatched as part of a `submit` request.

The `invalid` event itself doesn't contain any data about which validity check failed. Instead, the input element (which is also the `target` of the `invalid` event) contains a `.validity` property object that stores the state of the validity check. [Here](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState#Properties) is a table of all possible values of `validity` object.

```html
<input type="text" required />

<script>
  const input = document.querySelector("input");
  input.addEventListener("invalid", e => console.log("invalid input: ", e.target.validity));
  console.log("input.checkValidity(): ", input.checkValidity());
</script>
```

Results:

```
invalid input: {..., required: false}
input.checkValidity(): false
```

## WhatIs: `required` and `pattern` and other HTML validation attributes? 

There are ten?? HTML attributes that can be added to an input element to constrain its validity.

#### Validity attributes that apply to:
1. `<input>`, `<textarea>` and `<select>` elements: 
    * `required`: the element must be selected or have text content when the form submitted.

2. `<input type="text">` and `<textarea>` elements: 
    * `pattern`: specifies a regular expression the form control's value should match.
    * `minlength/maxlength`: ensure that the length of the element is greater/less than or equal to the specified value.
 
3. `<input>` 
    * `type`: specifying the type of control to render. All available values presented [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#%3Cinput%3E_types).
 
4. `<input type="number"> <input type="range">`
    * `min`: number value must be greater or equal the value.
    * `max`: number value must be less or equal the value.
    * `step`: number value must be a multiple of this number.
  
```html
<form>
    <label for="login">Nickname (4 to 10 characters):</label>
    <input id="login" type="text" minlength="3" maxlength="10" required>
    <label for="phone">Phone number:</label>
    <input id="phone" type="tel" required>
    <input type="submit">
</form>

<script>
  window.addEventListener("invalid", e => {
    const validity = e.target.validity;
    for (let key in validity) {
      if (validity[key])
        console.log("Wrong #" + e.target.id, key);
    }
  }, true);
</script>
```

## WhatIs: `:invalid` and `:valid`?
 
Writing an effective form validation is not only about the errors themselves; it is equally important to show the errors to the user in a user-friendly way, and supporting browsers give you CSS pseudo-classes to do so.
  
CSS form validation relies on the `:invalid` and `:valid` pseudo-classes. (There are other pseudo-classes, such as `:out-of-range`, but we’re going to ignore them because they work the same, and are more specific instances of `:invalid`).
   
```html
<style>
    input:valid {
        background-color: green;
    }

    input:invalid {
        background-color: red;
    }
</style>
<form>
    <input type="text" id="name" placeholder="use lowercase letters only" pattern="[a-z]+">
</form>
```
   
## Problem: `:invalid` drawback
 
The style defined inside `:invalid` pseudo-class will be applied until the entered value meets the conditions. But, this can be intrusive and disturb the user's interaction with the page: the user does not need to know about the state of their input *all the time*. So, from a CSS perspective, one likely want to limit the styles for `:invalid` and/or `:valid` selectors to more specific circumstances:
 
1. Only show the `:invalid` style when the user is not actively working with it (ie. not currently focusing on that element)
    
```css
input:invalid:not(:focus){
  background-color: red;
}
 ```
   
2. Another problem is to separate between "edited-by-the-user-and-invalid" and "not-yet-edited-by-the-user-and-invalid". For input elements that has a `placeholder` attribute, we can do so by combining the `:placeholder-shown` and the `:invalid` CSS pseudo-classes:
 
```html
<input type="text" placeholder="You should write only 'aaa' here..." pattern="a+">

<style>
  /*input element has not yet been edited and is invalid*/ 
  input:invalid:not(:focus):not(:placeholder-shown){
    background-color: orange;
  }
  /*input element has been edited, but is given an invalid value*/ 
  input:invalid:not(:focus):placeholder-shown{
    background-color: red;
  }
</style>
```

## `.setCustomValidity()`

On the `invalid` event there is a special method for setting the user feedback message on the native user feedback element: `.setCustomValidity()`.

If an `invalid` event activated, the browser will display an error message stored in the `validationMessage` property of the target. The _only way_ to change its value is to call `setCustomValidity()` with the message text as an argument value. 
To make sure that it is impossible use other methods to determine the new value of error message, consider a demo. In the first case we try to use `.defineProperty()` method to change the `validationMessage` value, but the browser will ignore it and display the default message. The second method uses `setCustomValidity()` and changes the text of the message causing the browser to display the new value correctly.

```html 
<form>
    <label for="login">Nickname (4 to 10 characters):</label>
    <input id="login" type="text" minlength="3" maxlength="10" required>
    <label for="password">Password:</label>
    <input id="password" type="password" required>


    <input type="submit">
</form>

<script>
  let login = document.querySelector("#login");
  let password = document.querySelector("#password");

  login.addEventListener("invalid", e => {
    const validity = e.target.validity;
    for (let key in validity) {
      if (validity[key]) {
        Object.defineProperty(e.target, "validationMessage", {
          value: "Error: " + key,
          writable: true
        });
      }
    }
    console.log(e.target.validationMessage); // Error: valueMissing

  }, true);


  password.addEventListener("invalid", e => {

    const validity = e.target.validity;

    for (let key in validity) {
      if (validity[key]) {
        e.target.setCustomValidity("Error: " + key);
        return
      }
    }
    console.log(e.target.validationMessage); // Error: valueMissing

  }, true)

</script>
``` 

### References

* [MDN: ValidityState](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState#Properties)
* [WHATWG: check validity steps](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#check-validity-steps)
* [MDN: Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) 
* [MDN: `invalid` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event) 
* [MDN: `:invalid` pseudo-class](https://developer.mozilla.org/ru/docs/Web/CSS/:invalid) 



