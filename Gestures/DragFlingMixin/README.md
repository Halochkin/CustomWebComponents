## DragFlingGestureMixin
This mixin allows to translate a sequence of mouse or touch events to callback/event. The advantage of using this mixin is that it can be used for both desktop and mobile versions of the web application. Also, to prevent the selection of text that was in the moved object, it was added `"selectstart"` event which fire `e.preventDefault` and prevented selection of the text.<br>
Below are the ways to call `pinch` or `drag` events. `Drag` can be called at different stages, but `fling` only one, will be called after the end-events ("mouseup"/"touchend" etc.).
```javascript
draggingStartCallback(detail) / "draggingstart"
draggingCallback(detail) / "dragging"
draggingEndCallback(detail) / "draggingend"
flingCallback(detail) / "fling"
```
To start using an event, you must add a `dragEvent()` which return `true`. If you want to use only a callbacks, change "return `true`" to 'false' or remove the function.
```javascript
static get dragEvent() {
      return true;
    }
```
### What is a 'drag' and what is 'fling' What is in common? 
* `Drag` is used to scroll the page/content and, at the same time, but the ability to select text does not supported. <br>
* `Fling` event similar to the [`drag-and-drop`](https://ru.wikipedia.org/wiki/Drag-and-drop) if simply this is a more advanced version of `drag`. <br>
The difference between `fling` and `drag` gestures is that `flingCallback()` / `"flinging"` must match the minimum requirements that create a 'boundary' between the calls to these two events. These requirements are setted to the function `flingSettings()` as object property value. 
```javascript
    static get flingSettings() {
      return {minDistance: 50, minDuration: 200};
    };
```
This means that the user has to change the position of the touch/mouse position by more than 50 pixels in 200 milliseconds.<br>
### Mouse and touch events support. What's next?
Mouse and touch events have different properties, and if you use the same function to calculate their values, conflicts will occur, resulting in an error. To resolve this problem, it was added `this[isTouchActive]` which equals `true` whenever the touchdown is fired. If the `mousedown` event is fired `this[isTouchActive]` will be "false" and separate functions have been made for each type of event. They pass parameters in same form, and have the same default details, based on `makeDetail()`:
```javascript
function makeDetail(event, x, y, startDetail) {  //[1]
  const distX = x - startDetail.x; 
  const distY = y - startDetail.y;
  const distDiag = Math.sqrt(distX * distX + distY * distY);
  const durationMs = event.timeStamp - startDetail.event.timeStamp;
  return {event, x, y, distX, distY, distDiag, durationMs};
}
```
1.where `startDetail` - used for calculation of difference between actual and previous events. In `fling` gesture it is equal to the last event that lasted longer than the minimum duration settings.<br>
Before triggering each callback or event, DragFlingMixin checks for the presence of a corresponding callback or `dragEvent()` in the code.
```javascript
this.draggingStartCallback && this.draggingStartCallback(detail); 
this.constructor.dragEvent && this.dispatchEvent(new CustomEvent("draggingstart", {bubbles: true, detail}));
```
If they are missed, add them, otherwise the mixin will not respond to the action.<br>
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
```html
<fling-ball></fling-ball>
```
```javascript
import {DragFlingGesture} from "../src/DragFlingMixin.js";

  class FlingBall extends DragFlingGesture(HTMLElement) {

    constructor() {
      super();
      this._dragendListener = e => this._onDraggingEnd(e);
      this._dragListener = e => this._onDragging(e);
      this._flingListener = e => this._onFling(e);
    }

      static get dragEvent() {
      return true;
    }

    connectedCallback() {
     super.connectedCallback();    //don't forget about this
     this.addEventListener("dragging", this._dragListener);
    }
    
    disconnectedCallback() {
     super.disconnectedCallback();
     this.removeEventListener("dragging", this._dragListener);
    }

    _onDragging(e) {
      this.innerText = "DRAG";
      this.addEventListener("draggingend", this._dragendListener);
      this.addEventListener("fling", this._flingListener);
    }

    _onDraggingEnd(e) {
      this.style.backgroundColor = "red";
      this.removeEventListener("fling", this._flingListener);
      this.removeEventListener("dragging", this._dragListener);
    }

    _onFling(e) {
      this.style.left = (parseFloat(this.style.left) + e.detail.distX) + "px";
      this.style.top = (parseFloat(this.style.top) + e.detail.distY) + "px";
      this.removeEventListener("draggingend", this._dragendListener);
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


