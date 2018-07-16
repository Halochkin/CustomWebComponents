# Gestures
### Description of the most common gestures
  Our hands are a great tool for communication with people and the environment. With our hands we can create something beautiful, 
show our emotions (raised thumb up), and even decide the fate of other people (lowered thumb down, in the Roman Empire or on Facebook).
Some time ago, technology allowed us to manipulate information with our hands. 
Using gestures to control mobile devices has become a daily activity. Push-button mobile devices are a thing of the past. Even my grandmother uses the phone's touch screen.
Now all the power of communication is in our hands.
But to show the maximum potential of mobile devices with touch screens, we need to explore a way to communicate with these devices.
And it is quite simple: gestures.

### What are the gesture settings for?
All gesture mixins implement two gestures. The first is basic and it does not need certain conditions under which it will be activated.  The second gesture is the advanced version of the basic gesture, which has more functionality. But how to separate these gestures? This requires minimal settings to activate the advanced gesture, and it does not apply to the basic version. These minimal settings are based on minimum duration and distance. This is done to prevent accidental activation by the user of the extended gesture. The basic gesture is activated without restrictions.
#### Minimum setting values. How to find the 'Golden mean'?
Let's look at a small example:
```javascript
static get minSettings() {
      return {
      minDistance: 50,
      minDuration: 200
      };
    };
```
Using the `minSettings()` allows you to switch between two gestures. It checks whether the base version will become advanced or not. If the conditions are met, the base version is `transformed` into extended version, if not - only the base version is activated.
The `minDistance` value is the distance between the end event (which meets the minimum duration requirements) and the extended event.
The `minDuration` is equal to the duration of the final event ("touchend","mouseend" etc.). Each advanced gesture has 2 stages of checking for matches with the minimum settings. The first is to check that the final event will last more than 200 milliseconds. If not, the extended gesture will not be executed and the base gesture will be activated. The next check is the distance check. This means that the user has to change the position of the touch/mouse point by more than 50 pixels in 200 milliseconds.<br>
### ±100ms is a lot.
What will happen if you choose the wrong minimum duration settings? If the minduration is set to 5ms, then if you simple happen to click on the screen, the screen might register this as a small movement that takes 5ms. If such a touch triggers lots of later movement in the element triggered by spin or fling, your element will feel more like a licing insect than a reactive ui control.
If your duration is too long, ut will frustrate users that are in a hurry. A user might try to quickly navigate to a point making a quick spin or fling. That might take as little as 150ms. If you have set the duration to 300ms, your hurried user will be more and more frustrated with your rigid web app.<br>

### A review of the gestures
This repository contains all the basic gestures used on mobile devices: and combined into functional mixins:
* ### [`DragFlingMixin`](https://github.com/Halochkin/Components/blob/master/Gestures/DragFlingMixin/README.md)
This mixin support for one-finger gesture for `drag` on the screen, commonly used to move and/or scroll elements on the screen.
`Fling` gesture is analogous to the [`drag-and-drop`](https://ru.wikipedia.org/wiki/Drag-and-drop) which is familiar to everyone on desktop computers. A long press on a moving object activates the ability to move it by dragging.
It occurs periodically on all platforms (for example, to change the location of the icon on the desktop, change the order and location of elements, etc.). and triggered when the finger is removed from the screen while in motion, the dragging ends abruptly.
* ### [`PinchSpinMixin`](https://github.com/Halochkin/Components/edit/master/Gestures/PinchGestureMixin/README.md) 
 This mixin records a sequence of two-finger `"touchstart"`, `"touchmove"` and `"touchend"` to callback/event.
Adds support for for two finger gestures such as:
  - pinch (used to for example zoom-out or shrink)<br>
  - expand (used to for example zoom-in or grow)<br>
  - rotate (used to... rotation)<br>
  - two-finger-drag (used to move a subselection of a page, when single-finger-drag is used to navigate the page as a whole)<br>
  - spin (used to trigger animations).<br>
 * ### [`Event Simulator`](https://github.com/Halochkin/Components/tree/master/Gestures/EventSimulator)
 Event Simulator allows to simulate custom events based on a sequence of events without physical interaction. You can add the number of touch points, the element on which the event will occur and timeout of execution.
 Simulator support 3 main type of events: "start", "move" and "end". And you can set the required type of event, for example "mouse" or "touch".
 [`You can test these gestures yourself`](https://rawgit.com/Halochkin/Components/master/Gestures/GesturesTest1.html)

### Pros and cons of gestures
Gestures offer significant opportunities for managing mobile devices. You can create a huge number of different combinations that will cause different actions. This allows you to get rid of unnecessary buttons in the interface and add interactivity. Also it gives the user a sense of direct interaction with the interface elements and increases the sense of involvement when manipulating objects.
The most basic drawback of gestures is their unintuitiveness. You can expect people to be familiar with the gestures listed above, but they are completely unfamiliar with the rest of the gestures.<br>
If you decide to add additional gestures to your app to control it, users will have to learn how to use the new gesture. This will require the creation of a special training unit or additional tips.
People don't like to learn something new, especially in applications. A lot of new information leads to misunderstanding and refusal of the application. Therefore, it makes sense to enter gestures into the interface gradually, one at a time.
Also, there is a high risk of misunderstanding how your application works if you hide the buttons of the main actions and replace them with gestures.
Therefore, if you plan to add your gestures to the application, you need to solve the following:
- How much demand for additional gestures to your users
- They do not conflict with the gestures of the operating system
- How will you teach new user gestures
### Discussion: advices how to use custom gestures.
#### Avoid conflicts of your gestures with the system!
If your app is designed to remap a standard gesture then it may confuse users.
#### Do not duplicate the functionality of standard gestures with new ones.
If you want to replace the standard gesture with your own, then most likely it will push the user away, because learning new gestures for the sake of one application is an occupation that not all users will decide on.
#### Be careful with complex gestures.
Leave the user an alternative way to perform an action with the help of interface elements, because even if the gesture will provide a more convenient and fast way, it is less obvious action, as it is not reflected in the graphical interface.
#### Don't forget that the user is concentrating on the content.
If you can perform an action, both with the help of a complex swipe, and with two or three clicks, it is more likely the user will prefer the second method, since it is more obvious. If the gesture system is complicated, the user will start thinking about how to control the application, not what he wants from it.

### Reference
* [Pinch-zoom-gesture](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Pinch_zoom_gestures)
* [Touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
