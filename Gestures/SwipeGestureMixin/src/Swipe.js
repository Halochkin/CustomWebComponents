const selectListener = Symbol("selectstartListener");
const move = Symbol("move");
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
const cachedEvents = Symbol("cachedEvents");
const cachedDetail = Symbol("cachedDetail");
const active = Symbol("active");
const activeEventOrCallback = Symbol("activeEventOrCallback");
const eventAndOrCallback = Symbol("callbackAndOrEvent");


/**
 * SwipeGestureMixin adds swipe events and/or callbacks to an element.

 * The angle starts at 12 o'clock and counts clockwise from 0 to 360 degrees.
 *  up/north:     0
 *  right/east:  90
 *  down/south: 180
 *  left/west:  270
 *
 * @returns {SwipeGestureMixin} class that extends HTMLElement
 * @param event
 * @param x
 * @param y
 * @param startDetail
 */


function makeDetail(event, x, y, startDetail) {
  const distX = x - startDetail.x;
  const distY = y - startDetail.y;
  const distDiag = Math.sqrt(distX * distX + distY * distY);
  const durationMs = event.timeStamp - startDetail.event.timeStamp;
  return {event, x, y, distX, distY, distDiag, durationMs};
}

export const SwipeGestureMixin = function (Base) {
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
      this[cachedEvents] = undefined;
      this[active] = 0;       //0 = inactive, 1 = mouse, 2 = touch
      this[activeEventOrCallback] = 0; //caches the result of static get swipeEventOrCallback() for each event sequence
    }

    static get swipeSettings() {
      return {minDistance: 100, minDuration: 200, maxTouches: 1};
    }

    /**
     * By default it is only event
     * @returns {number} 0 = event+callback, 1 = only event, -1 = only callback
     */
    static get swipeEventOrCallback() {
      return 0;
    }

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

    [touchStart](e) {
      if (this[active] === 1)
        return;
      if (this[active] === 2)   //this will be a second touch
        return this[touchStopListener]();
      this[active] = 2;
      this[activeEventOrCallback] = this.constructor.swipeEventOrCallback;
      window.addEventListener("touchmove", this[touchMoveListener]);
      window.addEventListener("touchend", this[touchStopListener]);
      window.addEventListener("touchcancel", this[touchStopListener]);
      const detail = {event: e, x: e.targetTouches[0].pageX, y: e.targetTouches[0].pageY};
      this[cachedEvents] = [detail];
      this[eventAndOrCallback]("swipestart", detail);
    }

    [mouseStart](e) {
      if (this[active] === 2)
        return;
      this[active] = 1;
      this[activeEventOrCallback] = this.constructor.swipeEventOrCallback;
      window.addEventListener("mousemove", this[mouseMoveListener]);
      window.addEventListener("mouseup", this[mouseStopListener]);
      const detail = {event: e, x: e.x, y: e.y};
      this[cachedEvents] = [detail];
      this[eventAndOrCallback]("swipestart", detail);
    }

    [mouseMove](e) {
      this[move](e, e.x, e.y);
    }

    [touchMove](e) {
      this[move](e, e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }

    [move](event, x, y) {
      const prevDetail = this[cachedEvents][this[cachedEvents].length - 1];
      const detail = makeDetail(event, x, y, prevDetail);
      this[eventAndOrCallback]("swipe", detail);
    }

    [mouseStop](e) {
      const prevDetail = this[cachedEvents][this[cachedEvents].length - 1];
      const detail = makeDetail(event, e.x, e.y, prevDetail);
      if (Math.abs(detail.distDiag) < this.constructor.swipeSettings.minDistance) {
        return;
      }
      this[eventAndOrCallback]("swipeend", detail);
      window.removeEventListener("mousemove", this[mouseMoveListener]);
      window.removeEventListener("mouseup", this[mouseStopListener]);
      this[cachedEvents] = undefined;
      this[active] = 0;
      this[activeEventOrCallback] = undefined;
    }

    [touchStop](e) {
      const prevDetail = this[cachedEvents][this[cachedEvents].length - 1];
      const detail = makeDetail(event, e.changedTouches[0].clientX, e.changedTouches[0].clientY, prevDetail);
      this[eventAndOrCallback]("swipeend", detail);
      window.removeEventListener("touchmove", this[touchMoveListener]);
      window.removeEventListener("touchend", this[touchStopListener]);
      window.removeEventListener("touchcancel", this[touchStopListener]);
      this[cachedEvents] = undefined;
      this[active] = 0;
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
