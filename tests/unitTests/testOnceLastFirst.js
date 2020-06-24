let res;

const template = document.createElement("template");
template.innerHTML =
  `<div id="root">
  <slot-comp4>
    <shadow-comp4></shadow-comp4>
  </slot-comp4>
</div>`;

// Flattened DOM                   | DOM context
//----------------------------------------------------------------
//  div                            | main
//    slot-comp4                   | main
//      slot-comp4#root            | slot-comp3#root
//        span                     | slot-comp3#root
//          slot                   | slot-comp3#root
//            shadow-comp4         | main
//              shadow-comp4#root  | shadow-comp3#root
//                h1               | shadow-comp3#root

class SlotComp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = "<span><slot></slot></span>";
  }
}

customElements.define("slot-comp4", SlotComp);

class ShadowComp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.innerHTML = "<h1>hello sunshine</h1>";
  }
}

customElements.define("shadow-comp4", ShadowComp);

function cleanDom(addListeners) {
  const root = document.querySelector("#root");
  root && root.remove();
  document.body.appendChild(template.content.cloneNode(true));
  const dom = {
    div: document.querySelector("div"),
    slot: document.querySelector("slot-comp4"),
    slotRoot: document.querySelector("slot-comp4").shadowRoot,
    slotSpan: document.querySelector("slot-comp4").shadowRoot.children[0],
    slotSlot: document.querySelector("slot-comp4").shadowRoot.children[0].children[0],
    shadowComp: document.querySelector("shadow-comp4"),
    shadowRoot: document.querySelector("shadow-comp4").shadowRoot,
    shadowH1: document.querySelector("shadow-comp4").shadowRoot.children[0]
  };
  // addListeners && addListenersToDOM(dom);
  return dom;
}

export const once = [

  {
    name: "once: 1",
    fun: function () {
      res = "";
      let dom = cleanDom();

      function a(e) {
        res += "a";
      }

      dom.div.addEventListener("click", a, {once: 1});
      dom.div.addEventListener("click", a, {once: true});
      dom.div.dispatchEvent(new Event("click", {bubbles: true}));
    },
    expect: "a",
    result: function () {
      return res;
    }
  },

  {
    name: "once: removeEventListener",
    fun: function () {
      res = "";
      let dom = cleanDom();

      function cb(e) {
        res += "omg";
      }

      dom.div.addEventListener("click", cb, {once: true});
      dom.div.removeEventListener("click", cb);
      dom.div.addEventListener("click", cb);
      dom.div.removeEventListener("click", cb, {once: true});
      dom.div.dispatchEvent(new Event("click", {bubbles: true}));
    },
    expect: "",
    result: function () {
      return res;
    }
  },

  {
    name: "once: add two event listeners, one with once and one without",
    fun: function () {
      res = "";
      let dom = cleanDom();

      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      dom.div.addEventListener("click", a);
      dom.div.addEventListener("click", a, {once: true});
      dom.div.addEventListener("click", b, {once: true});
      dom.div.addEventListener("click", b);
      dom.div.dispatchEvent(new Event("click", {bubbles: true}));
      dom.div.dispatchEvent(new Event("click", {bubbles: true}));
      dom.div.dispatchEvent(new Event("click", {bubbles: true}));
    },
    expect: "abaa",
    result: function () {
      return res;
    }
  },

  {
    name: "once: two listeners to the same element",
    fun: function () {
      res = "";
      let dom = cleanDom();

      function a() {
        res += "a";
      }

      function b() {
        res += "b";
      }

      dom.div.addEventListener("click", a);
      dom.div.addEventListener("click", a, {once: true});
      dom.div.addEventListener("click", a, {once: true});
      dom.div.addEventListener("click", b);
      dom.div.dispatchEvent(new Event("click", {bubbles: true}));
      dom.div.dispatchEvent(new Event("click", {bubbles: true}));
      dom.div.dispatchEvent(new Event("click", {bubbles: true}));
    },
    expect: "ababab",
    result: function () {
      return res;
    }
  },

  {
    name: "once: {capture:true, bubbles: true, once: true}",
    fun: function () {
      res = "";
      const h1 = document.createElement("h1");

      function a() {
        res += "a";
      }

      function b() {
        res += "b";
      }

      function c() {
        res += "c";
      }

      h1.addEventListener("click", a);
      h1.addEventListener("click", b, {once: true});
      // h1.addEventListener("click", d, {once: true});
      h1.addEventListener("click", c, {capture: true, bubbles: true, once: true});

      h1.dispatchEvent(new Event("click", {bubbles: true}));
      h1.dispatchEvent(new Event("click", {bubbles: true}));
      h1.dispatchEvent(new Event("click", {bubbles: true}));
    },
    expect: "abcaa",
    result: function () {
      return res;
    }
  },

  {
    name: "once: {capture:true, bubbles: true, once: true}",
    fun: function () {
      res = "";
      const h1 = document.createElement("h1");

      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      function c(e) {
        res += "c";
      }

      h1.addEventListener("click", a);
      h1.addEventListener("click", b, {once: true});
      h1.addEventListener("click", c, {capture: true, bubbles: true, once: true});

      h1.dispatchEvent(new Event("click", {bubbles: true}));
      h1.dispatchEvent(new Event("click", {bubbles: true}));
      h1.dispatchEvent(new Event("click", {bubbles: true}));
    },
    expect: "abcaa",
    result: function () {
      return res;
    }
  },

  {
    name: "once: slotted element",
    fun: function () {
      res = "";
      const dom = cleanDom(true);


      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      dom.slot.addEventListener("click", a, {once: true});
      dom.slot.addEventListener("click", b);
      dom.slot.dispatchEvent(new Event("click", {bubbles: true}));
      dom.shadowComp.dispatchEvent(new Event("click", {bubbles: true}));
      dom.shadowComp.dispatchEvent(new Event("click", {bubbles: true}));
    },
    expect: "abbb",
    result: function () {
      return res;
    }
  },

  {
    name: "once: does not propagates through shadowRoot",
    fun: function () {
      res = "";
      const dom = cleanDom(true);


      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      dom.shadowH1.addEventListener("click", a, {once: true});
      dom.div.addEventListener("click", b);

      dom.shadowH1.dispatchEvent(new Event("click", {bubbles: true}));
      dom.shadowH1.dispatchEvent(new Event("click", {bubbles: true}));
    },
    expect: "a",
    result: function () {
      return res;
    }
  },

];


