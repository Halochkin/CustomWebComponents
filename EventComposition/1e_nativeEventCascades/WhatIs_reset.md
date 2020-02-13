#What Is `reset` ?

The `reset` event fires when a `<form>` is reset.
It is possible to prevent the default action using `.preventDefault()`;

There are 3 ways to fire `reset` event:
1. `<input type="reset" value="Reset">`;
2. `<button type="reset">Reset</button>`;
3. Call `.reset()` on `<form>` element.

 When a form element form is reset, the user agent must fire a simple event named reset, that *bubbles* and is *cancelable*, at form;

In the example below, clicking on the "Clear" button will display a warning dialog box. Clicking on the OK button will clear the form;

###Demo: reset

```html
 <form onreset="return confirm('Clear the form?')">
   <input type="text" name="user" value="Input your name here"> 
   <input type="reset" value="Clear"> 
  </form>

<script>
    document.querySelector("form").addEventListener("reset", e => e.preventDefault());
</script>
```

In the example below, clicking on the "Clear" button will not clear the form because the default action is prevented in the event listener.

```html
 <form>
   <input type="text" name="user" value="Nothing in the world comes out of nowhere and goes nowhere... "> 
   <input type="reset" value="Clear"> 
  </form>

<script>
    document.querySelector("form").addEventListener("reset", e => e.preventDefault());
</script>
```

> Reset event does not clear default text (which has been set to the value attribute of input element);

###Demo: ResetController

In the demo below a function `ResetController` essentially recreates the logic of the `reset` event cascade. The demo:

1. Adds a function `toggleTick` that allows to delay event dispatching;
2. Completely blocks all the native reset events;
3. Then it adds a function `ResetController` that listens for `click` and `focusin` events;
4. Once the `ResetController` receives an appropriate trigger event, it:
    1. stores default value of element when it get a first focus;
    2. queues a loop which restore all input elements inside the form to default values;
    3. makes `my-reset` event;
    3. queues event dispatching to dispatch it after initial event;
    4. clears the queue from the recovery cycle if the event was prevented by e.preventDefault inside `my-reset` event listener callback function.
5. Both forms use `my-reset event`. The first one allows you to clear the form to its default values when you click Reset. The second form prevents the form from being cleared.    

```html
<form id="one" oninput="c.value=parseInt(a.value)+parseInt(b.value);">
    <fieldset>
        <legend>Not prevented</legend>
        0<input type="range" id="a" value="50">50
        <label for="b">+</label>
        <input type="number" id="b" value="50">
        <label for="c">=</label>
        <output id="c" for="a b"></output>
        <hr>
        <input type="text" value="lala" name="id"/>
        <hr>
        <select name="pets">
            <option value="none">--Please choose an option--</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
            <option value="parrot">Parrot</option>
            <option value="spider">Spider</option>
            <option value="goldfish">Goldfish</option>
        </select>
        <hr>
        <textarea id="story" rows="5" cols="33">It was a dark and stormy night...</textarea>
        <hr>
        <input type="reset" value="Reset">
    </fieldset>
</form>

<form id="two" oninput="c1.value=parseInt(a1.value)+parseInt(b1.value);">
    <fieldset>
        <legend>Prevented</legend>
        0<input type="range" id="a1" value="50">50
        <label for="b1">+</label>
        <input type="number" id="b1" value="50">
        <label for="c1">=</label>
        <output id="c1" for="a b"></output>
        <hr>
        <input type="text" value="lala" id="id" name="id"/>
        <hr>
        <select>
            <option value="none">--Please choose an option--</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="hamster">Hamster</option>
            <option value="parrot">Parrot</option>
            <option value="spider">Spider</option>
            <option value="goldfish">Goldfish</option>
        </select>
        <hr>
        <textarea id="story1" rows="5" cols="33">It was a sunny and pleasure day...</textarea>
        <hr>
        <input type="reset" value="Reset">
    </fieldset>
</form>

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

    const ResetController = {
      state: new WeakMap(),
      focusin: function (e) {
        // grab default value, but only one time
        if (ResetController.state.has(e.target))
          return;
        ResetController.state.set(e.target, e.target.value);
      },

      click: function (e) {
        // check whether target was a reset button and a child of FORM element
        if (e.target.type !== "reset")
          return;

        // iterate all children and check if theit values are different from default values
       let i = setTimeout(() => {
          for (let element of e.target.parentElement.elements) {
            // we don`t focus on output element and  so this is a best way to clear it
            if (element.tagName === "OUTPUT")
              element.innerText = "";
            // check if an element has been set to the state
            let value = ResetController.state.get(element);
            // Loop will iterate ALL children's include <Input type=reset>
            if (value && element.type !== "reset")
              element.value = value;
          }
         }, 0);

        const resetEvent = new InputEvent("my-reset", {composed: true, bubbles: true, cancelable: true});
        
        //Delay event to dispatch it AFTER click event.
        // toggleClick() fires *BEFORE* setTimeout 0
        toggleTick(() => {
          // dispatch reset event
          e.target.parentElement.dispatchEvent(resetEvent);
          //fires faster than setTimeout. If event has been prevent - clear timeout to avoid form resetting
          if (resetEvent.defaultPrevented)
            clearTimeout(i)
        });
      },
    };

    window.addEventListener("click", ResetController.click);
    window.addEventListener("focusin", ResetController.focusin);
    window.addEventListener("reset", e => e.preventDefault());
  })();

  let one = document.querySelector("#one");
  let two = document.querySelector("#two");

  one.addEventListener("my-reset", e => console.log(e.type));
  two.addEventListener("my-reset", e => console.log(e.type));
  two.addEventListener("my-reset", e => e.preventDefault());
</script>
```

### References 
1. [MDN: reset event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event);
2. [Spec: Resetting a form](https://www.w3.org/TR/html51/sec-forms.html#resetting-a-form).
