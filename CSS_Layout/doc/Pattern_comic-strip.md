#Pattern: comic-strip 

Today, various sliders are very popular on websites. Purely visually, the sliders on the sites are blocks on the page, 
within which the demonstration of announcements of news, articles or images takes place with a set frequency.
Why do websites use sliders? 
* Firstly, these elements are visually appealing to website visitors, and they also stimulate
the interest of target users in various materials posted on the site. 
* Secondly, thanks to the use of sliders, you can 
save space, as one slider block allows you to demonstrate several announcements. After all, with other options for 
their placement would require a separate place on the page.

But automatic scrolling or switching with buttons is not always a good idea. In some cases, it is much more convenient 
to use horizontal scrolling. Horizontal scrolling works best when you want to display a subset of categories. There are 
a few situations where horizontal scrolling has been a good success: 
1. displaying a large catalogue of goods or items so that you can easily show different categories of goods. 
2. displaying information in a large visual area that is difficult to see at a glance (e.g. map).
3. displaying individual sections or slides of information about applications.

Horizontal scrolling has seen a shift in the widespread use of smartphones in recent years. Thanks to mobile devices, 
finger movement became more intuitive and the information about the site was available to the user at the touch of a finger.

### What is the benefits of horizontal scrolling?

* It is designed to provide space for secondary information that does not overload the page space. For example, when 
images are displayed in a photo gallery, horizontal scrolling allows users to browse through a small sample of content
 and allows them to quickly "flip through" or click for more information.
* Horizontal scrolling saves a lot of vertical screen space. Instead of displaying all content on a very long page at 
once, horizontal layouts introduce users to small amounts of information. The layout is much more flexible. You can add 
content in both directions - vertical and horizontal.
* Horizontal scrolling allows users to see options in a category by swiping sideways or scrolling down to see different
 categories. This use of two dimensions helps users by showing different options without forcing them to visit separate 
 category pages.

### Comic-strip - horizontal scrolling pattern

The `comic-strip` is the parent container. It mainly watches the scroll event. Whenever the scroll happens, it shifts `position`
property on all its comic-frame children to be `+1` or `- 1` to the left or right, depending the direction of the scroll.

The comic-frame children has the default style settings. It has a transition to gradually move between states. When the
 position is +1, it is transformX(+100%),when it is -1 it is transformX(-100%).
 
The parent can specify its `framewidth` in an html-attribute,so that the frame can be either bigger or smaller than the
 parent itself. The frame can be left, center or right. It also has an html-attribute for height.


### Example
Let's look at an example. The idea is that we have a horizontal scrollbar at the top, and three slides that will be 
switched, depending on the direction of movement of the scrollbar. 

```html
<parent-container minscroll="150" framewidth="600" frameheight="300">                    <!--[1]-->
    <child-frame id="one" position="0"></child-frame>                                    <!--[2]-->
    <child-frame id="two" position="1"></child-frame>
    <child-frame id="three" position="2"></child-frame>
</parent-container>

<style>

    child-frame {
        display: inline-block;
        position: absolute;
        height: 350px;                                                                   /*[3]*/
        width: 100%;
    }
    
    parent-container {
        display: block;
        position: absolute;                                                              /*[4]*/
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

<script>

  let frameWidth, frames = undefined;                                                    //[5]
  let prevPosition = 0;                                                                  //[6]
  let frameTranslate = 0;                                                                //[7]

  class ScrollPanel extends HTMLElement {                                                //[8]
    constructor() {
      super(); 
      this.attachShadow({mode: "open"});                                                 //[8.1]
      this.shadowRoot.innerHTML = `                                                      
        <style>
            div{
               height: .1px;  
            }
        </style>
        <div></div>
      `;
      // change scrollbar width, depends from number of the frames
      this.shadowRoot.children[1].style.width = `${frameWidth * frames}px`;              //[8.2]
    }
  }


  class ChildFrame extends HTMLElement {                                                 //[9]
    constructor() {
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML = `<slot></slot>`;                                       //[9.1]
    }


    static get observedAttributes() {
      return ["position"];
    }

    attributeChangedCallback(name, oldValue, newValue) {                                 //[9.2]
      this.updatePosition(parseInt(newValue));
    }

    updatePosition(pos) {                                                                //[9.3]
      this.style.transform = `translateX(${(pos * 100)}%)`;
    }
  }

  class ParentContainer extends HTMLElement {                                            //[10]
    constructor() {
      super();
      this.attachShadow({mode: "open"});                                                 //[10.1]           
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


    attributeChangedCallback(name, oldValue, newValue) {                                 //[10.2]
      if (name === "framewidth") {
        this.style.width = `${newValue}px`;
        frameWidth = parseInt(newValue);  // define width to use it for scrollbar
      }
      else if (name === "frameheight")
        this.style.height = `${newValue}px`;
    }


    connectedCallback() {
      this.shadowRoot.addEventListener("scroll", scrollHandler.bind(this), true);        //[10.3]
    }

    disconnectedCallback() {
      this.shadowRoot.removeEventListener("scroll", scrollHandler.bind(this), true);     
    }

  }

  function scrollHandler(e) {                                                            //[11]
    let scrolledLeft = parseInt(e.target.scrollLeft);
    let step = (e.target.scrollWidth - e.target.offsetWidth) / (frames - 1);             //[11.1]

    if (scrolledLeft >= prevPosition + step) {                                           //[11.2]
      prevPosition += step;
      switchChildren(this, frameTranslate -= 1);                                       
    }

    else if (scrolledLeft <= prevPosition - step) {                                      //[11.2]
      prevPosition -= step;
      switchChildren(this, frameTranslate += 1);
    }
  }


  function switchChildren(element, position) {                                           //[12]
    for (let i = 0; i < element.children.length; i++) {
      let child = element.children[i];
      child.setAttribute("position", i + position); 
    }                                              
  }

  customElements.define("parent-container", ParentContainer);
  customElements.define("child-frame", ChildFrame);
  customElements.define("scroll-panel", ScrollPanel);
</script>

```

