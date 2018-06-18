//!! depends on:
//https://cdn.jsdelivr.net/npm/marked/marked.min.js
export class Polyfill extends HTMLElement {
  /** Polyfill code **/
//Setup: declare the function for loading script sync
  function loadScriptSync(url, onAsyncLoadAsString) {
    var newScript = document.createElement('script');
    newScript.src = url;
    onAsyncLoadAsString && newScript.setAttribute("onload", onAsyncLoadAsString);
    document.write(newScript.outerHTML);
  }

  //Setup: add methods for pausing customElements polyfill
  window.WebComponents = window.WebComponents || {};
  window.WebComponents.stopCEPolyfill = function () {
    if (window.customElements && customElements.polyfillWrapFlushCallback) {
      customElements.polyfillWrapFlushCallback(function () {
      });
    }
  };
  window.WebComponents.startCEPolyfill = function () {
    if (window.customElements && customElements.polyfillWrapFlushCallback) {
      customElements.polyfillWrapFlushCallback(function (flush) {
        flush();
      });
      customElements.upgrade(document);
    }
  };
  //step 1: feature detection
  var CE = window.customElements;
  var SD = 'attachShadow' in Element.prototype && 'getRootNode' in Element.prototype;
  var ES6 = window.Promise && Array.from && window.URL && window.Symbol;
  var TE = !(function () {
    // no real <template> because no `content` property (IE and older browsers)
    var t = document.createElement('template');
    if (!('content' in t)) {
      return true;
    }
    // broken doc fragment (older Edge)
    if (!(t.content.cloneNode() instanceof DocumentFragment)) {
      return true;
    }
    // broken <template> cloning (Edge up to at least version 17)
    var t2 = document.createElement('template');
    t2.content.appendChild(document.createElement('div'));
    t.content.appendChild(t2);
    var clone = t.cloneNode(true);
    return clone.content.childNodes.length === 0 ||
      clone.content.firstChild.content.childNodes.length === 0;
  })();
  //step 2: load polyfill async based on feature detection
  const base = "https://rawgit.com/webcomponents/webcomponentsjs/master/bundles/";
  if (CE && SD && TE && ES6) {                                                          //[1]
} else if (!CE && SD && TE && ES6) {
  loadScriptSync(base + "webcomponents-ce.js", "WebComponents.stopCEPolyfill();");
} else if (!CE && !SD && TE && ES6) {
  loadScriptSync(base + "webcomponents-sd-ce.js", "WebComponents.stopCEPolyfill();");
} else { /*if (!CE && !SD && !TE && !ES6) {*/
  loadScriptSync(base + "webcomponents-sd-ce-pf.js",
    "HTMLTemplateElement.bootstrap(document); WebComponents.stopCEPolyfill();");
}
//step 3: restart the customElements polyfill on DOMContentLoaded
window.addEventListener("DOMContentLoaded", function () {
  WebComponents.startCEPolyfill();
});

}

customElements.define("mark-down", Polyfill);
