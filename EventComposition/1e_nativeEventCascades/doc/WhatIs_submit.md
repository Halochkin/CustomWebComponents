# What is `submit` ?

The submit event fires when a <form> is submitted. It is usually used to check (validate) the form before it is submitted to the server or to prevent it from being sent and processed using JavaScript.


There are three ways to submit a form:

1. Press the `<input type="submit">`, `<input type="image">` or `<button type="submit"> Submit </button>` element;
    #### Example
    ```html
    <form>
      <input type="text" value="I didn't say it would be easy. I just promised to tell the truth.">
      
      <input type="submit">
      <input type="image" src="https://via.placeholder.com/150" width="50">
      <button type="submit"> Submit </button>   
    </form>
   
   <script>
       window.addEventListener("submit", e => {
        e.preventDefault();
        console.log("Wait, how about a cup of tea?");
       });
   </script>
    ```
   
2. Press `Enter` while focus on a field;
    > When submitting a form by pressing `Enter` in the text field, the `click` event is generated on the button `<input type="submit">`. 
    
    There are several features to use the enter key to submit a form:
    1. If there are several submit buttons, click event will be generate on top button in DOM tree order;
       #### Example
       ```html
               <form>
                   <input type="text" value="Press Enter key">
                   <input type="submit">
                   <button type="submit">Submit</button>
               </form>
               
               <script>
                 let one = document.querySelector("input[type=submit]");
                 let two = document.querySelector("button");
               
                 function log(e) {
                   console.log(e.type, " event on ", e.target.tagName);
                 }
               
                 one.addEventListener("click", e => log(e));
                 two.addEventListener("click", e => log(e)); // no click
                 window.addEventListener("submit", e => log(e));
               </script>
       ```
   
    2. If there is one `<input>` in the `<form>` - `submit` event will trigger even if there is no submit button. `Click` event will not be generated;
       #### Example
       ```html
               <form>
                   <input type="text" value="Press Enter key">
               </form>
               
               <script>
                 function log(e) {
                   console.log(e.type, " event on ", e.target.tagName);
                 }
               
                 window.addEventListener("click", e => log(e)); //no click
                 window.addEventListener("submit", e => log(e));
               </script>
       ```    
    3. If there are several `<input>` in the `<form>` and there is no submit button - submit event will **not** fire.
       #### Example
       ```html
               <form>
                   <input type="text" value="Press Enter key">
                   <input type="text" value="Press Enter key here too">
               </form>
               
               <script>
                 function log(e) {
                   console.log(e.type, " event on ", e.target.tagName);
                 }
               
                 window.addEventListener("submit", e => log(e)); //not fire
               </script>
       ```    