export const last = [

  {
    name: "last: 1",
    fun: function () {
      res = "";
      let dom = cleanDom();

      function a(e) {
        res += "a";
      }

      dom.div.addEventListener("click", a, {last: 1});
      dom.div.addEventListener("click", a, {last: true});
      dom.div.dispatchEvent(new Event("click", {bubbles: true}));
    },
    expect: "a",
    result: function () {
      return res;
    }
  },

  {
    name: "last: removeEventListener",
    fun: function () {
      res = "";
      let dom = cleanDom();

      function cb(e) {
        res += "omg";
      }

      dom.div.addEventListener("click", cb, {last: true});
      dom.div.removeEventListener("click", cb);
      dom.div.addEventListener("click", cb);
      dom.div.removeEventListener("click", cb, {last: true});
      dom.div.dispatchEvent(new Event("click", {bubbles: true}));
    },
    expect: "",
    result: function () {
      return res;
    }
  },

  {
    name: "last: add {last: true} to THE SAME element twice",
    fun: function () {
      res = "";
      let dom = cleanDom();

      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      function c(e) {
        res += "c";
      }

      dom.div.addEventListener("click", a);
      try {
        dom.div.addEventListener("click", b, {last: true});
        dom.div.addEventListener("click", b, {last: true});
        dom.div.addEventListener("click", c);
      } catch (e) {
        res += " error ";
      }
      dom.div.dispatchEvent(new Event("click",));

    },
    expect: "acb",  //todo: this is strange
    result: function () {
      return res;
    }
  },

  {
    name: "last: add {last: true} to DIFFERENT element twice",
    fun: function () {
      res = "";
      let dom = cleanDom();

      function a() {
        res += "a";
      }

      function b() {
        res += "b";
      }

      function c() {
        res += "c";
      }

      dom.div.addEventListener("click", a, {last: true});
      try {
        dom.slot.addEventListener("click", b, {last: true});
      } catch (e) {
        res += " error "
      }
      dom.slot.addEventListener("click", c);

      dom.div.dispatchEvent(new Event("click",));
      dom.slot.dispatchEvent(new Event("click",));

    },
    expect: "acb",  //todo: this is strange
    result: function () {
      return res;
    }
  },

  {
    name: "last: {capture:true, last: true}",
    fun: function () {
      res = "";
      let dom = cleanDom();

      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      function c(e) {
        res += "c";
      }

      try {
        dom.div.addEventListener("click", a, {last: true});
        dom.div.addEventListener("click", b, {last: true});
        dom.div.addEventListener("click", c, {last: true});
      } catch (e) {
        res += " error ";
      }
      dom.div.dispatchEvent(new Event("click",));
    },
    expect: " error a",
    result: function () {
      return res;
    }
  },

  {
    name: "last: does not propagate through shadowRoot",
    fun: function () {
      res = "";
      const dom = cleanDom(true);


      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      dom.shadowH1.addEventListener("click", a, {last: true});
      dom.div.addEventListener("click", b);

      dom.shadowH1.dispatchEvent(new Event("click", {bubbles: true}));
    },
    expect: "a",
    result: function () {
      return res;
    }
  },

  {
    name: "last: {capture:true, bubbles: true, last: true}",
    fun: function () {
      res = "";
      const dom = cleanDom(true);

      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      function c(e) {
        res += "c";
      }

      dom.div.addEventListener("click", b, {last: true});
      dom.div.addEventListener("click", a);

      try {
        dom.div.addEventListener("click", a, {capture: true, bubbles: true, last: true});
      } catch (e) {
        res += " error "
      }
      dom.div.dispatchEvent(new Event("click", {bubbles: true}));

    },
    expect: " error ab",
    result: function () {
      return res;
    }
  },

  {
    name: "last: {capture:true, last: true}",
    fun: function () {
      res = "";
      const dom = cleanDom(true);

      function a(e) {
        res += "a";
      }

      try {
        dom.div.addEventListener("click", a, {capture: true, last: true});
      } catch (e) {
        res += " error "
      }
      dom.div.addEventListener("click", a);
      dom.div.dispatchEvent(new Event("click", {bubbles: true}));

    },
    expect: " error a",
    result: function () {
      return res;
    }
  },

  {
    name: "last: {capture:false, last: true}",
    fun: function () {
      res = "";
      const dom = cleanDom(true);

      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      function c(e) {
        res += "c";
      }

      dom.div.addEventListener("click", a);
      dom.div.addEventListener("click", b, {capture: false, last: true});
      dom.div.addEventListener("click", b);
      try {
        dom.div.addEventListener("click", c, {capture: false, last: true});
      } catch (e) {
        res += " error abb"
      }
      dom.div.dispatchEvent(new Event("click"));

    },
    expect: " error ab", //todo why error abab??
    result: function () {
      return res;
    }
  },

  {
    name: "last: slotted element",
    fun: function () {
      res = "";
      const dom = cleanDom(true);


      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      dom.slot.addEventListener("click", a, {last: true});
      dom.slot.addEventListener("click", b);

      dom.slot.dispatchEvent(new Event("click", {bubbles: true}));
    },
    expect: "ba",
    result: function () {
      return res;
    }
  },

  {
    name: "last: {last: true, once: true}",
    fun: function () {
      res = "";
      const dom = cleanDom(true);


      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      dom.slot.addEventListener("click", a, {last: true, once: true});
      dom.slot.addEventListener("click", b);

      dom.slot.dispatchEvent(new Event("click"));
      dom.slot.dispatchEvent(new Event("click"));
    },
    expect: "bab",
    result: function () {
      return res;
    }
  },

];

