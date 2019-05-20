### HowTo: `devicemotion` event.
`devicemotion` event fired when the significant changes in the device's acceleration or 
rotation has occured. Since some browsers may not support this event, you must do a check 
before adding an event listener.

```javascript
if (window.DeviceMotionEvent) {
  window.addEventListener("devicemotion", function(e) {
    console.log("shake me more")
  });
}
```

A device that lies horizontally on a table with a screen facing upwards has `acceleration` and 
` accelerationIncludingGravity` values:

```javascript
 e.acceleration = 
  {x: 0,
   y: 0,
   z: 0};

 e.accelerationIncludingGravity = 
  {x: 0,
   y: 0,
   z: 9.81}; // Not 0 because the countdown starts from a Z axis. 9.81 - free fall acceleration on the Earth's surface (meter/sec^2).
```

A device that falls from the table in a horizontal position (with the screen facing upwards)
 has `acceleration` and `accelerationIncludingGravity` values:
 ```javascript
 e.acceleration = 
  {x: 0,
   y: 0,
   z: -9.81}; //a negative value because it's moving down.

 e.accelerationIncludingGravity = 
  {x: 0,
   y: 0,
   z: 0};
```

### Example: Shaker

In order to explain more clearly the assumption of acceleration, let's consider a simple example

```html
<div id="shaker">Shake me twice</div>

<script>
  let shakes = 0;

  function makeCocktail(e) {
    if (e.accelerationIncludingGravity.x > 45 && e.accelerationIncludingGravity.y > 45)  //[2]
      shakes++; 
    if (shakes === 2) {                                                                  //[3]                                                                  
      alert("Cocktail is ready");
      shakes = 0;
    }
  }
  if (window.DeviceMotionEvent) {
    window.addEventListener("devicemotion", makeCocktail);                               //[1]
  }
</script>
```
***
1. Event listener for devicemotion event.
2. Let's check the acceleration force. If the user shakes too little, the ingredients will not mix well =) 
3. After two strong enough shakes, the cocktail is ready.

Try in on [codepen.io](https://codepen.io/Halochkin/pen/mYBEZL?editors=1000);

### Reference
* [MDN: `devicemotion` event](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicemotion_event)