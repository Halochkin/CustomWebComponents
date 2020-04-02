# Pattern: Golden ratio

The main indicator of the quality of web design is how naturally and easily it is perceived by users. When creating a 
visual design site it is important to illustrate the functionality and informative component of the project, to form its
correct perception. The use of classical techniques such as, for example, the rules of the `golden ratio` in the design 
helps to solve such problems optimally

`Golden ratio` is a mathematical ratio between elements of different sizes, which are considered to be the most aesthetically
appealing to human eyes. The gold ratio is 1:1,618 and is often illustrated by a spiral that resembles a seashell.

## Why is the golden ratio so important in web design?
   
In fact, the golden ratio (golden ratio) is a tool (another one of many) that helps to create something that gives the 
right emotional and visual signals to users. This theory exists regardless of whether the principle of idealism is used or
not. The only important thing is that the web designer understands and recognizes this gold theory and its possibilities 
to create a better and more convenient design. Golden proportions are usually found where there are focal areas.
   
Websites are always created with a certain purpose, and most often for earning: advertising goods, companies, to place
third-party advertising, etc. In any case, the most important thing in this case - to attract visitors. For the visitor 
is important comfort and beauty of the site, as well as its information content. To make the site look harmonious and 
stylish for the visitor, use the rule of the golden section. Just a drop of mathematics and your site will turn into a 
work of art.

Take the total number of pixels in width or height and use it to build a gold rectangle. Divide the largest width or length 
to get smaller numbers. This can be the width or height of your main content. What's left may be a side panel (or in the 
ceiling of the room if you've applied it to the height). Now continue to use the gold rectangle to apply it to windows, 
buttons, panels, images and texts. You can also create a complete grid based on small versions of the gold rectangle, 
both horizontally and vertically, to create smaller interface objects that are proportional to the gold rectangle.

You can also use the gold spiral to determine where to place the content on your site. If your page is uploaded with 
graphical content, as, for example, on an online store or photo blog site, you can use the gold spiral method. The idea 
is to place the most valuable content in the center of the spiral.

Content with grouped material can also be placed using a gold rectangle. This means that the closer the spiral moves to 
the central squares (up to one square block), the more "dense" the content is there. You can use this technique to indicate 
the location of your title, images, menu, toolbar, search box and other elements.

There are several options for applying the golden rule to web design.

### 1. Sizes of the block and elements on the page

The ratio described above is used when zoning a page, as well as when forming separate blocks, if they need to be divided 
into two proportional parts. For calculations, we use the number `Φ` approximately equal to **`1,618`**_... (the number is infinite)_.
Percentage division of the whole by the number `Φ` is performed as `61.8/38.2%`.

#### Example
Let's consider an example where we will use CSS variables and percentages to automatically calculate block sizes.  
 
For example, we have a block of `640` pixels wide. It means:
 * The height is calculated as follows: `640 / 1,618 = 396 px`.
 * The same will be the width of most of the aspect ratio (left in the picture above) = `396 px`.
 * Whereas the smaller area width = `640 - 396 = 244 px`.
 
