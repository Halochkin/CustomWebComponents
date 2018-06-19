#### DragFlingGestureMixin
 
  Mixin that translates a sequence of mouse and touch events to reactive lifecycle hooks:
  `dragGestureCallback(startDetail,dragDetail)` and `flingGestureCallback(flingDetail)`.
     In order for mixin to support work with smartphones it was added touch events:
     Touch and mouse events have different properties. To solve this problem, it was added `this[isTouchActive]`
 which equals true whenever the touchdown is fired.
   Also, to prevent the selection of text that was in the moved object, it was added `"selectstart"` event which fire `e.preventDefault`.
  Mixin contain 4 main function:
   `[start](e)` - which fired when a pointing device button is pressed on an element by `"mousedown"` event
             or touch points are placed on the touch surface (`"touchstart"` event).
    `[move](e)` -  is fired when a pointing device (usually a mouse) is stert moving while over an element by
            "touchmove" or "mousemove" events.
        `[moved](e)` - trigger `dragGestureCallback(dragDetail)` which contain:
              - distX - distanceX (Y)
              - distY
              - x  actual coordinates X (Y)
              - y
              - pointerevent:  - different detail from move-event
              - startDragging:  - startDragging detail

    `[end](e)` - can be triggered by four events:
                `"touchend"` - is fired when one or more touch points are removed from the touch surface;
                `"touchcancel"` - is fired when one or more touch points have been disrupted in an implementation-specific manner (for example, too many touch points are created).
                `"mouseup"` - is fired when a pointing device button is released over an element.
                `"mouseout"` - is fired when a pointing device (usually a mouse) is moved off the element that has the listener attached or off one of its children.

    The first `[end](e)` calls `[fling](e)` which triggered `flingGestureCallback(flinfDetail)` only if the last dragging event moved
   minimum `50px` in one direction during the last `200ms`.
   The minimum distance and duration can be changed using these properties on the element
   ```javascript
    .flingSettings.minDistance = 50;
    .flingSettings.minDuration = 200;
```
          `flingGestureCallback(flinfDetail)` contain:
     - angle: flingAngle(distX, distY),
     - distX - distanceX (Y)
     - distY,
     - diagonalPx,
     - durationMs,
     - flingX  - fling value (use for `style.left = flingX + 'px';)
     - flingY,
     - x,
     - xSpeedPxMs,
     - y,
     - ySpeedPxMs.

  The angle starts at 12 o'clock and counts clockwise from 0 to 360 degrees.
   up/north:     0
   right/east:  90
   down/south: 180
   left/west:  270
