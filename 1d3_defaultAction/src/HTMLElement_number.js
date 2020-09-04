import {addPostPropagationCallback, removePostPropagationCallback} from "../postPropagationCallback.js";

let intervalId;

function getArrowDirection(event) {
  const distanceFromLeft = event.x - event.target.offsetLeft;
  const distanceFromTop = event.y - event.target.offsetTop;
  let width = event.target.getBoundingClientRect().width;
  let height = event.target.getBoundingClientRect().height;
  let factorFromLeft = distanceFromLeft / width * 100;
  let factorFromTop = distanceFromTop / height * 100;
  if (factorFromLeft < 90)
    return
  return factorFromTop < 50 ? "up" : "down";
}

function processInputValue(el, oldValue, newValue, min, max) {
  newValue < min && (newValue = min);
  newValue > max && (newValue = max);
  if (oldValue === newValue)
    return false;
  //"intervalId" variable is global variable. Maybe it is possible to pass it as event property
  intervalId = setInterval(function () {
    el.value = newValue;
    const input = new InputEvent("input", {bubbles: true, composed: true});
    el.dispatchEvent(input);
    return true; // to clearIt
  }, 250);
}


function getFilteredValue(value, step) {
  if (!value)
    return 1;
  let left = value.split("e")
  if (left && left["1"])
    return parseInt(left["0"]) * 10 ** parseInt(left["1"]) + 1;
  return 1;
}

//todo when you press down on the upper button, you are using a statemachine here too
//todo the statemachine uses mousedown and then adds a setTimeout that in turn triggers setIntervals
//the first timer is maybe a second?
//the ensuing timers are maybe 250ms?
//todo the statemachine listens only for mousedown and mouseup and focusout.

function getConfiguredNumberInput(input) {
  let min = parseInt(input.getAttribute("min")) || Number.NEGATIVE_INFINITY;
  let max = parseInt(input.getAttribute("max")) || Number.POSITIVE_INFINITY;
  let step = parseFloat(input.getAttribute("step")) || 1;
  // negative step value
  if (step <= 0)
    step = 1;
  // convert input values
  let value = getFilteredValue(input.value, step); // convert "e" into a number and increase/decrease its number on step value
  // wrong values
  if (min > max)
    throw new SyntaxError("min value is bigger than max value for an input range.");
  if (max < min)
    throw new SyntaxError("max value is smaller than min value for an input range.");
  if (step > max)
    throw new SyntaxError("the step value is bigger than the max value for an input range.");
  return [min, max, step, value];
}

export const ArrowUpInputRangeDefaultAction = {
  element: HTMLInputElement,
  event: {
    type: "keydown",
    isTrusted: true,
    key: "ArrowUp"
  },
  stateFilter: function (event, el) {
    return el.type === "number";
  },
  defaultAction: function stepDown(event, input) {
    const [min, max, step, oldValue] = getConfiguredNumberInput(input);
    const key = e.key;
    if (key !== "ArrowUp")
      return;
    const newValue = oldValue + step;
    const didChange = processInputValue(input, oldValue, newValue, min, max);
    clearInterval(intervalId); //clear interval when keyup;
    didChange && input.dispatchEvent(new InputEvent("change", {bubbles: true, composed: false}));
  },
  repeat: "lowestWins",
  preventable: true
};

// todo: finish it
export const ArrowDownInputRangeDefaultAction = {
  element: HTMLInputElement,
  event: {
    type: "keydown",
    isTrusted: true,
    key: "ArrowDown"
  },
  stateFilter: function (event, el) {
    return el.type === "number";
  },
  defaultAction: function stepDown(event, input) {
    const [min, max, step, oldValue] = getConfiguredNumberInput(input);
    const key = e.key;
    if (key !== "ArrowDown")
      return;
    //If someone hold a button
    setTimeout(function () {
      const newValue = oldValue - step;
      const {didChange, intervalId} = processInputValue(input, oldValue, newValue, min, max);
      didChange && input.dispatchEvent(new InputEvent("change", {bubbles: true, composed: false}));
    }, 250);
  },
  repeat: "lowestWins",
  preventable: true
};

let valueOnMousedown;
export const mousedownInputRangeDefaultAction = {
  element: HTMLInputElement,
  event: {
    type: "mousedown",
    isTrusted: true,
    button: 0
  },
  stateFilter: function (event, el) {
    return el.type === "number";
  },
  defaultAction: function inputRangeMousedown(down, input) {
    const [min, max, step, oldValue] = getConfiguredNumberInput(input);
    const arrowDirection = getArrowDirection(down);
    if (!arrowDirection)
      return; // if click on input field
    setTimeout(function () {
      const newValue = arrowDirection === "up" ? oldValue + step : oldValue - step;
      const didChange = processInputValue(input, oldValue, newValue, min, max);
      valueOnMousedown = oldValue;
      didChange && input.dispatchEvent(new InputEvent("change", {bubbles: true, composed: false}));
    }, 250);

    const downObserver = function (move) {
      if (!move.isTrusted)
        return;
      move.preventDefault();
      const [min, max, step, oldValue] = getConfiguredNumberInput(input);
      const arrowDirection = getArrowDirection(down);
      if (!arrowDirection)
        return; // if click on input field
      const newValue = arrowDirection === "up" ? oldValue + step : oldValue - step;
      processInputValue(input, oldValue, newValue, min, max);
    };

    const upObserver = function (up) {
      if (!up.isTrusted || up.button !== 0)
        return;
      up.preventDefault();
      clearInterval(intervalId); //global scope, because it is difficult to pass it via listener
      if (parseInt(input.value) !== valueOnMousedown)
        input.dispatchEvent(new InputEvent("change", {bubbles: true, composed: false}));

      removePostPropagationCallback(window, "mousedown", downObserver);
      removePostPropagationCallback(window, "mouseup", upObserver);
      removePostPropagationCallback(window, "focusout", focusoutObserver);
    };
    const focusoutObserver = function (focusout) {
      if (!focusout.isTrusted)
        return;
      removePostPropagationCallback(window, "mousedown", downObserver);
      removePostPropagationCallback(window, "mouseup", upObserver);
      removePostPropagationCallback(window, "focusout", focusoutObserver);
    };

    addPostPropagationCallback(window, "mousedown", downObserver);
    addPostPropagationCallback(window, "mouseup", upObserver);
    addPostPropagationCallback(window, "focusout", focusoutObserver);  // cant pass setInterval id here
  },
  repeat: "lowestWins",
  preventable: true
};
