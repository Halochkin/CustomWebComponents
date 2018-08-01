import {MultiTouchGesture} from "https://rawgit.com/Halochkin/Components/master/Gestures/MultiFingerGestureMixin/src/MultiFingerGestureMixin.js";
import {simulateEventSequence} from "https://rawgit.com/Halochkin/Components/master/Gestures/MultiFingerGestureMixin/src/EventsSimulator.js";

var slotDIV;

before(() => {
  slotDIV = document.createElement("div");
  slotDIV.id = "block";
  slotDIV.style.height = "200px";
  slotDIV.style.width = "200px";
  document.querySelector("body").appendChild(slotDIV);
});


describe('MultiplePinchGestureMixin basics', function () {

  it("extend HTMLElement class and make an element", function () {
    const MultiFingerGestureElement = MultiTouchGesture(HTMLElement);
    customElements.define("must-use-custom-elements-define-to-enable-constructor-size", MultiFingerGestureElement);
    const el = new MultiFingerGestureElement();
    expect(el.constructor.name).to.be.equal("HTMLElement");
  });

  it("subclass MultiplePinchGestureMixin", function () {
    const MultiplePinchGestureElement = class MultiplePinchGesture extends MultiTouchGesture(HTMLElement) {
      test() {
        return "abc";
      }
    };
    customElements.define("subclass-size-changed", MultiplePinchGestureElement);
    const el = new MultiplePinchGestureElement();
    expect(el.constructor.name).to.be.equal("MultiplePinchGesture");
    expect(el.test()).to.be.equal("abc");
  });

  it("subclass SizeChangedMixin anonymous", function () {
    const MultiFingerGestureElement = class extends MultiTouchGesture(HTMLElement) {
      test() {
        return "abc";
      }
    };
    customElements.define("subclass-size-changed-element", MultiFingerGestureElement);
    const el = new MultiFingerGestureElement();
    expect(el.constructor.name).to.be.equal("MultiFingerGestureElement");
    expect(el.test()).to.be.equal("abc");
  });

});

describe('MultiTouchGesture simple', function () {

  it("trigger MultiTouchGesture callbacks programmatically ", function (done) {

    const TriplePinchSubclass = class Subclass extends MultiTouchGesture(HTMLElement) {
      constructor() {
        super();
        this._simulate = e => this.simulateGesture(e);
      }

      connectedCallback() {
        super.connectedCallback();
        setTimeout(this._simulate, 100)
      }

      static get multiFingerSettings() {
        return {fingers: 3, maxDuration: 500};
      }

      simulateGesture(e) {
        const myElement = document.querySelector("multiple-gesture");
        const typeEvent = "touch";
        simulateEventSequence([
          [myElement, typeEvent, "start", 1],
          [myElement, typeEvent, "end", 1],
          [myElement, typeEvent, "start", 3],
          [myElement, typeEvent, "move", 3],
          [myElement, typeEvent, "end", 1],
        ]);
      }

      multiFingerStartCallback(detail) {
        expect(detail).to.not.be.equal(undefined);
        expect(detail.touchevent).to.not.be.equal(undefined);
        expect(detail.length).to.be.equal(3);
        expect(detail.coordArr[0].y).to.be.equal(255);
        expect(detail.coordArr[0].x).to.be.equal(220);
      }

      multiFingerCallback(detail) {
        expect(detail).to.not.be.equal(undefined);
        expect(detail.touchevent).to.not.be.equal(undefined);
        expect(detail.length).to.be.equal(3);
        expect(detail.coordArr[1].x).to.be.equal(277);
        expect(detail.coordArr[1].y).to.be.equal(173);
      }

      multiFingerEndCallback(detail) {
        expect(detail).to.not.be.equal(undefined);
        expect(detail.touchevent).to.not.be.equal(undefined);
        expect(detail.length).to.be.equal(1);
        expect(detail.coordArr[0].x).to.be.equal(300);
        expect(detail.coordArr[0].y).to.be.equal(400);
        done();
      }

    };
    customElements.define("multiple-gesture", TriplePinchSubclass);
    const el = new TriplePinchSubclass();
    el.appendChild(document.createElement("div"));
    slotDIV.appendChild(el);
  });
});
