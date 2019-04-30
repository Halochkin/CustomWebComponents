## `touchover` / `touchleave` composed event
As you know, there are many ways to change the styles of an element when hovering. But unfortunately they are all created for the mouse. But what about touch events? Why are they ignored? In order to restore justice, a `touchover` composed event was created. 
### Description
Presented function implements two composed events:
* `touchover` - is activated whenever a touch point or mouse appears over the item.
* `touchleave` - is activated whenever a touch point or mouse leaves the item.

To implement both events, the element must have a *`touchover`* attribute.

These events can be activated by:
1. `touch events` - which is based on `touchstart`, `touchmove` and `touchend` events. In order to get the element over which the movement occurs, using `.elementFromPoint(touch.clientX, touch.clientY)` method, which returns the element at the specified coordinates (relative to the viewing window). 
2. `mouse events` - which is based on `mouseover` and `mouseout` events. It allows get the event target using only event properties.
### Implementation
These events bubbles, so the event listener can be attached to the window.
```javascript
 window.addEventListener("touchover", function (e) {
   //stuff here
});
  
window.addEventListener("touchleave", function (e) {
   // other stuff here
});
```
### Example
Let's consider a simple example that changes the background colors when hovering the mouse or touch point.
```html
<script src="https://unpkg.com/touchover@1.0.0/src/touchover.js"></script>

<h1 touchover>touchover</h1>                              //[1]
<h1 touchover>touchover too</h1>
<h1>I will not touchover</h1>                             //[2]
<h1 touchover>I am touchover too</h1>

<script>
  window.addEventListener("touchover", function (e) {     //[3]
    e.target.style.backgroundColor = "lightgreen";        //[4]
  });
  window.addEventListener("touchleave", function (e) {
    e.target.style.backgroundColor = "";
  });
</script>
```
***
1. Each item must be marked with touchover attribute.
2. Let's see what happens if we don't mark them.
3. As mentioned earlier, the event listener can be attached to the window, not to each individual element.
4. A single element can be obtained as a target of an event.

Try it on [codepen](https://codepen.io/Halochkin/pen/YMMooY).

### Reference 
1. [.elementFromPoint(x, y)](https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementFromPoint)
