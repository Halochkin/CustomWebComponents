## `touchover` / `touchleave` composed event
As you know, there are many ways to change the styles of an element when hovering. But unfortunately they are all created for the mouse. But what about touch events? Why are they ignored? In order to restore justice, a `touch-hover` composed event was created. 

Presented function implements two composed events:
* `touch-hover` - is activated whenever a touch point or mouse appears over the item.
* `touch-cancel` - is activated whenever a touch point or mouse leaves the item.
* `click` - will dispatch a "click" event on the element if the user lifts his touch finger on that element.

These events based on `touchstart`, `touchmove` and `touchend` events. In order to get the element over which the movement occurs, using `.elementFromPoint(touch.clientX, touch.clientY)` method, which returns the element at the specified coordinates (relative to the viewing window). 

There are two custom attributes to control events:
1. `touch-hover` - indicates that `touch-hover` event will occur when a touch point hover element.
2. `touch-hover="click"` - when lifting the touch point, `click` event will be activated (convenient for elements with references)

### Implementation
```javascript
(function () {

    var prevTarget = undefined;
    var relatedTarget = undefined;
    var initialUserSelect = undefined;

    function findParentWithAttribute(node, attName) {                  
      for (var n = node; n; n = (n.parentNode || n.host)) {
        if (n.hasAttribute && n.hasAttribute(attName))
          return n;
      }
      return undefined;
    }

    function dispatchTouchHover(target, enter, name) {                
      if (target) {
        setTimeout(function () {
          var detail = {enter: enter, leave: !enter};                          //[4a]
          target.dispatchEvent(new CustomEvent("touch-" + name, {bubbles: true, composed: true, detail}));
        }, 0);
      }
    }

    function getTarget(e) {                                                     //[3a] 
      var pos = (e.touches && e.touches.length) ? e.touches[0] : e;
      var target = document.elementFromPoint(pos.clientX, pos.clientY);
      return findParentWithAttribute(target, "touch-hover");                    //[3b]
    }

    function onTouchmove(e) {                                                  
      e.preventDefault();                                                        //[3]
      e.stopPropagation();
      let touchHoverTarget = getTarget(e);                                      
      if (!touchHoverTarget || touchHoverTarget === relatedTarget)               //[3c]
        return;
      dispatchTouchHover(relatedTarget, false, "hover");                         //[4]
      dispatchTouchHover(touchHoverTarget, true, "hover");                      
      relatedTarget = touchHoverTarget;
    }

    function init(e) {                                                           //[1a]
      e.touches.length === 1 ? start(e) : end(e);
    }

    function start(e) {                                               
      if (getTarget(e)){                                                         //[2]
        document.addEventListener("touchmove", onTouchmove, {passive: false});   //[2a]
        initialUserSelect = document.children[0].style.userSelect;               //[2b]
        document.children[0].style.userSelect = "none";                          //[2c]
        }
    }

    function end(e) {
      document.children[0].style.userSelect = initialUserSelect;                //[5]
      document.removeEventListener("touchmove", onTouchmove);
      prevTarget = undefined;
      if (relatedTarget) {
        dispatchTouchHover(relatedTarget, false, "cancel");                      //[5a]
        var clickMe = relatedTarget;
        if (relatedTarget.getAttribute("touch-hover") === "click") {
          setTimeout(function () {
            clickMe.click();                                                     //[5b]
          }, 0);
        }
        relatedTarget = undefined;
        initialUserSelect = undefined;
      }
    }

    function cancel() {                                                          //[6]
      end();
      if (relatedTarget)
        dispatchTouchHover(relatedTarget, true, "cancel");
    }

    document.addEventListener("touchend", init);                                 //[1]
    document.addEventListener("touchstart", init);
    window.addEventListener("blur", cancel);
  })();
```
1. Adding basic event listeners.<br>
1a. Touch-hover event is a single finger event, and cannot be activated by two or more fingers.
2. Check whether the touch-start event starts on the target, with the `touch-hover` attribute. To avoid scrolling prevention, 
if the event starts from another node. <br>
2a. If  `touchstart` event occurs on element with a `touch-hover` attribute, an event listener will be added to the touchmove event.<br>
2b. In order to prevent accidental selection of text, this feature will be temporarily disabled when the touch point is moved. But in order to avoid conflicts with the CSS property `userSelect` , we temporarily save its value (which was at the moment of activation of the `mousemove` event) in the variable 'initialUserSelect' to restore it after the end of the `touch-hover` event. <br>
2c. And turn it off, on the `document.children[0]` node.
3. If you try to move the touch point, scrolling will be automatically activated, which will prevent you from hovering. Therefore, we will disable the default event action.<br>
3a. When `touchmove` event are activated, the same check as was in the start event will be made. This is necessary to switch the active element when moving the touch point over new element. (This means that the element that was activated with start event will be active until the touch point will be over the new element with `touch-hover` attribute).<br>
3b. The `findParentWithAttribute` function checks if there is a `touch-hover` attribute on the element.
3c. Since the `touchmove` event will be activated several times, we will not define the `touch-hover` event each time. It will be define when touch point will be over new suitable element.
4. The event will be defined for the active and previous element.<br>
4a. In order to use one event listener for the element to which the touch point was hover and from which it was removed, the details are used. For the element on which the touch point hover, details will be defined as {enter: true, leave: false}. Accordingly, the element from which the touch point was removed to the new one: {enter: false, leave: true}.
5. Restores the css property `userSelect` to the state that was before the start of the event, using the value of the variable `initialUserSelect`.<br>
5a. In order to make it possible to restore new properties (e.g. change of style) after deactivating `touch-hover` event, `touch-cancel` event will be defined.<br>
5b. If touch-hover="click" attribute was set, then after deactivating the `touch-hover` event, click() will be done with minimal delay.
6. The `cancel` function is based on the `blur` event and will be called in case of alerting or loss of focus. First of all, it will call the `end` function (to restore the css property `userSelect` and delete the event listener 'touchmove') and then dispatch the 'touch-cancel' event.
<hr>
Both `touch-hover` and `touch-cancel` events are bubbles, so the event listener can be attached to the window.
```javascript
 window.addEventListener("touch-hover", function (e) {
   //stuff here
});
  
window.addEventListener("touch-cancel", function (e) {
   // other stuff here
});

window.addEventListener("click", (e) => {
   // if touch-hover="click" attribute was added, or will be done manually
  });
```

