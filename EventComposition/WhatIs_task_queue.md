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

the Problem is, why do we need to dispatch/propagate a composed event BEFORE the trigger event propagates completely? And 
the answer to that mystery is that "a) the default action that accompanies the trigger event (ie. the showing of the
 context menu that accompanies a click event), is added to the que at the same time as the trigger event is dispatched,
 combined with b) the fact that to dispatch a composed event AFTER the trigger event has propageted, you MUST also put it in the task que. This means that X) if you try to make a composed event propagate AFTER a trigger event has finished its propagation, then Y) it will ALWAYS run after the composed event".


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

### setTimeout()
You can set the function to be added to the timed event queue, i.e. after a certain time. This allows you to setTimeout().

The first argument is the function we want to postpone execution of. The second argument is the time after which the
function will be added to the event queue (waiting time).

> But the second argument that defines the waiting time is not the guaranteed execution time, but the minimum execution time.


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


