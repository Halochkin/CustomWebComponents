# What is `input`?
The `input` event fires when the value of an `<input>`, `<select>`, or `<textarea>` element has been changed. 

Browser dispatch event immediately after the DOM has been updated due to a user expressed intention to change the document contents which the browser has handled.

> NOTE! The input event is sync.
 That means that tasks queued in the event loop from a `beforeinput` event listener, should run AFTER the input event dispatch. This means that the act of changing the input element's value property doesnt dispatch a new event.

Unlike keyboard events, it is triggered by any changes in values, even those not related to keyboard actions: pasting with a mouse or using speech recognition to dictate text. 

On the other hand, the event is not triggered by typing from the keyboard and other actions not related to changing the value, such as pressing the arrow keys of `⇦` `⇨` during input.

### Demo: input
```html
<input id="one" type="text" value="Tell us your story ...">
<input id="two" type="text" value="Nothing can stop you!">
<input id="three" type="text" value="Or could it?">

<script >
(function() {
    document.querySelector("#one").addEventListener("input", e => console.log(e.target.id, e.type));
    document.querySelector("#two").addEventListener("input", e => e.preventDefault());
    document.querySelector("#two").addEventListener("beforeinput", e => e.preventDefault());
})();
</script>
```

##### Nothing can prevent input event.

The event occurs **after** the value changes.  So we cannot use `event.preventDefault()` there - it's just too late, there will be no effect. But you can use `beforeinput` for this.

> The `input` event is similar to the [`change`](./WhatIs_change.md) , the difference is that the `input` event occurs immediately after the value of the element has changed, and the `change` occurs when the element loses focus after the content has been changed.

### Demo: KeypressInputController
In the demo below a function InputController essentially recreates the logic of the input event cascade.

1. Block `beforeinput` event to avoid double character input;
2. Then it adds a function `toggleTick` that allows to delay event dispatching;
3. Then it adds a `InputController` that listens for keydown and keypress events.
4. Taking into account the fact that `keydown` event responds to ALL keys on the keyboard, and `keypress` only to the actual input characters - InputController.keydown responds only to `Backspace` key which removes the last character.  We do not add any filters for the `keypress` event because, as mentioned earlier, this event is only activated with the actual input characters.
5. Once the `InputController` receives an appropriate trigger event, it
    * creates a new `my-beforeinput` event and dispatch it;
    * creates a new `my-input event`
    * queues:  
        * first event dispatching;
        * update value of a current target;
        * second event dispatching.

```html
<input id="one" type="text" value="I am custom"/>
<input id="two" type="text" value="I am native"/>

<script>
  (function () {
    // block all beforeinput events and stop their default actions
    window.addEventListener("beforeinput", e => e.preventDefault());

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

    const InputController = {
      props: {
        composed: true,
        bubbles: true,
        cancelable: true
      },
      keydown: function (e) {
        if (e.key !== "Backspace")
          return;
        const beforeInputEvent = new InputEvent("my-beforeinput", InputController.props);
        const inputEvent = new InputEvent("my-input", InputController.props);
        inputEvent.key = e.key;
        toggleTick(function () {
          e.target.dispatchEvent(beforeInputEvent);
          // this is start update the input element
          e.target.value = e.target.value.substr(0, e.target.value.length - 1);
          // this is end update the input element
          e.target.dispatchEvent(inputEvent);
        });
      },
      // here we set a new characters
      keypress: function (e) {

        const beforeInputEvent = new InputEvent("my-beforeinput", InputController.props);
        const inputEvent = new InputEvent("my-input", InputController.props);
        inputEvent.key = e.key;
        toggleTick(function () {
          e.target.dispatchEvent(beforeInputEvent);
          if (beforeInputEvent.defaultPrevented)
            return;
          e.target.value += e.key;
          e.target.dispatchEvent(inputEvent);
        });
      }
    };

    window.addEventListener("keydown", InputController.keydown, true);
    window.addEventListener("keypress", InputController.keypress, true);


    let one = document.querySelector("#one");
    let two = document.querySelector("#two");

    one.addEventListener("my-beforeinput", e => console.warn("my-beforeinput"));
    one.addEventListener("my-input", e => console.warn("my-input"));
    two.addEventListener("beforeinput", e => console.log("beforeinput"));
    two.addEventListener("input", e => console.log("input"));
    two.addEventListener("my-beforeinput", e => e.preventDefault());
  })();
</script>
```

* You can see both `my-beforeinput` and `input` events each time when you set new values to the input#one;
* You cant senany new values to input#two because we prevent it using `my-beforeinput` event. 

### References
1. [MDN: input event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event);
2. [MDN: beforeinput event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event);
