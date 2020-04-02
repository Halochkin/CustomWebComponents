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
 
 The HTML5 specification allows for easier verification due to the introduction possible types such as `email`, `url`, or `tel`, (You can check full list of possible values [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#%3Cinput%3E_types)) and they are automatically checked. `email` and `url` will only accept correctly formatted email addresses and URLs, respectively, while `number` and `range` can have maximum and minimum numeric values applied. If the entered value does not match the expected format, these types will generate an error, resulting in an error message, and this prevents substitution of incorrect data.
 
 However, it is impractical to expect full processing of all possible scenarios with the input field.  What if you have fields for a username, zip code or other specialized data types that do not belong to the specification types? Then how do you validate these fields?  This is where we can use the `pattern` attribute.
 
 The `pattern` attribute is used for input elements only.  This allows us to define our own validation rules using Regular Expressions (RegEx). Once again, if the value does not match the specified pattern, the input will cause an error.
 
 For example, let's say we have a form for entering a user name. There is no standardized type for the username field, so we will use the usual `text` type. Let's define a rule that will be used in the pattern attribute. In this case, we will specify that the username should consist of lowercase letters; no capital letters, no numbers or other characters. And besides, the username should not exceed 15 characters.  According to the rules of regular expressions, this can be written in the following way `[a-z]{1,15}`.

 ```html
<form >
    <input type="text" name="username" placeholder="lowercase only" pattern="[a-z]{1,15}">
</form>
```
 Now, since only lowercase letters are allowed, substitution of any other characters causes an error message.
 
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

*[WHATWG: Client-side form validation](https://html.spec.whatwg.org/multipage/forms.html#client-side-form-validation)
*[MDN: Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) 
*[MDN: `invalid` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event)     
     

 
 
 