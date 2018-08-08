const startListener = Symbol("touchStartListener");
const endListener = Symbol("touchEndListener");
const start = Symbol("touchStart");
const end = Symbol("touchEnd");
const firstTouch = Symbol("firstTouch");


export const activePointsMixin = function (Base) {
  return class extends Base {
    constructor() {
      super();
      this[startListener] = (e) => this[start](e);
      this[endListener] = (e) => this[end](e);
    }

    connectedCallback() {
      if (super.connectedCallback) super.connectedCallback();
      this.addEventListener("touchstart", this[startListener]);
      this.addEventListener("touchend", this[endListener]);
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) super.disconnectedCallback();
      this.removeEventListener("touchstart", this[startListener]);
      this.removeEventListener("touchend", this[endListener]);
    }

    [start](e) {
      this.setAttribute("active-fingers", e.targetTouches.length);

    }

    [end](e) {
      this.setAttribute("active-fingers", e.targetTouches.length);
    }

  }
};
