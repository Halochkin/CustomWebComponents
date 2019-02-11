# Event: `swipe`

## `swipe` events and their attributes and properties/custom methods

1. `swipe`: will trigger the following events from the element:
   * `swipe-start`
   * `swipe-move`
   * `swipe-end`
   * `swipe-cancel`
   
The following properties are available on the different dragging events:

1. `pageX` : `swipe-start`, `swipe-move`, `swipe-end`, `swipe-cancel`
2. `pageY` : `swipe-start`, `swipe-move`, `swipe-end`, `swipe-cancel`
3. `swipe()` : `swipe-end`

`swipe()` includes the following custom details:
1. `swipeStart`: the event that started the swipe gesture
2. `distX` : horizontal distance between the first and the last swipe gesture events
3. `distY` : vertical distance
4. `distDiag` : diagonal distance
5. `durationMs`: duration of the swipe event
6. `angle` : angle of the moving

## Example 1: Slider
Consider an example of a popular dating dating application based on a `swipe-end` event.
```html
<div swipe id="viewport">
    <div id="elem"></div>
</div>

<script>
  function colorPicker() {
    return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
  }

  window.addEventListener("swipe-stop", e => {
    let element = document.querySelector("#elem"); 
    let viewport = document.getElementById("viewport");
    element.style.transitionDuration = "0.8s";
    element.style.zIndex = "1";
    element.style.transform = e.detail.distX < 0 ? "rotate(15deg)" : "rotate(-15deg)";            //[1]
    element.style.marginLeft = e.detail.distX < 0 ? "-650px" : "650px";                           //[2]
    setTimeout(() => {                                                                            //[3]
      viewport.removeChild(element);                                                              //[4]
      let el = document.createElement("div");                                                     //[5]
      el.id = "elem";                                                                             //[6]
      el.transitionDuration = "1s";
      el.style.backgroundColor = colorPicker();                                                   //[7]
      viewport.appendChild(el);                                                                   //[8]
    }, 500);
  });
</script>
```
1. depending on the direction of the swipe, a positive or negative value will be obtained. Let's use them to determine the angle of rotation of the slide.
2. The same value is used to direct the slide switch.
3. Since we will add and remove slides, make a slight delay
4. After the slide is tilted and moved behind the viewport - remove it
5. And create the next slide element
6. Add an id to reapply css properties
7. I suggest using different colors to show that we can also add images if necessary
8. After that we add the created element to the DOM

Try [mouse](https://codepen.io/Halochkin/pen/XOgLVJ) or [touch](https://codepen.io/Halochkin/pen/NempKJ) version on codepen.io

### Reference
1. [MozSwipeGesture](https://developer.mozilla.org/en-US/docs/Web/Events/MozSwipeGesture)
