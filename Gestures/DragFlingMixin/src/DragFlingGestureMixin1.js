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

/**
 * !!! Dependency: pointerevents !!!
 *
 * Mixin that translates a sequence of touch and mouse events to reactive lifecycle hooks:
 * dragGestureCallback(startDetail,dragDetail) and flingGestureCallback(flingDetail).
 * Touch and mouse events have different properties. To solve this problem, it was added this[isTouchActive].
 this[isTouchActive] = true whenever the touchdown is fired.
 * The flingGestureCallback(flinfDetail) triggered only if the dragging event before the dragend moved
 * minimum 50px in one direction during the last 200ms.
 * The minimum distance and duration can be changed using these properties on the element
 *   .flingSettings.minDistance = 50;
 *   .flingSettings.minDuration = 200;
 *
 * dragGestureCallback(dragDetail) contain:
 *   - distX - distanceX (Y)
 *   - distY
 *   - x  actual coordinates X (Y)
 *   - y
 *   - pointerevent:  - different detail from moveEvent
 *   - startDragging:  - startDragging detail
 *
 flingGestureCallback(flinfDetail) contain:
 *
 *   angle: flingAngle(distX, distY),
 *    distX - distanceX (Y)
 *    distY,
 *    diagonalPx,
 *    durationMs,
 *    flingX  - fling value (use for `style.left = flingX + 'px';)
 *    flingY,
 *    x,
 *    xSpeedPxMs,
 *    y,
 *    ySpeedPxMs

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
      // this.setPointerCapture(e.pointerId);
      this[cachedEvents] = [e];
      this[isTouchActive] = (e.type === "touchstart");
      if (this[isTouchActive]) {
        this.addEventListener("touchmove", this[moveListener]);
        this.addEventListener("touchend", this[stopListener]);
        this.addEventListener("touchcancel", this[stopListener]);
      }
      if (!this[isTouchActive])
        this.addEventListener("mousemove", this[moveListener]);
      this.addEventListener("mouseup", this[stopListener]);
      this.addEventListener("mouseout", this[stopListener]);     //todo make sure that 'mouseOUT' is the best replacement to touchCANCEL (only for mouse events)


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
