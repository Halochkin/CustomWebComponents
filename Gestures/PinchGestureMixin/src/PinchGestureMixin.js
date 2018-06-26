const lastAngle = Symbol("lastAngle");
const id1 = Symbol("touchId1");
const id2 = Symbol("touchId2");
const cachedEventDetails = Symbol("cachedEventDetails");
const cachedTouchAction = Symbol("cachedTouchAction");
const startListener = Symbol("touchStartListener");
const moveListener = Symbol("touchMoveListener");
const endListener = Symbol("touchEndListener");
const start = Symbol("touchStart");
const move = Symbol("touchMove");
const end = Symbol("touchEnd");
const endCachedDetail = Symbol("endCachedDetail");
const activeEventOrCallback = Symbol("activeEventOrCallback");
const eventAndOrCallback = Symbol("callbackAndOrEvent");

function calcAngle(x, y) {
  return ((Math.atan2(y, -x) * 180 / Math.PI) + 270) % 360;
}

/**
 * Two-finger mixin for pinch, expand, rotate and doubledragging gestures.
 * The purpose of PinchGestureGesture is to add pinch events and/or callbacks to an element.
 * The pinchGestureCallback(detail) is fired when two fingers are pressed
 * and moved against the screen.
 * PinchGestureCallback(...) translates a sequence of touchstart, touchmove
 * and touchend events into a series of pinch events.
 *
 *    startDetail:
 *    {touchevent, x1, y1, x2, y2, diagonal, width, height, angle, averageX, averageY}

 moveDetail
 {
*           touchevent,
*           x1, y1, x2, y2,
*           width, height, diagonal,
*           widthStart, heightStart, diagonalStart,
*           widthLast, heightLast, diagonalLast,
*           rotationLast,                          //clockwise rotation since previous pinchmove
*           rotationStart                          //clockwise rotation since pinchstart
*           averageMoveX, averageMoveY             //two finger average movements
*     }
 *  - endDetail
 *    {touchevent}
 *
 * Two finger gestures..
 *
 * Speed can be calculated as (can be applied to width, height, diagonal, angle):
 *
 *   function speed(nowLength, thenLength, now, then) {
 *     return (nowLength - thenLength) / (now - then);
 *   }
 *
 * @param Base
 * @returns {PinchGestureMixin}
 */
export const PinchGestureMixin = function (Base) {
  return class extends Base {
    constructor() {
      super();
      this[cachedEventDetails] = undefined;
      this[cachedTouchAction] = undefined;
      this[id1] = undefined;
      this[id2] = undefined;
      this[startListener] = (e) => this[start](e);
      this[moveListener] = (e) => this[move](e);
      this[endListener] = (e) => this[end](e);
      this[activeEventOrCallback] = 0;
    }

    /**
     * By default it is only event
     * @returns {number} 0 = event+callback, 1 = only event, -1 = only callback
     */
    static get dragFlingEventOrCallback() {
      return -1;
    }

    connectedCallback() {
      if (super.connectedCallback) super.connectedCallback();
      this.addEventListener("touchstart", this[startListener]);
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) super.disconnectedCallback();
      this.removeEventListener("touchstart", this[startListener]);
    }

    [start](e) {
      if (this[id1] !== undefined || e.targetTouches.length < 2)
        return;
      e.preventDefault();
      window.addEventListener("touchmove", this[moveListener]);
      window.addEventListener("touchend", this[endListener]);
      window.addEventListener("touchcancel", this[endListener]);
      const f1 = e.targetTouches[0];
      const f2 = e.targetTouches[1];
      this[id1] = f1.identifier;
      this[id2] = f2.identifier;
      this[activeEventOrCallback] = this.constructor.dragFlingEventOrCallback;
      const detail = this.makeDetail(f2.pageX, f1.pageX, f2.pageY, f1.pageY, e);
      this[cachedEventDetails] = [detail];
      this[eventAndOrCallback]("pinchstart", detail);
    }

    [move](e) {
      e.preventDefault();
      const lastEventDetail = this[cachedEventDetails][this[cachedEventDetails].length - 1];
      const startEventDetail = this[cachedEventDetails][0];
      const f1 = e.targetTouches[0];
      const f2 = e.targetTouches[1];
      const detail = this.makeDetail(f2.pageX, f1.pageX, f2.pageY, f1.pageY, e);
      detail.distDiagonal = detail.diagonal / startEventDetail.diagonal;
      detail.distWidth = detail.width / startEventDetail.width;
      detail.distHeight = detail.height / startEventDetail.height;
      detail.rotation = lastEventDetail.angle - detail.angle;
      detail.rotationStart = startEventDetail.angle - detail.angle;

      this[cachedEventDetails].push(detail);
      this[eventAndOrCallback]("pinch", detail);
    }

    makeDetail(x2, x1, y2, y1, touchevent) {
      const width = x2 > x1 ? x2 - x1 : x1 - x2;
      const height = y2 > y1 ? y2 - y1 : y1 - y2;
      const diagonal = Math.sqrt(width * width + height * height);
      const angle = calcAngle(x1 - x2, y1 - y2);
      return {touchevent, x1, y1, x2, y2, diagonal, width, height, angle};
    }

    /**
     * This is only called when one of the events triggered when the pinch is active.
     * You can add more fingers (accidentally touch the screen with more fingers while you rotate or pinch),
     * but you cannot take one of the two original target fingers off the screen.
     */
    [end](e) {
      e.preventDefault();
      if (this[id1] === undefined)
        return;
      if ((e.targetTouches[0] && e.targetTouches[0].identifier === this[id1]) &&
        (e.targetTouches[1] && e.targetTouches[1].identifier === this[id2]))
        return;
      window.removeEventListener("touchmove", this[moveListener]);
      window.removeEventListener("touchend", this[endListener]);
      window.removeEventListener("touchcancel", this[endListener]);
      this[endCachedDetail] = {touchevent: e};
      this[eventAndOrCallback]("pinchend", this[endCachedDetail]);
      this[cachedEventDetails] = undefined;
      this[id1] = undefined;
      this[id2] = undefined;
      this[activeEventOrCallback] = undefined;
    }

    [eventAndOrCallback](eventName, detail) {
      if (this[activeEventOrCallback] <= 0) {
        let cbName = eventName + "Callback";
        this[cbName] && this[cbName](detail);
      }
      if (this[activeEventOrCallback] >= 0)
        this.dispatchEvent(new CustomEvent(eventName, {bubbles: true, detail}));
    }
  }
};