export const first = [

  {
    name: "first: 1",
    fun: function () {
      res = "";
      let dom = cleanDom();

      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      dom.div.addEventListener("click", b);
      dom.div.addEventListener("click", a, {first: 1, capture: true});
      dom.div.dispatchEvent(new Event("click"));
    },
    expect: "ab",
    result: function () {
      return res;
    }
  },

  {
    name: "first: removeEventListener",
    fun: function () {
      res = "";
      let dom = cleanDom();

      function cb(e) {
        res += "omg";
      }

      dom.div.addEventListener("click", cb, {first: true, capture: true});
      dom.div.removeEventListener("click", cb);
      dom.div.addEventListener("click", cb);
      dom.div.removeEventListener("click", cb, {last: true, capture: true});
      dom.div.dispatchEvent(new Event("click"));
    },
    expect: "",
    result: function () {
      return res;
    }
  },

  {
    name: "first: add {first: true, capture: true} to THE SAME element twice",
    fun: function () {
      res = "";
      let dom = cleanDom();

      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      function c(e) {
        res += "c";
      }

      dom.div.addEventListener("click", a);
      dom.div.addEventListener("click", b, {first: true, capture: true});
      try {
        dom.div.addEventListener("click", c, {first: true, capture: true});
        dom.div.addEventListener("click", c);
      } catch (e) {
        res += "error ";
      }
      dom.div.dispatchEvent(new Event("click",));

    },
    expect: "error ba",
    result: function () {
      return res;
    }
  },

  {
    name: "first: add {first: true, capture: true} to DIFFERENT element twice",
    fun: function () {
      res = "";
      let dom = cleanDom();

      function a() {
        res += "a";
      }

      function b() {
        res += "b";
      }

      function c() {
        res += "c";
      }


      dom.div.addEventListener("click", b);
      dom.div.addEventListener("click", a, {first: true, capture: true});
      try {
        dom.slot.addEventListener("click", b, {first: true, capture: true});
      } catch (e) {
        res += " error "
      }
      dom.slot.addEventListener("click", c);

      dom.div.dispatchEvent(new Event("click",));
      dom.slot.dispatchEvent(new Event("click",));

    },
    expect: "ababc",  //todo: this is strange
    result: function () {
      return res;
    }
  },

  {
    name: "first: {capture:true, first: true}",
    fun: function () {
      res = "";
      let dom = cleanDom();

      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      function c(e) {
        res += "c";
      }

      dom.div.addEventListener("click", a, {first: true, capture: true});
      try {
        dom.div.addEventListener("click", b, {first: true, capture: true});
        dom.div.addEventListener("click", c, {first: true, capture: true});
      } catch (e) {
        res += "error ";
      }
      dom.div.dispatchEvent(new Event("click",));
    },
    expect: "error a",   //todo strange
    result: function () {
      return res;
    }
  },

  {
    name: "first: does not propagate through shadowRoot",
    fun: function () {
      res = "";
      const dom = cleanDom(true);


      function a() {
        res += "a";
      }

      function b() {
        res += "b";
      }

      dom.div.addEventListener("click", b);
      dom.shadowH1.addEventListener("click", a, {first: true, capture: true});

      dom.shadowH1.dispatchEvent(new Event("click"));
    },
    expect: "a",
    result: function () {
      return res;
    }
  },

  {
    name: "first: {capture:true, bubbles: false, first: true}",
    fun: function () {
      res = "";
      const dom = cleanDom(true);

      function a() {
        res += "a";
      }

      function b() {
        res += "b";
      }

      function c() {
        res += "c";
      }

      dom.div.addEventListener("click", a);
      dom.div.addEventListener("click", b, {first: true, capture: true});

      try {
        dom.div.addEventListener("click", a, {capture: true, bubbles: false, first: true});
      } catch (e) {
        res += " error "
      }
      dom.div.dispatchEvent(new Event("click"));

    },
    expect: " error ba",
    result: function () {
      return res;
    }
  },

  {
    name: "first: {capture:true, first: true}",
    fun: function () {
      res = "";
      const dom = cleanDom(true);

      function a(e) {
        res += "a";
      }

      try {
        dom.div.addEventListener("click", a, {capture: true, first: true});
      } catch (e) {
        res += " error "
      }
      dom.div.addEventListener("click", a);
      dom.div.dispatchEvent(new Event("click",));

    },
    expect: " error a",
    result: function () {
      return res;
    }
  },

  {
    name: "first: {capture:true, first: true}",
    fun: function () {
      res = "";
      const dom = cleanDom(true);

      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      function c(e) {
        res += "c";
      }

      dom.div.addEventListener("click", a);
      dom.div.addEventListener("click", b, {capture: true, first: true});
      try {
        dom.div.addEventListener("click", c, {capture: true, first: true});
      } catch (e) {
        res += " error "
      }
      dom.div.dispatchEvent(new Event("click"));

    },
    expect: " error ba", //
    result: function () {
      return res;
    }
  },

  {
    name: "first: slotted element",
    fun: function () {
      res = "";
      const dom = cleanDom(true);


      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      dom.slot.addEventListener("click", a, {first: true, capture: true});
      dom.slot.addEventListener("click", b);

      dom.slot.dispatchEvent(new Event("click",));
    },
    expect: "ba",
    result: function () {
      return res;
    }
  },


  {
    name: "first: {first: true, once: true, capture: true}",
    fun: function () {
      res = "";
      const dom = cleanDom(true);


      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      dom.slot.addEventListener("click", a, {first: true, once: true, capture: true});
      dom.slot.addEventListener("click", b);

      dom.slot.dispatchEvent(new Event("click"));
      dom.slot.dispatchEvent(new Event("click"));
    },
    expect: "bab",
    result: function () {
      return res;
    }
  },
  {
    name: "first: {first: true, once: true, capture: true}",
    fun: function () {
      res = "";
      const dom = cleanDom(true);


      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      dom.slot.addEventListener("click", a, {first: true, once: true, capture: true});
      dom.slot.addEventListener("click", b);

      dom.slot.dispatchEvent(new Event("click"));
      dom.slot.dispatchEvent(new Event("click"));
    },
    expect: "abb",
    result: function () {
      return res;
    }
  },

  {
    name: "first: {first: true, last: true, capture: true}",
    fun: function () {
      res = "";
      const dom = cleanDom(true);


      function a(e) {
        res += "a";
      }

      function b(e) {
        res += "b";
      }

      try {
        dom.slot.addEventListener("click", a, {first: true, last: true, capture: true});
      } catch (e) {
        res = "error "
      }
      dom.slot.addEventListener("click", b);

      dom.slot.dispatchEvent(new Event("click"));
    },
    expect: "error b",
    result: function () {
      return res;
    }
  },

];