3. Call `.submit() / .requestSubmit()` on `<form>` element.
   To send the form to the server manually, we can call the `form.submit()` or `.requestSubmit()` methods. If we try to use `.submit()` - form submits but `submit` event is not fires. It is assumed that if the programmer calls `form.submit()`, then the script already did all related processing.
   
  > Since the verification is performed only when the first two methods are used - trying to submit a form that does not pass validation triggers an invalid event. In this case, the validation prevents form submission, and thus there is no submit event.
    
 This means that the browser does not guarantee that the data entered in the field with a certain type of data meets the requirements. For example, if the user inserts text into `<input type="number">` and tries to send a form. So `submit()` just sends the form, but that's all it does.
 
 For the browser to validate the entered data there is a `.requestSubmit()` method. `.requestSubmit()` acts as if the submit button was pressed. The content of the form is checked, and the form is only sent if it is checked successfully. Once the form is submitted, the submit event is sent to the form object.
 
 To understand the difference, consider a small example
   #### Example
    
   ```html
       <form>
           <input type="text" value="Hello sunshine!"/>
           <input type="submit">
           <div id="one"> submit()</div>
           <div id="two"> requestSubmit()</div>
       </form>
       
       <script>
         document.querySelector("#one").addEventListener("click", e => e.target.parentNode.submit());
         document.querySelector("#two").addEventListener("click", e => e.target.parentNode.requestSubmit());
       
         window.addEventListener("", e => { //not fires
           e.preventDefault();
           console.log("submit event has been initiated by: #", submitElement.id); 
         });
       </script>
   ```

 ### Demo: SubmitController
 //todo: add description
 
 ```html
<form name="one" id="one">
    <fieldset>
        <legend>Click "Submit" button or press Enter</legend>
        <input type="text" value="Tell us your story" name="story">
        <input type="text" value="Tell us your story" name="story">
        <br>
        <input id="a" type="submit">
        <!--        set custom attribute-->
        <div type="submit" id="b"> requestSubmit(button)</div>
        <div type="submit" id="c"> requestSubmit()</div>
    </fieldset>
</form>

<form id="two">
    <fieldset>
        <legend>Click the "Submit" button, but it will not help).</legend>
        <input type="text" value="Tell us your story" name="story">
        <input type="text" value="Tell us your story" name="story">
        <br>
        <input id="a1" type="submit">
        <!--        set custom attribute-->
        <div type="submit" id="b1"> requestSubmit(button)</div>
        <div type="submit" id="c1"> requestSubmit()</div>
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

    const SubmitController = {
      state: new WeakMap(),
      submitEvent: new InputEvent("my-submit", {composed: true, bubbles: true, cancelable: true}),


      beforeinput: function (e) {
        // here we handle Enter key press submitting
        let formElement = e.target.form;

        // we can use only Enter key
        if (e.inputType !== "insertLineBreak" || !formElement)
          return;

        // check how many allowed input elements (not type=reset/submit) are located in the form
        let inputs = formElement.querySelectorAll("input:not([type=reset]):not([type=submit])").length;
        // select first submit button (default button according to spec)
        let firstSubmitButton = formElement.querySelector("input[type=submit]");

        // According to spec(https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission)
        // 1. if 1 or several inputs and one or several submit buttons - click() on first one (default button) and then submit
        if (inputs >= 1 && firstSubmitButton)
          firstSubmitButton.click(); //click: will handle it
        //2. if only 1 input  - fire submit event on <form> (even without submit button)
        else if (inputs === 1) {
          // delay event to make it possible to prevent it
          toggleTick(() => {
            formElement.dispatchEvent(SubmitController.submitEvent);
            if (SubmitController.submitEvent.defaultPrevented) {
              clearTimeout(i);
              console.log("defaultPrevented ");
            }
          });
          //fires after toggleClick to provide default action preventation
          let i = setTimeout(() => {
            console.log("do default action here");
          }, 0);
        }
      },

      click: function (e) {
        let formElement = e.target.form;
        let val = e.target.getAttribute("type");
        if (e.target.type && e.target.type !== "submit" || val !== "submit" || !formElement)
          return;

        toggleTick(() => {
          formElement.dispatchEvent(SubmitController.submitEvent);
          if (SubmitController.submitEvent.defaultPrevented) {
            clearTimeout(i);
            console.log("defaultPrevented ");
          }
        });

        let i = setTimeout(() => {
          console.log("do default action here");
        }, 0);
      },

      requestSubmit: function (submitButton) {

        // some browsers can not support .requestSubmit()
        toggleTick(() => {
          this.dispatchEvent(SubmitController.submitEvent);
          if (SubmitController.submitEvent.defaultPrevented) {
            clearTimeout(i);
            console.log("defaultPrevented ");
          }
        });

        let i = setTimeout(() => {
          console.log("do default action here");
        }, 0);
      }
    };

    // we can fire submit event using Enter key or click on the submit button , but we have several conditions defined in spec
    window.addEventListener("beforeinput", SubmitController.beforeinput.bind(this), true);
    // window.addEventListener("focusin", SubmitController.focusin, true);
    window.addEventListener("click", SubmitController.click, true);
    //no event, because it can be called programmatically and not based on event.
    // not use arrow function here, because this keyword refers to window object
    HTMLFormElement.prototype.requestSubmit = function (submitter) {
      SubmitController.requestSubmit.call(this)
    };
  })();


  window.addEventListener("submit", e => e.preventDefault());
  // we need to block "beforeinput" event because by default it provides .click on submit button by default. We already have such custom click and we dont need 2 clicks;
  window.addEventListener("beforeinput", e => e.preventDefault());


  let one = document.querySelector("#one");
  let two = document.querySelector("#two");

  let button = document.querySelector("#a");
  let button1 = document.querySelector("#a1");

  //form 1, must log "do default action here"
  document.querySelector("#b").addEventListener("click", () => one.requestSubmit(button));
  document.querySelector("#c").addEventListener("click", () => one.requestSubmit());

  //form 2 preventable, must log "defaultPrevented"
  document.querySelector("#b1").addEventListener("click", () => two.requestSubmit(button1));
  document.querySelector("#c1").addEventListener("click", () => two.requestSubmit());

  one.addEventListener("my-submit", e => console.warn(e.type));
  two.addEventListener("my-submit", e => console.warn(e.type));
  two.addEventListener("my-submit", e => e.preventDefault());


  window.addEventListener("click", e=> console.log(e.type, " on ", e.target.id))

</script>
```











