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


  function makeMousePressEvent(name, trigger, detail) {
    const composedEvent = new CustomEvent("mouse-press-" + name, {bubbles: true, composed: true, detail: detail});
    composedEvent.x = trigger.pageX;
    composedEvent.y = trigger.pageY;
    return composedEvent;
  }

  let globalSequence;

  let duration;

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
      cancelMouseout: target.hasAttribute("mouse-press-pointerout"),
      // duration: parseInt(target.getAttribute("mouse-press-durationms")) || 1500,
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
    const target = filterOnAttribute(trigger, "mouse-press");
    if (!target)
      return;

    duration = setTimeout(function () {
      const composedEvent = makeMousePressEvent("activated", trigger);
      captureEvent(trigger, false);
      globalSequence = updateSequence(globalSequence, composedEvent);
      replaceDefaultAction(globalSequence.target, composedEvent, trigger);
    }, parseInt(trigger.target.getAttribute("mouse-press-durationms")) || 1500);

    const composedEvent = makeMousePressEvent("start", trigger);
    captureEvent(trigger, false);
    globalSequence = startSequence(target, composedEvent);
    replaceDefaultAction(target, composedEvent, trigger);
  }

  function onMousedownSecondary(trigger) {
    const cancelEvent = makeMousePressEvent("cancel", trigger);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    replaceDefaultAction(target, cancelEvent, trigger);
  }


  function onMousemove(trigger) {
    // const cancelEvent = makeMousePressEvent("cancel", trigger);
    // const target = globalSequence.target;
    // globalSequence = stopSequence();
    // replaceDefaultAction(target, cancelEvent, trigger);
  }

  function onMouseup(trigger) {

    let composedEvent;

    //fires Only after mouseup event
    // let duration = trigger.timeStamp - globalSequence.recorded[0].timeStamp;
    // if (duration > globalSequence.duration)
    //   composedEvent = makeMousePressEvent("activated", trigger);
    // else
    //   composedEvent = makeMousePressEvent("cancel", trigger);

    // automatical long click (fires without mouseup event)
    if (globalSequence.recorded[globalSequence.recorded.length - 1].type !== "mouse-press-activated") {
      composedEvent = makeMousePressEvent("cancel", trigger);
      clearTimeout(duration);
    }
    if (!composedEvent)
      return;
    captureEvent(trigger, false);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    replaceDefaultAction(target, composedEvent, trigger);
  }

  function mouseOutOfBounds(trigger) {
    return trigger.clientY < 0 || trigger.clientX < 0 || trigger.clientX > window.innerWidth || trigger.clientY > window.innerHeight;
  }

  function onBlur(trigger) {
    const blurInEvent = makeMousePressEvent("cancel", trigger);
    const target = globalSequence.target;
    globalSequence = stopSequence();
    replaceDefaultAction(target, blurInEvent, trigger);
  }

  function onSelectstart(trigger) {
    trigger.preventDefault();
    trigger.stopImmediatePropagation ? trigger.stopImmediatePropagation() : trigger.stopPropagation();
  }

  window.addEventListener("mousedown", onMousedownInitial);

})
();
