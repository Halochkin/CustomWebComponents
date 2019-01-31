# Event: PinchSpin

## What is the dragFling Event
* `Pinch` A pinch gesture recognizer reports changes to the distance between two fingers touching the screen and trigger when active touch points move.Pinch gestures are continuous, so your action method is called each time the distance between the fingers changes. <br>
* `Spin` is a speedy version of pinch, but it rigger only when certain conditions are met, and are activated after the `touchend` event is activated.  <br>

## pinchSpin attributes
 * `pinch`: will trigger
    * `pinch-start`
    * `pinch-move`
    * `pinch-end`
  Drag event also have an attribute:
 * `pinch-cancel-touchout` - adds `pinch-cancel` events which fired when: 
      1. touch point leaving the window 
      2. new touch point is added when the pinch event is activated
 * `spin`: will trigger the fling event
 Using attributes we can change the default fling settings, such as
 1. `spin-distance` (100 by default);
 2. `spin-duration` (100 by default);
 
 ***
## Code
The sequence of [patterns](https://github.com/orstavik/JoiComponents/tree/master/book/chapter11_event_comp) application is marked below.
```javascript
   (function () {
    let globalSequence;
    let oneHit = false;
    const touchmoveListener = e => onTouchmove(e);
    const touchendListener = e => onTouchend(e);
    const touchcancelListener = e => onTouchcancel(e);

    window.addEventListener("touchstart", function (e) {
      onTouchStart(e)                                                                              //1. EarlyBird
    }, {capture: true, passive: false});

    function captureEvent(e, stopProp) {
      e.preventDefault();
      stopProp && e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.stopPropagation();
    }

    function filterOnAttribute(e, attributeName) {                                                 //4. FilterByAttribute
      for (let el = e.target; el; el = el.parentNode) {
        if (!el.hasAttribute)
          return null;
        if (el.hasAttribute(attributeName))
          return el;
      }
      return null;
    }

    function findLastEventOlderThan(events, timeTest) {
      for (let i = events.length - 1; i >= 0; i--) {
        if (events[i].timeStamp < timeTest)
          return events[i];
      }
      return null;
    }

    function replaceDefaultAction(target, composedEvent, trigger) {               //3. ReplaceDefaultAction
      composedEvent.trigger = trigger;
      trigger.stopTrailingEvent = function () {
        composedEvent.stopImmediatePropagation ?
          composedEvent.stopImmediatePropagation() :
          composedEvent.stopPropagation();
      };
      trigger.preventDefault();
      return setTimeout(function () {
        target.dispatchEvent(composedEvent)
      }, 0);
    }

    function makePinchEvent(name, trigger) {
      let detail;
      if (name === "stop" || name === "cancel") {
        detail = globalSequence.recorded[globalSequence.recorded.length - 1].detail;
      } else {
        detail = makeDetail(trigger);
      }
      return new CustomEvent("pinch-" + name, {bubbles: true, composed: true, detail});
    }

    function makeSpinEvent(trigger, sequence) {
      const spinTime = trigger.timeStamp - sequence.spinDuration;
      const spinStart = findLastEventOlderThan(sequence.recorded, spinTime);
      if (!spinStart)
        return null;
      const detail = globalSequence.recorded[globalSequence.recorded.length - 1].detail;
      detail.duration = sequence.spinDuration;
      detail.xFactor = Math.abs(spinStart.detail.width / detail.width);
      detail.yFactor = Math.abs(spinStart.detail.height / detail.height);
      detail.diagonalFactor = Math.abs(spinStart.detail.diagonal / detail.diagonal);
      detail.rotation = Math.abs(spinStart.detail.angle - detail.angle);
      let lastspinMotion = Math.abs(detail.x1 - spinStart.detail.x1) + (detail.y1 - spinStart.detail.y1); //the sum of the distance of the start and end positions of finger 1 and 2
      if (lastspinMotion < globalSequence.spinDistance)
        return;
      return new CustomEvent("spin", {bubbles: true, composed: true, detail});
    }

    function makeDetail(touchevent) {
      const f1 = touchevent.targetTouches[0];
      const f2 = touchevent.targetTouches[1];
      const x1 = f1.pageX;
      const y1 = f1.pageY;
      const x2 = f2.pageX;
      const y2 = f2.pageY;
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);
      const diagonal = Math.sqrt(width * width + height * height);
      const angle = calcAngle(x1 - x2, y1 - y2);
      return {touchevent, x1, y1, x2, y2, diagonal, width, height, angle};
    }

    function calcAngle(x = 0, y = 0) {
      return ((Math.atan2(y, -x) * 180 / Math.PI) + 270) % 360;
    }

    function startSequence(target, e) {                                                            //5. Event Sequence
      const body = document.querySelector("body");
      const sequence = {
        target,
        canceltouchout: target.hasAttribute("pinch-cancel-touchout"),
        spinDuration: parseInt(target.getAttribute("fling-duration")) || 100,                      //6. EventAttribute
        spinDistance: parseInt(target.getAttribute("fling-distance")) || 100,
        recorded: [e],
        userSelectStart: body.style.userSelect,                                                    //10. Grabtouch
        touchActionStart: body.style.touchAction,
      };
      body.style.userSelect = "none";
      body.style.touchAction = "none";
      window.addEventListener("touchmove", touchmoveListener, {capture: true, passive: false});    //8. ListenUp
      window.addEventListener("touchend", touchendListener, {capture: true, passive: false});
      !sequence.canceltouchout && window.addEventListener("touchcancel", touchcancelListener, {
        capture: true,
        passive: false
      });
      return sequence;
    }

    function updateSequence(sequence, e) {                                                         //7. TakeNote
      sequence.recorded.push(e);
      return sequence;
    }

    function stopSequence() {
      document.querySelector("body").style.userSelect = globalSequence.userSelectStart;            //9.a Grabtouch
      document.querySelector("body").style.touchAction = globalSequence.touchActionStart;
      window.removeEventListener("touchend", touchendListener, {capture: true, passive: false});
      window.removeEventListener("touchmove", touchmoveListener, {capture: true, passive: false});
      window.removeEventListener("touchcancel", touchcancelListener, {capture: true, passive: false});
    }

    function onTouchStart(trigger) {
      //filter 1
      const touches = trigger.targetTouches.length;
      // should start from one finger
      if (touches === 1)
        oneHit = true;
      if (touches > 2)
        onTouchend(trigger);
      if (touches !== 2)
        return;
      if (!oneHit)//first finger was not pressed on the element, so this second touch is part of something bigger.
        return;
      //filter 2
      if (globalSequence) {
        const cancelEvent = makePinchEvent("cancel", trigger);
        const target = globalSequence.target;
        globalSequence = stopSequence();
        replaceDefaultAction(target, cancelEvent, trigger);
        return;
      }
      //filter 3
      const target = filterOnAttribute(trigger, "pinch");
      if (!target)
        return;

      const composedEvent = makePinchEvent("start", trigger);
      captureEvent(trigger, false);
      globalSequence = startSequence(target, composedEvent);
      replaceDefaultAction(target, composedEvent, trigger);
    }

    function onTouchmove(trigger) {
      const composedEvent = makePinchEvent("move", trigger);
      captureEvent(trigger, false);
      globalSequence = updateSequence(globalSequence, composedEvent);
      replaceDefaultAction(globalSequence.target, composedEvent, trigger);                         //3. ReplaceDefaultAction

    }

    function onTouchend(trigger) {
      oneHit = false;
      const stopEvent = makePinchEvent("stop", trigger);
      const spinEvent = makeSpinEvent(trigger, globalSequence);
      captureEvent(trigger, false);
      const target = globalSequence.target;
      globalSequence = stopSequence();
      replaceDefaultAction(target, stopEvent, trigger);
      if (spinEvent)
        replaceDefaultAction(target, spinEvent, trigger);
    }

    function onTouchcancel(trigger) {
      //filter
      if (trigger.clientY > 0 && trigger.clientX > 0 && trigger.clientX < window.innerWidth && trigger.clientY < window.innerHeight)
        return;   //The mouse has not left the window
      const cancelEvent = makePinchEvent("cancel", trigger);
      const target = globalSequence.target;
      globalSequence = stopSequence();
      replaceDefaultAction(target, cancelEvent, trigger);
    }
  })();
```

1. `EarlyBird` - the EarlyBird listener function is added before the function is loaded. It calls shotgun.
2. `CallShotgun` - as soon as the function is defined, the trigger function would work as intended. 
3. `ReplaceDefaultAction` - allows us to block the defaultAction of the triggering event. This gives us the clear benefit of a consistent event sequence, but the clear benefit of always loosing the native composed events or the native default action.
4. `FilterByAttribute` - to make an event specific to certain element instances we need a pure `filterOnAttribute` function that finds the first target with the required attribute, and then dispatching the custom, composed event on that element.         
5. `EventSequence` - beginning of the sequence of events. Since mouse events start with `mousedown` events, it starts the sequence. Function `startSequence` initializes theproperties that will be used further. These include both the conditions of a `fling` event, and standard css properties, such as
6. `EventAttribute` - you can set your own conditions for fling events by defining them in custom properties. If you do not define them, the default values will be applied.
7. `TakeNote` - 
8. `ListenUp` - Adding listeners alternately. Events such as `touchmove`, `touchup` and `touchcancel` will be added only after the `mousedown` event is activated, and will pass through several filtering steps. This allows us to avoid possible mistakes.
9. `GrabTarget` - target is "captured" in the initial trigger event function (`mousedown`), then stored in the EventSequence's internal state, and then reused as the target in subsequent, secondary composed DOM Events.
10. `GrabMouse` - the idea is that the initial launch event changes `userSelect` to `none` and after the end of the event sequence, return this value to the state in which it was before the start of the event sequence.
***

## Example 1: Slider
Let's look at a simple but very useful example that allows you to change the block size using a `pinch` event.
```html
<div id="elem" pinch></div>                                                  
   
<script>
  let element = document.querySelector("#elem");
  let startDiagonal;                                                         //[1]

  window.addEventListener("pinch-start", e => {
    startDiagonal = e.detail.diagonal;                                       //[2]
  });
 
  window.addEventListener("pinch-move", e => {
    element.style.transform = `scale(${e.detail.diagonal / startDiagonal})`; //[3]
  });
</script>
```
1. Declare a variable in which will be store the value of the distance between the fingers.
2. Determine the distance between the touch points, provided that both are active and caused a pinch-start event.
3. At the beginning of the movement we get the zoom factor of the element.

Try it on [codepen.io](https://codepen.io/Halochkin/pen/wRbxbj);
***
## Example 2: Wheel of fortune??
// in the process)
### Reference
* 
