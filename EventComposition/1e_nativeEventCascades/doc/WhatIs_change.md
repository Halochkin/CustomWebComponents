# What is `change` ?

The change event is fired for `<input>`, `<select>`, and `<textarea>` elements when an alteration to the element's value is committed by the user.
This may be done, for example, by clicking outside of the element or by using the `Tab` key to switch to a different control.
 This means that the event will _not happen every time_ you enter it, but when you lose focus.

For example, as long as you type something in the text input below, the event does not occur. But as soon as you move the focus to another element, for example, you press a button, change event will occur.

```html
<input type="text" value="type something ...">
<input type="button" value="Button">

<script >
    document.querySelector("input[type=text]").addEventListener("change", e=> console.log(e.type, e.target.value)); 
</script>
```
For other elements: `select`, `input type=checkbox/radio` - change event occurs when the checked state has been changed.

  `change` is similar to the [`input`](WhatIs_input.md) event. The difference is that the `input` event occurs immediately after the value of an element has changed, while change occurs when the element loses focus, after the content has been changed. The other difference is that the onchange event also works on `<select>` elements.
 
```html
<select>
  <option value="">Select something</option>
  <option value="1">Case 1</option>
  <option value="2">Case 2</option>
  <option value="3">Case 3</option>
</select>

<script>
   document.querySelector("select").addEventListener("change", e => console.log(e.type, e.target.value));   
</script>
```
> Change event is not cancelable because it is activated after entering new characters in the input field.

#Demo: ChangeController

Since it is possible to activate a change event using the `Enter` button we must also intercept its activation using the `beforeinput` event listener.  But  this event will be triggered every time any current key is pressed. Therefore, we need to add some conditions that will check the value of the button that is pressed;
  But what happens if the user press Enter key several times or adds a new value and then deletes it? In that case, the event must not be activated. To do so, let's add a second check that will compare the value of the stored target to the target of the current event. This will prevent the event from being called up if the user presses the Enter button several times or adds some new values and then deletes them. After event dispatching the stored value is updated.
  
 In order to activate `my-change` event when focus is lost, focusout event is used. It compares the value of the last value changed in the beforeinput event with the value of the captured target. And if these values are not equal, this means that new values have been added and the my-change event is dispatch. Similar to the previous step - after event dispatching the stored value is updated;
  
In the demo below a function `ChangeController` essentially recreates the logic of the change event cascade.

1. Adds a function `toggleTick` that allows to delay event dispatching;
2. Adds a `ChangeController` that listens for `focusin`, `beforeinput` and `focusout` events;
3. When the focusin event is first activated, it captures the target element and its default value and stores it; 
4. Once the `ChangeController` receives an appropriate trigger event, it
       * store event target and its initial value;
       * compare initial value with a current value;
       * creates a new `my-change` event;
       * queues:  
           * first event dispatching;
           * update value of a ChangeController state.

```html
 <input id="one" type="text" value="I am custom"/>
 <input id="two" type="text" value="I am native"/>
 <meta charset="utf-8">
 
 <script>
   (function () {
     function toggleTick(cb) {
       const details = document.createElement("details");
       details.style.display = "none";
       details.ontoggle = cb;
       document.body.appendChild(details);
       details.open = true;
       Promise.resolve().then(details.remove.bind(details));
       return {
         cancel: function () {
           details.ontoggle = undefined;
         },
         resume: function () {
           details.ontoggle = cb;
         }
       };
     }
 
     const ChangeController = {
       target: undefined,
       value: undefined,  
 
       focusin: function (e) {
         if (e.target.tagName === "INPUT" && !ChangeController.target) {
           ChangeController.target = e.target;
           if (!ChangeController.value)
             ChangeController.value = e.target.value;
         }
       },
 
       beforeinput: function (e) {
         if (e.inputType !== "insertLineBreak" || ChangeController.value === ChangeController.target.value)
           return;
         const changeEvent = new InputEvent("my-change", {composed: true, bubbles: true, cancelable: true});
         //delay event. Because beforeinput event fires erlier than focusout. It meant that event will fires in 
         // different order relatively to native change event
         toggleTick(() => {
           e.target.dispatchEvent(changeEvent);
           ChangeController.value = e.target.value;
         });
       },
 
       focusout: function (e) {
         if (ChangeController.value === ChangeController.target.value)
           return;
         const changeEvent = new InputEvent("my-change", {composed: true, bubbles: true, cancelable: true});
         e.target.dispatchEvent(changeEvent);
         ChangeController.value = e.target.value;
       }
     };
 
     window.addEventListener("focusin", ChangeController.focusin, true);
     window.addEventListener("beforeinput", ChangeController.beforeinput, true);
     window.addEventListener("focusout", ChangeController.focusout, true);
 
     let one = document.querySelector("#one");
     let two = document.querySelector("#two");
 
     one.addEventListener("my-change", e => console.warn("my-change"));
     two.addEventListener("change", e => console.warn("change"));

   })();
 </script>
```

#References
1. [MDN: change event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event);
2. [MDN: beforeinput event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event)
 