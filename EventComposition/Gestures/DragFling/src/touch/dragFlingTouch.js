(function () {
  //utilities
  // let supportsPassive = false;
  // try {
  //   const opts = Object.defineProperty({}, "passive", {
  //     get: function () {
  //       supportsPassive = true;
  //     }
  //   });
  //   window.addEventListener("test", null, opts);
  //   window.removeEventListener("test", null, opts);
  // } catch (e) {
  // }
  // const thirdArg = supportsPassive ? {passive: false, capture: true} : true;

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
    // if (!composedEvent || !target)   //todo remove this redundant check? should always be done at the level up?
    //   return;
    composedEvent.preventDefault = function () {
      trigger.preventDefault();
      trigger.stopImmediatePropagation ? trigger.stopImmediatePropagation() : trigger.stopPropagation();
    };
    composedEvent.trigger = trigger;
    return target.dispatchEvent(composedEvent);
  }

  //custom make events
  function makeDraggingEvent(name, trigger) {
    const composedEvent = new CustomEvent("dragging-" + name, {
      bubbles: true,
      composed: true
    });
    composedEvent.x = trigger.changedTouches ? parseInt(trigger.changedTouches[0].clientX) : trigger.x;
    composedEvent.y = trigger.changedTouches ? parseInt(trigger.changedTouches[0].clientY) : trigger.y;
    return composedEvent;
  }

  function makeFlingEvent(trigger, sequence) {
    const flingTime = trigger.timeStamp - sequence.flingDuration;
    const flingStart = findLastEventOlderThan(sequence.recorded, flingTime);
    if (!flingStart) return null;
    const detail = flingDetails(trigger, flingStart);
    if (detail.distDiag < sequence.flingDistance) return null;
    detail.angle = flingAngle(detail.distX, detail.distY);
    return new CustomEvent("fling", {bubbles: true, composed: true, detail});
  }

  function findLastEventOlderThan(events, timeTest) {
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].timeStamp < timeTest) return events[i];
    }
    return null;
  }

  function flingDetails(flingEnd, flingStart) {
    const distX = parseInt(flingEnd.changedTouches[0].clientX) - flingStart.x;
    const distY = parseInt(flingEnd.changedTouches[0].clientY) - flingStart.y;
    const distDiag = Math.sqrt(distX * distX + distY * distY);
    const durationMs = flingEnd.timeStamp - flingStart.timeStamp;
    return {distX, distY, distDiag, durationMs};
  }

  function flingAngle(x = 0, y = 0) {
    return (Math.atan2(y, -x) * 180 / Math.PI + 270) % 360;
  }

  //custom sequence
  let globalSequence;

  const touchdownInitialListener = e => onTouchdownInitial(e);
  const touchdownSecondaryListener = e => onTouchdownSecondary(e);
  const touchmoveListener = e => onTouchmove(e);
  const touchendListener = e => onTouchend(e);
  const onBlurListener = e => onBlur(e);
  const onSelectstartListener = e => onSelectstart(e);

  function startSequence(target, e) {
    const sequence = {
      target,
      touchCancel: target.hasAttribute("draggable-cancel-touchcancel"),
      flingDuration: parseInt(target.getAttribute("fling-duration")) || 50,
      flingDistance: parseInt(target.getAttribute("fling-distance")) || 100,
      recorded: [e],
      userSelectStart: document.children[0].style.userSelect,                                   //[1]. GrabTouch
      touchActionStart: document.children[0].style.touchAction
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

  function updateSequence(sequence, e) {
    sequence.recorded.push(e);
    return sequence;
  }

  function stopSequence() {
    //release target and event type start
    //always remove all potential listeners, regardless
    document.children[0].style.userSelect = globalSequence.userSelectStart; //[9]a GrabTouch
    document.children[0].style.touchAction = globalSequence.touchActionStart;
    window.removeEventListener("touchmove", touchmoveListener, {capture: true, passive: false});
    window.removeEventListener("touchend", touchendListener, {capture: true, passive: false});
    window.removeEventListener("blur", onBlurListener, {capture: true, passive: false});
    window.removeEventListener("selectstart", onSelectstartListener, {capture: true, passive: false});
    window.removeEventListener("touchstart", touchdownSecondaryListener, {capture: true, passive: false});
    window.addEventListener("touchdown", touchdownInitialListener, {capture: true, passive: false});
    return undefined;
  }

  //custom listeners

  function onTouchdownInitial(trigger) {
    // if (trigger.button !== 0)
    //   return;
    const target = filterOnAttribute(trigger, "draggable");
    if (!target)
      return;
    const composedEvent = makeDraggingEvent("start", trigger);
    captureEvent(trigger, false);
    globalSequence = startSequence(target, composedEvent);
    dispatchPriorEvent(target, composedEvent, trigger);
  }

  function onTouchdownSecondary(trigger) {
    const cancelEvent = makeDraggingEvent("cancel", trigger);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    dispatchPriorEvent(target, cancelEvent, trigger);
  }

  function onTouchmove(trigger) {
    if (globalSequence.cancelMouseout || mouseJailbreakOne(trigger)) {
      const cancelEvent = makeDraggingEvent("cancel", trigger);
      const target = globalSequence.target;
      globalSequence = stopSequence();
      dispatchPriorEvent(target, cancelEvent, trigger);
      return;
    }
    const composedEvent = makeDraggingEvent("move", trigger);
    captureEvent(trigger, false);
    globalSequence = updateSequence(globalSequence, composedEvent);
    dispatchPriorEvent(globalSequence.target, composedEvent, trigger);
  }


  function onTouchend(trigger) {
    const stopEvent = makeDraggingEvent("stop", trigger);
    const flingEvent = makeFlingEvent(trigger, globalSequence);
    captureEvent(trigger, false);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    dispatchPriorEvent(target, stopEvent, trigger);
    if (flingEvent)
      dispatchPriorEvent(target, flingEvent, trigger);
  }

  function mouseJailbreakOne(trigger) {
    return !(trigger.touches[0].clientY > 0 && trigger.touches[0].clientX > 0 && trigger.touches[0].clientX < window.innerWidth && trigger.touches[0].clientY < window.innerHeight);
  }


  function onBlur(trigger) {
    const blurInEvent = makeDraggingEvent("cancel", trigger);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    dispatchPriorEvent(target, blurInEvent, trigger);
  }

  function onSelectstart(trigger) {
    trigger.preventDefault();
    if (window.onSelect(trigger)) window.onSelect(trigger);
  }

  window.addEventListener("touchstart", touchdownInitialListener, {passive: false});
})();
