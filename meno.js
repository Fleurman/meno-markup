var meno = (function () {
	var m = { version: "0.9.8" };
	m.checkUpdates = function(){
		loadFile(function (js) {
			try {
				var v = (/version:"(.+?)"/.exec(js))[1];
				if (m.version < v){
					console.log("An updated Meno ("+v+") is available !\n(this Meno: "+m.version+")\nGo to https://github.com/Fleurman/meno-markup/ to get the lastest version.");
				} else {
					console.log("this Meno ("+m.version+") is up to date ! :)");
				}
			} 
			catch(e) { console.log(e,"Unable to connect to https://raw.githubusercontent.com/Fleurman/meno-markup/master/meno.min.js"); }
			
		}, "https://raw.githubusercontent.com/Fleurman/meno-markup/master/meno.min.js");
	};
	loadFile =  function (callback, file) {
		var req = new XMLHttpRequest();
		req.onload = function (event) {
			callback(this.responseText);
		};
		req.open('GET', file, true);
		req.send(null);
	};

	m.putRaw= function (target, k, file) {
		loadFile(function (response) {
			target[k] = response;
		}, file);
	};

	m.writeTo= function (target, file) {
		loadFile(function (response) {
			var raw = response;
			var lines = raw.split(/\r\n|\r|\n/);
			putIn(target, parse(lines));
		}, file);
	};

	m.displayTo= function (target, text) {
		var lines = text.split(/\r\n|\r|\n/);
		putIn(target, parse(lines));
	};

	m.parsed= function (text) {
		var lines = text.split(/\r\n|\r|\n/);
		return parse(lines);
	};

	putIn= function (target, inner) {
		target.innerHTML = inner;
	};

	parseRaw= function (lines) {
		var tree = {};
		var data = {
			id: 0,
			isBlock: false,
			isRaw: false,
			list: 0,
			container: [],
			blockid: 0
		}
		while (lines[data.id] !== undefined) {
			var input = lines[data.id].trim(),match,expr;
			if (data.isRaw == true) {
				if (input == '><') {
					data.blockid++;
					data.isRaw = false;
				} else {
					tree[data.blockid].value += input;
				}
			} else if (data.isBlock == true) {
				if (match = /^(.*)(\]?)/.exec(input)) {
					var end = match[1][match[1].length - 1] == "]";
					var bltxt = match[1].replace(/\]$/m, "");
					tree[data.blockid].value += " \200\n" + bltxt;
					if (end) {
						data.blockid++;
						data.isBlock = false;
					}
				}
			} else {
				if (match = /^(:{1,6})(\[)? (.+)/.exec(input)) {
					expr = {
						type: "header",
						priority: match[1].length,
						value: match[3]
					};
					if (match[2]) { data.isBlock = true; }
				} else if (match = /^-{3,}([^ -]+)?$/.exec(input)) {
					expr = {
						type: "hr"
					};
					if(match[1]!=undefined){
						expr.type = "colorline";
						expr.value = match[1];
					}
				}  
				else if (match = /^__(-{2,}|:{2,}|\]{2,})_/.exec(input)) {
					expr = {
							type: "columns",
							rule: rule(match[1][0]),
							count: match[1].length,
							tag: "div"
						   };
					data.container.push("div");
				}
				else if (match = /^_(.*):(.*)/.exec(input)) {
					expr = {
						type: "attr",
						name: match[1],
						value: match[2]
					};
				} else if (match = /^(<-|->)(.*)\1/.exec(input)) {
					expr = {
						type: "marquee",
						value: match[2],
						direction: match[1]=="<-"?"left":"right"
					};
				}
				else if (match = /^<>(.*)<>/.exec(input)) {
					expr = {
						type: "nav",
						value: match[1]
					};
				} else if (match = /^__([^_ ]+)_(.*)/.exec(input)) {
					expr = {
						type: "container",
						tag: match[1]
					};
					data.container.push(match[1]);
					if (match[2]) {
						if(match[2][0]=="#"){
							expr.id = match[2].slice(1,match[2].length);
						}else{expr.classname = match[2];}
					}
				} 
				else if (input == "____" && data.container.length > 0) {
					expr = {
						type: "closecontainer",
						tag: data.container.pop()
					};
				} else if (match = /^<([\w]+?):([^>]+)>/.exec(input)) {
					expr = {
						type: "audio",
						mime: getMIME(match[1]),
						src: match[2]
					};
				} else if (match = /^:(.*?)>(\[??)?(.+)/.exec(input)) {
					expr = {
						type: "details",
						value: match[3]
					};
					if (is(match[1])) {expr.title = match[1];}
					if (match[2]) { data.isBlock = true; }
				} else if (match = /^><(.?)$/.exec(input)) {
					expr = {
						type: "raw",
						value: match[1]
					};
					if (is(match[1])) {
						data.isRaw = true;
						expr.value = "";
					}
				}
				else if (match = /^\[([^\[]*)\[(.+)/g.exec(input)) {
					expr = {
						type: "image",
						alt: match[1],
						url: match[2]
					};
				}
				else if (match = /^(-+|\]+|\^+) (.+)/.exec(input)) {
					var h = { "-":"u", "]":"o","^":"f"};
					expr = {
						type: "list-item",
						list: h[match[1][0]],
						value: match[2],
						indent: match[1].length
					};
				}
				else if (match = /^(<|-_-|;)(\[)? (.+)/.exec(input)) {
					expr = {
						type: tToWord(match[1]),
						value: match[3]
					};
					if (match[2]) { data.isBlock = true; }
				} 
				else if (input == "-" || input == ":") {
					expr = {
						type: tToWord(input)
					};
				}
				else if (match = /^(.+)/.exec(input)) {
					expr = {
						type: "text",
						value: match[1]
					};
				}
				else {
					expr = {
						type: ""
					};
				}
				if (expr.type != "blank") {
					if (tree[data.blockid - 1] && expr.type == "text" && tree[data.blockid - 1].type == expr.type) {
						tree[data.blockid - 1].value += "\200\n" + expr.value;
					} else {
						tree[data.blockid] = expr;
						if(data.isBlock==false&&data.isRaw==false)data.blockid++;
					}
				}
			}
			data.id++;
		}
		return tree;
	};
	
	is = function(str){return str.trim().length>1?true:false;}
	rule = (function(){
		var h = {":":"4px dotted lightgrey","]":"1px solid lightgrey"}
		return function(c){
			if(h[c])return h[c];
			return false;
		}
	})();
	
	tToWord = (function(){ 
		var h = {
			"-":"br",
			":":"blank",
			"<":"blockquote",
			"-_-":"comment",
			";":"code"}; 
		return function(t){return (h[t]||t);}; 
	})();
	
	getMIME = (function(){
		var h = {"mp3":"mpeg","ogg":"ogg"};
		return function(m){
			return "audio/"+h[m];
		}
	})();

	doParseInline = function(raw,tag,el){
		raw = raw.replace(Reg.w(tag), Rep.word.bind(Rep,el));
		raw = raw.replace(Reg.b(tag), Rep.bloc.bind(Rep,el));
		return raw;
	}
	
	parseText= function (parsed) {
		
		parsed = parsed.replace(/</g,"&lt;");
		
		parsed = parsed.replace(Reg.l(), Rep.link);
		
		parsed = parsed.replace(/(?:^| )\[([^\]:]+?):(.+?)\](?: |$|)/gm, Rep.hint);
		
		var inlines = [
						"__",		"sub", 
						"\\^\\^",	"sup",
						"\\^",		"i",
						"&lt;&lt;",	"b",
						"&lt;",		"q",
						">>",		"small",
						"_",		"u",
						"--",		"del", 
						";;",		"samp",
						"->",		"mark"
					  ];
		for (var i = 0 ; i<inlines.length ; i+=2){
			parsed = doParseInline(parsed,inlines[i],inlines[i+1]);
		}
		
		parsed = parsed.replace(Reg.w(";"), Rep.wcode);
		parsed = parsed.replace(Reg.b(";"), Rep.code);
		
		parsed = parsed.replace(/(?: |^)\[([^\[]+)\[([^ ]+)(?: |$)/gm, Rep.imageinline);
		
		parsed = parsed.replace(Reg.b(">\&lt;"), Rep.raw);
		
		parsed = parsed.replace(/(\200)/g, "<br>");
		
		return unescape(parsed);
	};

	parseLink= function (raw) {
		var parsed = raw;
		parsed = parsed.replace(/(?: |^)\[([^\[]+)\[([^ ]+)(?: |$)/gm, Rep.image);
		return parsed;
	};
	
	Reg = {
		w: function(tag){return new RegExp("(?: |^)"+tag+"([^ \\n\\.\\[]+)(?: |$)","g");},
		b: function(tag){return new RegExp("(?: |^)"+tag+"\\[(.+?)\\](?: |$)","g");},
		l: function(tag){return new RegExp("(?: |^)>([^><]+?)(&lt;|>)([^ ;]+);?([^ ]*?)( |\200|$)","gm");},
	};

	Rep= {
		getHTML: function(tag,cont){ return " <"+tag+">"+cont+"</"+tag+"> " },
		
		getImg: function(alt,url,line){
			return ' <img alt="'+alt+'" src="'+url+'" '+(line ? 'style="display:inline;"' : "")+' title="'+alt+'" > ';
		},
		
		raw: function (m, cont) { return cont; },
		
		code: function (m, cont) { return " <code meno-inblock >" + escape(cont) + "</code> "; },
		wcode: function (m, cont) { return Rep.code(m, Rep.wordspace(cont)); },
		
		underline: function (m, cont) { return " <span meno-underline>" + cont + "</span>" + rest; },
		
		link: function (match, txt, mod, url, down, rest) {
			console.log(txt, mod, url, down);
			return " <a href='" + url + "' target='"+(mod==">"?"_blank":"_self")+"' " + 
					addInlines() + (down?'download="'+down+'"':"") +">" + 
					(txt==" "?url:parseLink(txt)) + "</a>"+rest;
		},
		
		image: function (match, alt, url) { return Rep.getImg(alt,url); },
		imageinline: function (match, alt, url) { return Rep.getImg(alt,url,true); },
		
		hint: function (match, text, hint) {
			return " <span meno-tip=\""+hint+"\">" + parseText(text) + "</span> ";
		},
		
		wordspace: function(str){return str.replace(/(_)/gm," ");},
		
		word: function(tag, m, cont){
			return Rep.getHTML(tag,Rep.wordspace(cont));
		},
		
		bloc: function(tag, m, cont){
			return Rep.getHTML(tag,cont);
		}
	};
	
	attr= {};
	style= {};
	attrList= ["class", "name", "title"];
	styleList= ["cursor", "color", "font", "float", "background"];

	addInlines= function(){
		var t = "";
		t += addAttr();
		t += addStyle();
		return t;
	};
	addAttr= function () {
		var k = Object.keys(attr);
		if(k.length<1)return "";
		var t = " ";
		for (i in k) {
			var v = attr[k[i]];
			if (v != "") {
				t += k[i] + "=\"" + v + "\" ";
			}
		}
		return t;
	};
	addStyle= function () {
		var k = Object.keys(style);
		if(k.length<1)return "";
		var t = ' style="';
		for (i in k) {
			var v = style[k[i]];
			if (v != "") {
				t += k[i] + ":" + v + ";";
			}
		}
		t+= '"';
		return t;
	};
	
	getTab = function(n){ var t = ""; for(var i = 0;i<n;i++){t+="  ";} return t; };
	
	simpleHTML = function(tag,val,noin){ 
		return "<"+tag+(!noin?addInlines():"")+">"+parseText(val)+"</"+tag+">\n"; 
	}
	
	support = function(pro,val){return '-webkit-'+pro+':'+val+';'+'-moz-'+pro+':'+val+';'+pro+':'+val+';';};
	
	produceHTML= function (tree) {
		var i = 0;
		var t = {};
		var ulist = 0;
		var listArr = [];
		var elems = "";
		for (i in tree) {
			t = tree[i];
			if (t.type == "list-item" ) {
				if(t.list!="f"){
					if (t.indent < ulist) {
						for (var l = 0; l < ulist - t.indent; l++) {
							elems += listArr.pop();
						}
					}
					if (t.indent > ulist) {
						for (var l = 0; l < t.indent - ulist; l++) {
							elems += getTab(t.indent-1)+"<" + t.list + "l>\n";
							listArr.push(getTab(t.indent-1)+"</" + t.list + "l>\n");
						}
					}
				elems += getTab(t.indent)+"<li>" + parseText(t.value) + "</li>\n";
				//console.log(ulist, t.indent, t.list);
				ulist = t.indent;
				}else
					elems += getTab(t.indent)+"\t"+parseText(t.value) + "<br>\n";
			} else {
				for (var l = 0; l < listArr.length ; l++) {
					elems += listArr.pop();
				}
				ulist = 0;
			}
			switch (t.type) {
			case 'raw':
				elems += t.value+"\n";
				break;
			case 'text':
				elems += simpleHTML("p",t.value)
				break;
			case 'header':
				elems += simpleHTML("h"+t.priority,t.value)
				break;
			case 'sub': case'sup': case 'code': case 'nav': case 'blockquote':
				elems += simpleHTML(t.type,t.value)
				break;
			case 'marquee':
				var ptext = parseText(t.value);
				elems += "<marquee direction='"+t.direction+"'>" + ptext + "</marquee>\n";
				break;
			case 'comment':
				elems += "<!--" + t.value + "-->\n";
				break;
			case 'image':
				elems += "<img " + addInlines() + "alt='" + t.alt + "' src='" + t.url + "' >\n";
				break;
			case 'container':
				elems += "\n<" + t.tag + 
				(t.classname?" class='"+t.classname+"'":"") +
				(t.id?" id='"+t.id+"'":"") + " >\n";
				break;
			case 'columns':
				elems += '\n<div meno-col style="'+ 
				support("column-count",t.count)+
				(t.rule?support("column-rule",t.rule):"")+'">\n';
				break;
			case 'closecontainer':
				elems += "</" + t.tag + ">\n";
				break;
			case 'br': case 'hr':
				elems += "<"+t.type+(t.type=="hr"?addInlines():"")+">\n";
				break;
			case 'colorline':
				elems += "\n<div meno-hr " +
				"style='background-color:" + t.value + "'></div>\n";
				break;
			case 'audio':
				elems += '\n<audio'+addInlines()+'controls type="'+ t.mime + '" src="' + t.src + '"></audio>\n';
				break;
			case 'details':
				elems += '\n<details'+addInlines()+'>\n'+(t.title?'<summary>'+t.title+'</summary>\n':'')+
				'<span>'+(t.value.replace(/(\200)/g, "<br>"))+'</span>\n</details>\n';
				break;
			case 'attr':
				if (t.name == "") {
					attr = {};
					style = {};
				} else if (styleList.indexOf(t.name) != -1) {
					style[t.name] = t.value;
				} else if (attrList.indexOf(t.name) != -1) { 
					attr[t.name] = t.value; 
				}
				break;
			default:
				elems = elems;
			}
		}
		attr = {};
		style = {};
		return elems;
	};

	parse= function(lines) {
		var val;
		val = parseRaw(lines);
		var inner = produceHTML(val);
		return inner;
	};

	m.css= ".meno{font-family:Calibri}.meno code{display:block;background-color:#f5f5f5;color:#696969;font-family:consolas}.meno textarea{resize:none}.meno details{border-bottom:2px dotted #d3d3d3;border-right:2px dotted #d3d3d3}.meno details span{color:grey;font-size:.9em;padding-left:20px;display:block}.meno [meno-inblock],.meno nav,.meno ol,.meno ul{display:inline-block}.meno h1,h2,h3,h4,h5,h6{margin-bottom:0}.meno a{color:#87ceeb;text-decoration:none;border-bottom:1px solid #d3d3d3;border-top:1px solid #d3d3d3}.meno article{font-family:Consolas}.meno nav{margin:5px;padding:0 5px;border-right:2px solid #d3d3d3;border-left:2px solid #d3d3d3;background-color:#fafafa}.meno nav a{border:none}.meno blockquote{font-style:italic;margin-left:1em}.meno blockquote:before{content:''' '}.meno blockquote:after{content:' '''}.meno ul{padding:5px;border-top:2px solid #d3d3d3;border-bottom:2px solid #d3d3d3}.meno ul ol,.meno ul ul{border:none;padding:2px;margin-left:20px}.meno ul>li{font-size:1.2em;font-weight:700;list-style-type:none}.meno ul>li:before{content:'| '}.meno ul ul>li{font-size:1.1em;font-weight:700;color:#696969}.meno ul ul>li:before{content:': ';color:#000}.meno ul ul ul>li{font-size:1.05em;font-weight:400;color:grey}.meno ul ul ul>li:before{content:'· ';color:#000}.meno ul ul ul ul>li{font-size:1em;font-weight:400;color:#000}.meno ul ul ul ul>li:before{content:'- ';color:#000}.meno ol{padding:5px;list-style-position:inside;border-top:2px solid #d3d3d3;border-bottom:2px solid #d3d3d3}.meno ol ol,.meno ol ul{border:none;padding:2px;margin-left:20px}.meno ol>li{font-size:1.2em;font-weight:700;border-bottom:1px dashed #d3d3d3}.meno ol ol>li{font-size:1.1em;font-weight:700;color:#696969;border-bottom:none}.meno ol ol ol>li{font-size:1.05em;font-weight:400;color:grey}.meno ol ol ol ol>li{font-size:1em;font-weight:400;color:#000}.meno [meno-hr]{height:2px;margin:1em 0}.meno [meno-col] p{margin-top:0}.meno [meno-underline]{text-decoration:underline}.meno [meno-tip]{position:relative;display:inline;border-bottom:1px dotted pink}.meno [meno-tip]::after{content:attr(meno-tip);font-size:13px;min-width:100px;min-heigh:100px;background-color:rgba(50,50,50,.8);color:#fff;border-bottom:2px solid orange;border-radius:10px 0;padding:3px 8px;position:absolute;bottom:100%;left:50%;opacity:0;visibility:hidden;transition:opacity .3s}.meno [meno-tip]:hover::after{opacity:1;visibility:visible}.meno [meno-tip]:hover{border:1px solid orange;margin:-1px;background-color:rgba(250,250,100,.1);cursor:help}.meno ::selection{background-color:orange;color:#fff}",

	m.addCSS= function () {
		var styl = document.createElement("style");
		styl.innerHTML = m.css;
		var styls = document.getElementsByTagName("style");
		var links = document.getElementsByTagName("link");
		if (styls.length > 0) {
			document.head.insertBefore(styl, styls[0]);
		} else if (links.length > 0) {
			document.head.insertBefore(styl, links[0]);
		} else {
			document.head.appendChild(styl);
		}
	};
	
	m.convert= function () {
		var menos = document.querySelectorAll("script[type='text/meno']");
		for (var i = 0; i < menos.length; i++) {
			var raw = menos[i].innerHTML;
			var art = document.createElement("article");
			
			for(var a=0;a<menos[i].attributes.length;a++){
				var attr = menos[i].attributes[a];
				if(attr.name != 'type')
					art.setAttribute(attr.name,attr.value);
			}
			art.className += ' meno';
			menos[i].parentNode.insertBefore(art, menos[i]);
			art.innerHTML = m.parsed(raw);
			menos[i].parentNode.removeChild(menos[i]);
		}
	}
	return m;
})();