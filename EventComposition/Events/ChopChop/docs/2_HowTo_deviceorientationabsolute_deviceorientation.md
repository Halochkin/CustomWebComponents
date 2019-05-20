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
 ### Example: `bubble level`.
 Consider a simple example in which we will center the bubble, depending on the `beta` and `gamma` angles of the device.
 ```html
 <div id="bubble-level">
   <div id="center"></div> 
   <div id="bubble"></div> 
 </div>
 
<script>
  let bubble = document.querySelector("#bubble");

  function bubbleHandler(e) {                                                                                 //[2]
    bubble.style.top = parseInt(window.getComputedStyle(bubble).getPropertyValue("top")) + e.beta + "px";
    bubble.style.left = parseInt(window.getComputedStyle(bubble).getPropertyValue("left")) + e.gamma + "px";
  }
  
  if ("ondeviceorientationabsolute" in window) {                                                              //[1]
    window.addEventListener("deviceorientationabsolute", bubbleHandler);
  } else if ("ondeviceorientation" in window) {
    window.addEventListener("deviceorientation", bubbleHandler);
  }
</script>

```
 ***
 1. Event listener for deviceorientation event.
 2. When the event is activated, the bun will change its position depending on the tilt angles of the device.
 
 [Try in on codepen.io](https://codepen.io/Halochkin/pen/Bewawx?editors=1100)
 
### References

*[MDN: DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent)