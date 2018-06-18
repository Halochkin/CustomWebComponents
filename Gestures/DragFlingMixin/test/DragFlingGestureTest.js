import {DragFlingGesture} from "../src/DragFlingMixin.js";

describe('DragFlingGesture', function () {

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


  it("class extends SwipeGestureMixin(HTMLElement) + has method", function () {
    const SubclassSwipeGestureElement = class SubclassSizeChanged extends DragFlingGesture(HTMLElement) {
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
    const SubclassSwipeGestureElement = class extends DragFlingGesture(HTMLElement) {
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

    const DragFlingSubclass = class Subclass extends DragFlingGesture(HTMLElement) {
      constructor() {
        super();
        this.style.position = "absolute";
        this.style.width = "100px";
        this.style.height = "100px";
        this.style.borderRadius = "50%";
        this.style.backgroundColor = "blue";
        this.style.border = "4px solid red";
        this.style.top = "100px";
        this.style.left = "100px";
        this.innerText="Try to fling twice quicker than 2000mx"
      }

      flingGestureCallback(flingDetail) {
        this.style.transition = "all " + flingDetail.durationMs + "ms cubic-bezier(0.39, 0.58, 0.57, 1)";
        this.style.left = (parseFloat(this.style.left) + flingDetail.flingX) + "px";
        this.style.top = (parseFloat(this.style.top) + flingDetail.flingY) + "px";
        counter++;
        const swipeStart = findLastEventOlderThan(flingDetail.cashedEvent, flingDetail.flingTime);
        if(counter === 1){
          arr.push(swipeStart);
        }
        if(counter === 2){
          arr.push(swipeStart);
          expect(arr[0].timeStamp).to.not.be.equal(arr[1].timeStamp); // findLastEventOlderThan() test
          done();
          slotDIV.removeChild(el);
        }
      }
      dragGestureCallback(dragDetail) {
        this.style.transition = undefined;
        this.style.left = (parseFloat(this.style.left) + dragDetail.distX) + "px";
        this.style.top = (parseFloat(this.style.top) + dragDetail.distY) + "px";
      }
    };
    customElements.define("swipe-block", DragFlingSubclass );
    const el = new DragFlingSubclass ();
    el.appendChild(document.createElement("div"));
    slotDIV.appendChild(el);
  });
});
