const unloadEvent = Symbol("unloadEvent");

window.closeArray = [];
window.addEventListener("unload", function () {
  for (let entry of closeArray) {
    if (entry.unloadCallback)
      entry.unloadCallback();
  }
});

export const UnloadCallbackMixin = (Base) => {
  return class extends Base {

    constructor() {
      super();
      this[unloadEvent] = true;
      closeArray.push(this)
    }

    connectedCallback() {
      if (super.connectedCallback) super.connectedCallback();
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) super.disconnectedCallback();
      if (!this[unloadEvent]) return;
      this.unloadCallback();
      for (let entry of closeArray) {
        closeArray.remove(entry);
      }
      this[unloadEvent] = false;
    }
  }
};
