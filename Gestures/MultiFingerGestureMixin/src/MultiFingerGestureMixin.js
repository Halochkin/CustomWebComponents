const startListener = Symbol("touchStartListener");
const moveListener = Symbol("touchMoveListener");
const endListener = Symbol("touchEndListener");
const start = Symbol("touchStart");
const move = Symbol("touchMove");
const end = Symbol("touchEnd");
const recordedEventDetails = Symbol("recordedEventDetails");
const cachedTouchAction = Symbol("cachedTouchAction");
const firstTouch = Symbol("firstTouch ");
const oneHit = Symbol("firstTouchIsAHit");


function makeDetail(touchevent) {
  const coordArr = [];
  const length = touchevent.targetTouches.length;
  for (let i = 0; i < touchevent.targetTouches.length; i++) {
    let touch = {x: touchevent.targetTouches[i].pageX, y: touchevent.targetTouches[i].pageY};
    if (length > 1) {
      let counter = (i + 1 >= length ? 0 : i + 1);
      touch.distX = touchevent.targetTouches[counter].pageX - touchevent.targetTouches[i].pageX;
      touch.distY = touchevent.targetTouches[counter].pageY - touchevent.targetTouches[i].pageY;
      touch.diagonal = Math.sqrt(touch.distX * touch.distX + touch.distY * touch.distY);
    }
    coordArr.push(touch);
  }

  return {touchevent, coordArr, length};
}

export const TriplePinchGesture = function (Base) {
  return class extends Base {
    constructor() {
      super();
      this[recordedEventDetails] = undefined;
      this[cachedTouchAction] = undefined;                      //block touchAction
      this[oneHit] = false;
      this[startListener] = (e) => this[start](e);
      this[moveListener] = (e) => this[move](e);
      this[endListener] = (e) => this[end](e);
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
      const length = e.touches.length;
      const settings = this.constructor.multiFingerSettings;  // includes number of the fingers and max duration beetwenn first and the last touches.


      if (length === 1) {
        this[oneHit] = true;
        this.firstTouch = e.timeStamp;   // first finger touch timeStamp
        return;
      }
      if (length > settings.fingers)
        return this[end](e);
      if (length < settings.fingers || (e.timeStamp - this.firstTouch) > settings.maxDuration)
        return this[end](e);


      if (!this[oneHit])                                         //first finger was not pressed on the element, so this second touch is part of something bigger.
        return;
      e.preventDefault();                                       //block defaultAction
      const body = document.querySelector("body");              //block touchAction
      this[cachedTouchAction] = body.style.touchAction;         //block touchAction
      body.style.touchAction = "none";                          //block touchAction
      window.addEventListener("touchmove", this[moveListener]);
      window.addEventListener("touchend", this[endListener]);
      window.addEventListener("touchcancel", this[endListener]);
      const detail = makeDetail(e);
      detail.length = length;
      detail.duration = e.timeStamp - this.firstTouch;
      this[recordedEventDetails] = [detail];
      this.multiFingerStartCallback && this.multiFingerStartCallback(detail);
      this.constructor.multifingerEvent && this.dispatchEvent(new CustomEvent("multifingerstart", {
        bubbles: true,
        detail
      }));
    }

    [move](e) {
      if (!this[oneHit])                                         //first finger was not pressed on the element, so this second touch is part of something bigger.
        return;
      e.preventDefault();
      const detail = makeDetail(e);
      this.multiFingerCallback && this.multiFingerCallback(detail);
      this.constructor.multifingerEvent && this.dispatchEvent(new CustomEvent("multifinger", {bubbles: true, detail}));
    }

    [end](e) {
      e.preventDefault();                                       //block defaultAction
      window.removeEventListener("touchmove", this[moveListener]);
      window.removeEventListener("touchend", this[endListener]);
      window.removeEventListener("touchcancel", this[endListener]);
      this[oneHit] = false;
      this.firstTouch = undefined;
      const body = document.querySelector("body");              //retreat touchAction
      body.style.touchAction = this[cachedTouchAction];         //retreat touchAction
      this[cachedTouchAction] = undefined;                      //retreat touchAction
      const detail = makeDetail(e);
      this[recordedEventDetails] = undefined;
      this.multiFingerEndCallback && this.multiFingerEndCallback(detail);
      this.constructor.multifingerEvent && this.dispatchEvent(new CustomEvent("multifingerend", {
        bubbles: true,
        detail
      }));
    }
  }
};
