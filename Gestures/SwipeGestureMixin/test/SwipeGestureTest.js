import {SwipeGestureMixin} from "../src/Swipe.js";

describe('SwipeGesture', function () {

  var slotDIV;

  before(function () {
    slotDIV = document.createElement("div");
    slotDIV.id = "slot";
    document.querySelector("body").appendChild(slotDIV);
  });

  const flingAngle = function flingAngle(x = 0, y = 0) {
    return ((Math.atan2(y, -x) * 180 / Math.PI)+270)%360;
  };

  function findLastEventOlderThan(events, timeTest) {
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].timeStamp < timeTest)
        return events[i];
    }
    return null;
  }

  it("flingAngle 0", function () {
    expect(flingAngle(0,1)).to.be.equal(0);
  });
  it("flingAngle 45", function () {
    expect(flingAngle(1,1)).to.be.equal(45);
  });
  it("flingAngle 90", function () {
    expect(flingAngle(1,0)).to.be.equal(90);
  });
  it("flingAngle 180", function () {
    expect(flingAngle(0,-1)).to.be.equal(180);
  });
  it("flingAngle 225", function () {
    expect(flingAngle(-1,-1)).to.be.equal(225);
  });
  it("flingAngle 270", function () {
    expect(flingAngle(-1,0)).to.be.equal(270);
  });

  // it("instanceof HTMLElement + constructor() working + can be inputed to customElements.define()", function () {
  //   const Swipe = SwipeGestureMixin(HTMLElement);
  //   customElements.define("lalala", Swipe);
  //   const el = new Swipe();
  //   expect(el.constructor.name).to.be.equal("SwipeGestureMixin");
  //   assert(el instanceof HTMLElement);
  // });

  it("class extends SwipeGestureMixin(HTMLElement) + has method", function () {
    const SubclassSwipeGestureElement = class SubclassSizeChanged extends SwipeGestureMixin(HTMLElement) {
      test() {
        return "abc";
      }
    };
    customElements.define("subclass-swipe", SubclassSwipeGestureElement);
    const el = new SubclassSwipeGestureElement();
    expect(el.constructor.name).to.be.equal("SubclassSizeChanged");
    assert(el instanceof HTMLElement);
    expect(el.test()).to.be.equal("abc");
  });

  it("subclass SwipeGestureMixin anonymous", function () {
    const SubclassSwipeGestureElement = class extends SwipeGestureMixin(HTMLElement) {
      test() {
        return "abc";
      }
    };
    customElements.define("subclass-slot-changed-element", SubclassSwipeGestureElement);
    const el = new SubclassSwipeGestureElement();
    expect(el.constructor.name).to.be.equal("SubclassSwipeGestureElement");
    assert(el instanceof HTMLElement);
    expect(el.test()).to.be.equal("abc");
  });

  it("trigger SwipeGestureMixin by swipe on the Green-block", function (done) {
    let counter = 0;
    let arr = [];

    const SwipeSubclass = class Subclass extends SwipeGestureMixin(HTMLElement) {
      constructor() {
        super();
        this.style.position = "absolute";
        this.style.width = "300px";
        this.style.height = "300px";
        this.style.backgroundColor = "green";
        this.style.display = "block";
        this.innerHTML = "Swipe Me twice quicker than 2000 ms";
        // this.addEventListener("pointerup", function () {});
      }

      swipeGestureCallback(startCachedEvents, moveCachedEvents, endCachedEvents) {
        counter++;
        const swipeStart = findLastEventOlderThan(startCachedEvents.events, moveCachedEvents.event.timeStamp - 200);
        if(counter === 1){
        expect(startCachedEvents).to.not.be.equal(undefined);
        expect(moveCachedEvents).to.not.be.equal(undefined);
        expect(endCachedEvents).to.not.be.equal(undefined);
        arr.push(swipeStart);
        }
        if(counter === 2){
          expect(startCachedEvents).to.not.be.equal(undefined);
          expect(moveCachedEvents).to.not.be.equal(undefined);
          expect(endCachedEvents).to.not.be.equal(undefined);
          arr.push(swipeStart);
          expect(arr[0].pageX).to.not.be.equal(arr[1].pageX); // findLastEventOlderThan() test
          done();
          slotDIV.removeChild(el);
        }
      }
    };
    customElements.define("swipe-block", SwipeSubclass);
    const el = new SwipeSubclass();
    el.appendChild(document.createElement("div"));
    slotDIV.appendChild(el);
  });
});
