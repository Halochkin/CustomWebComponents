# Pattern: comic-strip 
The comic-strip is the parent container. It mainly watches the scroll event. Whenever the scroll happens, it shifts `position`
 property on all its comic-frame children to be `+1` or `- 1` to the left or right, depending the direction of the scroll.

The comic-frame children has the default style settings. It has a transition to gradually move between states. When the
 position is +1, it is transformX(+100%),when it is -1 it is transformX(-100%).
 
The parent can specify its `framewidth` in an html-attribute,so that the frame can be either bigger or smaller than the
 parent itself. The frame can be left, center or right. It also has an html-attribute for height.


### Example
Let's look at an example. The idea is that we have a horizontal scrollbar at the top, and three slides that will be 
switched, depending on the direction of movement of the scrollbar. 

```html

<script>

  let frameWidth, frames = undefined;                                                    //[1]
  let prevPosition = 0;                                                                  //[2]
  let frameTranslate = 0;                                                                //[3]

  class ScrollPanel extends HTMLElement {                                                //[4]
    constructor() {
      super(); 
      this.attachShadow({mode: "open"});                                                 //[4.1]
      this.shadowRoot.innerHTML = `                                                      
        <style>
            div{
               height: .1px;  
            }
        </style>
        <div></div>
      `;
      // change scrollbar width, depends from number of the frames
      this.shadowRoot.children[1].style.width = `${frameWidth * frames}px`;              //[4.2]
    }
  }


  class ChildFrame extends HTMLElement {                                                 //[5]
    constructor() {
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML = `<slot></slot>`;                                       //[5.1]
    }


    static get observedAttributes() {
      return ["position"];
    }

    attributeChangedCallback(name, oldValue, newValue) {                                 //[5.2]
      this.updatePosition(parseInt(newValue));
    }

    updatePosition(pos) {                                                                //[5.3]
      this.style.transform = `translateX(${(pos * 100)}%)`;
    }
  }

  class ParentContainer extends HTMLElement {                                            //[6]
    constructor() {
      super();
      this.attachShadow({mode: "open"});                                                 //[6.1]           
      this.shadowRoot.innerHTML = `
      <style>
        :host{overflow: hidden }

        scroll-panel {
          overflow: scroll;
          display: block;
         }
      </style>
      <scroll-panel></scroll-panel>
      <slot></slot>`;
      frames = this.children.length;                                                     
    }

    static get observedAttributes() {
      return ["framewidth", "frameheight"];
    }


    attributeChangedCallback(name, oldValue, newValue) {                                 //[6.2]
      if (name === "framewidth") {
        this.style.width = `${newValue}px`;
        frameWidth = parseInt(newValue);  // define width to use it for scrollbar
      }
      else if (name === "frameheight")
        this.style.height = `${newValue}px`;
    }


    connectedCallback() {
      this.shadowRoot.addEventListener("scroll", scrollHandler.bind(this), true);        //[6.3]
    }

    disconnectedCallback() {
      this.shadowRoot.removeEventListener("scroll", scrollHandler.bind(this), true);     
    }

  }

  function scrollHandler(e) {                                                            //[7]
    let scrolledLeft = parseInt(e.target.scrollLeft);
    let step = (e.target.scrollWidth - e.target.offsetWidth) / (frames - 1);             //[7.1]

    if (scrolledLeft >= prevPosition + step) {                                           //[7.2]
      prevPosition += step;
      switchChildren(this, frameTranslate -= 1);                                       
    }

    else if (scrolledLeft <= prevPosition - step) {                                      //[7.2]
      prevPosition -= step;
      switchChildren(this, frameTranslate += 1);
    }
  }


  function switchChildren(element, position) {                                           //[8]
    for (let i = 0; i < element.children.length; i++) {
      let child = element.children[i];
      child.setAttribute("position", i + position); 
    }                                              
  }

  customElements.define("parent-container", ParentContainer);
  customElements.define("child-frame", ChildFrame);
  customElements.define("scroll-panel", ScrollPanel);
</script>

<style>
    parent-container {
        display: block;
        position: absolute; /*because child elements have position: absolute and can not be overflowed*/
    }

    child-frame {
        display: inline-block;
        position: absolute;
        height: 350px;
        width: 100%;
    }

    #one {
        background-color: red;

    }

    #two {
        background-color: orange;
    }

    #three {
        background-color: #86dfff;
    }

</style>


<parent-container minscroll="150" framewidth="600" frameheight="300">
    <child-frame id="one" position="0"></child-frame>
    <child-frame id="two" position="1"></child-frame>
    <child-frame id="three" position="2"></child-frame>
</parent-container>

```

 1.  Let's deсlare the variables `frameWidth` and `frames`. `frameWidth` equals the parent container frame width, `frames` 
is the number of frames. They are used to automatically change the width of the scrollbar. 
 2.  To switch frames, use the scrollbar at the top of the parent container.  To make sure that the frames are _**not**_ switched
after the first activation of the `scroll` event, we will divide the width of the scrollbar by the number of frames, 
so that their switching is proportional. 
     > This means that if the scrollbar width is 500px and the number of frames is 5, switching between the first and second
     frames will only happen when the scrollbar is greater than 100px. 
     And when switching the frame, the last value of the passed distance will be saved in the `prevPosition` variable. 

 3. `frameTranslate` saves the translateX value of the active frame. It increases or decreases by 1 each time the frame 
is switched, depending on the direction.
 4. ScrollPanel class defines a custom scrollbar that will be used to switch frames.
    1. Since HTML does not provide for a separate scrollbar element, we must use `shadowDom` and place in it an element with larger 
    dimensions than a custom scrollbar element, and the scrollbar element itself to assign the css property: `overflow: scroll;`.
    2. As mentioned earlier, the slides are switched after the scroll buttons are moved proportionally. Let's define the 
    width of the panel scroll by assigning the value to the element placed in shadowDOM.
5. ChildFrame class defines the behavior of the frame that will be placed in the parent container.
    1. It is placed in the shadowDom of the parent element using the slot element.
    2. Each element has a `position` attribute, the value of which is used for the order of placement of frames.
    3. updatePosition function translateX() element left or right 100%.
 6. `ParentContainer` class defines behavior of a custom element, which is a wrapper for frames.
    1. The class has a shadowDOM with a custom scrollbar and a frame slot inside it. Also defined is the style for the 
    host and scroll bar. 
    2. Since the parent specifies his own width and height in the html attribute, so that the frames can be either larger 
    or smaller than the parent himself or herself. The parent's size will be changed to the values specified in the attributes.
    Regardless of which sizes were defined by CSS.
    3. After the element is placed in the DOM, an event listener for the scroll event is added to the scrollbar, which 
    activates the `scrollHandler` function.
    
 7. `scrollHandler()` handles a scroll event that was called on a scrollbar element.
    1. The step variable is equal to the value to be overcome by the scrollbar button to switch the next frame.
    2. After the step has been overcome, the value of the previous position will be increased or decreased by the value
     of the step, so that the next frame takes into account the value that was reached during the last switching. after 
     that `switchChildren()` will be called.
 8. `switchChildren()` will insert new position attribute values for each frame. This will trigger `attributeChangedCallback()`,
     which in turn will call `updatePosition()` and move the frames left or right, depending on the direction of scrollbar movement 
  
Try it on [codepen](https://codepen.io/Halochkin/pen/WqqEWL?editors=1000)

### References
* [MDN: overflow CSS propery](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)
* [MDN: translateX() CSS function](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translateX)

