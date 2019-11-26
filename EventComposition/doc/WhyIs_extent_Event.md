# Why is extend event




Event data/details should:
X. Events should extend Event, not be new CustomEvent.
1. Be added directly to the evemt object. Not be added in a details prop, as it deviates from most commonly used native events and produces unnecessary fluff in the api.
2. Be immutable. Listeners for the event SHOULD NOT!! be able to mutate data on the event. They listen, they do not write. To enforce this, event object should be frozen before dispatch.
3. When you need to set properties on an evemt, such as when you control feedback, the property is a setter function that will operate on a global property in the sif. It is a method, a gateway to the events global property,not data on the event. All data on the event should be frozen/immutable.
4. Data likely to be mutated during event propagation should be associated with the target element or the window/document element in the dom.