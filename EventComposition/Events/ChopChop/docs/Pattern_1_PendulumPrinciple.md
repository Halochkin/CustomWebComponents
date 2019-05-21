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

Let's consider an example of a custom orientation gesture that increases the zoom or reduces the zoom 
of a picture, while activating two touch points at the same time, depending on the angle of inclination 
of the device, 
```html
<img src="https://media.wired.com/photos/5a5945a5e5ee3c6a50ce5287/master/pass/britishforest-696483208.jpg">

```



 
