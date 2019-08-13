# Audio feedback categories

Why do we need the sounds in the interface?

Sound is a feedback mechanism for applications and devices. For example, buttons emit a beep when pressed. It is used
everywhere: in cars, toys, cars and smartphones.

Sometimes it is ignored in the development of applications, which is wrong: if all sounds are removed from applications 
and services, they will feel as bad and empty as if they were muted in a game or movie.  Your ears are a receiver of 
information, just like your eyes. Auditory receptors perceive sound waves, vibration sends signals to the brain and
 emotions. The viewer turns on the imagination and the brain begins to form associations. Interest in the product is growing.

There are a few examples of sound becoming a tool.

Let's divide all the sounds in the app into two categories: 
1. `app feedback` - which are higher level, "business logic", app-specific, often intrusive, foreground feedbacks such as
heroic sounds.
2. `event feedback` - which are lower level, generic, non-intrusive, background feedbacks that in design aim for reuse
across many different apps and app genres.

## App feedback
Feedback sounds allow us to navigate and facilitate interaction with the application. Sounds in the app inform the user 
of the action taken. This is convenient. Different apps have their own types of sounds. There are many types of
applications that have sounds in common, so let's look at some of them.

### Finance
The user hears the ringing of spent coins when distributing the budget by target. The case when sounds do not have 
special value, but complement the picture.

#### Sports apps
For example, athlete-centric applications have a stopwatch function. At startup, like an arbiter, a loud voice counts 
down the seconds before the start, and at the end loudly tells you that the time has elapsed.  It's convenient to hear 
a sound from your pocket while you're doing sports.

### Education, children's development
Such applications are designed for children, so the sounds used in them must be melodic. In addition, it is appropriate
to use sound in the background in such applications, which should set the young user up for reflection. If these
applications are quizzes, in case of successful completion of tasks they should be praised and a solemn melody should
be selected.

## Event feedback
These sounds are the result of custom events. These applications are characterised by frequent use and are designed to
be used in the background, for example.

### Social networks
For example, if a user hears a sound in the Facebook application after a pile down in a news feed or in a message, the
user realizes that the feed has been updated, the phone has the internet, and the user is online.
In addition, Facebook voiced notifications of new messages, updates, Like button, transitions, message editing.

#### Online shops
The sound of the notification can serve as information at the abstract level. For example, if a user orders a product
with home delivery. The process can be divided into three stages, each user receives a notification, which will be 
similar to the previous one, but with some changes.
Order confirmation is one note.
The order is completed or prepared - a second note is added to the first one, forming a chord.
On the way order - full notification sound.
The user follows the progress of the order by sound, without distraction from other matters.

## Tips for using sounds in applications

### Make the sounds simple.
Sound should be part of the product design, and it should be simple. Too complex or time-consuming melodies will spoil
the user experience over time. Think about how users interact with the application, how often they press buttons or 
receive notifications. For example, for mobile devices, people prefer short, warm sounds.

### Sounds need to come together as a family.

They should be similar in characteristics, but distinctly different. For example, if you use a set of sounds based on a 
sound instrument, it means that you add different tonalities that are clearly different for users without musical 
education. In this case, using sounds from different instruments is not a good idea.

### More is not always better.
Ask the question: "Is this sound necessary? Once again, we turn to visual design: not always an abundance of effects 
will lead to good feedback from users. Too many sounds can tire you out, reduce their effectiveness and become annoying 
over time. Using the app should not be like playing a musical instrument. The quickest way to get annoyed is to make a 
sound at the slightest change in the state of the application. This will be distracting and the user will find it much 
more difficult to navigate the application.  If there is a need to do so, select short, tidy sounds that will not drive 
you crazy if you repeat them frequently. And also be sure to provide in the application the possibility of muting sounds


### Long sounds.
With long sounds, there's a better chance of making a mistake. They can be more intrusive, create a sense of 
"retardation" in the interface, and generally have a negative impact on user experience. For example, a user can make
a new event requiring a new sound faster than the previous one. Calculate the minimum time between such events and choose
the optimal sound length so that they never resonate. 

### The most important thing is the ability
Even the right sounds can lead to a negative response from users if you don't pay close attention to testing and leave small bugs.
For example, you need to check the duration of the sound relative to the visual elements and achieve synchronization.
One of the most important points is the relative volume of the individual sound in relation to all others in the product,
as well as the total volume. They should be perceived as intended: even a pleasant and melodic signal will be perceived 
aggressively if the volume is higher than necessary. Therefore, audio feedback should be quieter than system sounds at
the same volume level.

## When it's not worth using sounds.

If the product is a working tool that is commonly used in the office environment, it is probably worth refraining from 
using sounds. Imagine a full office of thirty people in which everybody has something bubbling and clicking every second
 - it can turn into a continuous noise and have a negative impact on working conditions. The same applies to education.

Also, in most cases it is not recommended to use sounds on websites. Of course, only if it does not contradict the idea
of the project . Nobody expects to hear sound, let alone music on the site, so it is unlikely to be a pleasant surprise,
but rather will push the user away.

