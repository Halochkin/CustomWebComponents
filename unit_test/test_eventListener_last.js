//target => "eventName"/"eventName capture" => {cb, options}
const targetTypeLast = new WeakMap();

function getLast(target, type, cb, options) {
  const capture = options instanceof Object ? options.capture : !!options;
  const lookupName = capture ? type + " capture" : type;
  return targetTypeLast.get(target)?.get(lookupName);
}

function setLast(target, type, cb, options) {
  const capture = options instanceof Object ? options.capture : !!options;
  const lookupName = capture ? type + " capture" : type;
  let targetsMap = targetTypeLast.get(target);
  if (!targetsMap)
    targetTypeLast.set(target, targetsMap = new Map());
  if (options.once) {
    const og = cb;
    cb = function (e) {
      targetsMap.delete(lookupName);
      og.call(this, e);
    };
  }
  targetsMap.set(lookupName, {cb, options});
  return cb;
}

function addLastEventListenerOption(proto) {
  const ogAdd = proto.addEventListener;
  const ogRemove = proto.removeEventListener;
  Object.defineProperties(proto, {
    addEventListener: {
      value: function (type, cb, options) {
        const oldLast = getLast(this, type, cb, options);
        if (options?.last && oldLast)
          throw new Error("only one last event listener can be added to a target for an event type at a time.");
        if (options?.last) {
          cb = setLast(this, type, cb, options);
          return ogAdd.call(this, type, cb, options);
        }
        if (oldLast) {
          this.removeEventListener(type, oldLast.cb, oldLast.options);
          const res = ogAdd.call(this, type, cb, options);
          ogAdd.call(this, type, oldLast.cb, oldLast.options);
          return res;
        }
        return ogAdd.call(this, type, cb, options);
      }
    },
    removeEventListener: {
      value: function (type, cb, options) {
        cb = getLast(this, type, cb, options)?.cb || cb;
        ogRemove.call(this, type, cb, options);
      }
    }
  });
}

addLastEventListenerOption(EventTarget.prototype);

// tests


let res;


function outer() {
  return "a";
}


export const addEventListenerLastBasic = [
  {
    name: "Empty object option",
    fun: function () {
      res = "";
      const h1 = document.createElement("h1");
      h1.addEventListener("click", function (e) {
        res += "a";
      }, {});
      h1.addEventListener("click", function (e) {
        res += "b";
      });
      h1.dispatchEvent(new MouseEvent("click"))
    },
    expect: function () {
      return res === "ab"
    }

  }, {
    name: "{last: 0}",
    fun: function () {
      res = "";
      const h1 = document.createElement("h1");
      h1.addEventListener("click", function (e) {
        res += "a";
      }, {last: 0});
      h1.addEventListener("click", function (e) {
        res += "b";
      });
      h1.dispatchEvent(new MouseEvent("click"))
    },
    expect: function () {
      return res === "ab"
    }

  },

  {
    name: "{last: []}",
    fun: function () {
      res = "";
      const h1 = document.createElement("h1");
      h1.addEventListener("click", function (e) {
        res += "a";
      }, {last: []});
      h1.addEventListener("click", function (e) {
        res += "b";
      });
      h1.dispatchEvent(new MouseEvent("click"))
    },
    expect: function () {
      return res === "ba"
    }

  }, {
    name: "{last: 1}",
    fun: function () {
      res = "";
      const h1 = document.createElement("h1");
      h1.addEventListener("click", function (e) {
        res += "a";
      }, {last: []});
      h1.addEventListener("click", function (e) {
        res += "b";
      });
      h1.dispatchEvent(new MouseEvent("click"))
    },
    expect: function () {
      return res === "ba"
    }

  },

  {
    name: "Last option order",
    fun: function () {
      res = "";
      const h1 = document.createElement("h1");
      h1.addEventListener("click", function (e) {
        res += "a";
      }, {last: true});
      h1.addEventListener("click", function (e) {
        res += "b";
      });
      h1.dispatchEvent(new MouseEvent("click"));

    },
    expect: function () {
      return res === "ba";
    },
  },

  {
    name: "{capture: true, last: true}",
    fun: function () {
      res = "";
      const h1 = document.createElement("h1");
      h1.addEventListener("click", function (e) {
        res += "a";
      }, {capture: true, last: true});
      h1.addEventListener("click", function (e) {
        res += "b";
      });
      h1.dispatchEvent(new MouseEvent("click"))

    },
    expect: function () {
      // ab,
      return res === "ab"
    }
  },

  {
    name: "outer callback function",
    fun: function () {
      res = "";
      const h1 = document.createElement("h1");
      h1.addEventListener("click", outer, {last: true});
      h1.dispatchEvent(new MouseEvent("click"))

    },
    expect: function () {
      // ab,
      return res === "a"
    }
  },

  {
    name: "outer callback function",
    fun: function () {
      res = "";
      const h1 = document.createElement("h1");
      h1.addEventListener("click", outer, {last: true});
      h1.dispatchEvent(new MouseEvent("click"))

    },
    expect: function () {
      // ab,
      return res === "a"
    }
  },


]


export const addEventListenerLastErrors = [
  {
    name: "Several last listeners",
    fun: function () {
      res = "";
      const h1 = document.createElement("h1");

      h1.addEventListener("click", function (e) {
        res += "a";
      }, {last: true});
      try {
        h1.addEventListener("click", function (e) {
          res += "b";
        }, {last: true});
      } catch (e) {
        res = e;
      }

      h1.dispatchEvent(new MouseEvent("click"))
    },
    expect: function () {

      // a at the end
      return res === "Error: only one last event listener can be added to a target for an event type at a time.a"
    }
  },

  {
    name: "removeEventListener() {last: true}  and then define new one",
    fun: function () {
      res = "";
      const h1 = document.createElement("h1");
      h1.addEventListener("click", function (e) {
        res += "a";
      }, {last: true});
      try {
        h1.removeEventListener("click", function (e) {
          res += "a";
        }, {last: true});
        h1.addEventListener("click", function (e) {
          res += "b";
        }, {last: true});
      } catch (err) {
        res = "Error: only one last event listener can be added to a target for an event type at a time.";
      }


      h1.dispatchEvent(new MouseEvent("click"))

    },
    expect: function () {

      return res === "Error: only one last event listener can be added to a target for an event type at a time."
    }
  },
]


export const addEventListenerLastNested = [
  {
    name: "Several last listeners 2 levels",
    fun: function () {
      res = "";
      const h1 = document.createElement("h1");

      h1.addEventListener("click", function () {
        res += "a"
        h1.addEventListener("keypress", function (e) {
          res += "b"
        }, {last: true});
        h1.dispatchEvent(new KeyboardEvent("keypress"));
      }, {last: true});

      h1.dispatchEvent(new MouseEvent("click"))
    },
    expect: function () {
      return res === "ab"
    }
  },
  {
    name: "Several last listeners 3 levels",
    fun: function () {
      res = "";
      const h1 = document.createElement("h1");

      h1.addEventListener("click", function () {
        res += "a";
        h1.addEventListener("keypress", function (e) {
          res += "b";
          h1.addEventListener("keyup", function (e) {
            res += "c"
          }, {last: true});
          h1.dispatchEvent(new KeyboardEvent("keyup"));

        }, {last: true});
        h1.dispatchEvent(new KeyboardEvent("keypress"));
      }, {last: true});

      h1.dispatchEvent(new MouseEvent("click"))
    },
    expect: function () {
      // abc???
      return res === "abc"
    }
  },
  {
    name: "Remove nested listeners",
    fun: function () {
      res = "";
      const h1 = document.createElement("h1");


      h1.addEventListener("click", function () {
        res += "a";
        h1.removeEventListener("click", function (e) {
          res += "a";
        }, {last: true});
        h1.addEventListener("click", function () {
          res += "a";
        }, {last: true});

        h1.dispatchEvent(new KeyboardEvent("keypress"));
      }, {last: true});

      h1.dispatchEvent(new MouseEvent("click"))
    },
    expect: function () {
      // abc???
      return res === "abc"
    }
  },
]

