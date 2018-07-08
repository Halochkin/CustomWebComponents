export {eventSimulator};
function eventSimulator() {
  const myElement = document.getElementById('controller');
  let eventType = "touch";
  let interval = 100;  // to perform certain conditions
  sendTouchEvent(125, 225, 275, 75, myElement, eventType + "start", 0);
  sendTouchEvent(125, 255, 285, 95, myElement, eventType + "start", 1);
  sendTouchEvent(30, 230, 20, 100, myElement, eventType + "move", 2);
  setTimeout(function () {
    sendTouchEvent(300, 400, 450, 250, myElement, eventType + "end", 4)
  }, interval);
}


function sendTouchEvent(x1, y1, x2, y2, element, eventType, id) {
  const touchObj = new Touch({
    identifier: id,
    target: element,
    clientX: x1,
    clientY: y1,
    pageX: x1,
    pageY: y1,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 130,
    force: 0.5,
  });
  const touchObj2 = new Touch({
    identifier: id + 1,
    target: element,
    clientX: x2,
    clientY: y2,
    pageX: x2,
    pageY: y2,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 20,
    force: 0.5,
  });
  const touchEvent = new TouchEvent(eventType, {
    cancelable: true,
    bubbles: true,
    touches: [touchObj, touchObj2],
    targetTouches: [touchObj, touchObj2],
    changedTouches: [touchObj, touchObj2],
  });
  const touchStartBaseEvent = new TouchEvent(eventType, { // it is necessary for [oneHit] when first finger was not pressed on the element, so this second touch is part of something bigger.
    cancelable: true,                                     // 'touchstart' begins from one finger - then function defined [oneHit] as true - then 'touchstart' begins one more time with two fingers
    bubbles: true,                                        // without one-finger touch start PinchMixin will not works
    touches: [touchObj],
    targetTouches: [touchObj],
    changedTouches: [touchObj],
  });
  id === 0 ? element.dispatchEvent(touchStartBaseEvent) : element.dispatchEvent(touchEvent);
}
