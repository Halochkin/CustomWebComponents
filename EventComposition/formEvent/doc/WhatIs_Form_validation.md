# WhatIs: Form validation

Whenever you want to collect some information from users, you are likely to use the HTML input element. It doesn't matter if you want a user's name, email address, the city they currently live in, phone number, or favorite sports team. The input element is a very convenient way to get information from visitors.
 
Validating the form entry is something to be taken seriously. If you are lucky, there is nothing worse than garbage data that will be submitted to a site that uses data from forms without proper validation. However, there is also a chance that hackers will be able to compromise the personal data of users who have entrusted you with their information.

Thankfully, HTML gives us a number of features that can handle most of your validation needs. Form element have built-in support for validation through the use of special attributes and new input types, and give you a lot of control over styling with CSS.

### Attribute validation

* ### Required Fields

 Using the **"required"** attribute you tell your browser that the value must be provided in this field. The problem here is that nearly any data will fulfill this requirement - for example you can bypass it with an empty space.
 
* ### Specialized input type
  
   HTML introduced several input types which will accept only a specified kind of data. Possible input types are as follows:
   
   * color
   * date
   * datetime
   * datetime-local
   * email
   * month
   * number
   * range
   * search
   * tel
   * time
   * url
   * week
   
To use one of the new types, include them as the value of the `type` attribute:
   
* ### Limits   
 
   Another way to limit what is valid input for an element is to use `minlength` and `maxlength` attributes. They set the minimum and maximum number of characters that must be entered into the input element to make it valid.
   The  `<input type="number" />` field uses the `max` and `min` attributes  to create a range of possible values.

* ###  Patterns
     
   The `pattern` attribute lets developers set a regular expression, which the browser will match against the user supplied input, before allowing the form to be submitted. The main application possibilities of the pattern attribute are the ability to specify ranges of values, specifying only characters of numbers or letters, variable values and setting the range of minimum and maximum string length.
  
 ## ValidityState 
  
  
  
  
## Problem: Native error messages 

The problems of native messages are quite serious:

* The first problem is the impossibility of stylization. There is no way you can customize your native browser message design.

* Different principles of work in different browsers. They relate to areas such as the time of appearance, the duration of the appearance of a native message, the conditions of appearance, and so on.

Fortunately, there is a `Constraint Validation API` that allows to customize form validation. It provides several methods which allows to make custom validation and customize error messages:

1. `.reportValidity()` - calls on form element, returns true if the element's child controls satisfy their validation constraints. When false is returned, cancelable `invalid` events are fired for each invalid child and validation problems are reported to the user.
    > When using this method, if the input field falls into focus, and the value of the field does not meet the input conditions - you can not leave this field. Whatever you try to do, if you hit a field that is invalidated by this method until you make the data in that field valid, you can't leave it. 
 It's better not to use this method, and use the `.checkValidity()` and `setCustomValidity()` pair instead. 
                                                                                                                                                                                                                                                                              >
2. `.checkValidity()` - calls on input element, checks whether the element has any constraints and whether it satisfies them. If the element fails its constraints, the browser fires a cancelable `invalid` event at the element, and then returns false.

* `юsetCustomValidity()` - sets the custom validity message for the selection element to the specified message. Use the empty string to indicate that the element does not have a custom validity error.

 ```html
   <form>
       <input type="text" name="name" placeholder="name" id="name" pattern="[a-z]" required>
       <input type="submit">
   </form>
   
   <script>
     const inputElement = document.querySelectorAll("input:[type=text]");
   
     inputElement.addEventListener('input', (e) => {
       
       if (!e.target.form.checkValidity())
         e.target.setCustomValidity("Incorrect value entered");
     });
   
   </script>
 ```
 
## `invalid` event 

`invalid` event fires *before* `input` event on each wrong element on form, if a submittable element has been checked for validity and doesn't satisfy its constraints and block `submit` event.
> remember that call `.checkValidity()` or `.reportValidity()` inside event listener cause infinite loop, because ion the case of wrong inputs, both methods provide `invalid` event
```html
   <form>
       <input type="text" name="name" placeholder="name" id="name" pattern="[a-z]" required>
       <input type="submit">
   </form>
   
   <script>
     const inputElement = document.querySelectorAll("input:[type=text]");
   
     inputElement.addEventListener('invalid', e => {
       console.log(e.type, " event on ", e.target.tagName);
       let validity = e.target.validity;
       if (!validity.patternMismatch)
         e.target.setCustomValidity("You can use only lower case here");
     });
    
     window.addEventListener("submit", e => {
       console.log(e.type, " event on ", e.target.tagName);
     });   
   </script>
```

## ValidityState

The `ValidityState` interface represents the validity states that an element can be in, with respect to constraint validation. It help explain why an element's value fails to validate, if it's not valid.  Unlike '.checkValidity()' it allows you to track the cause of the error.

In order to get its value we need to refer to it using the `.validity` property on the target element.

For each of these boolean properties, a value of `true` indicates that the specified reason validation may have failed is true, with the exception of the valid property, which is true if the element's value obeys all constraints.

```javascript
Validity ={
    customError: true, // if setCustomValidity() call has been set for user messages.
    patternMismatch: true, // if the value node does not match the attributes of the pattern
    rangeOverflow: tue, // if the node value exceeds the attribute max
    rangeUnderflow: true, // if the node value is less than attribute min
    stepMismatch: true, // if the node does not have the value of the step attribute.
    tooLong: true, // if the node value exceeds the attribute maxlength.
    tooShort: true, // if the value is less than the allowed minimum minlength.
    typeMismatch: true, // if the node value has a wrong value attribute type.
    valueMissing: true, // if the node has the required attribute, but the value node is empty.
    valid: true, // if all actions of the conditions listed above are false.
    badInput: true, // if the record cannot be converted to value;
}
```

We can use it in pairs to customize validation error messages.

## Example: custom validation

```html
   <form>
       <input type="text" name="name" placeholder="name" id="name" pattern="[a-z]" required>
       <input type="number" name="age" placeholder="age" id="age" min="21" max="110" required>
       <input type="submit">
   </form>
   
   <script>
     const inputs = document.querySelectorAll("input:not([type=submit])");
   
     Array.from(inputs).map(input => input.addEventListener('input', (e) => {
       let validity = e.target.validity;
       if (!validity && validity.rangeUnderflow) 
         e.target.setCustomValidity("You're too young"); //will display this message if value will be less then value of min attribute
     }));
   
   </script>
```
 
## Form validation controller 

// todo

```javascript
``` 
 
 
 ## Reference
 
 //todo