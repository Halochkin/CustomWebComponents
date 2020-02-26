#WhatIs: `resize`

The `resize` event fires when the document view (window) has been resized.

The user agent must fire an Event named resize at the `VisualViewport` object if any of its height, width, or scale attributes change.

The resize event must not bubble and must not be cancellable.


If documents viewport has had its width or height changed (e.g. as a result of the user resizing the browser window, or changing the page zoom scale factor, or an iframe element’s dimensions are changed) since the last time these steps were run, fire `resize` event at the `window` object associated with document.



### References 
[Resize viewport](https://drafts.csswg.org/cssom-view/#resizing-viewports)