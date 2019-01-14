 let startPath;
  let endPath;
  let cashedDetails;
  let startEventPath;
  let globalNode;
  let minDuration = 200;
  let minDistance = 50;

  function addDragEvent(node) {
    globalNode = node;
    node.addEventListener("mousedown", mouseStart, {caption: true, passive: false});
    node.addEventListener("touchstart", touchStart, {caption: true, passive: false});
  }

  function findLastEventOlderThan(events, timeTest) {
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].timeStamp < timeTest)
        return events[i];
    }
    return null;
  }

  function extendDetail(lastDetail, startDetail) {
    let distX, distY;
    if (lastDetail.changedTouches) {
      distX = lastDetail.changedTouches[0].pageX - startDetail.changedTouches[0].pageX;
      distY = lastDetail.changedTouches[0].pageY - startDetail.changedTouches[0].pageY;
    }
    else {
      distX = lastDetail.x - startDetail.x;
      distY = lastDetail.y - startDetail.y;
    }
    const distDiag = Math.sqrt(distX * distX + distY * distY);
    const duration = lastDetail.timeStamp - startDetail.timeStamp;
    return Object.assign({distX, distY, distDiag, duration}, lastDetail);
  }

  function mouseStart(e) {
    e.preventDefault();
    globalNode.addEventListener("mousemove", mouseMove, {caption: true, passive: false});
    globalNode.addEventListener("mouseup", mouseUp, {caption: true, passive: false});
    start({event, x: event.x, y: event.y});
  }

  function touchStart(e) {
    e.preventDefault();
    globalNode.addEventListener("touchmove", touchMove, {caption: true, passive: false});
    globalNode.addEventListener("touchend", touchUp, {caption: true, passive: false});
    start({event, x: event.targetTouches[0].pageX, y: event.targetTouches[0].pageY});
  }

  function start(details) {
    for (let el = details.event.target; el; el = el.parentNode) {
      if (el.hasAttribute) {
        cashedDetails = [details.event];
        startEventPath = details.event.composedPath();
      }
      return;
    }
  }

  function mouseMove(e) {
    e.preventDefault();
    move({event, x: event.x, y: event.y});
  }

  function touchMove(e) {
    e.preventDefault();
    move({event, x: event.targetTouches[0].pageX, y: event.targetTouches[0].pageY});
  }

  function move(details) {
    // if (detail.event.defaultPrevented) return;
    startPath = Array.from(startEventPath).reverse();
    endPath = Array.from(details.event.composedPath()).reverse();
    let target;
    for (let i = 0; i < startPath.length && startPath[i] === endPath[i]; i++) {
      if (startPath[i].hasAttribute && startPath[i].hasAttribute("drag-n-drop"))
        target = startPath[i];
    }
    if (!target)
      return;
    const prevDetail = cashedDetails[cashedDetails.length - 1];
    let detail = extendDetail(details.event, prevDetail);
    cashedDetails.push(details.event);
    const dragEvent = new CustomEvent("drag", {
      bubbles: true,
      composed: true,
      detail
    });
    setTimeout(() => target.dispatchEvent(dragEvent), 0);
  }

  function mouseUp(e) {
    e.preventDefault();
    end({event, x: event.x, y: event.y});
    globalNode.removeEventListener("mousemove", mouseMove, {caption: true, passive: false});
    globalNode.removeEventListener("mouseup", mouseUp, {caption: true, passive: false});
  }

  function touchUp(event) {
    event.preventDefault();
    end({event, x: event.changedTouches[0].pageX, y: event.changedTouches[0].pageY});
    globalNode.removeEventListener("touchmove", touchMove, {caption: true, passive: false});
    globalNode.removeEventListener("touchend", touchUp, {caption: true, passive: false});
  }

  function end(details) {
    details.event.preventDefault();
    cashedDetails.push(details.event);
    fling(details);
  }

  function fling(details) {
    const flingTime = cashedDetails[cashedDetails.length - 1].timeStamp - minDuration;
    const flingStart = findLastEventOlderThan(cashedDetails, flingTime);
    let targetFling;
    for (let i = 0; i < startPath.length; i++) {
      if (startPath[i].hasAttribute && startPath[i].hasAttribute("fling"))
        targetFling = startPath[i];
    }
    if (!targetFling || !flingStart)
      return;
    let detail = extendDetail(details.event, flingStart);
    if (detail.distance < minDistance)
      return;
    const flingEvent = new CustomEvent("fling", {
      bubbles: true,
      composed: true,
      detail
    });
    setTimeout(() => targetFling.dispatchEvent(flingEvent), 0);
  }

  addDragEvent(window || document);


  function dragHandler(e) {
    e.target.style.transition = undefined;
    e.target.style.marginLeft = (parseInt(e.target.style.marginLeft) + parseInt(e.detail.distX)) + "px";
    e.target.style.marginTop = (parseInt(e.target.style.marginTop) + parseInt(e.detail.distY)) + "px";
  }

  function flingHandler(e) {
    e.target.style.transition = "all " + e.detail.duration + "ms cubic-bezier(0.39, 0.58, 0.57, 1)";
    e.target.style.marginLeft = (parseInt(e.target.style.marginLeft) + parseInt(e.detail.distX)) + "px";
    e.target.style.marginTop = (parseInt(e.target.style.marginTop) + parseInt(e.detail.distY)) + "px";
  }


  document.addEventListener("drag", dragHandler, {caption: true, passive: false});
  document.addEventListener("fling", flingHandler, {caption: true, passive: false});
