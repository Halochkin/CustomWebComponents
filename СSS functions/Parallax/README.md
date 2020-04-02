The parallax illustrate how tightly connected positioning and scrolling is in web applications. 
### The parallax does two simple things:
 1. It sets up a positioning/layer system not very different from position: 
absolute or fixed, but in 3 dimensions(+ extra animations on entry and exit). 
2. It adds a custom scroll logic that affects the layers differently. That's basically it. Parallax could very well be a 'display' type in css.

### The parent is needed for two purposes.
1. Create a container for the layout of the child elements. Css require layout often needs two elements to be defined, for example position absolute is calculated against the nearest parent with position relative, fixed or absolute.
2. The parent observes the outside context. Outside changes would be the same to all, and thus it is more efficient if the single parent observes it, processes the data, and then alerts its children.
The child does two things:
1. It provides its parent with a set of methods it can use to alert it about context changes.
2. It updates its own style and shadowDom to reflect these new changes.
3. Observes its own attributes and updates its content when these also changes.



### Parallax types
1. The placing of elements in 2d space
2. The placing of elements in layers, 3d
3. The placing of elements in time, 4d
4. How to journey in this space, both time and place, using non-semantic, (grammatical) universal means such as scrolling or swiping. 
5. The journey mechanisms are almost always bound together. Scroll: and you move both in space and time.
6. The mechanism is bidirectional, two way. You can go forward and backwards.
7. The mechanics of motion can be gradual and analogue, or stepwise and digital.


### The layout models are NOT:
1. About the shape of the elements.
2. The navigation is not semantic, ie. links. Intratextual (intra page) navigation using link clicks is *routing*.