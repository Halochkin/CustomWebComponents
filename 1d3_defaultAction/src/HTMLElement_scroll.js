/*
Whenever a viewport gets scrolled (whether in response to user interaction or by an API), the user agent must run these steps:

  1. Let doc be the viewport’s associated Document.

  2. If doc is already in doc’s pending scroll event targets, abort these steps.

  3. Append doc to doc’s pending scroll event targets.

Whenever an element gets scrolled (whether in response to user interaction or by an API), the user agent must run these steps:

  1. Let doc be the element’s node document.

  2. If the element is already in doc’s pending scroll event targets, abort these steps.

  3. Append the element to doc’s pending scroll event targets.

When asked to run the scroll steps for a Document doc, run these steps:

  1. For each item target in doc’s pending scroll event targets, in the order they were added to the list, run these substeps:

    1.1 If target is a Document, fire an event named scroll that bubbles at target.

    1.2 Otherwise, fire an event named scroll at target.

  2. Empty doc’s pending scroll event targets.*/

let viewport;
let targetHeight
let scrollHeight
let scrollTop
//we can scroll only across X axis using wheel

export const scrollDefaultAction = {
  elementFilter: function scroll_filter(event) {
    viewport = event.target; // ???
    targetHeight = parseInt(window.getComputedStyle(viewport).height);
    scrollHeight = document.documentElement.scrollHeight;
    scrollTop = document.documentElement.scrollTop;
    if (scrollTop <= 0 || scrollTop + targetHeight >= scrollHeight)
      return false;
  },
  element: HTMLElement,
  event: {
    type: "wheel",
    isTrusted: true,
    key: 1
  },
  defaultAction: function scroll_dispatch(event, element) {
    const scroll = new WheelEvent("scroll", {composed: true, bubbles: true});
    scroll.async = event.async;
    scroll.isTrusted = true;
    event.target.dispatchEvent(scroll);
    // todo OR
    event.target.offsetTop = scrollTop;
  },

  lowestWins: true,
  repeat: document, //is it?
  preventable: true,
  targetOnly: false,
}