(function () {

  let supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, "passive", {
      get: function () {
        supportsPassive = true;
      }
    });
    window.addEventListener("test", null, opts);
    window.removeEventListener("test", null, opts);
  } catch (e) {
  }
  const thirdArg = supportsPassive ? {capture: true, passive: false} : true;


  function captureEvent(e, stopProp) {
    e.preventDefault();
    stopProp && e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.stopPropagation();
  }

  function filterOnAttribute(e, attributeName) {
    for (let el = e.target; el; el = el.parentNode) {
      if (!el.hasAttribute) return null;
      if (el.hasAttribute(attributeName)) return el;
    }
    return null;
  }

  function dispatchPriorEvent(target, composedEvent, trigger) {
    composedEvent.preventDefault = function () {
      trigger.preventDefault();
      trigger.stopImmediatePropagation ? trigger.stopImmediatePropagation() : trigger.stopPropagation();
    };
    composedEvent.trigger = trigger;
    return target.dispatchEvent(composedEvent);
  }

  function makeSwipeEvent(name, trigger) {
    const composedEvent = new CustomEvent("swipe-" + name, {
      bubbles: true,
      composed: true,
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
  const touchInitialListener = e => onTouchInitial(e);
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
    window.removeEventListener("touchstart", touchInitialListener, thirdArg);
    window.removeEventListener("touchend", touchInitialListener, thirdArg);
    window.addEventListener("touchstart", touchdownSecondaryListener, thirdArg);
    window.addEventListener("touchmove", touchmoveListener, thirdArg);
    window.addEventListener("touchend", touchendListener, thirdArg);
    window.addEventListener("blur", onBlurListener, thirdArg);
    window.addEventListener("selectstart", onSelectstartListener, thirdArg);
    return sequence;
  }

  function updateSequence(sequence, e) {                                                         //7. TakeNote
    sequence.recorded.push(e);
    return sequence;
  }

  function stopSequence() {
    document.children[0].style.userSelect = globalSequence.userSelectStart;
    document.children[0].style.touchAction = globalSequence.touchActionStart;
    window.removeEventListener("touchmove", touchmoveListener, thirdArg);
    window.removeEventListener("touchend", touchendListener, thirdArg);
    window.removeEventListener("blur", onBlurListener, thirdArg);
    window.removeEventListener("selectstart", onSelectstartListener, thirdArg);
    window.removeEventListener("touchstart", touchdownSecondaryListener, thirdArg);
    window.addEventListener("touchdown", touchInitialListener, thirdArg);
    window.addEventListener("touchend", touchInitialListener, thirdArg);
    return undefined;
  }

  function onTouchInitial(trigger) {
    if (trigger.defaultPrevented)
      return;
    if (trigger.touches.length !== 1)           //support sloppy finger
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
    const composedEvent = makeSwipeEvent("move", trigger);
    captureEvent(trigger, false);
    globalSequence = updateSequence(globalSequence, composedEvent);
    dispatchPriorEvent(globalSequence.target, composedEvent, trigger);
  }

  function onTouchend(trigger) {
    trigger.preventDefault();
    const stopEvent = makeSwipeEvent("stop", trigger);
    if (!stopEvent) return;
    captureEvent(trigger, false);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    dispatchPriorEvent(target, stopEvent, trigger);
  }

  function onBlur(trigger) {
    const blurInEvent = makeSwipeEvent("cancel", trigger);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    dispatchPriorEvent(target, blurInEvent, trigger);
  }

  function onSelectstart(trigger) {
    trigger.preventDefault();
    trigger.stopImmediatePropagation ? trigger.stopImmediatePropagation() : trigger.stopPropagation();
  }

  document.addEventListener("touchstart", touchInitialListener, thirdArg);
})();
