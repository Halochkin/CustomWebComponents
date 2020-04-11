# WhatIs: Form validation

Whenever you want to collect some information from users, you are likely to use the `<input>` element. It doesn't matter if you want a user's name, email address, the city they currently live in, phone number, or favorite sports team.
 
Validating the form entry is something to be taken seriously. If you are lucky, there is nothing worse than garbage data that will be submitted to a site that uses data from forms without proper validation. However, there is also a chance that hackers will be able to compromise the personal data of users who have entrusted you with their information.

To avoid this, you can use both native and custom form validation.
  
 ### Native validation
 
  There's no faster way to catch an error than to let your browser do it. So, native validation means using built-in browser tools to validate the data entered in the `<input>` element.
  
   The idea of native validation is to prevent the form submission and the dispatch of an error message if user entered incorrect values. It is activates only _after_ the user click "Submit" button. When the user enters the input data it is possible only to reconcile CSS pseudo-classes to input fields. There are no official requirements for generating a verification error message, pop-up prompts are used in all browsers for this purpose. The appearance of pop-up messages lies entirely with the developers of browsers.  Therefore, you should be prepared to ensure that the appearance of messages will differ from browser to browser, which does not greatly contribute to the consistency of your interface.
   
  ```html
 <form>
     <label for="name">Name (lowercase) </label>
     <input type="text" id="name" placeholder="use lowercase letters only">
     <label for="age">Age (numbers) </label>
     <input type="number" id="age" placeholder="use numbers only">
     <input type="submit">
 </form>
 
 <script>
   window.addEventListener("submit", e => {
     console.log("submitted, all values are correct");
   });
 </script>
  ```
 
 What happens if several validation rules are violated, for example if several require fields are not filled in? 
 
 Nothing will happen until the user clicks the button to submit the form. Only then will the browser start checking the fields from top to bottom. When it meets the first incorrect value, it stops further checking, cancels the submission of the form and displays an error message next to the field that caused the error. (In addition, if the area with the error field is out of screen when filling out the form, the browser scrolls the screen to make sure that the field is at the top of the page.) Once the user has corrected this error and pressed the button again to submit the form, the browser will stop at the next input error and the process will repeat.
 
### How to implement native validation

 Perhaps the easiest possible validation on a form you can do is use the `required` attribute to require a field (it is Boolean, so it does not require an explicit value)
 
 ```html
    <input type="text" required>
```
 
 It checks if a value is entered and returns an error if it is not. 
 
 
 
 ### Stylization of verification results
 Although web developers cannot generate validation error messages, they can change the appearance of fields depending on their validation results. For example, it is possible to highlight `<input>`s with an incorrect value in the color background as soon as the browser detects the incorrect data. It is possible to use `:invalid` CSS pseudo class for this.
   
 > `:invalid` has a drawback in that it assumes that this pseudo class applies to empty `<input>`s even before the user interacts with the page.
  
 You can also notify users that the field value has been entered correctly. Browser can give us this information through the `:valid` CSS pseudo class. 
 
 ```css
      input:invalid{
          border: 3px solid lightpink;
      } 
 
      input:valid{
          border: 3px solid lightgreen;
      }
  ```

 ### `invalid` event
 
When a submittable element has been checked for validity and doesn't satisfy its constraints `invalid` events are fired at each form control that is invalid. The validity of submittable elements is checked before submitting their owner <form>. It means that it will fire when either user click on "submit" button or call `.requestSubmit()` on <form> element node. 

> When invoking `.submit()` method - there no neither `submit` nor `invalid` events is raised.

  ```html
<form>
    <label for="name">Name (lowercase) </label>
    <input required type="text" id="name" placeholder="use lowercase letters only" pattern="[a-z]+">
    <input type="submit">
</form>

<script>

let inputElement = document.querySelector("input[type=text]");

inputElement.addEventListener("focusout", e => {
    e.target.form.requestSubmit();
  },true);


  window.addEventListener("invalid", e => {
    console.log("invalid input: ", e.target);
  }, true);

  window.addEventListener("submit", e => {
    e.preventDefault();
    console.log("submitted");
  });
</script>
```
  
### References

* [WHATWG: Client-side form validation](https://html.spec.whatwg.org/multipage/forms.html#client-side-form-validation)
    
     

 
 
 chapter 1 checkValidity() and the input element attributes
 chapter 2 reportValidity() and the form submit procedure
 chapter 3 invalid visualization, multiple checkValidity showing the last error message, reportValidity dispatching multiple invalid events, but showing the first error message only. 