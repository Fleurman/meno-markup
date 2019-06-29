var meno = (function () {
	'use strict'

	var m = {};
	m.css= '.meno{font-family:Calibri}.meno code{display:block;background-color:#f5f5f5;color:dimgrey;font-family:consolas}.meno samp{color:grey;font-variant:petite-caps}.meno [h]{margin:4px auto}.meno a{color:#6495ed;text-decoration:none}.meno a:hover{border-bottom:1px solid #d3d3d3}.meno a:visited{color:#da70d6}.meno blockquote{font-style:italic;margin-left:1em}.meno blockquote::before{content:open-quote}.meno blockquote::after{content:close-quote}.meno [list] [lif]{margin-left:12px;color:dimgrey;display:block}.meno [list]{padding:5px;border-right:6px solid #f5f5f5;list-style-position:inside}.meno [list] [list]{border:none;padding:2px;margin-left:14px}.meno [list]>li{font-size:1.2em;font-weight:700}.meno ul[list]>li{list-style-type:none}.meno ul[list]>li:before{content:"| ";opacity:.5}.meno [list] [list]>li{font-size:1.1em;color:dimgrey}.meno [list] [list] [list]>li{font-size:1.05em;font-weight:400;color:grey}.meno [list] [list] [list] [list]>li{font-size:1em}.meno [acc]{cursor:pointer;border-bottom:1px solid #f5f5f5;position:relative;padding-right:30px}.meno [acc] + [lic]{opacity:1;max-height:100%;transition:.5s}.meno [acc=close] + [lic]{opacity:0;max-height:0;overflow:hidden}.meno [acc]::after{content:" ";position:absolute;top:0;right:10px;border-left:4px solid grey;border-bottom:4px solid grey;padding:4px;transition:.3s}.meno [acc=close]::after{transform:rotateZ(-45deg)}.meno [acc=open]::after{top:10px;transform:rotateZ(-225deg)}.meno [hr]{height:2px;margin:1em 0;overflow:hidden}.meno [col]{margin:1em 0}.meno [col] p{margin-top:0}.meno [flex]>*{flex:1 1 auto}.meno [flex]>p>img{margin:auto}.meno [inblock]{display:inline-block}.meno [tip]{position:relative;display:inline;border-bottom:1px dotted #ffc0cb}.meno [tip]::after{content:attr(tip);position:absolute;bottom:100%;left:50%;opacity:0;visibility:hidden;transition:opacity .3s;font-size:13px;min-width:120px;width:100%;background-color:#eee;border-bottom:2px solid grey;border-radius:3px;border-bottom-left-radius:0;padding:3px 8px}.meno [tip]:hover::after{opacity:1;visibility:visible}.meno [tip]:hover{border:1px solid orange;margin:-1px;background-color:rgba(250,250,100,0.1);cursor:help}.meno [tab]{display:inline-block;padding:6px;margin-top:4px;border-radius:5px 5px 0 0;border:1px solid #f5f5f5;border-bottom:none;cursor:pointer;white-space:nowrap}.meno [tab=selected]{background-color:#f5f5f5;font-weight:700}.meno [thc]{display:none}.meno [tabc]{border:2px solid #f5f5f5;padding:10px}.meno [tab=""]:hover{background-color:#f5f5f5}.meno ::selection{background-color:orange;color:#fff}';
	let SYNTAX = false;

	function parseRaw(raw) {
		var lines = raw.split(/\r\n|\r|\n/);
		var tree = {};
		var data = {
			id: 0,
			isRaw: false,
			pBreak: false,
			list: 0,
			container: [],
			blockid: 0,
			tab:false
		}
		while (lines[data.id] !== undefined) {
			var input = lines[data.id],match,expr;
			if (data.isRaw == true) {
				if (input.trim() == ';;;') {
					data.blockid++;
					data.isRaw = false;
				} else {
					tree[data.blockid].value += input+'\n';
				}
			} else {
				if (match = /^\s*(:{1,6})\s(.+)/.exec(input)) {
					expr = {
						type: 'header',
						priority: match[1].length,
						value: match[2]
					};
				} else if (match = /^\s*-_-\s(.+)/.exec(input)) {
					expr = {
						type: 'comment',
						value: match[1]
					};
				} else if (match = /^\s*;;([^\s]*);;\s*$/.exec(input)) {
					expr = {
						type: 'syntax',
						value: match[1].trim()
					};
				} else if (match = /^\s*-{3,}([^\s]+)?\s*$/.exec(input)) {
					expr = {
						type: 'hr'
					};
					if(match[1]!=undefined){
						expr.type = 'colorline';
						expr.value = match[1].split('-');
					}
				} else if (match = /^\s*<(-|:)>([\w-]*)\s*$/.exec(input)) {
					expr = {
						type: 'flex',
						direction: match[1] == ':' ? 'column' : 'row',
						align: is(match[2]) ? match[2] : 'center',
					};
					data.container.push('div');
				} else if (match = /^\s*<(-{2,}|:{2,}|;{2,})>/.exec(input)) {
					expr = {
							type: 'columns',
							rule: rule(match[1][0]),
							count: match[1].length,
						   };
					data.container.push('div');
				} else if (match = /^\s*<(:?)("|')([^>]+?)\2>(.*)$/.exec(input)) {
					let c = match[4].trim().split(';');
					expr = {
						type: 'tab',
						selected: match[1] != '',
						title: match[3],
						bg: is(c[0]) && c[0],
						color: is(c[1]) && c[1]
					};
					data.container.push('tab');
				} else if (match = /^\s*<([a-z1-6]+?)>(.*)$/.exec(input)) {
					expr = {
						type: 'container',
						tag: match[1],
						inline: match[2] || ""
					};
					data.container.push(match[1]);
				} else if (input.trim() == '<>' && data.container.length > 0) {
					let tag = data.container.pop();
					expr = {
						type: 'close'+(tag == 'tab' ? 'tab' : 'container'),
						tag: tag
					};
				} else if (match = /^\s*<([\w]+?):([^>]+)>/.exec(input)) {
					let media = getMedia(match[1]);
					expr = {
						type: 'media',
						media: media[0],
						mime: media[0]+media[1],
						src: match[2]
					};
				} else if (match = /^\s*;;;\s*$/.exec(input)) {
					expr = {
						type: 'raw',
						value: "",
					};
					data.isRaw = true;
				} else if (match = /^\s*(<?|>?)(-+|\^+|\d+)\s(.+)/.exec(input)) {
					var h = { '-':'u','^':'f'};
					let l = (h[match[2][0]] || 'o');
					let s = match[2].length;
					expr = {
						type: 'list-item',
						accordion:is(match[1]) ? match[1] : false,
						list: l,
						value: match[3],
						indent: (l=='o' && s>1) ? match[2].match(/^0*/)[0].length+1 : s,
						start:l=='o' ? parseInt(match[2]) : false
					};
				} else if ((match = {'-':'br', ':':'blank'}[input.trim()]) !=undefined) {
					expr = {
						type: match
					};
				} else if (match = /^(.+)/.exec(input.trim())) {
					expr = {
						type: 'paragraph',
						value: match[1]
					};
				} else {
					data.pBreak = true;
					expr = {type:'_'};
				}
				if (expr.type && expr.type != 'blank') {
					if (!data.pBreak && tree[data.blockid - 1] && expr.type == 'paragraph' && tree[data.blockid - 1].type == 'paragraph') {
						tree[data.blockid - 1].value += ' \x01\n' + expr.value;
					} else {
						tree[data.blockid] = expr;
						if(data.isRaw==false){
							data.blockid++;
							data.pBreak = false;
						}
					}
				}
			}
			data.id++;
		}
		return tree;
	};
	
	function is(str){return (str && str.trim()!='')?true:false;}
	var rule = (function(){
		var h = {':':'4px dotted lightgrey',';':'1px solid lightgrey'}
		return function(c){
			return h[c] && h[c];
		}
	})();
	
	var bases = {img:'',link:""};
	m.base = {};
	Object.defineProperties(m.base,{
		img:{
			get(){
				return bases.img;
			},
			set(v){
				bases.img = v.toString();
			}
		},
		link:{
			get(){
				return bases.link;
			},
			set(v){
				bases.link = v.toString();
			}
		}
	});
	
	var syntax = {};
	m.addSyntax = function(name,obj){
		let style = document.createElement('style');
		let text = '';
		obj.forEach(o=>{
			if(is(o[2])){
				text+='.'+name+'-'+o[1]
				+ (o[3] ? ',.'+name+'-'+o[1]+' '+o[3] : '')
				+'{'+o[2]+'}\n';
			}
		})
		style.innerHTML = text;
		document.head.appendChild(style);
		syntax[name] = obj;
	}

	var blocTags =
		[
			'<',	'blockquote',
			';',	'code',
		];
	function isBloc(r){
		let match = {};
		for(let i = 0; i<blocTags.length ; i += 2){
			if(blocTags[i] == r){
				if(blocTags[i+1] instanceof Array){
					match.tag = blocTags[i+1][0];
					match.inline = blocTags[i+1][1];
				}else{
					match.tag = blocTags[i+1];
				}
				return match;
			}
		}
		return false;
	}
	m.addBlocTag = function(t,e,i){
		if(t && e){
			addTag(blocTags,t,e,i)
		}
	}
	function addTag(a,t,e,i){
		t = t.replace(/</g,'&lt;');
		t = t.replace(/\\/g,'\\');
		a.push(t);
		if(i){
			a.push([e,i])
		}else{
			a.push(e);
		}
	}
	var MIMES = {audio:['mp3','ogg','wav'],video:['mp4','avi','mov'],mp3:'mpeg'};
	function getMedia(m){
		let media = '';
		if(MIMES.audio.includes(m)){
			media = 'audio';
		}else if(MIMES.video.includes(m)){
			media = 'video';
		}
		return [media,'/'+(MIMES[m] || m)]
	}
	function doParseInline(raw,tag,el){
		tag = esc(tag);
		while(Reg.w(tag).exec(raw)){
			raw = raw.replace(Reg.w(tag), Rep.word.bind(Rep,el));
		}
		return raw;
	}
	
	var inlineTags =
		[
			'__',		'sub', 
			'\\^\\^',	'sup',
			'\\^',		'i',
			'<<',		'b',
			'<',		'q',
			'>>',		'small',
			'>',		'mark',
			'_',		'u',
			'--',		'del', 
			';;',		'samp', 
			';',		['code','inblock']
		];
	m.addInlineTag = function(t,e,i){
		if(t && e){
			addTag(inlineTags,t,e,i)
		}
	}

	function applySyntax(raw){
		var text = '';
		raw.split(/\r\n|\r|\n/).forEach(line=>{
			if(syntax[SYNTAX]){
				syntax[SYNTAX].forEach(obj=>{
					if(obj){
						let r = esc(obj[0]);
						let reg = new RegExp(r,'g');
						line = line.replace(reg,(match,part)=>{
							let outline = match.split(part);
							let rslt = outline[0] + Rep.token(obj[1],part) + outline[1];
							return rslt;
						});
					}
				});
				text += line+'\r\n';
			}
		});
		return text;
	}
	
	function esc(str){
		return str.replace(/</g,'\x02').replace(/>/g,'\x03').replace(/=/g,'\x04').replace(/"/g,'\x05').replace(/:/g,'\x06');
	}
	function entity(str){
		return str.replace(/\x02/g,'&lt;').replace(/\x03/g,'&gt;').replace(/\x04/g,'=').replace(/\x05/g,'&quot;').replace(/\x06/g,':').replace(/'/g,'&apos;');
	}

	function relative(url){
		return !url.startsWith('http');
	}

	function parseText(parsed) {
		let raw = [];

		parsed = parsed.replace(/;;;(.+?);;;/g, (...match)=>{
			raw.push(match[1]);
			return '\x00'+(raw.length-1)+'\x00';
		});
		parsed = esc(parsed);

		parsed = parsed.replace(/\[([^\]\x06]+?)\x06([^\]]+?)\]\s/gm, function (...match) {
			raw.push((entity(match[2]));
			return ' <span tip="\x00'+(raw.length-1)+'\x00">'+parseText(match[1]).trim()+'</span> ';
		});

		if(SYNTAX){
			parsed = applySyntax(parsed);
		}

		parsed = parsed.replace(Reg.l, Rep.link);
		parsed = parsed.replace(Reg.i, Rep.img);

		
		for (let i = 0 ; i<inlineTags.length ; i+=2){
			parsed = doParseInline(parsed,inlineTags[i],inlineTags[i+1]);
		}
		
		parsed = entity(parsed);

		parsed = parsed.replace(/(\x01)/g, ' <br> ');
		
		parsed = parsed.replace(/\x00(.+?)\x00/g, (...m)=>{
			return raw[m[1]];
		});

		return parsed;
	};

	var Reg = {
		w: function(tag){return new RegExp('(?:^|\\s)'+tag+'([^\\s\\n]+)(?:\\s|$)','m');},
		l: /(?:\s|^)\x03([^\x02\x03\n\r]+?)(\x02|\x03)([^\s\n\r;]+)(?:;([^\s]+))?(?:|\s|$|\x01)/g,
		i: /\[([^\]]+)\](?:([\w\s\d%]+?)\x06)?([^\s]+)/g
	};

	var Rep = {
		getHTML: function(el,cont,i){ return ' <'+el+(i?' '+i:'')+'>'+cont+'</'+el+'> ' },
		
		img: function (_, alt, size, url){
			size = size ? size.trim().split(' ') : false;
			return ' <img alt="'+alt+'" src="'+(relative(url)?bases.img:'')+url+'" '
					+ (size?'style="width:'+size[0]+(size[1]?';height:'+size[1]+'':'')+';"':'')
					+' title="'+alt+'" > ';
		},
		
		token: function (cl, cont) {
			return '<span class="'+SYNTAX+'-'+cl+'" >' + cont + '</span>'; 
		},

		link: function (_, txt, mod, url, down,__) {
			return ' <a href="'+(relative(url)?bases.link:'')+ url + '" target="'+(mod=='\x02'?'_self':'_blank')+'" '
					+ (down?'download="'+down+'"':'') +'>' 
					+ (txt=='_'?url:txt)
					+ '</a> ';
		},
		
		wordspace: function(str){return str.replace(/(_)/gm,' ') || str;},
		
		word: function(el, _, cont){
			let t = el,i = false;
			cont = Rep.wordspace(cont);
			if(el instanceof Array){
				t=el[0];i=el[1];
			}
			return Rep.getHTML(t,cont,i);
		}
	};
	
	function simpleHTML(tag,val,inline){ 
		return '<'+tag+(inline ? ' '+inline : '')+'>'+parseText(val)+'</'+tag+'>\n'; 
	}
	
	function support(pro,val){return '-webkit-'+pro+':'+val+';'+'-moz-'+pro+':'+val+';'+pro+':'+val+';';};
	
	function produceHTML(tree) {
		var t = {};
		var ulist = 0;
		var listArr = [];
		var elems = "";
		var lic = [];
		var tabs = [];
		var tabc = '';
		var cont = '';
		var tsd = false;
		var tabsel = false;
		for (let i in tree) {
			cont = '';
			t = tree[i];
			if (t.type == 'list-item' ) {
				if(t.list!='f'){
					if (t.indent < ulist) {
						for (let l = 0; l < ulist - t.indent; l++) {
							lic[t.indent+1-l] = false;
							cont += listArr.pop()+(l+1 < ulist - t.indent ?'</div>':'');
						}
					} else if (t.indent > ulist) {
						for (let l = 0; l < t.indent - ulist; l++) {
							let start = (l+1==t.indent-ulist) && (t.start!==false?'start="'+t.start+'"':'');
							cont += '<' + t.list + 'l list '+start+'>';
							listArr.push('</' + t.list + 'l>');
						}
					}
					cont += (lic[t.indent]?'</div>':'')+'<li'
					+ (t.accordion ? ' onclick="this.setAttribute(\'acc\',this.getAttribute(\'acc\') == \'open\'?\'close\':\'open\')" acc="'+(t.accordion == '>' ? 'close"' : 'open"'):'')
					+ '>' + parseText(t.value) + '</li><div lic>';
					lic[t.indent] = true;
					ulist = t.indent;
				} else {
					cont += '<span lif>'+parseText(t.value) + '</span>';
				}
			} else {
				while(listArr.length>0) {
					cont += listArr.pop()+(listArr.length>0?'</div>':'');
				}
				lic = [];
				ulist = 0;
			}
			switch (t.type) {
				case 'paragraph':
					let first = /^\s*([^\s]+)/.exec(t.value),bloc;
					if(first && (bloc = isBloc(first[1]))){
						cont += simpleHTML(bloc.tag,t.value.replace(/^([^\s]+)/,'').replace(/\t/g,'&#8195;&#8195;&#8195;&#8195;'),bloc.inline);
					}else{
						cont += simpleHTML('p',t.value);
					}
					break;
				case 'syntax':
					SYNTAX = t.value != '' && syntax[t.value] ? t.value : false;
					break;
				case 'header':
					cont += simpleHTML('h'+t.priority,t.value,'h')
					break;
				case 'comment':
					cont += '<!--' + t.value + '-->\n';
					break;
				case 'flex':
					cont += '\n<div flex style="display:flex;flex-direction:'
					+t.direction +';flex-wrap:wrap;align-items:'+(t.align)+'">\n';
					break;
				case 'tab':
					if(tabs==0){
						tabc = '';
						cont += '<div tabs><div tc>\n';
					}
					if(tabs>0){
						tabsel = false;
						cont += '</div></span>\n';
					}
					let st = '"background-color:'+t.bg+';color:'+t.color+'"';
					cont += '\n<span tab="'+(t.selected && 'selected')+'"'
					+' onclick="this.parentNode.querySelectorAll(\'[tab]\').forEach(el=>{el.setAttribute(\'tab\',\'\');el.style=\'\'});this.setAttribute(\'tab\',\'selected\');this.style=this.getAttribute(\'sel\');'
					+' this.parentNode.parentNode.querySelector(\'[tabc]\').innerHTML=this.children[0].innerHTML;"'
					+' sel='+st
					+ (t.selected ? ' style='+st : '')
					+'>'+t.title+'<div thc>';
					tabs++;
					tsd = t.selected;
					break;
				case 'closetab':
					tabs = 0;
					tabsel = false;
					cont += '</div></span></div><div tabc>'+tabc+'</div></div>\n';
					tabc = '';
					break;
				case 'columns':
					cont += '\n<div col style="'+ 
					support('column-count',t.count)+
					(t.rule?support('column-rule',t.rule):'')+'">\n';
					break;
				case 'closecontainer':
					cont += '</' + t.tag + '>\n';
					break;
				case 'hr': case 'br': case 'container':
					cont += '\n<'+(t.type=='container'?t.tag:t.type)+(t.inline?' '+t.inline:'')+'>\n';
					break;
				case 'colorline':
					cont += '\n<div hr '
						+ 'style="background'
						+ (t.value.length == 1 ?
							'-color:' + t.value[0] :
							'-image:linear-gradient(90deg,'+t.value.join(',')+')')
						+ '"></div>\n';
					break;
				case 'media':
					cont += '\n<'+t.media+' controls type="'+ t.mime + '" src="' + t.src + '"></'+t.media+'>\n';
					break;
				case 'raw':
					if(t.value){
						cont += t.value+'\n';
					}
				default:
					cont += '';
			}
			if(tabsel){
				tabc += cont;
			}
			elems += cont;
			if(tsd)tabsel=true;
		}
		return elems;
	};
	m.parsed = function(raw) {
		return produceHTML(parseRaw(raw));
	};

	m.addCSS= function () {
		var styl = document.createElement('style');
		styl.innerHTML = m.css;
		var styls = document.head.getElementsByTagName('style');
		var links = document.head.getElementsByTagName('link');
		if (styls.length > 0) {
			document.head.insertBefore(styl, styls[0]);
		} else if (links.length > 0) {
			document.head.insertBefore(styl, links[0]);
		} else {
			document.head.appendChild(styl);
		}
	};
	
	m.convert= function () {
		var menos = document.querySelectorAll('script[type="text/meno"]');
		for (let i = 0; i < menos.length; i++) {
			var raw = menos[i].innerHTML;
			var art = document.createElement('article');
			
			for(let a=0;a<menos[i].attributes.length;a++){
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
	
	window.addEventListener('load',()=>{
		let imp = document.querySelector('script[src*=meno]');
		if(imp){
			imp.src.replace(/.+\?/,'').split('&').forEach(p => {
				switch (p) {
					case 'css':
						m.addCSS();
						break;
					case 'convert':
						m.convert();
						break;
					default:
						break;
				}
			});
		}
	})


	return m;
})();