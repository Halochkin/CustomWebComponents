# Responsive layout

Responsive layout is the practice of making a website suitable for any device with any screen size, no matter how big 
or small, mobile or desktop. Responsive web design focuses around the notion of an intuitive and enjoyable experience for
everyone. A desktop computer and a user's cell phone, they all benefit from responsive sites.
The easiest way to determine the screen size of a device is to use media queries.

### Media queries 

Media query is a component of the CSS language. This component is often used as a "switch", which, based on a set of rules,
is responsible for the choice of design styles.

```css
@media 
screen and                                             /*[1]*/
(min-width: 900px) and (max-width: 1200px) {           /*[2]*/
    #div{
        color: red;                                    /*[3]*/
    }
}
```
Media query consists of three parts: 
1. type of environment ('media') - used to declare the environment to which the rules will apply.
2. expression ('expression') - allows to classify devices using narrower conditions. 
3. style rules contained in the media query itself - that apply to devices that meet the requirements.

Using media queries, we can create a responsive layout that can change depending on the size of the device display.
To increase efficiency, you can use css variables that will be overwritten within the media request and automatically 
applied to the elements. For the best concept let's consider an example.

### Example

Here we use two custom elements `parent-element`, `child-element` and css variables.
The idea is to divide the window into several identical columns and define the parent column width (in %). These value
are stored in css variables in integer format and defines in `:root`. Then calculate the width of `parent-elements` relative
to the window using the CSS `calc()` function and variable values (the number of columns multiplied by the width in %). 
This means that the width of `parent-element` may be less than the width of the window and its value is constant.

In a similar way, we define the width of child-element. Parent-element is divided into the same number of columns (defined
in the css variable earlier), the column width for child-element is also defined in the css variable and may differ from 
the column width `parent-element`.

Also, we have to create a css variable for each `child-element`, which will store the number of columns that occupy the
element, depending on the width of the display and will be overwritten by the media query when changing the width of 
the display. 
Its width is calculated `relative to parent-element, not the window`.

```html

  <parent-container>                                                 <!--[1]-->
    <child-element id="one">a</child-element>
    <child-element id="two">b</child-element>
    <child-element id="three">c</child-element>
  </parent-container>

<style>
  :root {                                                            /*[2]*/
    --column-count: 10;                                              /*[2.1]*/
    --column-width-parent: 8;                                        /*[2.1]*/
    --column-width-child: 10;                                        /*[2.3]*/
   
  }

  child-element {                                                    /*[3]*/
    display: inline-block;
  }

  parent-container {                                                 /*[4]*/
    font-size: 0;
    height: 350px;
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
    class ParentContainer extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open"});
        this.shadowRoot.innerHTML = `
      <style>
        :host{
        width: calc( var(--column-width-parent) * var(--column-count)*1%);     /*[5]*/
        }
      </style>
      <slot></slot>`;                                                          /*[6]*/
      }
    }
    
    class ChildElement extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `                      
      <style>
        @media (min-width: 0px) and (max-width: 900px) {                       /*[7]*/
        :host-context(#one) {
            --column-count-one: 3;
        }

        :host-context(#two) {
            --column-count-two: 3;
        }

        :host-context(#three) {
            --column-count-three: 4;
        }
    }

    @media (min-width: 901px) and (max-width: 2200px) {                        /*[7]*/
        :host-context(#one) {
            --column-count-one: 1;
        }

        :host-context(#two) {
            --column-count-two: 8;
        }

        :host-context(#three) {
            --column-count-three: 1;
        }
    }

    :host-context(#one) {                                                       /*[8]*/
         width: calc(var(--column-width-child) * var(--column-count-one) * 1%); 
        }

    :host-context(#two) {
         width: calc(var(--column-width-child) * var(--column-count-two) * 1%);
        }

    :host-context(#three) {
         width: calc(var(--column-width-child) * var(--column-count-three) * 1%);
        }
    </style>
    <slot></slot>`;                                                                 //[9]
      }
    }
    customElements.define("parent-container", ParentContainer);
    customElements.define("child-element", ChildElement);
  </script>
```
1. All `child-elements` are placed inside the`parent-element`. Both elements have own `shadowDOM` and `<slot>` element inside.
2. Define the variables on the `:root` element.
    1. Number of columns that will be used to divide the width of the window / parent-element.
    2. Percentage width of the `parent-element` column (in integer format). 
    3. The width of the `child-element` column.  
3. Apply `display: inline-block;` CSS property for `child-element`.
4. Since `child-element` has a `display: inline-block` CSS property, we need to remove the spaces between the items, use 
    `font-size: 0;`.
5. Calculating the width of parent-element relative to window using `calc()` CSS function. Column width
   will be multiplied by the number of columns and converted into percentages. In this example, the `parent-element` width
   will be equal `80%` of the window width. (8*10) = 80%.
6. Adding a `<slot>` element inside the `shadowDOM`, this is necessary to display the shadowDOM content in the lightDOM.
7. Add `media-queries` inside shadowDOM for two sizes of the device display width(from 0 to 900 and from 901 to 1200 pixels).
 Each media query defines the number of columns that will be occupied by an element with different screen sizes. 
 Since we have defined 10 columns, in order for the items  to fully occupy the width of the parent element, their sum 
 should be equal to 10 (3+3+4 =10) if their sum is more than 10, the last item will be moved to the new row.
8. Application of calc() CSS function to calculate the width of each child-element and convert them into percentages 
 relative to the width of parent-element. In case of change of width, the value of variables will be changed and `calc()` 
 will automatically change the width according to the new value of the css variable.
9. Set `<slot>` elements inside shadowDOM of the `child-element`.

Try it on [codepen](https://codepen.io/Halochkin/pen/KOyOwQ)

### References 

* [MDN: Media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)
* [MDN: `calc()`](https://developer.mozilla.org/en-US/docs/Web/CSS/calc)
* 