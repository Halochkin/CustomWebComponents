# HowTo: CSS grid

The grid property is a set of horizontal and vertical lines that intersect - one set defines columns and the other sets
 define columns. Elements can be placed in the grid, rows and columns, respectively.
 
### 1. Description Grid 

The main elements of the grid are:

 * `Container` - contains a grid containing items.
 * `Elements` - HTML elements inside the grid. They are HTML elements of the first level (direct children of the container). 
 For an element to appear in the grid, it must have something (text, other HTML tags) in it (inside). The empty element 
 is only a cell for an arrangement in it of something.
 * `Lines` are shaped lines (in fact, there are no lines) that divide the grid into columns and rows, they create a grid 
 structure. Lines are automatically numbered. You can also specify names for the lines so that you can then attach 
 elements by number or by line name to them. In essence, a line is the number or name of a column/row. The distance 
 between the lines (columns/row lines) can be specified via: `grid-gap`, `grid-row-gap`,`grid-column-gap`.
* `Row/column (track)` - everything between adjacent lines, i.e. lines divide the grid into rows and columns.
* `Cell` - the place where the element will be located. Cell is the intersection of column and row.
* `Area (field)` - combining one or more cells into a common cell (field). It is such a large cell also limited by lines. 
  Areas can be named so that it is convenient to place elements there.
 * `Gap` - the distance between rows and columns. Breaks the line by two. Thus, there is an empty space between the lines 
 and, as a consequence, between the lines and the columns/rows. This is a kind of margin, border-spacing between cells. 
 By default, the line between cells is only one (cells are molded), but if you specify a gap, we will break the line, 
 and the distance between columns / rows will appear, and the number or name of the line (column / row) remains the same.
 
 Try it on [codepen](https://codepen.io/Halochkin/pen/jjJZoa?editors=1000)
 
 To enable grid, any HTML element just needs to have the css property `display:grid;` or `display:inline-grid;` assigned to it.
 ```css
.grid        { display: grid; }
.inline-grid { display: inline-grid; }
```

After enabling grid properties, a grid is created inside the container, and all nested elements (of the first level) become grid cells.

## 2. Grid features 
Grid elements of the grid can be arranged on several grid fields at once. You can change the direction or position of 
elements in the grid. Columns and rows can be named. You can create a grid template and arrange items by template.
* `Column/row sizes.` The grid can be created with exact or flexible column/row sizes (width/height). These are exact 
`px`, `em`, `%` and flexible new units in grid `fr` (fraction - free space in the grid).

>The `fr` unit occupies a fraction of the available space. For example, if the available space was 900px, and the first 
element would get one fraction, and the second - two, the first would get 1/3, and the second - 2/3 of these 900px.

* `Location of the element`. Elements can be placed at a specified grid location by specifying the column/row number or 
name (if any). Or by binding the item to a Grid area (the area to be created). If you do not specify a specific grid 
location, the element is placed in the first free cell by default: as in flex: horizontally (→) or vertically (↓). 
The default behavior can be changed through the grid-auto-flow: property.

* `Alignment of items`. The elements inside the cell can be aligned horizontally/vertically. The item nested in the cell
 is aligned, not the cell itself. For example, the container has a nested element of the first level (it is a cell), 
 inside it there is "text" or some "div" (text or div is a real element) alignment of the element aligns the nested 
 element inside the cell (the cell size will not change).

* `Several elements in one cell`. In one cell or area it is possible to place some elements in one cell or area. To 
specify who is "above" (more important) and who is "below" (unimportant), you need to use the css property `z-index`.

* `Grid extension`. How many columns / rows have a grid usually specified at once, but if you place an element outside
 the grid (specify its row / cell number, which goes outside the grid), then the grid is automatically expanded and 
 additional lines (columns / rows) are created.
 
 
## 3. Grid CSS features for `**container element**`

### **`3.1 display`**
Enables grid property for element. Under this property falls the element itself and its sub-elements: only the descendants 
of the first level are affected - they will become grid elements of the container.
    
* `grid` - the element is stretched out on all width and has the full space among surrounding blocks. Rows are moved at the beginning and end of the block.
* `inline-grid` - the element is surrounded by other elements. Its inner part is formatted as a block element, and the element itself as a built-in one.
 > The difference between `grid` and `inline-grid` is that they interact differently with their surroundings, 
 like `display: block` and `display: inline-block`. 

### **`3.2 grid-template-rows / columns`**
 Specify how many rows (rows) and how many columns the grid consists of and what sizes they have. I.e. two notions 
 are specified at once: how many and what size. In value through spaces the sizes are  specified: 
* `height` of row (rows);
* `width` of column (columns).

 The number of times the size will be specified is the number of rows/columns.

```
grid-template-rows:    size size  ...;
grid-template-columns: size size  ...;

grid-template-rows:    [line-name] size  [line-name] size ... [last-name];
grid-template-columns: [line-name] size  [line-name] size ... [last-name];
```

 1. **`size`** is the height of a row or the width of a column, maybe:
     * **`px, em, %, vh, vw`** - the size is absolute (px, pt), relative (em, vw, vh) or in % of the width/height of the container.
     * **`fr`** (fraction - free space in the grid) - special unit of measurement in the grid. The free space in the container 
     is divided into fractions, so if one column is 1fr and the other is 2fr, the second one will be twice as large as 
     the first one and they will both fill the free space. Analogue of flex-grow: flex-grow: for flex-grow. Here you can 
     also specify fractional values: 0.5fr, 2.3fr.
     * **`min-content`** is the smallest content size. For text, it is the width of the longest word or an unbreakable fragment.
     * **`max-content`** is the largest size of content. For text, it is the length of the longest line without translations.
     * **`auto`**  the size of the row/column is adjusted to the size of the elements, so as to fit the largest of them. 
     It does not allow to shrink less than min-width or min-height of the widest or highest element, respectively.
     Does not allow stretching more than max-content. If there is free space in the container, the size can stretch to
     the end of the container.
     * **`fit-content(max)`** - the function of which the maximum size is passed. If the content is smaller than this size,
     it behaves as auto; if it is larger, it limits the size of the row/column to the size specified in the parameter max.
     * **`minmax(min, max)`** - the function allows you to specify the minimum and maximum sizes at once.

2. **`line-name`** - before the size you can specify (create) a name for the line (row/column). The name is specified in
 square brackets `[name]` 100px. It is also possible to specify several names at once through a space in square brackets: 
`[name new_name] 100px`. You can use any character in the name, including Cyrillic characters.

3. **`last-name (the last name)`** - the specified name will become the name of the initial line of the row/column, but
 the row/column consists of two lines (they are the size). So the name of a line is the name of the beginning of one 
 column (row) and the name of the end of the previous column (row). And so here the grid is filled, but in the end there 
 is a row/column and the name specified for it is a name only of an initial line of this row/column, and the final line 
 of a name does not have. This last line name can be specified at the end.
 I.e. it turns out so: `[name] 100px [name2] 100px [last name] 100px [last name]`.

> These two properties have abbreviated entries:
>```
>grid-template: grid-template-rows / grid-template--columns
>grid: grid-template-rows / grid-template--columns
>```

Try it on [codepen](https://codepen.io/Halochkin/pen/zVXvag?editors=0100)

### `3.3 grid-template-areas` 
Allows you to create a visual grid template. This property specifies cell names and then binds items to these names 
through the grid-area: property specified for the individual item.

The syntax is elegant because it visually shows what the grid looks like:
```
grid-template-areas: "name2 name3"
					 "name4 name5"
					 "name none..."

// or you can do this
grid-template-areas: "name2 name3" "name4 name5" "name6 none ..;

// or single quotes
grid-template-areas: 'name2 name3' 'name4 name5' 'name6 none ..;
```

* `"name2 name3"` - in the meaning inside the quotes you need to specify names through spaces. Each quote with names will 
represent a number of a grid, and names in quotes set names of cells in this number.
* `"name name name name2"` - if to specify one and the same name some times in a row the name will unite cells and we will
 receive area (the big cell). To unite cells in such a way it is possible not only in a row, but also between rows.
* `.` (dot) - is specified instead of the name and denotes a cell that should be skipped (empty cell). It is possible to 
use some points in a row while between them there is no space between them they will be considered as one.
* `none` - the area is not defined

Let's create a grid with four columns and three rows. The entire top row will be the header, the middle row will be the
 content (main) and sidebar, between which we will leave space (.). And the last one will be the basement (footer).
 
 ```html
 <style>
 .item-a { grid-area: header;  }
 .item-b { grid-area: main;    }
 .item-c { grid-area: sidebar; }
 .item-d { grid-area: footer;  }
 
 .container {
 	grid-template-columns: 50px 50px 50px 50px;
 	grid-template-rows: auto;
 	grid-template-areas: "header header header header"
 						 "main   main     .    sidebar"
 						 "footer footer footer footer";
 }
</style>
 
<div class="container">
	<div class="item-a">item-a</div>
	<div class="item-b">item-b</div>
	<div class="item-c">item-c</div>
	<div class="item-d">item-d</div>
</div>
```

Try it on [codepen](https://codepen.io/Halochkin/pen/JQVGZJ?editors=1100)


### `3.3 repeat() — function`

Allows you to repeat something N times. 
> It is used when creating columns/rowings in the following properties: `grid-template-rows`,
 `grid-template--columns`, `grid-template`.

```css
repeat( how many times, what_repeat );
```

**`Using repeat()`**

1. Repetition of any number of rows/columns specified number of times.

 ```css
 repeat( 2, 50px ) // 50px 50px
 repeat( 2, 50px 70px ) // 50px 70px 50px 70px
 ```

2. Repeat one row/column before filling the container. The number of repetitions is specified in this case:
    * `auto-fill` - repeats the row/column as long as there is space in the container. At least one repetition will always
     take place.
         1. If the container is limited to the maximum size, the row/column is repeated as long as there is room to insert
          the next row/column.
         2. If the container has a minimum size, the row/column will be repeated until the minimum size is exceeded.
    * `auto-fit` - the same thing, but after the elements are placed, the remaining empty row/column is compressed and 
    disappears, as a result the container will always look full (without empty spaces on the edges) (this is visible only 
    if there is a rubber block in the container).

### `3.4 grid-row-gap / grid-column-gap / grid-gap`

* `grid-row-gap`: sets the gap between the rows.
* `grid-column-gap`: Sets the gap between the columns.
* `grid-gap`: Sets the gap for rows and columns at once. (`grid-gap: size size /* row column */`)
 
Try it on [codepen](https://codepen.io/Halochkin/pen/OeGXqz?editors=1100)

### `3.5 align-content / justify-content / place-content`

Aligns rows/columns.

* `align-content: value;` - aligns rows vertically `↓↑`;
* `justify-content: value;` -  aligns the columns horizontally `←→`;
* `place-content: value;` - abbreviated entry: sets both values, `place-content: align-content justify-content;`.
 
Possible values: 

* `stretch` (default) - stretches rows/columns (cells) completely. The entire container space is filled. It only makes 
sense if the rows/columns are not dimensioned rigidly (they are rubber). If they are not rubber, they work as start.
* `start` - rows/columns are packed close to each other at the start of the container.
* `end` - rows/columns are packed close to each other at the end of the container.
* `center` - rows/columns are packed close to each other and are in the middle of the container.
* `space-around` - the free space is evenly distributed between the rows/columns and added to the edges. This means that
 the outermost row/columns are not pressed against the edges of the container, but the distance to the edge is half that 
 of the rows/columns.
* `space-evenly` is the same as space-around, but the distance to the edges of the container is the same as between the 
rows/columns.
* `space-between` - the outermost row/column is pressed against the edges of the container and the space is evenly 
distributed between the rows/columns.

Try it on [codepen](https://codepen.io/Halochkin/pen/mZgrqL?editors=0100)

### `3.6 align-items / justify-items / place-items`
Aligns grid elements - what is inside grid cells. Works for all grid elements. 
> To align the cells themselves (column rows), use: `justify-content`, `align-content`, `place-content`.

* `align-items: value;` - aligns items vertically `↓↑`;
* `justify-items: value;` - aligns items horizontally `←→`;
* `place-items: value;` - abbreviated entry: will set both values,`place-items: align-items justify-items;`.

Possible values:

* `auto` (default) - indicates that you want to use the justify-items: value that is set for the container. If the item is
 positioned with absolute, then normal is applied.
* `stretch` - stretches all elements to the full width/height of the cells.
* `start` - places all elements at the beginning of cells (left or top).
* `end` - places all elements in the end of cells (on the right or below).
* `center` - places all elements in the center of cells.

Try it on [codepen](https://codepen.io/Halochkin/pen/jjRyax?editors=0110)

## 4. Grid CSS features for `**elements**`

>CSS properties: `float`, `display: inline-block`, `display: table-cell`, `vertical-align` and `column-*` have no effect
 on grid container elements. Grid grid has its own rules

### `4.1 grid-row-start / grid-row-end / grid-column-start / grid-column-end / grid-row grid-column`
 
Indicates the position of the element in the grid. That is, it places the element in the specified cell. Specify the name
 or line number to which the cell belongs and to which the element should be attached.
`grid-column` and `grid-row` are abbreviations for `grid-column-start/grid-column-end` and `grid-row-start / grid-row-end` 
properties.
 Only the first (single) value can be specified, it will refer to the start line and the item will be stretched to 1 
 row/column (i.e. the start line will be placed in one cell).
 
* `grid-row-start: value;` - where the row line begins
* `grid-row-end: value;` - where the row line ends
* `grid-column-start: value;` - where the column line begins
* `grid-column-end: value;` - where the column line ends
* `grid-row: grid-row-start / grid-row-end;` - short version
* `grid-column: grid-column-start / grid-column-end;`
 You can specify one value, the second value will be span 1.
* `grid-row: grid-row-start;`
* `grid-column: grid-column-start;`
 
Possible values:

* `number/name` - the serial number or name of the line to which the current item is to be attached.
* `span number` - word span means stretch. The current element will be stretched to the specified number of rows/columns.
 If span is specified, it always refers to the second value.
* `span name` - word span means stretch. The current element will be stretched to the specified row/column line name. 
If span is specified, it always refers to the second value.
* `auto` - the element is placed according to the specified algorithm in the property of the container `grid-auto-flow`.

Try it on [codepen](https://codepen.io/Halochkin/pen/mZgWdB?editors=1100)

### `4.2 align-self / justify-self / place-self`

Aligns the current item inside the cell. Applies to a single container element.

* `align-self: value;` - aligns the element inside the cell vertically `↓↑`
* `justify-self: value;` - aligns the element inside the cell horizontally `←→`
* `place-self: value;` - abbreviated entry: sets both values
* `place-self: align-self justify-self;` - shortened record
 
 Possible values:
 
 * `stretch (default)` - stretches the current element to the full width/height of the cell.
 * `start` - places the current element at the beginning of the cell (left or top).
 * `end` - places the current element at the end of the cell (right or bottom).
 * `center` - places the current element in the center of the cell.

Try it on [codepen](https://codepen.io/Halochkin/pen/PrgpRy?editors=0100)

## Reference
* [MDN: Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)


