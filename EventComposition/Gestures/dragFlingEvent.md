# Event: DragFling

## What is the dragFling Event
* `Drag` is used to scroll the page/content and, at the same time, but the ability to select text does not supported. <br>
* `Fling` event similar to the [`drag-and-drop`](https://ru.wikipedia.org/wiki/Drag-and-drop) if simply this is a more advanced
version of `drag`. <br>
The difference between `fling` and `drag` gestures is that `fling` must match the minimum requirements that create
a 'boundary' between the calls to these two events. 
## dragFling attributes

 * `draggable`: will trigger
    * `dragging-start`
    * dragging-move
    * dragging-end
    * dragging-cancel: 
      1. on the mouse leaving the window 
      2. the window loosing focus as a consequence of for example alert being called.
      3. tomax
 * draggable-mouseout
 * draggable-distance
 * draggable-duration
 * fling: will trigger the fling event
## Code
The sequence of [patterns](https://github.com/orstavik/JoiComponents/tree/master/book/chapter11_event_comp) application is marked below.
```javascript
 (function () {
      let globalSequence;                                                 
      const onMouseupListener = e => onMouseup(e);
      const onMousemoveListener = e => onMousemove(e);
      const onMouseoutListener = e => onMouseout(e);

      window.addEventListener("mousedown", function (e) {                                     //1. EarlyBird
        onMousedown(e)                                                       
      }, {capture: true});

      function captureEvent(e, stopProp) {
        e.preventDefault();
        stopProp && e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.stopPropagation();
      }

      function filterOnAttribute(e, attributeName) {                                         //4. FilterByAttribute
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

      function replaceDefaultAction(target, composedEvent, trigger) {                       //3. ReplaceDefaultAction
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

      function makeDraggingEvent(name, trigger) {
        const composedEvent = new CustomEvent("dragging-" + name, {bubbles: true, composed: true});
        composedEvent.x = trigger.x;
        composedEvent.y = trigger.y;
        return composedEvent;
      }

      function makeFlingEvent(trigger, sequence) {
        const flingTime = trigger.timeStamp - sequence.flingDuration;
        const flingStart = findLastEventOlderThan(sequence.recorded, flingTime);
        if (!flingStart)
          return null;
        const detail = flingDetails(trigger, flingStart);
        if (detail.distDiag < sequence.flingDistance)
          return null;
        detail.angle = flingAngle(detail.distX, detail.distY);
        return new CustomEvent("fling", {bubbles: true, composed: true, detail});
      }

      function flingDetails(flingEnd, flingStart) {
        if (!flingStart) debugger;
        const current = flingEnd.target;
        const distX = parseInt(flingEnd.x) - flingStart.x;
        const distY = parseInt(flingEnd.y) - flingStart.y;
        const distDiag = Math.sqrt(distX * distX + distY * distY);
        const durationMs = flingEnd.timeStamp - flingStart.timeStamp;
        return {distX, distY, distDiag, durationMs, current};
      }

      function flingAngle(x = 0, y = 0) {
        return ((Math.atan2(y, -x) * 180 / Math.PI) + 270) % 360;
      }

      function startSequence(target, e) {                                                   //5. Event Sequence
        const body = document.querySelector("body");
        const sequence = {
          details: [e.x],
          target,
          cancelMouseout: target.hasAttribute("draggable-cancel-mouseout"),
          flingDuration: parseInt(target.getAttribute("fling-duration")) || 50,             //6. EventAttribute
          flingDistance: parseInt(target.getAttribute("fling-distance")) || 150,
          recorded: [e],
          userSelectStart: body.style.userSelect,                                           //10. GrabMouse
          touchActionStart: body.style.touchAction,
        };
        body.style.userSelect = "none";
        window.addEventListener("mousemove", onMousemoveListener, {capture: true});         //8. ListenUp
        window.addEventListener("mouseup", onMouseupListener, {capture: true});
        !sequence.cancelMouseout && window.addEventListener("mouseout", onMouseoutListener, {capture: true});
        return sequence;
      }

      function updateSequence(sequence, e) {                                                //7. TakeNote
        sequence.details.push(e.x);
        sequence.recorded.push(e);
        return sequence;
      }

      function stopSequence() {
        document.querySelector("body").style.userSelect = globalSequence.userSelectStart;   //9.a GrabMouse
        // body.style.touchAction = globalSequence.touchActionStart;
        window.removeEventListener("mouseup", onMouseupListener, {capture: true});
        window.removeEventListener("mousemove", onMousemoveListener, {capture: true});
        window.removeEventListener("mouseout", onMouseoutListener, {capture: true});
      }


      function onMousedown(trigger) {                                                       //2. CallShotgun
        if (trigger.button !== 0)
          return;
        if (globalSequence) {
          const cancelEvent = makeDraggingEvent("cancel", trigger);
          const target = globalSequence.target;                                             //8. Grab/Capture target???
          globalSequence = stopSequence();
          // dispatchPriorEvent(target, cancelEvent, trigger);
          replaceDefaultAction(target, cancelEvent, trigger);
          return;
        }
        const target = filterOnAttribute(trigger, "draggable");
        if (!target)
          return;
        const composedEvent = makeDraggingEvent("start", trigger);
        captureEvent(trigger, false);
        globalSequence = startSequence(target, composedEvent);
        replaceDefaultAction(target, composedEvent, trigger);
      }

      function onMousemove(trigger) {
        if (1 !== (trigger.buttons !== undefined ? trigger.buttons : trigger.which)) {
          const cancelEvent = makeDraggingEvent("cancel", trigger);
          const target = globalSequence.target;                                                //9. GrabTarget
          globalSequence = stopSequence();
          replaceDefaultAction(target, cancelEvent, trigger);
          return;
        }
        const composedEvent = makeDraggingEvent("move", trigger);
        captureEvent(trigger, false);
        globalSequence = updateSequence(globalSequence, composedEvent);
        replaceDefaultAction(globalSequence.target, composedEvent, trigger);                    //3. ReplaceDefaultAction
      }

      function onMouseup(trigger) {
        const stopEvent = makeDraggingEvent("stop", trigger);
        const flingEvent = makeFlingEvent(trigger, globalSequence);
        captureEvent(trigger, false);
        const target = globalSequence.target;
        globalSequence = stopSequence();
        replaceDefaultAction(target, stopEvent, trigger);
        if (flingEvent)
          replaceDefaultAction(target, flingEvent, trigger);
      }

      function onMouseout(trigger) {
        if (trigger.clientY > 0 && trigger.clientX > 0 && trigger.clientX < window.innerWidth && trigger.clientY < window.innerHeight)
          return;
        const cancelEvent = makeDraggingEvent("cancel", trigger);
        const target = globalSequence.target;
        globalSequence = stopSequence();
        replaceDefaultAction(target, cancelEvent, trigger);
      }
    }
  )();
```

1. comment
2. comment

## Example 1: Slider

```html

```

### Reference
* [Try the difference among different gestures here](https://rawgit.com/Halochkin/Components/master/Gestures/GesturesTest1.html)
* [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event)
* [DragEvent](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent)
