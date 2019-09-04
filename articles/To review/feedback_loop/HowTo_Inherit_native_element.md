# How To: Inherit HTML element

To create a custom web sound element, which can be controlled from the outside by css variables, and from the inside it
converts css values into js commands to implement the functionality of native HTML audio element. 
 ### When can it be useful?
This is a fair question you can ask, dear reader. And it will be absolutely fair. So let's see why we need to wrap the
native HTML element inside the custom one. First of all, this is done in cases where we need to add audio feedback
when activating a certain event on the element. It is especially important in cases when we need to add several audio
files with different configuration parameters of the audio file (for example, different volume level or repeat 
playback of a certain file). In order for each item to have its own set of parameters by default, we can add them 
as attributes directly to the custom web component in DOM. Then open the shadow tree where the <audio> element is placed. 
Then attributeChangedCallback() will track all the attributes placed on the custom element in lightDOM and assign 
them to the audio element located in the shadowDOM of the custom element. 

### Example
For a clearer explanation, let's consider a simple example.

```html
<audio-css autoplay src="https://www.sounddogs.com/media/fastpreview/Sounddogs-Preview-11545000.mp3"></audio-css> <!--[1]-->

<script>
 class AudioCSS extends StyleCallbackMixin(HTMLElement) {
    constructor() {
      super();
      this.attachShadow({mode: "open"});                                       //[2]
      this.shadowRoot.innerHTML = `<audio>`;                                   //[3]
      this.audioElement = this.shadowRoot.children[0];                         //[4]

    }

    static get observedAttributes() {                                          //[5]
      return ["autoplay", "src",]
    }

    attributeChangedCallback(name, oldValue, newValue) {                       //[6]
      this.audioElement.setAttribute(name, newValue);
    }
  }
  
  customElements.define("audio-css", AudioCSS);
</script>
```

1. In lightDOM, a set of custom attributes is added to the inside of the custom element to define the behavior of the 
`<audio>` element. For example, we can set `autoplay` or `loop` attributes.
2. Open the shadowDOM on custom element.
3. Inside the shadowDOM add an `<audio>` element _without_ attributes.
4. Inside audioElement, the audio element is saved. It will be used to transfer attributes defined in lightDom.
5. In the `observedAttributes()` function, we define the attributes to be monitored.
6. When one of the attributes is changed (or added), `attributeChangedCallback()` is activated, which will add attributes 
to the audio element one by one.