export const testOnce = [];
export const testFirst = [];
export const testLast = [];
export const testOnceFirstLast = [];

const propAlternativesOnceBasic = [
  {once: true},
  {once: 1},
  {once: ""},
  {once: []},
  {once: "hello"},
  {once: {}},
  {capture: true, once: true},
  {capture: true, once: false},
  {capture: false, once: true},
  {capture: false, once: false},
];

const propAlternativesOnceErrors = [
  {capture: true, bubbles: true, once: true},
  {first: true, last: true, once: true},
  {last: false, once: true},
];

const propAlternativesFirstBasic = [
  {capture: true, first: true},
  {capture: true, first: 1},
  {capture: true, first: ""},
  {capture: true, first: []},
  {capture: true, first: "hello"},
  {capture: true, first: {}},
  {capture: true, first: true},
  {capture: true, first: false},
]

const propAlternativesFirstErrors = [
  {capture: false, first: true},
  {last: true, first: true},
  {last: false, first: true},
];

const propAlternativesLastBasic = [
  {bubbles: true, last: true},
  {bubbles: true, last: 1},
  {bubbles: true, last: ""},
  {bubbles: true, last: []},
  {bubbles: true, last: "hello"},
  {bubbles: true, last: {}},
  {bubbles: true, last: true},
  {bubbles: true, last: false},
]


const propAlternativesLastErrors = [
  {bubbles: false, last: true},
  {last: true, first: true},
  {last: false, first: true},
];

const propAlternativesAll = [
  {capture: true, first: true, last: true},
  {capture: true, first: true, last: false},
  {capture: true, first: false, last: true},
  {capture: true, first: false, last: false},
  {capture: false, first: true, last: true},
  {capture: false, first: true, last: false},
  {capture: false, first: false, last: true},
  {capture: false, first: false, last: false}
];

// const propAlternativesAll = [
//   // {capture: true, once: true, first: true, last: true},
//   { once: true, first: true, last: false},
//   // {capture: true, once: true, first: false, last: true},
//   // {capture: true, once: true, first: false, last: false},
//   // {capture: true, once: false, first: true, last: true},
//   // {capture: true, once: false, first: true, last: false},
//   // {capture: true, once: false, first: false, last: true},
//   // {capture: true, once: false, first: false, last: false},
//   // {capture: false, once: true, first: true, last: true},
//   // {capture: false, once: true, first: true, last: false},
//   // {capture: false, once: true, first: false, last: true},
//   // {capture: false, once: true, first: false, last: false},
//   // {capture: false, once: false, first: true, last: true},
//   // {capture: false, once: false, first: true, last: false},
//   // {capture: false, once: false, first: false, last: true},
//   // {capture: false, once: false, first: false, last: false},
// ];

const propAllPossibleAlternatives =
  [
    {capture: true, bubbles: true, once: true, first: true, last: true},
    {capture: true, bubbles: true, once: true, first: true, last: false},
    {capture: true, bubbles: true, once: true, first: false, last: true},
    {capture: true, bubbles: true, once: true, first: false, last: false},
    {capture: true, bubbles: true, once: false, first: true, last: true},
    {capture: true, bubbles: true, once: false, first: true, last: false},
    {capture: true, bubbles: true, once: false, first: false, last: true},
    {capture: true, bubbles: true, once: false, first: false, last: false},
    {capture: true, bubbles: false, once: true, first: true, last: true},
    {capture: true, bubbles: false, once: true, first: true, last: false},
    {capture: true, bubbles: false, once: true, first: false, last: true},
    {capture: true, bubbles: false, once: true, first: false, last: false},
    {capture: true, bubbles: false, once: false, first: true, last: true},
    {capture: true, bubbles: false, once: false, first: true, last: false},
    {capture: true, bubbles: false, once: false, first: false, last: true},
    {capture: true, bubbles: false, once: false, first: false, last: false},
    {capture: false, bubbles: true, once: true, first: true, last: true},
    {capture: false, bubbles: true, once: true, first: true, last: false},
    {capture: false, bubbles: true, once: true, first: false, last: true},
    {capture: false, bubbles: true, once: true, first: false, last: false},
    {capture: false, bubbles: true, once: false, first: true, last: true},
    {capture: false, bubbles: true, once: false, first: true, last: false},
    {capture: false, bubbles: true, once: false, first: false, last: true},
    {capture: false, bubbles: true, once: false, first: false, last: false},
    {capture: false, bubbles: false, once: true, first: true, last: true},
    {capture: false, bubbles: false, once: true, first: true, last: false},
    {capture: false, bubbles: false, once: true, first: false, last: true},
    {capture: false, bubbles: false, once: true, first: false, last: false},
    {capture: false, bubbles: false, once: false, first: true, last: true},
    {capture: false, bubbles: false, once: false, first: true, last: false},
    {capture: false, bubbles: false, once: false, first: false, last: true},
    {capture: false, bubbles: false, once: false, first: false, last: false}
  ]

function addEventListenerOptionOnce(target, res, options) {
  try {
    target.addEventListener("test", function (e) {
      res.push(e.detail);
      return res;
    }, options);
  } catch (error) {
    res.push(error);
    return res;
  }
}


