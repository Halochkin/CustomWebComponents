export class MyInputEvent extends Event {
  constructor() {
    super("my-input", {bubbles: true, composed: true});
  }

  preventDefault() {
    //todo should cancel the action of scrolling from my-wheel
  }
}

function easeInOutQuint(t) {
  return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
}

export class MyInputController /*extends CustomCascadeEvent*/ {

  constructor() {
    this.observedTriggers = ["keypress", "keydown", "select"];
    this.observedPrevented = [];
    this.state = new WeakMap();
    this.activeElements = new Set();

  }

  getObservedNames() {
    return this.observedTriggers.concat(this.observedPrevented);
  }

  doInput(currentTarget) {
    const state = this.state.get(currentTarget);
    state.leftTextNode.nodeValue = state.newLeftNode;
    if (state.newRightNode !== undefined)
      state.rightTextNode.nodeValue = state.newRightNode;
  }


  // selectTrigger()

  keypressTrigger(e, currentTarget) {
    let newChar = e.key;
    if (newChar === "Enter")
      return; //todo somrthing later


    const state = this.state.get(currentTarget);
    let newLeftNodeValue = state && state.newLeftNode ? state.newLeftNode + e.key : e.key;


    let leftTextNode = currentTarget.shadowRoot.children[1].childNodes[0];
    let rightTextNode = currentTarget.shadowRoot.children[1].childNodes[2];


    this.state.set(currentTarget, {
      // nodes
      leftTextNode: leftTextNode,
      rightTextNode: rightTextNode,
      //values
      newLeftNode: newLeftNodeValue,
    });

    this.doInput(currentTarget);
  }


  keydownTrigger(e, currentTarget) {
    console.log(e.key);
    if (!(e.key === "Backspace" || e.key === "ArrowLeft" || e.key === "ArrowRight"))
      return;


    customEvents.queueTask(currentTarget.dispatchEvent.bind(currentTarget, new MyInputEvent()));

    const state = this.state.get(currentTarget);

    if (!state)
      throw new Error("keypress event must be dispatched before keydown");

    let leftTextNode = state.leftTextNode;
    let rightTextNode = state.rightTextNode;
    let newLeftNodeValue;
    let newRightNodeValue;


    // get last char from left text node and first one from right text node
    let charLeft = leftTextNode.nodeValue.trim()[leftTextNode.nodeValue.trim().length - 1];
    let charRight = rightTextNode.nodeValue.trim()[0];


    if (e.key === "ArrowLeft") {
      newLeftNodeValue = leftTextNode.nodeValue.slice(0, leftTextNode.length - 1);
      newRightNodeValue = (charLeft || "") + rightTextNode.nodeValue.trim();
      // let lastChar = existingText[existingText.length - 1];
      // leftTextNode.nodeValue = existingText.slice(0, existingText.length - 1);
      // rightTextNode.nodeValue = lastChar + rightTextNode.nodeValue || "";        //todo test path. add values to the state. 2 - add both left and right textNodes to the state
    } else if (e.key === "ArrowRight") {
      newRightNodeValue = rightTextNode.nodeValue.slice(1, rightTextNode.length);
      newLeftNodeValue = leftTextNode.nodeValue + (charRight || "");
    }


    this.state.set(currentTarget, {
      // nodes
      leftTextNode: leftTextNode,
      rightTextNode: rightTextNode,
      //values
      newLeftNode: newLeftNodeValue,
      newRightNode: newRightNodeValue,
    });
    this.doInput(currentTarget);
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
    // return el.hasAttribute && el.hasAttribute("my-wheel");

    return el.tagName === "INPUT-CHANGE";
  }
}