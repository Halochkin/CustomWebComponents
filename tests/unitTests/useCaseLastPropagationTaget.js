class SlotComp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = "<span><slot></slot></span>";
  }
}

customElements.define("slot-comp", SlotComp);

class ShadowComp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = "<h1>hello sunshine</h1>";
  }
}

customElements.define("shadow-comp", ShadowComp);

class ClosedShadow extends HTMLElement {
  constructor() {
    super();
    let shadow = this.attachShadow({mode: "open"});
    shadow.innerHTML = "<slot name='one'><h1>hi!</h1></slot>";
  }
}

customElements.define("closed-shadow", ClosedShadow);


class ShadowButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
  }
}

customElements.define("shadow-btn", ShadowButton);

class PassePartoutBtn extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
  }
}

customElements.define("passepartout-btn", PassePartoutBtn);

class GreenframeBtn extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = `<div></div>`;
  }
}

customElements.define("greenframe-btn", GreenframeBtn);

class NestedShadow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = "<b><shadow-comp></shadow-comp></b>";
  }
}

customElements.define("nested-shadow", NestedShadow);

class MatroschkaComp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = "<slot-comp><slot>hello sunshine</slot></slot-comp>";
  }
}

customElements.define("matroschka-comp", MatroschkaComp);


class OuterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = `<div></div>`;
  }
}

customElements.define("outer-comp", OuterComponent);

class InnerComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = `<div></div>`;
  }
}

customElements.define("inner-comp", InnerComponent);


//useCase1
// Flattened DOM                   | DOM context
//----------------------------------------------------------------
//  div                            | 1. main
//    closed-shadow                | 1. main
//      closed-shadow#root         | A. closed-shadow#root
//        slot                     | A. closed-shadow#root
//          h1                     | A. closed-shadow#root
//          p                      | A. closed-shadow#root
//          span                   | A. closed-shadow#root
//----------------------------------------------------------------
//
//<div>
//  <closed-shadow>
//    <closed-shadow#shadowRoot>
//     <slot name="one">
//       <h1></h1>
//       <p></p>
//       <span></span>
//     </slot>
//    </closed-shadow#shadowRoot>
//  </closed-shadow>
//</div>


function slottedShadow() {
  let div = document.createElement("div");
  let closedShadow = document.createElement("closed-shadow");
  let slotted1 = document.createElement("p");
  let slotted2 = document.createElement("span");
  slotted1.setAttribute("slot", "one");
  slotted2.setAttribute("slot", "one");

  let closedShadowRoot = closedShadow.shadowRoot;
  let closedShadowRootChild = closedShadow.shadowRoot.children[0];
  let closedShadowRootChildChild = closedShadowRootChild.children[0];

  div.appendChild(closedShadow);
  closedShadow.appendChild(slotted1);
  closedShadow.appendChild(slotted2);

  const usecase = [
    slotted1,
    slotted2, [
      closedShadowRootChildChild, [
        closedShadowRootChild, [
          closedShadowRoot, [
            closedShadow, [
              div
            ]
          ]
        ]
      ]
    ]
  ]

  Object.freeze(usecase)
  return usecase;
}


function innerShadow() {
  let divOuter = document.createElement("div");
  let outerComponent = document.createElement("outer-comp");
  let outerComponentShadow = outerComponent.shadowRoot;
  let outerComponentShadowChild = outerComponentShadow.firstChild;
  let innerComponent = document.createElement("inner-comp");
  let innerComponentShadow = innerComponent.shadowRoot;
  let innerComponentShadowChild = innerComponentShadow.firstChild;
  let h1 = document.createElement("h1");


  divOuter.appendChild(outerComponent);
  outerComponentShadowChild.appendChild(innerComponent);
  innerComponentShadowChild.appendChild(h1);

  const usecase = [
    h1,
    innerComponentShadowChild,
    innerComponentShadow, [
      innerComponent,
      outerComponentShadowChild,
      outerComponentShadow, [
        outerComponent, divOuter
      ]
    ]
  ]

  Object.freeze(usecase, true);
  return usecase;
}

