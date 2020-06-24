//template with slotted web comp with shadowDOM
const template = document.createElement("template");
template.innerHTML =
  `<div id="root">
  <slot-comp3>
    <shadow-comp3></shadow-comp3>
  </slot-comp3>
</div>`;

// Flattened DOM                   | DOM context
//----------------------------------------------------------------  
//  div                            | main
//    slot-comp3                   | main
//      slot-comp3#root            | slot-comp3#root
//        span                     | slot-comp3#root
//          slot                   | slot-comp3#root
//            shadow-comp3         | main
//              shadow-comp3#root  | shadow-comp3#root
//                h1               | shadow-comp3#root

class SlotComp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = "<span><slot></slot></span>";
  }
}

customElements.define("slot-comp3", SlotComp);

class ShadowComp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = "<h1>hello sunshine</h1>";
  }
}

customElements.define("shadow-comp3", ShadowComp);

//method that produce a new version of this DOM each time.
function cleanDom(addListeners) {
  const root = document.querySelector("#root");
  root && root.remove();
  document.body.appendChild(template.content.cloneNode(true));
  const dom = {
    div: document.querySelector("div"),
    slot: document.querySelector("slot-comp3"),
    slotRoot: document.querySelector("slot-comp3").shadowRoot,
    slotSpan: document.querySelector("slot-comp3").shadowRoot.children[0],
    slotSlot: document.querySelector("slot-comp3").shadowRoot.children[0].children[0],
    shadowComp: document.querySelector("shadow-comp3"),
    shadowRoot: document.querySelector("shadow-comp3").shadowRoot,
    shadowH1: document.querySelector("shadow-comp3").shadowRoot.children[0]
  };
  addListeners && addListenersToDOM(dom);
  return dom;
}

let res1 = "";
let res2 = "";
let res3 = "";
let res4 = "";

function addListenersToDOM(dom) {
  for (let elName in dom) {
    dom[elName].addEventListener("click", function (e) {
      res1 += elName + " ";
      res2 += "-";
      res3 += e.eventPhase;
    });
    dom[elName].addEventListener("click", function (e) {
      res1 += elName + " ";
      res2 += "+";
      res3 += e.eventPhase;
    }, true);
  }
}

export const testStopProp = [
  {
    name: "shadowTorpedo: stopPropagation(true)",
    fun: function () {
      res1 = res2 = res3 = "";
      const dom = cleanDom(true);

      dom.shadowH1.addEventListener("click", function (e) {
        e.stopPropagation(true);
      });
      dom.shadowH1.dispatchEvent(new Event("click", {composed: true, bubbles: true}));
    },
    expect: "div slot slotRoot slotSpan slotSlot shadowComp shadowRoot shadowH1 shadowH1 shadowComp slotSlot slotSpan slotRoot slot div +++++++-+------:111112122233333",
    result: function () {
      return res1 + res2 + ":" + res3;
    }
  },
  {
    name: "captureTorpedo: stopPropagation(true)",
    fun: function () {
      res1 = res2 = res3 = "";
      const dom = cleanDom(true);

      dom.div.addEventListener("click", function (e) {
        e.stopPropagation(true);
      }, true);
      dom.shadowH1.dispatchEvent(new Event("click", {composed: true, bubbles: true}));
    },
    expect: "div slotRoot slotSpan slotSlot shadowRoot shadowH1 shadowH1 shadowRoot slotSlot slotSpan slotRoot +++++-+----:11111223333",
    result: function () {
      return res1 + res2 + ":" + res3;
    }
  },
  {
    name: "slotTorpedo: stopPropagation(true)",
    fun: function () {
      res1 = res2 = res3 = "";
      const dom = cleanDom(true);

      dom.slotSlot.addEventListener("click", function (e) {
        e.stopPropagation(true);
      });
      dom.shadowH1.dispatchEvent(new Event("click", {composed: true, bubbles: true}));
    },
    expect: "div slot slotRoot slotSpan slotSlot shadowComp shadowRoot shadowH1 shadowH1 shadowRoot shadowComp slotSlot slot div +++++++-+-----:11111212232333",
    result: function () {
      return res1 + res2 + ":" + res3;
    }
  },
  {
    name: "slotCaptureTorpedo: stopPropagation(true)",
    fun: function () {
      res1 = res2 = res3 = "";
      const dom = cleanDom(true);

      dom.slotRoot.addEventListener("click", function (e) {
        e.stopPropagation(true);
      }, true);
      dom.shadowH1.dispatchEvent(new Event("click", {composed: true, bubbles: true}));
    },
    expect: "div slot slotRoot shadowComp shadowRoot shadowH1 shadowH1 shadowRoot shadowComp slot div +++++-+----:11121223233",
    result: function () {
      return res1 + res2 + ":" + res3;
    }
  }
];

