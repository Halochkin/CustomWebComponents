### DragFlingGestureMixin
 
This mixin allows to translate a sequence of mouse and touch events to reactive lifecycle hooks:
 * `dragGestureCallback(startDetail, dragDetail)`<br>
 * `flingGestureCallback(flingDetail)`.<br>
 In order for mixin to support work with smartphones it was added touch events.<br>
Also, to prevent the selection of text that was in the moved object, it was added `"selectstart"` event which fire `e.preventDefault`.<br>
  Mixin contain 4 main function:<br>
* `[start](e)` - which fired when a pointing device button is pressed on an element by `"mousedown"` event
             or touch points are placed on the touch surface (`"touchstart"` event).<br>
* `[move](e)` -  is fired when a pointing device (usually a mouse) is stert moving while over an element by
            "touchmove" or "mousemove" events.<br>
* `[moved](e)` - trigger `dragGestureCallback(dragDetail)` which contain:<br>
- distX - distanceX (Y)
- distY
- x  actual coordinates X (Y)
- y
- pointerevent
- startDragging<br>
`[end](e)` - can be triggered by four events:
                `"touchend"` - is fired when one or more touch points are removed from the touch surface;
                `"touchcancel"` - is fired when one or more touch points have been disrupted in an implementation-specific manner (for example, too many touch points are created).
                `"mouseup"` - is fired when a pointing device button is released over an element.
                `"mouseout"` - is fired when a pointing device (usually a mouse) is moved off the element that has the listener attached or off one of its children.

The first `[end](e)` calls `[fling](e)` which triggered `flingGestureCallback(flinfDetail)` only if the last dragging event moved minimum `50px` in one direction during the last `200ms`.
   The minimum distance and duration can be changed using these properties on the element
   ```javascript
    .flingSettings.minDistance = 50;
    .flingSettings.minDuration = 200;
```
`flingGestureCallback(flinfDetail)` contain:
* angle: flingAngle(distX, distY),
* distX - distanceX (Y)
* distY
* diagonalPx
* durationMs
* flingX  
* fling value (use for `style.left = flingX + 'px'`)
* flingY
* x
* xSpeedPxMs
* y
* ySpeedPxMs<br>
 Events Touch and mouse have different properties and to solve this problem, it was added `this[isTouchActive]`property which equals `true` whenever the touchdown is fired. If the `mousedown` event is fired `this[isTouchActive]` will be "false".
The angle starts at 12 o'clock and counts clockwise from 0 to 360 degrees.
  * up/north:     0
   * right/east:  90
   * down/south: 180
   * left/west:  270
