#Pattern: comic-strip 
The comic-strip is the parent container. It mainly watches the scroll event. Whenever the scroll happens, it shifts a "_focus"
 property on all its comic-frame children to be +1 or - 1 to the left or right, depending the direction of the scroll.

The comic-frame children has the default style settings. It has a transition to gradually move between states. When the
 position is +1, it is transformX(+100%),when it is -1 it is transformX(-100%).
The parent can specify its framewidth in an htnl-attribute,so that the frame can be either bigger or smaller than the
 parent itself. The frame can be left, center or right. It also has an html-attribute for height.

The user can override the animation /transition and display properties in the lightdom.
Add this to md file 4b-pattern-comic-strip.
The comic-frame child element could be inline-block/block. This might be two different child elements. If it is block, 
then it could have the height and width specified. And the parent and children both have :host{ overflow:hidden} which 
could be overridden from the lightdom.



Ok. If it was me, I would do it differently. First. You make the children position:absolute, left:0, top:0.
Second, you set an attribute on the child that is their _position. If the _position =0,it is in view. If it is - 1 it was the previous one, +1 it is the next one. -2,+2 etc.
When you scroll, the parent catches it, makes an idea of +/-1 or +/-2 on all the childrens position.
Third, in the children, you set transform: translateX(_position * 100%). This would move all the children correctly.
And then you make your own top scrollbar in the parent element.