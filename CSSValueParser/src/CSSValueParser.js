//should we add "/gi" ?
/*

needs to be split up into a series of value tokens and comma tokens.
Then, this big list will be split up into a set of smaller lists on the comma tokens.

So, we can get a flat list,
or a list of comma separated lists.
This is simplest to always return as a list of comma separated lists, kinda.

Then, to get the value of each token, we have to access it as either a primitive word, a number value, or a function.
(The #color is a shortcut for an rgb function, but this is simple and not very relevant.)

The real problem is parsing the CSS function.
The function consists of a function name, then a "(" and then a list of comma separated function expressions, and then ")".

what can be a function name?
what can be a function expression?

the function expression can be either a:
1. quoted string
2. another function expression
3. primitive word, or number value
4. calc expression (boolean expression):
   10px + 20%vh
   width >= 200px


1. CSS Value token list:
********************
0. <space>                                          \s+
1. <word>                                           [a-z]+
2. <number>                                         [+-]?(\d+.\d+|.\d+|\d+)(e[+-]?\d+)?
4. <operator>                                       >=|<=|==|[#\(\),<>/*+%-]
"==", "<=", ">=", "#", "+", "-", "*", "/", ">", "<", "%", "(", ",", ")"
5. <singlequote>                                    '((\\\\|\\'|[^'\n])*)'
6. <doublequote>                                    "((\\\\|\\"|[^"\n])*)"
7. any other finding would be an error              .+

1.b Regex Tokenizer:
***************

  \s+ |
  [a-z]+ |
  [+-]?\d*\.?\d+(e[+-]?\d+)? |
  >=|<=|==|[#\(\),<>/*+%-] |
  '((\\\\|\\'|[^'\n])*)'|
  "((\\\\|\\"|[^"\n])*)"|
  .+

/\s+|[a-z]+|[+-]?\d*\.?\d+(e[+-]?\d+)?|>=|<=|==|[#(),/<>+*%-]|'((\\\\|\\'|[^'\n])*)'|"((\\\\|\\"|[^"\n])*)"|(.*)/g

2.b JS Parser:
*********


3 getPropertyValueObject:
************************
[
  [value, value, value],
  [value, value, value],
  ...
]

CSSValue
   .getType() returns "color", "number", "word"
   .getValue() returns the interpreted result of the value as a String, that would compute the "if(..)" expression
   .getNumberValue()
   .getNumberType()
   .getColorValue()
*
**/


