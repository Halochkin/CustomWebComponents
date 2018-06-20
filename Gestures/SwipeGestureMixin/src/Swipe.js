const selectListener = Symbol("selectstartListener");
const startListener = Symbol("pointerDownListener");
const moveListener = Symbol("pointerMoveListener");
const mouseStartListener = Symbol("mouseStartListener");
const stopListener = Symbol("pointerUpListener");
const start = Symbol("start");
const move = Symbol("move");
const end = Symbol("end");
const swipe = Symbol("swipe");
const cachedEvents = Symbol("cachedEvents");
const startCachedEvents = Symbol("startCachedEvents");
const moveCachedEvents = Symbol("moveCachedEvents");
const endCachedEvents = Symbol("endCachedEvents");
const isTouchActive = Symbol("isTouchActive");

/**
 * SwipeGestureMixin adds a reactive lifecycle hook SwipeGestureCallback(...) to its subclasses.
 * This lifecycle hook is triggered every time a potentially assignable node for the element changes.
 * In order for mixin to support work with smartphones it was added both touch and mouse events.
 * SwipeGestureCallback(...) triggers manually every time the "swipe" event has been activated
 ** The "swipe" event only occurs if the pointermove events have:
 *  - moved a minimum 50px
 *  - in one direction
 *  - during the last 200ms.
 *
 * The minimum distance and duration can be changed using these properties on the element
 *    .flingSettings.minDistance = 50;
 *    .flingSettings.minDuration = 200;
 *
 * SwipeGestureCallback(startDetails, moveDetails, endDetails) contain:
 * 1 - startDetails:
 *    .startX,
 *    .startY,
 *    .event[e].
 *
 * 2 - moveDetails:
 *    .stopX,
 *    .stopY,
 *    .distX,
 *    .distY,
 *    .diagonalPx,
 *    .durationMs,
 *    .speedPxMs,
 *    .xSpeedPxMs,
 *    .ySpeedPxMs,
 *    .angle
 *
 * 3 - endDetails
 *    .stopX,
 *    .stopY:
 *    .event:
 * The angle starts at 12 o'clock and counts clockwise from 0 to 360 degrees.
 *  up/north:     0
 *  right/east:  90
 *  down/south: 180
 *  left/west:  270
 *
 * @returns {SwipeGestureMixin} class that extends HTMLElement
 * @param x
 * @param y
 */

function flingAngle(x = 0, y = 0) {
  return ((Math.atan2(y, -x) * 180 / Math.PI) + 270) % 360;
}

function findLastEventOlderThan(events, timeTest) {
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i].timeStamp < timeTest)
      return events[i];
  }
  return null;
}

/**
 * !!! Dependency: pointerevents !!!
 *
 * Mixin that translates 0.0.1 sequence of one pointerdown and several pointermove events into one or more swipe events.
 *
 * The "swipe" event only occurs if the pointermove events have:
 *  - moved 0.0.1 minimum 50px
 *  - in one direction
 *  - during the last 200ms.
 *
 * The minimum distance and duration can be changed using these properties on the element
 *   .flingSettings.minDistance = 50;
 *   .flingSettings.minDuration = 200;
 *
 * swipe.detail
 *                .x
 *                .y
 *                .distX
 *                .distY
 *                .diagonalPx
 *                .durationMs
 *                .speedPxMs
 *                .pointerevent: 0.0.5
 *                .xSpeedPxMs
 *                .ySpeedPxMs
 *                .angle
 *
 * The angle starts at 12 o'clock and counts clockwise from 0 to 360 degrees.
 *  up/north:     0
 *  right/east:  90
 *  down/south: 180
 *  left/west:  270
 *
 * !!! Dependency: pointerevents !!!
 * !!! for Safari and older browsers use PEP: https://github.com/jquery/PEP !!!
 *
 * @param Base
 * @returns {SwipeGesture}
 */
export const SwipeGestureMixin = function (Base) {
  return class extends Base {
    constructor() {
      super();
      this[selectListener] = e => e.preventDefault() && false;
      this[startListener] = (e) => this[start](e);
      this[moveListener] = (e) => this[move](e);
      this[stopListener] = (e) => this[end](e);
      this[startCachedEvents] = undefined;
      this[moveCachedEvents] = undefined;
      this[endCachedEvents] = undefined;
      this.swipeSettings = {minDistance: 50, minDuration: 200};
    }

    connectedCallback() {
      if (super.connectedCallback) super.connectedCallback();
      this.addEventListener("selectstart", this[selectListener]);
      this.addEventListener("touchstart", this[startListener]);
      this.addEventListener("mousedown", this[startListener]);
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) super.disconnectedCallback();
      this.removeEventListener("selectstart", this[selectListener]);
      this.removeEventListener("touchstart", this[startListener]);
      this.removeEventListener("mousedown", this[startListener]);
    }

    [start](e) {
      this[isTouchActive] = (e.type === "touchstart");
      if (this[isTouchActive]) {
        this.addEventListener("touchmove", this[moveListener]);
        this.addEventListener("touchend", this[stopListener]);
        this.addEventListener("touchcancel", this[stopListener]);
      }
      if (!this[isTouchActive])
        this.addEventListener("mousemove", this[moveListener]);
      this.addEventListener("mouseup", this[stopListener]);
      this.addEventListener("mouseout", this[stopListener]);
      this[startCachedEvents] = {
        x: this[isTouchActive] ? e.targetTouches[0].pageX : e.x,
        y: this[isTouchActive] ? e.targetTouches[0].pageY : e.y,
        events: [e]
      };
    }

    [move](e) {
      if(e.targetTouches.length > 2 )
        return;
      const swipeStart = findLastEventOlderThan(this[startCachedEvents].events, e.timeStamp - this.swipeSettings.minDuration);
      if (!swipeStart)
        return;
      const lastX = this[isTouchActive] ? e.targetTouches[0].pageX : e.x;
      const lastY = this[isTouchActive] ? e.targetTouches[0].pageY : e.y;
      const distX = this[isTouchActive] ? lastX - swipeStart.targetTouches[0].pageX : lastX - swipeStart.x;
      const distY = this[isTouchActive] ? lastY - swipeStart.targetTouches[0].pageY : lastY - swipeStart.y;
      const diagonalPx = Math.sqrt(distX * distX + distY * distY);
      if (diagonalPx < this.swipeSettings.minDistance)
        return;
      const durationMs = e.timeStamp - swipeStart.timeStamp;
      this[moveCachedEvents] = {
        lastX,
        lastY,
        distX,
        distY,
        diagonalPx,
        durationMs,
        speedPxMs: diagonalPx / durationMs,
        xSpeedPxMs: (lastX - swipeStart.x) / durationMs,
        ySpeedPxMs: distY / durationMs,
        angle: flingAngle(lastX - swipeStart.x, distY),
        event: e
      };
    }

    [end](e) {
      this.removeEventListener("touchmove", this[moveListener]);
      this.removeEventListener("touchend", this[stopListener]);
      this.removeEventListener("touchcancel", this[stopListener]);
      this.removeEventListener("mousemove", this[moveListener]);
      this.removeEventListener("mouseup", this[stopListener]);
      this.removeEventListener("mouseout", this[stopListener]);
      if (!this[moveCachedEvents])
        return;
      this.swipeGestureCallback(this[startCachedEvents], this[moveCachedEvents]);
      this[startCachedEvents] = undefined;
      this[moveCachedEvents] = undefined;
      this[endCachedEvents] = undefined;
      this[isTouchActive] = undefined;
    }
  }
};
