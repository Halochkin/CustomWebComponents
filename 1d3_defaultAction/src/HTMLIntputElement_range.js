function inputProcessEnds(inputElement) {
  //option.color = orange?? //there is no way to trigger this behavior from js... It is completely hidden in the browser.
  const input = new InputEvent("input", {bubbles: true, composed: true});
  inputElement.dispatchEvent(input);
  const change = new InputEvent("change", {bubbles: true, composed: false});
  inputElement.dispatchEvent(change);
}

function getConfiguredRangeInput(input) {
  input.min = parseInt(target.getAttribute("min")) || 0;  // Or I must parse float??
  input.max = parseInt(target.getAttribute("max")) || 100;
  input.step = parseFloat(target.getAttribute("step")) || 1;
  // negative step value
  if (step <= 0)
    step = 1;
  // wrong values
  if (input.min > input.max || input.max < input.min || step > input.max)
    return;
  input.value = parseInt(target.getAttribute("value")) || input.min + input.max / 2;
  // todo: do we need to use e
  if (input.value < input.min)
    input.value = input.min;
  if (value > input.max)
    input.value = input.max;
  return input;
}


export const clickInputRangeDefaultAction = {
  element: HTMLInputElement,
  event: {
    type: "mousedown",
    isTrusted: true
  },
  stateFilter: function (event, el) {
    return el.type === "range";
  },
  defaultAction: function inputRangeMousedown(event, el) {
    //todo here we need to add a statemachine for mousemove and mouseup

    let inputRange = getConfiguredRangeInput(el);
    let rangeInitialX = event.clientX - event.target.getBoundingClientRect().left;
    inputRange.addEventListener("mousemove", e => {
      inputRange.value = e.clientX - rangeInitialX; // alter range by set value property
      inputProcessEnds(inputRange);

    });
    // el.addEventListener("mouseup", e => {
    //   el.value = e.clientX - rangeInitialX; // stop process??
    // });
  },
  repeat: "lowestWins",
  preventable: true
};

// https://html.spec.whatwg.org/multipage/input.html#the-step-attribute

export const ArrowLeftInputRangeDefaultAction = {
  element: HTMLInputElement,
  event: {
    type: "keydown",
    isTrusted: true,
    key: "ArrowLeft"
  },
  stateFilter: function (event, el) {
    return el.type === "range";
  },
  defaultAction: function stepDown(event, el) {
    let inputRange = getConfiguredRangeInput(el);
    inputRange.value -= inputRange.step;
    inputProcessEnds(inputRange);
  },
  repeat: "lowestWins",
  preventable: true
};

export const ArrowRightInputRangeDefaultAction = {
  element: HTMLInputElement,
  event: {
    type: "keydown",
    isTrusted: true,
    key: "ArrowRight"
  },
  stateFilter: function (event, el) {
    return el.type === "range";
  },
  defaultAction: function stepUp(event, el) {
    let inputRange = getConfiguredRangeInput(el);
    inputRange.value += inputRange.step;
    inputProcessEnds(inputRange);
  },
  repeat: "lowestWins",
  preventable: true
};