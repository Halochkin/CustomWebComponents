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