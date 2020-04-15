# `reportValidity()`, form submission procedure

`.reportValidity()` method returns `true` if the element's child controls satisfy their validation constraints. 

When `false` is returned, cancelable `"invalid"` event fired for each invalid child and validation problems reported to the user. It displays the message in the current mode, but still focuses on the element on which the validation message displayed.  

> `.reportValidity()` differs from `.checkValidity()` in that it causes an automatic pop-up error message.


```html

 
```

According to spec, when `reportValidity()` invoked, it runs next report validity steps:

1. If element is a candidate for constraint validation and does _not_ satisfy its constraints, then:

    1. Let report be the result of firing an event named invalid at an element, with the cancelable attribute initialized to true.

    2. If report is true, then report the problems with the constraints of this element to the user. When reporting the problem with the constraints to the user, the user agent may run the focusing steps for an element, and may change the scrolling position of the document, or perform some other action that brings element to the user's attention. User agents may report more than one constraint violation, if element suffers from multiple problems at once. If element not being rendered, then the user agent may, instead of notifying the user, report the error for the running script.

    3. Return false.

2. Return true.






### Form submission algorithm

A typical validation algorithm looks like this:

1. page load
2. `:valid` and `:invalid` match immediately
3. user fills input field  <─────┐
4. user tries to submit the form │ input correction
5. errors reported to the user  ─┘
6. form submitted only without errors


When the user submits a form (e.g., by clicking on submit button), the user agent processes it as follows.

1. Identify the successful controls 
2. Build a form data set 
A form data set is a sequence of control-name/current-value pairs constructed from successful controls

Step three: Encode the form data set 
The form data set is then encoded according to the content type specified by the enctype attribute of the FORM element.

Step four: Submit the encoded form data set 
Finally, the encoded data is sent to the processing agent designated by the action attribute using the protocol specified by the method attribute.




### References

* [WHATWG: report validity steps](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#report-validity-steps)
* [WHATWG: form submission agorithm](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#form-submission-algorithm)