A pattern that illustrate how the em and % are altered by styles inside shadowDom. Small chapter.


Problem: em..
The 1em size is the size of the current font-size. So, if a web comp has a div around its slot, and then sets a font - size on that div, then the em dimensions is altered in the lightdom.
If the div wrapped around the slot has a width size, then the width % of the lightdom child is altered. This might be what you want, as in the GoldenPage for example, but it also might not be what you want.
In this scenario, there might also be minor adjustments of margin and padding that is added to all elements. And box-sizing must be updated in the shadowDom style. For all the elements from :host and to the slots.
