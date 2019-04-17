import {SlotchangeMixin} from "../src/slotChangeCallback.js";

describe("slotchangeCallBack: ", function () {

  class Slot1 extends SlotchangeMixin(HTMLElement) {
    constructor() {
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML = "<slot></slot>";
      this.testValue = [];
    }

    slotchangeCallback(slot) {
      if (this._stop) throw new Error("Bug in test: Lingering slotCallback");
      this.setTestValue(slot);
    }

    slotCallback(slot) {
      if (this._stop) throw new Error("Bug in test: Lingering slotCallback");
      this.setTestValue(slot);
    }

    setTestValue(slot) {
      this.testValue.push({
        slotName: slot.name,
        value: slot.assignedNodes({flatten: true}),
        slot
      });
    }

    stop() {
      this._stop = true;
    }

    //}
  }

  class ChainedSlotsGrandpaError extends SlotchangeMixin(HTMLElement) {
    constructor() {
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML = `
          <slot-change-callback-test-one>
            <div>
              <slot></slot>
            </div>
          </slot-change-callback-test-one>`;
      this.testValue = [];
    }

    slotchangeCallback(slot) {
      if (this._stop) throw new Error("Bug in test: Lingering slotCallback");
      this.setTestValue(slot);
    }

    slotCallback(slot) {
      if (this._stop) throw new Error("Bug in test: Lingering slotCallback");
      this.setTestValue(slot);
    }

    setTestValue(slot) {
      this.testValue.push({
        slotName: slot.name,
        value: slot.assignedNodes({flatten: true}),
        slot
      });
    }

    stop() {
      this._stop = true;
    }
  }

  class GrandpaSlot extends SlotchangeMixin(HTMLElement) {
    constructor() {
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML = `
           <slot-change-callback-chained-slot>
            <slot></slot>
          </slot-change-callback-chained-slot>`;
      this.testValue = [];
    }

    slotchangeCallback(slot) {
      if (this._stop) throw new Error("Bug in test: Lingering slotCallback");
      this.setTestValue(slot);
    }

    slotCallback(slot) {
      if (this._stop) throw new Error("Bug in test: Lingering slotCallback");
      this.setTestValue(slot);
    }

    setTestValue(slot) {
      this.testValue.push({
        slotName: slot.name,
        value: slot.assignedNodes({flatten: true}),
        slot
      });
    }

    stop() {
      this._stop = true;
    }
  }

  class GrandGrandSlot extends SlotchangeMixin(HTMLElement) {
    constructor() {
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML = `
            <slot-change-callback-grandpa-slot>
            <slot></slot>
          </slot-change-callback-grandpa-slot>`;
      this.testValue = [];
    }

    slotchangeCallback(slot) {
      if (this._stop) throw new Error("Bug in test: Lingering slotCallback");
      this.setTestValue(slot);
    }

    slotCallback(slot) {
      if (this._stop) throw new Error("Bug in test: Lingering slotCallback");
      this.setTestValue(slot);
    }

    setTestValue(slot) {
      this.testValue.push({
        slotName: slot.name,
        value: slot.assignedNodes({flatten: true}),
        slot
      });
    }

    stop() {
      this._stop = true;
    }
  }

  class GrandpaSlotWithSlotname extends SlotchangeMixin(HTMLElement) {
    constructor() {
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML = `
            <slot-change-callback-chained-slot>
            <slot name="a"></slot>
          </slot-change-callback-chained-slot>`;
      this.testValue = [];
    }

    slotchangeCallback(slot) {
      if (this._stop) throw new Error("Bug in test: Lingering slotCallback");
      this.setTestValue(slot);
    }

    slotCallback(slot) {
      if (this._stop) throw new Error("Bug in test: Lingering slotCallback");
      this.setTestValue(slot);
    }

    setTestValue(slot) {
      this.testValue.push({
        slotName: slot.name,
        value: slot.assignedNodes({flatten: true}),
        slot
      });
    }

    stop() {
      this._stop = true;
    }
  }

  function testAssignedValues(actuals, expecteds) {
    expect(actuals.length === expecteds.length);
    for (let i = 0; i < expecteds.length; i++) {
      let exp = expecteds[i];
      let act = actuals[i];
      expect(act.slot.name).to.be.equal(exp.name);
      let assigned = act.value.map(n => n.nodeName ? n.nodeName : "#text");
      expect(assigned).to.deep.equal(exp.flattened);
    }
  }


  class SlotWrapper extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML = `
          <slot-change-callback-test-one>
            <slot></slot>
          </slot-change-callback-test-one>`;
    }

  }

  customElements.define(name + "-chained-slot-error", ChainedSlotsGrandpaError);
  customElements.define(name + "-grand-grand-slot", GrandGrandSlot);
  customElements.define(name + "-grandpa-slot-with-name", GrandpaSlotWithSlotname);
  customElements.define(name + "-grandpa-slot", GrandpaSlot);
  customElements.define(name + "-chained-slot", SlotWrapper);
  customElements.define(name + "-test-one", Slot1);

  it("extend HTMLElement class correctly and make an element", function () {
    class SlotTestClass extends SlotchangeMixin(HTMLElement) {
      constructor() {
        super();
        this.attachShadow({mode: "open"});
      }

      slotCallback() {
      }
    }

    customElements.define(name + "-slot-test-class", SlotTestClass);
    const el = new SlotTestClass();
    let proto = el.constructor;
    expect(proto.name).to.be.equal("SlotTestClass");
    proto = Object.getPrototypeOf(proto);
    expect(proto.name).to.be.equal(SlotchangeMixin.name);
    proto = Object.getPrototypeOf(proto);
    expect(proto.name).to.be.equal("HTMLElement");
  });

  it("SlottableMixin add DIV imperative and trigger slotchangedCallback", function (done) {

    const el = new Slot1();
    el.appendChild(document.createElement("div"));
    requestAnimationFrame(() => {
      const elExpected = [
        {name: "", flattened: ["DIV"]}
      ];
      testAssignedValues(el.testValue, elExpected);
      el.stop();
      done();
    });
  });

  it("chained slot test", function (done) {
    const el = new SlotWrapper();
    const inner = el.shadowRoot.children[0];
    el.appendChild(document.createElement("div"));
    requestAnimationFrame(() => {
      const elExpected = [
        {name: "", flattened: ["#text", "DIV", "#text"]}
      ];
      testAssignedValues(inner.testValue, elExpected);
      inner.stop();
      done();
    });
  });

  it("chained slot test: two slotCallbacks", function (done) {
    const el = new SlotWrapper();
    const inner = el.shadowRoot.children[0];
    requestAnimationFrame(() => {
      expect(inner.testValue.length).to.be.equal(1);
      expect(inner.testValue[0].slotName).to.be.equal("");
      expect(inner.testValue[0].value.length).to.be.equal(2);
      el.appendChild(document.createElement("p"));
      Promise.resolve().then(() => {                //we must wait for the slotchange event which is run at the end of microtask que
        // if (name === "varmixin")         //not called, as SlotWrapper doesn't implement VarMixin, but only has a regular slot. Therefore, the top, initial callback doesn't trigger.
        //   return done();
        expect(inner.testValue.length).to.be.equal(2);
        expect(inner.testValue[1].slotName).to.be.equal("");
        expect(inner.testValue[1].value.length).to.be.equal(3);
        expect(inner.testValue[1].value[1].nodeName).to.be.equal("P");
        inner.stop();
        done();
      });
    });
  });

//     //the .composedPath() of the slotchange event looks like this:
//     //[slot, div, slot, document-fragment, shadowslotchangemixinarnold-test-one, document-fragment]
//     //here, the "div" between the two slots indicate that the direct children of the slot has not changed,
//     //only a grandchild. Such grandchild slotchange events should not trigger slotchange.
  it("not listening for slotChange on slots that are not a direct child", function (done) {
    const el = new ChainedSlotsGrandpaError();
    const inner = el.shadowRoot.children[0];
    el.appendChild(document.createElement("p"));
    requestAnimationFrame(() => {
      expect(inner.testValue.length).to.be.equal(1);
      expect(inner.testValue[0].value.length).to.be.equal(3);
      expect(inner.testValue[0].value[1].nodeName).to.be.equal("DIV");
      el.appendChild(document.createElement("p"));
      expect(inner.testValue.length).to.be.equal(1);
      inner.stop();
      done();
    });
  });

  it("connected-disconnected is irrelevant. rAF is what counts.", function (done) {
    const el = new Slot1();
    el.appendChild(document.createElement("div"));    //is not triggered.
    document.querySelector("body").appendChild(el);   //slotchange event is flagged
    document.querySelector("body").removeChild(el);   //disconnect
    el.appendChild(document.createElement("div"));    //is not triggered.
    el.appendChild(document.createElement("div"));    //is not triggered.
    document.querySelector("body").appendChild(el);   //slotchangedCallback triggered on connect
    expect(el.testValue).to.deep.equal([]);
    requestAnimationFrame(() => {
      const test = [{slotName: "", value: ["DIV", "DIV", "DIV"]}];
      expect(el.testValue.length).to.be.equal(1);
      expect(el.testValue[0].slotName).to.be.equal("");
      expect(el.testValue[0].value.length).to.be.equal(3);
      expect(el.testValue[0].value[0].nodeName).to.be.equal("DIV");
      expect(el.testValue[0].value[1].nodeName).to.be.equal("DIV");
      expect(el.testValue[0].value[2].nodeName).to.be.equal("DIV");
      document.querySelector("body").removeChild(el);
      el.stop();
      done();
    });
  });

  it("connected-wait-disconnected-connected.", function (done) {
    const el = new Slot1();
    el.appendChild(document.createElement("div"));    //slotchangedCallback added to the microque
    requestAnimationFrame(() => {
      expect(el.testValue.length).to.be.equal(1);
      expect(el.testValue[0].value.length).to.be.equal(1);
      expect(el.testValue[0].value[0].nodeName).to.be.equal("DIV");
      el.appendChild(document.createElement("div"));    //slotchangedCallback will be checked at end of microtasks
      el.appendChild(document.createElement("div"));
      Promise.resolve().then(() => {
        expect(el.testValue.length).to.be.equal(2);
        expect(el.testValue[1].value.length).to.be.equal(3);
        expect(el.testValue[1].value[0].nodeName).to.be.equal("DIV");
        expect(el.testValue[1].value[1].nodeName).to.be.equal("DIV");
        expect(el.testValue[1].value[2].nodeName).to.be.equal("DIV");
        el.stop();
        done();
      });
    });
  });

  it("Grandpa-slot-test. Simple.", function (done) {
    const el = new GrandpaSlot();
    const grandChild = el.shadowRoot.children[0].shadowRoot.children[0];
    el.appendChild(document.createElement("div"));    //slotchangedCallback added to the microque
    requestAnimationFrame(() => {
      expect(el.testValue.length).to.be.equal(1);
      expect(el.testValue[0].oldChildren).to.be.equal(undefined);
      expect(el.testValue[0].value.length).to.be.equal(1);
      expect(el.testValue[0].value[0].nodeName).to.be.equal("DIV");
      expect(grandChild.testValue[0].value.length).to.be.equal(5);
      expect(grandChild.testValue[0].value[2].nodeName).to.be.equal("DIV");
      el.stop();
      grandChild.stop();
      done();
    });
  });

  it("GrandGrand-slot-test. Simple.", function (done) {
    const el = new GrandGrandSlot();
    const child = el.shadowRoot.children[0];
    const grandGrandChild = el.shadowRoot.children[0].shadowRoot.children[0].shadowRoot.children[0];
    el.appendChild(document.createElement("div"));    //slotchangedCallback added to the microque
    requestAnimationFrame(() => {
      expect(el.testValue.length).to.be.equal(1);
      expect(el.testValue[0].oldChildren).to.be.equal(undefined);
      expect(el.testValue[0].value.length).to.be.equal(1);
      expect(el.testValue[0].value[0].nodeName).to.be.equal("DIV");
      expect(child.testValue[0].value.length).to.be.equal(3);
      expect(child.testValue[0].value[1].nodeName).to.be.equal("DIV");
      expect(grandGrandChild.testValue[0].value.length).to.be.equal(7);
      expect(grandGrandChild.testValue[0].value[3].nodeName).to.be.equal("DIV");
      el.stop();
      child.stop();
      grandGrandChild.stop();
      done();
    });
  });

  it("Grandpa-slot-test with different slot names.", function (done) {
    const el = new GrandpaSlotWithSlotname();
    const grandChild = el.shadowRoot.children[0].shadowRoot.children[0];
    el.innerHTML = "<div slot='a'></div>";  //slotchangedCallback added to the microque
    requestAnimationFrame(() => {
      expect(el.testValue.length).to.be.equal(1);
      expect(el.testValue[0].value.length).to.be.equal(1);
      expect(el.testValue[0].value[0].nodeName).to.be.equal("DIV");
      expect(el.testValue[0].slotName).to.be.equal("a");
      expect(grandChild.testValue[0].value.length).to.be.equal(5);
      expect(grandChild.testValue[0].value[2].nodeName).to.be.equal("DIV");
      expect(grandChild.testValue[0].slotName).to.be.equal("");
      el.appendChild(document.createElement("span"));    //slotchangedCallback added to the microque
      Promise.resolve().then(() => {
        expect(el.testValue.length).to.be.equal(1);
        expect(grandChild.testValue.length).to.be.equal(1);
        el.stop();
        grandChild.stop();
        done();
      });
    });
  });

  it("chained slot with different name test.", function (done) {
    const el = new SlotWrapper();
    const child = el.shadowRoot.children[0];
    const div = document.createElement("div");
    div.setAttribute("slot", "offside");
    child.appendChild(div);
    requestAnimationFrame(() => {
      expect(child.testValue.length).to.be.equal(1);
      expect(child.testValue[0].value.length).to.be.equal(2);
      expect(child.testValue[0].value[0].nodeName).to.be.equal("#text");
      expect(child.testValue[0].value[1].nodeName).to.be.equal("#text");
      child.stop();
      done();
    });
  });

  it("removing elements also trigger callbacks", function (done) {
    const el = new Slot1();
    el.innerHTML = "<div id='a'></div>";
    requestAnimationFrame(() => {
      expect(el.testValue.length).to.be.equal(1);
      expect(el.testValue[0].slotName).to.be.equal("");
      expect(el.testValue[0].value.length).to.be.equal(1);
      expect(el.testValue[0].value[0].id).to.be.equal("a");
      el.children[0].remove();
      requestAnimationFrame(() => {
        expect(el.testValue.length).to.be.equal(2);
        expect(el.testValue[1].slotName).to.be.equal("");
        expect(el.testValue[1].value.length).to.be.equal(0);
        el.stop();
        done();
      });
    });
  });
});

