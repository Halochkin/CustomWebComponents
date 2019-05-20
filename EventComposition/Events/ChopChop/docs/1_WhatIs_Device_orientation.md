# WhatIs: Motion detection?
All modern smartphones are equipped with a gyroscope, which allows us to get angles of inclination of the 
device in three planes. Motion events and orientation changes of the mobile device allow access to the 
built-in accelerometer, gyroscope and compass.

In order to use the data from the orientation event of the device, it is important to understand 
the values provided.

* `alpha` - represents the movement of the device around the `Z-axis`, express in degrees with values ranging 
   from `0°` to `360°`.
   > The `alpha` angle is 0° when top of the device is pointed directly toward the Earth's north pole,
   > and increases as the device is rotated toward the left.
 
 * `beta` - represents the movement of the device around the `X-axis` (front to back motion), express in degrees
  with values ranging from  `-180°` to `180°`. 
   > The `beta` angle is 0° when the device's top and bottom are the same distance from the Earth's surface, and 
   > increases toward 180° as the device is tipped forward and decreases toward -180° as the device is tipped 
   backward.
  
 * `gamma` - represents the movement of the device around the `Y-axis` (left to right motion), express in degrees with 
 values ranging from `-90°` to `90°`. 
  of the device.
   > The `gamma` angle is 0° when the device's left and right sides are the same distance from the surface of the Earth,
   >and increases toward 90° as the device is tipped toward the right, and toward -90° as the device is tipped toward
   >the left.
 
 
 ### Reference
 * [MDN: orientation and motion data explained](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Orientation_and_motion_data_explained)
 
 

