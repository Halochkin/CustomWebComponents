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
  const f1 = touchevent.targetTouches[0];
  const f2 = touchevent.targetTouches[1];
  const x1 = f1.pageX;
  const y1 = f1.pageY;
  const x2 = f2.pageX;
  const y2 = f2.pageY;
  const x3 = f2.pageX;
  const y3 = f2.pageY;
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);
  const diagonal = Math.sqrt(width * width + height * height);
  return {touchevent, x1, y1, x2, y2, y3, x3, diagonal, width, height};

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
      const length = e.targetTouches.length;
      const settings = this.constructor.multiFingerSettings;  // includes number of the fingers and max duration beetwenn first and the last touches.
       if (length > settings.fingers)  // Check to see if the number of active touch points exceeds the maximum allowed.
        return;

      if (length === 1) {
        this[oneHit] = true;
        this.firstTouch = e.timeStamp;   // first finger touch timeStamp
        return;
      }
      if (length !== settings.fingers || (e.timeStamp - this.firstTouch) > settings.maxDuration)
        return;

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
      this[recordedEventDetails] = [detail];
      this.multiFingerStartCallback && this.multiFingerStartCallback(detail);
      this.constructor.multifingerEvent && this.dispatchEvent(new CustomEvent("multifingerstart", {bubbles: true, detail}));
    }

    [move](e) {
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
      const detail = Object.assign({}, this[recordedEventDetails][this[recordedEventDetails].length - 1]);
      this[recordedEventDetails] = undefined;
      this.multiFingerhEndCallback && this.multiFingerEndCallback(detail);
      this.constructor.multifingerEvent && this.dispatchEvent(new CustomEvent("multifingerend", {bubbles: true, detail}));
    }
  }
};
