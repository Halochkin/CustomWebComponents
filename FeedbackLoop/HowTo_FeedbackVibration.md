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
<button>Press me more than 2s</button>
<script>
  let button = document.querySelector("button");
  let durationMs = 2000;
  let touchTimeout;

  (function () {                                                    //[1]

    if (!"vibrate" in navigator) {                                  //[2]
        alert("Your devise does not support vibration")
    }

    window.addEventListener("touchstart", touchThrottler, false);   //[3]
    window.addEventListener("touchend", () => {                     //[4]
      clearTimeout(touchTimeout);
    }, false);

    function touchThrottler() { 
          touchTimeout = setTimeout(()=> {                          //[3.1]
          button.dispatchEvent(new CustomEvent("long-press"));      //[3.2]
        }, durationMs);
    }

  }());                                                             //[1]

  // handle event
  button.addEventListener("long-press", function () {               //[5]
    navigator.vibrate(1000);
  });
```
1. Let's add a self-invoking function.
2. Check the vibration support.
3. Since in most cases vibration is supported by touchscreen devices, we will use touch events.
    1. Then `setTimeout()` is activated, which will start the countdown to activate the internal code after 2s.
    2. When the waiting time expires, there will be a new `"long-press"` composed event dispatch.
4. If the user cancels the event earlier than 2 seconds (activated `"touchend"` event), the vibration activation 
   countdown will be canceled with `clearTimeout()`.
5. Vibration activation, with 1 second duration.

### References

* [MDN: Navigator API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator);
* [MDN: Navigator.vibrate()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate);