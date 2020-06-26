import {useCases} from "./useCaseOptions.js";


let res;

function result() {
  return res;
}

const expect = "";

function makeListenerOptionsTest(usecase, values, options) {
  console.log("1");
  return function listenerOptionsTest() {

    console.log("2");
    res = "";

    const usecaseFlat = usecase.flat(Infinity);

    for (let target of usecaseFlat) {

      for (let option of options) {

        for (let value of values) {
          console.warn("---- value");
          let opts = {};
          opts[option] = value;
          usecaseFlat[0].addEventListener("click", function () {
            if (option === "once")
              return res += "1";
            else if (option === "first")
              return res += "0";
            // something like this
            return res += "+";

          }, opts);
          target.dispatchEvent(new Event("click"));
          if (option === "once")
            target.dispatchEvent(new Event("click"));
        }
      }
    }

  }
}


export const testListenerOption = useCases.map(usecase => {
  const usecaseDom = usecase.makeDom();
  const usecaseValues = usecase.values;
  const usecaseOptions = usecase.options;
  return {
    name: "eventListenerOptionsTest: " + usecase.name,
    fun: makeListenerOptionsTest(usecaseDom, usecaseValues, usecaseOptions),
    expect,
    result
  };
});
