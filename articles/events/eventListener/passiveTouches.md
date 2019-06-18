# Passive touch events

AddEventListenerOptions defaults passive to false. With this change touchstart and touchmove listeners added to the document
will default to `{passive:true}` (so that calls to `.preventDefault()` will be ignored). The main idea is to reduce the time it takes to
update the display after the user touches the screen.
####
For example, this code will `not` work:
```javascript
window.addEventListener('touchstart', (e) => e.preventDefault());
```
Because it equivalent to:
```javascript
window.addEventListener('touchstart', (e) => e.preventDefault(), {passive: true});
```
To allowprevent event is necessary so:
```javascript
window.addEventListener('touchstart', (e) => e.preventDefault(), {passive: false});
```
And in most cases it is generally better to use touch-action: none .

### References
1. [Chrome Platform Status](https://www.chromestatus.com/features/5093566007214080)
2. [MDN](https://developer.mozilla.org/ru/docs/Web/API/TouchEvent#Using_with_addEventListener()_and_preventDefault())
3. [Google Developers](https://developers.google.com/web/updates/2017/01/scrolling-intervention)
