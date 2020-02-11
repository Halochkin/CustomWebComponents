# Problem: Async vs sync event propagation

When the browser dispatches native events, it will queue the event listeners in the event loop. Or. It will queue them in what would conceptually be *the top-most prioritized* macrotask queue in the event loop, but still a queue that would have lower priority than the microtask queue.

When a script dispatches an event to a target, these events are run synchronously. The browser simply loops through each task. But. The browser will handle and catch any errors that occur during each event listener callback, and will ensure that errors in an early event listener will not block the running of later event listeners.

Examples of triggering event listeners triggered via scripts:
 * `el.click()`, 
 * `dispatchEvent(new MouseEvent("click", {bubbles: true}))`, and
 * `dispatchEvent(new CustomEvent("my-event"))`.

## Demo: Sync vs async `click` propagation   

```html
<div id="outer">
  <h1 id="inner">Click on me!</h1>
</div>

<script>
  function log(e) {
    const thisTarget = e.currentTarget.id;
    console.log(e.type + " on #" + thisTarget);
    Promise.resolve().then(function() {
      console.log("microtask from #" + thisTarget);
    });
  }
  
  function log2(e){
    log(e);
  }

  const inner = document.querySelector("#inner");
  const outer = document.querySelector("#outer");
  
  inner.addEventListener("click", log);
  inner.addEventListener("click", log2);
  outer.addEventListener("click", log);

  inner.dispatchEvent(new MouseEvent("click", {bubbles: true}));
</script>
```

When you `click` on "Click on me!" using either mouse or touch, then you will see the following result printed out in the console.

```

1. click on #inner
2. click on #inner
3. click on #outer
4. microtask from #inner
5. microtask from #inner
6. microtask from #outer

7.  click on #inner
8.  microtask from #inner
9.  click on #inner
10. microtask from #inner
11. click on #outer
12. microtask from #outer

``` 

 * Lines 1-6 is the output from `.dispatchEvent(new MouseEvent("click", {bubbles: true}))` on the "Click on me!" element. All three event listeners are run *before* any of the tasks added to the microtask queue.
 
 * Lines 7-12 is the output from the "native" reaction to the user action of clicking on "Click on me!" with either mouse or touch. Here, the tasks added to the microtask queue are run *before* the next event listener.
 
## Problem

The main challenge with the async vs sync dispatch is that in an event listener, you cannot assume that tasks queued in the microtask queue will run before or after the next event listener in the event propagation path, unless you know that no all instances of that event will either be triggered by the browsers native, async dispatch function or via scripts sync event dispatch functions. The problem is, you do not know the exact order of the queue, from within an event listener.

## Implementation of async event propagation function

There are some snags when simulating an async `dispatchEvent` function. We begin by letting the code speak for itself. First, event listeners can be added dynamically. This means that the we cannot at the outset of the event listener function queue all tasks: the only thing that is fixed at the outset is the propagation path. Thus, we must queue a task to process each element in the target chain. 

```javascript
function callListenerAsync(event, currentTarget, listener){
  Object.defineProperty(event, "currentTarget", {value: currentTarget, writable: true});
  if (event._propagationStoppedImmediately)
    return;
  if (!currentTarget.hasEventListener(event.type, listener))
    return;
  try {
    listener.cb(event);
  } catch (err) {
    const error = new ErrorEvent(
      'error',
      {error: err, message: 'Uncaught Error: event listener break down'}
    );
    dispatchEvent(window, error);
    if (!error.defaultPrevented)
      console.error(error);
  }
}                 

function callListenersOnElementAsync(currentTarget, event, phase) {
  if (event._propagationStopped || event._propagationStoppedImmediately)
    return;
  if (phase === Event.BUBBLING_PHASE && (event.cancelBubble || !event.bubbles))
    return;
  if (event.cancelBubble)
    phase = Event.CAPTURING_PHASE;
  const listeners = currentTarget.getEventListeners(event.type, phase);
  for (let listener of listeners)
    toggleTick(callListenerAsync.bind(null, event, currentTarget, listener)); 
}                 

function dispatchEventAsync(target, event) {
  const propagationPath = getComposedPath(target, event).slice(1);
  Object.defineProperty(event, "target", {
    get: function () {
      let lowest = target;
      for (let t of propagationPath) {
        if (t === this.currentTarget)
          return lowest;
        if (t instanceof DocumentFragment && t.mode === "closed")
          lowest = t.host || lowest;
      }
    }
  });
  Object.defineProperty(event, "stopPropagation", {
    value: function () {
      this._propagationStopped = true;
    }
  });
  Object.defineProperty(event, "stopImmediatePropagation", {
    value: function () {
      this._propagationStoppedImmediately = true;
    }
  });
  for (let currentTarget of propagationPath.slice().reverse())
    setTimeout(callListenersOnElementAsync.bind(null, currentTarget, event, Event.CAPTURING_PHASE));
  setTimeout(callListenersOnElementAsync.bind(null, target, event, Event.AT_TARGET));
  for (let currentTarget of propagationPath)
    setTimeout(callListenersOnElementAsync.bind(null, currentTarget, event, Event.BUBBLING_PHASE));
}
```

