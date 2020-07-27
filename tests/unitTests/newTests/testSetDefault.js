/*
addDefaultActions of details and a href elements, and the input elements.
There are some test results there that should/must be included to verify the structure of the framework.
And i also need to add tests for the native event controllers, dblclick and drag'n'drop, etc.
This needs to be up so tasks that can be reduced to an event controller, is reduced to an event controller,
as the event controller often is a simpler architecture solution than a component for certain problems.
 */


// import {} from "../../../1d3_defaultAction/_v2.0/src/joi2.js";
// import {lastTarget} from "./testLastPropagationTarget";

export const _setDefault = [];

const aLink = document.createElement("a");

function addEventListenerOnce(target, res, options) {
  target.addEventListener("click", e => {
    // e.setDefault(e =>defaultAction1(e));
    res.push(e);
  }, options);
}


function addEventListenerTwice(target, res, options) {
  target.addEventListener("click", e => {
    e.setDefault(e => defaultAction1(e));
    res.push(e);
    return res;
  }, options);

  target.addEventListener("click", e => {
    e.setDefault(defaultAction2(e));
    res.push(e);
    return res;
  }, options);
}


function defaultAction1(e) {
  console.log("lala");
}

function defaultAction2(e) {

}

function makeExpectationSetDefault(usecase, event, options) {

  // Event.NONE = 0
  // Event.CAPTURING_PHASE = 1
  // Event.AT_TARGET = 2
  // Event.BUBBLING_PHASE = 3


  let propertyPhase = options.capture ? 1 : 2;
  // test event
  let phase = event.eventPhase;

  if (propertyPhase === Event.CAPTURING_PHASE)
    return "Error: event.setDefault(cb) must be called during the bubble phase!!! If not the implied logic breaks down. Do not do element.addEventListener(type, function(e){ ...e.setDefault(...)}, TRUE)!!! ";


}

const propAlternatives = [
  // {capture: false, bubbles: true},
  // {capture: false, bubbles: false},
  // {capture: true, bubbles: true},
  {capture: true, bubbles: false}
];

for (let options of propAlternatives) {
  _setDefault.push({
    name: `setDefaultBasic: ${JSON.stringify(options)}`,
    fun: function (res, usecase) {
      let flatTree = usecase().flat(Infinity);
      let target = flatTree[0];
      addEventListenerOnce(target, res, options);
      target.dispatchEvent(new Event("click", options));
    },
    expect: function (usecase) {
      let event = new Event("click", options);
      return makeExpectationSetDefault(usecase, event, options)
    }
  })
}


