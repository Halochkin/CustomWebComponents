//TEST1 of defaultPrevented
var defaultPrevented = true;

function testDefaultPrevented(e) {
  if (e.trigger.defaultPrevented)
    return true;
  console.error(e.trigger.type + " not defaultPrevented");
  defaultPrevented = false;
  return false;
}

window.addEventListener("pinch-start", testDefaultPrevented);
window.addEventListener("pinch-move", testDefaultPrevented);
window.addEventListener("pinch-stop", testDefaultPrevented);
window.addEventListener("spin", testDefaultPrevented);

//TEST2
var userSelectWorking = true;

function userSelectShouldBe(e) {
  let value = (e.type === "pinch-start" || e.type === "pinch-move") ? "none" : "";
  if (document.children[0].style.userSelect === value)
    return;
  console.warn("body.style.userSelect not set to: " + value);
  userSelectWorking = false;
}

window.addEventListener("pinch-start", userSelectShouldBe);
window.addEventListener("pinch-move", userSelectShouldBe);
window.addEventListener("pinch-stop", userSelectShouldBe);
window.addEventListener("pinch-cancel", userSelectShouldBe);
window.addEventListener("spin", userSelectShouldBe);

//TEST3
var touchActionWorking = true;

function touchActionShouldBe(e) {
  let value = (e.type === "pinch-start" || e.type === "pinch-move") ? "none" : "";
  if (document.children[0].style.touchAction === value)
    return;
  console.warn("body.style.touchAction not set to: " + value);
  userSelectWorking = false;
}

window.addEventListener("pinch-start", touchActionShouldBe);
window.addEventListener("pinch-move", touchActionShouldBe);
window.addEventListener("pinch-stop", touchActionShouldBe);
window.addEventListener("pinch-cancel", touchActionShouldBe);
window.addEventListener("spin", touchActionShouldBe);

//TEST4
var targetHasAttribute = true;

function testDraggableAttribute(e) {
  if (e.target.hasAttribute("pinch"))
    return true;
  console.error(e.target, "Wrong target, lacking attribute draggable");
  return false;
}

window.addEventListener("pinch-start", testDraggableAttribute);

//TEST5
var sequenceWorking = true;
var sequences = [
  ["pinch-start", "pinch-move", "pinch-move", "pinch-stop", "spin"],
  ["pinch-start", "pinch-move", "pinch-move", "pinch-cancel"],
  ["pinch-start", "pinch-cancel"],
  ["pinch-start", "pinch-stop"]
];
var prevEvent = undefined;

function checkSequence(e) {
  let prevType = prevEvent ? prevEvent.type : undefined;
  for (let sequence of sequences) {
    let prevPosition = sequence.indexOf(
      prevType);
    let position = sequence.lastIndexOf(e.type);
    if (prevPosition < position)
      return prevEvent = e; //true
  }
  console.warn(e.type + " is following " + prevType);
  sequenceWorking = false;
}

window.addEventListener("pinch-start", checkSequence);
window.addEventListener("pinch-move", checkSequence);
window.addEventListener("pinch-stop", checkSequence);
window.addEventListener("pinch-cancel", checkSequence);
window.addEventListener("spin", checkSequence);


//Report tests
function reportTests() {
  sequenceWorking ? console.log("OK sequence") : console.warn("ERROR sequence");
  targetHasAttribute ? console.log("OK draggable") : console.warn("ERROR missing draggable attribute");
  defaultPrevented ? console.log("OK defaultPrevented") : console.warn("ERROR defaultPrevented");
  userSelectWorking ? console.log("OK userSelect") : console.warn("ERROR userSelect");
  touchActionWorking ? console.log("OK touchAction") : console.warn("ERROR touchAction");
}

window.addEventListener("pinch-stop", reportTests);
window.addEventListener("pinch-cancel", reportTests);
window.addEventListener("pinch-spin", reportTests);
