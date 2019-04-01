const contentRectCache = Symbol('contentRectCache');
const resizeObserver = Symbol('resizeObserverInstance');

class ResizeObserverRAF {
  constructor(cb) {
    this._rects = new Map();
    this._cb = cb;
    this._rafLoopInstance = this._rafLoop.bind(this);
  }

  observe(obj) {
    if (this._rects.size === 0)
      window.requestAnimationFrame(this._rafLoopInstance);
    this._rects.set(obj, undefined);
  }

  unobserve(obj) {
    this._rects.delete(obj);
    if (this._rects.size === 0)
      window.cancelAnimationFrame(this._rafLoopInstance);
  }

  _rafLoop() {
    const entries = [];
    for (let [obj, previousRect] of this._rects) {
      let nowRect = obj.getContentRect();
      if (nowRect !== previousRect) {
        entries.push({target: obj, contentRect: nowRect});  //find all elements with changed contentRect.
        this._rects.set(obj, nowRect);                      //and update cache
      }
    }
    this._cb(entries);                                      //run callback([{target, contentRect}]) on changes
    window.requestAnimationFrame(this._rafLoopInstance);    //check again next rAF
  }
}

const onlyOnSizeChangedOnAll = entries => {
  for (let entry of entries)
    entry.target.sizeChangedCallback(entry.contentRect);
};
const chromeResizeObserver = window.ResizeObserver ? new ResizeObserver(onlyOnSizeChangedOnAll) : undefined;
const rafResizeObserver = new ResizeObserverRAF(onlyOnSizeChangedOnAll);


export const SizeChangedMixin = function (Base) {
  return class SizeChangedMixin extends Base {

    constructor() {
      super();
      this[contentRectCache] = {width: 0, height: 0};
      this[resizeObserver] = chromeResizeObserver || rafResizeObserver;
    }

    sizeChangedCallback(rect = {width: 0, height: 0}) {
      if (super.sizeChangedCallback) super.sizeChangedCallback(rect);
    }

    connectedCallback() {
      if (super.connectedCallback) super.connectedCallback();
      this.style.display = "inline-block";
      this[resizeObserver].observe(this)
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) super.disconnectedCallback();
      this[resizeObserver].unobserve(this);
    }


    getContentRect(cachedOnly) {
      if (cachedOnly)
        return this[contentRectCache];
      const style = window.getComputedStyle(this);
      const width = style.width === "" ? 0 : parseFloat(style.width);
      const height = style.height === "" ? 0 : parseFloat(style.height);
      if (this[contentRectCache].width !== width || this[contentRectCache].height !== height)
        this[contentRectCache] = {width, height};
      return this[contentRectCache];
    }

    /**
     * Not implemented as it is unlikely that it will be very useful.
     * Only makes sense in browsers that support "ResizeObserver"
     * @param {"ResizeObserver" || "requestAnimationFrame"} name
     * @returns true if the switch was successful, false if no switch was or could be made
     */
    // changeResizeObserver(name = "requestAnimationFrame") {
    //   if ((name === "requestAnimationFrame" && this[resizeObserver] === rafResizeObserver) ||
    //     (name === "ResizeObserver" && this[resizeObserver] === chromeResizeObserver))
    //     return false;
    //
    //   this[resizeObserver].unobserve(this);
    //   if (name === "requestAnimationFrame") {
    //     this[resizeObserver] = rafResizeObserver;
    //     this[resizeObserver].observe(this);
    //     return true;
    //   } else if (chromeResizeObserver && name === "ResizeObserver") {
    //     this[resizeObserver] = chromeResizeObserver;
    //     this[resizeObserver].observe(this);
    //     return true;
    //   }
    //   return false;
    // }
  }
};
