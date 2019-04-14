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
      if (events[i].timeStamp < timeTest) return events[i];
    }
    return null;
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

  function makeDetail(touchevent) {

    let prevAngle = globalSequence ? globalSequence.recorded[globalSequence.recorded.length - 1].detail.angle : 0;
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
    const rotation = angle - prevAngle.toFixed(3);
    return {touchevent, x1, y1, x2, y2, diagonal, width, height, angle, rotation};
  }

  function calcAngle(x = 0, y = 0) {
    return ((Math.atan2(y, -x) * 180 / Math.PI) + 270) % 360;
  }

  function makeSpinEvent(trigger, sequence) {
    const spinTime = trigger.timeStamp - sequence.spinDuration;
    const spinStart = findLastEventOlderThan(sequence.recorded, spinTime);
    if (!spinStart) return null;
    const detail = spinDetails(globalSequence.recorded[globalSequence.recorded.length - 1].detail, spinStart);
    // detail.duration = sequence.spinDuration;
    if (detail.spinDiagonal < sequence.spinDistance) return null;
    detail.angle = calcAngle(detail.distX, detail.distY);
    return new CustomEvent("spin", {bubbles: true, composed: true, detail});
  }


  function spinDetails(spinEnd, spinStart) {
    const spinWidth = spinStart.detail.width - spinEnd.width;
    const spinHeight = spinStart.detail.height - spinEnd.height;
    const spinDiagonal = Math.sqrt(spinWidth * spinWidth + spinHeight * spinHeight);
    const durationMs = spinEnd.touchevent.timeStamp - spinStart.timeStamp;
    const xFactor = Math.abs(spinStart.detail.width / spinEnd.width);
    const yFactor = Math.abs(spinStart.detail.height / spinEnd.height);
    const diagonalFactor = Math.abs(spinStart.detail.diagonal / spinEnd.diagonal);
    const rotation = Math.abs(spinStart.detail.angle - spinEnd.angle);
    return {durationMs, xFactor, yFactor, diagonalFactor, rotation, spinDiagonal};
  }


  let oneHit = false;
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
      touchCancel: target.hasAttribute("pinch-cancel-touchout"),
      spinDuration: parseInt(target.getAttribute("spin-duration")) || 100,                      //6. EventAttribute
      spinDistance: parseInt(target.getAttribute("spin-distance")) || 100,
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
    return undefined;
  }


  function onTouchdownInitial(trigger) {
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
    const target = filterOnAttribute(trigger, "pinch");
    if (!target)
      return;
    const composedEvent = makePinchEvent("start", trigger);
    captureEvent(trigger, false);
    globalSequence = startSequence(target, composedEvent);
    dispatchPriorEvent(target, composedEvent, trigger);
  }

  function onTouchdownSecondary(trigger) {
    const cancelEvent = makePinchEvent("cancel", trigger);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    dispatchPriorEvent(target, cancelEvent, trigger);
  }

  function onTouchmove(trigger) {
    if (globalSequence.cancelMouseout || mouseJailbreakOne(trigger)) {
      const cancelEvent = makePinchEvent("cancel", trigger);
      const target = globalSequence.target;
      globalSequence = stopSequence();
      dispatchPriorEvent(target, cancelEvent, trigger);
      return;
    }
    const composedEvent = makePinchEvent("move", trigger);
    captureEvent(trigger, false);
    globalSequence = updateSequence(globalSequence, composedEvent);
    dispatchPriorEvent(globalSequence.target, composedEvent, trigger);                         //3. ReplaceDefaultAction
  }

  function onTouchend(trigger) {
    oneHit = false;
    const stopEvent = makePinchEvent("stop", trigger);
    const spinEvent = makeSpinEvent(trigger, globalSequence);
    captureEvent(trigger, false);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    dispatchPriorEvent(target, stopEvent, trigger);
    if (spinEvent)
      dispatchPriorEvent(target, spinEvent, trigger);
  }

  function mouseJailbreakOne(trigger) {
    return !(trigger.touches[0].clientY > 0 && trigger.touches[0].clientX > 0 && trigger.touches[0].clientX < window.innerWidth && trigger.touches[0].clientY < window.innerHeight);
  }

  function onBlur(trigger) {
    const blurEvent = makePinchEvent("cancel", trigger);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    dispatchPriorEvent(target, blurEvent, trigger);
  }

  function onSelectstart(trigger) {
    trigger.preventDefault();
  }

  window.addEventListener("touchstart", touchdownInitialListener, {passive: false});
})();
