### HowTo: `deviceorientation` / `deviceorientationabsolute`.
There are two device orientation events:
1. `deviceorientation` 
2. `deviceorientationabsolute` 

Both react to the movement of the device and allow to get the value of `alpha`, `beta` and `gamma` angles, 
but there is a difference in these events:
 
In the `deviceorientation` event, alpha, beta and gamma values, is provided in **absolute** degrees relative to the 
Earth's coordinate system. The provision of absolute degrees requires the use of a magnetometer sensor device to
detect the Earth's magnetic field, which in turn is subject to fluctuations in the magnetic field in the vicinity,
which may reset the readings. In practice this can lead to the fact that the web application will register a lot
of `deviceorientation` because of the adjacent magnet, despite the fact that the device itself actually does not
move. For a virtual reality application that only cares about tracking changes in orientation, this magnetic 
noise is bad news.

In `deviceorientationabsolute` alpha, beta and gamma degrees, are no longer absolute with respect to the Earth's
 coordinate system. This means that `deviceorientationabsolute` is started only when there is actual movement, 
 which is determined by some combination of accelerometer and gyroscope. Magnetometer and false readings caused 
 by magnetic field fluctuations are not taken into account.
 
`deviceorientationabsolute` event in addition to `alpha`, `beta` and `gamma` angles provides an additional 
property - `absolute`. It is equal `true` if the orientation data in `instanceOfDeviceOrientationEvent` is provided
 as the difference between the Earth's coordinate frame and the device's coordinate frame, or false if the 
 orientation data is being provided in reference to some arbitrary, device-determined coordinate frame.

* `absolute` - indicates whether or not the device is providing orientation data absolutely (that is, in reference
 to the Earth's coordinate frame) or using some arbitrary frame determined by the device. 
 

### Adding an Event Listener for DeviceOrientationEvent

Some browsers may not support `deviceorientationabsolute` (which is similar to `deviceorientation`)
 and need to be supported by a simple compatibility check
 ```javascript
  if ("ondeviceorientationabsolute" in window) {                                  
     window.addEventListener("deviceorientationabsolute", (e)=> {
       console.log("I am the new nice browser");
     });
   } else if ("ondeviceorientation" in window) {                                  
     window.addEventListener("deviceorientation", function(e){
        console.log("Back in my day ... ");
     });  
   }
 ```
 ### Example1: `bubble level`.
 Consider a simple example in which we will center the bubble, depending on the `beta` and `gamma` angles of the device.
 ```html
 <div id="bubble-level">
   <div id="center"></div> 
   <div id="bubble"></div> 
 </div>
 
<script>
   let bubble = document.querySelector("#bubble");
   let bubbleHandler = e => bubbleLevel(e);
 
   function bubbleLevel(e) {
     let topPos = parseInt(window.getComputedStyle(bubble).getPropertyValue("top"));
     if (topPos > 1000)                                                                //[2]
       topPos = 700;
     if (topPos < 0)
       topPos = 0;
     bubble.style.top = topPos + e.beta + "px";                                        //[3]
   }
   if ("ondeviceorientationabsolute" in window) {                                      //[1]
     window.addEventListener("deviceorientationabsolute", bubbleHandler);
   } else if ("ondeviceorientation" in window) {
     window.addEventListener("deviceorientation", bubbleHandler);
   }
</script>

```
 ***
 1. Event listener for deviceorientation event.
 2. Added a check to prevent the bubble from overstepping the level.
 3. When the event is activated, the bun will change its position depending on the tilt angles of 
 the device.
 
 ### Example2: `deviceorientation` event zoom the element
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
  

  function dispatchZoomEvent(type) {                                                //[12] 
    if (zoomTarget)
      zoomTarget.dispatchEvent(new CustomEvent("orientation-" + type, {
        bubbles: true,
        composed: true
      }));
  }

  function handleOrientation(e) {                                                   
    if (!initialAngle)
      initialAngle = e.beta;                                                        //[11]
    if (e.beta < initialAngle) {                                                    
      dispatchZoomEvent("zoom-in")                                                  //[12]
    }
    if (e.beta > initialAngle) {
      dispatchZoomEvent("zoom-out")                                                 //[12]
    }
  }

  function setupActiveListeners() {                                                 //[9]
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handleOrientation);      //[11]
    }
    if ('ondeviceorientation' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
     document.addEventListener("touchmove", move, thirdArg);                        //[13]
     document.addEventListener("touchend", end);                                    //[14]
  }

  function setBackEventListeners() {                                                //[14]
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

  function start(e) {                                                               //[7]
    if (e.touches.length !== 1 || !e.target.hasAttribute("orientation-zoom"))       //[8]
      return;
    setupActiveListeners();                                                         //[9]
    zoomTarget = e.target;                                                          //[10]
  }
  
   function move(e) {                                                               //[13]
      e.preventDefault();
    }
  

  function end() {                                                                  //[14]
    zoomTarget = undefined;
    initialAngle = undefined;                                                       
    setBackEventListeners();                                                        
   
  }

  document.addEventListener("touchstart", start);                                   //[7]
</script>

<script>
  let zoomCoef = 1;                                                                 //[15]
  window.addEventListener("orientation-zoom-in", function (e) {
    if (zoomCoef > 1.5)                                                             //[16]
      return;
    e.target.style.transform = `scale(${zoomCoef += 0.01})`;                        //[17]
  });
  window.addEventListener("orientation-zoom-out", function (e) {
    if (zoomCoef < 0.7)                                                             //[16]
      return;
    e.target.style.transform = `scale(${zoomCoef -= 0.01})`;                        //[18]
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
 7. Add an initial event listener for the `touchstart` event.
 8. When the `touchstart` event triggers, the number of active touch points and the presence of the `orientation-zoom`
  attribute will be checked.
 9. After a successful checking, will be trigger `setBackEventListeners()`, which will add event listeners 
 for `deviceorientation` / `deviceorientationabsolute`  (browser dependent), `touchmove` and `touchend` events.
 10. `zoomTarget` variable store the targrt of the event, to use it later.
 11. Both `deviceorientation` ` deviceorientationabsolute ` events will call the function of the handler, which 
 will determine the initial angle of beta, from which the calculation of the tilt of the device will be made.
 12. If the phone is tilted down, `dispatchZoomEvent()` with the `zoom-in` argument will be called, and if it 
 is tilted up - with `zoom-out`. `dispatchZoomEvent` function will dispatch a new custom event on element, which store
  in `zoomTarget` variable, the name of which will depend on the argument with which the function was called. 
 13. When the `touchmove` event triggers, the `move` function will be called, which will prevent the default action.
 This is possible due to the use of `thirdArg`, which defines the `passive`  property as a `false`.
 14. The `touchend` event calls the `end` function, which will define the `zoomTarget` and `initialAngle` variables as
  `undefined`.  In order to provide the next gesture activation with new values, in the case, if after deactivating the
  gesture the device will change the angle of inclination, or a new target will be selected. After that all the previously 
  added event listeners will be removed.
 15. Initial image size, without zooming.
 16. Maximum and minimum zoom coeficients.
 17. When the device is tilted down, the image will be zoom-in.
 18. When the device is tilted backwards, the image will zoom-out on.
 
 [Try in on codepen.io](https://codepen.io/Halochkin/pen/Bewawx?editors=1100)
 
### References

*[MDN: DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent)