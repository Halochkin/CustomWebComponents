###Problem: Incorrect Orientation During Hard Motioning

As you know, the tilt angles of the device are obtained from the built-in accelerometer and gyroscope.
These sensors are made as MEMS microelectromechanical system) - external influence on the sensor first changes the state 
of the mechanical part, then change the state of the mechanical part leads to a change in the signal of the electrical part. 
From a technical point of view, the gyroscope is a rather complex device. Its development is based on the principle of 
accelerometer operation, which is a bulb with a spring and a load inside. A load is attached to one side of the spring 
and the other side of the spring is attached to the damper to dampen the vibration. When the measuring device is shaken
 (accelerated), the attached mass moves and strains the spring.
These vibrations can be represented in the form of data. Positioning three of these accelerometers perpendicularly gives
 an idea of how the object is positioned in space. Since it is technically impossible to place such a bulky measuring 
 device in a smartphone, the principle of operation was left the same, but the weight was replaced by an inert mass, 
 which is located in a very small chip. At acceleration, the position of the inert mass changes and still calculates 
 the position of the device in space. Generally, not only electronics but also mechanics are assembled in one housing. 

The problem is that the accelerometer in the mobile device is not a high-precision device and can give incorrect values 
as a result of many factors, such as the sudden movement of the device, the presence of switched on electromagnetic 
devices located nearby. 
The most common cause of incorrect values is the rapid movement of the device (e.g. you decide to shake it). In this 
case, the inert mass may not be correct.
This means that if the device is rotated smoothly, the data will be accurate enough, but if moved abruptly, it will be 
much less accurate.

This means that if you make a custom gesture that provides for fast movement of the device, and the logic of your code 
depends on the value of the angle, the incorrect values will violate the logic and lead to incorrect work. 

To make sure of it, let's consider the following example

```html
<style>
  #info {
    font-size: 50px;
    word-wrap: break-word;
  }
</style>
<h3 id="info"></h3>
<script>
  const gammaDiapasone = [-50, -90];
  let element = document.querySelector("#info");

  function eventHandler(e) {
    if (e.gamma < gammaDiapasone[0] && e.gamma > gammaDiapasone[1]) {
      document.body.style.backgroundColor = "green";
      element.innerText += "+";
    } else {
      document.body.style.backgroundColor = "red";
      element.innerText += "+";
    }
  }
  if ("ondeviceorientation" in window)
    window.addEventListener("deviceorientation", eventHandler);
</script>
```

Try it on [codepen](https://codepen.io/Halochkin/pen/agBVoe?editors=1000);

The example is quite simple, if the device will be tilted in the range of -50 to -90 degrees in the gamma axis 
(turn perpendicular to the zero level) you will see the green background color. As soon as the device has a different
 angle of inclination, the background will change to red. 
Locate the position where the background color will be green (relative to the gamma axis). Since the range is relatively 
large, try tilting the unit smoothly to feel the angles. Then hold the device in range and try to quickly shake it 
relative to other axes (e.g. upwards). You can see that a quick shake will cause a brief red background color change. 
This is caused by the appearance of incorrect angle values during the rapid movement of the device.

As you can see from the demo, this is not a single angle, but a series of 3-10 events. 
Unfortunately, there is no software solution to this problem, because it is caused by hardware inaccuracies.

