### Event Simulator
[`Event Simulator`](https://github.com/Halochkin/Components/blob/master/Gestures/EventSimulator/src/EventSimulator.js) allows to simulate custom events based on a sequence of events whose parameters can be set.
As an import function is used `simulateEventSequence(arrayIn)` which uses an array as an input parameter.
Where 
```html
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
These values were chosen to satisfy the conditions `spin` and `fling` of the event
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
}```
`sendTouchEvent(x1, y1, x2, y2, element, eventType, id, fingers)` adds the following values for events.
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
  ### References
  * [`CustomEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
  * [`Touch events`](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
