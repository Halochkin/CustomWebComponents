import {SlottablesEvent} from "./SlottablesEvent.js";

function setup(el){
  if (!el.shadowRoot)
    return;
  const slots = el.shadowRoot.querySelectorAll("slot");
  for (let slot of slots)
    slot.assignedNodes().length === 0 && el.slotCallback(slot);     //fixed 
}

export function SlottablesCallback(base) {
  return class SlottablesCallback extends SlottablesEvent(base) {
    constructor() {
      super();
      this.addEventListener("slottables-changed", e => this.slotCallback(e.detail.slot));
      // const cb = () => setup(this);                                       //todo test that i can do this with arrow functions.
      Promise.resolve().then(()=> Promise.resolve().then(()=> setup(this)));
    }
  }
}
