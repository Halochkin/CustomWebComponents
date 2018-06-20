const selectListener = Symbol("selectstartListener");
const startListener = Symbol("downListener");
const moveListener = Symbol("moveListener");
const mouseStartListener = Symbol("mouseStartListener");
const stopListener = Symbol("pointerUpListener");
const start = Symbol("start");
const move = Symbol("move");
const end = Symbol("end");
const fling = Symbol("fling");
const cachedEvents = Symbol("cachedEvents");
const startDragDetail = Symbol("startDragDetail");
const flingDetail = Symbol("flingDetail");
const isTouchActive = Symbol("isTouchActive");

function findLastEventOlderThan(events, timeTest) {
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].timeStamp < timeTest)
      return events[i];
  }
  return null;
}

function flingAngle(x = 0, y = 0) {
  return ((Math.atan2(y, -x) * 180 / Math.PI) + 270) % 360;
}

/*

This mixin allows to translate a sequence of mouse and touch events to reactive lifecycle hooks:
* `dragGestureCallback(startDetail, dragDetail)`<br>
* `flingGestureCallback(flingDetail)`.<br>
In order for mixin to support work with smartphones it was added touch events.<br>
Also, to prevent the selection of text that was in the moved object, it was added `"selectstart"` event which fire `e.preventDefault`.
  Mixin contain 4 main function:
`[start](e)` - which fired when a pointing device button is pressed on an element by `"mousedown"` event
or touch points are placed on the touch surface (`"touchstart"` event).
`[move](e)` -  is fired when a pointing device (usually a mouse) is stert moving while over an element by
"touchmove" or "mousemove" events.
`[moved](e)` - trigger `dragGestureCallback(dragDetail)` which contain:
* distX - distanceX (Y)
* distY
* x  actual coordinates X (Y)
* y
* pointerevent
* startDragging<br>
`[end](e)` - can be triggered by four events:
`"touchend"` - is fired when one or more touch points are removed from the touch surface;
`"touchcancel"` - is fired when one or more touch points have been disrupted in an implementation-specific manner (for example, too many touch points are created).
`"mouseup"` - is fired when a pointing device button is released over an element.
`"mouseout"` - is fired when a pointing device (usually a mouse) is moved off the element that has the listener attached or off one of its children.

The first `[end](e)` calls `[fling](e)` which triggered `flingGestureCallback(flinfDetail)` only if the last dragging event moved minimum `50px` in one direction during the last `200ms`.
The minimum distance and duration can be changed using these properties on the element
```javascript
    .flingSettings.minDistance = 50;
    .flingSettings.minDuration = 200;
```
  `flingGestureCallback(flinfDetail)` contain:
  * angle: flingAngle(distX, distY),
* distX - distanceX (Y)
* distY
* diagonalPx
* durationMs
* flingX
* fling value (use for `style.left = flingX + 'px'`)
* flingY
* x
* xSpeedPxMs
*  y
* ySpeedPxMs<br>
Events Touch and mouse have different properties and to solve this problem, it was added `this[isTouchActive]`property which equals `true` whenever the touchdown is fired. If the `mousedown` event is fired `this[isTouchActive]` will be "false".
  The angle starts at 12 o'clock and counts clockwise from 0 to 360 degrees.
* up/north:     0
* right/east:  90
* down/south: 180
* left/west:  270
 * @param Base
 * @returns {DragFlingGesture}
 */
