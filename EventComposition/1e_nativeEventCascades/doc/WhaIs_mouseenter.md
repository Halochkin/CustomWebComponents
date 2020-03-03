# WhatIs `mouseenter` / `mouseleave` .

The `mouseenter` event fires  when a pointing device is _moved onto_ the boundaries of an element or one of its children elements. It is activated only when the cursor is moved towards element which are _child_ of current target. 

 When page loaded and cursor is placed on element which have parents `mouseenter` event will fire on each parent element towards window element.

The `mouseleave` event fires when a pointing device is _moved off_ of the boundaries of an element and all of its children elements. It is activated only when the cursor is moved towards element which are _parent_ of current target. 

Both `mouseenter` and `mouseleave` events neither `cancelable` nor `bubbles` and exact location of the pointer inside the element or its children doesnt matter.

Also it both has `relatedTarget` property which returns the element related to the target element that triggered the mouse event. When a pointer leaves one element for another, one of them becomes `target`, and the other one – `relatedTarget`.

For `mouseenter`:

* `.target` – is the element where the pointer came over.
* `.relatedTarget` – is the element from which the pointer came (relatedTarget → target).

For `mouseleave` the reverse:

* `.target` – is the element that the pointer left.
* `.relatedTarget` – is the new under-the-pointer element, that pointer left for (target → relatedTarget).

#### The `.relatedTarget` property can be **`null`**.

 That’s normal and just means that the pointer came not from another element, but from out of the `window`. Or that it left the window.
 We should keep that possibility in mind when using `.relatedTarget` in our code. If we access `e.relatedTarget.tagName`, then there will be an error.

```html
<div id="outer">
    <div id='inner'>
        <div id='inner1'></div>
    </div>
</div>


<script>
  function log(type, target, relatedTarget) {
    console.log(type, "event:  cursor has been moved from ", relatedTarget ? relatedTarget : 'window', " to ", target);
  }

  document.querySelector('#outer').addEventListener("mouseenter", e => log(e.type, e.target, e.relatedTarget));
  document.querySelector('#outer').addEventListener("mouseleave", e => log(e.type, e.target, e.relatedTarget));
  document.querySelector('#inner').addEventListener("mouseenter", e => log(e.type, e.target, e.relatedTarget));
  document.querySelector('#inner').addEventListener("mouseleave", e => log(e.type, e.target, e.relatedTarget));
  document.querySelector('#inner1').addEventListener("mouseenter", e => log(e.type, e.target, e.relatedTarget));
  document.querySelector('#inner1').addEventListener("mouseleave", e => log(e.type, e.target, e.relatedTarget));
</script>
```

### What is a difference between `mouseenter`/`mouseleave` vs `mouseover`/`mouseout` ?

* `mouseover` / `mouseout` events triggers even when we go from the parent element to a child element. The browser assumes that the mouse can be only over one element at one time – the deepest one. 

* `mouseenter` / `mouseleave` event triggers when the mouse comes in and out the element as a whole. 
    1. `mouseleave` event is similar to `mouseout`, but differs in that does not bubble, and that it not dispatches until the pointing device has left the boundaries of the element and the boundaries of all of its children. An important feature of `mouseout`   triggers, when the pointer moves from parent to child. 
    2. `mouseenter` event is similar to `mouseover`, but differs in that it does not bubble, and not dispatches when the pointer device moves from an element onto the boundaries of one of its children elements.


### MouseEnterLeaveController.


