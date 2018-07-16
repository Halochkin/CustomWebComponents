 ## PinchSpinMixin
 This mixin records a sequence of **two-finger** `"touchstart"`, `"touchmove"` and `"touchend"` to callback/event. This mixin works only with touch events, because the pinch gesture can only be done with your fingers. [`PinchSpinMixin`](https://github.com/Halochkin/Components/blob/master/Gestures/PinchGestureMixin/src/PinchMixin.js) can be used for two finger gestures such as:
 * pinch
 * expand
 * rotate
 * zoom-in/out 
 * two-finger drag 
 
### Let's start.
`Pinch` can be called at different stages of lifecycle, but `spin` only once, it will be called after the end-event ("touchend"/"touchcancel").
```javascript 
pinchStartCallback(detail) / "pinchstart"
pinchCallback(detail) / "pinch"
pinchEndCallback(detail) / "pinchend"
spinCallback(detail) / "spin"
```
To add the ability to use the event `pinchEvent()` must return `true`.
```javascript
static get pinchEvent() {
      return true;
    }
```
All pinch callbacks/events contain a set of default details, based on `makeDetail()`:
```javascript
function makeDetail(touchevent) {
  function makeDetail(touchevent) {
  const f1 = touchevent.targetTouches[0];      //information about first touch-point
  const f2 = touchevent.targetTouches[1];      //second touch-point
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
The angle is calculated as a straight line between two touch points, starts at 12 o'clock and counts clockwise from 0 to 360 degrees.
   * up/north:   0
   * right/east: 90
   * down/south: 180
   * left/west:  270
```javascript
function calcAngle(x, y) {
  return ((Math.atan2(y, -x) * 180 / Math.PI) + 270) % 360;
}
```
#### "Can you imagine the difference between pinch and spin?" 
* `Pinch` are mainly used to zoom in/out images, zoom in/out maps, zoom in/out web pages. A `pinch` gesture reports changes to the distance between two fingers touching the screen. Pinch gestures are continuous, so action method is called each time the distance between the fingers changes. <br>
 In addition to the default list of details, `pinchEndCallback(detail)/"pinchend"` has `duration` value which is equal to the time(ms) between the last and "touchend"/"touchcancel" events.
 
* `Spin` gesture is a continuous gesture that occurs when two fingers that touch the screen move around each other and
  used to control objects on the screen it `only` can  be triggered by an `spinCallback(detail)` or a `spin` event.
For example, you can use them to rotate or change the scale of an element.<br>
<p align="center">Spin gesture demonstration
  <img src="http://www.gestureml.org/lib/exe/fetch.php/gestures/touch/simple/spatial/rotate/two_finger_rotate_gestureworks.png?w=200&tok=5f5c9f">
</p><br>
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

In addition to default details `spinCallback(detail)` has some additional values: 
- `touchevent` - spinEvent detail
- `duration` - duration of the spinEvent
- `xFactor` - the scale factor(X) for asymmetrical zoom in / zoom out
- `yFactor` - the scale factor(Y)
- `diagonalFactor` - scale factor for symmetrical zoom in / zoom out 
- `rotation` - the difference between start and end spin angles <br>

 ### Example: swipeGesture
 
 ```html
<spinning-block></spinning-block>
```
```javascript
  import {PinchGesture} from "../../src/gestures/PinchSpin.js";

  class SpinningBlock extends PinchGesture(HTMLElement) {  //[1]

    static get pinchEvent() {
      return true;
    }

    pinchStartCallback(pinchDetail) {
      const lastRotate = this.style.transform ? parseFloat(this.style.transform.substring(7)) : 0;
      this._startAngle = lastRotate + pinchDetail.angle;
    }

    pinchCallback(pinchDetail) {
      this.style.transform = `rotate(${this._startAngle - pinchDetail.angle}deg)`;
      this.style.backgroundColor = "orange";
    }

  customElements.define("spinning-block", SpinningBlock); 

  const spinner = document.querySelector("spinning-block"); 
  spinner.addEventListener("spin", (e) => {
    spin.style.transition = "1s";
    spin.style.transform = `rotate(-${e.detail.rotation * 3}deg)`;
  });
</script>
 ```
 [Try different ways of use pinch gestures](https://rawgit.com/Halochkin/Components/master/Gestures/PinchGestureMixin/test/SpinDemoLab.html)
  ### Reference
  * [Zingtouch](https://zingchart.github.io/zingtouch/)
 
