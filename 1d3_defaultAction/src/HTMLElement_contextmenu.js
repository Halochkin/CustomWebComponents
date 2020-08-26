let previousEvent;

export const contextmenuDefaultAction = {
  element: HTMLElement,
  event: {
    type: "pointerup", // also possible to activate by keyboard event
    isTrusted: true
  },
  //targetOnly and composed ensures that the function is only run on the innermost target.
  elementFilter: function contextmenu_filter(event) {
    if (event.button !== 2)
      return false;
    // Any right-click event that is not disabled (by calling the event's preventDefault() method)
    // will result in a contextmenu event being fired at the targeted element.
    if (event.defaultPrevented)
      return false;
    // if (previousEvent.type === "pointerup"|| "mouseup") {
    //   previousEvent = undefined;
    //   return true;
    // }
    previousEvent = event;
    return false;
  },
  defaultAction: function dblclick_dispatch(event, element) {
    const contextmenu = new MouseEvent("contextmenu", {composed: true, bubbles: true});
    contextmenu.async = event.async;
    contextmenu.isTrusted = true;
    //copy over other event properties from click
    event.target.dispatchEvent(contextmenu);
  },
  lowestWins: false,
  preventable: false,
  targetOnly: true,
  composed: true
};