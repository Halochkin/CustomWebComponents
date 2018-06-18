
  Mixin that translates a sequence of pointer events to reactive lifecycle hooks:
`dragGestureCallback(dragDetail)` and `flingGestureCallback(flinfDetail)`.
 The `flingGestureCallback(flinfDetail)` triggered only if the dragging event before the dragend moved
 `minimum 50px` in one direction during the last `200ms`.
The minimum distance and duration can be changed using these properties on the element
  .flingSettings.minDistance = 50;
 .flingSettings.minDuration = 200;

dragGestureCallback(dragDetail) contain:
 * distX - distanceX (Y),
 * distY,
 * x  actual coordinates X (Y),
 * y,
 * pointerevent:  - different detail from moveEvent,
 * startDragging:  - startDragging detail,

 flingGestureCallback(flinfDetail) contain:
 * angle: flingAngle(distX, distY),
 * distX - distanceX (Y)
 * distY,
 * diagonalPx,
 * durationMs,
 * flingX  - fling value (use for `style.left = flingX + 'px';)
 * flingY,
 * x,
 * xSpeedPxMs,
 * y,
 * ySpeedPxMs

The angle starts at 12 o'clock and counts clockwise from 0 to 360 degrees.
 *  up/north:     0
 *  right/east:  90
 *  down/south: 180
 *  left/west:  270
