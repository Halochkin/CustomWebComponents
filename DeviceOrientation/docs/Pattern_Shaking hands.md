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
      alert("Five degrees behind");
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

### Problem 2: Involuntary tilt
From the example, it is obvious that alert will be fired every time the device increases or decreases the
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








