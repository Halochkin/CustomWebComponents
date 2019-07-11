# HowTo: CSS grid

The grid property is a set of horizontal and vertical lines that intersect - one set defines columns and the other sets
 define columns. Elements can be placed in the grid, rows and columns, respectively.
 
### Description Grid 

The main elements of the grid are:

 * `Container` - contains a Grid grid containing items.
 
 * `Elements` - HTML elements inside the grid. They are HTML elements of the first level (direct children of the container). 
 For an element to appear in the grid, it must have something (text, other HTML tags) in it (inside). The empty element 
 is only a cell for an arrangement in it of something.
 
 * `Lines` are shaped lines (in fact, there are no lines) that divide the grid into columns and rows, they create a grid 
 structure. Lines are automatically numbered. You can also specify names for the lines so that you can then attach 
 elements by number or by line name to them. In essence, a line is the number or name of a column/row. The distance 
 between the lines (columns/row lines) can be specified via grid-gap:, grid-row-gap:, grid-column-gap:.
 
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

## 1. Grid features for `**container element**`
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

 
 
#### `1.1 grid-template-rows / columns` 
 Specify how many rows (rows) and how many columns the grid consists of and what sizes they have. I.e. two notions 
 are specified at once: how many and what size. In value through spaces the sizes are  specified: 
`height` of row (rows) or `width` of column (columns). The number of times the size will be specified is the number of rows/columns.

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
  * **`fit-content(max)`** - the function of which the maximum size is passed. If the content is smaller than this size, it behaves as auto; if it is larger, it limits the size of the row/column to the size specified in the parameter max.
  * **`minmax(min, max)`** - the function allows you to specify the minimum and maximum sizes at once.

2. **`line-name`** - before the size you can specify (create) a name for the line (row/column). The name is specified in square brackets [name] 100px. It is also possible to specify several names at once through a space in square brackets: [name still_name] 100px. You can use any character in the name, including Cyrillic characters.

3. **`last-name (the last name)`** - the specified name will become the name of the initial line of the row/column, but the row/column consists of two lines (they are the size). So the name of a line is the name of the beginning of one column (row) and the name of the end of the previous column (row). And so here the grid is filled, but in the end there is a row/column and the name specified for it is a name only of an initial line of this row/column, and the final line of a name does not have. This last line name can be specified at the end. I.e. it turns out so: [name] 100px [name2] 100px [last name] 100px [last name].

These two properties have abbreviated entries:
```
grid-template: grid-template-rows / grid-template--columns
grid: grid-template-rows / grid-template--columns
```
### Example

Lets create a grid (container) with three columns and three rows, the last column and row will have the same name 'main'
```css
.grid {
	grid-template-columns: 100px  10%  [main] 800px;
	grid-template-rows: 100px  10%  [main] 800px;
}
```
If you do not specify a name, the row/column automatically receives two consecutive numeric names: positive and negative:

```css
.grid {
grid-template-columns: 40px 50px auto 50px 40px;
grid-template-rows: 25% 100px auto;
}
```

#### `1.2 grid-template-areas` 
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

`"name2 name3"` - in the meaning inside the quotes you need to specify names through spaces. Each quote with names will 
represent a number of a grid, and names in quotes set names of cells in this number.

`"name name name name2"` - if to specify one and the same name some times in a row the name will unite cells and we will
 receive area (the big cell). To unite cells in such a way it is possible not only in a row, but also between rows.

`.` (dot) - is specified instead of the name and denotes a cell that should be skipped (empty cell). It is possible to 
use some points in a row while between them there is no space between them they will be considered as one.

`none` - the area is not defined

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

#### `1.3 grid-template`
  Allows you to specify three properties at once: grid-template-rows, grid-template--columns and grid-template-areas.
```
grid-template: none;
grid-template: grid-template-rows / grid-template-columns;
grid-template: [ line-names? "строка" размер? line-names? ] ...
grid-template: [ line-names? "строка" размер? line-names? ] ... / [ line-names? размер ] ... line-names?
```

In the first parameter (in rows) you can specify the template (areas). 25px is the height of the row.
```css
.item{
grid-template: "header header header" 25px
			   "footer footer footer" 25px
			   / auto  50px   auto;
}
```

#### `1.4 repeat() — function`

Allows you to repeat something N times. It is used when creating columns/rowings in the following properties: `grid-template-rows`,
 `grid-template--columns`, `grid-template`.

```
repeat( how many times, what_repeat )
```

##### repeat() example

```
repeat( 2, 50px )       // 50px 50px
repeat( 2, 50px 70px )  // 50px 70px 50px 70px
```

#### `1.5 grid-gap`








#### `grid-auto-rows` - defines the size of implicitly created grid rows.
* `grid-auto-columns` - defines the size of implicitly created grid columns.
* `grid-auto-flow` - defines how the automatic placement algorithm works, exactly how the elements will be placed in the grid.
* `grid-column-gap` - sets deviations between the grid columns.
* `grid-row-gap` - sets deviations between the grid rows.










































For example, two pieces of styles written below are identical:

```css
.children {
  grid: row 100px / max-content;
}

.children {
  grid-auto-flow: row;
  grid-auto-rows: 100px;
  grid-auto-columns: max-content;
}
```

### Example: Creating a grid block with two pegs and three rows of different sizes

```html
<style>
.grid{
	display: grid;
	           /* rows / columns */ 
	grid: 1fr 25% 30px / 40% 1fr;   /*equals to: grid-template-columns: 1fr 25% 30px;  grid-template-rows: 40% 1fr; */
	grid-gap: 1em;
	height: 200px;
}
</style>

<div class="grid">
	<div class="item">item 1</div>
	<div class="item">item 2</div>
	<div class="item">item 3</div>
	<div class="item">item 4</div>
	<div class="item">item 5</div>
	<div class="item">item 6</div>
</div>
```

###


















The `grid` property also takes on a more complex but convenient syntax to configure everything at the same time. You 
specify `grid-template-areas`, `grid-template-rows`, `grid-template--columns` and all other sub-properties automatically get
 their values without specifying them. You can specify row names and track sizes according to their networks.

This is best described by way of example:

```css
.area {
  grid: [row1-start] "header header header" 1fr [row1-end]
          [row2-start] "footer footer footer" 25px [row2-end] / auto 50px auto;
}
.area {
  grid-template-areas: 
    "header header header"
    "footer footer footer";
  grid-template-rows: [row1-start]  [row1-end row2-start] 25px [row2-end];
  grid-template-columns: auto 50px auto;    
}
```