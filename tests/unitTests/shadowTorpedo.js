//template with slotted web comp with shadowDOM
const template = document.createElement("template");

let shadow;

template.innerHTML = `<closed-comp></closed-comp>`;

class ClosedComp extends HTMLElement {
  constructor() {
    super();
    shadow = this.attachShadow({mode: "closed"});
    shadow.innerHTML = `<span>Hello sunshine! (dblclick me)</span>`;

    // shadow.addEventListener("click", e => console.log(e.type, "shadowDOM click"));
    // shadow.addEventListener("dblclick", e => console.log(e.type, "shadowDOM dblclick"));
    // shadow.addEventListener("dblclick", e => e.stopPropagation());  //ShadowTorpedo
  }
}


customElements.define("closed-comp", ClosedComp);

// //method that produce a new version of this DOM each time.
function cleanDom() {
  const root = document.querySelector("#root");
  root && root.remove();
  document.body.appendChild(template.content.cloneNode(true));

  const dom = {
    wc: document.querySelector("closed-comp"),
    shadow: shadow,
  }

  addListenersToDOM(dom);
  return dom;
}


function addListenersToDOM(dom) {
  for (let elName in dom) {
    dom[elName].addEventListener("click", function (e) {
      res1 += e.type + " ";
      res2 += "-";
      res3 += e.eventPhase;
    }, true);

    dom[elName].addEventListener("dbclick", function (e) {
      res1 += e.type + " ";
      res2 += "+";
      res3 += e.eventPhase;
    }, true);

    dom[elName].addEventListener("click", function (e) {
      res1 += e.type + " ";
      res2 += "+";
      res3 += e.eventPhase;
    });

    dom[elName].addEventListener("dbclick", function (e) {
      res1 += e.type + " ";
      res2 += "+";
      res3 += e.eventPhase;
    });
  }
}

let res1 = "";
let res2 = "";
let res3 = "";
export const shadowTorpedo = [{
  name: "shadowTorpedo: composed: YES, bubbles: NO",
  fun: function () {

    res1 = res2 = res3 = "";
    const dom = cleanDom();

    for (let elName in dom) {
      dom[elName].dispatchEvent(new Event("click"));
      dom[elName].dispatchEvent(new Event("dbclick"));
    }
  },
  expect: "shadowRoot shadowH1 shadowH1 +-+:122",
  result: function () {
    return res1 + res2 + ":" + res3;
  }
},
  // {
//   name: "propagation: composed: NO bubbles: YES",
//   fun: function () {
//     res1 = res2 = res3 = "";
//     const dom = cleanDom();
//     dom.shadowH1.dispatchEvent(new Event("click", {bubbles: true}));
//   },
//   expect: "shadowRoot shadowH1 shadowH1 shadowRoot +-+-:1223",
//   result: function () {
//     return res1 + res2 + ":" + res3;
//   }
// }, {
//   name: "propagation: composed: YES bubbles: NO",
//   fun: function () {
//     res1 = res2 = res3 = "";
//     const dom = cleanDom();
//     dom.shadowH1.dispatchEvent(new Event("click", {composed: true}));
//   },
//   expect: "div slot slotRoot slotSpan slotSlot shadowComp shadowRoot shadowH1 shadowH1 shadowComp +++++++-+-:1111121222",
//   result: function () {
//     return res1 + res2 + ":" + res3;
//   }
// }, {
//   name: "propagation: composed: YES bubbles: YES",
//   fun: function () {
//     res1 = res2 = res3 = "";
//     const dom = cleanDom();
//     dom.shadowH1.dispatchEvent(new Event("click", {composed: true, bubbles: true}));
//   },
//   expect: "div slot slotRoot slotSpan slotSlot shadowComp shadowRoot shadowH1 shadowH1 shadowRoot shadowComp slotSlot slotSpan slotRoot slot div +++++++-+-------:1111121223233333",
//   result: function () {
//     return res1 + res2 + ":" + res3;
//   }
// }, {
//   name: "propagation2: composed: NO bubbles: NO",
//   fun: function () {
//     res1 = res2 = res3 = "";
//     const dom = cleanDom();
//     dom.shadowComp.dispatchEvent(new Event("click"));
//   },
//   expect: "div slot slotRoot slotSpan slotSlot shadowComp shadowComp +++++-+:1111122",
//   result: function () {
//     return res1 + res2 + ":" + res3;
//   }
// }, {
//   name: "propagation2: composed: NO bubbles: YES",
//   fun: function () {
//     res1 = res2 = res3 = "";
//     const dom = cleanDom();
//     dom.shadowComp.dispatchEvent(new Event("click", {bubbles: true}));
//   },
//   expect: "div slot slotRoot slotSpan slotSlot shadowComp shadowComp slotSlot slotSpan slotRoot slot div +++++-+-----:111112233333",
//   result: function () {
//     return res1 + res2 + ":" + res3;
//   }
// }, {
//   name: "propagation2: composed: YES bubbles: NO",
//   fun: function () {
//     res1 = res2 = res3 = "";
//     const dom = cleanDom();
//     dom.shadowComp.dispatchEvent(new Event("click", {composed: true}));
//   },
//   expect: "div slot slotRoot slotSpan slotSlot shadowComp shadowComp +++++-+:1111122",
//   result: function () {
//     return res1 + res2 + ":" + res3;
//   }
// }, {
//   name: "propagation2: composed: YES bubbles: YES",
//   fun: function () {
//     res1 = res2 = res3 = "";
//     const dom = cleanDom();
//     dom.shadowComp.dispatchEvent(new Event("click", {composed: true, bubbles: true}));
//   },
//   expect: "div slot slotRoot slotSpan slotSlot shadowComp shadowComp slotSlot slotSpan slotRoot slot div +++++-+-----:111112233333",
//   result: function () {
//     return res1 + res2 + ":" + res3;
//   }
// }

];
