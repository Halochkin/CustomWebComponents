### Example: Passing CSS variables into BlueBlue web component
```html
<script>
  class BlueBlue extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML = `
           <style>
        div {
           background-color: var(--bg-color, red);                //[2]          
         }

       </style>
       <div style="color: var(--text-color, red)">                //[3]  
         <slot></slot>
       </div>`;                                                      
    }
  }

  customElements.define("blue-blue", BlueBlue);
</script>

<style>
    blue-blue {                                                   /*[1]*/
        --bg-color: lightblue;
        --text-color: darkblue;
        --list-style: square inside none;
    }

    div {                                                        
        color: yellow;                                            <!--4-->
    }

</style>

<blue-blue id="one" style="background-color: red;">               <!--4-->
    darkblue text against a lightblue background.
</blue-blue>

<div>                                                             
    This text is yellow.                                         //[5]
</div>
```

1. Outside the shadowDOM, we can define CSS-variables of the <blue-blue> element in a <style> element to expose multiple CSS properties.
2. Inside shadowDOM, we can define the background color <div> by invoking CSS variable selectors defined outside shadowDOM.
3. We can also define the color of the <div> element itself by also invoking CSS variable. When we use the <blue-blue> web 
component, the text inside it will be wrapped inside the <div>, making the text blue against the blue background.
4. Regular CSS properties set in the lightDOM will not leak into the web component and control the styles in the shadowDOM of the custom element.
5. Styles set inside the shadowDOM of <blue-blue>, does not leak out into the lightDOM surrounding the host element.

