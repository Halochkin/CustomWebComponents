# Pattern: Throttled Event

`Throttling` is a widely used technique to increase the performance of code which is executed repeatedly with some periodicity.
It means that the function or callback is called no more than once in a specified period of time.

### Throttling for event handle
Since events can trigger at high speed, the event handler should not perform expensive operations such as 
DOM modifications. Instead, it is recommended to adjust the event using `requestAnimationFrame`.
This means that the callback of the event will be called no more than once per frame. 

> The number of callbacks is usually 60 times per second, but usually corresponds to the screen refresh rate in most web
browsers according to W3C recommendations.

Trottling also prevents the function from starting if it has already been started recently. 

### Example 
For a better understanding, let's consider a small example. 

The idea is that we will add an event listener for the `"resize"` event (actually we can use any event), but will not 
handle it directly every time the screen size is changed. The result of activating the `"resize"` event will be dispatch a new 
composed event which will be defined _no more_ than once per frame using `requestAnimationFrame()`. 

This will increase the productivity of the code, because the native events can be activated several times per frame, and
each time the browser will use the resource to activate the expensive functionality such as calling an external API, 
heavy computations or complex DOM manipulations. Since  there is no point in doing so several times per frame, we use 
the pattern described below, which provides callback activation not more than once per frame.


```javascript
(function() {                                                          //[1]
    var throttle = function(type, name, obj) {                         //[2]
        obj = obj || window;                                           //[4]
        var running = false;                                           //[5]   
        var func = function() {                                        //[6]
            if (running) { return; }                                   //[9]
            running = true;                                            //[10]
             requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));              //[11]
                running = false;                                       //[12]
            });
        };
        obj.addEventListener(type, func);                              //[7]
    };

    throttle("resize", "optimizedResize");                             //[3]
})();

// handle event
window.addEventListener("optimizedResize", function() {                //[8]
    console.log("Resource conscious resize callback!");                //[11]
});
```

1. Let's wrap the functionality in a self-proclaimed function in order to activate it as soon as possible.
2. Add a function that will receive three instruments:
    1. `type` - native event that will be listened to,
    2. `name` - name of the new event that will be dispatch, 
    3. `obj` - object in the context of which will be dispatch composed event.
3. Init native event, which will be listened. We can init any event
4. If obj is not passed, the event will be triggered in the global scope - window.
5. Variable that will be used to check the activation of the event. We will overwrite it once per frame. 
    It is equals false by default because the event listener for the native event has not yet been added.
6. Function that will be triggered when the native event is activated.
7. Adding an event listener to the global or local scope for a native event.
8. Adding an event listener for composed event.
9. When activating a native event, the first thing to check is the running variable, which indicates that the event 
   was not activated in the current frame.
10. Rewriting the running variable, which indicates that the event was activated in the current frame, and cannot be
   reactivated only in the next frame.
11. In `requestAnimationFrame()` function, in the specified scope (or global if not) dispatch new composed event. And handle it
in event listener function.
12. Overwrite the `running` variable after processing composed event, which means that the frame is finished and in the near 
    future will be switched to the next frame.
    
### Reference
* [MDN: RequestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
