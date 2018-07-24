# DragFlingMixin Detail Description
This mixin allows you to translate the sequence of mouse and touch events to the hooks of the reactive life cycle:
```javascript
draggingStartCallback(detail) / "draggingstart"
draggingCallback(detail) / "dragging"
draggingEndCallback(detail) / "draggingend"
flingCallback(detail) / "fling"
```
Touch events have been added to support mixin with smartphones.
In addition, to prevent the text selection that is activated when the object is moved, a selectstart event was added that 
fires `e.preventDefault`.
#### Start event
You can use touch and mouse events:
```javascript 
[mouseStart] (e) when you activate the start mouse event `mousedown events';
[touchStart] (e); to the beginning of touch events "touchstart"
```
This is done to prevent conflicts. Conflicts can occur because mouse events and touch events have different ways of getting X and Y
coordinates. For example, the path to the `X-coordinate` of the mouse event is `e.x` and for the touch event is `e. targetTouches[0].pageX`. 
The Touch and mouse events have different properties, and to solve this problem,`this[isTouchActive]` property has been added, 
which is set to `true` whenever a `touchdown` is triggered. If `event-mousedown` event `is[isTouchActive]` is "false".
 
The result of both functions is 'draggingStartCallback(details)' and sending '"draggingstart"' events with details.
Where 

```javascript
details = {
 event: all information about the event
 x: x-coordinate position
 y: Y-coordinates
}
```
#### Move event
Move events using a similar principle as start events. They are triggered when the mouse/touch point is moved and, 
depending on the type, call the `[mouseMove](e)` or `[touchMove](e)` functions to translate X,Y-coordinates of different events into one format and then call the `[move](event, x, y)` function.
The result of this function is to call to the `isflingable(e)` and `draggingCallback(detail)/"drag"`.
Where `detail` is calculated as a result of the `makeDetail(event, x, y, startDetail)` function, where properties:
 ```javascript
 event - information about the current event
 x - position x-coordinates
 y - y-coordinate 
 startDetail- initial event that is used to calculation the difference between the actual and previous events.

makeDetail() return{
distX: the difference between the actual and predyduschim event on the X-axis
distY: Y axis
distDiag: diagonal distance
durationMs: duration
}
 ```
The `isflingable(e)` is a function that notifies the user when the conditions for the `fling` event have been met. 
These conditions are added to the static `flingSettings()` where
```javascript{
      minDistance: 50-minimum distance
      minDuration: 150 - minimum continuing events
    }
```
In order to determine the continuation of an event, it is necessary to define an event that is greater than the minimum duration condition. To do this, use the function `findLastEventOlderThan (events, timeTest)` where
```javascript
`events`-an array of all events
timeTest - event.timeStamp - the minimum value of the length.
```
#### Stop events
Stop events are executed by the same Prince as the start of the event. For mouse events `[mouseStop] (e)`, for touch events - `[touchStop] (e)`. The result of both functions is a call `[fling](e, x, y)` and draggingEndCallback (detail) / "draggingend" where details = {
 event: all information about the event
 x: x-coordinate position
 y: Y-coordinates
}
#### flingCallback/'fling' event
Function `[fling] (e, x, y)` trigger `flingCallback(detail)` where in addition to default details from `makeDetail()` there is the `angle` value which getting from `flingAngle(detail.distX, detail.distY)` which calculates the angle which starts at 12 o'clock and is measured clockwise from 0 to 360 degrees.
up / North: 0
right / East: 90
down / South: 180
left / West: 270