### Example
Let's consider a simple example that changes the background colors when hovering the mouse or touch point.
```html
<script src="https://unpkg.com/touchover@1.0.0/src/touchover.js"></script>

<a touch-hover="click" href="https://www.bbc.com/news">What's new?</a>  //[1]
<h1 touch-hover="click">touchover too</h1>
<h1 touch-hover="click">I am touchover too</h1>
<h1 touch-hover>touchover again</h1>                                    //[2]
<h1>I will not touchover</h1>                                           //[3]

<script>
    window.addEventListener("touch-hover", function (e) {
    if (e.detail.enter)                                                 //[4]
      e.target.style.backgroundColor = "red";
    if (e.detail.leave)                                                 //[5]
      e.target.removeAttribute("style");
  });

  window.addEventListener("touch-cancel", function (e) {
    e.target.removeAttribute("style");                                  //[6]
  });
 
  window.addEventListener("click", (e) => {
    e.target.removeAttribute("style");                                  //[6а]
  });
</script>
```
***
1. It is necessary to add `touch-hover="click"` attribute for elements, after hover of which the automatic click() will be activated when removing the touch point.
2. If there is no need to automatically click(), then an empty `touch-hover` attribute must be inserted.
3. Make sure the event doesn't work without an attribute.
4. Since the event listener is attached to the global scope and the composed events are defined separately for each element. We will change the style settings using details. For elements with hover touch point (enter: true, leave: false) we add red background color.
5. For the elements from which the touch point was removed, we will remove the background color by removing the style attribute.
6. We can do the same when other events will be active.

Try it on [codepen](https://codepen.io/Halochkin/pen/YMMooY).

### Discussion
#### 1.Should touch and mouse have different cancel events?
Yes, definitely, because we can't initiate `cancel-event` if the touch point goes beyond the scope of the document, but we can do it for the mouse. For the event mouse, there are several events that can be used to cancel (`mouseleave`, `mouseout`).

#### Is it better/necessary for performance to initiate the cancel event listeners from within a touch or mouse gesture? Or can it be global and independent? (ie. is it a penalty for always listening for blur?)



### Reference 
1. [MDN: .elementFromPoint(x, y)](https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementFromPoint)
2. [MDN: Event.target](https://developer.mozilla.org/en-US/docs/Web/API/Event/target)
