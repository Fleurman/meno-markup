var meno=function(){var e={version:"0.9.99",parsed:function(e){var r=(e=e.replace(/\/\/.+$/gm,"\n")).split(/\r\n|\r|\n/);return ps(r)}};pI=function(e,r){e[t]=r};var r,n="length",t="innerHTML";pR=function(e){for(var r={},t={id:0,iK:!1,iW:!1,ls:0,ctn:[],bd:0};void 0!==e[t.id];){var i,a,c=e[t.id].trim();if(1==t.iW)";;;"==c?(t.bd++,t.iW=!1):r[t.bd].v+=c+"\n";else if(1==t.iK){if(i=/^(.*)(\]?)/.exec(c)){var l="]"==i[1][i[1][n]-1],u=i[1].replace(/\]$/m,"");r[t.bd].v+=" \n"+u,l&&(t.bd++,t.iK=!1)}}else{if(i=/^(:{1,6})(\[)? (.+)/.exec(c))a={t:"h",py:i[1][n],v:i[3]},i[2]&&(t.iK=!0);else if(i=/^-{3,}([^ -]+)?$/.exec(c))a={t:"hr"},void 0!=i[1]&&(a.t="cl",a.v=i[1]);else if(i=/^\[(-{2,}|:{2,}|\]{2,})\[/.exec(c))a={t:"col",rule:rule(i[1][0]),count:i[1][n],tag:"div"},t.ctn.push("div");else if(i=/^\[([^\[]+)\[(.*)$/.exec(c))a={t:"ct",tag:i[1],il:i[2]||""},t.ctn.push(i[1]);else if(i=/^_([a-zA-Z-]*):(.*)$/.exec(c))a={t:"attr",n:i[1],v:i[2]};else if(i=/^(<-|->)(.*)\1/.exec(c))a={t:"mq",v:i[2],d:"<-"==i[1]?"left":"right"};else if(i=/^<>(.*)<>/.exec(c))a={t:"bl",tag:"nav",v:i[1]};else if("]]"==c&&t.ctn[n]>0)a={t:"xct",tag:t.ctn.pop()};else if(i=/^<([\w]+?):([^>]+)>/.exec(c))a={t:"ad",mi:gM(i[1]),src:i[2]};else if(i=/^:(.*?)>(\[??)?(.+)/.exec(c))a={t:"ds",v:i[3]},is(i[1])&&(a.tl=i[1]),i[2]&&(t.iK=!0);else if(i=/^;;;(.*)/.exec(c))a={t:"rw",v:""},t.iW=!0;else if(i=/^\[([^\[\]]*)\](.+)/g.exec(c))a={t:"ig",alt:i[1],url:i[2]};else if(i=/^(-+|\]+|\^+) (.+)/.exec(c)){a={t:"li",ls:{"-":"u","]":"o","^":"f"}[i[1][0]],v:i[2],ie:i[1][n]}}else(i=o(c))?(a={t:"bl",tag:i.tag,v:i[2]},i[1]&&(t.iK=!0)):a="-"==c||":"==c?{t:tW(c)}:(i=/^(.+)/.exec(c))?{t:"p",v:i[1]}:{t:""};"v"!=a.t&&(r[t.bd-1]&&"p"==a.t&&r[t.bd-1].t==a.t?r[t.bd-1].v+="\n"+a.v:(r[t.bd]=a,0==t.iK&&0==t.iW&&t.bd++))}t.id++}return r},is=function(e){return e.trim()[n]>1},rule=(r={":":"4px dotted lightgrey","]":"1px solid lightgrey"},function(e){return!!r[e]&&r[e]});var a,c,l="blockquote",u=["-_-","comment","<",l,";","code"];function o(e){for(var r,t=0;t<u[n];t+=2){if(r=new RegExp("^"+u[t]+"(\\[)? (.+)").exec(e))return r.tag=u[t+1],r}return!1}function s(e,r,n){r=(r=r.replace(/</g,"&lt;")).replace(/\\/g,"\\"),e.push(r),e.push(n)}e.addBlocTag=function(e,r){e&&r&&s(u,e,r)},tW=(a={"-":"br",":":"v","<":l,"-_-":"comment",";":"code"},function(e){return a[e]||e}),gM=(c={mp3:"mpeg",ogg:"ogg"},function(e){return"audio/"+c[e]}),dPI=function(e,r,n){return e=(e=e.replace(Reg.w(r),Rep.wd.bind(Rep,n))).replace(Reg.b(r),Rep.bl.bind(Rep,n))};var p=["__","sub","\\^\\^","sup","\\^","i","&lt;&lt;","b","&lt;","q",">>","small","_","u","--","del",";;","samp","->","mark"];e.addInlineTag=function(e,r){e&&r&&s(p,e,r)},pT=function(e){e=(e=(e=(e=e.replace(/</g,"&lt;")).replace(Reg.l,Rep.lk)).replace(Reg.b(";;;"),Rep.rw)).replace(/(?:^| )\[([^\]:]+?):(.+?)\](?: |$|)/gm,Rep.hi);for(var r=0;r<p[n];r+=2)e=dPI(e,p[r],p[r+1]);return e=(e=(e=(e=(e=e.replace(Reg.w(";"),Rep.wc)).replace(Reg.b(";"),Rep.code)).replace(/(?: |^)\[([^\[]+)\]([^ ]+)(?: |$)/gm,Rep.ii)).replace(/(\200)/g,"<br>")).replace(/-:\s/g,"&nbsp;&nbsp;&nbsp;&nbsp;"),unescape(e)},pL=function(e){var r=e;return r=r.replace(/(?: |^)\[([^\[]+)\[([^ ]+)(?: |$)/gm,Rep.ig)},Reg={w:function(e){return new RegExp("( |^|:)"+e+"([^ \\n\\[]+)(?: |$)","gm")},b:function(e){return new RegExp("(?: |^)"+e+"\\[(.+?)\\](?: |$)","gm")},l:new RegExp("(?: |^)>([^><]+?)(&lt;|>)([^ ;]+);?([^ ]*?)( ||$)","gm")},Rep={gH:function(e,r,n){return n+"<"+e+">"+r+"</"+e+"> "},gI:function(e,r,n){return' <img alt="'+e+'" src="'+r+'" '+(n?'style="display:inline;"':"")+' title="'+e+'" > '},rw:function(e,r){return r.replace(/&lt;/g,"<")},code:function(e,r){return" <code -inblock >"+escape(r)+"</code> "},wc:function(e,r,n){return Rep.code(r,Rep.ws(n))},lk:function(e,r,n,t,i,a){return" <a href='"+t+"' target='"+(">"==n?"_blank":"_self")+"' "+aI()+(i?'download="'+i+'"':"")+">"+(" "==r?t:pL(r))+"</a> "+a},ig:function(e,r,n){return Rep.gI(r,n)},ii:function(e,r,n){return Rep.gI(r,n,!0)},hi:function(e,r,n){return' <span -tip="'+n+'">'+pT(r)+"</span> "},ws:function(e){return e.replace(/(_)/gm," ")},wd:function(e,r,n,t){n=":"!=n?" ":"";return Rep.gH(e,Rep.ws(t),n)},bl:function(e,r,n){return Rep.gH(e,n,"")}};var f={},g={},v=["cursor","color","font","float","background"];aI=function(){var e=" ";return e+=aA(),e+=aS()},aA=function(){var e=Object.keys(f);if(e[n]<1)return"";var r=" ";for(i in e){var t=f[e[i]];""!=t&&(r+=e[i]+'="'+t+'" ')}return r},aS=function(){var e=Object.keys(g);if(e[n]<1)return"";var r=' style="';for(i in e){var t=g[e[i]];""!=t&&(r+=e[i]+":"+t+";")}return r+='"'},gT=function(e){for(var r="",n=0;n<e;n++)r+="  ";return r},sH=function(e,r,n){return"<"+e+(n?"":aI())+">"+pT(r)+"</"+e+">\n"},sp=function(e,r){return"-webkit-"+e+":"+r+";-moz-"+e+":"+r+";"+e+":"+r+";"},pH=function(e){var r=0,t={},i=0,a=[],c="";f={},g={};for(r in e){if("li"==(t=e[r]).t)if("f"!=t.ls){if(t.ie<i)for(var l=0;l<i-t.ie;l++)c+=a.pop();if(t.ie>i)for(l=0;l<t.ie-i;l++)c+=gT(t.ie-1)+"<"+t.ls+"l "+aI()+" -list>\n",a.push(gT(t.ie-1)+"</"+t.ls+"l>\n");c+=gT(t.ie)+"<li>"+pT(t.v)+"</li>\n",i=t.ie}else c+=gT(t.ie)+"\t<span>"+pT(t.v)+"</span><br>\n";else{for(l=0;l<a[n];l++)c+=a.pop();i=0}switch(t.t){case"p":c+=sH("p",t.v);break;case"h":c+=sH("h"+t.py,t.v);break;case"bl":"comment"==t.tag?c+="\x3c!--"+t.v+"--\x3e\n":c+=sH(t.tag,t.v);break;case"mq":var u=pT(t.v);c+="<marquee direction='"+t.d+"'>"+u+"</marquee>\n";break;case"ig":c+="<img "+aI()+"alt='"+t.alt+"' src='"+t.url+"' >\n";break;case"col":c+='\n<div -col style="'+sp("column-count",t.count)+(t.rule?sp("column-rule",t.rule):"")+'">\n';break;case"ct":c+="\n<"+t.tag+" "+t.il+" >\n";break;case"xct":c+="</"+t.tag+">\n";break;case"br":case"hr":c+="<"+t.t+("hr"==t.t?aI():"")+">\n";break;case"cl":c+="\n<div -hr style='background-color:"+t.v+"'></div>\n";break;case"ad":c+="\n<audio"+aI()+'controls type="'+t.mi+'" src="'+t.src+'"></audio>\n';break;case"ds":c+="\n<details"+aI()+">\n"+(t.tl?"<summary>"+t.tl+"</summary>\n":"")+"<span>"+t.v.replace(/(\200)/g,"<br>")+"</span>\n</details>\n";break;case"attr":""==t.n?(f={},g={}):-1!=v.indexOf(t.n)?g[t.n]=t.v:f[t.n]=t.v;break;case"rw":c+=t.v+"\n";break;default:c=c}}return c},ps=function(e){var r;return r=pR(e),pH(r)},d=document;return e.convert=function(){for(var r=d.querySelectorAll("script[type='text/meno']"),i=0;i<r[n];i++){for(var a=r[i].innerHTML,c=d.createElement("article"),l=0;l<r[i].attributes[n];l++){var u=r[i].attributes[l];"type"!=u.name&&c.setAttribute(u.name,u.value)}c.className+=" meno",r[i].parentNode.insertBefore(c,r[i]),c[t]=e.parsed(a),r[i].parentNode.removeChild(r[i])}},e}();