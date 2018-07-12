### DragFlingGestureMixin
 
This mixin allows to translate a sequence of mouse or touch events to callback/event. Also, to prevent the selection of text that was in the moved object, it was added `"selectstart"` event which fire `e.preventDefault`.
 Event and mouse touches have different properties and to solve this problem, it was added `this[isTouchActive]`property which equals `true` whenever the touchdown is fired. If the `mousedown` event is fired `this[isTouchActive]` will be "false".
```javascript
draggingStartCallback(detail) / "draggingstart"
draggingCallback(detail) / "dragging"
draggingEndCallback(detail) / "draggingend"
flingCallback(detail) / "fling"
```
To use the event, there is a static function `pinchEvent()`
```javascript
static get pinchEvent() {
      return true;
    }
```
All callbacks/events pass a set of standard details, based on `makeDetail()`:
```javascript
//startDetail - used for calculation of difference between actual and previous events
function makeDetail(event, x, y, startDetail) {
  const distX = x - startDetail.x;
  const distY = y - startDetail.y;
  const distDiag = Math.sqrt(distX * distX + distY * distY);
  const durationMs = event.timeStamp - startDetail.event.timeStamp;
  return {event, x, y, distX, distY, distDiag, durationMs};
}
```
`Drag` is used to scroll the page/content and, at the same time, but the ability to select text does not supported.

`Fling` event similar to the [`drag-and-drop`](https://ru.wikipedia.org/wiki/Drag-and-drop) and the difference between fling and drag gestures is that `flingCallback()` / "flinging" must meet the minimum requirements that create a 'boundary' between the calls to these two events. These requirements are setted to the function `flingSettings()` as object property value. Other gesture-mixins work on the same principle.
   The `minDistance` and `minDuration` can be changed using these properties on the element
   ```javascript
    .flingSettings.minDistance = 50;
    .flingSettings.minDuration = 200;
```
In addition to the default list of details, `flingCallback(detail)` has a new value of detail - `angle`.
`Angle` - equal to the angle between two touch points and gets from `flingAngle()`.

```javascript
function flingAngle(x = 0, y = 0) {
  return ((Math.atan2(y, -x) * 180 / Math.PI) + 270) % 360;
}
```
The angle starts at 12 o'clock and counts clockwise from 0 to 360 degrees.
  * up/north:     0
   * right/east:  90
   * down/south: 180
   * left/west:  270
   
[`Try the difference between `drag` and `fling` gestures here`](https://rawgit.com/Halochkin/Components/master/Gestures/GesturesTest1.html)
### Reference
* [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)
* [DragEvent](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent)
* [Touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)


