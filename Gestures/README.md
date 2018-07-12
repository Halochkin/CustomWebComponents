# Gestures
### Description of the most common gestures
  Our hands are a great tool for communication with people and the environment. With our hands we can create something beautiful, 
show our emotions (raised thumb up), and even decide the fate of other people (lowered thumb down, in the Roman Empire or on Facebook).
Some time ago, technology allowed us to manipulate information with our hands. 
Using gestures to control mobile devices has become a daily activity. Push-button mobile devices are a thing of the past. Even my grandmother uses the phone's touch screen.
Now all the power of communication is in our hands.
But to show the maximum potential of mobile devices with touch screens, we need to explore a way to communicate with these devices.
And it is quite simple: gestures.

This repository contains all the basic gestures used on mobile devices: and combined into functional mixins:
* ### [`DragFlingMixin`](https://github.com/Halochkin/Components/blob/master/Gestures/DragFlingMixin/README.md)
Adds support for one-finger gesture for `drag` on the screen, commonly used to move and/or scroll elements on the screen.
`Fling` gesture is analogous to the [`drag-and-drop`](https://ru.wikipedia.org/wiki/Drag-and-drop) which is familiar to everyone on desktop computers. A long press on a moving object activates the ability to move it by dragging.
It occurs periodically on all platforms (for example, to change the location of the icon on the desktop, change the order and location of elements, etc.). and triggered when the finger is removed from the screen while in motion, the dragging ends abruptly.
* ### [`PinchSpinMixin`](https://github.com/Halochkin/Components/tree/master/Gestures/PinchGestureMixin) 
Adds support for for two finger gestures such as:
  - pinch (used to for example zoom-out or shrink)<br>
  - expand (used to for example zoom-in or grow)<br>
  - rotate (used to... rotation)<br>
  - two-finger-drag (used to move a subselection of a page, when single-finger-drag is used to navigate the page as a whole)<br>
  - spin (used to trigger animations)<br>
  These gesture are mainly used to zoom in/out images, zoom in/out maps, zoom in/out web pages. A pinch gesture reports changes to the distance between two fingers touching the screen. Pinch gestures are continuous, so action method is called each time the distance between the fingers changes. <br>
 [`You can test these gestures yourself`](https://rawgit.com/Halochkin/Components/master/Gestures/GesturesTest1.html)

### Pros and cons of gestures
Gestures offer significant opportunities for managing mobile devices. You can create a huge number of different combinations that will cause different actions. This allows you to get rid of unnecessary buttons in the interface and add interactivity.
The most basic drawback of gestures is their unintuitiveness. You can expect people to be familiar with the gestures listed above, but they are completely unfamiliar with the rest of the gestures.<br>
If you decide to add additional gestures to your app to control it, users will have to learn how to use the new gesture. This will require the creation of a special training unit or additional tips.
People don't like to learn something new, especially in applications. A lot of new information leads to misunderstanding and refusal of the application. Therefore, it makes sense to enter gestures into the interface gradually, one at a time.
Also, there is a high risk of misunderstanding how your application works if you hide the buttons of the main actions and replace them with gestures.
Therefore, if you plan to add your gestures to the application, you need to solve the following:
- How much demand for additional gestures to your users
- They do not conflict with the gestures of the operating system
- How will you teach new user gestures
### Reference
* [Pinch-zoom-gesture](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Pinch_zoom_gestures)
* [Touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
