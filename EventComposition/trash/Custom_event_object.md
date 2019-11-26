# Custom event object

An Event object is simply named an event. It allows for signaling that something has occurred, e.g., that an image has 
completed downloading.


 ```javascript
  var event = new CustomEvent("custom-event", {bubbles: true, composed: true, detail: {foo: 1, bar: 2}});


let a = new Fo
```

In this example, `"custom-event"` is a custom type of event. The second parameter is an object with three properties:
1. `bubbles` : A Boolean indicating whether the event bubbles up through the DOM or not.
2. `composed` : A Boolean value indicating whether or not the event can bubble across the boundary between the shadow DOM and the regular DOM.
3. `detail` : a child object providing custom information about the event.




### Reference
* [Spec: Event](https://dom.spec.whatwg.org/#event)
