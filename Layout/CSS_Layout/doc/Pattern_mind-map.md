Pattern 4c: mind-map.
This is a recursive set of elements.
It can room two types of children. Mind-unit and mind-map.
In the mind-unit, the text etc is added. If you add another mind-map, it will be positioned according to a spread function that will populate the four corners first. Then it will have an algorithm that finds positions from slotCallback in a not-too-clever way.
The mind-unit is transform super small at first, then it is gradually scaled up until it is not bigger than the borders it is allowed to consume, which is specified top down.
When you scroll, you move down the mind-map tree-order.
The mind-map is like an internal link. It will add a #id to the url. Thus.
If you click on a mind-map, you will scroll to it.
Press back, and you will scroll back.
The problem with the mind-map is the transform method of the inner mind-maps. The mind-map needs the layoutCallback.
The mind-map should later be moved to the chapter on layoutCallback

he map uses two fingers to scroll /pan inside the map element, and one finger to scroll /pan the main document. This is a practice. The more nested the scroll level of the element is, the more fingers.
The map is a layout element. It handles scroll /pan, and zoom in/out, and it sets up a series of image elements. And it often also handles lazy loading of images, so the map can load nimbly and efficiently.
It require a little logic to map which coordinates will trigger the loading of which images. But, this should be mapped not to individual urls (a list of urls), but to a string with regex style format for asking for images.