### `accesskey` attribute
The accesskey attribute allows you to activate a link using a shortcut key with the letter or number specified in the link code. 
An attribute value consists of one character - it can be a digit (0-9) or a Latin letter (a-z).

Typically, an element when using a keyboard shortcut gets tricky, but the specific action depends on the tag used. Example:
- for <a>, a link will follow link
- the text fields will focus
- HTML text fields of the form ( input and textarea ), they will receive focus 
(the cursor will blink inside them), for checkboxes and radio buttons , the state will change from marked to unchecked and vice versa,
for the a tag, a link will follow.
  
#### Features of using
  
##### Using the access key depends on the operating system. 
For example, on machines running MS Windows, you usually need to press the `Alt`
key along with the access key. Apple systems typically require the `cmd` key.
Tip: Each browser responds in its own way to more than one item having the same accesskey:
- IE, Firefox: The following item will be activated
- Chrome Safari: The last item will be activated

##### Browsers use various keyboard shortcuts.
For example, for accesskey = "s", the following combinations work.
- Chrome: `Alt`+`s`
- Internet Explorer: `Alt`+`s`
- Safari: `Alt`+`s`
- Firefox: `Alt`+`Alt`+`s`

##### Browser conflicts
One of the obvious problems associated with the idea of `accesskey` itself is that between the keyboard shortcuts of browsers, operating systems, browser extensions, and so on. And the ones defined in the web content inevitably arise conflicts. For example, `Alt` + `F` in the most browsers activates the `File` menu. What happens when a web developer wants to use the same key combination to access parts of a web page, such as the File menu inside a web application? The user’s browser will determine how this type of conflict is managed.
In the case of Chrome, Firefox, and IE, the access key on the web page takes precedence over the user agent keystroke. This means that the key combination activates the "File" menu but the activation of the element

#### Example 
```html
<a href="./img/duck.jpg" accesskey="d">
<input type="checkbox" accesskey="c">
<input type="text" accesskey="t">
<input type="button" accesskey="b" value="Press Alt + b to bring this button intofocus">

<img src="./img/skiResort.jpg" alt="accesskey map example" usemap="#Resort">
<map name="Resort">
<area shape="rect" coords="8,5,100,77" href="./img/mountains.html" target="_blank" alt="mountains" accesskey="m">
<area shape="circle" coords="155,93,59" href="./img/snow.html" target="_blank" alt="what about snow?" accesskey="s">
</map>
```
#### The difference between HTML 4.01 and HTML5

- In HTML5, the accesskey attribute can be used on any HTML element.
- In HTML 4.01, the accesskey attribute can only be used with the following elements:
`<a>, <area>, <button>, <input>, <label>, <legend>, and <textarea>`

#### Enter-on-focus
Element "has focus" when the visitor focuses on it. Usually, the focus automatically occurs when you click on an element with the mouse, but you can also go to the desired element with the keyboard — via the `Tab` key, pressing the finger on the tablet, and so on.
Let's look at an example <form>
  
```html
<form>
  <input type="text" name="username">
  <input type="submit" value="Login" name="loginBtn" accesskey="s">
</form>
```

```javascript
window.addEventListener("submit", function(){console.log("submit")});
window.addEventListener("keypress", function(){console.log("keypress")});
window.addEventListener("click", function(){console.log("click")});
```
There are three ways to submit a form:
- Click <input type="submit">
- Focused the text field and press `Enter`
- Use accesskey by press `Alt`+`s`

#### Implicit submission
Each action lead to submit event on the form. When a form is sent using `Enter` button on an input field, a `click` event triggers on the <input type="submit"><br>
But many websites do not have a submit button within the form. In this case if the user agent supports letting the user submit a form *implicitly* (when an input element is in focus, it can be activated as a press `Enter` or a shortcut with accesskey or clicking), then doing so for a form whose default button has a defined activation behavior must cause the user agent to run synthetic `click` activation steps on that default button. The button's `click` event fires for mouse clicks and when the user presses `Enter` or `Space` while the button has focus.<br>

Make sure of it yourself on [codepen.io](https://codepen.io/Halochkin/pen/ebvaQr?editors=1111)<br>

Basically, ***if the user hits `Enter` when a text field is focused, the browser should find the first submit button in the form and click it.*** If the form has no submit button, then the *implicit submission* mechanism must do nothing if *the form has more than one field that blocks implicit submission*, and must submit the form element from the form element itself otherwise

So, in a form with no submit buttons, *implicit submission* will be done if only **one** input is present. Pressing `Enter` in the textbox will submit the form:

```html
<form>
  <input type="text" name="search">
</form>
```
But in the form, which has **several** text fields, it will not work.
```html
<form>
  <input type="text" name="login">
  <input type="text" name="password">
  <input type="submit" value="Log In" name="loginBtn">
</form>
```
> __Therefore, if you have a form with more than one input field, always include a submit button.__

#### How to prevent implicit submission

In order to prevent the form from submiting when user press `Enter`, we need to add an event listener that will check the value of `keyCode` of the button. The `keyCode` value of the `Enter` button is 13.

```html
<form>
  <input id="field" type="text" name="search">
</form>

<script>
    document.getElementById('field').addEventListener('keypress', function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    });
</script>
```

#### Reference 
* [MDN: accesskey](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey)
* [Spec: accesskey](https://html.spec.whatwg.org/multipage/interaction.html#the-accesskey-attribute)
* [MDN: focus](https://developer.mozilla.org/en-US/docs/Web/Events/focus)
* [MDN: button role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role#Required_JavaScript_Features)
* [Spec: implicit submission](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission)
* [MDN: keyCode](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)