```html
<style>
    #outer {
        height: 500px;
        width: 500px;
        background-color: yellow;
    }

    .pseudo_my_mouseenter {
        border: 2px solid green;
    }

    .pseudo_my_mouseleave {
        border: 2px solid red;
    }

    #inner1 {
        height: 300px;
        width: 300px;
        background-color: #21759b;
        position: relative;
        left: 100px;
        top: 100px;
    }

    #inner2 {
        height: 150px;
        width: 150px;
        background-color: #791329;
        position: relative;
        left: 75px;
        top: 75px;
    }


</style>

<div id="outer">
    <div id='inner1'>
        <div id='inner2'></div>
    </div>
</div>


<script>

  (function () {


      Object.defineProperties(HTMLDocument.prototype, {
          myMouseEnterElement: {
            get: function () {
              return this._myMouseEnterElement || this.body;
            },
            set: function (el) {
              this._myMouseEnterElement && this._myMouseEnterElement.classList.remove("pseudo_my_mouseleave", "pseudo_my_mouseenter");
              // this.myMouseEnterElement = el;
              el.classList.add("pseudo_my_mouseenter");
            }
          },
          myMouseLeaveElement: {
            get: function () {
              return this._myActiveElement || this.body;
            },
            set: function (el) {
              this._myActiveElement && this._myActiveElement.classList.remove("pseudo_my_mouseenter", "pseudo_my_mouseleave");
              // this._myActiveElement = el;
              el.classList.add("pseudo_my_mouseleave");
            }
          }
        }
      );


      //When mouse is located on inner HTML element when page finished to load we must to dispatch `mouseenter` event on target and ALL their parents till #document. We need to iterate it in reverse order so that is why we need this function and not iterate it directly inside controller.
      function getParentsNodes(element) {
        // push a target as first element.
        let arr = [element];
        while (element.parentNode) {
          element = element.parentNode;
          arr.unshift(element)
        }
        return arr;
      }

      // create event and define its `relatedTarget` property, it is unnecessary to define target, because we define event on particular node, so `target` attribute value adds automatically. But in some cases `relatedTarget` can be null (when we move mouse to alert() ao devtools
      function getEvent(name, target, relatedTarget) {
        let ev = new MouseEvent("my-mouse" + name);
        Object.defineProperty(ev, "relatedTarget", {
            value: relatedTarget ? relatedTarget : null
          }
        );
        return ev;
      }

      const MouseEnterLeaveController = {
        target: undefined,
        mousemove: function (e) {
          if (MouseEnterLeaveController.target && MouseEnterLeaveController.target !== e.target) {
            let mouseEnterEvent = getEvent("enter", e.target, MouseEnterLeaveController.target);
            let mouseLeaveEvent = getEvent("leave", MouseEnterLeaveController.target, e.target);

            //means that mouse moves towards child element. It can starts from <html>
            if (MouseEnterLeaveController.target.firstElementChild === e.target || MouseEnterLeaveController.target === document.documentElement) {
              document.myMouseEnterElement = e.target;
              e.target.dispatchEvent(mouseEnterEvent);

            }
            //means that mouse moves towards parent element
            else if (MouseEnterLeaveController.target.parentNode === e.target || getParentsNodes(e.target).length) {
              document.myMouseLeaveElement = e.target;
              MouseEnterLeaveController.target.dispatchEvent(mouseLeaveEvent);
            }
          }
            // hate this part of the code bu we must to implement this feature
          //  it must dispatch event on each element of the hierarchy,
          else if (!MouseEnterLeaveController.target) {
            for (let parent of getParentsNodes(e.target)) {
              let mouseEnterBubbleEvent = getEvent("enter", parent, undefined);
              parent.dispatchEvent(mouseEnterBubbleEvent)
            }
          }
          MouseEnterLeaveController.target = e.target;
        },

        mouseout: function (e) {
          //means that mouse is out of window
          if (!e.toElement) {
            let mouseLeaveEvent = new MouseEvent("my-mouseleave");
            setTimeout(() => {
              e.target.dispatchEvent(mouseLeaveEvent);
              MouseEnterLeaveController.target = null;
            }, 0)
          }
        }
      };


      window.addEventListener("mousemove", MouseEnterLeaveController.mousemove);
      // to detect whether mouse has been moved outside the window (to devtools for example)
      window.addEventListener("mouseout", MouseEnterLeaveController.mouseout);


      function log(type, target, relatedTarget) {
        console.log(type, "event:  cursor has been moved from ", relatedTarget, " to ", target);
      }

      function warn(type, target, relatedTarget) {
        console.warn(type, "event:  cursor has been moved from ", relatedTarget, " to ", target);
      }

      document.querySelector('#outer').addEventListener("mouseenter", e => log(e.type, e.target, e.relatedTarget));
      document.querySelector('#outer').addEventListener("mouseleave", e => log(e.type, e.target, e.relatedTarget));
      document.querySelector('#outer').addEventListener("my-mouseenter", e => warn(e.type, e.target, e.relatedTarget));
      document.querySelector('#outer').addEventListener("my-mouseleave", e => warn(e.type, e.target, e.relatedTarget));


      document.querySelector('#inner1').addEventListener("mouseenter", e => log(e.type, e.target, e.relatedTarget));
      document.querySelector('#inner1').addEventListener("mouseleave", e => log(e.type, e.target, e.relatedTarget));
      document.querySelector('#inner1').addEventListener("my-mouseenter", e => warn(e.type, e.target, e.relatedTarget));
      document.querySelector('#inner1').addEventListener("my-mouseleave", e => warn(e.type, e.target, e.relatedTarget));


      document.querySelector('#inner2').addEventListener("mouseenter", e => log(e.type, e.target, e.relatedTarget));
      document.querySelector('#inner2').addEventListener("mouseleave", e => log(e.type, e.target, e.relatedTarget));
      document.querySelector('#inner2').addEventListener("my-mouseenter", e => warn(e.type, e.target, e.relatedTarget));
      document.querySelector('#inner2').addEventListener("my-mouseleave", e => warn(e.type, e.target, e.relatedTarget));


      document.documentElement.addEventListener("mouseenter", e => log(e.type, e.target, e.relatedTarget));
      document.addEventListener("mouseenter", e => log(e.type, e.target, e.relatedTarget));

      document.documentElement.addEventListener("my-mouseenter", e => warn(e.type, e.target, e.relatedTarget));
      document.addEventListener("my-mouseenter", e => warn(e.type, e.target, e.relatedTarget));
      window.addEventListener("mouseleave", e => log(e.type, e.target, e.relatedTarget));
      window.addEventListener("my-mouseleave", e => log(e.type, e.target, e.relatedTarget));
    }

  )
  ();
</script>



```


