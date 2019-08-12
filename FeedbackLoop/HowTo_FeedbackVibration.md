# HowTo: Feedback Vibration

Modern browsers support vibration, which is present in smartphones and tablets. We can use the vibration effect in games,
messages, etc.

To make sure that the device supports vibration and activate it, first of all you need to turn to the `Navigator` interface. 
Navigator is a child object of the window object that contains information about the browser, the device on which the
browser is running, and the available hardware devices. All information about the browser is read-only.

The `vibrate()` method is responsible for the vibration. The method has one parameter that takes an integer or an array 
of integers.  The number is responsible for the period of time, in _milliseconds_, during which the device will vibrate. 
If you specify an array of numbers, the even numbers are responsible for the vibration, while the odd numbers are 
responsible for the pause between vibrations.

To make sure that the browser supports the vibration method, you can check it:
```javascript
if (window.navigator && window.navigator.vibrate || "vibrate" in navigator) {
    // support 
} else {
    // not support
}
```
The vibration for one second is activated as follows.
```javascript
navigator.vibrate(1000);
```
Complex vibration - three times with half a second pause between them. The first two times the vibration lasts one second,
and the third time the vibration lasts two seconds.

```javascript
navigator.vibrate([1000, 500, 1000, 500, 2000]);
```
To stop the vibration
```javascript
navigator.vibrate(0);
// or so
navigator.vibrate([]);
```

### Example 
Lets make a simple example, which will activate the vibration after pressing the button for more than 2 seconds
```html
<button>Touch me longer than 2s</button>
<script>
  let button = document.querySelector("button");
  let durationMs = 2000;
  let pressed;

  if !("vibrate" in navigator) {                                     //[1]
    alert("Your devise does not support vibration")
  }

  button.addEventListener("touchstart", () => {                      //[2]
    pressed = setTimeout(() => {                                     //[3]
      navigator.vibrate(1000);                                       //[4]
    }, durationMs)
  });

  button.addEventListener("touchend", () => { 
    clearTimeout(pressed)                                            //[5]
  });
</script>
```
1. Check the vibration support.
2. Since in most cases vibration is supported by touchscreen devices, we will use touch events.
3. When `"touchstart"` event is activated, `setTimeout()` is activated, which activates vibration after 2 seconds.
4. Vibration activation, with 1 second duration.
5. If the user cancels the event earlier than 2 seconds, the vibration activation countdown will be canceled with clearTimeout().

### References

* [MDN: Navigator API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator);
* [MDN: Navigator.vibrate()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate);