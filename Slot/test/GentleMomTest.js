


import {SlottablesCallback} from "../src/SlottablesCallback.js";
import {flattenAssignedNodesVar} from "../src/VarMixin.js";


// const runSlotchangeMixinTest = function (SlottablesCallback) {
  describe("GentleMom: " + SlottablesCallback.name, function () {

    const name = SlottablesCallback.name.toLowerCase();

    class Inner extends SlottablesCallback(HTMLElement) {
      constructor(){
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML= `
<style>
  * { 
    color: blue;
    font-weight: bold;
    border-bottom: 5px solid lightblue; 
  }
</style>
-><slot><span>inner fallback title</span></slot>
`;
      }
      slotCallback(slot) {
        if (this._stop)
          throw new Error("Bug in test: Lingering slottablesCallback");
        this.testValue = this.testValue || [];
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

    class MiddleMom extends SlottablesCallback(HTMLElement) {
      constructor(){
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML= `
<style>
  * { 
    color: red;
    font-style: italic;
    border-right: 5px solid pink; 
  }
</style>
<${(name + "-inner-el")}><slot></slot></${(name + "-inner-el")}>
`;
      }
      slotCallback(slot) {
        if (this._stop)
          throw new Error("Bug in test: Lingering slottablesCallback");
        this.testValue = this.testValue || [];
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
    class MiddlePap extends SlottablesCallback(HTMLElement) {
      constructor(){
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML= `
<style>
  * { 
    color: red;
    font-style: italic;
    border-right: 5px solid pink; 
  }
</style>
<${(name + "-inner-el")}><slot><span>middle fallback title</span></slot></${(name + "-inner-el")}>
`;
      }
      slotCallback(slot) {
        if (this._stop)
          throw new Error("Bug in test: Lingering slottablesCallback");
        this.testValue = this.testValue || [];
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




    customElements.define(name + "-inner-el", Inner);
    customElements.define(name + "-middle-mom", MiddleMom);
    customElements.define(name + "-middle-pap", MiddlePap);

    it("1: inner empty <inner-el></inner-el>", function (done) {
      const div = document.createElement("div");
      div.innerHTML = `<${(name + "-inner-el")}></${(name + "-inner-el")}>`;
      const el = div.children[0];
      const slot = el.shadowRoot.children[1];
      requestAnimationFrame(() => {
        expect(el.testValue.length).to.be.equal(1);
        expect(el.testValue[0].slotName).to.be.equal("");
        expect(el.testValue[0].value.length).to.be.equal(1);   //expected 0
        const varTest = flattenAssignedNodesVar(slot);
        expect(varTest.length).to.be.equal(1);
        expect(varTest[0].nodeName).to.be.equal("SPAN");
        expect(varTest[0].innerText).to.be.equal("inner fallback title");
        el.stop();
        done();
      });
    });

    it("2: inner with span <inner-el><span>top span</span></inner-el>", function (done) {
      const div = document.createElement("div");
      div.innerHTML = `<${(name + "-inner-el")}><span>top span</span></${(name + "-inner-el")}>`;
      const el = div.children[0];
      requestAnimationFrame(() => {
        expect(el.testValue.length).to.be.equal(1);
        expect(el.testValue[0].slotName).to.be.equal("");
        expect(el.testValue[0].value.length).to.be.equal(1);
        expect(el.testValue[0].value[0].nodeName).to.be.equal("SPAN");
        expect(el.testValue[0].value[0].innerText).to.be.equal("top span");
        const varTest = flattenAssignedNodesVar(el.testValue[0].slot);
        expect(varTest.length).to.be.equal(1);
        expect(varTest[0].nodeName).to.be.equal("SPAN");
        expect(varTest[0].innerText).to.be.equal("top span");
        el.stop();
        done();
      });
    });

    it("3: inner with slot-span <inner-el><slot><span>top slot span</span></slot></inner-el>", function (done) {
      const div = document.createElement("div");
      div.innerHTML = `<${(name + "-inner-el")}><slot><span>top slot span</span></slot></${(name + "-inner-el")}>`;
      const el = div.children[0];
      requestAnimationFrame(() => {
        expect(el.testValue.length).to.be.equal(1);
        expect(el.testValue[0].slotName).to.be.equal("");
        expect(el.testValue[0].value.length).to.be.equal(1);
        expect(el.testValue[0].value[0].nodeName).to.be.equal("SLOT");
        // expect(el.testValue[0].value[0].innerText).to.be.equal("top span");
        const varTest = flattenAssignedNodesVar(el.testValue[0].slot);
        expect(varTest.length).to.be.equal(1);
        expect(varTest[0].nodeName).to.be.equal("SPAN");
        expect(varTest[0].innerText).to.be.equal("top slot span");
        el.stop();
        done();
      });
    });

    it("4: gentlemom empty: <middle-mom></middle-mom>", function (done) {
      const div = document.createElement("div");
      div.innerHTML = `<${(name + "-middle-mom")}></${(name + "-middle-mom")}>`;
      const el = div.children[0];
      const child = el.shadowRoot.children[1];
      const slot = el.shadowRoot.children[1].children[0];
      const childSlot = child.shadowRoot.children[1];
      requestAnimationFrame(() => {
        expect(el.testValue.length).to.be.equal(1);
        expect(el.testValue[0].slotName).to.be.equal("");
        expect(el.testValue[0].value.length).to.be.equal(0);
        expect(child.testValue.length).to.be.equal(1);
        expect(child.testValue[0].slotName).to.be.equal("");
        expect(child.testValue[0].value.length).to.be.equal(0);
        const varTest = flattenAssignedNodesVar(slot);
        expect(varTest.length).to.be.equal(0);

        const childVarTest = flattenAssignedNodesVar(childSlot);
        expect(childVarTest.length).to.be.equal(1);
        expect(childVarTest[0].nodeName).to.be.equal("SPAN");
        expect(childVarTest[0].innerText).to.be.equal("inner fallback title");

        el.stop();
        done();
      });
    });

    it("5: gentlemom top span: <middle-mom><span>top span</span></middle-mom>", function (done) {
      const div = document.createElement("div");
      div.innerHTML = `<${(name + "-middle-mom")}><span>top span</span></${(name + "-middle-mom")}>`;
      const el = div.children[0];
      const child = el.shadowRoot.children[1];
      requestAnimationFrame(() => {
        expect(el.testValue.length).to.be.equal(1);
        expect(el.testValue[0].slotName).to.be.equal("");
        expect(el.testValue[0].value.length).to.be.equal(1);
        expect(el.testValue[0].value[0].nodeName).to.be.equal("SPAN");
        expect(el.testValue[0].value[0].innerText).to.be.equal("top span");
        const varTest = flattenAssignedNodesVar(el.testValue[0].slot);
        expect(varTest.length).to.be.equal(1);
        expect(varTest[0].nodeName).to.be.equal("SPAN");
        expect(varTest[0].innerText).to.be.equal("top span");

        expect(child.testValue.length).to.be.equal(1);
        expect(child.testValue[0].slotName).to.be.equal("");
        expect(child.testValue[0].value.length).to.be.equal(1);
        expect(child.testValue[0].value[0].nodeName).to.be.equal("SPAN");
        expect(child.testValue[0].value[0].innerText).to.be.equal("top span");
        const childVarTest = flattenAssignedNodesVar(child.testValue[0].slot);
        expect(childVarTest.length).to.be.equal(1);
        expect(childVarTest[0].nodeName).to.be.equal("SPAN");
        expect(childVarTest[0].innerText).to.be.equal("top span");
        el.stop();
        done();
      });
    });

    it("6: gentlemom top slot span: <middle-mom><slot><span>top slot span</span></slot></middle-mom>", function (done) {
      const div = document.createElement("div");
      div.innerHTML = `<${(name + "-middle-mom")}><slot><span>top span</span></slot></${(name + "-middle-mom")}>`;
      const el = div.children[0];
      const child = el.shadowRoot.children[1];
      requestAnimationFrame(() => {
        expect(el.testValue.length).to.be.equal(1);
        expect(el.testValue[0].slotName).to.be.equal("");
        expect(el.testValue[0].value.length).to.be.equal(1);
        expect(el.testValue[0].value[0].nodeName).to.be.equal("SLOT");
        const varTest = flattenAssignedNodesVar(el.testValue[0].slot);
        expect(varTest.length).to.be.equal(1);
        expect(varTest[0].nodeName).to.be.equal("SPAN");
        expect(varTest[0].innerText).to.be.equal("top span");

        expect(child.testValue.length).to.be.equal(1);
        expect(child.testValue[0].slotName).to.be.equal("");
        expect(child.testValue[0].value.length).to.be.equal(1);
        expect(child.testValue[0].value[0].nodeName).to.be.equal("SLOT");
        const childVarTest = flattenAssignedNodesVar(child.testValue[0].slot);
        expect(childVarTest.length).to.be.equal(1);
        expect(childVarTest[0].nodeName).to.be.equal("SPAN");
        expect(childVarTest[0].innerText).to.be.equal("top span");
        el.stop();
        done();
      });
    });


    it("7: gentlepap empty: <middle-pap></middle-pap>", function (done) {
      const div = document.createElement("div");
      div.innerHTML = `<${(name + "-middle-pap")}></${(name + "-middle-pap")}>`;
      const el = div.children[0];
      const child = el.shadowRoot.children[1];
      const slot = el.shadowRoot.children[1].children[0];
      const childSlot = child.shadowRoot.children[1];
      requestAnimationFrame(() => {
        expect(el.testValue.length).to.be.equal(1);
        expect(el.testValue[0].slotName).to.be.equal("");
        expect(el.testValue[0].value.length).to.be.equal(1);
        expect(child.testValue.length).to.be.equal(1);
        expect(child.testValue[0].slotName).to.be.equal("");
        expect(child.testValue[0].value.length).to.be.equal(1);
        expect(child.testValue[0].value[0].nodeName).to.be.equal("SPAN");
        expect(child.testValue[0].value[0].innerText).to.be.equal("middle fallback title");

        const varTest = flattenAssignedNodesVar(slot);
        expect(varTest.length).to.be.equal(1);
        expect(varTest[0].nodeName).to.be.equal("SPAN");
        expect(varTest[0].innerText).to.be.equal("middle fallback title");

        const childVarTest = flattenAssignedNodesVar(childSlot);
        expect(childVarTest.length).to.be.equal(1);
        expect(childVarTest[0].nodeName).to.be.equal("SPAN");
        expect(childVarTest[0].innerText).to.be.equal("middle fallback title");

        el.stop();
        done();
      });
    });

    it("8: gentlepap top span: <middle-pap><span>top span</span></middle-pap>", function (done) {
      const div = document.createElement("div");
      div.innerHTML = `<${(name + "-middle-pap")}><span>top span</span></${(name + "-middle-pap")}>`;
      const el = div.children[0];
      const child = el.shadowRoot.children[1];
      requestAnimationFrame(() => {
        expect(el.testValue.length).to.be.equal(1);
        expect(el.testValue[0].slotName).to.be.equal("");
        expect(el.testValue[0].value.length).to.be.equal(1);
        expect(el.testValue[0].value[0].nodeName).to.be.equal("SPAN");
        expect(el.testValue[0].value[0].innerText).to.be.equal("top span");
        const varTest = flattenAssignedNodesVar(el.testValue[0].slot);
        expect(varTest.length).to.be.equal(1);
        expect(varTest[0].nodeName).to.be.equal("SPAN");
        expect(varTest[0].innerText).to.be.equal("top span");

        expect(child.testValue.length).to.be.equal(1);
        expect(child.testValue[0].slotName).to.be.equal("");
        expect(child.testValue[0].value.length).to.be.equal(1);
        expect(child.testValue[0].value[0].nodeName).to.be.equal("SPAN");
        expect(child.testValue[0].value[0].innerText).to.be.equal("top span");
        const childVarTest = flattenAssignedNodesVar(child.testValue[0].slot);
        expect(childVarTest.length).to.be.equal(1);
        expect(childVarTest[0].nodeName).to.be.equal("SPAN");
        expect(childVarTest[0].innerText).to.be.equal("top span");
        el.stop();
        done();
      });
    });

    it("9: gentlepap top slot span: <middle-pap><slot><span>top slot span</span></slot></middle-pap>", function (done) {
      const div = document.createElement("div");
      div.innerHTML = `<${(name + "-middle-pap")}><slot><span>top span</span></slot></${(name + "-middle-pap")}>`;
      const el = div.children[0];
      const child = el.shadowRoot.children[1];
      requestAnimationFrame(() => {
        expect(el.testValue.length).to.be.equal(1);
        expect(el.testValue[0].slotName).to.be.equal("");
        expect(el.testValue[0].value.length).to.be.equal(1);
        expect(el.testValue[0].value[0].nodeName).to.be.equal("SLOT");
        const varTest = flattenAssignedNodesVar(el.testValue[0].slot);
        expect(varTest.length).to.be.equal(1);
        expect(varTest[0].nodeName).to.be.equal("SPAN");
        expect(varTest[0].innerText).to.be.equal("top span");

        expect(child.testValue.length).to.be.equal(1);
        expect(child.testValue[0].slotName).to.be.equal("");
        expect(child.testValue[0].value.length).to.be.equal(1);
        expect(child.testValue[0].value[0].nodeName).to.be.equal("SLOT");
        const childVarTest = flattenAssignedNodesVar(child.testValue[0].slot);
        expect(childVarTest.length).to.be.equal(1);
        expect(childVarTest[0].nodeName).to.be.equal("SPAN");
        expect(childVarTest[0].innerText).to.be.equal("top span");
        el.stop();
        done();
      });
    });

  });
