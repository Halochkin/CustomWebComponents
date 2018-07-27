### MultiFingerGestureMixin
MultiFingerGestureMixin allows you to add a multi-touch event to a callback or event. The features of this mixin
is that you can set the required number of touches (when pressed at the same time, will be trigger callback/event) and the maximum duration
(time between the activation of the first and last touch points). 
```javascript
multiFingerStartCallback(detail) / "multifingerstart"
multiFingerCallback(detail) / "multifinger"
draggingEndCallback(detail) / "draggingend"
multiFingerhEndCallback(detail / "multifingerend"
```
To start using an event, you must add a `multifingerEvent()` which return `true`. If you want to use only a callbacks, change "return `true`" to `false` or remove the function.
```javascript
static get multifingerEvent()() {
      return true;
    }
```

If you using more than 1 finger, details mixin return details:

| Detail        | description        | 
| ------------- |:------------------:|
| x             | X coordinates of the point  | 
| y             | Y coordinates    | 
| distX         | distance between points along the X axis    | 
| distY         | Y axis |   
| diagonal      | diagonal|   

In case you use only one finger, details will contain only `x` and `y`.
###

These values must be added to the `multiFingerSettings()`
```javascript
static get multiFingerSettings() {
      return {fingers: 3, maxDuration: 500};
    }
```
While working with multi-touch gestures, some conflicts may occur, which may lead to premature call 
of a function that is called as a result of event activation, for example:
* When you start a gesture that uses 3 fingers, the triggering mechanism is not singular. It can be one finger, then two, then three, 
what can activate other gestures at the same time.
* The excess number of active points will activate the function with fewer points requirements
(for example, if 3 points are required and the user has activated 4-the gesture will be activated).

MultiFingerGestureMixin resolves these conflicts and allows you to work without any problems.

1. First of all, it checks if the number of active touch points.<br>
If their number exceeds the allowed number, the gesture will not be activated, this is done in order to prevent a random call.
2. The gesture begins when the first finger touches the touch surface , and only after that all the others ( like playing the piano)
gesture will not be activated if the user tries to touch all the fingers at the same time (which is quite difficult to do not
intentionally, because the time between touching the first and second finger takes several milliseconds).
3. You can also add the maximum time between the first and last finger mowing. 
If the user will think longer than this time - the gesture is not activated.
### Example
```html
<test-block></test-block>
```

```javascript
import {TriplePinchGesture} from "./TripleFingerGtureMixin.js";

  class TestBlock extends TriplePinchGesture(HTMLElement) {

    constructor() {
      super();
      this.style.marginTop = "175px";
      this.style.marginLeft = "175px";
    }

    static get multiFingerSettings() {
      return {fingers: 3, maxDuration: 500};                          //[1]
    }

    triplePinchStartCallback(e) {
      this.style.boxShadow = " 0px 0px 55px 15px green";              //[2]
    }

    triplePinchEndCallback(e) {
      this.style.boxShadow = "none";                                  //[3]
    }
  }

  customElements.define("test-block", TestBlock);
```
1. Adding the number of touch points and the maximum time for gesture activation.
2. When the gesture is activated, the element will be highlighted with a green shadow.
3. If the user removes at least one finger-the gesture will be deactivated, and the highlight will disappear.
####
[Try it yourself](https://rawgit.com/Halochkin/Components/master/Gestures/MultiFingerGestureMixin/test/index.html)

### References
1. [Multi-touch](https://en.wikipedia.org/wiki/Multi-touch)


