### `enterkeyhint` global attribute

The `enterkeyhint` content attribute is an enumerated attribute that specifies what action label (or icon) to present for the enter key 
on virtual keyboards.<br> 
This allows authors to customize the presentation of the enter key in order to make it more helpful for users.
User agents can support the enterkeyhint attribute on form controls (such as the value of input element).
You can change the label value on the `Enter` button on the virtual keyboard of the mobile device to the values listed below.

<table><thead><tr><th> Keyword
     </th><th> Description
   </th></tr></thead><tbody><tr><td><dfn id="attr-enterkeyhint-keyword-enter"><code>enter</code></dfn>
     </td><td>The user agent should present a cue for the operation 'enter', typically
     inserting a new line.
    </td></tr><tr><td><dfn id="attr-enterkeyhint-keyword-done"><code>done</code></dfn>
     </td><td>The user agent should present a cue for the operation 'done', typically
     meaning there is nothing more to input and the IME will be closed.
    </td></tr><tr><td><dfn id="attr-enterkeyhint-keyword-go"><code>go</code></dfn>
     </td><td> The user agent should present a cue for the operation 'go', typically
     meaning to take the user to the target of the text they typed.
    </td></tr><tr><td><dfn id="attr-enterkeyhint-keyword-next"><code>next</code></dfn>
     </td><td>The user agent should present a cue for the operation 'next', typically
     taking the user to the next field that will accept text.
    </td></tr><tr><td><dfn id="attr-enterkeyhint-keyword-previous"><code>previous</code></dfn>
     </td><td>The user agent should present a cue for the operation 'previous', typically
     taking the user to the previous field that will accept text.
    </td></tr><tr><td><dfn id="attr-enterkeyhint-keyword-search"><code>search</code></dfn>
     </td><td>The user agent should present a cue for the operation 'search', typically
     taking the user to the results of searching for the text they have typed.
    </td></tr><tr><td><dfn id="attr-enterkeyhint-keyword-send"><code>send</code></dfn>
     </td><td> The user agent should present a cue for the operation 'send', typically
     delivering the text to its target.
  </td></tr></tbody></table>

When enterkeyhint is unspecified (or is in a state not supported by the user agent), the user agent should determine the
default action label (or icon) to present. Contextual information such as the inputmode, type, or pattern attributes should be
used to determine which action label (or icon) to present on the virtual keyboard.

// todo demo, more information, description, based on the demo
// fix the demo https://codepen.io/Halochkin/pen/vvmoYx?editors=1011
// Generally it is custom attribute that has been standardized. This attribute similar to  [`mozactionhint`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Using_mozactionhint_on_Firefox_mobile) -> [proof here](https://github.com/whatwg/html/pull/3538#issuecomment-371011876) <br>

Mozactionhint [demo](https://robertnyman.com/html5/forms/styling.html) 

// todo figure out why it does not work
// crying, it does not work
// perhaps the problem in the virtual keyboard. Nowadays smartphones have virtual keyboards with just "↵" symbol instead text value

// todo I still have no a good demo





### References
* https://html.spec.whatwg.org/multipage/interaction.html
* https://github.com/whatwg/html/pull/3538
