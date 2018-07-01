 ## Spin Gesture
  The spin gesture is a continuous gesture that occurs when two fingers that touch the screen move around each other and
  used to control objects on the screen.
For example, you can use them to rotate or change the scale of an element.<br>
The benefit of `spin` over a simple `pinch` is that the spin callback is only triggered under certain conditions: 
one or both fingers have moved more than a minimum `spinMotion`(px) for more than minimum `spinDuration`(ms) this allows 
prevent accidental calls.
Both `spinMotion` and `spinDuration` are implemented as [StaticSettings](../chapter2/Pattern_StaticSettings.md).
The default value of `spinMotion` is `50`(px), and the default value of `spinDuration` is `50`(ms).
`spinMotion` is calculated as the sum of the distance of the start and end positions of
finger 1 and 2, where start position was the position of finger 1 and 2 at pinchend - `spinDuration`.
<p align="center">
  <img src="http://www.gestureml.org/lib/exe/fetch.php/gestures/touch/simple/spatial/rotate/two_finger_rotate_gestureworks.png?w=200&tok=5f5c9f">
</p><br>

The `spin` can `only` be triggered by an `spinCallback(detail)` or a `spin` event.

spinCallback(detail{
- `touchevent` - event detail
- `diagonal` - diagonal between fingers (px)
- `width` - distance(X) between fingers (px)
- `height` - distance(Y) (px)
- `angle` - the angle of the diagonal(deg)
- `duration` - spinEvent duration
- `xFactor` - the scale factor(X) for asymmetrical zoom in / zoom out
- `yFactor` - the scale factor(Y)
- `diagonalFactor` - scale factor for symmetrical zoom in / zoom out 
- `rotation` - the difference between start and end spin angles <br>
});

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
      this.style.transition = "1s";
      this.style.transform = `rotate(-${detail.rotation * 5}deg)`;  // 5 - acceleration factor and can be changed
      this.style.backgroundColor = "orange";
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
 