function addEventListenerOptionTwiceFirst(target, res, options) {
  try {
    target.addEventListener("test", function (e) {
      res.push("a");
      return res;
    }); //no options;
    target.addEventListener("test", function (e) {
      res.push("b");
      return res;
    }, options); // {first: true}
  } catch (err) {
    res.push(err);
    return res;
  }
}

function addEventListenerOptionTwiceLast(target, res, options) {
  try {
    target.addEventListener("test", function (e) {
      res.push("a");
      return res;
    }, options); // {last: true}
    target.addEventListener("test", function (e) {
      res.push("b");
      return res;
    }); //no options;
  } catch (err) {
    res.push(err);
  }
  return res;
}

for (let options of propAlternativesOnceBasic) {
  testOnce.push({
    name: `addEventListenerOnceBasic: ${JSON.stringify(options)}`,
    fun: function (res, usecase) {
      let flatTree = usecase().flat(Infinity);
      let target = flatTree[0];
      addEventListenerOptionOnce(target, res, options);
      target.dispatchEvent(new CustomEvent("test", {detail: "a"}));
      target.dispatchEvent(new CustomEvent("test", {detail: "b"}));
    },
    expect: function (usecase) {
      return makeExpectationEventListenerError(usecase, options)
    }
  });
}
for (let options of propAlternativesOnceErrors) {
  testOnce.push({
    name: `addEventListenerOnceErrors: ${JSON.stringify(options)}`,
    fun: function (res, usecase) {
      let flatTree = usecase().flat(Infinity);
      let target = flatTree[0];
      addEventListenerOptionOnce(target, res, options);
      target.dispatchEvent(new CustomEvent("test", {detail: "a"}));
      target.dispatchEvent(new CustomEvent("test", {detail: "b"}));
    },
    expect: function (usecase) {
      return makeExpectationEventListenerError(usecase, options)
    }
  });
}
for (let options of propAlternativesFirstBasic) {
  testFirst.push({
    name: `addEventListenerFirstBasic: ${JSON.stringify(options)}`,
    fun: function (res, usecase) {
      let flatTree = usecase().flat(Infinity);
      let target = flatTree[0];
      addEventListenerOptionTwiceFirst(target, res, options);
      target.dispatchEvent(new CustomEvent("test"));
    },
    expect: function (usecase) {
      return makeExpectationEventListenerError(usecase, options)
    }
  });
}

for (let options of propAlternativesFirstErrors) {
  testFirst.push({
    name: `addEventListenerFirstError: ${JSON.stringify(options)}`,
    fun: function (res, usecase) {
      let flatTree = usecase().flat(Infinity);
      let target = flatTree[0];
      addEventListenerOptionOnce(target, res, options);
      target.dispatchEvent(new CustomEvent("test", {detail: "a"}));
    },
    expect: function (usecase) {
      return makeExpectationEventListenerError(usecase, options)
    }
  });
}


for (let options of propAlternativesLastBasic) {
  testLast.push({
    name: `addEventListenerLastBasic: ${JSON.stringify(options)}`,
    fun: function (res, usecase) {
      let flatTree = usecase().flat(Infinity);
      let target = flatTree[0];
      addEventListenerOptionTwiceLast(target, res, options);  // add two listeners, first one with option, second one - without
      target.dispatchEvent(new CustomEvent("test"));
    },
    expect: function (usecase) {
      return makeExpectationEventListenerError(usecase, options)
    }
  });
}

for (let options of propAlternativesLastErrors) {
  testLast.push({
    name: `addEventListenerLastError: ${JSON.stringify(options)}`,
    fun: function (res, usecase) {
      let flatTree = usecase().flat(Infinity);
      let target = flatTree[0];
      addEventListenerOptionTwiceLast(target, res, options);
      target.dispatchEvent(new CustomEvent("test", {detail: "a"}));
    },
    expect: function (usecase) {
      return makeExpectationEventListenerError(usecase, options)
    }
  });
}


for (let options of propAlternativesAll) {
  testOnceFirstLast.push({
    name: `addEventListenerSuperMix: ${JSON.stringify(options)}`,
    fun: function (res, usecase) {
      let flatTree = usecase().flat(Infinity);
      let target = flatTree[0];
      addEventListenerOptionTwiceLast(target, res, options);
      target.dispatchEvent(new CustomEvent("test"));
    },
    expect: function (usecase) {
      return makeExpectationEventListenerError(usecase, options)
    }
  });
}


function makeExpectationEventListenerError(usecase, options) {
  if (options.last && options.capture)
    return "Error: last option can only be used with bubble phase (at_target bubble phase) event listeners";
  if (options.first && !options.capture)
    return "Error: first option can only be used with capture phase (at_target capture phase) event listeners";
  if (options.hasOwnProperty("once"))
    return !!options.once ? "a" : "ab";
  if (options.hasOwnProperty("last"))
    return !!options.last ? "ba" : "ab";
  if (options.hasOwnProperty("first"))
    return (options.capture && options.first) ? "ba" : "ab";
}

