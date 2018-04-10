![Meno-logo](/logo/128.png?raw=true)
# Meno
Meno is _another_ markup language to convert human readable text file into html content.
Meno is **minimal**, it only uses these 9 characters `]:-<[;>^_` yet it is handy !

[You can discover and try it here](https://fleurman.neocities.org/menowriter/)

## Syntax

#### Bloc:
- `: - :::::: ` = Headers
- `< quote line` = Blockquote
- `; code line` = code
- `-_- comment line`
- `x[ mutliline styled text ]` all blocks can be multiline with brackets
---
- `[alt[url` = image
- `>text>url` = hypertext

#### Inline text:
- `text` = plain text
- `<word` = inline quote word
- `^word` = inline italic word
- `_word` = inline underlined word
- `>>word` = inline small word
- `<<word` = inline bold word
- `;word` = inline code word
- `^^word` = inline supertext word
- `__word` = inline subtext word

**Group of words can be styled in two ways**
- with the use of brackets: `x[styled inline text]`
- by linking the words with underscores `;this_is_a_code_line` (the underscores will be replaced by spaces)

#### Lists:
- `-` = begin a dotted list
- `]` = begin a numbered list
- the number of tag is the indent

#### Specials tags:
- `---` = horizontal line
- `---color` = horizontal colored line (color can be a name or a rgb())
- - `_tag_(classname)` = this opens a html container with an optional classname.
- - `___` = close the opened container.
- `[ text : hint ]` display a hint box when mouse is over the text.
- - `<> text <>` create a `nav` element.
- `_attr:val` = This sets the _attr_ of all the next elements to be _val_.
- `_attr:` = This reset the _attr_ so the next elements won't have it.
- `_:` = This reset all the _attr_.


## Methods

- `meno.writeTo(element,file)` = Load _file_ with AJAX and put the parsed result in the `innerHTML` of _element_.
- `meno.displayTo(element,raw)` = Put the parsed _raw_ in the `innerHTML` of _element_.
---
- `meno.addCSS()` = Adds the **Meno.css** to the `<head>` of the page.

### Internal Meno
Use a `<script>` tag with `type=text/meno` to write internal meno articles:
```html
<script type="text/meno">
  //Put your meno here
</script>
```
- `meno.convert()` = Converts all the `<script type="text/meno">` into html.
