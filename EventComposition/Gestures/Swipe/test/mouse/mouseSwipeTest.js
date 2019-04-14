//TEST1 of defaultPrevented
var defaultPrevented = true;
function testDefaultPrevented(e) {
  if (e.trigger.defaultPrevented)
    return true;
  console.error(e.trigger.type + " not defaultPrevented");
  defaultPrevented = false;
  return false;
}
window.addEventListener("swipe-start", testDefaultPrevented);
window.addEventListener("swipe-move", testDefaultPrevented);
window.addEventListener("swipe-stop", testDefaultPrevented);


//TEST2
var userSelectWorking = true;
function userSelectShouldBe(e) {
  let value = (e.type === "swipe-start" || e.type === "swipe-move") ? "none" : "";
  if (document.children[0].style.userSelect === value)
    return;
  console.warn("body.style.userSelect not set to: " + value);
  userSelectWorking = false;
}
window.addEventListener("swipe-start", userSelectShouldBe);
window.addEventListener("swipe-move", userSelectShouldBe);
window.addEventListener("swipe-stop", userSelectShouldBe);
window.addEventListener("swipe-cancel", userSelectShouldBe);


//TEST3
var targetHasAttribute = true;
function testswipeAttribute(e) {
  if (e.target.hasAttribute("swipe"))
    return true;
  console.error(e.target, "Wrong target, lacking attribute swipe");
  return false;
}
window.addEventListener("swipe-start", testswipeAttribute);

//TEST4
var sequenceWorking = true;
var sequences = [

  ["swipe-start", "swipe-move", "swipe-move", "swipe-cancel"],
  ["swipe-start", "swipe-cancel"],
  ["swipe-start", "swipe-stop"]
];
var prevEvent = undefined;

function checkSequence(e) {
  let prevType = prevEvent? prevEvent.type : undefined;
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

window.addEventListener("swipe-start", checkSequence);
window.addEventListener("swipe-move", checkSequence);
window.addEventListener("swipe-stop", checkSequence);
window.addEventListener("swipe-cancel", checkSequence);


//Report tests
function reportTests() {
  sequenceWorking ? console.log("OK sequence") : console.warn("ERROR sequence");
  targetHasAttribute ? console.log("OK swipe") : console.warn("ERROR missing swipe attribute");
  defaultPrevented ? console.log("OK defaultPrevented") : console.warn("ERROR defaultPrevented");
  userSelectWorking ? console.log("OK userSelect") : console.warn("ERROR userSelect");
}

window.addEventListener("swipe-stop", reportTests);
window.addEventListener("swipe-cancel", reportTests);
window.addEventListener("swipe-fling", reportTests);
