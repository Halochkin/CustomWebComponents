 ## PinchSpinMixin
 This mixin records a sequence of two-finger `"touchstart"`, `"touchmove"` and `"touchend"` to callback/event:
 
pinchStartCallback(detail) / "pinchstart"
pinchCallback(detail) / "pinch"
pinchEndCallback(detail) / "pinchend"
spinCallback(detail) / "spin"
To add the ability to use the event `spinEvent()` must return `true`.
```javascript
static get spinEvent() {
      return true;
    }
```
All callbacks/events pass a set of standard details, based on `makeDetail()`:
```javascript
function makeDetail(touchevent) {
  function makeDetail(touchevent) {
  const f1 = touchevent.targetTouches[0];
  const f2 = touchevent.targetTouches[1];
  const x1 = f1.pageX;
  const y1 = f1.pageY;
  const x2 = f2.pageX;
  const y2 = f2.pageY;
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);
  const diagonal = Math.sqrt(width * width + height * height);
  const angle = calcAngle(x1 - x2, y1 - y2);
  return {touchevent, x1, y1, x2, y2, diagonal, width, height, angle};
 }
}
```
#### "Can you imagine the difference between pinch and spin?" 
* `Pinch` are mainly used to zoom in/out images, zoom in/out maps, zoom in/out web pages. A `pinch` gesture reports changes to the distance between two fingers touching the screen. Pinch gestures are continuous, so action method is called each time the distance between the fingers changes. <br>
 In addition to the default list of details, `pinchEndCallback(detail)/"pinchend"` has `duration` value which is equal to the time(ms) between the last and "touchend"/"touchcancel" events.
 
* `Spin` gesture is a continuous gesture that occurs when two fingers that touch the screen move around each other and
  used to control objects on the screen it `only` can  be triggered by an `spinCallback(detail)` or a `spin` event.
For example, you can use them to rotate or change the scale of an element.<br>
The benefit of `spin` over a `pinch` is that the `spinCallback()` is only triggered with certain conditions: 
one or both fingers have moved more than a minimum `spinMotion`(px) for more than minimum `spinDuration`(ms) this allows 
prevent accidental calls.
```javascript
 static get spinSettings() {
      return {spinMotion: 50, spinDuration: 100};
    }
```
Both `spinMotion` and `spinDuration` are implemented as [StaticSettings](../chapter2/Pattern_StaticSettings.md).
`spinMotion` is calculated as the sum of the distance of the start and end positions of
finger 1 and 2, where start position was the position of finger 1 and 2 at pinchend - `spinDuration`.<br>
[Try the difference between `drag` and `fling` gestures here](https://rawgit.com/Halochkin/Components/master/Gestures/GesturesTest1.html)
<p align="center">
  <img src="http://www.gestureml.org/lib/exe/fetch.php/gestures/touch/simple/spatial/rotate/two_finger_rotate_gestureworks.png?w=200&tok=5f5c9f">
</p><br>

`spinCallback(detail)` has some additional values of detail: 

- `touchevent` - spinEvent detail
- `duration` - duration of the spinEvent
- `xFactor` - the scale factor(X) for asymmetrical zoom in / zoom out
- `yFactor` - the scale factor(Y)
- `diagonalFactor` - scale factor for symmetrical zoom in / zoom out 
- `rotation` - the difference between start and end spin angles <br>

 ### Example: swipeGesture
 
 ```html
 <style>
  spinning-block {
     display: inline-block;
        width: 200px;
        height: 200px;
        background-color: #c238cc;
        text-align: center;
        margin: 30px;
        border: 2px solid #ff16d7;
        border-radius: 0 50% 50% 50%;
  }
</style>

<spinning-block></spinning-block>

<script type="module">
  import {PinchGesture} from "../../src/gestures/PinchSpin.js";

  class SpinningBlock extends PinchGesture(HTMLElement) {  //[1]

    static get pinchEvent() {
      return true;
    }

    spinCallback(detail) {                              
      this.style.transform = `rotate(-${detail.rotation * 5}deg)`;  // 5 - acceleration factor and can be changed
    }
  }

  customElements.define("spinning-block", SpinningBlock); 

  const spinner = document.querySelector("spinning-block"); 
  spinner.addEventListener("spin", (e) => {
    spin.style.transition = "1s";
    spin.style.transform = `rotate(-${e.detail.rotation * 3}deg)`;
  });
</script>
 ```
 [Try it](https://rawgit.com/Halochkin/Components/master/Gestures/PinchGestureMixin/test/SpinBlock.html)
  ### Reference
  * [Zingtouch](https://zingchart.github.io/zingtouch/)
 
