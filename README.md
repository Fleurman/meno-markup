<<<<<<< HEAD
![Meno-logo](/logo/128.png?raw=true)
# Meno
Meno is _another_ markup language to convert human readable text file into html content.
Meno is **minimal**, it only uses these 8 characters `] : - < [ ; > _ ` yet it is handy !

[You can discover and try it here](https://fleurman.neocities.org/menowriter/)

## syntax

Block:
- `: - :::::: ` = Headers
- `< quote line` = Blockquote
- `; code line` = code
- `-_- comment line`
- `x[ mutliline styled text ]` all blocks can be multiline with brackets

- `]alt]url` = image
- `>text>url` = hypertext

Inline text:
- `text` = plain text
- `<word` = inline italic word
- `_word` = inline underlined word
- `>>word` = inline small word
- `<<word` = inline bold word
- `;word` = inline code word

Group of words can be styled with the use of brackets:
- `x[styled inline text]`

Lists:
- `-` = begin a dotted list
- `]` = begin a numbered list
- the number of tag is the indent

Specials tags:
- `---` = horizontal line
- `---color` = horizontal colored line (color can be a name or a rgb())

- `_tag_(classname)` = this opens a html container with an optional classname.
- `___` = close the opened container.

- `[ text : hint ]` display a hint box when mouse is over the text.

- `<> text <>` create a `nav` element.
=======
![Meno-logo](/logo/128.png?raw=true)
# Meno
Meno is _another_ markup language to convert human readable text file into html content.
Meno is **minimal**, it only uses these 8 characters `] : - < [ ; > _ ` yet it is handy !

The project is still in early stage but some tags are already implemented.

[You can discover and try it here](https://fleurman.neocities.org/menowriter/)

## syntax

Block:
- `: - :::::: ` = Headers
- `< quote line` = Blockquote
- `; code line` = code
- `-_- comment line`
- `x[ mutliline styled text ]` all blocks can be multiline with brackets


- `]alt]url` = image
- `>text>url` = hypertext

Inline text:
- `text` = plain text
- `<word` = inline italic word
- `_word` = inline underlined word
- `>>word` = inline small word
- `<<word` = inline bold word
- `;word` = inline code word

Group of words can be styled with the use of brackets:
- `x[styled inline text]`

Lists:
- `-` = begin a dotted list
- `]` = begin a numbered list
- the number of tag is the indent

Specials tags:
- `---` = horizontal line
- `---color` = horizontal colored line (color can be a name or a rgb())

- `_tag_(classname)` = this opens a html container with an optional classname.
- `___` = close the opened container.
>>>>>>> 324ed1311e113b7cf13ae7bd575a0894af1e83a8
