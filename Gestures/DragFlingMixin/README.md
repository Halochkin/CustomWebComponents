## DragFlingGestureMixin
This mixin allows to translate a sequence of mouse or touch events to callback/event. The advantage of using this mixin is that it can be used for both desktop and mobile versions of the web application. Also, to prevent the selection of text that was in the moved object, it was added `"selectstart"` event which fire `e.preventDefault` and prevented selection of the text.
### How to start?
Using a  [DragFlingMixin](https://github.com/Halochkin/Components/blob/master/Gestures/DragFlingMixin/src/DragFlingGestureMixin.js) begins with the import.
```javascript
      import {DragFlingGesture} from "../src/DragFlingMixin.js";
      
      class ExampleClass extends DragFlingGesture(HTMLElement) {
       //some stuff
       }
```
Also you can make an import from [rawgit.com](https://rawgit.com/).

### Work with mouse and touch events. What is next?
Mouse and touch events have different transferred properties and to solve this problem, it was added `this[isTouchActive]` which equals `true` whenever the touchdown is fired. If the `mousedown` event is fired `this[isTouchActive]` will be "false".
To prevent conflicts between the two event types when counting details, separate functions have been made for each. They pass parameters in same form, and have the same standard details, based on `makeDetail()`:
```javascript
// where startDetail - used for calculation of difference between actual and previous events
function makeDetail(event, x, y, startDetail) {
  const distX = x - startDetail.x; 
  const distY = y - startDetail.y;
  const distDiag = Math.sqrt(distX * distX + distY * distY);
  const durationMs = event.timeStamp - startDetail.event.timeStamp;
  return {event, x, y, distX, distY, distDiag, durationMs};
}
```
Below are the ways to call pinch or drag events. `Drag` can be called at different stages, but `fling` only one, will be called after the end-events ("mouseup"/"touchend" etc.).
```javascript
draggingStartCallback(detail) / "draggingstart"
draggingCallback(detail) / "dragging"
draggingEndCallback(detail) / "draggingend"
flingCallback(detail) / "fling"
```
To start using an event, you must add a `pinchEvent()` which return `true`. If you want to use only a callbacks, change "return `true`" to 'false' or remove the function.
```javascript
static get pinchEvent() {
      return true;
    }
```
Before triggering each callback or event, DragFlingMixin checks for the presence of a corresponding callback or `pinchEvent()` in the code.
```javascript
this.draggingStartCallback && this.draggingStartCallback(detail); 
this.constructor.dragEvent && this.dispatchEvent(new CustomEvent("draggingstart", {bubbles: true, detail}));
```
If they are missed, add them, otherwise the mixin will not respond to the action.

### What is a 'drag' and what is 'fling' What is in common? 
`Drag` is used to scroll the page/content and, at the same time, but the ability to select text does not supported.
`Fling` event similar to the [`drag-and-drop`](https://ru.wikipedia.org/wiki/Drag-and-drop) and the difference between `fling` and `drag` gestures is that `flingCallback()` / "flinging" must match the minimum requirements that create a 'boundary' between the calls to these two events. These requirements are setted to the function `flingSettings()` as object property value. Other gesture-mixins work on the same principle.
   The `minDistance` and `minDuration` can be changed using these properties on the element
   ```javascript
    .flingSettings.minDistance = 50;
    .flingSettings.minDuration = 200;
```
In addition to the default list of details, `flingCallback(detail)` has a new value of detail - `angle`.
`Angle` - equal to the angle between two touch points and gets from `flingAngle()`.

```javascript
function flingAngle(x = 0, y = 0) {
  return ((Math.atan2(y, -x) * 180 / Math.PI) + 270) % 360;
}
```
The angle starts at 12 o'clock and counts clockwise from 0 to 360 degrees.
   * up/north:   0
   * right/east: 90
   * down/south: 180
   * left/west:  270
   
[Try the difference between `drag` and `fling` gestures here](https://rawgit.com/Halochkin/Components/master/Gestures/GesturesTest1.html)
### Example
To resolve conflicts, it is good practice to use a [InvadeAndRetreat Pattern](https://github.com/orstavik/JoiComponents/blob/master/book/chapter3/Pattern2_InvadeAndRetreat.md). 
I want to remind that when you are using a [functional mixin](https://github.com/orstavik/JoiComponents/blob/master/book/chapter2/Pattern2_FunctionalMixin.md) that uses `connectedCallback` and `disconnectedCallback`,
**you must remember to call `super.connectedCallback` and `super.disconnectedCallback`** in the component itself. 
If you forget this, you will not get an Error, but the functional mixin will not be activated or deactivated.
This closely resemble the compulsory call to `super()` in the `constructor()` of any class that extends another class. 
```javascript
import {DragFlingGesture} from "../src/DragFlingMixin.js";

  class FlingBall extends DragFlingGesture(HTMLElement) {

    constructor() {
      super();
      this._dragstartListener = e => this._onDraggingStart(e);
      this._dragendListener = e => this._onDraggingEnd(e);
      this._dragListener = e => this._onDragging(e);
      this._flingListener = e => this._onFling(e);
    }

      static get dragEvent() {
      return true;
    }

    connectedCallback() {
      super.connectedCallback();  //don't forget this
      this.addEventListener("draggingstart", this._dragstartListener);
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.removeEventListener("draggingstart", this._dragstartListener);
    }
   _onDraggingStart(e) {
      this.style.backgroundColor = "red";
      this.addEventListener("dragging", this._dragListener);
    }

    _onDragging(e) {
      this.style.transition = undefined;
      this.style.left = (parseFloat(this.style.left) + e.detail.distX) + "px";
      this.style.top = (parseFloat(this.style.top) + e.detail.distY) + "px";
      this.addEventListener("draggingend", this._dragendListener);
      this.addEventListener("fling", this._flingListener);
    }

    _onDraggingEnd(e) {
      this.style.backgroundColor = "unset";
      this.removeEventListener("draggingend", this._dragendListener);
      this.removeEventListener("fling", this._flingListener);
      this.removeEventListener("dragging", this._dragListener);
    }

    _onFling(e) {
      this.style.transition = "all " + e.detail.durationMs + "ms cubic-bezier(0.39, 0.58, 0.57, 1)";
      this.style.left = (parseFloat(this.style.left) + e.detail.distX) + "px";
      this.style.top = (parseFloat(this.style.top) + e.detail.distY) + "px";
    }
  }
 customElements.define("fling-ball", FlingBall);
```
[Try it on codepen](https://codepen.io/Halochkin/pen/JZBWQp?editors=0010)
### Reference
* [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)
* [DragEvent](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent)
* [Touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
* [FunctionalMixins](https://github.com/orstavik/JoiComponents/blob/master/book/chapter2/Pattern2_FunctionalMixin.md)
* [Touch and mouse conflict](https://github.com/orstavik/JoiComponents/blob/master/book/chapter3/Problem_touch_the_mouse.md)


