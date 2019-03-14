# HowTo: ParseCustomCssValues
> Regular expressions are patterns used to match character combinations in strings. 
Css values is a string with space separated values. Border f. Ex. Can have the 2px solid blue, a string containing from 1 upto 12 different values separated by one or more spaces. 

You can use a regular expression to parse the values of CSS properties. This can be either a numeric value of the property or the 
name of the property. 
### CSS valid number values






In CSS, numer values can be declared in the following form
```
12          A raw <integer> is also a <number>.
4.01        Positive fraction
-456.8      Negative fraction
0.0         Zero
+0.0        Zero, with a leading +
-0.0        Zero, with a leading -
.60         Fractional number without a leading zero
10e3        Scientific notation
-3.4e-2     Complicated scientific notation
```

  The following regular expression (further regex) allows to obtain the numerical value of the property including the units of the 
  extinction (px|em|ex|%|in|cn|mm|pt|pc)
  
  ```css
  /(\-?\+?\d*\.?\d+)(px|em|ex|%|in|cn|mm|pt|pc)?/g
  ```
  
  Let's analyze regex to understand what's what.
 
`/` - start of the regex body
 
**`(`** - Capturing group 1. Groups multiple tokens together and creates a capture group for extracting a substring or using a backreference.
 
  **`\-`** - Escaped character. Allows selection to start with a minus character. To select negative values, because CSS values can be negative
  
   **`?`** - Quantifier. The condition that the previous condition is met and the selection starts with a valid value (-).
 
  **`\+`** - Escaped character. Allows selection to start with a + character.
  
  **`?`** - Quantifier. The condition that the previous condition is met and the selection starts with a valid value (space).
  
  **`\d`** - Digit. Matches any digit character (0-9).
  
  **`*`** - Quantifier. Match 0 or more of the preceding token.
  
  **`\.`** - Escaped character.  Matches a dot character.
  
  **`?`** -  Quantifier. The condition that the previous condition is met and the selection starts with a valid value (dot).
  
  **`\d`** - Digit. Matches any digit character (0-9).
  
  **`+`** - Quantifier. Checks for at least one condition.
  
**`)`** the end of the group 1 capture. 

  
> Let's summarize the first block. Regex will check if the sample starts with a minus, a space, a dot or just a digit. 
> If the conditions are met, go to the second group.

**`(`** - Capturing group 2.

**`px|em|...|pc`** Checking the values after the numbers. Checks for matching valid values.
 
**`?`** - Quantifier. Worth it in the end because checks, whether the output performance of the terms from group 1 or group 2. We specifically added it at the end to provide a choice of conventional cipher without units of measure.

`/` - end of the regex body.

**`g`** - means global. Allows to search for matches everywhere

  
## Example of applying
The code below demonstrates what the values of the CSS properties code are selected

```css
  element {  
    max-width:50em;                                /*50em*/                         
    margin: 0 +3px auto;                            /*0, +3px*/
    padding: 1.6em1.5em2em 50px;                    /*1.6em, 1.5em, 2em, 50px*/
    padding: 1.6em 1.5em 2em calc(26px + 1.5em);    /*1.6em, 1.5em, 2em, 26px and 1.5em*/
    line-height: 1.5;                               /*1.5*/
    font-family: sans-serif; 
    line-height: 2;                                 /*2*/
    word-wrap: break-word;
    color: black;
    margin: 100 px;                                /*nothing, because it is invalid declaration*/
	      }
```
Try it on [Regexr.com](https://regexr.com/49jv5)

### References
* [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
* [Valid CSS numbers](https://developer.mozilla.org/en-US/docs/Web/CSS/number#Valid_numbers)
* [CSS Specification](https://drafts.csswg.org/css-values-4/#numbers)