//useCase1
// Flattened DOM                   | DOM context
//----------------------------------------------------------------
//  div                            | 1. main
//    slot-comp                    | 1. main
//      slot-comp#root             | A. slot-comp#root
//        span                     | A. slot-comp#root
//          slot                   | A. slot-comp#root
//            shadow-comp          | 1. main
//              shadow-comp#root   | B. shadow-comp#root
//                h1               | B. shadow-comp#root
//<div id="root">
//  <slot-comp>
//    <shadow-comp></shadow-comp>
//  </slot-comp>
//</div>

function shadowSlotted() {
  const div = document.createElement("div");
  const slotComp = document.createElement("slot-comp");
  const shadowComp = document.createElement("shadow-comp");
  div.appendChild(slotComp);
  slotComp.appendChild(shadowComp);
  const slotRoot = div.querySelector("slot-comp").shadowRoot;
  const slotSpan = slotRoot.children[0];
  const slotSlot = slotSpan.children[0];
  const shadowRoot = div.querySelector("shadow-comp").shadowRoot;
  const shadowH1 = shadowRoot.children[0];

  const usecase = [
    [
      shadowH1,
      shadowRoot
    ],
    shadowComp,
    [
      slotSlot,
      slotSpan,
      slotRoot
    ],
    slotComp,
    div
  ];
  Object.freeze(usecase, true);
  return usecase;
}

//useCase2  lightDom element hidden from render by a shadowDom
//
//a lightDOM child hidden in view by the shadowDom of its parent node, is still a viable target for an event, and
// it will propagate in the lightDOM.
// Flattened DOM                   | DOM context
//----------------------------------------------------------------
//   shadow-comp                   | 1. main
//     shadow-comp#root            | B. shadow-comp#root
//       h1                        | B. shadow-comp#root
//  ?!?!  div                      | 1. main in JS, BUT excluded!! in the rendered DOM
//<shadow-comp>
//  <div></div>
//</shadow-comp>

function shadowCompWithExcludedLightDomDiv() {
  const shadowComp = document.createElement("shadow-comp");
  const div = document.createElement("div");
  shadowComp.appendChild(div);
  const usecase = [
    div,
    shadowComp
  ];
  Object.freeze(usecase, true);
  return usecase;
}

// function simpleShadowWithExcludedDivNotInScopedPath() {
//   const shadowComp = document.createElement("shadow-comp");
//   const div = document.createElement("div");
//   shadowComp.appendChild(div);
//
//   const shadowRoot = shadowComp.shadowRoot;
//   const shadowH1 = shadowComp.shadowRoot.children[0];
//   const usecase = [
//     [
//       shadowH1,
//       shadowRoot
//     ],
//     shadowComp
//   ];
//   Object.freeze(usecase, true);
//   return shadowH1div;
// }


//useCase3 simple slot Matroschka
// Flattened DOM                   | DOM context
//----------------------------------------------------------------
//  matroschka-comp                | 1. main
//    matroschka-comp#root         | A. matroschka-comp#root
//      slot-comp                  | A. matroschka-comp#root
//        slot                     | A. matroschka-comp#root
//          slot-comp#root         | B. slot-comp#root
//            span                 | B. slot-comp#root
//              slot               | B. slot-comp#root
//                div              | 1. main
//
//
// 1. main          | A. matroschka  | B. SlotComp
//----------------------------------------------------------------
//<matroschka-comp> |                |
//                  |#shadowRoot     |
//                  |  <slot-comp>   |
//                  |    <slot>      |
//                  |                |#shadowRoot
//                  |                |  <span>
//                  |                |    <slot>
//  <div>           |                |

function simpleMatroschka() {
  const matroshcka = document.createElement("matroschka-comp");
  const div = document.createElement("div");
  matroshcka.appendChild(div);

  const matroshckaRoot = matroshcka.shadowRoot;
  const slotComp = matroshcka.shadowRoot.children[0];
  const matroshckaSlot = matroshcka.shadowRoot.children[0].children[0];
  const slotCompRoot = matroshcka.shadowRoot.children[0].shadowRoot;
  const slotCompSpan = matroshcka.shadowRoot.children[0].shadowRoot.children[0];
  const slotCompSlot = matroshcka.shadowRoot.children[0].shadowRoot.children[0].children[0];


  const usecase = [
    div,
    [
      matroshckaSlot,
      [
        slotCompSlot,
        slotCompSpan,
        slotCompRoot
      ],
      slotComp,
      matroshckaRoot
    ],
    matroshcka
  ];


  Object.freeze(usecase, true);
  return usecase;
}

