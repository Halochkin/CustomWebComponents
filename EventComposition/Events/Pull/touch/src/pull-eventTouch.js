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
    let absX = trigger.changedTouches[0].pageX - clientBound.x;
    let absY = trigger.changedTouches[0].pageY - clientBound.y;
    return {bound: clientBound, x: absX, y: absY};
  }

  function checkDistance(sequence, current) {
    let start = sequence.recorded[0].detail.absCoord;
    let minDist = sequence.pullDistance;
    let distortion = sequence.pullDistortion;
    let axis = sequence.recorded[0].detail.axis;
    let distX = Math.abs(start.x + start.bound.left - current.changedTouches[0].pageX);
    let distY = Math.abs(start.y + start.bound.top - current.changedTouches[0].pageY);
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
  const touchdownInitialListener = e => onTouchstartInitial(e);
  const touchdownSecondaryListener = e => ontouchstartSecondary(e);
  const touchmoveListener = e => onTouchmove(e);
  const touchendListener = e => onTouchend(e);
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

  function updateSequence(sequence = 0, e) {                                                         //7. TakeNote

    sequence.recorded.push(e);
    return sequence;
  }

  function stopSequence() {
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

  function onTouchstartInitial(trigger) {

    const target = filterOnAttribute(trigger, "pull");
    if (!target)
      return;
    let details = makeDetails(globalSequence, trigger);
    if (!details)
      return;
    // pass absCoord as a details to count moved distance
    const composedEvent = makePullEvent("start", trigger, details);
    captureEvent(trigger, false);
    globalSequence = startSequence(target, composedEvent);
    replaceDefaultAction(target, composedEvent, trigger);
  }

  function ontouchstartSecondary(trigger) {
    const cancelEvent = makePullEvent("cancel", trigger);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    replaceDefaultAction(target, cancelEvent, trigger);
  }


  function onTouchmove(trigger) {
    if (!globalSequence.cancelMouseout && touchOutOfBounds(trigger)) {
      const cancelEvent = makePullEvent("cancel", trigger);
      const target = globalSequence.target;
      globalSequence = stopSequence();
      replaceDefaultAction(target, cancelEvent, trigger);
      return;
    }
    //check moved distation, return true/false and coordinates of last event to store it to the detail

    let details = makeDetails(globalSequence, trigger);

    if (!details)
      return;

    const composedEvent = makePullEvent("activated", trigger, details);
    captureEvent(trigger, false);
    globalSequence = updateSequence(globalSequence, composedEvent);
    replaceDefaultAction(globalSequence.target, composedEvent, trigger);

  }

  function onTouchend(trigger) {
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

  function touchOutOfBounds(trigger) {
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

  window.addEventListener("touchstart", touchdownInitialListener, {passive: false});

})();
