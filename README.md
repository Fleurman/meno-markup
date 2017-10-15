# Meno
---
Meno is _another_ markup language to convert human readable text file into html content.
Meno is **minimal**, it only uses these 8 characters `] : - < [ ; > _ ` yet it is handy !

This script is the Meno parser written in `Javascript`.
The project is still in early stage but some tags are already implemented.

[You can discover and try it here](https://fleurman.neocities.org/menowriter/)

## syntax

Block:

- `: - :::::: ` = Headers 
- `< quote line` = Blockquote
- `; code line` = code
- `-_- comment line`

All blocks can be multiline with brackets:
- `x[ mutliline \nstyled text ]`

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

Specials tags:
- `---` = horizontal line
- `---color` = horizontal colored line (color can be a name or a rgb())

- `_tag_(classname)` = this opens a html container with an optional classname.
- `___` = close the opened container.
