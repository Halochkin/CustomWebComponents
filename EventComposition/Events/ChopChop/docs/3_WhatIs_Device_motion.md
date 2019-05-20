### WhatIs: Device motion? 
Unlike `deviceorientation` / `deviceorientationabsolute` events which allow to receive angles
 of an inclination of the device in three planes `devicemotion` event gives us information about
 the movement of the device, and specifically, its acceleration as it moves. This is measured
 in `m/s2`. Usually acceleration takes into account gravity. However, we may not want this, and 
 as some devices don’t have the means to return acceleration without the effects of gravity.
   
  `devicemotion` event returns four values for acceleration: 
   * `acceleration` - A part of the event's payload returning the data about the current device's acceleration 
   excluding gravity for all three axes (acceleration.`x`, acceleration.`y`, acceleration.`z`).
   * `accelerationIncludingGravity` - A part of the event's payload returning the data about the current device's
    acceleration including gravity (if the device is unable to provide the data without the gravity effect using
     event.acceleration).
   * `rotationRate`  - A part of the event's payload returning the data about the current device's rotation rates 
   for all three axes (rotationRate.alpha, rotationRate.beta, rotationRate.gamma).
   * `interval` - A part of the event's payload returning the interval (in ms) at which the data is obtained 
   from the accelerometer.
   
 ***
   
#Reference
* [Gravitational acceleration](https://www.quora.com/What-does-g-9-81-m-s2-mean)