1. Add frame width and height as custom attributes.
2. Add the initial frames order.
3. Set `position: absolute` CSS property to `child-frame` elements to position the slides relative to each other.
4. Set `position: absolute` CSS property to `parent-container` element too, because child elements have `position: absolute`
 and can not be overflowed.
5.  Let's deсlare the variables `frameWidth` and `frames`. `frameWidth` equals the parent container frame width, `frames` 
is the number of frames. They are used to automatically change the width of the scrollbar. 
6.  To switch frames, use the scrollbar at the top of the parent container.  To make sure that the frames are _**not**_ switched
after the first activation of the `scroll` event, we will divide the width of the scrollbar by the number of frames, 
so that their switching is proportional. 
     > This means that if the scrollbar width is 500px and the number of frames is 5, switching between the first and second
     frames will only happen when the scrollbar is greater than 100px. 
     And when switching the frame, the last value of the passed distance will be saved in the `prevPosition` variable. 

7. `frameTranslate` saves the translateX value of the active frame. It increases or decreases by 1 each time the frame 
is switched, depending on the direction.
8. ScrollPanel class defines a custom scrollbar that will be used to switch frames.
    1. Since HTML does not provide for a separate scrollbar element, we must use `shadowDom` and place in it an element with larger 
    dimensions than a custom scrollbar element, and the scrollbar element itself to assign the css property: `overflow: scroll;`.
    2. As mentioned earlier, the slides are switched after the scroll buttons are moved proportionally. Let's define the 
    width of the panel scroll by assigning the value to the element placed in shadowDOM.
9. ChildFrame class defines the behavior of the frame that will be placed in the parent container.
    1. It is placed in the shadowDom of the parent element using the slot element.
    2. Each element has a `position` attribute, the value of which is used for the order of placement of frames.
    3. updatePosition function translateX() element left or right 100%.
10. `ParentContainer` class defines behavior of a custom element, which is a wrapper for frames.
    1. The class has a shadowDOM with a custom scrollbar and a frame slot inside it. Also defined is the style for the 
    host and scroll bar. 
    2. Since the parent specifies his own width and height in the html attribute, so that the frames can be either larger 
    or smaller than the parent himself or herself. The parent's size will be changed to the values specified in the attributes.
    Regardless of which sizes were defined by CSS.
    3. After the element is placed in the DOM, an event listener for the scroll event is added to the scrollbar, which 
    activates the `scrollHandler` function.
11. `scrollHandler()` handles a scroll event that was called on a scrollbar element.
    1. The step variable is equal to the value to be overcome by the scrollbar button to switch the next frame.
    2. After the step has been overcome, the value of the previous position will be increased or decreased by the value
     of the step, so that the next frame takes into account the value that was reached during the last switching. after 
     that `switchChildren()` will be called.
12. `switchChildren()` will insert new position attribute values for each frame. This will trigger `attributeChangedCallback()`,
     which in turn will call `updatePosition()` and move the frames left or right, depending on the direction of scrollbar movement 
  
Try it on [codepen](https://codepen.io/Halochkin/pen/WqqEWL?editors=1000).

### References
* [MDN: overflow CSS propery](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)
* [MDN: translateX() CSS function](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translateX)

