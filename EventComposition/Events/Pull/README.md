# Pull event 
As everyone knows, the pull-to-refresh mechanism (or swipe-to-refresh) allows you to update the list of data by touching
the screen. Today, pull-to-refresh has become an integral part of many applications, including Twitter, Gmail, Tweetbot 
and others.

>Pull-to-refresh is a touchscreen gesture that consists of touching the screen of a computing device with a finger or 
pressing a button on a pointing device, dragging the screen downward with the finger or pointing device, and then
releasing it, as a signal to the application to refresh the contents of the screen.

### Pull event attributes
* `pull` - a mandatory attribute that indicates that a pull event is available on the element;
* `pull-padding` - Maximum distance (px) from the edge of the element at which a pull event can be activated. This means
 that the user cannot activate a pull event if he or she starts it outside of a certain limit; 
* `pull-distance` - Minimum distance (px) between the starting activation point and the current activation point to be traversed
 to activate the pull event;
* `pull-distortion` - Maximum distance (px) of deviation from the vertical/horizontal line. As you know, the pull event 
should be directed perpendicular to the nearest edge of the element. This check prevents the accidental activation of 
the pull event with the event swipe.


### Pull event stages
Pull event has 4 states:

1. `pull-start` - an event that occurs when a user has activated the start of a pull event. Serves as a starting point 
for the distance countdown;
2. `pull-activated` - an event that is activated each time the user changes the position of the active touch point 
relative to the initial one;
3. `pull-fired` - occurs if the user has fulfilled all the conditions of moving the active point relative to the initial one;  
4. `pull-canncel` - A cancellation event that may be caused by :
    * adding a second point during the event activation;
    * if the user has changed his mind to activate the `pull-fired` event and returns the active point position to the 
    close to the starting position;  
    * triggering `alert()`.                  

### Pull event details
Each pull event has its own details:
 * `absCoord` - Absolute coordinates relative to the target item, even if it is scrolled left/right;
 * `axis` - The axis in relation to which the distance travelled is calculated (`pullDown/Up - Y axis, pullLeft/Right - X axis`);
 * `moved` - 
        * `activated` - Indicates whether the minimum distance has been covered;
        * `distX` - Distance along the Y axis relative to the starting point. for (pull-start event it is equal to 0);
        * `distY` -  Distance along the X axis relative to the starting point. for (pull-start event it is equal to 0);


### Example 
```html
<div id="frame" pull pull-padding="50" pull-distance="200" pull-distortion="30">        <!--[1]-->
    <span id="text">Hello pull-top event</span>
</div>

<button>Alert aster 2s</button>                                                         <!--[2]-->

<script src="src/pull-event.js"></script>

<script>
  let frame = document.querySelector("#frame");
  let text = document.querySelector("span");

  document.querySelector("button").addEventListener("click", function () {              /*[2]*/
    setTimeout(function () {
      alert("boo");
    }, 2000)
  });


  window.addEventListener("pull-start", function (e) {                                  /*[3]*/             
    frame.style.backgroundColor = "lightgreen";
    text.innerText = "now pull it";
  });


  window.addEventListener("pull-activated", function (e) {                              /*[4]*/          
    if (e.detail.moved.activated) {
      frame.style.backgroundColor = "yellow";
      text.innerText = "Ready to refresh, lift the finger";

    }
    else {                                                                              
      frame.style.backgroundColor = "orange";
      text.innerText = "Pull more";
    }
  });

  window.addEventListener("pull-fired", function (e) {                                  /*[5]*/
    frame.style.backgroundColor = "green";
    text.innerText = "Congratulations!!!";
  });

  window.addEventListener("pull-cancel", function (e) {                                 /*[6]*/
    frame.style.backgroundColor = "red";
    text.innerText = "Canceled";
  });
```                      

1. Let's add an element and with the help of attributes let's define that the starting point cannot be further than `50px`
relatively to the element border, the deviation from the perpendicular line cannot be more than `50px`, and the minimum 
 distance (with respect to the starting point) must be more than `200px`.
2. To check the pull-cancel of the event, add a button that will cause alert() after 2 seconds;
3. If the event is successfully activated, the element will change the background color to indicate that the conditions
 have been met; 
    >It is important to note that the element should not be scrolled in the opposite direction to start the pull event. 
    This means that if you want to make a pullDown event - the element should not be scrolled up, if not - the event is not activated         
4. When a point starts moving, can the distance between the starting point and the active point be sufficient to activate 
the event? To do this, we can use the patterns. In this case, if the distance is not enough, the background will be orange,
but when the distance is long enough, the background will change to yellow, which will let you know that you can release
your finger to refresh the page. If the user changes his mind to refresh the page, he can return the active point to 
the previous position.
    > You can use this approach to add icons that notify you that a page can be refreshed or that you want to
5. When the user lift his finger and all conditions have been met, the `pull-fired` event is activated. If the user 
lift the finger when the distance between the start point and the active point is insufficient, `pull-cancel` event will be activated.   
6. As mentioned earlier, the pull-cancel event can be triggered:           
   * adding a second point during the event activation;
   * if the user has changed his mind to activate the `pull-fired` event and returns the active point position to the 
   close to the starting position;  
   * triggering `alert()`.     
Press the button to make sure that alert() outputs the pull-cancel event.

[Try it on codepen](https://codepen.io/Halochkin/pen/mddXmee?editors=1000);

### References
[Wiki: Pull to refresh](https://en.wikipedia.org/wiki/Pull-to-refresh)