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


  function getAbsolutePosition(trigger) {
    let clientBound = trigger.target.getBoundingClientRect();
    let absX = trigger.x - clientBound.x;
    let absY = trigger.y - clientBound.y;
    return {bound: clientBound, x: absX, y: absY};
  }

  function checkDistance(sequence, current) {
    let start = sequence.recorded[0].detail.absCoord;
    let minDist = sequence.pullDistance;
    let distortion = sequence.pullDistortion;
    let axis = sequence.recorded[0].detail.axis;
    let distX = Math.abs(start.x + start.bound.left - current.x);
    let distY = Math.abs(start.y + start.bound.top - current.y);
    return {
      activated: axis === "Y" ? distY > minDist && distX < distortion : distX > minDist && distY < distortion,
      distX: distX,
      distY: distY
    };
  }

  function makeDetails(sequence, trigger) {
    let moved;
    let absCoord = getAbsolutePosition(trigger);
    let Axis = checkStartPoint(absCoord, trigger.target);
    if (sequence)
      moved = checkDistance(sequence, trigger);
    return {
      absCoord: absCoord,
      axis: Axis,
      moved: moved || {distX: 0, distY: 0, activated: false} //because globalSequence will be created after start event
    }

  }


  //checks if the start event fires in the acceptable area and returns axis, it will be used later to count moved distance (because we can pull-bottom/up and left/right)
  function checkStartPoint(coord, target) {
    let pullPadding = parseInt(target.getAttribute("pull-padding")) || 50;
    if (coord.y < pullPadding || coord.y > coord.bound.height - pullPadding)
      return "Y";
    if (coord.x < pullPadding || coord.x > coord.bound.width - pullPadding)
      return "X";
  }

  function makePullEvent(name, trigger, details) {
    return new CustomEvent("pull-" + name, {bubbles: true, composed: true, detail: details});
  }

  let globalSequence;
  const mousedownInitialListener = e => onMousedownInitial(e);
  const mousedownSecondaryListener = e => onMousedownSecondary(e);
  const mousemoveListener = e => onMousemove(e);
  const mouseupListener = e => onMouseup(e);
  const onBlurListener = e => onBlur(e);
  const onSelectstartListener = e => onSelectstart(e);


  function startSequence(target, e) {                                                            //5. Event Sequence
    const body = document.querySelector("body");
    const sequence = {
      target,
      cancelMouseout: target.hasAttribute("pull-cancel-pointerout"),
      pullDistance: parseInt(target.getAttribute("pull-distance")) || 80,
      pullDistortion: parseInt(target.getAttribute("pull-distortion")) || 20,
      recorded: [e],
      userSelectStart: body.style.userSelect,                                                    //10. Grabtouch
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

  function updateSequence(sequence, e) {                                                         //7. TakeNote
    sequence.recorded.push(e);
    return sequence;
  }

  function stopSequence() {
    document.children[0].style.userSelect = globalSequence.userSelectStart;
    window.removeEventListener("mousemove", mousemoveListener, true);
    window.removeEventListener("mouseup", mouseupListener, true);
    window.removeEventListener("blur", onBlurListener, true);
    window.removeEventListener("selectstart", onSelectstartListener, true);
    window.removeEventListener("mousedown", mousedownSecondaryListener, true);
    document.addEventListener("mousedown", mousedownInitialListener, true);
    return undefined;
  }

  function onMousedownInitial(trigger) {
    if (trigger.button !== 0)
      return;
    const target = filterOnAttribute(trigger, "pull");
    if (!target)
      return;
    let details = makeDetails(globalSequence, trigger);
    if (!details || !details.axis)
      return;
    // pass absCoord as a details to count moved distance
    const composedEvent = makePullEvent("start", trigger, details);
    captureEvent(trigger, false);
    globalSequence = startSequence(target, composedEvent);
    replaceDefaultAction(target, composedEvent, trigger);
  }

  function onMousedownSecondary(trigger) {
    const cancelEvent = makePullEvent("cancel", trigger);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    replaceDefaultAction(target, cancelEvent, trigger);
  }


  function onMousemove(trigger) {
    if (!globalSequence.cancelMouseout && mouseOutOfBounds(trigger)) {
      const cancelEvent = makePullEvent("cancel", trigger);
      const target = globalSequence.target;
      globalSequence = stopSequence();
      replaceDefaultAction(target, cancelEvent, trigger);
      return;
    }
    let details = makeDetails(globalSequence, trigger);
    if (!details)
      return;
    const composedEvent = makePullEvent("activated", trigger, details);
    captureEvent(trigger, false);
    globalSequence = updateSequence(globalSequence, composedEvent);
    replaceDefaultAction(globalSequence.target, composedEvent, trigger);
  }

  function onMouseup(trigger) {
    let details = makeDetails(globalSequence, trigger);
    if (!details)
      return;
    let composedEvent = makePullEvent("fired", trigger, details);
    // if (!stopEvent) return;
    // if last event was NOT activated - cancel
    if (!globalSequence.recorded[globalSequence.recorded.length - 1].detail.moved.activated)
      composedEvent = makePullEvent("cancel", trigger);

    captureEvent(trigger, false);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    replaceDefaultAction(target, composedEvent, trigger);
  }

  function mouseOutOfBounds(trigger) {
    return trigger.clientY < 0 || trigger.clientX < 0 || trigger.clientX > window.innerWidth || trigger.clientY > window.innerHeight;
  }

  function onBlur(trigger) {
    const blurInEvent = makePullEvent("cancel", trigger);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    replaceDefaultAction(target, blurInEvent, trigger);
  }

  function onSelectstart(trigger) {
    trigger.preventDefault();
    trigger.stopImmediatePropagation ? trigger.stopImmediatePropagation() : trigger.stopPropagation();
  }

  window.addEventListener("mousedown", onMousedownInitial);

})();
