<<<<<<< HEAD
var meno = {};

meno.loadFile = function(callback,file) {
	const req = new XMLHttpRequest();
	req.onreadystatechange = function(event) {
		if (this.readyState === XMLHttpRequest.DONE) {
			if (this.status === 200) { callback(this.responseText); }
		}
	};

	req.open('GET', file, true);
	req.send(null);
}

meno.readFile = function(file) {
	meno.loadFile(function(response) {
		return response;
	 },file);
}

meno.putRaw = function(target,k,file) {
	meno.loadFile(function(response) {
		target[k] = response;
	 },file);
}

meno.writeTo = function(target,file) {
	meno.loadFile(function(response) {
		var raw = response;
		var lines = raw.split(/\r\n|\r|\n/);
		meno.setWin(target,meno.parse(lines));
	 },file);
}

meno.displayTo = function(target,text) {
	var lines = text.split(/\r\n|\r|\n/);
	meno.setWin(target,meno.parse(lines));
}

meno.setWin = function(target,inner) {
	target.innerHTML = inner;
}

meno.parseRaw = function(lines) {
	var tree = {};
	var input = "";
	var id = 0;
	var isBlock = false;
	var list = 0;
	var olistCount = 0;
	var container = "";
	var blockid = 0;
	while(lines[id] !== undefined){
		input = lines[id];
		input = meno.skipSpace(input);
		var match, expr;
		if(isBlock == true){
			if (match = /^(.*)(\]?)/.exec(input)){
				var end = match[1].endsWith(" ]")
				var bltxt = match[1].replace(/\]$/m,"");
				tree[blockid].value += "\n \200 \n" + bltxt;
				if (end){ blockid++; isBlock = false; }
			}
		} else {
			if (match = /^(:{1,6})(\[)? (.+)/.exec(input)){
				expr = {type: "header", priority: match[1].length, value: match[3]};
				if (match[2]){ isBlock = true;}
			} else if (match = /^(-{3,})$/.exec(input)){
				expr = {type: "line"};
			} else if (match = /^(-{3,})([^ -]+)/.exec(input)){
				expr = {type: "colorline", value: match[2]};
			} else if (match = /^_(.*)=(.*)/.exec(input)){
				expr = {type: "variable", name: match[1], value: match[2]};
			} else if (match = /^<-(.*)<-/.exec(input)){
				expr = {type: "marquee", value: match[1],direction:"left"};
			} else if (match = /^->(.*)->/.exec(input)){
				expr = {type: "marquee", value: match[1],direction:"right"};
			} else if (match = /^<>(.*)<>/.exec(input)){
				expr = {type: "navigation", value: match[1]};
			} else if (match = /^_([^_]+)_(.*)/.exec(input)){
				expr = {type: "container", tag: match[1]};
				container = match[1];
				if(match[2]) { expr.classname = match[2]; }
			} else if (input == "___" && container){
				expr = {type: "closecontainer", tag: container};
				container = "";
			} else if (match = /^>([^>]+)>([^ ]+)/.exec(input)){
				expr = {type: "link", url: match[2]};
				if(match[1] != " "){ expr.value = match[1]; } 
				else { expr.value = match[2]; }
			} else if (match = /^\[([^\[]*)\[(.+)/g.exec(input)){
				expr = {type: "image", alt: match[1], url: match[2]};
			} else if (match = /^(-*) (.+)/.exec(input)){
				expr = {type: "list-item", list: "u" , value: match[2], indent: match[1].length};
			} else if (match = /^(\]*) (.+)/.exec(input)){
				expr = {type: "list-item", list: "o" , value: match[2], indent: match[1].length};
			} else if (match = /^<(\[)? (.+)/.exec(input)){
				expr = {type: "quote", value: match[2]};
				if (match[1]){ isBlock = true;}
			} else if (match = /^-_-(\[)? (.+)/.exec(input)){
				expr = {type: "comment", value: match[2]};
				if (match[1]){ isBlock = true;}
			} else if (match = /^;(\[)? (.+)/m.exec(input)){
				expr = {type: "code", value: match[2]};
				if (match[1]){ isBlock = true;}
			} else if (input == "-"){
				expr = {type: "return"};
			} else if (input == ":"){
				expr = {type: "blank"};
			} else if (match = /^(.+)/.exec(input)){
				expr = {type: "text", value: match[1]};
			} else {
				expr = {type: "break"};
			}
			if (expr.type != "blank"){
				if(tree[blockid-1] && expr.type == "text" && tree[blockid-1].type == expr.type){
					tree[blockid-1].value += "\n \200 \n" + expr.value;
				} else {
					tree[blockid] = expr;
					if(isBlock == false){blockid++;}
				}
			}
		}
		id++;
	}
	return tree;
}

// REDO SkipSpace to allow space after 1
meno.skipSpace = function(string) {
	var first = string.search(/\S/);
	if (first == -1) return "";
	return string.slice(first);
}

meno.parseText = function(raw) {
	var parsed = raw;
	//parsed = parsed.replace(/^(_)/gm,"");
	parsed = parsed.replace(/(^<| <)([^< \[]+)( |$)/gm,meno.replace.quote);
	parsed = parsed.replace(/(^<| <)\[(.+)\]( |$)/gm,meno.replace.quote);
	parsed = parsed.replace(/(^<<| <<)([^ \[]+)( |$)/gm,meno.replace.bold);
	parsed = parsed.replace(/(^<<| <<)\[(.+)\]( |$)/gm,meno.replace.bold);
	parsed = parsed.replace(/(^>>| >>)([^ \[]+)( |$)/gm,meno.replace.small);
	parsed = parsed.replace(/(^>>| >>)\[(.+)\]( |$)/gm,meno.replace.small);
	parsed = parsed.replace(/(^_| _)([^ \[_]+)( |$)/gm,meno.replace.underline);
	parsed = parsed.replace(/(^_| _)\[([^\]_]+)\]( |$)/gm,meno.replace.underline);
	parsed = parsed.replace(/(^;| ;)\[(.+)\]( |$)/gm,meno.replace.code);
	parsed = parsed.replace(/(^;| ;)([^ \[]+)( |$)/gm,meno.replace.code);
	parsed = parsed.replace(/(^;| ;)(\[)( |$)/gm,meno.replace.code);
	parsed = parsed.replace(/(^>| >)([^>]+)>([^ ]+)( |$)/g,meno.replace.link);
	parsed = parsed.replace(/(^\[| \[)([^\]:]+):(.*)?\](.| |$)/g,meno.replace.hint);
	parsed = parsed.replace(/(\200)/g,"<br \>");
	return parsed;
}

meno.parseLink = function(raw) {
	var parsed = raw;
	parsed = parsed.replace(/\]([^\]]+)\](([^ ]+){1})/g,meno.replace.image);
	return parsed;
}

meno.replace = {
	code: function(match,tag,cont,rest){
		return " <code style='display:inline-block;'>" + cont + "</code> " + rest;
	},
	quote: function(match,tag,cont,rest){
		return " <em>" + cont + "</em> " + rest;
	},
	underline: function(match,tag,cont,rest){
		return " <span style='text-decoration:underline;'>" + cont + "</span>" + rest;
	},
	bold: function(match,tag,cont,rest){
		return " <strong>" + cont + "</strong>" + rest;
	},
	small: function(match,tag,cont,rest){
		return " <small>" + cont + "</small> " + rest;
	},
	link: function(match,tag,txt,url){
		var link = txt == " " ? url : txt
		return " <a href='" + url + "'>" + link + "</a> ";
	},
	image: function(match,alt,url){
		return "<img alt='" + alt + "' src='" + url + "' />\n";
	},
	hint: function(match,tag,text,hint,rest){
		return "<span class='tt'> "+meno.parseText(text)+"<span class='ttt'>"+hint+"</span></span>"+rest;
	},
	
}

meno.produceHTML = function(tree) {
	//console.log(tree[0].lenght);
	var i = 0;
	var t = {};
	var ulist = 0;
	var listArr = [];
	var elems = "";
	for(i in tree){
		t = tree[i];
		switch(t.type){
			case "list-item":
				if (t.indent < ulist) {
					var l = 0;
					for (l=0;l<(ulist-t.indent);l++){ elems += listArr.pop(); }
				}
				if (t.indent > ulist) {
					var l = 0;
					for (l=0;l<(t.indent-ulist);l++){ elems += "<" + t.list + "l>\n"; }
					listArr.push("</" + t.list + "l>\n");
				}
				var ptext = meno.parseText(t.value);
				elems += "<li>" + ptext + "</li>\n";
				ulist = t.indent;
				break;
			default:
				if (ulist > 0) {
					var l = 0;
					for (l=0;l<(ulist);l++){ elems += listArr.pop(); }
				}
				ulist = 0;
		}
		switch(t.type){
			case 'text':
				var ptext = meno.parseText(t.value);
				elems += "<p>" + ptext + "</p>\n";
				break;
			case 'header':
				elems += "<h" + t.priority + ">" + t.value + "</h" + t.priority + ">\n";
				break;
			case 'quote':
				var ptext = meno.parseText(t.value);
				elems += "<blockquote>" + ptext + "</blockquote>\n";
				break;
			case 'marquee':
				var ptext = meno.parseText(t.value);
				elems += "<marquee>" + ptext + "</marquee>\n";
				break;
			case 'navigation':
				var ptext = meno.parseText(t.value);
				elems +=  "<nav>" + ptext + "</nav>\n";
				break;
			case 'comment':
				elems += "<!--" + t.value + "-->\n";
				break;
			case 'code':
				elems += "<code>" + t.value + "</code>\n";
				break;
			case 'image':
				elems += "<img alt='" + t.alt + "' src='" + t.url + "' />\n";
				break;
			case 'link':
				elems += "<a href='" + t.url + "' target='_blank'>" + meno.parseLink(t.value) + "</a>\n";
				break;
			case 'container':
				elems += "\n<" + t.tag;
				if (t.classname){ elems += " class='" + t.classname + "'"; }
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
			default:
				elems = elems;
		}
	}
	return elems;
}

meno.parse = function(lines) {
	var val;
	val = meno.parseRaw(lines);
	var inner = meno.produceHTML(val);
	return inner;
=======
var meno = {};

meno.loadFile = function(callback,file) {
	var xobj = new XMLHttpRequest();
	
	xobj.open('GET', file, false);
	xobj.onreadystatechange = function () {
		if(xobj.responseText){ callback(xobj.responseText);}
	};
	
	xobj.send(null);
}

meno.readFile = function(file) {
	meno.loadFile(function(response) {
		return response;
	 },file);
}

meno.putRaw = function(target,k,file) {
	meno.loadFile(function(response) {
		target[k] = response;
	 },file);
}

meno.writeTo = function(target,file) {
	meno.loadFile(function(response) {
		var raw = response;
		var lines = raw.split(/\r\n|\r|\n/);
		meno.setWin(target,meno.parse(lines));
	 },file);
}

meno.displayTo = function(target,text) {
	var lines = text.split(/\r\n|\r|\n/);
	meno.setWin(target,meno.parse(lines));
}

meno.setWin = function(target,inner) {
	target.innerHTML = inner;
}

meno.parseRaw = function(lines) {
	var tree = {};
	var input = "";
	var id = 0;
	var isBlock = false;
	var list = 0;
	var olistCount = 0;
	var container = "";
	var blockid = 0;
	while(lines[id] !== undefined){
		input = lines[id];
		input = meno.skipSpace(input);
		var match, expr;
		if(isBlock == true){
			if (match = /^(.*)(\]?)/.exec(input)){
				var end = match[1].endsWith(" ]")
				var bltxt = match[1].replace(/\]$/m,"");
				tree[blockid].value += "\n \200 \n" + bltxt;
				if (end){
					blockid++;
					isBlock = false;
				}
			}
		} else {
			if (match = /^(:{1,6})(\[)? (.+)/.exec(input)){
				expr = {type: "header", priority: match[1].length, value: match[3]};
				if (match[2]){ isBlock = true;}
			} else if (match = /^(-{3,})$/.exec(input)){
				expr = {type: "line"};
			} else if (match = /^(-{3,})([^ -]+)/.exec(input)){
				expr = {type: "colorline", value: match[2]};
			} else if (match = /^_(.*)=(.*)/.exec(input)){
				expr = {type: "variable", name: match[1], value: match[2]};
			} else if (match = /^<>(.*)<>/.exec(input)){
				expr = {type: "marquee", value: match[1]};
			} else if (match = /^_([^_]+)_(.*)/.exec(input)){
				expr = {type: "container", tag: match[1]};
				container = match[1];
				if(match[2]) { expr.classname = match[2]; }
			} else if (input == "___" && container){
				expr = {type: "closecontainer", tag: container};
				container = "";
			} else if (match = /^>([^>]+)>([^ ]+)/.exec(input)){
				expr = {type: "link", url: match[2]};
				if(match[1] != " "){ expr.value = match[1]; } 
				else { expr.value = match[2]; }
			} else if (match = /^\[([^\[]*)\[(.+)/g.exec(input)){
				expr = {type: "image", alt: match[1], url: match[2]};
			} else if (match = /^(-*) (.+)/.exec(input)){
				expr = {type: "list-item", list: "u" , value: match[2], indent: match[1].length};
			} else if (match = /^(\]*) (.+)/.exec(input)){
				expr = {type: "list-item", list: "o" , value: match[2], indent: match[1].length};
			} else if (match = /^<(\[)? (.+)/.exec(input)){
				expr = {type: "quote", value: match[2]};
				if (match[1]){ isBlock = true;}
			} else if (match = /^-_-(\[)? (.+)/.exec(input)){
				expr = {type: "comment", value: match[2]};
				if (match[1]){ isBlock = true;}
			} else if (match = /^;(\[)? (.+)/m.exec(input)){
				expr = {type: "code", value: match[2]};
				if (match[1]){ isBlock = true;}
			} else if (input == "-"){
				expr = {type: "return"};
			} else if (input == ":"){
				expr = {type: "blank"};
			} else if (match = /^(.+)/.exec(input)){
				expr = {type: "text", value: match[1]};
			} else {
				expr = {type: "break"};
			}
			if (expr.type != "blank"){
				if(tree[blockid-1] && expr.type == "text" && tree[blockid-1].type == expr.type){
					tree[blockid-1].value += "\n \200 \n" + expr.value;
				} else {
					tree[blockid] = expr;
					if(isBlock == false)
						blockid++;
				}
			}
		}
		id++;
	}
	return tree;
}

// REDO SkipSpace to allow space after 1
meno.skipSpace = function(string) {
	var first = string.search(/\S/);
	if (first == -1) return "";
		return string.slice(first);
}

meno.parseText = function(raw) {
	var parsed = raw;
	//parsed = parsed.replace(/^(_)/gm,"");
	parsed = parsed.replace(/(^<| <)([^< \[]+)( |$)/gm,meno.replace.quote);
	parsed = parsed.replace(/(^<| <)\[(.+)\]( |$)/gm,meno.replace.quote);
	parsed = parsed.replace(/(^<<| <<)([^ \[]+)( |$)/gm,meno.replace.bold);
	parsed = parsed.replace(/(^<<| <<)\[(.+)\]( |$)/gm,meno.replace.bold);
	parsed = parsed.replace(/(^>>| >>)([^ \[]+)( |$)/gm,meno.replace.small);
	parsed = parsed.replace(/(^>>| >>)\[(.+)\]( |$)/gm,meno.replace.small);
	parsed = parsed.replace(/(^_| _)([^ \[_]+)( |$)/gm,meno.replace.underline);
	parsed = parsed.replace(/(^_| _)\[([^\]_]+)\]( |$)/gm,meno.replace.underline);
	parsed = parsed.replace(/(^;| ;)\[(.+)\]( |$)/gm,meno.replace.code);
	parsed = parsed.replace(/(^;| ;)([^ \[]+)( |$)/gm,meno.replace.code);
	parsed = parsed.replace(/(^;| ;)(\[)( |$)/gm,meno.replace.code);
	parsed = parsed.replace(/ >([^>]+)>([^ ]+)( |$)/g,meno.replace.link);
	parsed = parsed.replace(/(\200)/g,"<br \>");
	return parsed;
}

meno.parseLink = function(raw) {
	var parsed = raw;
	parsed = parsed.replace(/\]([^\]]+)\](([^ ]+){1})/g,meno.replace.image);
	return parsed;
}

meno.replace = {
	code: function(match,tag,cont,rest){
		return " <code style='display:inline-block;'>" + cont + "</code> " + rest;
	},
	quote: function(match,tag,cont,rest){
		return " <em>" + cont + "</em> " + rest;
	},
	underline: function(match,tag,cont,rest){
		return " <span style='text-decoration:underline;'>" + cont + "</span>" + rest;
	},
	bold: function(match,tag,cont,rest){
		return " <strong>" + cont + "</strong>" + rest;
	},
	small: function(match,tag,cont,rest){
		return " <small>" + cont + "</small> " + rest;
	},
	link: function(match,txt,url){
		var link = txt == " " ? url : txt
		return " <a href='" + url + "'>" + link + "</a> ";
	},
	image: function(match,alt,url){
		return "<img alt='" + alt + "' src='" + url + "' />\n";
	},
	
}

meno.produceHTML = function(tree) {
	//console.log(tree[0].lenght);
	var i = 0;
	var t = {};
	var ulist = 0;
	var listArr = [];
	var elems = "";
	for(i in tree){
		t = tree[i];
		switch(t.type){
			case "list-item":
				if (t.indent < ulist) {
					var l = 0;
					for (l=0;l<(ulist-t.indent);l++){ elems += listArr.pop(); }
				}
				if (t.indent > ulist) {
					var l = 0;
					for (l=0;l<(t.indent-ulist);l++){ elems += "<" + t.list + "l>\n"; }
					listArr.push("</" + t.list + "l>\n");
				}
				var ptext = meno.parseText(t.value);
				elems += "<li>" + ptext + "</li>\n";
				ulist = t.indent;
				break;
			default:
				if (ulist > 0) {
					var l = 0;
					for (l=0;l<(ulist);l++){ elems += listArr.pop(); }
				}
				ulist = 0;
		}
		switch(t.type){
			case 'text':
				var ptext = meno.parseText(t.value);
				elems += "<p>" + ptext + "</p>\n";
				break;
			case 'header':
				elems += "<h" + t.priority + ">" + t.value + "</h" + t.priority + ">\n";
				break;
			case 'quote':
				var ptext = meno.parseText(t.value);
				elems += "<blockquote>" + ptext + "</blockquote>\n";
				break;
			case 'marquee':
				var ptext = meno.parseText(t.value);
				elems += "<marquee>" + ptext + "</marquee>\n";
				break;
			case 'comment':
				elems += "<!--" + t.value + "-->\n";
				break;
			case 'code':
				elems += "<code>" + t.value + "</code>\n";
				break;
			case 'image':
				elems += "<img alt='" + t.alt + "' src='" + t.url + "' />\n";
				break;
			case 'link':
				elems += "<a href='" + t.url + "' target='_blank'>" + meno.parseLink(t.value) + "</a>\n";
				break;
			case 'container':
				elems += "\n<" + t.tag;
				if (t.classname){ elems += " class='" + t.classname + "'"; }
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
			default:
				elems = elems;
		}
	}
	//console.log(elems);
	return elems;
}

meno.parse = function(lines) {
	var val;
	val = meno.parseRaw(lines);
	var inner = meno.produceHTML(val);
	return inner;
>>>>>>> 324ed1311e113b7cf13ae7bd575a0894af1e83a8
}