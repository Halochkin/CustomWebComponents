import {lastPropagationTarget} from "../../computePaths.js";

export const lastTarget = [];


function addEventListenersLastTarget(target, result, options) {
  target.addEventListener("click", function (e) {
    let res = lastPropagationTarget(e);
    result.push(res.nodeName);
  });
}


const propAlternatives = [
  {composed: true, bubbles: true},
  {composed: true, bubbles: false},
  {composed: false, bubbles: true},
  {composed: false, bubbles: false}
];


for (let options of propAlternatives) {
  lastTarget.push({
    name: `lastTarget: ${JSON.stringify(options)}`,
    fun: function (res, usecase) {
      let flatTree = usecase().flat(Infinity);
      let target = flatTree[0];
      addEventListenersLastTarget(target, res, options);
      target.dispatchEvent(new Event("click", options));
    },
    expect: function (usecase) {
      return makeExpectationLastTarget(usecase, options)
    }
  })
}


function makeExpectationLastTarget(usecase, opts) {
  // reverse usecase to simulate event bubbling
  let path = usecase().flat(Infinity);
  let filteredPath = path.findIndex((element) => element instanceof Window)
  if (filteredPath !== -1)
    path = path.slice(0, filteredPath);
  let target = path[0];
// return nearest #document-fragment to simulate composed: false.
// If not - custom composed path will be the same as usecase() result, but native -not. So to avoid this I must do this here.
  if (!opts.composed && path.length > 2)
    path = path.slice(0, path.findIndex((element) => element instanceof ShadowRoot) + 1);
  if (opts.bubbles) return path[path.length - 1].nodeName;
  if (!opts.composed) return path[0].nodeName;
  for (let i = 1; i < path.length - 2; i++) {
    if (path[i] instanceof ShadowRoot)
      target = path[++i];
  }
  return target.nodeName;
}