the mouseenter mouseout events primarily does two things. it dispatches events, and it adds the :hover css pseudo class.
the difficult thing about mouseout and mouseenter is to calculate the hittarget for the mouse pointer. to do this, we need to
1) have the coordinates of the mousepointer which is easy, because we get those every time the mouse moves.
2) we need to look through the dom, bottom up, to find the element with the corresponding area that lies underneath the mousepointer. When we mirror this, we need to make several simplifications. We need to disregard z-index i think, and only look at tree order. when we do that, we search the DOM bottom-right first. The first hit target from bottom right that has a hit under the mousepointer, would be the hit target. When we disregard z-index and other. the algorithm for calculating hit target in the DOM needs research.
3) we would also need to evaluate if this calculation should be dynamic upon DOM mutations. if the DOM moves so it comes under the mousepointer, does :hover then update itself?
4) if the DOM element with :hover moves in the DOM away from the child element, should that remove the :hover pseudo-class? yes, i think it should. To accomplish this, all the :hover parents' parents must be observed using MutationObserver
this is it. The rest is learning about the sync non-sync timing of the mouseenter and mouseout and mouseover events. Do they dispatch sync after mousemove? mouseout before mouseenter? can we trigger them from script? probably not..
and adding the pseudo class. first, all the elements with the pseudo class removes the pseudoclass, then the hittarget, and all its ancestors are given a pseudo class.
3) no.. it is if the element changes its on screen location. if a script alters its or another elements style or DOM presence so the element moves. So we would have to check this after every layout. It would be a resizeObserver style callback. except that we would need not only the size, but the position. The simplest way to do this, would be to use a polling and checking the getClientBoundingRect manually.


