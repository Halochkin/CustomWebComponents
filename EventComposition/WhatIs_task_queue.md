# What is task queue?

So, as we all know, JavaScript is a single-threaded programming language, single-threaded Runtime, it has one call stack.
 And it can do something one at a time, that's what a single thread means. It cannot pause event processing, switch to 
another event, and then resume execution of the first one. All events are processed sequentially and each event is processed 
until the end of the match. For the thread described above, the memory area is allocated - the stack, where the frames 
(arguments, local variables) of the called functions are stored.
 
>Stack - data structure, which is a list of elements organized on the principle of `LIFO` (last in - first out). Most often
the principle of stack operation is compared with a stack of plates: to take the second one from the top, you need to 
remove the top one.  

The call stack is basically a data structure that basically records where we are in the program, if we enter a function,
we put something on the stack, if we come back from the function we jump out of the top of the stack, and everything 
that this stack can do - so if you run this file, there is some sort of basic function, just like the file itself, so
we put it on the stack. 

The list of events to be processed forms a queue of events. When the stack is released, the engine can process the 
event from the queue. This process is coordinated in the event loop.

>Queue - data structure with the discipline of access to elements on the principle of `FIFO` (First In - First Out).
Adding an element (it is usually marked with the word enqueue - put in the queue) is possible only at the end of the 
queue, the selection - only from the beginning of the queue (which is usually called the word dequeue - remove from the queue),
while the selected element is removed from the queue.

### Why the composed event will be queued after the defaultAction? 

The problem is, why do we need to dispatch/propagate a composed event BEFORE the trigger event propagates completely? And 
the answer to that mystery is that: 
   1. the default action that accompanies the trigger event (ie. the showing of the context menu that accompanies a 
   click event), is added to the que at the same time as the trigger event is dispatched, combined with 
   2. the fact that to dispatch a composed event AFTER the trigger event has propageted, you MUST also put it in the task 
   que. This means that 
        * if you try to make a composed event propagate AFTER a trigger event has finished its 
   propagation, then 
        * it will ALWAYS run after the composed event.


What events are happening in the browser? There are so many of them:
- mouse clicks;
- Scrolling;
- Keyboard input;
- Loading scripts;
- and so on.

The browser can react to these events. For this event, you need to assign a handler, i.e. a function that will trigger 
when the event occurs. The function will not be executed immediately, it will be at the end of the event queue and will
be executed when its time comes. Since the events written are based on browser events (which cause initial trigger functions),
this means that initial events will be added to the queue before the events are written. The defaultAction of the 
initializing events will be activated first and then composed event will be queued.

### Problem: tasks scheduling

The **one important thing** is that the default task is scheduled **at the same time** as the event. Ie. Before the beginning 
og event propagation, not after the end of event propagation.

The ideal and desired outcome would be:
1. The trigger event propagates completely first;
2. The composed event propagates thereafter;
3. The default action at the very end.
    1. The trigger event (1) can prevent the default action (3), but not the composed event. The composed event will be dispatched.
    2. The composed event (2) can prevent the default action (3).

This is almost what native composed events do:
1. First mouseup;
2. Then click;
3. Then default action such as link navigation or context menu.
    1. Native trigger events cannot prevent default actions of native composed events, as the browser can expect the 
       developer to stop the default action from the native composed event. This is a difference with custom composed events.
    2. The native composed event such as click cam prevent the default action.


The problem is that the browser queues the default action task in the event loop just _before_ the trigger event begins its
propagation. from the developers perspective it "looks like" the default action is only added after the trigger event has
completed its propagation. but it is not so. The browser does not review the state of the event after it has completed
propagation, which is bad, but instead the browser adds both the trigger event and the default action to the event loop
at the very beginning. and when you call `preventdefault()` on the event, it tunnels a message from the event task to the
 default action task in a... not very pretty and definitively non-functional way. 

The consequence of this problem is that if you want to dispatch and propagate a composed event from a trigger event and 
the trigger event has a default action, you must either:
   * always run the default action every time;
   * always block run the default action every time;
   * dispatch and propagate the composed event before the trigger event propagates in the dom.

### setTimeout() / fireEvent()
You can set the function to be added to the timed event queue, i.e. after a certain time. This allows you to `setTimeout()`.

The first argument is the function we want to postpone execution of. The second argument is the time after which the
function will be added to the event queue (waiting time).

This  effectively puts the function that dispatches on the event queue and then returns immediately. Of course, the 
function will not be processed by the event queue until the UI thread is released

> But the second argument that defines the waiting time is not the guaranteed execution time, but the minimum execution time.

It is worth noting that `setTimeout()` is one of the few ways to interact with the sending queue. You can use it to add any
function to the send queue using 0 delay. The only problem is that the [HTML5 specification](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers) limits the time delay to
a minimum of 4ms. This is provided by most browsers, which means that your custom event will be slightly slower than you
might expect with 0 ms delay. Some older browsers have a minimum delay of 10ms. Of course, there will be no
waiting time until the function that used setTimeout finishes its work and returns the user interface stream to the dispatcher.

If you need the fastest custom event handling, you need to use the window.postMessage method, which is only supported by 
modern browsers. This places the message event in the event queue with the "fireEvent" message payload. As soon as the
user interface thread is released to handle the events, the message event occurs in the current window. There is no minimum
delay in using postMessage.

> Tasks added in the event loop task queue using the postMessage strategy is also dispatched AFTER the defaultAction. 
Thus, using postMessage to create async event doesn't provide a fix for the need for composed events needing to propagate 
prior to the trigger event.


### dispatchPriorEvent

The [PriorEvent](https://github.com/orstavik/JoiEvents/blob/bb0ab1b2c67e504954d64346da6cbd47d84400ea/docs/2_EventToEvent/7_Pattern3_PriorEvent.md) 
pattern propagates the custom composed event before the triggering event. Composed event is dispatched synchronously, 
so that it will start propagating immediately and thus precede the triggering event.


```javascript
  function dispatchPriorEvent(target, composedEvent, trigger) {   
    composedEvent.preventDefault = function () {                 
      trigger.preventDefault();
      trigger.stopImmediatePropagation ? trigger.stopImmediatePropagation() : trigger.stopPropagation();
    };
    composedEvent.trigger = trigger;                              
    target.dispatchEvent(composedEvent);                          
  }

```

### Example 

```html
<div id="test1">Open my context menu </div>
<div id="test2">Open my context menu also</div>

<script>

  let element1 = document.querySelector("#test1");
  const composedEvent = new CustomEvent("custom-contextmenu", {bubbles: true, composed: true});

  function dispatchPriorEvent(target, composedEvent, trigger) {   //1
    composedEvent.preventDefault = function () {                  //2
      trigger.preventDefault();
      alert();
      trigger.stopImmediatePropagation ? trigger.stopImmediatePropagation() : trigger.stopPropagation();
    };
    composedEvent.trigger = trigger;                              //3
    target.dispatchEvent(composedEvent);                          //4
  }

  element1.addEventListener("contextmenu", trigger => {
     dispatchPriorEvent(trigger.target, composedEvent, trigger);
  });

    window.addEventListener("contextmenu", e=>{
      composedEvent.preventDefault();                //todo: Do we need to prevent composed event inside initial event listener to prevent default action??
      e.target.style.color = "yellow";
    });

</script>
```

### References

* [MDN: dispatchEvent()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)
* [Browser default actions](https://javascript.info/default-browser-action)
