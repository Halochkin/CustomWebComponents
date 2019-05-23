# Pattern: Shaking hands 

As you know, the accelerometer is able to track the movement of the device on three axes with high accuracy of
 measurement, which is about a thousandth of a degree. This means that even if you just hold your device
in your hand, reading the news feed, the device is constantly exposed to a small fluctuation in the angle 
of inclination due to the work of the hand muscles. It is obvious that such fluctuations constantly activate 
both `deviceorientation` and `devicemotion` events.  

#### Problem 1: Involuntary tilt

Let's consider an example: you have a gesture that reacts to the direction of the device's tilt relative to the initial 
angle, which is determined when the touch point is activated. It may seem that it is safe enough, but it is not so. Once
 you have added a touch point and you think you have not started tilting the phone, but it is not. The orientation 
 events will immediately start to activate the gesture, because holding the device, the hand muscles cannot be in the 
 same position, but move constantly than activate the event.

This means that the tilt event will be triggered almost immediately, unwanted to activate the gesture. Now imagine that 
you are trying to do this trick while you are in the cabin of a moving car. 

Therefore, to avoid unwanted activation of the gesture, you should always add a minimum tilt value that compensates for
 involuntary tilts of the device after the initial event has been added and the tilt has not yet started. 
 

```javascript

let initialAngle = undefined;
let minAngle = 5;

function handleOrientation() {
    if (!initialAngle)                                                              //[3]
      initialAngle = e.beta;
  
    if (Math.abs(initialAngle - e.beta) < minAngle)                                 //[4]
       return;
      
      initialAngle = e.beta;                                                        //[5]
      console.log("Five degrees behind");
      
    }
 
    window.addEventListener("touchstart", function(e) {                             //[1]
      if(e.touches.length === 1)                                                    //[2]
         window.addEventListener('deviceorientation', handleOrientation);
    });
```
***
1. Add initial event listener for `touchstart` event to avoid activating the event at the slightest tilt of the device.
2. Check for the number of touch points.
3. Defining the initial angle, only when the orientation event is first started.
4. Ignore the next code execution until the device tilts more than 5 degrees relative to `initialAngle` value.
5. Overwrite the starting angle after more than 5 degrees of inclination. The next beta tilt will be counted from the new value.


### Problem 2: 
From the example, it is obvious that the console will display a message every time the device increases or decreases the
 tilt by every 5 degrees. But this will significantly slow down the animation view and cause inconvenience to the user.
To solve this problem it is necessary to reduce the interval value to ensure smooth animation and provide convenience
to the user, who certainly does not want to bother himself too much tilting the device. 
So we have to reduce the minimum angle, but only after it is done once. Overwriting after the first execution is necessary
 to avoid activating the gesture when scrolling. If the user tries to make a scrolling, with the help of his thumb he will 
 involuntarily tilt the phone down, which will be perceived as the activation of the gesture.  
 That's why when you activate it, its value is higher, and during tilt it decreases.
 It is important to note that this is not the end of the `initialAngle` overwrite. When activating the `touchend` event, 
 it must be returned to the initial position to provide the following gesture with the previous execut

```javascript
let initialAngle = undefined;
let minAngle = 5;

function handleOrientation() {
    if (!initialAngle)                                                              
      initialAngle = e.beta;
  
    if (Math.abs(initialAngle - e.beta) < minAngle)                                 
       return;                                                   //[1]
    else {
       initialAngle = e.beta;
       minAngle = 0.3;                                           //[2]
       }                                                                            
      console.log( minAngle+" degrees behind");      //5 degrees behind     0.3 degrees behind ... //5 degrees behind
      
    }
 
    window.addEventListener("touchstart", function(e) {                             
      if(e.touches.length === 1)                                                    
         window.addEventListener('deviceorientation', handleOrientation);
    });

 window.addEventListener("touchend", function(e) {               //[3]         
      minAngle = 5;
    });
```
***
1. After activating the `touchstart` event, the device must be tilted more than 5 degrees to decrease the `initialAngle` value.
2. The gesture is now activated each time the device is rotated 0.3 degrees. 
3. After the user deactivates the touch point, the execution conditions are restored.


### Example. Orientation-zooming

### Example2: deviceorientation- zoom
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
    let minAngle = 5;                                                               //[19]
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
 
 [Try in on codepen.io](https://codepen.io/Halochkin/pen/Bewawx?editors=1100)






