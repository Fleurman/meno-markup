var meno = (function () {
	return {
		version: '0.9.3',
		loadFile: function (callback, file) {
			var req = new XMLHttpRequest();
			req.onload = function (event) {
				callback(this.responseText);
			};

			req.open('GET', file, true);
			req.send(null);
		},

		readFile: function (file) {
			meno.loadFile(function (response) {
				return response;
			}, file);
		},

		putRaw: function (target, k, file) {
			meno.loadFile(function (response) {
				target[k] = response;
			}, file);
		},

		writeTo: function (target, file) {
			meno.loadFile(function (response) {
				var raw = response;
				var lines = raw.split(/\r\n|\r|\n/);
				meno.setWin(target, meno.parse(lines));
			}, file);
		},

		displayTo: function (target, text) {
			var lines = text.split(/\r\n|\r|\n/);
			meno.setWin(target, meno.parse(lines));
		},

		parsed: function (text) {
			var lines = text.split(/\r\n|\r|\n/);
			return meno.parse(lines);
		},

		setWin: function (target, inner) {
			target.innerHTML = inner;
		},

		parseRaw: function (lines) {
			var tree = {};
			var input = "";
			var id = 0;
			var isBlock = false;
			var list = 0;
			var olistCount = 0;
			var container = [];
			var blockid = 0;
			while (lines[id] !== undefined) {
				input = lines[id];
				input = meno.skipSpace(input);
				var match,
				expr;
				if (isBlock == true) {
					if (match = /^(.*)(\]?)/.exec(input)) {
						//var end = match[1].endsWith(" ]");
						//console.log(match[1].slice(match[1].length-2,1))
						var end = match[1][match[1].length - 1] == "]";
						var bltxt = match[1].replace(/\]$/m, "");
						tree[blockid].value += " \200\n" + bltxt;
						if (end) {
							blockid++;
							isBlock = false;
						}
					}
				} else {
					if (match = /^(:{1,6})(\[)? (.+)/.exec(input)) {
						expr = {
							type: "header",
							priority: match[1].length,
							value: match[3]
						};
						if (match[2]) {
							isBlock = true;
						}
					} else if (match = /^(-{3,})$/.exec(input)) {
						expr = {
							type: "line"
						};
					} else if (match = /^(-{3,})([^ -]+)/.exec(input)) {
						expr = {
							type: "colorline",
							value: match[2]
						};
					} else if (match = /^_(.*):(.*)/.exec(input)) {
						expr = {
							type: "attr",
							name: match[1],
							value: match[2]
						};
					} else if (match = /^<-(.*)<-/.exec(input)) {
						expr = {
							type: "marquee",
							value: match[1],
							direction: "left"
						};
					} else if (match = /^->(.*)->/.exec(input)) {
						expr = {
							type: "marquee",
							value: match[1],
							direction: "right"
						};
					} else if (match = /^<>(.*)<>/.exec(input)) {
						expr = {
							type: "navigation",
							value: match[1]
						};
					} else if (match = /^_([^_]+)_(.*)/.exec(input)) {
						expr = {
							type: "container",
							tag: match[1]
						};
						container.push(match[1]);
						var m2 = match[2];
						if (m2) {
							if(m2[0]=="#"){
								expr.id = m2.slice(1,m2.length);
							}else{expr.classname = m2;}
						}
					} else if (input == "___" && container) {
						expr = {
							type: "closecontainer",
							tag: container.pop()
						};
					} else if (match = /^>([^>]+)>([^ ]+)/.exec(input)) {
						expr = {
							type: "link",
							url: match[2]
						};
						if (match[1] != " ") {
							expr.value = match[1];
						} else {
							expr.value = match[2];
						}
					} else if (match = /^\[([^\[]*)\[(.+)/g.exec(input)) {
						expr = {
							type: "image",
							alt: match[1],
							url: match[2]
						};
					} else if (match = /^(-*) (.+)/.exec(input)) {
						expr = {
							type: "list-item",
							list: "u",
							value: match[2],
							indent: match[1].length
						};
					} else if (match = /^(\]*) (.+)/.exec(input)) {
						expr = {
							type: "list-item",
							list: "o",
							value: match[2],
							indent: match[1].length
						};
					} else if (match = /^<(\[)? (.+)/.exec(input)) {
						expr = {
							type: "quote",
							value: match[2]
						};
						if (match[1]) {
							isBlock = true;
						}
					} else if (match = /^-_-(\[)? (.+)/.exec(input)) {
						expr = {
							type: "comment",
							value: match[2]
						};
						if (match[1]) {
							isBlock = true;
						}
					} else if (match = /^;(\[)? (.+)/m.exec(input)) {
						expr = {
							type: "code",
							value: match[2]
						};
						if (match[1]) {
							isBlock = true;
						}
					} else if (input == "-") {
						expr = {
							type: "return"
						};
					} else if (input == ":") {
						expr = {
							type: "blank"
						};
					} else if (input == "_: ") {
						expr = {
							type: "blank"
						};
					} else if (match = /^(.+)/.exec(input)) {
						expr = {
							type: "text",
							value: match[1]
						};
					} else {
						expr = {
							type: "break"
						};
					}
					if (expr.type != "blank") {
						if (tree[blockid - 1] && expr.type == "text" && tree[blockid - 1].type == expr.type) {
							tree[blockid - 1].value += "\200\n" + expr.value;
						} else {
							tree[blockid] = expr;
							if (isBlock == false) {
								blockid++;
							}
						}
					}
				}
				id++;
			}
			return tree;
		},

		skipSpace: function (string) {
			var first = string.search(/\S/);
			if (first == -1)
				return "";
			return string.slice(first);
		},

		parseText: function (raw) {
			var parsed = raw;
			//parsed = parsed.replace(/^(_)/gm,"");
			parsed = parsed.replace(/(^<| <)([^< \[]+)( |$)/gm, meno.replace.quote);
			parsed = parsed.replace(/(^<| <)\[(.+)\]( |$)/gm, meno.replace.quote);
			parsed = parsed.replace(/(^<<| <<)([^ \[]+)( |$)/gm, meno.replace.bold);
			parsed = parsed.replace(/(^<<| <<)\[(.+)\]( |$)/gm, meno.replace.bold);
			parsed = parsed.replace(/(^>>| >>)([^ \[]+)( |$)/gm, meno.replace.small);
			parsed = parsed.replace(/(^>>| >>)\[(.+)\]( |$)/gm, meno.replace.small);
			parsed = parsed.replace(/(^_| _)([^ \[_]+)( |$)/gm, meno.replace.underline);
			parsed = parsed.replace(/(^_| _)\[([^\]_]+)\]( |$)/gm, meno.replace.underline);
			parsed = parsed.replace(/(^;| ;)\[(.+)\]( |$)/gm, meno.replace.code);
			parsed = parsed.replace(/(^;| ;)([^ \[]+)( |$)/gm, meno.replace.code);
			parsed = parsed.replace(/(^;| ;)(\[)( |$)/gm, meno.replace.code);
			parsed = parsed.replace(/(^>| >)([^>]+)>([^ ]+)( |$)/g, meno.replace.link);
			parsed = parsed.replace(/(^\[| \[)([^\]:]+):(.*)?\](.| |$)/g, meno.replace.hint);
			parsed = parsed.replace(/(\200)/g, "<br \>");
			return parsed;
		},

		parseLink: function (raw) {
			var parsed = raw;
			parsed = parsed.replace(/\]([^\]]+)\](([^ ]+){1})/g, meno.replace.image);
			return parsed;
		},

		attr: {},
		style: {},
		attrList: ["title", "id", "name","class"],
		styleList: ["cursor", "color", "font"],

		addInlines: function(){
			var t = "";
			t += this.addAttr();
			t += this.addStyle();
			return t;
		},
		addAttr: function () {
			var k = Object.keys(meno.attr);
			if(k.length==0)return "";
			var t = " ";
			for (i in k) {
				var v = meno.attr[k[i]];
				if (v != "") {
					t += k[i] + "=\"" + v + "\" ";
				}
			}
			return t;
		},
		addStyle: function () {
			var k = Object.keys(meno.style);
			if(k.length==0)return "";
			var t = ' style="';
			for (i in k) {
				var v = meno.style[k[i]];
				if (v != "") {
					t += k[i] + ":" + v + ";";
				}
			}
			t+= '"';
			return t;
		},

		replace: {
			code: function (match, tag, cont, rest) {
				//style='display:inline-block;'
				return " <code meno-inblock >" + cont + "</code> " + rest;
			},
			quote: function (match, tag, cont, rest) {
				return " <q>" + cont + "</q> " + rest;
			},
			underline: function (match, tag, cont, rest) {
				return " <span meno-underline>" + cont + "</span>" + rest;
			},
			bold: function (match, tag, cont, rest) {
				return " <strong>" + cont + "</strong>" + rest;
			},
			small: function (match, tag, cont, rest) {
				return " <small>" + cont + "</small> " + rest;
			},
			link: function (match, tag, txt, url) {
				var link = txt == " " ? url : txt
					return " <a href='" + url + "' target='_blank' " + meno.addInlines() + ">" + link + "</a> ";
			},
			image: function (match, alt, url) {
				return "<img alt='" + alt + "' src='" + url + "' />\n";
			},
			hint: function (match, tag, text, hint, rest) {
				return " <span meno-tip>" + meno.parseText(text) + "<span meno-tipbox>" + hint + "</span></span>" + rest;
				//return " <span class='tt' title='"+hint+"'>"+meno.parseText(text)+"</span>"+rest;
			},
			title: function (match, tag, text, hint, rest) {
				return " ";
			}
		},

		produceHTML: function (tree) {
			var i = 0;
			var t = {};
			var ulist = 0;
			var listArr = [];
			var elems = "";
			for (i in tree) {
				t = tree[i];
				switch (t.type) {
				case "list-item":
					if (t.indent < ulist) {
						var l = 0;
						for (l = 0; l < (ulist - t.indent); l++) {
							elems += listArr.pop();
						}
					}
					if (t.indent > ulist) {
						var l = 0;
						for (l = 0; l < (t.indent - ulist); l++) {
							elems += "<" + t.list + "l>\n";
						}
						listArr.push("</" + t.list + "l>\n");
					}
					var ptext = meno.parseText(t.value);
					elems += "<li>" + ptext + "</li>\n";
					ulist = t.indent;
					break;
				default:
					if (ulist > 0) {
						var l = 0;
						for (l = 0; l < (ulist); l++) {
							elems += listArr.pop();
						}
					}
					ulist = 0;
				}
				switch (t.type) {
				case 'text':
					var ptext = meno.parseText(t.value);
					elems += "<p " + meno.addInlines() + ">" + ptext + "</p>\n";
					break;
				case 'header':
					elems += "<h" + t.priority + " " + meno.addInlines() + ">" + t.value + "</h" + t.priority + ">\n";
					break;
				case 'quote':
					var ptext = meno.parseText(t.value);
					elems += "<blockquote " + meno.addInlines() + ">" + ptext + "</blockquote>\n";
					break;
				case 'marquee':
					var ptext = meno.parseText(t.value);
					elems += "<marquee>" + ptext + "</marquee>\n";
					break;
				case 'navigation':
					var ptext = meno.parseText(t.value);
					elems += "<nav>" + ptext + "</nav>\n";
					break;
				case 'comment':
					elems += "<!--" + t.value + "-->\n";
					break;
				case 'code':
					elems += "<code " + meno.addInlines() + ">" + t.value + "</code>\n";
					break;
				case 'image':
					elems += "<img " + meno.addInlines() + "alt='" + t.alt + "' src='" + t.url + "' />\n";
					break;
				case 'link':
					elems += "<a " + meno.addInlines() + "href='" + t.url + "' target='_blank'>" + meno.parseLink(t.value) + "</a>\n";
					break;
				case 'container':
					elems += "\n<" + t.tag;
					if (t.classname) { elems += " class='" + t.classname + "'"; }
					if (t.id) { elems += " id='" + t.id + "'"; }
					elems += " >\n";
					break;
				case 'closecontainer':
					elems += "</" + t.tag + ">\n";
					break;
				case 'return':
					elems += "\n <br /> \n";
					break;
				case 'line':
					elems += "\n <hr /> \n";
					break;
				case 'colorline':
					elems += "\n<div style='height:2px;margin:1em 0;" +
					"background-color:" + t.value + "'></div>\n";
					break;
				case 'attr':
					if (t.name == "") {
						meno.attr = {};
						meno.style = {};
					} else if (meno.styleList.indexOf(t.name) != -1) {
						meno.style[t.name] = t.value;
					} else if (meno.attrList.indexOf(t.name) != -1) {
						meno.attr[t.name] = t.value;
					}
					break;
				default:
					elems = elems;
				}
			}
			return elems;
		},

		parse: function (lines) {
			var val;
			val = meno.parseRaw(lines);
			var inner = meno.produceHTML(val);
			return inner;
		},

		css: ".meno{font-family:Calibri}.meno code{display:block;background-color:#f5f5f5;color:#696969;font-family:consolas}.meno textarea{resize:none}.meno h1,h2,h3,h4,h5,h6{margin-bottom:-10px}.meno a{color:#87ceeb;text-decoration:none;border-bottom:1px solid #d3d3d3;border-top:1px solid #d3d3d3}.meno article{font-family:Consolas}.meno nav{margin:5px;display:inline-block;padding:0 5px;border-right:2px solid #d3d3d3;border-left:2px solid #d3d3d3;background-color:#fafafa}.meno nav a{border:none}.meno blockquote{font-style:italic;margin-left:1em}.meno ol,.meno ul{margin-left:20px;display:inline-block}.meno blockquote:before{content:''' '}.meno blockquote:after{content:' '''}.meno ul{padding:5px;border-top:2px solid #d3d3d3;border-bottom:2px solid #d3d3d3}.meno ul ul{border:none;padding:2px}.meno ul li{font-size:1.25em;font-weight:700;list-style-type:none}.meno ul li:before{content:'| '}.meno ul ul li{font-size:1.15em;font-weight:700;color:#696969}.meno ul ul li:before{content:': ';color:#000}.meno ul ul ul li{font-size:1.1em;font-weight:400;color:grey}.meno ul ul ul li:before{content:'· ';color:#000}.meno ul ul ul ul li{font-size:1em;font-weight:400;color:#000}.meno ul ul ul ul li:before{content:'- ';color:#000}.meno ol{padding:5px;border-top:2px solid #d3d3d3;border-bottom:2px solid #d3d3d3}.meno ol ol{border:none;padding:2px}.meno ol li{font-size:1.25em;font-weight:700}.meno ol ol li{font-size:1.15em;font-weight:700;color:#696969}.meno ol ol ol li{font-size:1.1em;font-weight:400;color:grey}.meno ol ol ol ol li{font-size:1em;font-weight:400;color:#000}.meno [meno-inblock]{display:inline-block}.meno [meno-underline]{text-decoration:underline}.meno [meno-tip]{position:relative;display:inline;border-bottom:1px dotted pink}.meno [meno-tip] [meno-tipbox]{font-size:13px;visibility:hidden;min-width:100px;background-color:rgba(50,50,50,.8);color:#fff;border-radius:10px 0;padding:3px 8px;position:absolute;z-index:1;bottom:100%;left:50%;opacity:0;transition:opacity .3s}.meno [meno-tip] [meno-tipbox]:before{content:'';position:absolute;bottom:0;left:0;border-width:5px;border-style:solid;border-color:transparent transparent pink pink}.meno [meno-tip]:hover [meno-tipbox]{visibility:visible;opacity:1}.meno [meno-tip]:hover{background-color:rgba(250,200,200,.1);cursor:help}.meno ::selection{background-color:orange;color:#fff}",

		addCSS: function () {
			var styl = document.createElement("style");
			styl.innerHTML = meno.css;
			var styls = document.getElementsByTagName("style");
			var links = document.getElementsByTagName("link");
			if (styls.length > 0) {
				document.head.insertBefore(styl, styls[0]);
			} else if (links.length > 0) {
				document.head.insertBefore(styl, links[0]);
			} else {
				document.head.appendChild(styl);
			}
		},

		convert: function () {
			var menos = document.querySelectorAll("script[type='text/meno']");
			for (var i = 0; i < menos.length; i++) {
				var raw = menos[i].innerHTML;
				var art = document.createElement("article");
				art.className = 'meno';
				menos[i].parentNode.insertBefore(art, menos[i]);
				art.innerHTML = meno.parsed(raw);
				menos[i].parentNode.removeChild(menos[i]);
			}
		}
	};
})();
