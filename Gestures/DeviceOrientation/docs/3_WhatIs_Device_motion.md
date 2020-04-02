### WhatIs: Device motion? 
Unlike `deviceorientation` / `deviceorientationabsolute` events (which allow to receive angles
 of an inclination of the device in three planes) `devicemotion` event gives us information about
 the movement of the device, and specifically, its acceleration (`m/s2`) as it moves. 
 
Each time a `devicemotion` event is activated, the event object has additional properties
   
   * `acceleration` - an object containing data about the current device's acceleration 
   excluding gravity for all three axes.
   * `accelerationIncludingGravity` - data about the current device'sacceleration including gravity (if the device is 
   unable to provide the data without the gravity effect using event.acceleration).
   * `rotationRate`  -  data about the current device's rotation rates for all three axes (alpha, beta, gamma).
   * `interval` -  interval (in ms) at which the data is obtained from the accelerometer.
   
### Reference
* [Gravitational acceleration](https://www.quora.com/What-does-g-9-81-m-s2-mean)



