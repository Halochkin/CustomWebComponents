# Why the composed event will be queued after the defaultAction? 

The problem is, why do we need to dispatch/propagate a composed event **before** the trigger event propagates completely?
And the answer to that mystery is that 
1. the default action that accompanies the trigger event (ie. the showing of the context menu (for example) that accompanies a click event),
is added to the que at the same time as the trigger event is dispatched, combined with 
2. the fact that to dispatch a composed event **after** the trigger event has propagated, you _MUST_ also put it in the task que.


```html
<div id="test">Open my context menu </div>

<script>

  let element = document.querySelector("#test");

    class LongPressEvent extends Event { 
      constructor(type,  trigger, props = {bubbles: true, composed: true}) {
        super(type, props);
      }
    }

  element.addEventListener("contextmenu", function(trigger) {                  //[1]
    const longPress = new LongPressEvent("custom-contextmenu", trigger);     
    trigger.target.dispatchEvent(longPress);                                   //[2]
  });

  window.addEventListener("custom-contextmenu", function(e) {               
    e.target.style.color = "yellow";
    });

</script>
```

This means that 
1. if you try to make a composed event propagate **after** a trigger event has finished its propagation, then 
2. it will **always** run after the composed event".


 The **one important thing** is that the default task is scheduled **at the same time** as the event. Ie. Before the beginning 
 og event propagation, not after the end of event propagation.
 
 The ideal and desired outcome would be:
 1. The trigger event propagates completely first;
 2. The composed event propagates thereafter;
 3. The default action at the very end;
 4. The trigger event (1) can prevent the default action (3), but not the composed event. The composed event will be dispatched.
 5. The composed event (2) can prevent the default action (3).
 
 This is almost what native composed events do:
 1. First `mousedown`.
 2. Then `contextmenu`.
 3. Then default action such as link navigation or context menu.
 A. Native trigger events cannot prevent default actions of native composed events, as the browser can expect the developer
 to stop the default action from the native composed event. This is a difference with custom composed events.
 B. The native composed event such as click can prevent the default action.
 
### Problem: Why do we need to run the composed event before the trigger event?
 
 The problem is that the browser ques the default action task in the event loop just _before_ the trigger event begins 
its propagation. From the developers perspective it "looks like" the default action is only added **after** the trigger event
 has completed its propagation. But it is NOT SO. 

The browser does not review the state of the event after it has completed 
propagation, which is bad, but instead the browser adds both the trigger event and the default action to the event loop 
at the very beginning. 

And when you call `preventDefault()` on the event, it tunnels a message from the event task to the
default action task in a not very pretty and definitively non-functional way. 

Ah.. The anguish of old bad patterns.
The consequence of this problem is that if you want to dispatch and propagate a composed event from a trigger event _and_ 
the trigger event has a default action, you must either 

A) always run the default action every time, 

B) always block run the default action every time, 

or 

C) dispatch and propagate the composed event BEFORE the trigger event propagates in the DOM.


```html
<div id="test">Open my context menu </div>

<script>

  let element = document.querySelector("#test");

    class LongPressEvent extends Event { 
      constructor(type,  trigger, props = {bubbles: true, composed: true}) {
        super(type, props);
        this.trigger = trigger;
      }

      preventDefault(){
        this.trigger.preventDefault();
      }
    }

  element.addEventListener("contextmenu", trigger => {                          
      const longPress = new LongPressEvent("custom-contextmenu", trigger);     
      trigger.target.dispatchEvent(longPress);                                   
  });

    window.addEventListener("contextmenu", e=>{
      e.preventDefault();                
      e.target.style.color = "yellow";
    });

</script>
```


### Reference 
* [What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ&t=302s)
* [Browser default actions](https://javascript.info/default-browser-action)
 
