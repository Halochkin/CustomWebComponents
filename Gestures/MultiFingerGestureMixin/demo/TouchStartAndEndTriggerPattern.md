# Pattern: TouchStartAndEndTrigger 
The `TouchStartAndEndTrigger` pattern is made to make it easier for the app to tackle users struggling with keeping fingers off the screen.

### Problems: 
#### 1. User can break the multiple gesture
Sometimes, a user might accidentally touch the screen while active and then remove the finger again to correct his error. 
If the mixin does not then switch into "touchend trigger mode", then the user will be confused as to why the app now does not respond 
any longer to his or her gesture.<br>
#### 2. How to remove all event listeners when user close a tab?
Also, all listeners are subject to the same problem - when an element is deleted, `disconnectedCallback` is not called.<br>
This means that if the user closes the tab - `disconnectedCallback` is not called and event listeners will not be removed (More detailed description of the problem in [unloadCallbackMixin](https://github.com/Halochkin/Components/tree/master/unloadCallbackMixin);

### Solution
 `actionMode` has been added to register the addition of the "touchmove" event listener. As about the event listeners for "touchstart" and "touchend" events, they are added in `connectedCallback()`. The final removing of all event listener occurs in the `disconnectedCallback()`, which will first remove the listeners for "touchstart" and "touchend" events and then and then check activation of the `actionMode`.<br>
For each event, a separate function is created that handles the details of the event:
### 1. "touchstart"
 Here is a check of the number of start points that are pressed on the target.<br>
**1.1**  If the number of points is less than the required number - no action will occur but the function will still be active to new presses. <br>
**1.2** If its number is greater than the required number, a new function is called that remove the event listener for "touchstart" and adds an event listener for "touchend" events. This is done to the user only removed the extra fingers, and did not take and then again added an extra number. If this happens-the gesture will not register them, because the required number of fingers has already been activated and the event was triggered.<br> 
**1.3** If the number of points equals to the required number, a new function will be called which will add an event listener for 
"touchmove" event and activate `actionMode`. <br> This means that if the user starts moving with an inappropriate number of fingers - "touchmove" event listener will not be added and no action will be done.
### 2. "touchmove"
**2.1** Only removes the event listener for the "touchmove" event.<br>
### 3. "touchend"
Here as well as "touchstart" checks the number of points that triggered the event.<br>
**3.1**In the case if its number less than necessary - it will add the event listener for the "touchstart" so that the user can add the necessary number of touch points.<br>
**3.2**If the number is greater than necessary, an event listener will be added for the "touchmove" event so that the user can activate the event by removing the additional number of fingers rather than repeating the event from the beginning.<br>
As mentioned earlier, in case the user closes the tab `disconnectedCallback` is not called. To resolve this problem and remove the event listener in any case, use `unloadCallbackMixin`. 
***
### Example 
Let's look at an example that will change the color of the block depending on the number of fingers pressed. Green is if two, blue is if one, and red is if more than two.
```javascript

  import {UnloadCallbackMixin} from "https://rawgit.com/Halochkin/Components/master/unloadCallbackMixin/src/unloadCallbackMixin.js"

 class TestBlock extends UnloadCallbackMixin(HTMLElement) { 

    constructor() {
      super();
      this._start = e => this.startTouch(e);
      this._action = e => this.actionTouch(e);
      this._end = e => this.endTouch(e);
      this._deleteElem = e => this.deleteCustomElemen(e);
      this.settings = {
        fingers: 2                                           //[1]
      };
    }

    connectedCallback() {                                    //[2]
      this.addEventListener("touchstart", this._start);
      this.addEventListener("touchend", this._end);
      document.querySelector("input").addEventListener("click", this._deleteElem);
    }

    disconnectedCallback() {                                 //[]
      this.removeEventListener("touchstart", this._start);
      this.removeEventListener("touchend", this._end);
      if (this._actionMode) {
        this._actionMode = false;
        window.removeEventListener("touchmove", this._action);
      }
    }

   unloadCallback() {                                        //[3]
      super.disconnectedCallback();
    }

    startTouch(e) {                                          //[4]
      if (e.targetTouches.length < this.settings.fingers) {
        this.style.backgroundColor = "blue";
        return;
      }
      if (e.targetTouches.length > this.settings.fingers) {
        this.style.backgroundColor = "red";
        this.changeTriggerFromStartToEnd();
      }
      if (e.targetTouches.length === this.settings.fingers) {
        this.style.backgroundColor = "green";
        this.actionMode();
      }
    };
 
    endTouch(e) {                                            //[5]
      if (e.targetTouches.length < this.settings.fingers) {
        this.style.backgroundColor = "blue";
        this.addEventListener("touchstart", this._start);
      }
      if (e.targetTouches.length > this.settings.fingers)
        this.actionMode();
      if (e.targetTouches.length === this.settings.fingers)
        this.style.backgroundColor = "green";
    };

    actionTouch(e) {                                          //[6]
      this.removeEventListener("touchmove", this._action);
    }

    changeTriggerFromStartToEnd() {                           
      this.removeEventListener("touchstart", this._start);
      this.addEventListener("touchend", this._end);
    }

    actionMode() {                                            
      this.addEventListener("touchmove", this._action);
      this._actionMode = true;
    }
  }

  customElements.define("test-block", TestBlock);
```
***
1. Adding the necessary number of points.
2. Add an event listener for the first call to the start function.
3. Add an `unloadCallback()` which will call `disconnectedCallback()` when the user closes the tab.
4. The function that is called as a result of activation "touchstart" event. It checks the number of active touch starting points and changes their color.
5. "touchend" event function - checks the number of active points that have been changed.
6. "touchmove" event function - it just remove an event listener.
[Try it](https://rawgit.com/Halochkin/Components/master/Gestures/MultiFingerGestureMixin/demo/pattern.html)
