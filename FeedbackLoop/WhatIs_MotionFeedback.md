# WhatIs: : MotionFeedback 

To use the mouse, the user is completely dependent on the system feedback. Just imagine trying to move the mouse around 
on a web page without seeing the mousepointer and to click on an element. The visual feedback of the mouse cursor is as 
central to the mouse as its buttons.  

Similarly, when a user does a motion gesture, he or she needs feedback to "feel" what he is doing. When a user gestures 
with a phone, there are four senses that can perceive it:
1. sight: for most motions, the user can see his or her hand move, usually in the peripheral vision. The screen might 
also show some visual representation of the motion, as a bubble in a bubble level. However, very often the screen is not
 visible during motion gestures, and motions can be done wholly or partially out of a user's line of sight.
2. tactile sense. As gravity constantly pulls on a mobile phone towards earth, its weight in the hand can be constantly 
felt by its user. Furthermore, device motion will apply sentrifugal forces to the unit in the hand. The user can feel 
where the phone is.
3. hearing: a select few, abrupt motions might make low "swosh" sounds as the phone flies back and forth through the air.
4. Proprioception: the user can sense how the muscles and joints and bones in the body are positioned against each other. 
This gives the user the ability to physically sense his body motion from within, without gravity.

## Problem with motion senses

However, as most developers quickly realize when they try to implement these responses is that the sensory feedback given
 the user during motion gesturing is lacking.
* sight: when the user gestures with his or her phone, the screen might often be unavailable. It is out of sight, or 
tilted at an angle that makes it invisible. Secondly, for sight to be an effective means of control, as with mouse, there
 can be very little delay in the user processing the feedback. If the symbolism require conscious mental processing to 
 be understood, the users cognitive processes just takes too long for the visual ques to be effective as means to control
  the feedback loop and the user's own actions. 
* hearing: this is essentially non existent.
* the tactile sense is also faulty. In order for the hand to prevent loosing the phone to the ground, potentially 
destroying the 500$ love of your life machine, the user will hold on to it tight. This means that it will be hard to 
distinguish between the tactile pressure that comes from gravity and the tactile pressure that comes from gripping the 
phone. And our tactile sense is also kinda coarse when it comes to orientation. Sure, we might be able to respond to 
increasing pressure quite well so as to keep a batong stick in balance, but to position something 60degree we need to 
rely on our proprioception sense.
* proprioception is the strongest feedback we have for our motion gestures. You can sense it if you close your eyes and 
then try to move the phone into different positions and degrees. However, most of us are quite unskilled in using this 
sense with any accuracy. And you can see this by moving the phone around a bit with your eyes closed, then try to quickly
 place it level and open your eyes. Most will then quickly see quite substantial corrections being available. 




## Adding sound and vibration as motion feedback

Thus, we need to add sound and vibration as feedback for the motion gestures. Sound is a great alternative as sight and screen is often unavailable *and* because the human brain is more adept at computing sound input as a means to correct muscular motions quickly. The user can process sound input x-amount faster than sight.
The question is :
what kind of sound feedback should motion gestures use? Which dimensions of motion are there that need sound feedback, and how can we give this feedback to the user in an unobtrusive, yet guiding way?