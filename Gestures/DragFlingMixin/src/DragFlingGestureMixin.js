const selectListener = Symbol("selectstartListener");
const touchStartListener = Symbol("downListener");
const touchMoveListener = Symbol("touchMoveListener");
const touchStopListener = Symbol("touchStopListener");
const mouseStartListener = Symbol("mouseStartListener");
const mouseMoveListener = Symbol("mouseMoveListener");
const mouseStopListener = Symbol("mouseStopListener");
const touchStart = Symbol("touchStart");
const touchMove = Symbol("touchMove");
const touchStop = Symbol("touchStop");
const mouseStart = Symbol("mouseStart");
const mouseMove = Symbol("mouseMove");
const mouseStop = Symbol("mouseStop");
const fling = Symbol("fling");
const isFlingable = Symbol("isFlingable");
const flingable = Symbol("flingable");

const move = Symbol("move");

const cachedEvents = Symbol("cachedEvents");
const active = Symbol("active");
const activeEventOrCallback = Symbol("activeEventOrCallback");
const eventAndOrCallback = Symbol("callbackAndOrEvent");

function findLastEventOlderThan(events, timeTest) {
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].event.timeStamp < timeTest)
      return events[i];
  }
  return null;
}

function flingAngle(x = 0, y = 0) {
  return ((Math.atan2(y, -x) * 180 / Math.PI) + 270) % 360;
}

function makeDetail(event, x, y, startDetail) {
  const distX = x - startDetail.x;
  const distY = y - startDetail.y;
  const distDiag = Math.sqrt(distX * distX + distY * distY);
  const durationMs = event.timeStamp - startDetail.event.timeStamp;
  return {event, x, y, distX, distY, distDiag, durationMs};
}

/*
This mixin allows to translate the sequence of mouse and touch events to the hooks of the reactive life cycle:
* 'dragGestureCallback(startDetail, dragDetail)' <br>
* 'flingGestureCallback (flingDetail)`.<bromine>
Touch events have been added to support mixin with smartphones.
In addition, to prevent the text selection that is activated when the object is moved, a selectstart event was added that fires.preventDefault".
Mixin contains the following functions:
You can use mouse events and touch:
- [mouseStart] (e) when you activate the start mouse event `mousedown events';
- [touchStart] (e); to the beginning of touch events "touchstart"
This is done to prevent conflicts. Conflicts can occur because mouse events and touch events have different ways of obtaining coordinates. For example, the path to the x-coordinate of the mouse is E. X` and for the touch event is `E. targetTouches[0].pageX'.
The Touch and mouse events have different properties, and to solve this problem, the "this[isTouchActive] "property has been added, which is set to" true " whenever a touchdown is triggered. If `event-mousedown` event `is[isTouchActive] is "false".
  The angle starts at 12 o'clock and is measured clockwise from 0 to 360 degrees.
The result of both functions is 'draggingStartCallback (details)' and sending 'draggingstart' events with details.
Where details = {
 event: all information about the event
 x: x-coordinate position
 y: Y-coordinates
}
Event movement act on a similar principle. They are triggered when the mouse/touch point is moved and, depending on the type, call the `[mouseMove](e)` and `[touchMove](e)` functions to bring X, Y and the coordinates of different events into one format and call the `[move](event, x, y)`function.
The result of the function is a call to the isflingable(e) and 'draggingCallback(part)/`drag'.
'details 'is calculated as a result of the' makeDetail(event, x, y, startDetail) ' function, where:
 event - information about the current event
 x - position x-coordinates
 Y-the y coordinate of the
 startDetail is the initial event that is used to calculate the difference between the actual and preliminary events.
Returns the makeDetail () function :
{
distX is the difference between the actual and predyduschim event on the X-axis
distY-Y axis
distDiag-diagonal
durationMs-duration
}
The isflingable(e) function is a function that notifies the user when the conditions for the `fling` event have been met.

For this function `[move]` checks the fulfillment of the terms of which parts of the event "drag" and "fling".
These conditions are added to the static flingSettings function()
where` ' javascript{
      minDistance: 50-minimum distance
      minDuration: 150 - minimum continuing events
    } " `
In order to determine the continuation of an event, you need to define an event that is greater than the minimum duration condition. To do this, use the function `findLastEventOlderThan (events, timeTest) ' where
events-an array of all events, timeTest - event.timeStamp - the minimum value of the length.
Stop events are executed by the same Prince as the start of the event. For mouse events `[mouseStop](e)`, for touch events - `[touchStop] (e)`. The result of both functions is a call `[fling](e, x, y)` and draggingEndCallback (detail) / "draggingend" where details = {
 event: all information about the event
 x: x-coordinate position
 y: Y-coordinates
}
Function [fling](e, x, y) is `flingCallback(detail)` where in addition to parts of makeDetail()` is the angle of flingAngle(detail.distX, detail.distY) ' which calculates the angle which starts at 12 o'clock and is measured clockwise from 0 to 360 degrees.
up / North: 0
right / East: 90
down / South: 180
left / West: 270
 * @param Base
 * @returns {DragFlingGesture}
 */
