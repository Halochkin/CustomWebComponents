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
Using the access key depends on the operating system. For example, on machines running MS Windows, you usually need to press the `Alt`
key along with the access key. Apple systems typically require the `cmd` key.
Tip: Each browser responds in its own way to more than one item having the same accesskey:
- IE, Firefox: The following item will be activated
- Chrome Safari: The last item will be activated

Browsers use various keyboard shortcuts.
For example, for accesskey = "a", the following combinations work.
- Chrome: `Alt`+`s`
- Internet Explorer: `Alt`+`s`
- Safari: `Alt`+`s`
- Firefox: `Alt`+`Alt`+`s`

#### The difference between HTML 4.01 and HTML5

- In HTML5, the accesskey attribute can be used on any HTML element.
- In HTML 4.01, the accesskey attribute can only be used with the following elements:
`<a>, <area>, <button>, <input>, <label>, <legend>, and <textarea>`


```html
<a href="img/duck.jpg" accesskey="d">
<input type="checkbox" accesskey="c">
<input type="text" accesskey="t">
<input type="button" accesskey="b" value="Press Alt + b to bring this button intofocus">

<img src="./img/skiResort.jpg" alt="accesskey map example" usemap="#Resort">
<map name="Resort">
<area shape="rect" coords="8,5,100,77" href="./mountains.html" target="_blank" alt="mountains" accesskey="m">
<area shape="circle" coords="155,93,59" href="./snow.html" target="_blank" alt="what about snow?" accesskey="s">
</map>
```

