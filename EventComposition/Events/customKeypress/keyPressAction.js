export class MyKeypressEvent {
  constructor(key) {
    // super("my-keypress", {bubbles: true, composed: true});
    return new CustomEvent("my-keypress", {bubbles: true, composed: true, detail: key});
  }

  preventDefault() {

  }
}


// export class mySecondController{
//   constructor() {
//     this.observedTriggers = ["keydown"];
//     this.observedPrevented = [];
//     this.state = new WeakMap();
//     this.activeElements = new Set();
//   }
//
//   getObservedNames() {
//     return this.observedTriggers.concat(this.observedPrevented);
//   }
//
//
//   keydownTrigger(e, currentTarget) {
//     console.log("second");
//   }
//
//   cancelCascade(eventOrEventType) {
//     for (let activeEl of this.activeElements) {
//       const state = this.state.get(activeEl);
//       if (!state.rafId)
//         throw new Error("omg");
//       cancelAnimationFrame(state.rafId);
//       this.activeElements.delete(activeEl);
//       this.state.delete(activeEl);
//     }
//   }
//
//   matches(event, el) {
//     // return el.hasAttribute && el.hasAttribute("my-wheel");
//     return el === window;
//
//   }
//
// }


export class MyFirstController /*extends CustomCascadeEvent*/ {

  constructor() {
    this.observedTriggers = ["keydown", "keyup"];
    this.observedPrevented = [];
    this.state = new WeakMap();
    this.activeElements = new Set();
    this.dispatched = false;
    this.blackList = ["Alt", "Meta", "Control", "Shift", "CapsLock", "Tab", "Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F10", "F11", "F12", "ScrollLock", "Delete", "NumLock", "Enter"];
  }

  getObservedNames() {
    return this.observedTriggers.concat(this.observedPrevented);
  }


  keyupTrigger(e, currentTarget) {

    // stateless version
    clearTimeout(this.timeout);
    clearInterval(this.interval);
    console.log("cleared #", this.timeout, "# ", this.interval);
    this.dispatched = false;
  }


  keydownTrigger(e, currentTarget) {

    if (this.blackList.indexOf(e.key) !== -1 || this.dispatched)
      return;


    // we use this.timeout because it allows us to set both setTimeout and setInterval id immediately to cancel it in
    //keyupTrigger() if keyup event will fires *BEFORE* setInterval() will be fire and set new values to the state.
    this.timeout = setTimeout(function () {
      this.interval = setInterval(function () {
        customEvents.queueTask(currentTarget.dispatchEvent.bind(currentTarget, new MyKeypressEvent(e.key)));
      }.bind(this), 100);
      console.log("added #", this.timeout, "# ", this.interval);

    }.bind(this), 0);
    this.dispatched = true;

  }


  /**
   * The cancelCascade callback is a method that should reset an EventCascade function.
   * In principle, the cancelCascade is called when another EventCascade function takes
   * control of an EventCascade that this EventCascade function has either started listening
   * to, or would be listening to.
   *
   * In practice, cancelCascade(event) is triggered in 3 situations:
   * 1. when an observedPrevented event occurs.
   * 2. when another EventCascade calls preventDefault() on an observedTriggerEvent.
   * 3. when another EventCascade grabs an an observedPrevented event OR observedTriggerEvent.
   *
   * @param eventOrEventType either the event itself, in case of 1 or 2, or just a string with the eventType in case of 3.
   */
  cancelCascade(eventOrEventType) {
    for (let activeEl of this.activeElements) {
      const state = this.state.get(activeEl);
      if (!state.rafId)
        throw new Error("omg");
      cancelAnimationFrame(state.rafId);
      this.activeElements.delete(activeEl);
      this.state.delete(activeEl);
    }
  }

  matches(event, el) {
    return el === window;
  }
}