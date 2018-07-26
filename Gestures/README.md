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
Gestures can help pave the way for more beautiful interfaces, because many of these actions can be hidden in the interface. Gestures provide speed in user action and are a convenient way for users to interact with devices of different shapes and sizes.
In addition only a beautiful design applications — enough so that it became popular. In the era of touch devices, the design of the application should be intuitive. 
 It is logical that the functions of mobile applications provide more control over navigation than the usual button presses. Because applications have less space for traditional buttons, they allow users to open or hide different menu blocks with different gestures.<br>
 To increase the number of gestures, you can add a minimum duration in milliseconds, which allows you to create two similar gestures and add a conditional border that allows you to switch between them depending on the the minimum duration and use two gestures to activate different functionality. 
All `gestureMixins` implement two gestures. The first is basic and it does not need certain conditions under which it will be activated.  The second gesture is the advanced version of the basic gesture, which has more functionality. But how to separate these gestures? This requires minimal settings to activate the advanced gesture, and it does not apply to the basic version. These minimal settings are based on minimum duration and distance. This is done to prevent accidental activation by the user of the extended gesture. The basic gesture is activated without restrictions.
#### ±100ms is a lot.
Our life is full of events of millisecond duration, for example, one blink lasts about a third of a second. The human reaction time is about 100-200ms plus the time it takes to perform an action in response to an incentive. 
For example, if the user interface of a program reacts to user actions longer than 200ms, then the user starts to feel the delay if less than 50-the user perceives the interface response as instantaneous.
#### Minimum setting values. How to find the 'Golden mean'?
Let's look at a small example:
```javascript
static get minSettings() {
      return {
      minDistance: 50,
      minDuration: 150
      };
    };
```
Using the `minSettings()` allows you to switch between two gestures. It checks whether the base version will become advanced or not. If the conditions are met, the base version is `transformed` into extended version, if not - only the base version is activated.
The `minDistance` value is the distance between the end event (which meets the minimum duration requirements) and the extended event.
The `minDuration` is equal to the duration of the final event ("touchend","mouseend" etc.). Each advanced gesture has 2 stages of checking for matches with the minimum settings. The first is to check that the final event will last more than 150 milliseconds. If not, the extended gesture will not be executed and the base gesture will be activated. The next check is the distance check. This means that the user has to change the position of the touch/mouse point by more than 50 pixels in 150 milliseconds.<br>
#### The optimal value for the minimum duration?
 Looking at the fact that most users use intuitive gestures that will allow you to predict what movement will start a certain command. This means that on an intuitive level, users will use the drag event to flip through photos. 
To perform all gestures you need to make a sequence of events: 
* Initiation: Initial contact to start an action, such as a click or tap.
* Movement: some movement on the screen to make something happen.
* End: end gesture as the contact with the screen ends.
If the minimum duration of the action you add as a condition to activate the modified gesture is too small then if you just click on the screen, the script can register this as a small movement that can take less than `5ms` and perform the action.
If the duration is too long the users will be upset because most of them are "too lazy" and do not want to perform gestures more than `500ms`. If your delay is equal to or greater than `400ms` - the chance of successful activation is reduced by `60%`, and the functionality that must be activated by a modified gesture will not work, and this is not what users expect from your application. 
`The optimal delay is 100ms` because if the user interface of the program responds to the user action longer than 200ms, the user starts to feel the delay if less than 50-the user perceives the interface response as instantaneous. A 100ms will not cause a noticeable delay, and prevent accidental activation.
### Multifinger gestures
Mobile applications are becoming more complex and richer, and developers need mechanisms to handle touch events efficiently. For example, many games require you to press multiple keys at the same time – in the context of a touch screen, this means touching multiple points at once. <br>
The problem of developing multi-finger gestures suggests that the trigger mechanism is not the only one. It can be first one finger, then two, then three. It can be one and two and three at the same time. It could be one and two and three. Also, you often don't want a user who used four fingers and then deleted two fingers and then added one to trigger a three-finger gesture. <br>
To solve this problem, a pattern () was created that assigns an ID to each finger and prevents the accidental start of the multi-finger gesture if the touch presses were not sequential.


### A review of my custom gestures
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
