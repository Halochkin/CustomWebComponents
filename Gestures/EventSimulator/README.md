## Event Simulator
### What is Event Simulator?
Let's try to answer this question. [`Event Simulator`](https://github.com/Halochkin/Components/blob/master/Gestures/EventSimulator/src/EventSimulator.js) allows to simulate custom events based on a sequence of events without physical interaction. 
Simulator support 3 main events: "start","move" and "end". And you can set the required type of event, for example "mouse" or "touch"
In addition to simulating simple events, such as "touchstart", "touchent"... you can simulate gestures by adding a sequence of events to the array. Not bad, huh? Let's see how it works.
### How to start to simulate the events and gestures?
As an import function is used `simulateEventSequence(arrayIn)` which uses an array as an input parameter.
Where 
``` javascript
    arrayIn = [
    [element, "typeOfEvent", "event", number of touch points)],
    ...
    ]
```
The sequence of event calls depends on the `event` value and it order in the array.
If your event requires some temporary conditions, you can add a delay for any event by using the `setTimeout()`.
#### Example

```html
<script type="module">
  const myElement = document.getElementById('controller');
  const typeEvent = "touch";
 simulateEventSequence([
            [myElement, typeEvent, "start", 1],
            [myElement, typeEvent, "start", 2],
            [myElement, typeEvent, "move", 2]
          ]);
          setTimeout(function () {
            simulateEventSequence([[myElement, typeEvent, "end", 2]])
          }, 120); 
</script>
```
Depending on the sequence of event values in the array, the `simulateEventSequence()` function calls
`sendTouchEvent(x1, y1, x2, y2, element, eventType, id, fingers)`.
The first four parameters of the sendTouchEvent are coordinates '(x1, y1, x2, y2)' have been defined, but can be changed if necessary.
For example, for `start` event, they are (125, 255, 275, 75)px.
These values were chosen to satisfy the conditions `spin` and `fling` events.
```javascript
function simulateEventSequence(arrayIn) {
  for (let i = 0; i < arrayIn.length; i++) {
    if (arrayIn[i][2] === "start") {
      sendTouchEvent(125, 255, 275, 75, arrayIn[i][0], arrayIn[i][1] + "start", i, arrayIn[i][3]);
    }
    if (arrayIn[i][2] === "move") {
      sendTouchEvent(30, 200, 20, 100, arrayIn[i][0], arrayIn[i][1] + "move", i, arrayIn[i][3]);
    }
    if (arrayIn[i][2] === "end") {
      sendTouchEvent(300, 400, 450, 250, arrayIn[i][0], arrayIn[i][1] + "end", i, arrayIn[i][3]);
    }
  }
}
```
sendTouchEvent(x1, y1, x2, y2, element, eventType, id, fingers) adds the following values for events.
```javascript
 const touchObj = new Touch({
    identifier: id,
    target: element,
    clientX: x1,
    clientY: y1,
    pageX: x1,
    pageY: y1,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 130,
    force: 0.5,
  });
  ```
  Depending on the number of touch points `sendTouchEvent()` defines single or multiple event.
  ```javascript
  const twoFingersEvent = new TouchEvent(eventType, {
    cancelable: true,
    bubbles: true,
    touches: [touchObj, touchObj2],
    targetTouches: [touchObj, touchObj2],
    changedTouches: [touchObj, touchObj2],
  });
  const oneFingerEvent = new TouchEvent(eventType, {
    cancelable: true,                                 
    bubbles: true,                                       
    touches: [touchObj],
    targetTouches: [touchObj],
    changedTouches: [touchObj],
  });
  fingers === 1 ? element.dispatchEvent(oneFingerEvent) : element.dispatchEvent(twoFingersEvent);
  ```
  ### Example
  ```html
<switch-button></switch-button>
 ```
  ```javascript
  class TestBlock extends PinchGesture(HTMLElement) {
    constructor() {
      super();
      this._onPinchListener = e => this.onPinch(e);
      this._onSpinListener = e => this.onSpin(e);
      this._switcherListener = e => this.onSwitch(e);
      }
    static get pinchEvent() {
      return true;
    }
    connectedCallback() {
      super.connectedCallback();  //do not forget about this
        document.getElementById("buttons").addEventListener("buttons-select", this._switcherListener);
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      document.getElementById("buttons").removeEventListener("buttons-select", this._switcherListener);
    }
   onSwitch(event) {
      const myElement = document.getElementById('controller');
      const typeEvent = "touch";
      let picture = document.getElementById("image");
      switch (event.detail) {    // the switch value of radio buttons
        case "pinch":
          this.addEventListener("pinch", this._onPinchListener);
          simulateEventSequence([                                        //[1] 
            [myElement, typeEvent, "start", 1],                          //[2] 
            [myElement, typeEvent, "start", 2],                          //[3] 
            [myElement, typeEvent, "move", 2],
            [myElement, typeEvent, "end", 2]
          ]);
          this.removeEventListener("pinch", this._onPinchListener);
          picture.src="https://www.multiswipe.com/assets/POgest-1x-4a999f5d8955337a448eff0333d9bcc3.gif";
          break;
        case "spin":
          this.addEventListener("spin", this._onSpinListener);
          simulateEventSequence([
            [myElement, typeEvent, "start", 1],
            [myElement, typeEvent, "start", 2],
            [myElement, typeEvent, "move", 2]
          ]);
          setTimeout(function () {
            simulateEventSequence([[myElement, typeEvent, "end", 2]])
          }, 120);                                                        //[4] 
          picture.src="https://www.multiswipe.com/assets/CRgest-1x-0429001b125a1679a35e357b376d93bb.gif";
          break;
  }
        onPinch(e) {
      this.innerText = "PINCH";
    }
        onSpin(e) {
      this.innerText = "SPIN";
    }
  }
  
   class SwitchButtons extends PinchGesture(HTMLElement) {
    constructor() {
      super();
      this.innerHTML = `
    <input type="radio" id="pinch" name="check"><label>Pinch</label>
    <input type="radio" id="spin" name="check" ><label>Spin</label>`;
      this.addEventListener("click", e => {
        this.dispatchEvent(new CustomEvent("buttons-select", {composed: true, bubbles: true, detail: e.target.id}));
      });
    }
  }
   customElements.define("switch-button", SwitchButtons);
  ```
  1. Before you start to simulate events - specify the sequence of events to call the desired events.
  2. To dispatch an event to an element - you can use simulateEventSequence(element, event type, number of touch points).
  3. `Pinch` event starts with one finger touching - then two fingers touching, so the start event is called twice.
  4. If you have some time limits - you can add a delay. For example, to meet the 'spin' conditions, the delay between the 'move' and 'end' must be longer than 100ms. 
  [Try Demo](https://rawgit.com/Halochkin/Components/master/Gestures/GesturesTest1.html)
  ### Why do I need to simulate events? Where can I use them? 
  The most useful in testing. You can programmatically call the necessary events to see the result of their execution.  Agree with me that when you test an event much faster, and it is more convenient if the program performs physical interaction instead of you. In addition, this feature can be useful when adding effects and transformations to your web application
  ### References
  * [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
  * [`Touch events`](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
