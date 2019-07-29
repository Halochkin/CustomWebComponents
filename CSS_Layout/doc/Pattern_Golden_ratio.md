# Pattern: Golden ratio

The main indicator of the quality of web design is how naturally and easily it is perceived by users. When creating a 
visual design site it is important to illustrate the functionality and informative component of the project, to form its
correct perception. The use of classical techniques such as, for example, the rules of the `golden ratio` in the design 
helps to solve such problems optimally

`Golden ratio` is a mathematical ratio between elements of different sizes, which are considered to be the most aesthetically
appealing to human eyes. The gold ratio is 1:1,618 and is often illustrated by a spiral that resembles a seashell.

## Golden ratio rule in website design

Websites are always created with a certain purpose, and most often for earning: advertising goods, companies, to place
third-party advertising, etc. In any case, the most important thing in this case - to attract visitors. For the visitor 
is important comfort and beauty of the site, as well as its information content. To make the site look harmonious and 
stylish for the visitor, use the rule of the golden section. Just a drop of mathematics and your site will turn into a 
work of art.

There are several options for applying the golden rule to web design.

### 1. Sizes of the block and elements on the page

The ratio described above is used when zoning a page, as well as when forming separate blocks, if they need to be divided 
into two proportional parts. For calculations, we use the number `Φ` approximately equal to **`1,618`**_... (the number is infinite)_.
Percentage division of the whole by the number `Φ` is performed as `62/38%`.

Let's consider an example where we will use CSS variables and percentages to automatically calculate block sizes.  
 
```html
<style>

    :root {                                                                           /*[1]*/
        --golden-ratio-coefitient: 1.618;                                             /*[1.1]*/
        --parent-size: 640px;                                                         /*[1.2]*/
        --golden-ratio: calc(var(--parent-size) / var(--golden-ratio-coefitient));    /*[1.3]*/
    }

    main {
        width: var(--parent-size);                                                    /*[2]*/
        height: var(--golden-ratio);            
        display: inline-flex;                                                         /*[3]*/
    }

    #a1 {
        width: var(--golden-ratio);                                                   /*[4]*/
        height: 100%;                                                                 /*[5]*/
        background-color: #4cd2e4;
    }

    #a2 {
        width: calc(var(--parent-size) - var(--golden-ratio));                        /*[6]*/
        height: 100%;                  
        background-color: orange;
        display: inline-flex;
    }

    #a3 {                                                                             /*[7]*/
        width: 62%;
        height: 38%;
        background-color: red;
    }

    #a4 {                                                                             /*[8]*/
        width: 38%;                      
        height: 38%;
        background-color: blue;
    }
    
</style>

<main>
    <div id="a1"></div>
    <div id="a2">
        <div id="a3"></div>
        <div id="a4"></div>
    </div>
</main>
``` 
1. Let's define the variables for :root element.
    1. Golden ratio coefficient.
    2. The width of the parent's element (`<main>`).
    3. Proportional height of the parent element. This means that the width ratio will be 1.681 times greater than the height.
2. Apply CSS variables to the parent container.
3. Apply `inline-flex` value to `display` property. //todo Add description, why it is better than inline-block!!!
4. To make the block square. Also we can use 100%.
5. The height property specified in percent means the height relative to the outer block.
6. To fill the remaining space. We can do the same by using 38% instead.
7. Example of interest application. 
  
  >Note that we cannot use interest only. Since the percentages are relative values, we need to calculate at least 
  the size of the parent container, and only then apply the percentages to the child elements

Try it on [codepen](https://codepen.io/Halochkin/pen/oKBVNZ?editors=1000)
 
 
 
 ### Font
 
 
 ### Padding
 
 ### Margin