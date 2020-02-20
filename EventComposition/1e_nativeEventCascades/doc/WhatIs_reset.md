# What Is `reset` ?

The `reset` event fires when a `<form>` is reset.

There are 3 ways to fire `reset` event:
1. `<input type="reset" value="Reset">`;
2. `<button type="reset">Reset</button>`;
3. Call `.reset()` on `<form>` element.
 
 It is _cancelable_ event, so it is possible to prevent the default action using `.preventDefault()`;

###Demo: reset form

In the example below, click "Clear" button will _not_ clear the form because the default action is prevented by event listener.

```html
 <form>
   <input type="text" value="Nothing in the world comes out of nowhere and goes nowhere... "> 
   <input type="reset" value="Clear"> 
  </form>

<script>
    document.querySelector("form").addEventListener("reset", e => e.preventDefault());
</script>
```

> Reset event does not clear default text (which has been set to the `value` attribute of input element);

Accepting the `reset()` method will reset the form and call `"reset"` event.

```html
<form>
    <input type="text" size="50" value="It all started with the Word and ends with the Word..."/>
    <input type="reset" value="Reset">
    <button type="reset">Reset</button>
    <div id="test"> Reset()</div>
</form>

<script>
  let resetElement = undefined;
    
  document.querySelectorAll("*[type=reset], #test").forEach(element => element.addEventListener("click", e => {
    // store element which must fire reset event
    resetElement = e.target;
  }));

    //call reset() on <form> element when click on the <div>
  document.querySelector("#test").addEventListener("click", e => e.target.parentNode.reset());

  window.addEventListener("reset", e => {
    // log reset event and element which fired it
    console.log(e.type, " has been initiated by: ", resetElement.tagName);
    resetElement = undefined;
  })
</script>
```

### Demo: ResetController

In the demo below a function `ResetController` essentially recreates the logic of the `reset` event cascade. 

The demo:

1. Adds a function `toggleTick` that allows to delay event dispatching;
2. Completely blocks all the native reset events;
3. Then it adds a function `ResetController` that listens for `click`,`focusin` events and `.reset()`;
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
        <legend>Preventable</legend>
        0<input type="range" id="a" value="50">50 +
        <input type="number" id="b" value="50"> =
        <output id="c"></output>
        <hr>
        <input type="text" value="lala"/>
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
        <div type="reset" id="test">Reset()</div>
    </fieldset>
</form>

<form id="two" oninput="c1.value=parseInt(a1.value)+parseInt(b1.value);">
    <fieldset>
        <legend>Not preventable</legend>
        0<input type="range" id="a1" value="50">50 +
        <input type="number" id="b1" value="50"> =
        <output id="c1"></output>
        <hr>
        <input type="text" value="la la la"/>
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
        <div type="reset" id="test1">Reset()</div>
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
    function clearForm(formElement, event) {

      // iterate all children and check if their values are different from default values
      let i = setTimeout(() => {
        for (let element of formElement.elements) {

          if (element.type === "reset")
            continue;
          // we don`t focus on output element and  so this is a best way to clear it
          else if (element.tagName === "OUTPUT")
            element.innerText = "";
          // to reset <select> value and keep inner text - just reset .selectedIndex property
          else if (element.tagName === "SELECT")
            element.selectedIndex = 0;

          let value = element.getAttribute("value") || element.defaultValue;
          if (value)
            element.value = value;
        }
      }, 0);

      //Delay event to dispatch it AFTER click event.
      // toggleClick() fires *BEFORE* setTimeout 0
      toggleTick(() => {
        // dispatch reset event
        formElement.dispatchEvent(event);
        //fires faster than setTineout (i variable). If event has been prevent - clear timeout to avoid form resetting
        if (event.defaultPrevented) {
          clearTimeout(i);
          console.log("defaultPrevented ");
        }
      });
    }


    const ResetController = {


      click: function (e) {
        // check whether target was a reset button and a child of FORM element and is an <input>. It is ok, because only <input>s has .type property
        if (!e.target.type && e.target.type !== "reset")
          return;
        clearForm(e.target.parentElement, new InputEvent("my-reset", {composed: true, bubbles: true, cancelable: true}));
      },

      reset: function () {
        if (this.tagName !== "FORM")
          return;
        clearForm(this, new InputEvent("my-reset", {composed: true, bubbles: true, cancelable: true}))
      }
    };

    window.addEventListener("click", ResetController.click);
    HTMLFormElement.prototype.reset = function (e) {
      ResetController.reset.call(this);
    };

    window.addEventListener("reset", e => e.preventDefault());


    let one = document.querySelector("#one");
    let two = document.querySelector("#two");


    // call .reset() when someone click on <div>
    document.querySelector("#test").addEventListener("click", () => one.reset());
    document.querySelector("#test1").addEventListener("click", () => two.reset());

  })();


  one.addEventListener("my-reset", e => console.log(e.type));
  two.addEventListener("my-reset", e => console.log(e.type));
  two.addEventListener("my-reset", e => e.preventDefault());
</script>
```

### Conclusion

1. The `reset` event make it possible to reset the form to its default values without reloading the page;
2. `.reset()` must be called on the `FORM` element and **not** on the target element; 
3. Since the event is cancelable, the default action  occurs is after the event is activated;
4. Calling `.reset()` activates the callback function inside the attached event listener of the `"reset"` event. This can be used to intercept the event in case it is necessary to prevent the default action .

### References 
1. [MDN: reset event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event);
2. [Spec: Resetting a form](https://www.w3.org/TR/html51/sec-forms.html#resetting-a-form).
