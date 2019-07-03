# HowTo: Parallax Effect

So, as mentioned in the previous article, the parallax effect is a special technique in which objects in the background 
move slower in the long run than objects in the foreground. This creates a 3D effect and creates a sense of 
three-dimensional space. 

Let's consider how to make such an effect in practice.

### Example: Parallax photo
You've probably met images with the parallax effect on them. That allows you to create a volumetric effect. Let's create 
our own image with the paralax effect. 
For this we will need two layers. The first is the background, and the second is the main image, on which the view will
be focused.
 
```html
<style>
  * {
    transition-duration: 2s;
    will-change: transform;
  }

  #backgroundImg {
    height: 700px;
    width: auto;
    margin-left: -3vw;
    margin-top: -2vh;
  }

  #frontImg {
    height: 600px;
    margin-top: 100px;

  }

  parent-parallax {
    width: 90vw;
    height: 600px;
    overflow: hidden;
    display: block;
    position: relative;
  }
</style>

<parent-parallax>
  <child-parallax id="background" x="1" y="1" z="0.002">
    <img id="backgroundImg" src="https://pbs.twimg.com/media/B886C23IQAEt2aB.jpg" alt="background image">
  </child-parallax>
  <child-parallax id="front" x="2" y="0" z="0.003">
    <img id="frontImg" src="https://i.pinimg.com/originals/db/77/03/db7703221e42fe762a735e164a325f03.png" alt="main image">
  </child-parallax>
</parent-parallax>

<script>
  let xFactor = 1;
  let yFactor = 1;
  let zFactor = 1;
  class ParentParallax extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({
        mode: "open"
      });
      this.shadowRoot.innerHTML = `
        <style>
         :host(){
           display: block;
         }
         </style>
<slot></slot>`;
      setInterval(() => {
        this.handleData();
      }, 1000);
    }
    handleData(dist) {
      Array.from(this.children)
        .filter(item => item.tagName === "CHILD-PARALLAX")
        .forEach((el) => {
          xFactor = parseFloat(el.getAttribute("x"));
          yFactor = parseFloat(el.getAttribute("y"));
          zFactor = parseFloat(el.getAttribute("z"));
          let prevPos = el.style.transform.match(/\((.*), (.*) scale\((.*)\)/);
          let transformX = prevPos ? parseInt(prevPos[1]) : 0;
          let transformY = prevPos ? parseInt(prevPos[2]) : 0;
          let transformZ = prevPos ? parseFloat(prevPos[3]) : 1;
          el.changePosition(xFactor + transformX, yFactor + transformY, zFactor + transformZ);
        });
    }
  }
  class ChildParallax extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({
        mode: "open"
      });
      this.shadowRoot.innerHTML = `
        <style>
          :host{
            display: block;
            position: absolute;
          }
        </style>
        <slot></slot>`;
    }
    changePosition(xDistancePercent, yDistancePercent, zDistancePercent) {
      requestAnimationFrame(() => {
        this.style.transform = `translate(${xDistancePercent}px, ${yDistancePercent}px) scale(${zDistancePercent})`;
      });
    }
  }
  customElements.define("parent-parallax", ParentParallax);
  customElements.define("child-parallax", ChildParallax);
</script>
```