const tokenizer = /(\s+)|([-]*[a-z]+[3d]?)+|([+-]?\d*\.?\d+(e[+-]?\d+)?)|>=|<=|==|(#[0-9a-f]+)|[(),/<>+*%]|'((\\\\|\\'|[^'\n])*)'|"((\\\\|\\"|[^"\n])*)"|(.+)/gi;
//todo      \   \   |[3d]?| added to apply 3d fucntions              |(#[0-9a-f]+)|here was added regex for hash colors                              | i flags for hash colors (FFF)
//todo     \[-]*\ added to support variables
// const tokenizer = /(\s+)|([a-z]+)|([+-]?\d*\.?\d+(e[+-]?\d+)?)|>=|<=|==|[#(),/<>+*%-]|'((\\\\|\\'|[^'\n])*)'|"((\\\\|\\"|[^"\n])*)"|(.+)/g;
//


class Tokenizer {
  constructor(str) {
    this._input = str;
    this._next = undefined;
    this._nextNext = undefined;
  }

  hasNext() {
    if (this._next === undefined)
      this._next = tokenizer.exec(this._input);
    return this._next !== null;
  }

  _nextToken() {
    const token = tokenizer.exec(this._input);
    if (token[8])
      throw new SyntaxError("Illegal token: " + token[0]);
    /*todo Max: undefined n variable replaced to token[0]*/
    return token;
  }


  next() {
    if (this._nextNext === null)
      return;

    if (this._nextNext === 0) {
      return this._next;
    }

    if (this._next) {
      let n = this._next;
      this._next = this._nextNext;
      this._nextNext = undefined;
      return n;
    }

    return this._next = this._nextToken();
  }

  lookAhead() {

    return this._next || (this._next = tokenizer.exec(this._input));
  }

  lookAheadAhead() {
    if (!this._nextNext)
      this._nextNext = tokenizer.exec(this._input);
    if (!this._next)
      this._next = tokenizer.exec(this._input);

    if (this._nextNext === null)
      return this._nextNext = 0; //some value which means that there is no next values.

    return this._nextNext;
  }
}

export function tokenizeCssValues(str) {
  return tokenizer.exec(str.trim());
}


class CssValue {
  constructor(obj) {
    this._obj = obj;
  }

  getRgbValue() {
    if (this._obj.type === "function" && this._obj.unit === "rgb")
      return this._obj.children.map(number => parseInt(number.value));
    if (this._obj.type === "#") {
      const str = this._obj.value;
      if (str.length === 3)
        return [parseInt(str[0], 16) * 16, parseInt(str[1], 16) * 16, parseInt(str[2], 16) * 16];
      if (str.length === 6)
        return [parseInt(str[0] + str[1], 16), parseInt(str[2] + str[3], 16), parseInt(str[4] + str[5], 16)];
    }
    return undefined;
  }

  getValue() {
    return obj.value;
  }
}

export function parseCssValue(str) {
  const tokens = new Tokenizer(str);
  let result = [];
  while (tokens.hasNext()) {
    result.push(parseSpaceSeparatedValueList(tokens));
    if (!tokens.hasNext())
      return result;
    let next = tokens.next();
    if (next && next[0] !== ",")
      throw new SyntaxError("not a list of values nor a comma, but: " + next[0]);
  }
  return result;
}

function parseSpaceSeparatedValueList(tokens) {
  let result = [];
  for (let next = tokens.lookAhead(); next; next = tokens.lookAhead()) {
    if (next[1] /*isSpace*/) {
      tokens.next();
      continue;
    }
    if (next[0] === ",")            //todo check if ,, is a syntax error for ValueList?
      return result;

    if (next[0] === null)            //todo end of the sequence
      return result;

    result.push(new CssValue(parseValue(tokens)));
  }
  return result;
}

function parseValue(tokens) {

  if (tokens.lookAheadAhead()[0] === "(") {
    const type = tokens.next()[0];
    tokens.next();  //skip the "("
    const children = parseCssExpressionList(tokens);
    return {type, children};
  }
  return parsePrimitive(tokens);
}

function parseCssExpressionList(tokens) {
  let result = [];
  for (let next = tokens.lookAhead(); next; next = tokens.lookAhead()) {
    if (next[1]) //isSpace
      tokens.next();
    else {
      result.push(parseExpression(tokens));
      next = tokens.next();
      if (next[1]) //isSpace
        next = tokens.next();
      if (next[0] === ",")
        continue;
      if (next[0] === ")")
        return result;
      throw SyntaxError("Illegal CSS expression list.");
    }
  }
}

function parseExpression(tokens) {
  let value = parseValue(tokens);
  let potentialOperator = getOperator(tokens);
  if (potentialOperator) {
    tokens.next();                                 //todo: Max: skipped space after operator
    return {
      left: value,
      operator: potentialOperator,
      right: parseExpression(tokens)
    };
  }
  return value;
}

function getOperator(tokens) {
  if (tokens.lookAhead()[1] /*isSpace*/ && tokens.lookAheadAhead()[0] /*isOperator*/) {   //todo Max: replaced [5] to [0] in operator check
    tokens.next(); //skip space
    let operator = tokens.next()[0];
    let next;
    if (!(next = tokens.next())[1] /*isNotSpace*/)
      throw new SyntaxError("Css value operator '" + operator + "' must be surrounded by space: " + next[0]);
    return operator;
  }
  return undefined;
}

function parsePrimitive(tokens) {
  const next = tokens.next();

  /*check is a value starts with a hash*/
  /*This check has been moved bottom up*/
  //-------------------------------------------------------------------------------------------------
  if (next[0].startsWith("#")) {                     //todo Max: it make a sense to check hash symbol in the beginning to avoid errors (especially for hash colors)
    const nextNext = tokens.next();
    /*Check if it has a valid character length (include #symbol) */
    if (next[0].length === 4 || next[0].length === 5 || next[0].length === 7 || next[0].length === 9)  //todo Max: fixed # colors possible lengths
    /*Remove first character from the string in the value property to remove #*/
      return {color: "#", value: next[0].substr(1)};
    throw new SyntaxError("illegal #color: " + next[0] + nextNext[0]);
  }
  //-------------------------------------------------------------------------------------------------
  if (next[8])
    return {text: next[8]};
  if (next[2] /*isWord*/)
    return next[0];
  if (next[5] /*isSingleQuote*/)
    return {quote: next[0], text: next[6]};
  if (next[7] /*isDoubleQuote*/)
    return {quote: next[0], text: next[8]};
  if (next[3] /*isNumber*/) {
    let nextNextLookahead = tokens.lookAhead();
    if (nextNextLookahead[2] /*isWord*/ || nextNextLookahead[0] === "%")
      return {type: "number", unit: tokens.next()[0], value: next[0]};
    return {number: true, value: next[0]};
  }

  throw new SyntaxError("Illegal CSS primitive value: " + next[0]);
}