To get a que with a higher priority than setTimeout, we use the ToggleTickTrick.

## Demo: all completed!

```html
<script>
  function matchEventListeners(funA, optionsA, funB, optionsB) {
    if (funA !== funB)
      return false;
    const a = optionsA === true || (optionsA instanceof Object && optionsA.capture === true);
    const b = optionsB === true || (optionsB instanceof Object && optionsB.capture === true);
    return a === b;
  }

  const ogAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (name, cb, options) {
    this._eventListeners || (this._eventListeners = {});
    this._eventListeners[name] || (this._eventListeners[name] = []);
    const index = this._eventListeners[name]
      .findIndex(cbOptions => matchEventListeners(cbOptions.cb, cbOptions.options, cb, options));
    if (index >= 0)
      return;
    ogAdd.call(this, name, cb, options);
    this._eventListeners[name].push({cb, options});
  };

  const ogRemove = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.removeEventListener = function (name, cb, options) {
    if (!this._eventListeners || !this._eventListeners[name])
      return;
    const index = this._eventListeners[name]
      .findIndex(cbOptions => matchEventListeners(cbOptions.cb, cbOptions.options, cb, options));
    if (index === -1)
      return;
    ogRemove.call(this, name, cb, options);
    this._eventListeners[name].splice(index, 1);
  };

  EventTarget.prototype.getEventListeners = function (name, phase) {
    if (!this._eventListeners || !this._eventListeners[name])
      return [];
    if (phase === Event.AT_TARGET)
      return this._eventListeners[name].slice();
    if (phase === Event.CAPTURING_PHASE) {
      return this._eventListeners[name]
        .filter(listener => listener.options === true || (listener.options && listener.options.capture === true));
    }
    //(phase === Event.BUBBLING_PHASE)
    return this._eventListeners[name]
      .filter(listener => !(listener.options === true || (listener.options && listener.options.capture === true)));
  };

  EventTarget.prototype.hasEventListener = function (name, listener) {
    return this._eventListeners && this._eventListeners[name] && (this._eventListeners[name].indexOf(listener) !== -1);
  };

  function getComposedPath(target, event) {
    const path = [];
    while (true) {
      path.push(target);
      if (target.parentNode)
        target = target.parentNode;
      else if (target.host) {
        if (!event.composed)
          return path;
        target = target.host;
      } else {
        break;
      }
    }
    path.push(document, window);
    return path;
  }

  function callListenersOnElement(currentTarget, event, phase) {
    if (event._propagationStopped || event._propagationStoppedImmediately)
      return;
    if (phase === Event.BUBBLING_PHASE && (event.cancelBubble || !event.bubbles))
      return;
    if (event.cancelBubble)
      phase = Event.CAPTURING_PHASE;
    const listeners = currentTarget.getEventListeners(event.type, phase);
    Object.defineProperty(event, "currentTarget", {value: currentTarget, writable: true});
    for (let listener of listeners) {
      if (event._propagationStoppedImmediately)
        return;
      if (!currentTarget.hasEventListener(event.type, listener))
        continue;
      try {
        listener.cb(event);
      } catch (err) {
        const error = new ErrorEvent(
          'error',
          {error: err, message: 'Uncaught Error: event listener break down'}
        );
        dispatchEvent(window, error);
        if (!error.defaultPrevented)
          console.error(error);
      }
    }
  }

  function dispatchEvent(target, event) {
    const propagationPath = getComposedPath(target, event).slice(1);
    Object.defineProperty(event, "target", {
      get: function () {
        let lowest = target;
        for (let t of propagationPath) {
          if (t === this.currentTarget)
            return lowest;
          if (t instanceof DocumentFragment && t.mode === "closed")
            lowest = t.host || lowest;
        }
      }
    });
    Object.defineProperty(event, "stopPropagation", {
      value: function () {
        this._propagationStopped = true;
      }
    });
    Object.defineProperty(event, "stopImmediatePropagation", {
      value: function () {
        this._propagationStoppedImmediately = true;
      }
    });
    for (let currentTarget of propagationPath.slice().reverse())
      callListenersOnElement(currentTarget, event, Event.CAPTURING_PHASE);
    callListenersOnElement(target, event, Event.AT_TARGET);
    for (let currentTarget of propagationPath)
      callListenersOnElement(currentTarget, event, Event.BUBBLING_PHASE);
  }

  /*ASYNC*/

  function toggleTick(cb) {
    const details = document.createElement("details");
    details.style.display = "none";
    details.ontoggle = function () {
      details.remove();
      cb();
    };
    document.body.appendChild(details);
    details.open = true;
  }

  function callListenerAsync(event, currentTarget, listener){
    Object.defineProperty(event, "currentTarget", {value: currentTarget, writable: true});
    if (event._propagationStoppedImmediately)
      return;
    if (!currentTarget.hasEventListener(event.type, listener))
      return;
    try {
      listener.cb(event);
    } catch (err) {
      const error = new ErrorEvent(
        'error',
        {error: err, message: 'Uncaught Error: event listener break down'}
      );
      dispatchEvent(window, error);
      if (!error.defaultPrevented)
        console.error(error);
    }
  }

  function callListenersOnElementAsync(currentTarget, event, phase) {
    if (event._propagationStopped || event._propagationStoppedImmediately)
      return;
    if (phase === Event.BUBBLING_PHASE && (event.cancelBubble || !event.bubbles))
      return;
    if (event.cancelBubble)
      phase = Event.CAPTURING_PHASE;
    const listeners = currentTarget.getEventListeners(event.type, phase);
    for (let listener of listeners)
      toggleTick(callListenerAsync.bind(null, event, currentTarget, listener)); 
  }


  function dispatchEventAsync(target, event) {
    const propagationPath = getComposedPath(target, event).slice(1);
    Object.defineProperty(event, "target", {
      get: function () {
        let lowest = target;
        for (let t of propagationPath) {
          if (t === this.currentTarget)
            return lowest;
          if (t instanceof DocumentFragment && t.mode === "closed")
            lowest = t.host || lowest;
        }
      }
    });
    Object.defineProperty(event, "stopPropagation", {
      value: function () {
        this._propagationStopped = true;
      }
    });
    Object.defineProperty(event, "stopImmediatePropagation", {
      value: function () {
        this._propagationStoppedImmediately = true;
      }
    });
    for (let currentTarget of propagationPath.slice().reverse())
      setTimeout(callListenersOnElementAsync.bind(null, currentTarget, event, Event.CAPTURING_PHASE));
    setTimeout(callListenersOnElementAsync.bind(null, target, event, Event.AT_TARGET));
    for (let currentTarget of propagationPath)
      setTimeout(callListenersOnElementAsync.bind(null, currentTarget, event, Event.BUBBLING_PHASE));
  }

</script>

<div id="outer">
  <h1 id="inner">Click on me!</h1>
</div>

<script>
  function log(e) {
    const thisTarget = e.currentTarget.id;
    console.log(e.type + " on #" + thisTarget);
    Promise.resolve().then(function() {
      console.log("microtask from #" + thisTarget);
    });
  }

  function log2(e){
    log(e);
  }

  const inner = document.querySelector("#inner");
  const outer = document.querySelector("#outer");

  inner.addEventListener("click", log);
  inner.addEventListener("click", log2);
  outer.addEventListener("click", log);

  dispatchEvent(inner, new MouseEvent("click", {bubbles: true}));
  dispatchEventAsync(inner, new MouseEvent("click", {bubbles: true}));
</script>
```                        

## todo 

minor details:
* add the event.phase property.

## References

 * [MDN: sync vs async event listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent#Notes)