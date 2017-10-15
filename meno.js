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
	var container = "";
	var blockid = 0;
	while(lines[id] !== undefined){
		//console.log(lines[id]);
		input = lines[id];
		input = meno.skipSpace(input);
		//console.log(id,input,blockid,isBlock);
		var match, expr;
		if(isBlock == true){ // /^([^\]]*)(\])?(.*)?/
			if (match = /^(.*)(\]?)/.exec(input)){
				var end = match[1].endsWith(" ]")
				var bltxt = match[1].replace(/\]$/m,"");
				//bltxt += match[3] ? match[3] : "";
				tree[blockid].value += "\n<br />\n" + bltxt;
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
			} else if (match = /^(-{3,})(.+)/.exec(input)){
				expr = {type: "colorline", value: match[2]};
			} else if (match = /^_(.*)=(.*)/.exec(input)){
				expr = {type: "variable", name: match[1], value: match[2]};
			} else if (match = /^_([^_]+)_(.*)/.exec(input)){
				expr = {type: "container", tag: match[1]};
				container = match[1];
				if(match[2]) { expr.classname = match[2]; }
			} else if (input == "___" && container){
				expr = {type: "closecontainer", tag: container};
				container = "";
			} else if (match = /^>(.*)>(.+)/.exec(input)){
				expr = {type: "link", url: match[2]};
				if(match[1]){ expr.value = match[1]; } 
				else { expr.value = match[2]; }
			} else if (match = /^\[[^\[](.*)\[(.+)/g.exec(input)){
				expr = {type: "image", alt: match[1], url: match[2]};
			} else if (match = /^<(\[)? (.+)/.exec(input)){
				//console.log(match[2]);
				expr = {type: "quote", value: match[2]};
				if (match[1]){ isBlock = true;}
			} else if (match = /^-_-(\[)? (.+)/.exec(input)){
				//console.log(match[2]);
				expr = {type: "comment", value: match[2]};
				if (match[1]){ isBlock = true;}
			} else if (match = /^;(\[)?(.+)/m.exec(input)){
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
					tree[blockid-1].value += "\n<br />\n" + expr.value;
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
	parsed = parsed.replace(/ <([^ \[<]+)([ |\.])/g,meno.replace.quote);
	parsed = parsed.replace(/ <\[(.+)\]([ |\.])/g,meno.replace.quote);
	parsed = parsed.replace(/ <<([^ \[]+)([ |\.])/g,meno.replace.bold);
	parsed = parsed.replace(/ <<\[(.+)\]([ |\.])/g,meno.replace.bold);
	parsed = parsed.replace(/ >>([^ \[]+)([ |\.])/g,meno.replace.small);
	parsed = parsed.replace(/ >>\[(.+)\]([ |\.])/g,meno.replace.small);
	parsed = parsed.replace(/ _([^\s\[]+)([ |\.])/g,meno.replace.underline);
	parsed = parsed.replace(/ _\[(.+)\]([ |\.])/g,meno.replace.underline);
	parsed = parsed.replace(/ ;\[(.+)\]([ |\.])/g,meno.replace.code);
	parsed = parsed.replace(/ ;([^ \[]+)([ |\.])/g,meno.replace.code);
	parsed = parsed.replace(/ ;(\[) /g,meno.replace.code);
	parsed = parsed.replace(/ >([^>]+)>(([^ ]+){1}) /g,meno.replace.link);
	return parsed;
}

meno.replace = {
	code: function(match,cont,rest){
		return " <code style='display:inline-block;'>" + cont + "</code> " + rest;
	},
	quote: function(match,cont,rest){
		return " <em>" + cont + "</em> " + rest;
	},
	underline: function(match,cont,rest){
		return " <span style='text-decoration:underline;'>" + cont + "</span>" + rest;
	},
	bold: function(match,cont,rest){
		return " <strong>" + cont + "</strong> " + rest;
	},
	small: function(match,cont,rest){
		return " <small>" + cont + "</small> " + rest;
	},
	link: function(match,txt,url){
		return " <a href=''>" + txt + "</a> ";
	}
	
}

meno.produceHTML = function(tree) {
	//console.log(tree[0].lenght);
	var i = 0;
	var t = {};
	var elems = "";
	for(i in tree){
		t = tree[i];
		switch(t.type){
			case 'text':
				var ptext = meno.parseText(t.value);
				elems += "<p>" + ptext + "</p>\n";
				break;
			case 'header':
				elems += "<h" + t.priority + ">" + t.value + "</h" + t.priority + ">\n";
				break;
			case 'quote':
				elems += "<blockquote>" + t.value + "</blockquote>\n";
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
				elems += "<a href='" + t.url + "' target='_blank'>" + t.value + "</a>\n";
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
				elems += "\n<br />\n";
				break;
			case 'line':
				elems += "\n<hr />\n";
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
}