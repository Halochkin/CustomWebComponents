1. HowTo: css display.
2. Pattern: GoldenPage.
3. HowTo: css position
4. Pattern: parallax
5. HowTo: css grid
6. Pattern: GoldenGrid.
7. Pattern: TwelveGrid.


It feels especially clear how the css position is the entrypoint for parallax. And, it is also evident that both css grid and display are not linked to scrolling the way parallax is. But the GoldenGrid and TwelveGrid likely would like to be able to control scrolling the way parallax and position-layers do. To mark one or two of the layers as none scrollable/fixed is essential.
Add this list as end comments in the chapter howto css position.
And then also, we can have the mind-map and cartoon-frame scrolling.
4b. Pattern: comic-strip.
The comic-strip is the parent container. It mainly watches the scroll event. Whenever the scroll happens, it shifts a "_focus" property on all its comic-frame children to be +1 or - 1 to the left or right, depending the direction of the scroll.

The comic-frame children has the default style settings. It has a transition to gradually move between states. When the position is +1, it is transformX(+100%),when it is -1 it is transformX(-100%).
The parent can specify its framewidth in an htnl-attribute,so that the frame can be either bigger or smaller than the parent itself. The frame can be left, center or right. It also has an html-attribute for height.

The user can override the animation /transition and display properties in the lightdom.
Add this to md file 4b-pattern-comic-strip.
The comic-frame child element could be inline-block/block. This might be two different child elements. If it is block, then it could have the height and width specified. And the parent and children both have :host{ overflow:hidden} which could be overridden from the lightdom.
Add these to texts(!)


The map uses two fingers to scroll /pan inside the map element, and one finger to scroll /pan the main document. This is a practice. The more nested the scroll level of the element is, the more fingers.
The map is a layout element. It handles scroll /pan, and zoom in/out, and it sets up a series of image elements. And it often also handles lazy loading of images, so the map can load nimbly and efficiently.
It require a little logic to map which coordinates will trigger the loading of which images. But, this should be mapped not to individual urls (a list of urls), but to a string with regex style format for asking for images.