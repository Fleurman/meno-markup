var meno=function(){var e={version:"0.9.99",parsed:function(e){var n=(e=e.replace(/\/\/.+$/gm,"\n")).split(/\r\n|\r|\n/);return ps(n)}};pI=function(e,n){e[t]=n};var n,o="length",t="innerHTML";pR=function(e){for(var n={},t={id:0,iK:!1,iW:!1,ls:0,ctn:[],bd:0};void 0!==e[t.id];){var r,i,l=e[t.id].trim();if(1==t.iW)";;;"==l?(t.bd++,t.iW=!1):n[t.bd].v+=l+"\n";else if(1==t.iK){if(r=/^(.*)(\]?)/.exec(l)){var a="]"==r[1][r[1][o]-1],c=r[1].replace(/\]$/m,"");n[t.bd].v+=" \n"+c,a&&(t.bd++,t.iK=!1)}}else{if(r=/^(:{1,6})(\[)? (.+)/.exec(l))i={t:"h",py:r[1][o],v:r[3]},r[2]&&(t.iK=!0);else if(r=/^-{3,}([^ -]+)?$/.exec(l))i={t:"hr"},void 0!=r[1]&&(i.t="cl",i.v=r[1]);else if(r=/^\[(-{2,}|:{2,}|\]{2,})\[/.exec(l))i={t:"col",rule:rule(r[1][0]),count:r[1][o],tag:"div"},t.ctn.push("div");else if(r=/^\[([^\[]+)\[(.*)$/.exec(l))i={t:"ct",tag:r[1],il:r[2]||""},t.ctn.push(r[1]);else if(r=/^_([a-zA-Z-]*):(.*)$/.exec(l))i={t:"attr",n:r[1],v:r[2]};else if(r=/^(<-|->)(.*)\1/.exec(l))i={t:"mq",v:r[2],d:"<-"==r[1]?"left":"right"};else if(r=/^<>(.*)<>/.exec(l))i={t:"bl",tag:"nav",v:r[1]};else if("]]"==l&&t.ctn[o]>0)i={t:"xct",tag:t.ctn.pop()};else if(r=/^<([\w]+?):([^>]+)>/.exec(l))i={t:"ad",mi:gM(r[1]),src:r[2]};else if(r=/^:(.*?)>(\[??)?(.+)/.exec(l))i={t:"ds",v:r[3]},is(r[1])&&(i.tl=r[1]),r[2]&&(t.iK=!0);else if(r=/^;;;(.*)/.exec(l))i={t:"rw",v:""},t.iW=!0;else if(r=/^\[([^\[\]]*)\](.+)/g.exec(l))i={t:"ig",alt:r[1],url:r[2]};else if(r=/^(-+|\]+|\^+) (.+)/.exec(l)){i={t:"li",ls:{"-":"u","]":"o","^":"f"}[r[1][0]],v:r[2],ie:r[1][o]}}else(r=p(l))?(i={t:"bl",tag:r.tag,v:r[2]},r[1]&&(t.iK=!0)):i="-"==l||":"==l?{t:tW(l)}:(r=/^(.+)/.exec(l))?{t:"p",v:r[1]}:{t:""};"v"!=i.t&&(n[t.bd-1]&&"p"==i.t&&n[t.bd-1].t==i.t?n[t.bd-1].v+="\n"+i.v:(n[t.bd]=i,0==t.iK&&0==t.iW&&t.bd++))}t.id++}return n},is=function(e){return e.trim()[o]>1},rule=(n={":":"4px dotted lightgrey","]":"1px solid lightgrey"},function(e){return!!n[e]&&n[e]});var r,l,a="blockquote",c=["-_-","comment","<",a,";","code"];function p(e){for(var n,t=0;t<c[o];t+=2){if(n=new RegExp("^"+c[t]+"(\\[)? (.+)").exec(e))return n.tag=c[t+1],n}return!1}function s(e,n,o){n=(n=n.replace(/</g,"&lt;")).replace(/\\/g,"\\"),e.push(n),e.push(o)}e.addBlocTag=function(e,n){e&&n&&s(c,e,n)},tW=(r={"-":"br",":":"v","<":a,"-_-":"comment",";":"code"},function(e){return r[e]||e}),gM=(l={mp3:"mpeg",ogg:"ogg"},function(e){return"audio/"+l[e]}),dPI=function(e,n,o){return e=(e=e.replace(Reg.w(n),Rep.wd.bind(Rep,o))).replace(Reg.b(n),Rep.bl.bind(Rep,o))};var u=["__","sub","\\^\\^","sup","\\^","i","&lt;&lt;","b","&lt;","q",">>","small","_","u","--","del",";;","samp","->","mark"];e.addInlineTag=function(e,n){e&&n&&s(u,e,n)},pT=function(e){e=(e=(e=(e=e.replace(/</g,"&lt;")).replace(Reg.l,Rep.lk)).replace(Reg.b(";;;"),Rep.rw)).replace(/(?:^| )\[([^\]:]+?):(.+?)\](?: |$|)/gm,Rep.hi);for(var n=0;n<u[o];n+=2)e=dPI(e,u[n],u[n+1]);return e=(e=(e=(e=(e=e.replace(Reg.w(";"),Rep.wc)).replace(Reg.b(";"),Rep.code)).replace(/(?: |^)\[([^\[]+)\]([^ ]+)(?: |$)/gm,Rep.ii)).replace(/(\200)/g,"<br>")).replace(/-:\s/g,"&nbsp;&nbsp;&nbsp;&nbsp;"),unescape(e)},pL=function(e){var n=e;return n=n.replace(/(?: |^)\[([^\[]+)\[([^ ]+)(?: |$)/gm,Rep.ig)},Reg={w:function(e){return new RegExp("( |^|:)"+e+"([^ \\n\\[]+)(?: |$)","gm")},b:function(e){return new RegExp("(?: |^)"+e+"\\[(.+?)\\](?: |$)","gm")},l:new RegExp("(?: |^)>([^><]+?)(&lt;|>)([^ ;]+);?([^ ]*?)( ||$)","gm")},Rep={gH:function(e,n,o){return o+"<"+e+">"+n+"</"+e+"> "},gI:function(e,n,o){return' <img alt="'+e+'" src="'+n+'" '+(o?'style="display:inline;"':"")+' title="'+e+'" > '},rw:function(e,n){return n.replace(/&lt;/g,"<")},code:function(e,n){return" <code meno-inblock >"+escape(n)+"</code> "},wc:function(e,n,o){return Rep.code(n,Rep.ws(o))},lk:function(e,n,o,t,r,i){return" <a href='"+t+"' target='"+(">"==o?"_blank":"_self")+"' "+aI()+(r?'download="'+r+'"':"")+">"+(" "==n?t:pL(n))+"</a> "+i},ig:function(e,n,o){return Rep.gI(n,o)},ii:function(e,n,o){return Rep.gI(n,o,!0)},hi:function(e,n,o){return' <span meno-tip="'+o+'">'+pT(n)+"</span> "},ws:function(e){return e.replace(/(_)/gm," ")},wd:function(e,n,o,t){o=":"!=o?" ":"";return Rep.gH(e,Rep.ws(t),o)},bl:function(e,n,o){return Rep.gH(e,o,"")}};var f={},m={},g=["cursor","color","font","float","background"];aI=function(){var e=" ";return e+=aA(),e+=aS()},aA=function(){var e=Object.keys(f);if(e[o]<1)return"";var n=" ";for(i in e){var t=f[e[i]];""!=t&&(n+=e[i]+'="'+t+'" ')}return n},aS=function(){var e=Object.keys(m);if(e[o]<1)return"";var n=' style="';for(i in e){var t=m[e[i]];""!=t&&(n+=e[i]+":"+t+";")}return n+='"'},gT=function(e){for(var n="",o=0;o<e;o++)n+="  ";return n},sH=function(e,n,o){return"<"+e+(o?"":aI())+">"+pT(n)+"</"+e+">\n"},sp=function(e,n){return"-webkit-"+e+":"+n+";-moz-"+e+":"+n+";"+e+":"+n+";"},pH=function(e){var n=0,t={},r=0,i=[],l="";f={},m={};for(n in e){if("li"==(t=e[n]).t)if("f"!=t.ls){if(t.ie<r)for(var a=0;a<r-t.ie;a++)l+=i.pop();if(t.ie>r)for(a=0;a<t.ie-r;a++)l+=gT(t.ie-1)+"<"+t.ls+"l "+aI()+">\n",i.push(gT(t.ie-1)+"</"+t.ls+"l>\n");l+=gT(t.ie)+"<li>"+pT(t.v)+"</li>\n",r=t.ie}else l+=gT(t.ie)+"\t"+pT(t.v)+"<br>\n";else{for(a=0;a<i[o];a++)l+=i.pop();r=0}switch(t.t){case"p":l+=sH("p",t.v);break;case"h":l+=sH("h"+t.py,t.v);break;case"bl":"comment"==t.tag?l+="\x3c!--"+t.v+"--\x3e\n":l+=sH(t.tag,t.v);break;case"mq":var c=pT(t.v);l+="<marquee direction='"+t.d+"'>"+c+"</marquee>\n";break;case"ig":l+="<img "+aI()+"alt='"+t.alt+"' src='"+t.url+"' >\n";break;case"col":l+='\n<div meno-col style="'+sp("column-count",t.count)+(t.rule?sp("column-rule",t.rule):"")+'">\n';break;case"ct":l+="\n<"+t.tag+" "+t.il+" >\n";break;case"xct":l+="</"+t.tag+">\n";break;case"br":case"hr":l+="<"+t.t+("hr"==t.t?aI():"")+">\n";break;case"cl":l+="\n<div meno-hr style='background-color:"+t.v+"'></div>\n";break;case"ad":l+="\n<audio"+aI()+'controls type="'+t.mi+'" src="'+t.src+'"></audio>\n';break;case"ds":l+="\n<details"+aI()+">\n"+(t.tl?"<summary>"+t.tl+"</summary>\n":"")+"<span>"+t.v.replace(/(\200)/g,"<br>")+"</span>\n</details>\n";break;case"attr":""==t.n?(f={},m={}):-1!=g.indexOf(t.n)?m[t.n]=t.v:f[t.n]=t.v;break;case"rw":l+=t.v+"\n";break;default:l=l}}return l},ps=function(e){var n;return n=pR(e),pH(n)},e.css=".meno{font-family:Calibri}.meno code{display:block;background-color:#f5f5f5;color:#696969;font-family:consolas}.meno textarea{resize:none}.meno details{border-bottom:2px dotted #d3d3d3;border-right:2px dotted #d3d3d3}.meno details span{color:grey;font-size:.9em;padding-left:20px;display:block}.meno [meno-inblock],.meno nav,.meno ol,.meno ul{display:inline-block}.meno h1,h2,h3,h4,h5,h6{margin-bottom:0}.meno a{color:#87ceeb;text-decoration:none;border-bottom:1px solid #d3d3d3;border-top:1px solid #d3d3d3}.meno article{font-family:Consolas}.meno nav{margin:5px;padding:0 5px;border-right:2px solid #d3d3d3;border-left:2px solid #d3d3d3;background-color:#fafafa}.meno nav a{border:none}.meno blockquote{font-style:italic;margin-left:1em}.meno blockquote:before{content:''' '}.meno blockquote:after{content:' '''}.meno ul{padding:5px;border-top:2px solid #d3d3d3;border-bottom:2px solid #d3d3d3}.meno ul ol,.meno ul ul{border:none;padding:2px;margin-left:20px}.meno ul>li{font-size:1.2em;font-weight:700;list-style-type:none}.meno ul>li:before{content:'| '}.meno ul ul>li{font-size:1.1em;font-weight:700;color:#696969}.meno ul ul>li:before{content:': ';color:#000}.meno ul ul ul>li{font-size:1.05em;font-weight:400;color:grey}.meno ul ul ul>li:before{content:'· ';color:#000}.meno ul ul ul ul>li{font-size:1em;font-weight:400;color:#000}.meno ul ul ul ul>li:before{content:'- ';color:#000}.meno ol{padding:5px;list-style-position:inside;border-top:2px solid #d3d3d3;border-bottom:2px solid #d3d3d3}.meno ol ol,.meno ol ul{border:none;padding:2px;margin-left:20px}.meno ol>li{font-size:1.2em;font-weight:700;border-bottom:1px dashed #d3d3d3}.meno ol ol>li{font-size:1.1em;font-weight:700;color:#696969;border-bottom:none}.meno ol ol ol>li{font-size:1.05em;font-weight:400;color:grey}.meno ol ol ol ol>li{font-size:1em;font-weight:400;color:#000}.meno [meno-hr]{height:2px;margin:1em 0}.meno [meno-col] p{margin-top:0}.meno [meno-tip]{position:relative;display:inline;border-bottom:1px dotted pink}.meno [meno-tip]::after{content:attr(meno-tip);font-size:13px;min-width:100px;min-heigh:100px;background-color:rgba(50,50,50,.8);color:#fff;border-bottom:2px solid orange;border-radius:10px 0;padding:3px 8px;position:absolute;bottom:100%;left:50%;opacity:0;visibility:hidden;transition:opacity .3s}.meno [meno-tip]:hover::after{opacity:1;visibility:visible}.meno [meno-tip]:hover{border:1px solid orange;margin:-1px;background-color:rgba(250,250,100,.1);cursor:help}.meno ::selection{background-color:orange;color:#fff}",d=document;var b="createElement",v=d.getElementsByTagName,x=d.head,h=x.insertBefore;return e.addCSS=function(){var n=d[b]("style");n[t]=e.css;var r=v("style"),i=v("link");r[o]>0?h(n,r[0]):i[o]>0?h(n,i[0]):x.appendChild(n)},e.convert=function(){for(var n=d.querySelectorAll("script[type='text/meno']"),r=0;r<n[o];r++){for(var i=n[r].innerHTML,l=d[b]("article"),a=0;a<n[r].attributes[o];a++){var c=n[r].attributes[a];"type"!=c.name&&l.setAttribute(c.name,c.value)}l.className+=" meno",n[r].parentNode.insertBefore(l,n[r]),l[t]=e.parsed(i),n[r].parentNode.removeChild(n[r])}},e}();