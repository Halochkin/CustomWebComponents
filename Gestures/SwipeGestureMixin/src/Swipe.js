const selectListener = Symbol("selectstartListener");
const startListener = Symbol("pointerDownListener");
const moveListener = Symbol("pointerMoveListener");
const stopListener = Symbol("pointerUpListener");
const start = Symbol("start");
const move = Symbol("move");
const end = Symbol("end");
const swipe = Symbol("swipe");
const cachedEvents = Symbol("cachedEvents");
const startCachedEvents = Symbol("startCachedEvents");
const moveCachedEvents = Symbol("moveCachedEvents");
const endCachedEvents = Symbol("endCachedEvents");

/**
 * SwipeGestureMixin adds a reactive lifecycle hook SwipeGestureCallback(...) to its subclasses.
 * This lifecycle hook is triggered every time a potentially assignable node for the element changes.
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
  return ((Math.atan2(y, -x) * 180 / Math.PI)+270)%360;
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
      this.addEventListener("pointerdown", this[startListener]);
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) super.disconnectedCallback();
      this.removeEventListener("selectstart", this[startListener]);
      this.removeEventListener("pointerdown", this[startListener]);
    }

    [start](e) {
      this.setPointerCapture(e.pointerId);
      this.addEventListener("pointermove", this[moveListener]);
      this.addEventListener("pointerup", this[stopListener]);
      this.addEventListener("pointercancel", this[stopListener]);
      this[startCachedEvents] = {
        startX: e.x,
        startY: e.y,
        events: [e]
      };
    }

    [move](e) {
      const swipeStart = findLastEventOlderThan(this[startCachedEvents].events, e.timeStamp - this.swipeSettings.minDuration);
      if (!swipeStart)
        return;
      const lastX = e.x;
      const lastY = e.y;
      const distX = lastX - swipeStart.x;
      const distY = lastY - swipeStart.y;
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
      this.removeEventListener("pointermove", this[moveListener]);
      this.removeEventListener("pointerup", this[stopListener]);
      this.removeEventListener("pointercancel", this[stopListener]);
      this.releasePointerCapture(e.pointerId);
      this[endCachedEvents] = {
        stopX: e.x,
        stopY: e.y,
        event: e
      };
      if (!this[moveCachedEvents])
        return;
      this.swipeGestureCallback(this[startCachedEvents], this[moveCachedEvents], this[endCachedEvents]);
      this[startCachedEvents] = undefined;
      this[moveCachedEvents] = undefined;
      this[endCachedEvents] = undefined;
    }
  }
};
