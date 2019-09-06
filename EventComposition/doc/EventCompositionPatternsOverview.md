# Event composition patterns overview
Each pattern is graded at 10 points scale in the context of the question.
### Short description

   1. `EarlyBird` - the EarlyBird listener function is added before the function is loaded. It calls shotgun.

   2. `CallShotgun` - as soon as the function is defined, the trigger function would work as intended.

   3. `PriorEvent`  - propagates the custom composed event before the triggering event.

   4. `AfterthoughtEvent` - custom, composed event that is dispatched after the triggering event.

   5. `ReplaceDefaultAction` - allows us to block the defaultAction of the triggering event. This gives us the clear
       benefit of a consistent event sequence, but the clear benefit of always loosing the native composed events or the
       native default action.

   6. `FilterByAttribute` - to make an event specific to certain element instances we need a pure `filterOnAttribute`
       function that finds the first target with the required attribute, and then dispatching the custom, composed event on
       that element.
   6a. `EventAttribute` - you can set your own conditions for fling events by defining them in custom properties.
   If you do not define them, the default values will be applied.

   7. `EventSequence` - beginning of the sequence of events. Since mouse events start with `mousedown` events, it starts
       the sequence. Function `startSequence` initializes theproperties that will be used further. These include both the
       conditions of a `fling` event, and standard css properties

   8. `GrabTarget` - target is "captured" in the initial trigger event function (`mousedown`), then stored in the
       EventSequence's internal state, and then reused as the target in subsequent, secondary composed DOM Events.

### Was the need for the pattern self evident?

   1. `EarlyBird`  - 10 
   2. `CallShotgun`  - 10 
   3. `PriorEvent`   - 8 
   4. `AfterthoughtEvent` - 8  
   5. `ReplaceDefaultAction` - 10 
   6. `FilterByAttribute`  - 10
   7. `EventSequence`  - 6 (very useful, but not self evident)
   8. `GrabTarget` - 10 
   
### Was the need for the pattern justified?

   1. `EarlyBird`  - 10 
   2. `CallShotgun`  - 10 
   3. `PriorEvent`   - 0 (was used `replaceDefaultAction()`)
   4. `AfterthoughtEvent` - 0 (was used `replaceDefaultAction()`)
   5. `ReplaceDefaultAction` - 10  
   6. `FilterByAttribute`  - 10
   7. `EventSequence`  - 10  
   8. `GrabTarget` - 7 (it was just  e.target,  )

### Is there a need for the pattern that was not explained?
  
   1. `EarlyBird`  -  
   2. `CallShotgun`  -  
   3. `PriorEvent`   -   
   4. `AfterthoughtEvent` - 
   5. `ReplaceDefaultAction` -  
   6. `FilterByAttribute` +  0 (There are no article about it in 2_Event_to_event chapter)
   7. `EventSequence`  + (it would be nice to add some short explanation to 2_Event_to_event chapter) 
   8. `GrabTarget` +  (the same problem, no description)

### Was there a need for the pattern that was unconvincing?

   1. `EarlyBird`  - 10 
   2. `CallShotgun`  - 10 
   3. `PriorEvent`   - 5 (It would be great to add some more description (move discussion to the top of the article to explain whu this pattern are necessary))
   4. `AfterthoughtEvent` - 10 (nice description, but we use `replaceDefaultAction()`)
   5. `ReplaceDefaultAction` - 10 
   6. `FilterByAttribute`  - 10
   7. `EventSequence`  - 10
   8. `GrabTarget` - 10 

### Was the core aspects of the pattern explained?

   1. `EarlyBird`  - 10 
   2. `CallShotgun`  - 10 
   3. `PriorEvent`   - 5 (Not 100% clear from description) 
   4. `AfterthoughtEvent` - 10
   5. `ReplaceDefaultAction` - 10 
   6. `FilterByAttribute`  - (There are no article about it in 2_Event_to_event chapter)
   7. `EventSequence`  - 7 (not in 2_Event_to_event chapter)
   8. `GrabTarget` - 0 (no description) 

### Is it clear for you what you need to do to employ the pattern?

   1. `EarlyBird`  - 10 
   2. `CallShotgun`  - 10 
   3. `PriorEvent`   - 8 
   4. `AfterthoughtEvent` - 10  
   5. `ReplaceDefaultAction` - 10 (I am confusing, should I use this pattern or two previous???)
   6. `FilterByAttribute`  - 10
   7. `EventSequence`  - 10  
   8. `GrabTarget` - 10 

### What was missing from the pattern description? What did you find in the demo, and not in the recipe text itself?

   1. `EarlyBird`  -  
   2. `CallShotgun`  -  
   3. `PriorEvent`   -  ( add some more description to the top of the article, not only what it can do, but why it is necessary)
   4. `AfterthoughtEvent` - 10  
   5. `ReplaceDefaultAction` - 10 
   6. `FilterByAttribute`  - 10
   7. `EventSequence`  - 6 (very useful, but not self evident)
   8. `GrabTarget` - 10 
   
### The demo, was it up to date?

   1. `EarlyBird`  -  
   2. `CallShotgun`  - in the context of the other demo  
   3. `PriorEvent`   - 8 
   4. `AfterthoughtEvent` - 8  
   5. `ReplaceDefaultAction` - 10 
   6. `FilterByAttribute`  - no demo
   7. `EventSequence`  - no demo
   8. `GrabTarget` - no demo
   
### Demo, did it conflict with any of the other pattern demos?

Hve no noticed

### References, do you have any good references we need?

Will make later

