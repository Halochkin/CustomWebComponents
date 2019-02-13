## Pattern: TouchEndAlsoStartGesture

Another way to solve the problem of "sloppy fingers" is to stop the gesture while any extra finger is 
touching the screen, but to enable the gesture to restart when the extra finger is removed.
This method stops the gesture whenever an accidental touch/extra finger gets into contact with the screen,
but as soon as the extra finger is removed, ie. a `touchend` event is triggered, the multifinger gesture reactivates.

This pattern we call `TouchEndAlsoStartGesture`.
The TouchEndAlsoStartGesture works by adding an initial trigger function on both `touchstart` and 
`touchend` events.
This simple, general solution both avoids conflict with other events *and* allows users to correct it, 
thus maximizing gesture ergonomics at minimal cost. 

### Example 
Let's look at an example in which you can rotate an element using two touch points. 
If the user accidentally activates the third point - the event will stop, but can be continued if the extra point is removed.
```html
<div id="element"></div>

<script>
  let element = document.querySelector("#element");
  let body = document.querySelector("body");
  let lastRotate;
  let startAngle;
  let moveAngle;
  let f1;
  let f2;
  let x1;
  let y1;
  let x2;
  let y2;
  let blockedAngle;

  element.addEventListener("touchstart", function (e) {
    body.style.userSelect = "none";                                                                  //[1]
    body.style.touchAction = "none";
    blockedAngle = 0;
    if (e.touches.length < 2)                                                                        //[2]
      return;
    lastRotate = element.style.transform ? parseFloat(element.style.transform.substring(7)) : 0;     //[3]
    f1 = e.targetTouches[0];
    f2 = e.targetTouches[1];
    x1 = f1.pageX;
    y1 = f1.pageY;
    x2 = f2.pageX;
    y2 = f2.pageY;
    startAngle = ((Math.atan2(x1 - x2, -(y1 - y2)) * 180 / Math.PI) + 270) % 360;                    //[4]
    element.addEventListener("touchmove", onTouchMove);                                              //[5]
    element.addEventListener("touchend", onTouchEnd);                                               
  });

   function onTouchMove(e) {                                                                          //[6]
    f1 = e.touches[0];
    f2 = e.touches[1];
    x1 = f1.pageX;
    y1 = f1.pageY;
    x2 = f2.pageX;
    y2 = f2.pageY;
    moveAngle = lastRotate - (startAngle - ((Math.atan2(x1 - x2, -(y1 - y2)) * 180 / Math.PI) + 270) % 360);
    if (e.touches.length > 2) {                                                                   
      blockedAngle = moveAngle - parseFloat(element.style.transform.substring(7));                   //[7]
    }
    rotateElement(moveAngle - blockedAngle);                                                         //[8]
  }

  function onTouchEnd(e) {
    body.style.userSelect = "";                                                                      //[9]
    body.style.touchAction = "";
    if (e.changedTouches.length === 2)
      rotateElement(moveAngle - blockedAngle);                                                       //[10]
  }


  function rotateElement(movedRotation) {                                                            //[11]
    element.style.transform = `rotate(${  movedRotation}deg)`;
  }
</script>

```

1. Turning off the possibility of scrolling and zoom during the execution of a gesture;
2. As for the element rotation it is necessary to use two touch points, which will determine the angle;
This means that one finger does not activate the gesture.
3. So that when the gesture is reactivated, the scrolling starts from the last position of the angle;
4. Since the angle of rotation is determined by the conditional line between the two touch points - we define the initial angle,
depending on the position of the touch points;
5. Apply listenUp pattern and add event listeners as late as possible after the initial conditions are met;
6. Since the event listener will not be added if at least two points are not active, we will determine the coordinates of these 
two first points;
7. If a third point is added, the gesture will not be interrupted. To do this, we define the angle that was rotated at the 
active three touch points;
8. And we will take it away from the total angle of rotation. This is necessary in order to preserve the angle of the rotation 
in the position in which it was before the addition of the third point, and not the new position, in case the user continues the
rotation with the three points active;
9. Resume the default values;
10. Apply the pattern, and resume the rotation if the extra point is removed;
11. Rotation function that can be called from both `touchmove` and `touchend` initial functions.

Try it on [codepen](https://codepen.io/Halochkin/pen/exjWRP?editors=1010)