export const testStopProp2 = [
  {
    name: "shadowTorpedo: addEventListener(.., .., {scoped: true}/{unstoppable: true} )",
    fun: function () {
      res1 = res2 = res3 = res4 = "";
      const dom = cleanDom(false);

      dom.shadowH1.addEventListener("click", function (e) {
        e.stopPropagation();
      }, true);

      dom.shadowH1.addEventListener("click", function (e) {
        res4 += "SameScope ";
      }, {scoped: true});

      dom.div.addEventListener("click", function (e) {
        res4 += "DifferentScope";
      }, {scoped: true});

      dom.shadowH1.dispatchEvent(new Event("click", {composed: true, bubbles: true}));
    },
    expect: "SameScope",
    result: function () {
      return res4;
    }
  },
  {
    name: "captureTorpedo: addEventListener(.., .., {scoped: true}/{unstoppable: true} )",
    fun: function () {
      res1 = res2 = res3 = res4 = "";
      const dom = cleanDom(false);

      dom.div.addEventListener("click", function (e) {
        e.stopPropagation();
      }, true);

      dom.shadowH1.addEventListener("click", function (e) {
        res4 += "DifferentScope ";
      }, {scoped: true});

      dom.div.addEventListener("click", function (e) {
        res4 += "SameScope ";
      }, {scoped: true});

      dom.div.addEventListener("click", function (e) {
        res4 += "unstoppable";
      }, {unstoppable: true});

      dom.shadowH1.dispatchEvent(new Event("click", {composed: true, bubbles: true}));
    },
    expect: "DifferentScope unstoppable",
    result: function () {
      return res4;
    }
  },
  {
    name: "slotTorpedo: addEventListener(.., .., {scoped: true}/{unstoppable: true} )",
    fun: function () {
      res1 = res2 = res3 = res4 = "";
      const dom = cleanDom(false);

      dom.slot.addEventListener("click", function (e) {
        e.stopPropagation();
      }, true);

      dom.slot.addEventListener("click", function (e) {
        res4 += "SameScope";
      }, {scoped: true});

      dom.div.addEventListener("click", function (e) {
        res4 += "DifferentScope";
      }, {scoped: true});

      dom.shadowH1.dispatchEvent(new Event("click", {composed: true, bubbles: true}));
    },
    expect: "DifferentScope",
    result: function () {
      debugger
      return res4;
    }
  },
  {
    name: "slotCaptureTorpedo: addEventListener(.., .., {scoped: true}/{unstoppable: true} )",
    fun: function () {
      res1 = res2 = res3 = res4 = "";
      const dom = cleanDom(false);

      dom.slotRoot.addEventListener("click", function (e) {
        e.stopPropagation();
      }, true);

      dom.slotRoot.addEventListener("click", function (e) {
        res4 += "SameScope";
      }, {scoped: true});

      dom.div.addEventListener("click", function (e) {
        res4 += "DifferentScope";
      }, {scoped: true});

      dom.shadowH1.dispatchEvent(new Event("click", {composed: true, bubbles: true}));
    },
    expect: "DifferentScope",
    result: function () {
      return res4;
    }
  },
];

