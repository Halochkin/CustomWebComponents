# 1_Intro

### What does "compose" mean in web language?
1. combine items to create a webpage using only HTML;
2. combine HTML, JS, CSS and DOM Events to create a web page;
3. combine browser native events to expand the functionality of a web page;
4. when you put HTML elements in the shadowDom of other html elements

### When a tree falls in the forrest, and no one is there, it will not make a sound. Obviously. But, will there be a DOM Event if there are.. 
1. no JS event listener attached?
2. no html elements in the entry point html file?
3. no CSS in the DOM?
4. Always. There are always DOM Events.

### When do DOM events occur?
1. When the user starts doing any actions in the browser
2. As a result of triggering a JS function that was activated by an event listener.
3. They occur independently of user actions and JS functions.
4. When modifying the DOM structure with JS functions

### How are HTML elements related to DOM events?
1. DOM events are always related when working with DOM elements
2. Changing HTML elements does not trigger any DOM events
3. Activate the DOM event occurs regardless of the presence of DOM for the web page
4. DOM events are not possible if there are no HTML elements inside the <body > tag

### A CSS property can.. 
1. only change the CSS styles of HTML elements, and does not affect DOM events. 
2. create, alter and direct the DOM events and their default behavior.
3. only alter the default behavior of existing DOM events. 
4. alter both the appearance and DOM Event at the same time.

### What is the meaning EventToJsComposition way?
1. JS functions are used to create, direct or stop DOM Events
2. DOM Events are used to alter JS functions
3. DOM Events are used to direct JS functions
4. JS functions are used to create, direct or stop DOM Events

### Most JS code functions written and loaded into a web application are triggered by DOM events. What does JS code have to do with DOM events?
1. the vast majority of JS code is designed exclusively to respond to DOM events
2. the vast majority of JS code is designed exclusively to handle the lifecycle of web components
3. the vast majority of DOM events are designed solely to respond to JS code
4. these are completely different things that work independently but can only interact under certain conditions (e.g. when loading a script)

### JS code can never be triggered by..
1. the html document itself
2. Either DOM events or changes to the DOM
3. Either the passing of time or changes to the CSSOM
4. Either the passing of time or changes of the layout structure

### When creating custom HTML elements, i.e. web components,an important task is...
1. Adding shadowRoot to a custom element
2. Description of the built-in reactions of the new HTML element to DOM events
3. Adding event listeners to the new HTML element as a first priority
4. Adding a new HTML element to the DOM as quickly as possible

### Can HTML attributes generate DOM events?
1. Yes, but only custom attributes defined by JS
2. Yes, there are some special attributes that create native events
3. No, no attributes that generate DOM events
4. No, HTML attributes cannot generate DOM events, only custom events

### What HTML elements allow you to create and manage DOM events?
1. 
* `<a href="...">`
* `<form action="...">`
* `<style>`
* `<script>, <textarea>, <select> and <option>`
2. 
* `<a href="...">`
* `<form action="...">`
* `<base>`
* `<input>, <button>, <select> and <option>`
3.
* `<a href="...">`
* `<link href="...">`
* `<meta>`
* `<input>, <button>, <select>  and <option>`
4. 
* `<a href="...">`
* `<button>`
* `<base>`
* `<input>, <iframe>, <select> and <option>`

### The main goal of applying template EventComposer is ... 
1. suitable for describing and reusing the architecture of entire web applications, the high-level components of such applications
2. creating events from other events
3. make web components
4. to alter or mutate the interpretation of an already created browse events from `<a>` and `<form>`

### EventComposer pattern most effective for use with ... 
1. `<base>`
2. `<a href= "...">`
3. `<input>`
4. `<form>, <input>, <button>, <select> and <option>`
5. with any custom elements
  
### The main goal of applying template EventCreator is ... 
1. suitable for describing and reusing the architecture of entire web applications, the high-level components of such applications
2. creating events from other events
3. make web components
4. to alter or mutate the interpretation of an already created browse events from `<a>` and `<form>`

### EventCreator pattern most effective for use with ... 
1. `<base>`
2. `<a href= "...">`
3. `<input>`
4. `<form>, <input>, <button>, <select> and <option>`
5. with any custom elements

### The main goal of applying template EventHelper ... 
1. suitable for describing and reusing the architecture of entire web applications, the high-level components of such applications
2. creating events from other events
3. make web components
4. to alter or mutate the interpretation of an already created browse events from `<a>` and `<form>`

### EventHelper pattern most effective for use with ... 
1. `<base>`
2. `<a href= "...">`
3. `<input>`
4. `<form>, <input>, <button>, <select> and <option>`
5. with any custom elements

### The main goal of applying template EventOrchestra ... 
1. suitable for describing and reusing the architecture of entire web applications, the high-level components of such applications
2. creating events from other events
3. make web components
4. to alter or mutate the interpretation of an already created browse events from `<a>` and `<form>`

### EventOrchestra pattern most effective for use with ... 
1. `<base>`
2. `<a href= "...">`
3. `<input>`
4. `<form>, <input>, <button>, <select> and <option>`
5. with any custom elements
  
### In order for CSS properties to control DOM events, the CSSOM must be processed...
1. before the affected DOM events are dispatched
2. after the affected DOM events are dispatched
3. in any order the affected DOM events are dispatched
4. at the beginning of the document load

### One way to ensure that the CSSOM is processed before an affected DOM Event is dispatched, so that the relevant DOM Event-controlling CSS property can be checked beforehand, is to process the events that need access to such CSSOM values at the ...
1. end of the frame, right before the next frame will be painted
2. very beginning of the frame, right after the previous frame was painted
3. very beginning of the frame, right before the current frame will be painted
4. middle of the frame, right before the next frame will be painted and right after the previous frame was painted

### We can manually trigger a CSSOM recalculation by calling ...
1. document.getElementById("elementId").style...
2. document.querySelector("#elementId").style...
3. getComputedStyle(element)
4. element.style....

### What events can be managed with CSS?
1. `mousedown`, `touchstart` and `pointerdown`
2. `mousedown`, `mousemove` and `mouseup`
3. `touchstart`, `touchmove` and `touchend`
4. `pointerdown`, `pointermove`, or `pointerend`

### Which CSS property to prevent users from selecting text? 
1. mouse-select
2. user-select
3. display-select
4. text-select

### Which CSS property sets how a region can be manipulated by a touchscreen user
1. touch-action
2. scroll-action
3. user-select
4. none of the listed
  