export const DragFlingGesture = function (Base) {
  return class extends Base {

    constructor() {
      super();
      this[selectListener] = e => e.preventDefault() && false;

      this[touchStartListener] = e => this[touchStart](e);
      this[touchMoveListener] = e => this[touchMove](e);
      this[touchStopListener] = e => this[touchStop](e);

      this[mouseStartListener] = e => this[mouseStart](e);
      this[mouseMoveListener] = e => this[mouseMove](e);
      this[mouseStopListener] = e => this[mouseStop](e);

      this[flingable] = false;//todo new


      this[cachedEvents] = undefined;
      this[active] = 0;       //0 = inactive, 1 = mouse, 2 = touch
      this[activeEventOrCallback] = 0; //caches the result of static get swipeEventOrCallback() for each event sequence
    }

    /**
     * Default values are minDistance: 50, minDuration: 200
     * distance is px, duration ms.
     * @returns {{minDistance: number, minDuration: number}}
     */
    static get flingSettings() {
      return {minDistance: 50, minDuration: 150};
    };

    connectedCallback() {
      if (super.connectedCallback) super.connectedCallback();
      this.addEventListener("selectstart", this[selectListener]);
      this.addEventListener("touchstart", this[touchStartListener]);
      this.addEventListener("mousedown", this[mouseStartListener]);
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) super.disconnectedCallback();
      this.removeEventListener("selectstart", this[selectListener]);
      this.removeEventListener("touchstart", this[touchStartListener]);
      this.removeEventListener("mousedown", this[touchStartListener]);
    }

    [mouseStart](e) {
      if (this[active] === 2)
        return;
      this[active] = 1;
      this[activeEventOrCallback] = this.constructor.dragFlingEventOrCallback;
      window.addEventListener("mousemove", this[mouseMoveListener]);
      window.addEventListener("mouseup", this[mouseStopListener]);
      const detail = {event: e, x: e.x, y: e.y};
      this[cachedEvents] = [detail];
      this.draggingStartCallback && this.draggingStartCallback(detail);
      this.constructor.dragEvent && this.dispatchEvent(new CustomEvent("draggingstart", {bubbles: true, detail}));
    };

    [touchStart](e) {
      if (this[active] === 1)
        return;
      if (this[active] === 2)   //this will be a second touch
        return this[touchStopListener]();
      this[active] = 2;
      this[activeEventOrCallback] = this.constructor.dragFlingEventOrCallback;
      window.addEventListener("touchmove", this[touchMoveListener]);
      window.addEventListener("touchend", this[touchStopListener]);
      window.addEventListener("touchcancel", this[touchStopListener]);
      const detail = {event: e, x: e.targetTouches[0].pageX, y: e.targetTouches[0].pageY};
      this[cachedEvents] = [detail];
      this.draggingStartCallback && this.draggingStartCallback(detail);
      this.constructor.dragEvent && this.dispatchEvent(new CustomEvent("draggingstart", {bubbles: true, detail}));
    };


    [mouseMove](e) {
      this[move](e, e.x, e.y);
    }

    [touchMove](e) {
      this[move](e, e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    }

    [move](event, x, y) {
      const prevDetail = this[cachedEvents][this[cachedEvents].length - 1];
      const detail = makeDetail(event, x, y, prevDetail);
      this[cachedEvents].push(detail);
      const settings = this.constructor.flingSettings;
      const flingTime = event.timeStamp - settings.minDuration;
      const flingStart = findLastEventOlderThan(this[cachedEvents], flingTime);
      if (detail.distDiag >= settings.minDistance && flingStart) {
        this[isFlingable]();
      }
      this.draggingCallback && this.draggingCallback(detail);
      this.constructor.dragEvent && this.dispatchEvent(new CustomEvent("dragging", {bubbles: true, detail}));
    }

    [mouseStop](e) {
      this[fling](e, e.x, e.y);
      const detail = {event: e, x: e.pageX, y: e.pageY};
      window.removeEventListener("mousemove", this[mouseMoveListener]);
      window.removeEventListener("mouseup", this[mouseStopListener]);
      this[cachedEvents] = undefined;
      this[active] = 0;
      this[flingable] = false;
      this.draggingEndCallback && this.draggingEndCallback(detail);
      this.constructor.dragEvent && this.dispatchEvent(new CustomEvent("draggingend", {bubbles: true, detail}));
    }

    [touchStop](e) {
      const lastMoveDetail = this[cachedEvents][this[cachedEvents].length - 1];
      const detail = {event: e, x: lastMoveDetail.x, y: lastMoveDetail.y};
      this[fling](detail.event, detail.x, detail.y);
      window.removeEventListener("touchmove", this[touchMoveListener]);
      window.removeEventListener("touchend", this[touchStopListener]);
      window.removeEventListener("touchcancel", this[touchStopListener]);
      this[cachedEvents] = undefined;
      this[active] = 0;
      this[flingable] = false;
      this[activeEventOrCallback] = undefined;
      this.draggingEndCallback && this.draggingEndCallback(detail);
      this.constructor.dragEvent && this.dispatchEvent(new CustomEvent("draggingend", {bubbles: true, detail}));
    }

    [fling](e, x, y) {
      if (e === undefined)
        return;
      const detail = makeDetail(e, x, y, this[cachedEvents][0]);
      detail.angle = flingAngle(detail.distX, detail.distY);
      if (this[flingable]) {
        this.flingCallback && this.flingCallback(detail);
        this.constructor.dragEvent && this.dispatchEvent(new CustomEvent("fling", {bubbles: true, detail}));
      }
    }

    [isFlingable](e) {
      this.isFlingableCallback && this.isFlingableCallback();
      this[flingable] = true;
    }
  }
};
