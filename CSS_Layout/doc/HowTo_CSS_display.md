# HowTo: CSS display

Every element on a web page is a rectangular box. The display property in CSS determines just how that rectangular box behaves.
The `display` property: 
1. defines element display method.
2. is the main CSS property of layout control.


There are several values, but we will look at the four most common:

### `1. block`

 **`Block`** value set allows us to specify the height and width parameters. However, it cannot be used to display an 
 element around other elements. With display: block property, an element will always appear in a new line. A block-level
 element begins on a new line and takes up all the width (from right to left).
 
It have the following features:

* Before and after the block element, there is a line break.
* Block elements can be specified as width, height, internal and external indents.
* Occupy all available horizontal space.
* Such tags as: `<p>`, `<h1>`, `<h2>`, `<ul>` are block by default.

Another important block tag is the `<div>` tag, which simply means "block" or "rectangular container". This tag is most 
commonly used to create grids.

### `2. inline`

 **`Inline`**  property are arranged elements one after another in one line, if necessary, the line is transferred. 
An inline element starts on the same line as block and takes up a necessary width.

Features of inline elements:
                 
* Before and after the line item there are no line breaks.
* The width and height of the line item depends only on its content, you can not specify the dimensions using CSS.
* Only horizontal indents can be specified.
* Top and bottom CSS paddings and CSS margins are not respected with display: inline property in place.
* Such tags as: `<a>`, `<strong>`, `<em>`, `<span>` are inline by default.

### `3. inline-block`

The simpler way to place several elements with specified sizes in a row is to use **`inline-block`** property. 
The difference between `display: inline-block` and `display: block` is that, with `display: block`, a line break happens
 after the element, so a block element doesn’t sit next to other elements.
  
Features of `inline-block`:

* They can be used to set sizes, frames and indents, as well as for block elements.
* Their default width depends on the content, not on the full width of the container.
* They do not generate forced line breaks, so they can be placed on the same line as long as they are placed in the parent container.
* The elements in a single line are aligned vertically in the same way as the string elements.

### `4. none`
The value of **`none`** of the display property is used very often. It can be used to hide an item as if it wasn't there.
The hidden element is not displayed and does not take up space on the page. This property is used when creating drop-down menus,
dynamic galleries, switching tabs, and more.

Features of `none`:

* is commonly used to show or hide elements without recreating and deleting them in Javascript.
* is used by default with the <script> element.

Try the difference on [codepen](https://codepen.io/Halochkin/pen/ydwPyE)

