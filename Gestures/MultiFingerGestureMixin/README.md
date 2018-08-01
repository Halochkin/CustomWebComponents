### Mixin: MultiTouchGesture
`MultiFingerGestureMixin` allows to add a sequence of touch events to a callback or event. 
### Problem 1: Conflicts with calling multi-touch events
When working with multi-touch gestures, conflicts can occur that can lead to false activation of the event, for example:
* When you start a gesture that uses 3 fingers, the triggering mechanism is not singular. It can be one finger, then two, then three, 
what can activate other gestures at the same time.
* Excessive number of active points activates a function with fewer requirements, for example if the gesture requires 3 active points, but the user pressed 4 points - than activated the gesture.
* If the center of point-1 is too small a distance to the center of point - 2, the device can treat them as a single point. 
### MultiTouchGestureMixin
MultiFingerGestureMixin allows you to avoid these conflicts :
1. First of all, it checks the number of active touch points. If the number of calls exceeds the allowed number, the gesture will not be activated, this is done in order to prevent accidental calls.
2. The gesture begins when the first finger touches the touch surface, and only after that all the others (like playing the piano). It will not be activated if the user tries to touch all the fingers at the same time (which is quite difficult to do intentionally, because the time between touching the first and the second finger takes a few milliseconds).
3. A feature of this mixin is that you can set the required number of touches and the maximum duration between the first and last touch. If the user will think longer than this time - the gesture is not activated. These values must be added to the `multiFingerSettings()`.

```javascript
static get multiFingerSettings() {
      return {fingers: 3, maxDuration: 500};
    }
```

So the mixin provides three options for callbacks and similar events, which depend on the stage of the event.

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

If you using only one touch-point, mixin return next details:

| Detail        | description        | 
| ------------- |:------------------:|
| x             | X coordinates of the point  | 
| y             | Y coordinates    | 
| length         | number of active touch points on a target | 

In case if user use more than one touch-point, to details will be added an `coordArr` array which contain:

| Array element | description        | 
| ------------- |:------------------:|
| distX         | distance between previous and actual points along the X axis    | 
| distY         | Y axis |   
| diagonal      | diagonal|   


These values must be added to the `multiFingerSettings()`

While working with multi-touch gestures, some conflicts may occur, which may lead to premature call 
of a function that is called as a result of event activation, for example:
* When you start a gesture that uses 3 fingers, the triggering mechanism is not singular. It can be one finger, then two, then three, 
what can activate other gestures at the same time.
* The excess number of active points will activate the function with fewer points requirements
(for example, if 3 points are required and the user has activated 4-the gesture will be activated).
***
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
***
### Discussion: Some guidelines for UI for using multi-touch gestures
The main problem is if the center of the pointer 1 is too close to the center of the pointer 2, then the device will consider them as `one` pointer. The bad news is that this value can be different and depends on the physical parameters of the display and cannot be changed programmatically.<br>
   A large number of manuals for operating systems and OEM (Original Equipment Manufacturer – official equipment suppliers) indicate the target area of touch, the size of which is less than the values confirmed by a large number of scientific studies. For example, Apple's guide determines the size of the target touch area at `44 pixels`-but this is not a physical quantity. When designing interfaces with touch screens, you need to rely on the physical size, expressed in millimeters, inches, or points.<br>
 Nokia and Microsoft insist on the optimal value of `7 mm`. the distance between the touch points should be at least 2 mm. Other standards recommend setting the size of the buttons from 9.5 mm.<br>
      This means that the size of the element to which you add a multi-touch gesture must be large enough to fit several touch points freely on its area, and the distance between their centers must be relatively large for easy movement.<br>
      Also, if an item has several small buttons that can be pressed at the same time, the distance between them should be greater than the minimum size at which two touch points will be identified as one. As I mentioned above, in different devices this size is different and it is quite difficult to determine the average value. But our task is to develop universal applications that will be supported by different devices.

[Try the demo by yourself](https://rawgit.com/Halochkin/Components/master/Gestures/MultiFingerGestureMixin/test/index.html)


### References
1. [Multi-touch](https://en.wikipedia.org/wiki/Multi-touch)


