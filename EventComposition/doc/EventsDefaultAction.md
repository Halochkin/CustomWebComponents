# List of all DefaultActions

## UI events

1. `click` :
    * If the event target has associated activation behavior, the default action must be to execute that activation behavior;
    * If the event target is focusable, the default action must be to give that element document focus.
    * If the event target is selectable, the default action must be to select part or all of the selectable content. Subsequent clicks may select additional selectable portions of that content;
    * Click on <input type="checkbox"> -- check or uncheck.
2. `mousedown` : 
    * Beginning a drag/drop interaction with an image or link;
    * Start a text selection;
    * Start a scroll/pan interaction (in combination with the middle mouse button, if supported);
    * Set up a state machine that allows the user to drag images or select text;
    * If the user’s pointing device is over text, a text selection might begin;
    * If the user’s pointing device is over an image, then an image-drag action could begin;
    * Additionally, some implementations provide a mouse-driven panning feature that is activated when the middle mouse button is pressed at the time the mousedown event is dispatched.

3. `mouseup` : 
    * Invoke a context menu (in combination with the right mouse button, if supported)

4. `wheel` :
    * Scroll (or zoom) the document
    
5. `beforeinput` :
    * Update the DOM element;  
    * Any default actions related to this key, such as inserting a character in to the DOM.
    
6. ` keydown` : The default action of the keydown event depends upon the key:
    * If the key is associated with a character, the default action MUST be to dispatch a beforeinput event followed by an input event. 
    * In the case where the key which is associated with multiple characters (such as with a macro or certain sequences of dead keys), the default action MUST be to dispatch one set of beforeinput / input events for each character;
    * If the key is associated with a text composition system, the default action MUST be to launch that system;
    * If the key is the `Tab` key, the default action MUST be to shift the document focus from the currently focused element (if any) to the new focused element;
    * If the key is the `Enter` or `Space` key and the current focus is on a state-changing element, the default action MUST be to dispatch a click event, and a DOMActivate event if that event type is supported by the user agent.

7. `compositionstart` :
    * Start a new composition session when a text composition system is enabled.

8. `touchend` :
    * may dispatch mouse and click events.

9. `pointerdown` :
    *  all default actions of the mousedown event.

10.  `select` :
    * highlight text.

11. `paste` :
    * Insert the contents of the clipboard into the document at the cursor position.