```html
<style>

    :root {                                                                           /*[1]*/
        --golden-ratio-coefitient: 1.618;                                             /*[1.1]*/
        --parent-size: 640px;                                                         /*[1.2]*/
        --golden-ratio: calc(var(--parent-size) / var(--golden-ratio-coefitient));    /*[1.3]*/
    }

    main {
        width: var(--parent-size);                                                    /*[2]*/
        height: var(--golden-ratio);                                                  /*[3]*/
        display: inline-flex;                                                         /*[4]*/
    }

    #a1 {
        width: var(--golden-ratio);                                                   /*[5]*/
        height: 100%;                                                                 /*[6]*/
        background-color: #4cd2e4;
    }

    #a2 {
        width: calc(var(--parent-size) - var(--golden-ratio));                        /*[7]*/
        height: 100%;                  
        background-color: orange;
        display: inline-flex;
    }

    #a3 {                                                                             /*[8]*/
        width: 61.8%;
        height: 38.2%;
        background-color: red;
    }

    #a4 {                                                                             /*[8]*/
        width: 38.2%;                      
        height: 38.2%;
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
3. In order to also automatically change the height of the element, depending on the width.
4. Apply `inline-flex` value to `display` property. We use inline-flex instead of inline-block CSS property here, because
 **block-level element** will _always_ start from a new line, so inline-block element will be in line within which it's embedded.
  `Inline-flex` causes an element to generate a flex container box that is inline-level when placed in flow layout.
5. To make a square block whose side will be equal, the height of the parent element.
6. The height property specified in percent means the height relative to the outer block.
7. To fill the remaining space. We can do the same by using 38% instead.
8. Example of using a percentage ratio.
  
  >Note that we cannot use interest only. Since the percentages are relative values, we need to calculate at least 
  the size of the parent container, and only then apply the percentages to the child elements

Try it on [codepen](https://codepen.io/Halochkin/pen/oKBVNZ?editors=1000)
 
 ### 2. Font size and line height
 
Each block of text on the site has three main dimensions for typography, two of which are _vertical_ - font size 
(`font-size`, if expressed in CSS) and line height (`line-height`), and one _horizontal_ - line length (as such, 
there is no analogue of "line-width" in CSS, but there is a usual `width`).
 
Line width directly depends on the size of the block, in which the text is placed, as well as on the shifts placed in 
it on the next line. Line height in the absence of other properties is automatically calculated on the basis of font metrics.

Obviously, there is a proportional dependence between font-size and line-height: the bigger the text size is used, the 
bigger the height of its line should be, otherwise the geometric proportions of the paragraph are violated and the 
readability is reduced.
 
 The ease of perception of the text block is similarly affected by the length of lines: the longer it is with the same 
line-height, the longer it takes the human eye to move the eye from the end of one line to the beginning of the next. 
In other words, the interlinking in a text with a long line length should allow the reader's eyes to easily switch to 
the next line after reading the current one.
 
From the dependence of all three dimensions it follows that the mathematical proportions of typography should be in
harmony, so that the content of the site looks orderly and visually attractive. This is an important factor influencing 
the perception of content. Effective and harmonious mathematical expression of these proportions can be achieved through
a universal ratio - the golden ratio.
 
#### Example

```html
<style>
    #b {
        font-size: 40px;                                                       /*[1]*/
    }

    #b1 {
        font-size: calc(1em / 1.618);                                          /*[2]*/
        line-height: 1.618em;                                                  /*[3]*/
    }

    #b2 {
        font-size: 61.8%;                                                      /*[4]*/
        line-height: 161.8%;
    }
</style>

<div id="b">Title
    <div id="b1">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur dolorem eaque eum expedita
        explicabo id,
        in nemo numquam repellat similique totam vitae? Commodi consequatur doloribus expedita, laborum pariatur placeat
        saepe!
    </div>
    <hr>
    <div id="b2">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum, pariatur, tenetur? A enim molestias
        necessitatibus tempora ut. Accusamus cum cupiditate est excepturi, obcaecati quae quod ratione, rem
        reprehenderit, ut velit.
    </div>
</div>
```
1. Parent element font-size.
2. The `font-size` property of the child element will be `1.618` times _smaller_ than the parent element.
3. And the `line-height` property will be `1,618` times `larger` than the `font-size` of the child element.
4. Also we can use percentage ratio.

Try it on [codepen](https://codepen.io/Halochkin/pen/NQjPXG?editors=1000)

 ### Conclusion
This is what the key to understanding how the theory of the gold ratio, the gold ratio is used in web design looks like.
And there is nothing difficult, though to take advantage of calculations sometimes it is not superfluous. On the other
hand, even if the designer does not strive to thoroughly list and check everything, he still can get a very good and 
harmonious design. The reason is that a person is already naturally able to perceive beauty, perfection, correctness 
of proportions and shapes.
 
 
 