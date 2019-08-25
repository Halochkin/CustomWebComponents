# How to: CSS variables control native element behavior (don`t know how to call)

In the previous article, we discussed how attributes can be used to control the behavior of native HTML elements inside
a shadowDOM. In a similar way we can use CSS variables. They allow us to pass values from lightDOM to shadowDOM.

The idea of controlling elements with CSS variables is to save the necessary properties of control in the variables and
then get these values using JS, using `styleCallback()`. It observe CSS properties or variables using `observedStyles()`
and reacts to their style changes in the same way as `attributeChangedCallback()`. 
Unfortunately, it is not a lifecycle callback yet and should be imported from outside.

```javascript
  import {StyleCallbackMixin} from "https://unpkg.com/joicomponents@1.3.6/src/style/StyleCallbackMixin.js"
```

## Example

For a simpler explanation, let's consider a simple example.

```html
  <style>
      :root {
          --playAudio: pause; /*"play", "pause" / "loop" */                                                  /*[1]*/
          --audioSrc: https://www.sounddogs.com/media/fastpreview/Sounddogs-Preview-11545000.mp3;
      }
  </style>
    
  <audio-css></audio-css>                                                                                    <!--[2]-->

  <script type="module">                                                                                     //[3]
  
   import {StyleCallbackMixin} from "https://unpkg.com/joicomponents@1.3.6/src/style/StyleCallbackMixin.js"  //[4]

     class AudioCSS extends StyleCallbackMixin(HTMLElement) {
       constructor() {
         super();
         this.attachShadow({mode: "open"});                                                                  //[5]
         this.shadowRoot.innerHTML = `<audio>`;                                                              //[6]
         this.audioElement = this.shadowRoot.children[0];                                                    //[7]
       }
      
       static get observedStyles() {                                                                         //[8]
         return ["--playAudio", "--audioSrc"]; 
       }
      
       styleCallback(name, oldValue, newValue) {                                                             //[9]
         newValue = newValue.trim();
         if (newValue === "play")
           this.audioElement.play();
         else if (newValue === "pause")
           this.audioElement.pause();
         else if (newValue === "loop"){
           this.audioElement.setAttribute("loop", "");
           this.audioElement.play();
         }
         else if (name==="--audioSrc")
           this.audioElement.setAttribute("src", newValue);
       }
     }
     
    customElements.define("audio-css", AudioCSS);
  </script>
```
1. Defined `--playAudio` CSS variable which can have 3 values.
2. A custom element without attributes is added to lightDOM. 
3. To add the ability to port inside the script, add `type="module"` attribute.
4. Import `styleCallback()`.
5. Open the shadowDOM on custom element.
6. Inside the shadowDOM add an `<audio>` element _without_ attributes.
7. Inside audioElement, the audio element is saved. It will be used to transfer attributes defined in lightDom.
8. `observedStyles()`, allows to define the set of CSS variables which will be observed.
9. When you use or change any observed CSS variable for the first time, `slotCallback()` will be activated, which will 
   provide the name of the variable, its new and previous values.
   
## Reference
* You can read more about [`styleCallback()`](https://github.com/orstavik/JoiComponents/blob/master/book/chapter5_style/12_Mixin_StyleCallback.md)

