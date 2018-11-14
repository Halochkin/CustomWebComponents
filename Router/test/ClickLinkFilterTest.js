import {highjackLink} from "../../src/HashDotRouter.js"


const url = new URL("abc", document.baseURI).href;
const a = document.createElement("a");
a.id = "test";
document.body.appendChild(a);

describe("Working condition check", () => {
  it("Check the right link to be sure that wrong links will be skipped", () => {
    window.addEventListener("click1", e => {
      e.target.href = "abc";
      let abc = highjackLink(e, url);
      expect(abc).to.be.equal("http://localhost:63342/Router/test/ClickLinkFilter/abc");
    });
    a.dispatchEvent(new MouseEvent("click1", {bubbles: true, cancelable: true}));
  });
});

describe("skip all non-left single clicks", function () {

  it("e.button", function () {
    window.addEventListener("click2", e => {
      let abc = highjackLink(e, url);
      expect(abc).to.be.equal(undefined);
    });
    a.dispatchEvent(new MouseEvent("click2", {bubbles: true, cancelable: true, button: 1}));
  });
  it("e.metaKey", function () {
    window.addEventListener("click3", e => {
      let abc = highjackLink(e, url);
      expect(abc).to.be.equal(undefined);
    });
    a.dispatchEvent(new MouseEvent("click3", {bubbles: true, cancelable: true, metaKey: true}));
  });
  it("e.ctrlKey", function () {
    window.addEventListener("click4", e => {
      let abc = highjackLink(e, url);
      expect(abc).to.be.equal(undefined);
    });
    a.dispatchEvent(new MouseEvent("click4", {bubbles: true, ctrlKey: true}));
  });
  it("e.shiftKey", function () {
    window.addEventListener("click5", e => {
      let abc = highjackLink(e, url);
      expect(abc).to.be.equal(undefined);
    });
    a.dispatchEvent(new MouseEvent("click5", {bubbles: true, cancelable: true, shiftKey: true}));
  });
  it("e.defaultPrevented", function () {
    window.addEventListener("click6", e => {
      e.preventDefault();
      let abc = highjackLink(e, url);
      expect(abc).to.be.equal(undefined);
    });
    a.dispatchEvent(new MouseEvent("click6", {bubbles: true, cancelable: true}));
  });
});

describe("skip 'download' and 'external", () => {
  it("download attribute", () => {
    window.addEventListener("click7", e => {
      a.setAttribute("download", "file");
      let abc = highjackLink(e, url);
      expect(abc).to.be.equal(undefined);
      a.removeAttribute("download");
    });
    a.dispatchEvent(new MouseEvent("click7", {bubbles: true, cancelable: true}));
  });
  it("rel='external'", () => {
    window.addEventListener("click8", e => {
      a.setAttribute("rel", "external");
      let abc = highjackLink(e, url);
      expect(abc).to.be.equal(undefined);
      a.removeAttribute("rel");
    });
    a.dispatchEvent(new MouseEvent("click8", {bubbles: true, cancelable: true}));
  });
});

describe("skip '#...', 'mailto:...' and '' (empty)", () => {
  it("Href starts with a #", () => {
    window.addEventListener("click9", e => {
      e.target.href = "#abc";
      let abc = highjackLink(e, url);
      expect(abc).to.be.equal(undefined);
    });
    a.dispatchEvent(new MouseEvent("click9", {bubbles: true, cancelable: true}));
  });
  it("Href starts with a mailto:", () => {
    window.addEventListener("click10", e => {
      e.target.href = "mailto:me";
      let abc = highjackLink(e, url);
      expect(abc).to.be.equal(undefined);
    });
    a.dispatchEvent(new MouseEvent("click10", {bubbles: true, cancelable: true}));
  });
  it("Empty href", () => {
    window.addEventListener("click11", e => {
      e.target.href = "";
      let abc = highjackLink(e, url);
      expect(abc).to.be.equal(undefined);
    });
    a.dispatchEvent(new MouseEvent("click11", {bubbles: true, cancelable: true}));
  });
});

Promise.resolve().then(() => {
  document.body.removeChild(document.querySelector("#test"));
});
