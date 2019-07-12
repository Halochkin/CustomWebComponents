# HowTo: CSS position

The `position` property defines the type of positioning relative to the browser window or other elements.
It is used together with `top`, `right`, `bottom` and `left` properties to position the element in the right place.


The dimensions of the absolutely positioned element (absolute), which has a set value of auto for the properties of width 
and height, correspond to its content. At the same time, the block can occupy the entire height of the parent element
 if it is set to `0` for `top` and `bottom`, as well as an undefined height (auto). In this way it can also be stretched
  horizontally: with certain `left` and `right` and undefined widths.

>But in all other cases:
> * If both top and bottom are set _at the same time_ (and height is defined), top is applied (bottom is ignored).
> * If both left and right are set _at the same time_ (and width is defined), left is applied (right is ignored).

The most commonly used values are:

### `1. absolute`
Removes the element from the common thread (_the place where the element has been released is filled by other elements_) 
and is inserted in relation to its parent, not static positioned element, if there is no such element, it is considered 
to be a browser window (the width of the element, without the task, is set by its content). The new place is calculated 
with the help of left, top, right and bottom properties.
The position is affected by the value of the parent item's position property. For example, if the father's position is
set to static or if the father has no position, the coordinates are counted from the edge of the browser window.

### `2. relative`
 The position of the element is set relative to its current position. Adding the `left`, `top`, `right` 
and `bottom` properties changes the position of the element and shifts it in one direction or another. This property allows
 you to change the position of the element without changing the layout.
 
### `3. fixed`
In its effect, this value is close to absolute, but in contrast to it positions the element relative to the browser window,
 not the document and does not change its position when scrolling the web page.

Try it on [codepen](https://codepen.io/Halochkin/pen/QXoOgx?editors=0100)