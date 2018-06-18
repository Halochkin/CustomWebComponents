<!DOCTYPE html>
<html lang="en">

<body>
<fling-ball></fling-ball>
<script type="module">
  import {DragFlingGesture} from "../src/DragFlingMixin.js";

  class FlingBall extends DragFlingGesture(HTMLElement) {
    constructor() {
      super();
    }

    connectedCallback() {
      super.connectedCallback();
      this.style.position = "absolute";
      this.style.width = "100px";
      this.style.height = "100px";
      this.style.borderRadius = "50%";
      this.style.backgroundColor = "blue";
      this.style.border = "4px solid red";
      this.style.top = "100px";
      this.style.left = "100px";
    }

    disconnectedCallback() {
      super.disconnectedCallback();
    }

    flingGestureCallback(flingDetail) {
      this.style.transition = "all " + flingDetail.durationMs + "ms cubic-bezier(0.39, 0.58, 0.57, 1)";
      this.style.left = (parseFloat(this.style.left) + flingDetail.flingX) + "px";
      this.style.top = (parseFloat(this.style.top) + flingDetail.flingY) + "px";
    }

    dragGestureCallback(startDetail, dragDetail) {
      this.style.transition = undefined;
      this.style.left = (parseFloat(this.style.left) + dragDetail.distX) + "px";
      this.style.top = (parseFloat(this.style.top) + dragDetail.distY) + "px";
    }
  }
  customElements.define("fling-ball", FlingBall);
</script>

</body>
</html>
