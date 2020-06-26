function singleH1() {
  let h1 = document.createElement("h1");
  let usecase = [
    h1
  ]
  Object.freeze(usecase, true);
  return usecase;
}


export const useCases = [{
  name: "possible values",
  values: [undefined, true, false, 1, null, "", "hello sunshine", [], 0],
  options: ["once", "last", "first", "capture", "bubbles", "unstoppable", "scoped"],
  makeDom: singleH1
}


];
Object.freeze(useCases, true);

