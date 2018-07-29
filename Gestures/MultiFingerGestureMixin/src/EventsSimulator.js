export {simulateEventSequence};
let time = 1;

function simulateEventSequence(arrayIn) {
  for (let i = 0; i < arrayIn.length; i++) {
    if (arrayIn[i][2] === "start") {
      sendTouchEvent(220, 255, 275, 175, 345, 250, arrayIn[i][0], arrayIn[i][1] + "start", i, arrayIn[i][3]);
    }
    if (arrayIn[i][2] === "move") {
      time += 1;
      sendTouchEvent(220 - time * 1.1, 235 + time, 275 + time, 175 - time, 345 + time, 250 + time, arrayIn[i][0], arrayIn[i][1] + "move", i, arrayIn[i][3]);
    }
    if (arrayIn[i][2] === "end") {
      sendTouchEvent(300, 400, 450, 250, 500, 50, arrayIn[i][0], arrayIn[i][1] + "end", i, arrayIn[i][3]);
    }
  }
}

function sendTouchEvent(x1, y1, x2, y2, x3, y3, element, eventType, id, fingers) {
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
  const touchObj3 = new Touch({
    identifier: id + 2,
    target: element,
    clientX: x3,
    clientY: y3,
    pageX: x3,
    pageY: y3,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 20,
    force: 0.5,
  });
  const twoFingersEvent = new TouchEvent(eventType, {
    cancelable: true,
    bubbles: true,
    touches: [touchObj, touchObj2],
    targetTouches: [touchObj, touchObj2],
    changedTouches: [touchObj, touchObj2],
  });
  const threeFingersEvent = new TouchEvent(eventType, {
    cancelable: true,
    bubbles: true,
    touches: [touchObj, touchObj2, touchObj3],
    targetTouches: [touchObj, touchObj2, touchObj3],
    changedTouches: [touchObj, touchObj2, touchObj3],
  });
  const oneFingerEvent = new TouchEvent(eventType, { // it is necessary for [oneHit] when first finger was not pressed on the element, so this second touch is part of something bigger.
    cancelable: true,                                     // 'touchstart' begins from one finger - then function defined [oneHit] as true - then 'touchstart' begins one more time with two fingers
    bubbles: true,                                        // without one-finger touch start PinchMixin will not works
    touches: [touchObj],
    targetTouches: [touchObj],
    changedTouches: [touchObj],
  });
  fingers === 1 ? element.dispatchEvent(oneFingerEvent) : element.dispatchEvent(threeFingersEvent);
}

