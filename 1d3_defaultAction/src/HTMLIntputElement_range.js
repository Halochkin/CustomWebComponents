import {addPostPropagationCallback, removePostPropagationCallback} from "../postPropagationCallback.js";

function processInputValue(el, oldValue, newValue, min, max) {
  newValue < min && (newValue = min);
  newValue > max && (newValue = max);
  if (oldValue === newValue)
    return false;
  el.value = newValue;
  return true;
}

// https://html.spec.whatwg.org/multipage/input.html#the-step-attribute
function getConfiguredRangeInput(input) {
  let min = parseInt(input.getAttribute("min")) || 0;  // Or I must parse float??
  let max = parseInt(input.getAttribute("max")) || 100;
  let step = parseFloat(input.getAttribute("step")) || 1;
  // negative step value
  if (step <= 0)
    step = 1;
  // wrong values
  if (min > max)
    throw new SyntaxError("min value is bigger than max value for an input range.");
  if (max < min)
    throw new SyntaxError("max value is smaller than min value for an input range.");
  if (step > max)
    throw new SyntaxError("the step value is bigger than the max value for an input range.");
  return [min, max, step, parseInt(input.value)];
}

function step(input, upDown) {
  const [min, max, step, oldValue] = getConfiguredRangeInput(input);
  let newValue = oldValue + (step * upDown);
  newValue = Number.isInteger(step) ? parseInt(newValue) : parseFloat(newValue);
  const didChange = processInputValue(input, oldValue, newValue, min, max);
  didChange && input.dispatchEvent(new InputEvent("input", {bubbles: true, composed: false}));
}

function stepLeft(event, input) {
  return step(input, 1);
}

function stepRight(event, input) {
  return step(input, -1);
}

let changeValue;

function checkChange(event, input) {
  const [a, b, c, newValue] = getConfiguredRangeInput(input);
  if (changeValue === newValue)
    return;
  changeValue = undefined;
  input.dispatchEvent(new InputEvent("change", {composed: true, bubbles: true}));
}


function factorFromLeft(mouseEvent, input) {
  const distanceFromLeft = mouseEvent.offsetLeft - input.offsetLeft;
  const width = input.getBoundingClientRect().width;
  let factorFromLeft = distanceFromLeft / width;
  if (factorFromLeft < 0)
    return 0;
  if (factorFromLeft > 1)
    return 1;
  return factorFromLeft;
}


let valueOnMousedown;


let activeStateMachine;

function startStateMachine(input, event, task) {
  activeStateMachine = {
    input,
    task,
    event,
    startValue: parseFloat(input.value),
    timer: setTimeout(runStateMachine, 1000)
  };
}

function stopStateMachine() {
  const [min, max, step, value] = getConfiguredRangeInput(activeStateMachine.input);
  const didChange = parseFloat(value) !== activeStateMachine.startValue;
  didChange && activeStateMachine.input.dispatchEvent(new InputEvent("change", {bubbles: true, composed: false}));
  clearTimeout(activeStateMachine.timer);
  activeStateMachine = undefined;
}

function runStateMachine() {
  activeStateMachine.task(activeStateMachine.input);
  activeStateMachine.timer = setTimeout(runStateMachine, 250);
}

export const MousemoveInputRangeDefaultAction = {
  element: HTMLInputElement,
  event: {type: "pointermove", isTrusted: true, button: 0},
  stateFilter: function (event, el) {
    return el.type === "range" && activeStateMachine;
  },
  defaultAction: function (event, input) {
    const [min, max, step, oldValue] = getConfiguredRangeInput(input);
    const newValue = (max - min) * factorFromLeft(event, input) + min;
    processInputValue(input, oldValue, newValue, min, max);
  },
  repeat: "lowestWins",
  preventable: true
};

export const MousedownStartInputRangeDefaultAction = {
  element: HTMLInputElement,
  event: {type: "pointerdown", isTrusted: true, button: 0},
  stateFilter: function (event, el) {
    return el.type === "range" && !activeStateMachine;
  },
  defaultAction: function (event, input) {
    const [min, max, step, oldValue] = getConfiguredRangeInput(input);
    const newValue = (max - min) * factorFromLeft(event, input) + min;
    processInputValue(input, oldValue, newValue, min, max);
    startStateMachine(input, event, processInputValue);
  },
  repeat: "lowestWins",
  preventable: true
};

export const MouseupEndInputRangeDefaultAction = {
  element: HTMLInputElement,
  event: {type: "pointerup", isTrusted: true, button: 0},
  stateFilter: function (event, el) {
    return activeStateMachine && activeStateMachine.type === "pointerdown" /* && el.type === "number"*/; //note 1
  },
  defaultAction: function (event, input) {
    const [min, max, step, value] = getConfiguredRangeInput(input);
    const didChange = parseFloat(value) !== activeStateMachine.startValue;
    didChange && input.dispatchEvent(new InputEvent("change", {bubbles: true, composed: false}));
    clearTimeout(activeStateMachine.timer);
    activeStateMachine = undefined;
    // stopStateMachine  ???
  },
  repeat: "lowestWins",
  preventable: true
};

export const ArrowLeftInputRangeDefaultAction = {
  element: HTMLInputElement,
  event: {type: "keydown", isTrusted: true, key: "ArrowLeft"},
  stateFilter: function (event, el) {
    return el.type === "range";
  },
  defaultAction: function (event, input) {
    stepLeft(event, input);
    checkChange(event, input);
  },
  repeat: "lowestWins",
  preventable: true
};

export const ArrowRightInputRangeDefaultAction = {
  element: HTMLInputElement,
  event: {type: "keydown", isTrusted: true, key: "ArrowRight"},
  stateFilter: function (event, el) {
    return el.type === "range";
  },
  defaultAction: function stepUp(event, input) {
    stepRight(event, input);
    checkChange(event, input);
  },
  repeat: "lowestWins",
  preventable: true
};

export const ArrowUpInputRangeDefaultAction = {
  element: HTMLInputElement,
  event: {type: "keydown", isTrusted: true, key: "ArrowUp"},
  stateFilter: function (event, el) {
    return el.type === "range";
  },
  defaultAction: function stepUp(event, input) {
    stepRight(event, input);
    checkChange(event, input);
  },
  repeat: "lowestWins",
  preventable: true
};

export const ArrowDownInputRangeDefaultAction = {
  element: HTMLInputElement,
  event: {type: "keydown", isTrusted: true, key: "ArrowDown"},
  stateFilter: function (event, el) {
    return el.type === "range";
  },
  defaultAction: function (event, input) {
    stepLeft(event, input);
    checkChange(event, input);
  },
  repeat: "lowestWins",
  preventable: true
};

export const FocusoutTriggerMousedownChangeInputRangeDefaultAction = {
  element: HTMLInputElement,
  event: {type: "focusout", isTrusted: true},
  stateFilter: function (event, el) {
    return activeStateMachine /*&& el.type === "number" */;
  },
  defaultAction: stopStateMachine,
  repeat: "once",
  preventable: true
};

export const FocusoutEndsKeydownStateMachine = {
  element: HTMLInputElement,
  event: {type: "focusout", isTrusted: true},
  // stateFilter: function (event, el) {
  //   return activeStateMachine /* && el.type === "number"*/; //note 1
  // },
  defaultAction: checkChange,
  repeat: "lowestWins",
  preventable: true
};
