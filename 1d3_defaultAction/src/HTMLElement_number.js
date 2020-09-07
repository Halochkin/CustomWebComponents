import {addPostPropagationCallback, removePostPropagationCallback} from "../postPropagationCallback.js";

let intervalId;
let caretPosition = 0;

function setCaretPosition(elem, pos) {
  //todo add input type filter here:   text, number ..
  if (!elem.type || elem.type !== "text" || elem.type !== "number")
    return;
  elem.type = "text";
  if (elem.setSelectionRange) {
    elem.focus();
    elem.setSelectionRange(pos, pos);
  }
  elem.type = "number";
}

function getArrowDirection(event) {
  const distanceFromLeft = event.x - event.target.offsetLeft;
  const distanceFromTop = event.y - event.target.offsetTop;
  const paddingLeft = parseInt(window.getComputedStyle(event.target).paddingLeft);
  const paddingTop = parseInt(window.getComputedStyle(event.target).paddingTop);
  let width = event.target.getBoundingClientRect().width;
  let height = event.target.getBoundingClientRect().height;
  let factorFromLeft = distanceFromLeft / (width - paddingLeft * 2) * 100;
  let factorFromTop = distanceFromTop / (height - (paddingTop * 2)) * 100;
  if (factorFromLeft < 90)
    return
  return factorFromTop <= 50 ? "up" : "down";
}

function processInputValue(el, oldValue, newValue, min, max) {
  newValue < min && (newValue = min) && el.select();
  newValue > max && (newValue = max) && el.select();
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


function getFilteredValue(value, min) {
  if (!value)
    return min || 1;
  let values = value.split("e");
  if (values["2"]) // if there are 2 e
    return min || 1;
  if (values && values["1"])
    return parseInt(values["0"]) * 10 ** parseInt(values["1"]) + 1;
  else
    return parseInt(value);
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
  let value = getFilteredValue(input.value, min); // convert "e" into a number and increase/decrease its number on step value
  // wrong values
  if (min > max)
    throw new SyntaxError("min value is bigger than max value for an input number.");
  if (max < min)
    throw new SyntaxError("max value is smaller than min value for an input number.");
  if (step > max)
    throw new SyntaxError("the step value is bigger than the max value for an input number.");
  return [min, max, step, value];
}

export const ArrowUpInputNumberDefaultAction = {
  element: HTMLInputElement,
  event: {
    type: "keydown",
    isTrusted: true,
    key: "ArrowUp"
  },
  stateFilter: function (event, el) {
    return el.type === "number";
  },
  defaultAction: function stepUp(event, input) {
    const [min, max, step, oldValue] = getConfiguredNumberInput(input);
    const key = event.key;
    if (key !== "ArrowUp")
      return;
    setTimeout(function () {
      const newValue = step % 1 === 0 ? oldValue + step : parseInt(oldValue + step);// by default value increase to integer number (event if default value is a float). It is possible to left it float - define step as a float
      const didChange = processInputValue(input, oldValue, newValue, min, max);
      didChange && input.dispatchEvent(new InputEvent("change", {bubbles: true, composed: false}));
    }, 250);


  },
  repeat: "lowestWins",
  preventable: true
};

// todo: finish it
export const ArrowDownInputNumberDefaultAction = {
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
    const key = event.key;
    if (key !== "ArrowDown")
      return;
    //If someone hold a button
    setTimeout(function () {
      const newValue = step % 1 === 0 ? oldValue - step : parseInt(oldValue - step);
      const didChange = processInputValue(input, oldValue, newValue, min, max);
      didChange && input.dispatchEvent(new InputEvent("change", {bubbles: true, composed: false}));
    }, 250);
  },
  repeat: "lowestWins",
  preventable: true
};

export const ArrowLeftInputNumberDefaultAction = {
  element: HTMLInputElement,
  event: {
    type: "keydown",
    isTrusted: true,
    key: "ArrowLeft"
  },
  stateFilter: function (event, el) {
    return el.type === "number" && el.value;
  },
  defaultAction: function stepLeft(event, input) {
    const key = event.key;
    if (key !== "ArrowLeft")
      return;
    caretPosition--;
    if (caretPosition <= 0)
      return caretPosition = 0;
    //todo: do we need to add setTimeout and set Interval here?? If someone would hold a button - the event will fire several times
    setCaretPosition(input, caretPosition);
  },
  repeat: "lowestWins",
  preventable: true
};

export const ArrowRightInputNumberDefaultAction = {
  element: HTMLInputElement,
  event: {
    type: "keydown",
    isTrusted: true,
    key: "ArrowRight"
  },
  stateFilter: function (event, el) {
    return el.type === "number" && el.value;
  },
  defaultAction: function stepRight(event, input) {
    const key = event.key;
    if (key !== "ArrowRight")
      return;
    caretPosition++;
    if (caretPosition >= input.value.length)
      return caretPosition = input.value.length;
    setCaretPosition(input, caretPosition);
  },
  repeat: "lowestWins",
  preventable: true
};

export const KeydownInputNumberDefaultAction = {
  element: HTMLInputElement,
  event: {
    type: "keydown",
    isTrusted: true,
    // key: "Tab" /todo: how to pass possible values? as an array? ["1","2"..."e". "E". "Tab"..]?
  },
  stateFilter: function (event, el) {
    return el.type === "number";
  },
  defaultAction: function inputNumberKeypress(event, input) {
    const parsedKey = parseInt(event.key) || event.key !== "Tab" || event.key !== "e" || event.key !== "E"
    if (!parsedKey)
      return;

    const [min, max, step, oldValue] = getConfiguredNumberInput(input);

    if (event.key === "Tab") {
      input.focus();
      return input.select(); //select valuewhen element get a focus by Tab press
    } else if (Number.isInteger(parsedKey)) {
      input.value += event.key;

      setTimeout(function () {
        const newValue = oldValue + event.key;
        const didChange = processInputValue(input, oldValue, newValue, min, max);
        didChange && input.dispatchEvent(new InputEvent("change", {bubbles: true, composed: false}));
      }, 250);
    }

  },
  repeat: "lowestWins",
  preventable: true
};

let valueOnMousedown;
export const mousedownInputNumberDefaultAction = {
  element: HTMLInputElement,
  event: {
    type: "mousedown",
    isTrusted: true,
    button: 0
  },
  stateFilter: function (event, el) {
    return el.type === "number";
  },
  defaultAction: function inputNumberMousedown(down, input) {
    input.focus();
    const [min, max, step, oldValue] = getConfiguredNumberInput(input);
    const arrowDirection = getArrowDirection(down);
    if (!arrowDirection)
      return; // if click on input field
    setTimeout(function () {
      const newValue = arrowDirection === "up" ? oldValue + step : oldValue - step;
      const didChange = processInputValue(input, oldValue, newValue, min, max);
      setCaretPosition(input, newValue.length);  //set caret to the end
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