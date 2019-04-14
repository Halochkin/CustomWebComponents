(function () {

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

  function dispatchPriorEvent(target, composedEvent, trigger) {
    if (!composedEvent || !target)
    //todo remove this redundant check? should always be done at the level up?
      return;
    composedEvent.preventDefault = function () {
      trigger.preventDefault();
      trigger.stopImmediatePropagation
        ? trigger.stopImmediatePropagation()
        : trigger.stopPropagation();
    };
    composedEvent.trigger = trigger;
    return target.dispatchEvent(composedEvent);
  }

  function findLastEventOlderThan(events, timeTest) {
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].timeStamp < timeTest)
        return events[i];
    }
    return null;
  }

  function makeSwipeEvent(name, trigger) {
    let details;
    if (name !== "start") {
      details = makeDetails(trigger, globalSequence.recorded[0])
    }


    const composedEvent = new CustomEvent("swipe-" + name, {
      bubbles: true,
      composed: true,
      detail: details
    });
    composedEvent.x = trigger.changedTouches ? parseInt(trigger.changedTouches[0].clientX) : trigger.x;
    composedEvent.y = trigger.changedTouches ? parseInt(trigger.changedTouches[0].clientY) : trigger.y;


    return composedEvent;
  }

  function makeDetails(flingEnd, flingStart) {
    const distX = parseInt(flingEnd.changedTouches[0].pageX) - flingStart.x;
    const distY = parseInt(flingEnd.changedTouches[0].pageY) - flingStart.y;
    const distDiag = Math.sqrt(distX * distX + distY * distY);
    const durationMs = flingEnd.timeStamp - flingStart.timeStamp;
    return {distX, distY, distDiag, durationMs};
  }


  let globalSequence;
  const touchdownInitialListener = e => onTouchdownInitial(e);
  const touchdownSecondaryListener = e => onTouchdownSecondary(e);
  const touchmoveListener = e => onTouchmove(e);
  const touchendListener = e => onTouchend(e);
  const onBlurListener = e => onBlur(e);
  const onSelectstartListener = e => onSelectstart(e);


  function startSequence(target, e) {                                                            //5. Event Sequence
    const body = document.querySelector("body");
    const sequence = {
      target,
      cancelTouchout: target.hasAttribute("swipe-cancel-pointerout"),
      swipeDuration: parseInt(target.getAttribute("pointer-duration")) || 50,                    //6. EventAttribute
      swipeDistance: parseInt(target.getAttribute("pointer-distance")) || 100,
      recorded: [e],
      userSelectStart: body.style.userSelect,                                                    //10. Grabtouch
      touchActionStart: body.style.touchAction,
    };
    document.children[0].style.userSelect = "none";
    document.children[0].style.touchAction = "none";
    window.removeEventListener("touchstart", touchdownInitialListener, {capture: true, passive: false});
    window.addEventListener("touchstart", touchdownSecondaryListener, {capture: true, passive: false});
    window.addEventListener("touchmove", touchmoveListener, {capture: true, passive: false});
    window.addEventListener("touchend", touchendListener, {capture: true, passive: false});
    window.addEventListener("blur", onBlurListener, {capture: true, passive: false});
    window.addEventListener("selectstart", onSelectstartListener, {capture: true, passive: false});
    return sequence;
  }

  function updateSequence(sequence, e) {                                                         //7. TakeNote
    sequence.recorded.push(e);
    return sequence;
  }

  function stopSequence() {
    document.children[0].style.userSelect = globalSequence.userSelectStart;                      //[9]a GrabTouch
    document.children[0].style.touchAction = globalSequence.touchActionStart;
    window.removeEventListener("touchmove", touchmoveListener, {capture: true, passive: false});
    window.removeEventListener("touchend", touchendListener, {capture: true, passive: false});
    window.removeEventListener("blur", onBlurListener, {capture: true, passive: false});
    window.removeEventListener("selectstart", onSelectstartListener, {capture: true, passive: false});
    window.removeEventListener("touchstart", touchdownSecondaryListener, {capture: true, passive: false});
    window.addEventListener("touchdown", touchdownInitialListener, {capture: true, passive: false});
  }

  function onTouchdownInitial(trigger) {

    const touches = trigger.targetTouches.length;
    if (touches > 1)
      return;
    const target = filterOnAttribute(trigger, "swipe");
    if (!target)
      return;
    const composedEvent = makeSwipeEvent("start", trigger);
    captureEvent(trigger, false);
    globalSequence = startSequence(target, composedEvent);
    dispatchPriorEvent(target, composedEvent, trigger);
  }

  function onTouchdownSecondary(trigger) {
    const cancelEvent = makeSwipeEvent("cancel", trigger);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    dispatchPriorEvent(target, cancelEvent, trigger);
  }

  function onTouchmove(trigger) {
    if (globalSequence.cancelMouseout || mouseJailbreakOne(trigger)) {
      const cancelEvent = makeSwipeEvent("cancel", trigger);
      const target = globalSequence.target;
      globalSequence = stopSequence();
      dispatchPriorEvent(target, cancelEvent, trigger);
      return;
    }
    const composedEvent = makeSwipeEvent("move", trigger);
    captureEvent(trigger, false);
    globalSequence = updateSequence(globalSequence, composedEvent);
    dispatchPriorEvent(globalSequence.target, composedEvent, trigger);
  }

  function onTouchend(trigger) {
    const stopEvent = makeSwipeEvent("stop", trigger);
    if (!stopEvent) return;
    captureEvent(trigger, false);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    dispatchPriorEvent(target, stopEvent, trigger);
  }

  function mouseJailbreakOne(trigger) {
    return !(trigger.touches[0].clientY > 0 && trigger.touches[0].clientX > 0 && trigger.touches[0].clientX < window.innerWidth && trigger.touches[0].clientY < window.innerHeight);
  }

  function onBlur(trigger) {
    const blurInEvent = makeSwipeEvent("cancel", trigger);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    dispatchPriorEvent(target, blurInEvent, trigger);
  }

  function onSelectstart(trigger) {
    trigger.preventDefault();
  }

  window.addEventListener("touchstart", touchdownInitialListener, {passive: false});

})();
