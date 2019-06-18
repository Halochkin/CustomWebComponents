# ShowScrollState

The scroll bar is an integral part of most modern applications. Although this interface control has been used for a long time, its
functionality and ergonomic value, in our opinion, is not fully disclosed and can be significantly improved by some additions.
In addition, the scroll bar has navigation functionality (by the type of scroll bar, the user can determine in which area of the
document it is located).
There are two types of scrollbars: horizontal and vertical.

### Vertical scroll
Currently, the vast majority of websites on the Internet use vertical scrolling. The reason for the popularity of the vertical 
scrolling approach is obvious — it is easier to implement, it is familiar and used more often. Sites with vertical scrolling are
also considered more efficient.With vertical scrolling, the window moves up or down using
the scroll bar, allowing the user to see additional information in the window. For example, you might want to scroll down to continue 
reading the document or to view other parts of the page.

### Horizontal scroll

Recently, an approach to designing websites using horizontal scrolling has become more and more popular.
In contrast to the popular vertically-oriented layouts horizontal layouts have the advantage. They neatly provide only a small amount 
of information in the horizontal scroll area. And the key information can be fixed in a vertical space, drawing the attention of users 
not only design, but also positioning.

### How to turn on and off the display of the scrollbar
In some cases, you need to hide the scroll bar, but leave the scrolling functionality. To do this, you need to use CSS styles.
The problem is that there are no generic CSS property and different browsers use different ways to hide a scrollbar, for example:

```html
 <style>
 // Google Chrome
  ::-webkit-scrollbar {
     display: none;
  }
 // Mozilla Firefox does not support the pseudo-element, but has its own property that allows you to change the size of the scroll bar
   html {
     scrollbar-width: none;
   }
 // IE and Edge have their own special property for changing the scroll bar
 html{
     -ms-overflow-style: none;
 }
 </style>
```
The peculiarity is that each browser has its own way of changing the scroll bar and does not support others.   
It follows that you should use these properties at the same time to provide a modification of the scroll bar in different browsers.

### How to style the scrollbar efficiently

We can modify not only to hide the scrollbar, but we can also apply our own style to it. But as mentioned before,each browser has
its own way.   

#### Chrome:
Pseudo-elements allow you to apply regular css properties to the scrollbar. This means that you can apply the same styles
to the `<div>` element.
Since the scrollbar consists of several elements, we can refer to the scrollbar as a whole, and to an 
individual element.

* `::-webkit-scrollbar` — the entire scrollbar.
* `::-webkit-scrollbar-button` — the buttons on the scrollbar (arrows pointing upwards and downwards).
* `::-webkit-scrollbar-thumb` — the draggable scrolling handle.
* `::-webkit-scrollbar-track` — the track (progress bar) of the scrollbar.
* `::-webkit-scrollbar-track-piece` — the part of the track (progress bar) not covered by the handle.
* `::-webkit-scrollbar-corner` — the bottom corner of the scrollbar, where both horizontal and vertical scrollbars meet.
* `::-webkit-resizer` — the draggable resizing handle that appears at the bottom corner of some elements.

It is important to note that some scrollbar elements are not activated by default. Before you try to change individual scrollbar
elements, you must first activate them the value of the entire scrollbar using`::-webkit-scrollbar {display: block}`.

#### Mozilla Firefox
In Mozilla Fairfox there are only two scrollbar properties-width and scrollbar-color which give some control over how scrollbars
are displayed.

You can set the scrollbar-width to one of the following values:
* `auto` scroll bar Width is the default for the platform.
* `thin` is a Thin version of the scroll bar width on platforms that provide this option, or a thinner scroll bar than the default platform scroll bar width.
* `none` the scroll Bar is not shown, but the item will still scroll.

You can set the scrollbar-color to one of the following values  
* `auto` render platform is the default for the track portion of the scroll bar, in the absence of any other associated scroll bar color properties.
* `dark` show a dark scroll bar, which can be either a dark scroll bar option provided by the platform, or a custom scroll bar with dark colors.
*`light` shows a light scroll bar, which can be either a lightweight version of the scroll bar provided by the platform, or a custom scroll bar with light colors.

Note that you must first specify the property type and then override the property by adding colors.

```css
html{
   scrollbar-color: light;
   scrollbar-color: red green;  //Red color applise to the track and green for the draggable handle
  }
```

#### Internet Explorer / Edge
In both Internet Explorer abd Edge , you can only change the colors of individual scrollbar elements
* `scrollbar-face-color` — color of the drag-and-drop scroll handle.
* `scrollbar-arrow-color` — color of the scroll button (up and down arrows).
* `scrollbar-track-color` — color of the track (progress bar) of the scrollbar.
* `scrollbar-shadow-color` — the color of the shadow (located on the right side)
* `scrollbar-highlight-color` — the color of the highlight (located on the drag-n-drop handle)
* `scrollbar-3dlight-color` — the color of the border
* `scrollbar-darkshadow-сolor` — the color of the dark shadow (located on the right side)

 ![IE scroll bar property](https://newwavenewthinking.files.wordpress.com/2014/01/custom-scroll-bar-for-ie.png)

### Reference
* [MDN: ::-webkit-scrollbar](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar)
* [CSS Scrollbar](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scrollbars)
