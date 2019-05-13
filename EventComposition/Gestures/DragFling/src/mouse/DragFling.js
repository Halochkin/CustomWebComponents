(function () {
  //utilities
  function captureEvent(e, stopProp) {
    e.preventDefault();
    stopProp && e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.stopPropagation();
  }

  function filterOnAttribute(e, attributeName) {
    for (let el = e.target; el; el = el.parentNode) {
      if (!el.hasAttribute)
        return null;
      if (el.hasAttribute(attributeName))
        return el;
    }
    return null;
  }

  function replaceDefaultAction(target, composedEvent, trigger) {      //[3] ReplaceDefaultAction
    composedEvent.trigger = trigger;
    trigger.stopTrailingEvent = function () {
      composedEvent.stopImmediatePropagation ? composedEvent.stopImmediatePropagation() : composedEvent.stopPropagation();
    };
    trigger.preventDefault();
    return setTimeout(function () {
      target.dispatchEvent(composedEvent)
    }, 0);
  }

  //custom make events
  function makeDraggingEvent(name, trigger) {
    const composedEvent = new CustomEvent("dragging-" + name, {bubbles: true, composed: true});
    //todo the dragging-cancel events have a problem with the coordinates.
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

  function findLastEventOlderThan(events, timeTest) {
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].timeStamp < timeTest)
        return events[i];
    }
    return null;
  }

  function flingDetails(flingEnd, flingStart) {
    const distX = flingEnd.x - flingStart.x;
    const distY = flingEnd.y - flingStart.y;
    const distDiag = Math.sqrt(distX * distX + distY * distY);
    const durationMs = flingEnd.timeStamp - flingStart.timeStamp;
    return {distX, distY, distDiag, durationMs};
  }

  function flingAngle(x = 0, y = 0) {
    return ((Math.atan2(y, -x) * 180 / Math.PI) + 270) % 360;
  }

  //custom sequence
  let globalSequence;
  const mousedownInitialListener = e => onMousedownInitial(e);
  const mousedownSecondaryListener = e => onMousedownSecondary(e);
  const mousemoveListener = e => onMousemove(e);
  const mouseupListener = e => onMouseup(e);
  const onBlurListener = e => onBlur(e);
  const onSelectstartListener = e => onSelectstart(e);

  function startSequence(target, e) {
    const sequence = {
      target,
      cancelMouseout: target.hasAttribute("draggable-cancel-mouseout"),
      flingDuration: parseInt(target.getAttribute("fling-duration")) || 50,
      flingDistance: parseInt(target.getAttribute("fling-distance")) || 150,
      recorded: [e],
      userSelectStart: document.children[0].style.userSelect
    };
    document.children[0].style.userSelect = "none";
    document.removeEventListener("mousedown", mousedownInitialListener, true);
    window.addEventListener("mousedown", mousedownSecondaryListener, true);
    window.addEventListener("mousemove", mousemoveListener, true);
    window.addEventListener("mouseup", mouseupListener, true);
    window.addEventListener("blur", onBlurListener, true);
    window.addEventListener("selectstart", onSelectstartListener, true);
    return sequence;
  }

  function updateSequence(sequence, e) {
    sequence.recorded.push(e);
    return sequence;
  }

  function stopSequence() {
    //release target and event type start
    //always remove all potential listeners, regardless
    document.children[0].style.userSelect = globalSequence.userSelectStart;
    window.removeEventListener("mousemove", mousemoveListener, true);
    window.removeEventListener("mouseup", mouseupListener, true);
    window.removeEventListener("blur", onBlurListener, true);
    window.removeEventListener("selectstart", onSelectstartListener, true);
    window.removeEventListener("mousedown", mousedownSecondaryListener, true);
    document.addEventListener("mousedown", mousedownInitialListener, true);
    return undefined;
  }

  //custom listeners
  function onMousedownInitial(trigger) {
    if (trigger.button !== 0)
      return;
    const target = filterOnAttribute(trigger, "draggable");
    if (!target)
      return;
    const composedEvent = makeDraggingEvent("start", trigger);
    captureEvent(trigger, false);
    globalSequence = startSequence(target, composedEvent);
    replaceDefaultAction(target, composedEvent, trigger);
  }

  function onMousedownSecondary(trigger) {
    const cancelEvent = makeDraggingEvent("cancel", trigger);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    replaceDefaultAction(target, cancelEvent, trigger);
  }

  function onMousemove(trigger) {
    if (!globalSequence.cancelMouseout && mouseOutOfBounds(trigger)) {
      const cancelEvent = makeDraggingEvent("cancel", trigger);
      const target = globalSequence.target;
      globalSequence = stopSequence();
      replaceDefaultAction(target, cancelEvent, trigger);
      return;
    }
    const composedEvent = makeDraggingEvent("move", trigger);
    captureEvent(trigger, false);
    globalSequence = updateSequence(globalSequence, composedEvent);
    replaceDefaultAction(globalSequence.target, composedEvent, trigger);
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

  function mouseOutOfBounds(trigger) {
    return trigger.clientY < 0 || trigger.clientX < 0 || trigger.clientX > window.innerWidth || trigger.clientY > window.innerHeight;
  }

  function onBlur(trigger) {
    const blurInEvent = makeDraggingEvent("cancel", trigger);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    replaceDefaultAction(target, blurInEvent, trigger);
  }

  function onSelectstart(trigger) {
    trigger.preventDefault();
    trigger.stopImmediatePropagation ? trigger.stopImmediatePropagation() : trigger.stopPropagation();
  }


  document.addEventListener("mousedown", mousedownInitialListener);
})();
