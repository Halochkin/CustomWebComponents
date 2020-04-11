# WhatIS: `checkValidity()`, `<input>` attributes and CSS validation hooks

The `.checkValidity()` method checks whether the element has any constraints and whether it satisfies them. If the element fails its constraints, the browser fires a cancelable `invalid` event at the element, and then returns `false`.

The `checkValidity()` can be called on `<form>`, `<input>`, `<select>` and `<textarea>` element nodes.

> On form nodes it returns true only if all the form's children contain valid data.

So, the check validity steps for an element are:

1. If element is a candidate for constraint validation and does not satisfy its constraints, then:

    1. Fire an event named `invalid` at an element, with the cancelable attribute initialized to true (though canceling has no effect).
    
    2. Return `false`.
    
2. Return `true`.

```html
<form id="form1">
    <input id="input1" type="text" required />
</form>
<form id="form2">
    <input id="input2" type="text" />
</form>

<script>
    let input1 = document.querySelector("#input1");
    let form1 = document.querySelector("#form1");
    let input2 = document.querySelector("#input2");
    let form2 = document.querySelector("#form2");
    
    console.log(input1.checkValidity()); //false
    console.log(form1.checkValidity()); //false

    console.log(input2.checkValidity()); //true
    console.log(form2.checkValidity()); //true
   
</script>
```

Every time a form element's validity checked via `.checkValidity()` and fails, an `"invalid"` event fired for that node. 

### `invalid` event
 
When a submittable element has been checked for validity and doesn't satisfy its constraints `invalid` events fired at each form control that is invalid. The validity of submittable elements checked _before_ submitting their `<form>`. It means that it will fire when either user clicks on "submit" button or call `.requestSubmit()` on `<form>` element node. 

> It does not work with a `.submit()` because when call `.submit()` method neither `submit` nor `invalid` events raised.

  ```html
<form>
    <label for="name">Name (lowercase) </label>
    <input required type="text" id="name" placeholder="use lowercase letters only" pattern="[a-z]+">
    <input type="submit">
</form>

<script>

let inputElement = document.querySelector("input[type=text]");

inputElement.addEventListener("focusout", e => {  // call .requestSubmit() when input loses focus
    e.target.form.requestSubmit();
  },true);

  window.addEventListener("invalid", e => {  // will trigger if the entered value was irrelevant 
    console.log("invalid input: ", e.target);
  }, true);

  window.addEventListener("submit", e => {  // will be triggered only if the invalid event does not occur
    e.preventDefault();
    console.log("submitted");
  });
</script>
```

### HTML validation attributes 

The simplest way to enable validation is simply marking a field using the `required` attribute. It specifies that an input field must be filled out before submitting the form.

```html
<input type="text" required>
```

For constraint validation there are also two additional relevant attributes - `novalidate` and `formnovalidate`. 
  
  The boolean `novalidate` attribute can be applied _only to form nodes_. When present this attribute indicates that the form's data should _not_ be validated when it is submitted.
  
  ```html
  <form novalidate>
      <input type="text" required />
      <input type="submit" value="Submit" />
  </form>
 ```
 
Form above will submit even though it contains an empty `<input required/>`.
  
The `formnovalidate` boolean attribute can be applied to both `<button>` and `<input>` elements to prevent form validation. For example:
   
  ```html
  <form>
      <input type="text" required />
      <input type="submit" value="validate" />
      <input type="submit" value="do NOT validate" formnovalidate />
  </form>
 ```
 
If the user presses the "validate" button - sending the form will be forbidden because of the empty input. However, if you press the "do NOT validate" button, the form will be sent despite the invalid data because of the `formnovalidate` attribute.

The HTML5 specification allows for easier verification due to the introduction possible _types_ such as `email`, `url`, or `tel`, (You can check full list of possible values [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#%3Cinput%3E_types)).
 
 `email` and `url` will only accept correctly formatted email addresses and URLs, respectively, while `number` and `range` can have maximum and minimum numeric values applied. If the entered value does not match the expected format, these types will generate an error, resulting in an error message, and this prevents substitution of incorrect data.
 
 Also, we can define form validity using `minlength`, `maxlength`, `min`, `max`, `step`, `pattern` attributes that we can use together with particular value of `type` attribute. They make it possible to determine more customized validation.

```html
<form>
  <input required type="range" min="100" max="300" step="50">
</form>
``` 
 
At the same time it is impractical to expect full processing of all possible scenarios with the `<input>` element. What if we have input for a username, zip code or other specialized data types that do not belong to the specification types? Then how do you validate these fields? This is where we can use the `pattern` attribute.
 
 `Pattern` applies to all text fields except numeric and date fields. It is the most well-supported attribute in forms, which also allows us to write a fallback for browsers that for one reason or another do not understand the purpose of a particular type of field. This allows us to define our own validation rules using Regular Expressions (RegEx).  
 
 For example, let's say we have a form for entering a user name. There is no standardized type for the username field, so we will use the usual `text` type. Let's define a rule that will be used in the pattern attribute.
 
  In this case, we will specify that the username should:
   1. consist of lowercase letters;
   2. no capital letters, numbers or other characters;
   3. the username should not exceed 15 characters.  
   
 According to the rules of regular expressions, this can be written in the following way `[a-z]{1,15}`.

 ```html
  <form >
    <input type="text" name="username" placeholder="lowercase only" pattern="[a-z]{1,15}">
  </form>
```
 Now, since only lowercase letters allowed, substitution of any other characters causes an error message.

 ### CSS hooks
 
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
   
The style defined inside `:invalid` pseudo-class will be applied until the entered value meets the conditions. This is of course unsightly and potentially confusing. The user does not need to know about the state of their input every step of the way. Fortunately it’s fairly easy to move to onblur timing by using a slightly more complex selector.
    
```css
   input:invalid:not(:focus){
   	    background-color: red;
   }
   
   input:valid:not(:focus) {
   	    background-color: green;
   }
 ```
   
Styles now only apply when intuition loses focus.
 
 ### Problem: `:invalid` drawback
 
 Main problem with using `:invalid` with an `<input>` with `required` attribute. For example, when the field is required and its type is `text`, it will not use `:valid` _until all of its conditions are met_. It means that styles are used for `:invalid` from the beginning, even before the user has entered anything.
 
 We can solve this problem using 
 
 ```css
  input:not(:focus):not(:placeholder-shown):invalid{
         background-color: red;
     }
 ```

### References

* [WHATWG: check validity steps](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#check-validity-steps)
* [MDN: Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) 
* [MDN: `invalid` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event) 
* [MDN: `:invalid` pseudo-class](https://developer.mozilla.org/ru/docs/Web/CSS/:invalid) 
