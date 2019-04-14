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
  
  let startX = 0;
  
  function colorPicker() {
    return 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
  }
  
   window.addEventListener("swipe-start", e => {
    startX = e.pageX;                                                                             //[1]
  });

  window.addEventListener("swipe-stop", e => {
    let element = document.querySelector("#elem"); 
    let viewport = document.getElementById("viewport");
    if (Math.abs(startX - e.pageX;) < 50)                                                         //[2]
      return;
    element.style.transitionDuration = "0.8s";
    element.style.zIndex = "1";
    element.style.transform = e.detail.distX < 0 ? "rotate(15deg)" : "rotate(-15deg)";            //[3]
    element.style.marginLeft = e.detail.distX < 0 ? "-650px" : "650px";                           //[4]
    setTimeout(() => {                                                                            //[5]
      viewport.removeChild(element);                                                              //[6]
      let el = document.createElement("div");                                                     //[7]
      el.id = "elem";                                                                             //[8]
      el.transitionDuration = "1s";
      el.style.backgroundColor = colorPicker();                                                   //[9]
      viewport.appendChild(el);                                                                   //[10]
    }, 500);
  });
</script>
```

1. In order to add the minimum distance needed to activate the event, we first obtain the initial value. The minimum distance value is needed in order to prevent random slides from switching at a random touch.
2. Add a check if the distance between the initial and the last events is less than 50 - the switch will not occur
3. depending on the direction of the swipe, a positive or negative value will be obtained. Let's use them to determine the angle of rotation of the slide.
4. The same value is used to direct the slide switch.
5. Since we will add and remove slides, make a slight delay
6. After the slide is tilted and moved behind the viewport - remove it
7. And create the next slide element
8. Add an id to reapply css properties
9. I suggest using different colors to show that we can also add images if necessary
10. After that we add the created element to the DOM

Try [mouse](https://codepen.io/Halochkin/pen/XOgLVJ) or [touch](https://codepen.io/Halochkin/pen/NempKJ) version on codepen.io

### Reference
1. [MozSwipeGesture](https://developer.mozilla.org/en-US/docs/Web/Events/MozSwipeGesture)
