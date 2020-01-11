
# Default action delay after wheel event
As we know wheel event fires when a mouse wheel has been rotated around any axis, or when an equivalent input device
(such as a mouse-ball, certain tablets or touchpads, etc.) has emulated such an action.
The feature of the wheel event is that it occurs before the default action. For example, if you want to get the number
of pixels on which an item has been scrolled you will get 0. This is BECAUSE the default action was not done.
If you reactivate the wheel event and try to get the value again, you will get the value of the previous scrolling action.

But is there really no way to get the value of the element scroll in one wheel event, but to use a sequence of
scroll events and sum up their value?  The answer to this question is quite controversial.

`Average value of item scrolling for wheel event in different browsers is different (100px - Chrome, 106 - Firefox, 75 - Edge).`

In order to solve this problem we need to add a delay for the browser to do the default action and then get
the scroll value of the item.

### Demo
Let's look at the demo below.

Here we use 3 methods.

1. Log the data without delay to show you that we cannot get the item scroll value because the default action was not done.

2. Using delay by moving callback function to the end of the event loop, which automatically makes the delay. Unfortunately, 
the delay is not long enough for the browser to perform the default action.

3. Good old `setTimeout()`. This method allows us to add any delay, but we do not want to wait longer than necessary, agree?
But the problem is that if we add too little delay (but long enough for the browser to start the default action), we get the
scroll value of the item when it is active scrolling. This means that the resulting value is not 100% of the item's scroll
value (e.g. we scroll the item by 100 pixels when the event wheel is activated and the delay is too low for the browser
to finish the item's scroll and as a result we get 70 or 80 px instead of 100).

#### But what is the best delay?

We think that the most optimal delay is `200 ms`, it's enough for the browser to finish the default action, and not too long to provide discomfort.

```html
<style>
    #outer {
        height: 500px;
        width: 200px;
        overflow-y: scroll;
    }

    #inner {
        height: 1000px;
        width: 180px;
        background-color: aquamarine;
    }

    body {
        margin: 0
    }

</style>
<div id="outer">
    <div id="inner">Hello, wheel me</div>
</div>
<p id="log"></p>
<p id="toggle"></p>
<p id="timeout"></p>


<script>
  let outer = document.querySelector("#outer");
  let inner = document.querySelector("#inner");
  let logElem = document.querySelector("#log");
  let toggleElem = document.querySelector("#toggle");
  let timeoutElem = document.querySelector("#timeout");

  let initialWheel = 0;


  function toggleOnDetails(cb, arg, e, element) {
    const details = document.createElement("details");
    details.style.display = "none";
    details.ontoggle = function () {
      details.remove();
      cb(arg, e, element, " TOGGLE ");
    };
    document.body.appendChild(details);
    details.setAttribute("open", "");
  }

  function timeOut(cb, arg, e,element) {
    setTimeout(function () {
      cb(arg, e, element, " TIMEOUT ")
    }, 200);
  }

  function log(initial, e, element, msg) {
    msg = msg || "";
    let pos = inner.getBoundingClientRect().top;
    element.innerText = e.type + msg + " " + (initialWheel - pos).toFixed(0) + "px per event " + (pos * -1).toFixed(0) + " from start";
    initialScroll = pos;
    initialWheel = pos;
  }

  outer.addEventListener("wheel", function (e) {
    log(initialWheel, e, logElem);
    toggleOnDetails(log, initialWheel, e, toggleElem);
    timeOut(log, initialWheel, e, timeoutElem);

  });

</script>

```