# Pattern: TouchStartAndEndTrigger 
The `TouchStartAndEndTrigger` pattern is made to make it easier for the app to tackle users struggling with keeping fingers off the screen.

### Problem: user can break the multiple gesture
Sometimes, a user might accidentally touch the screen while active and then remove the finger again to correct his error. 
If the mixin does not then switch into "touchend trigger mode", then the user will be confused as to why the app now does not respond 
any longer to his or her gesture.
### Solution: Add three modes:
### 1. start 
 Trigger each time the user activates the "touchstart" event. Here is a check of the number of points that are pressed on the target.<br>
**1.1**  If the number of points is less than the required number - no action will occur but the function will still be active to new presses. <br>
**1.2** If its number is greater than the required number, a new function is called that removes the event listener to add new points 
and adds an event listener to end the touch event.<br>
**1.3** If the number of points equals to the required number, a new function will be called which will add an event listener for 
touchmove. <br> This means that if the user starts moving with an inappropriate number of fingers-the touchmove event listener will not 
be added and no action will be done.
### 2. action
Can be triggered by both start and end events. 
The function checks the event that triggered it. 
**2.1** If this is a "touchstart" event, a function is called that removes the event listener for the "touchmove" event and add listener 
to "touchend".<br>
**2.2** In the case if it was "touchend" event - instead of adding an event listener for "touchend" event - it will be added for
"touchstart" event listener.

### 3. end
This mode as well as start checks the number of points that triggered the event.<br>
**3.1**In the case if its number less then necessary - it will remove the event listener for the "touchent" events and add it to "touchstart"
for the user to retry the gesture activation.<br>
**3.2**If the number is more than necessary, instead of adding an event listener for the "touchstart" event will be added for "touchmove"
so that the user can activate the event by removing the extra number of fingers, and not repeat the event from the beginning.
***
### Example 
Let's look at an example that will change the color of the block depending on the number of fingers pressed. Green is if two, blue is if one, and red is if more than two.
```javascript
class TestBlock extends (HTMLElement) {

    constructor() {
      super();
      this._start = e => this.startTouch(e);
      this._action = e => this.actionTouch(e);
      this._end = e => this.endTouch(e);
      this.settings = {
        fingers: 2                                             //[1] 
      };
    }

    connectedCallback() {
      this.addEventListener("touchstart", this._start);        //[2] 
    }

    disconnectedCallback() {
      this.removeEventListener("touchstart", this._start);
    }


    startTouch(e) {                                            //[3] 
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
        this.changeTriggerFromStartToAction();
      }
    };

    endTouch(e) {
      if (e.targetTouches.length < this.settings.fingers)
        this.changeTriggerFromEndToStart();
      if (e.targetTouches.length > this.settings.fingers)
        this.changeTriggerFromEndToAction();
    };

    actionTouch(e) {
      if (e.type === "touchstart")
        this.changeTriggerFromActionToEnd();
      if (e.type === "touchend")
        this.changeTriggerFromActionToStart();
    }

    changeTriggerFromStartToEnd() {
      this.removeEventListener("touchstart", this._start);
      this.addEventListener("touchend", this._end);
    }

    changeTriggerFromEndToStart() {
      this.removeEventListener("touchend", this._end);
      this.addEventListener("touchstart", this._start);
    }

    changeTriggerFromActionToEnd() {
      this.removeEventListener("touchmove", this._action);
      this.addEventListener("touchend", this._end);
    }

    changeTriggerFromActionToStart() {
      this.removeEventListener("touchmove", this._action);
      this.addEventListener("touchstart", this._start);
    }

    changeTriggerFromStartToAction() {
      // this.removeEventListener("touchstart", this._start);
      this.addEventListener("touchmove", this._action);
    }

    changeTriggerFromEndToAction() {
      this.removeEventListener("touchend", this._end);
      this.addEventListener("touchmove", this._action);
    }
  }

  customElements.define("test-block", TestBlock);   
```
1. Adding the necessary number of points
2. Add an event listener for the first call to the start function
3. Check the number of active points and change the color of the element depending on their number, as well as call functions that
will remove / add the event listener
[Try it](https://rawgit.com/Halochkin/Components/master/Gestures/MultiFingerGestureMixin/demo/pattern.html)