export const DragFlingGesture = function (Base) {
  return class extends Base {

    constructor() {
      super();
      this[selectListener] = e => e.preventDefault() && false;
      this[startListener] = e => this[start](e);
      this[mouseStartListener] = e => this[start](e);
      this[moveListener] = e => this[move](e);
      this[stopListener] = e => this[end](e);
      this[cachedEvents] = undefined;
      this[startDragDetail] = undefined;
      this[flingDetail] = undefined;
      this.flingSettings = {minDistance: 50, minDuration: 200};
    }

    connectedCallback() {
      if (super.connectedCallback) super.connectedCallback();
      this.addEventListener("selectstart", this[selectListener]);
      this.addEventListener("touchstart", this[startListener]);
      this.addEventListener("mousedown", this[mouseStartListener]);
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) super.disconnectedCallback();
      this.removeEventListener("selectstart", this[selectListener]);
      this.removeEventListener("touchstart", this[startListener]);
      this.removeEventListener("mousedown", this[startListener]);
    }

    [start](e) {
      this[cachedEvents] = [e];
      this[isTouchActive] = (e.type === "touchstart");
      if (this[isTouchActive] && e.targetTouches.length < 4) { //Added restriction on the number of fingers  //todo Should I add it or not?
        this.addEventListener("touchmove", this[moveListener]);
        this.addEventListener("touchend", this[stopListener]);
        this.addEventListener("touchcancel", this[stopListener]);
      }
      if (!this[isTouchActive])
        this.addEventListener("mousemove", this[moveListener]);
      this.addEventListener("mouseup", this[stopListener]);
      this.addEventListener("mouseout", this[stopListener]);     //todo make sure that 'mouseOUT' is the same as 'touchCANCEL' (only for mouse events)
      this[startDragDetail] = {
        touchevent: e,
        x: this[isTouchActive] ? e.targetTouches[0].pageX : e.x,
        y: this[isTouchActive] ? e.targetTouches[0].pageY : e.y,
        startDragTime: e.timeStamp
      };
    }

    [move](e) {
      const prevEvent = this[cachedEvents][this[cachedEvents].length - 1];
      this[cachedEvents].push(e);
      let detail = {
        distX: this[isTouchActive] ? e.targetTouches[0].pageX - prevEvent.targetTouches[0].pageX : e.x - prevEvent.x,
        distY: this[isTouchActive] ? e.targetTouches[0].pageY - prevEvent.targetTouches[0].pageY : e.y - prevEvent.y,
        x: this[isTouchActive] ? e.targetTouches[0].pageX : e.x,
        y: this[isTouchActive] ? e.targetTouches[0].pageY : e.y,
        pointerevent: e,
        startDragging: this[startDragDetail]
      };
      detail.diagonalPx = Math.sqrt(detail.distX * detail.distX + detail.distY * detail.distY);
      detail.durationMs = e.timeStamp - prevEvent.timeStamp;
      detail.speedPxMs = detail.diagonalPx / detail.durationMs;
      this.dragGestureCallback(this[startDragDetail], detail);
    }

    [end](e) {
      this[fling](e);
      this.removeEventListener("touchmove", this[moveListener]);
      this.removeEventListener("touchend", this[stopListener]);
      this.removeEventListener("touchcancel", this[stopListener]);
      this.removeEventListener("mousemove", this[moveListener]);
      this.removeEventListener("mouseup", this[stopListener]);
      this.removeEventListener("mouseout", this[stopListener]);
      this[cachedEvents] = undefined;
      this[startDragDetail] = undefined;
      this[isTouchActive] = undefined;
    }

    [fling](e) {
      let endTime = e.timeStamp;
      const stopEvent = this[cachedEvents][this[cachedEvents].length - 1];
      const flingTime = endTime - this.flingSettings.minDuration;
      const startEvent = findLastEventOlderThan(this[cachedEvents], flingTime);
      if (!startEvent)
        return;
      const x = this[isTouchActive] ? stopEvent.targetTouches[0].pageX : stopEvent.x;
      const y = this[isTouchActive] ? stopEvent.targetTouches[0].pageY : stopEvent.y;
      const distX = this[isTouchActive] ? x - startEvent.targetTouches[0].pageX : x - startEvent.x;
      const distY = this[isTouchActive] ? y - startEvent.targetTouches[0].pageY : y - startEvent.y;
      const diagonalPx = Math.sqrt(distX * distX + distY * distY);
      const durationMs = endTime - startEvent.timeStamp;
      const xSpeedPxMs = distX / durationMs;
      const ySpeedPxMs = distY / durationMs;
      const flingX = xSpeedPxMs * durationMs;
      const flingY = ySpeedPxMs * durationMs;
      if (diagonalPx < this.flingSettings.minDistance)
        return;
      this[flingDetail] = {
        angle: flingAngle(distX, distY),
        distX,
        distY,
        diagonalPx,
        durationMs,
        flingX,
        flingY,
        x,
        xSpeedPxMs,
        y,
        ySpeedPxMs,
        flingTime,
        cashedEvent: this[cachedEvents]
      };
      this.flingGestureCallback(this[flingDetail]);
      this[flingDetail] = undefined;
    };
  }
};
