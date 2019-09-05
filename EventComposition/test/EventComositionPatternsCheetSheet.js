/* 1. `EarlyBird` - the EarlyBird listener function is added before the function is loaded. It calls shotgun.

   2. `CallShotgun` - as soon as the function is defined, the trigger function would work as intended.

   3. `PriorEvent`  - propagates the custom composed event before the triggering event.

   4. `AfterthoughtEvent` - custom, composed event that is dispatched after the triggering event.

   5. `ReplaceDefaultAction` - allows us to block the defaultAction of the triggering event. This gives us the clear
       benefit of a consistent event sequence, but the clear benefit of always loosing the native composed events or the
       native default action.

   6. `FilterByAttribute` - to make an event specific to certain element instances we need a pure `filterOnAttribute`
       function that finds the first target with the required attribute, and then dispatching the custom, composed event on
       that element.
         // 6. `EventAttribute` - you can set your own conditions for fling events by defining them in custom properties.
         // If you do not define them, the default values will be applied.

   7. `EventSequence` - beginning of the sequence of events. Since mouse events start with `mousedown` events, it starts
       the sequence. Function `startSequence` initializes theproperties that will be used further. These include both the
       conditions of a `fling` event, and standard css properties

   8. `GrabTarget` - target is "captured" in the initial trigger event function (`mousedown`), then stored in the
       EventSequence's internal state, and then reused as the target in subsequent, secondary composed DOM Events.



// 8. `ListenUp` - Adding listeners alternately. Events such as `touchmove`, `touchup` and `touchcancel` will be added
    // only after the `mousedown` event is activated, and will pass through several filtering steps. This allows us to avoid
    // possible mistakes.



10. `GrabMouse` - the idea is that the initial launch event changes `userSelect` to `none` and after the end of the
     // event sequence, return this value to the state in which it was before the start of the event sequence.
*/


(function () {

    //-----------------------------------------------------------------------------------------
    // let globalSequence;
    // const onMouseupListener = e => onMouseup(e);
    // const onMousemoveListener = e => onMousemove(e);
    // const onMouseoutListener = e => onMouseout(e);

    window.addEventListener("mousedown", function (e) {                      //1. EarlyBird
      onMousedownHandler(e)                                                  //2. Call shotgun
    }, {capture: true});


    function onMousedownHandler(trigger) {                                   //2. CallShotgun
      //some stuff
      //
    }

    //-----------------------------------------------------------------------------------------

    function onClick(e) {                                                    //3. PriorEvent
      if (e.defaultPrevented || e.customPrevented)
        return;
      dispatchPriorEvent(e.target, new CustomEvent("echo-click", {bubbles: true, composed: true}), e);
    }

    function dispatchPriorEvent(target, composedEvent, trigger) {
      composedEvent.preventDefault = function () {
        trigger.preventDefault();
        trigger.stopImmediatePropagation ? trigger.stopImmediatePropagation() : trigger.stopPropagation();
      };
      composedEvent.trigger = trigger;
      target.dispatchEvent(composedEvent);
    }

    document.addEventListener("click", onClick, true);


    //-----------------------------------------------------------------------------------------

    function dispatchAfterthoughtEvent(target, composedEvent, trigger) {           //4. AfterthoughtEvent
      composedEvent.trigger = trigger;
      return setTimeout(function () {
        target.dispatchEvent(composedEvent);
      }, 0);
    }

    function onClick(e) {
      if (e.defaultPrevented || e.customPrevented)
        return;
      const echo = new CustomEvent("echo-click", {bubbles: true, composed: true});
      dispatchAfterthoughtEvent(e.target, echo, e);
    }

    document.addEventListener("click", onClick, true);

    //-----------------------------------------------------------------------------------------

    function replaceDefaultAction(target, composedEvent, trigger) {          //5. ReplaceDefaultAction
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

    function onClick(e) {
      if (e.defaultPrevented || e.customPrevented)
        return;
      replaceDefaultAction(e.target, new CustomEvent("echo-click", {bubbles: true, composed: true}), e);
    }

    document.addEventListener("click", onClick, true);

    //-----------------------------------------------------------------------------------------

    function filterOnAttribute(e, attributeName) {                       //6. FilterByAttribute /  EventAttribute
      for (let el = e.target; el; el = el.parentNode) {
        if (!el.hasAttribute)
          return null;
        if (el.hasAttribute(attributeName))
          return el;
      }
      return null;
    }

    //-----------------------------------------------------------------------------------------
    function startSequence(target, e) {                                       //7. Event Sequence
      const body = document.querySelector("body");
      const sequence = {
        target,
        cancelMouseout: target.hasAttribute("draggable-cancel-mouseout"),
        flingDuration: parseInt(target.getAttribute("fling-duration")) || 50,    //6. FilterByAttribute /  EventAttribute
        flingDistance: parseInt(target.getAttribute("fling-distance")) || 150,
        recorded: [e],
        userSelectStart: body.style.userSelect,                                   //10. GrabMouse
        touchActionStart: body.style.touchAction,
      };
      body.style.userSelect = "none";
      window.addEventListener("mousemove", onMousemoveListener, {capture: true}); //8. ListenUp
      window.addEventListener("mouseup", onMouseupListener, {capture: true});
      !sequence.cancelMouseout && window.addEventListener("mouseout", onMouseoutListener, {capture: true});
      return sequence;
    }

    document.addEventListener("mousedown", startSequence, true);

    //-----------------------------------------------------------------------------------------

    const target = filterOnAttribute(trigger, "draggable");  //9. GrabTarget
    //
    // const target = globalSequence.target;

    document.querySelector("body").style.userSelect = globalSequence.userSelectStart; //9.a GrabMouse

    //-----------------------------------------------------------------------------------------


    function captureEvent(e, stopProp) {
      e.preventDefault();
      stopProp && e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.stopPropagation();
    }


  }
)();

