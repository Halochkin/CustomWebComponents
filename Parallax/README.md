The parallax illustrate how tightly connected positioning and scrolling is in web applications. 
The parallax does two simple things:
 1. It sets up a positioning/layer system not very different from position: 
absolute or fixed, but in 3 dimensions(+ extra animations on entry and exit). 
2. It adds a custom scroll logic that affects the layers differently. That's basically it. Parallax could very well be a 'display' type in css.

The parent is needed for two purposes.
1. Create a container for the layout of the child elements. Css require layout often needs two elements to be defined, for example position absolute is calculated against the nearest parent with position relative, fixed or absolute.
2. The parent observes the outside context. Outside changes would be the same to all, and thus it is more efficient if the single parent observes it, processes the data, and then alerts its children.
The child does two things:
1. It provides its parent with a set of methods it can use to alert it about context changes.
2. It updates its own style and shadowDom to reflect these new changes.
3. Observes its own attributes and updates its content when these also changes.



