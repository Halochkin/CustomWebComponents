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
  const thirdArg = supportsPassive ? {passive: false, capture: true} : true;

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

    if (!touchevent.targetTouches[1])
      debugger;


    let prevAngle = globalSequence
      ? globalSequence.recorded[globalSequence.recorded.length - 1].detail.angle
      : 0;
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

    // const diagonal = Math.sqrt(Math.abs( - x1) * width + height * height);

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
  const touchmoveListener = e => onTouchmove(e);
  const touchendListener = e => onTouchend(e);
  const touchcancelListener = e => onTouchcancel(e);
  const onBlurListener = e => onBlur(e);
  const onSelectstartListener = e => onSelectstart(e);

  function startSequence(target, e) {                                                            //5. Event Sequence
    const body = document.querySelector("body");
    const sequence = {
      target,
      touchCancel: target.hasAttribute("pinch-cancel-touchout"),
      spinDuration: parseInt(target.getAttribute("fling-duration")) || 100,                      //6. EventAttribute
      spinDistance: parseInt(target.getAttribute("fling-distance")) || 100,
      recorded: [e],
      userSelectStart: body.style.userSelect,                                                    //10. Grabtouch
      touchActionStart: body.style.touchAction,
    };
    body.style.userSelect = "none";
    body.style.touchAction = "none";
    window.addEventListener("touchmove", touchmoveListener, {
      capture: true,
      passive: false
    });
    window.addEventListener("touchend", touchendListener, {
      capture: true,
      passive: false
    });
    window.addEventListener("blur", onBlurListener, {
      capture: true,
      passive: false
    });
    window.addEventListener("selectstart", onSelectstartListener, {
      capture: true,
      passive: false
    });
    !sequence.touchCancel &&
    window.addEventListener("touchcancel", touchcancelListener, {
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
    //release target and event type start
    //always remove all potential listeners, regardless
    document.querySelector("body").style.userSelect =
      globalSequence.userSelectStart;
    window.removeEventListener("touchmove", touchmoveListener, {
      capture: true,
      passive: false
    });
    window.removeEventListener("touchend", touchendListener, {
      capture: true,
      passive: false
    });
    window.removeEventListener("blur", onBlurListener, {
      capture: true,
      passive: false
    });
    window.removeEventListener("selectstart", onSelectstartListener, {
      capture: true,
      passive: false
    });
    window.removeEventListener("touchcancel", touchcancelListener, {
      capture: true,
      passive: false
    });
    return undefined;
  }

  function onTouchstart(trigger) {
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
      dispatchPriorEvent(target, cancelEvent, trigger);
      return;
    }
    //filter 3
    const target = filterOnAttribute(trigger, "pinch");
    if (!target)
      return;

    const composedEvent = makePinchEvent("start", trigger);
    captureEvent(trigger, false);
    globalSequence = startSequence(target, composedEvent);
    dispatchPriorEvent(target, composedEvent, trigger);
  }

  function onTouchmove(trigger) {
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

  function onTouchcancel(trigger) {
    //filter
    if (trigger.clientY > 0 && trigger.clientX > 0 && trigger.clientX < window.innerWidth && trigger.clientY < window.innerHeight)
      return;   //The mouse has not left the window
    const cancelEvent = makePinchEvent("cancel", trigger);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    dispatchPriorEvent(target, cancelEvent, trigger);
  }

  function onBlur(trigger) {
    const blurEvent = makePinchEvent("cancel", trigger);
    document.querySelector("#test").innerHTML = "CANCEL type: " + blurEvent.type;
    const target = globalSequence.target;
    globalSequence = stopSequence();
    dispatchPriorEvent(target, blurEvent, trigger);
  }

  function onSelectstart(trigger) {
    trigger.preventDefault();
  }

  window.addEventListener("touchstart", onTouchstart, thirdArg);

})();