export const testStopProp3 = [
  {
    name: "shadowTorpedo: Event.isScoped",
    fun: function () {
      res1 = res2 = res3 = res4 = "";
      const dom = cleanDom(false);

      // #document
      dom.shadowH1.addEventListener("click", function (e) {
        e.stopImmediatePropagation();
      }, true);

      dom.div.addEventListener("click", function (e) {
        res4 += "DifferentScope";
      });

      dom.shadowH1.addEventListener("click", function (e) {
        res4 += "SameScope";
      });
      const event = new Event("click", {composed: true, bubbles: true});
      event.isScoped = true;
      dom.shadowH1.dispatchEvent(event);
    },
    expect: "DifferentScope",
    result: function () {
      return res4;
    }
  },
  {
    name: "captureTorpedo: Event.isScoped",
    fun: function () {
      res1 = res2 = res3 = res4 = "";
      const dom = cleanDom(false);

      // #document
      dom.div.addEventListener("click", function (e) {
        e.stopPropagation();
      }, true);

      dom.shadowH1.addEventListener("click", function (e) {
        res4 += "DifferentScope";
      });

      dom.div.addEventListener("click", function (e) {
        res4 += "SameScope";
      });
      const event = new Event("click", {composed: true, bubbles: true});
      event.isScoped = true;
      dom.shadowH1.dispatchEvent(event);
    },
    expect: "DifferentScope",
    result: function () {
      return res4;
    }
  },
  {
    name: "slotTorpedo: Event.isScoped",
    fun: function () {
      res1 = res2 = res3 = res4 = "";
      const dom = cleanDom(false);

      // #document
      dom.slot.addEventListener("click", function (e) {
        e.stopPropagation();
      }, true);

      dom.slot.addEventListener("click", function (e) {
        res4 += "SameScope";
      });

      dom.div.addEventListener("click", function (e) {
        res4 += "DifferentScope";
      });
      const event = new Event("click", {composed: true, bubbles: true});
      event.isScoped = true;
      dom.shadowH1.dispatchEvent(event);
    },
    expect: "DifferentScope",
    result: function () {
      return res4;
    }
  },
  {
    name: "slotCaptureTorpedo: Event.isScoped",
    fun: function () {
      res1 = res2 = res3 = res4 = "";
      const dom = cleanDom(false);

      // #document
      dom.slotRoot.addEventListener("click", function (e) {
        e.stopPropagation();
      }, true);

      dom.slotRoot.addEventListener("click", function (e) {
        res4 += "SameScope";
      });

      dom.div.addEventListener("click", function (e) {
        res4 += "DifferentScope";
      });
      const event = new Event("click", {composed: true, bubbles: true});
      event.isScoped = true;
      dom.shadowH1.dispatchEvent(event);
    },
    expect: "DifferentScope",
    result: function () {
      return res4;
    }
  },
]


// Flattened DOM                   | DOM context
//----------------------------------------------------------------
//  div                            | main
//    slot-comp3                   | main
//      slot-comp3#root            | slot-comp3#root
//        span                     | slot-comp3#root
//          slot                   | slot-comp3#root
//            shadow-comp3         | main
//              shadow-comp3#root  | shadow-comp3#root
//                h1               | shadow-comp3#root

export const testStopProp4 = [
  {
    name: "shadowTorpedo: stopPropagation()",
    fun: function () {
      res1 = res2 = res3 = res4 = "";
      const dom = cleanDom(false);

      dom.shadowH1.addEventListener("click", function (e) {
        e.stopPropagation();
        res4 += "one ";
      }, false);

      //#shadowRoot
      dom.shadowH1.addEventListener("click", function (e) {
        res4 += "two ";
      }, true);

      dom.shadowH1.addEventListener("click", function (e) {
        res4 += "three ";
      }, true);


      dom.div.addEventListener("click", function (e) {
        res4 += "four ";
      });

      const event = new Event("click", {composed: true, bubbles: true});
      event.isScoped = true;

      dom.shadowH1.dispatchEvent(event);

    },
    expect: "one two three ",
    result: function () {
      return res4;
    }
  }]