# Pattern 1 Newton's cradle
Very often, when working with orientation events, it is necessary to add the value of the tilt angle
 of the device to activate custom orientation gesture. For example, tilt the device along the beta axis 
(tilt the phone down) by more than 25° (for example) to activate the custom gesture, and when the device
returns to its previous position to deactivate. 

Following the above, several questions appear:
* What is the angle to start the countdown?
* How do I prevent an event from being accidentally activated? 
* How do I prevent the countdown if the angle at which the functionality is activated and the device
 continues to tilt is reached?
* How to ensure reactivation

`Newton's cradle` pattern is suitable for repetitive gestures based on orientation events. 
It also eliminates accidental activation or deactivation of the gesture. 


### Example: tilt to zoom in/out

 I'm sure that you agree that when viewing photos it would be much more convenient not to use the second 
 hand to enlarge the photo, but to do it with the hand that holds the phone. Let's consider an example which expands 
 possibilities of UX, allowing to zoom images by tilting phone.
 ```html
<img orientation-zoom src="./someimage.img" alt="some image">                       <!--[1]-->

<script>
  let supportsPassive = false;                                                      //[2]
  try {
    let opts = Object.defineProperty({}, 'passive', {
      get: function () {                                                            //[3]
        supportsPassive = true;
      }
    });
    window.addEventListener("test", null, opts);                                    //[3a]
    window.removeEventListener("test", null, opts);
  } catch (e) {
  }
  
  let thirdArg = supportsPassive ? {passive: false, capture: true} : true;          //[4]
  let initialAngle = undefined;                                                     //[5]
  let zoomTarget = undefined;                                                       //[6]
  let minAngle = 5;                                                                 //[7]
  let previousInitial = undefined;                                                  //[8]
  

  function dispatchZoomEvent(type) {                                                //[12]
    if (zoomTarget)
      zoomTarget.dispatchEvent(new CustomEvent("orientation-" + type, {
        bubbles: true,
        composed: true
      }));
  }

  function handleOrientation(e) {                                                   
    if (!initialAngle)
      initialAngle = e.beta;                                                        //[13]
      
    if (Math.abs(initialAngle - e.beta) < minAngle) {                               //[14]
      return;
    } else {
      previousInitial = initialAngle;                                               //[15]
      initialAngle = e.beta;
      minAngle = 0.3;
    }  
      
     if (previousInitial < initialAngle) {
       dispatchZoomEvent("zoom-in");                                                //[16]
     }
     if (previousInitial > initialAngle) {
       dispatchZoomEvent("zoom-out");
     }
  }

  function setupActiveListeners() {                                                 //[9]
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handleOrientation);      //[13]
    }
    if ('ondeviceorientation' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
     document.addEventListener("touchmove", move, thirdArg);                        //[17]
     document.addEventListener("touchend", end);                                    //[18]
  }

  function setBackEventListeners() {                                                //[18]
    if ('ondeviceorientationabsolute' in window) {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
    }
    if ('ondeviceorientation' in window) {
      window.removeEventListener('deviceorientation', handleOrientation);
    }
    document.removeEventListener("touchmove", e => {
      e.preventDefault();
    }, thirdArg);
    document.removeEventListener("touchend", end);
   }

  function start(e) {                                                               //[9]
    if (e.touches.length !== 1 || !e.target.hasAttribute("orientation-zoom"))       //[10]
      return;
    setupActiveListeners();                                                         //[11]
    zoomTarget = e.target;                                                          //[12]
  }
  
   function move(e) {                                                               //[17]
      e.preventDefault();
    }
  

  function end() {                                                                  //[18]
    zoomTarget = undefined;
    initialAngle = undefined;                                                       
    setBackEventListeners();                                                        
    minAngle = 5;                                                               //[19]
  }

  document.addEventListener("touchstart", start);                                   //[9]
</script>

<script>
  let zoomCoef = 1;                                                                 //[20]
  window.addEventListener("orientation-zoom-in", function (e) {
    if (zoomCoef > 1.5)                                                             //[21]
      return;
    e.target.style.transform = `scale(${zoomCoef += 0.01})`;                        //[22]
  });
  window.addEventListener("orientation-zoom-out", function (e) {
    if (zoomCoef < 0.7)                                                             //[21]
      return;
    e.target.style.transform = `scale(${zoomCoef -= 0.01})`;                        //[23]
  });
</script>
```
 ***
 1. Add an attribute to the `<img> `element to avoid zooming in on other elements
 2. In order to be able to prevent default actions for `touchmove` events, it is necessary to check the value of 
 the `passive` property.
 3. Сreate options object with a getter to see if its passive property is accessed.
  A - create a throwaway element & event and (synchronously) test out our options
 4. If successful, `thirdArg` variable will be equal `{passive: false, capture: true}`, which means that default
  event actions can be prevented.
 5. `initialAngle` -  value of the angle from which the tilt of the device will be calculated.
 6. `zoomTarget` - the element with `orientation-zoom` attribute on which the initial event occurred.
 7. The starting angle is 5 degrees, which means that tilting the device by less than 5 degrees will not activate the gesture.
 8. The `previousInitial` variable will retain the value of `initialAngle`, which was before the tilt condition was met. 
 To compare before define the event.
 9. Add an initial event listener for the `touchstart` event.
 10. When the `touchstart` event triggers, the number of active touch points and the presence of the `orientation-zoom`
  attribute will be checked.
 11. After a successful checking, will be trigger `setBackEventListeners()`, which will add event listeners 
 for `deviceorientation` / `deviceorientationabsolute`  (browser dependent), `touchmove` and `touchend` events.
 12. `zoomTarget` variable store the target of the event.
 13. Both `deviceorientation` ` deviceorientationabsolute ` events will call the `handleOrientation()`, which 
 will determine the initial angle of beta, from which the calculation of the tilt of the device will be made.
 14. Until the angle of the device is no longer `minAngle` relative to `initialAngle` the gesture will not be activated.
 15. When the tilt angle of the device meets the condition, the last value of `initialAngle` will be saved in the
  variable `previousInitial`. And a variable `initialAngle` is defined by new value from which value calculation 
  will be made. And value `minAngle` will be reduced that will increase sensitivity of inclination of the device.
 16. If the phone is tilted down, `dispatchZoomEvent()` with the `zoom-in` argument will be called, and if it 
 is tilted up - with `zoom-out`. `dispatchZoomEvent` function will dispatch a new custom event on element, which store
  in `zoomTarget` variable, the name of which will depend on the argument with which the function was called. 
 17. When the `touchmove` event triggers, the `move` function will be called, which will prevent the default action.
 This is possible due to the use of `thirdArg`, which defines the `passive`  property as a `false`.
 18. The `touchend` event calls the `end` function, which will define the `zoomTarget` and `initialAngle` variables as
  `undefined`.  In order to provide the next gesture activation with new values, in the case, if after deactivating the
  gesture the device will change the angle of inclination, or a new target will be selected. After that all the previously 
  added event listeners will be removed.
 19. After the user deactivates the touch point, the execution conditions are restored.
 20. Initial image size, without zooming.
 21. Maximum and minimum zoom coeficients.
 22. When the device is tilted down, the image will be zoom-in.
 23. When the device is tilted backwards, the image will zoom-out on.
 
 [Try in on codepen.io](https://codepen.io/Halochkin/pen/oRoGza)


 