//useCase4 nestedShadow
// Flattened DOM                   | DOM context
//----------------------------------------------------------------
//   nested-shadow                 | 1. main
//     nested-shadow#root          | A. nested-comp#root
//       b                         | A. nested-comp#root
//         shadow-comp             | A. nested-comp#root
//           shadow-comp#root      | B. shadow-comp#root
//             h1                  | B. shadow-comp#root
// 1. main          | A. nested-comp   | B. shadow-comp
//------------------------------------------------------------------
//<nested-shadow>   |                  |
//                  |#shadowRoot       |
//                  |  <b>             |
//                  |    <shadow-comp> |
//                  |                  |#shadowRoot
//                  |                  |  <h1>

function nestedShadow() {
  const nestedShadow = document.createElement("nested-shadow");
  const nestedRoot = nestedShadow.shadowRoot;
  const nestedB = nestedRoot.children[0];
  const shadowComp = nestedB.children[0];
  const shadowRoot = shadowComp.shadowRoot;
  const shadowH1 = shadowRoot.children[0];
  const usecase = [
    [
      [
        shadowH1,
        shadowRoot
      ],
      shadowComp,
      nestedB,
      nestedRoot
    ],
    nestedShadow
  ];
  Object.freeze(usecase, true);
  return usecase;
}

function h1() {
  const h1 = document.createElement("h1")
  const usecase = [
    h1
  ]
  Object.freeze(usecase, true);
  return usecase;
}

function webcomp() {
  const webcomp = document.createElement("shadow-comp");
  const usecase = [
    [
      webcomp.shadowRoot,
      webcomp.shadowRoot.children[0]
    ],
    webcomp

  ];
  Object.freeze(usecase, true);
  return usecase
}

function nestedButton() {
  let shadowBtn = document.createElement("shadow-btn");
  let passepartoutBtn = document.createElement("passepartout-btn");
  let greenframeBtn = document.createElement("greenframe-btn");
  shadowBtn.appendChild(passepartoutBtn);
  passepartoutBtn.appendChild(greenframeBtn);

  return shadowBtn;
}


export function eventTargetName(eventTarget) {
  if (eventTarget.tagName)
    return eventTarget.tagName;
  if (eventTarget === "window")
    return "window";
  if (eventTarget === "document")
    return "document";
  if (eventTarget.host)
    return eventTarget.host.tagName + "#root";
}

export function popTargets(scopedPath, pops) {
  return popTargets2(scopedPath, pops)[1];
}

function popTargets2(scopedPath, pops) {
  const res = [];
  let inner;
  for (let targetArray of scopedPath) {
    if (pops) {
      if (targetArray instanceof Array) {
        [pops, inner] = popTargets2(targetArray, pops);
        if (inner.length)
          res.push(inner);
      } else {
        pops--;
      }
    } else {
      res.push(targetArray);
    }
  }
  Object.freeze(res);
  return [pops, res];
}

export const useCasesOptions = {
  h1,
  webcomp,
  // nestedButton,  //todo: fix it
  innerShadow,
  shadowSlotted,
  simpleMatroschka,
  slottedShadow,
  shadowCompWithExcludedLightDomDiv,
  nestedShadow
};
Object.freeze(useCasesOptions, true);

export function cleanDom() {//todo replace this one with the useCases
  const div = document.createElement("div");
  const slotComp = document.createElement("slot-comp");
  const shadowComp = document.createElement("shadow-comp");
  div.appendChild(slotComp);
  slotComp.appendChild(shadowComp);
  return {
    div: div,
    slot: div.querySelector("slot-comp"),
    slotRoot: div.querySelector("slot-comp").shadowRoot,
    slotSpan: div.querySelector("slot-comp").shadowRoot.children[0],
    slotSlot: div.querySelector("slot-comp").shadowRoot.children[0].children[0],
    shadowComp: div.querySelector("shadow-comp"),
    shadowRoot: div.querySelector("shadow-comp").shadowRoot,
    shadowH1: div.querySelector("shadow-comp").shadowRoot.children[0]
  };
}