/* wawity promo: scroll-directed scenes */
(function(){
'use strict';
var d=document;
function $(s,c){return (c||d).querySelector(s)}
function $$(s,c){return [].slice.call((c||d).querySelectorAll(s))}
var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function clamp(v,a,b){a=a===undefined?0:a;b=b===undefined?1:b;return v<a?a:v>b?b:v}
function seg(p,a,b){return clamp((p-a)/(b-a))}
function eio(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
function eo(t){return 1-Math.pow(1-t,4)}
function lerp(a,b,t){return a+(b-a)*t}
function hs(n){n=Math.sin(n*127.1+311.7)*43758.5453;return n-Math.floor(n)}
function txt(el,v){if(el&&el.textContent!==v)el.textContent=v}
function cls(el,c,on){if(el)el.classList.toggle(c,!!on)}

/* ---------- icons ---------- */
var IC={
send:'<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
check:'<path d="M20 6 9 17l-5-5"/>',
arrowUp:'<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
up:'<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
down:'<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
download:'<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
power:'<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>',
activity:'<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
globe:'<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
sparkles:'<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.13a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.13 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z"/>',
shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
shuffle:'<path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/>',
chev:'<path d="m9 18 6-6-6-6"/>',
copy:'<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
signal:'<path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/>',
timer:'<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
eyeoff:'<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>',
zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
app:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 4v4"/><path d="M2 8h20"/><path d="M6 4v4"/>',
info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
filter:'<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
gamepad:'<line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="2"/>',
atom:'<circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/>',
wifi:'<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>',
terminal:'<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>'
};
function svg(k){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(IC[k]||'')+'</svg>'}
function paintIcons(root){$$('i[data-i]',root).forEach(function(el){if(!el.firstChild)el.innerHTML=svg(el.getAttribute('data-i'))})}
paintIcons();

/* ---------- hero headline split ---------- */
var heroH=$('#heroH'),ci=0;
if(heroH){
  var parts=heroH.innerHTML.split(/<br\s*\/?>/i);
  heroH.setAttribute('aria-label',heroH.textContent);
  heroH.innerHTML=parts.map(function(line){
    return line.trim().split(/\s+/).map(function(w){
      return '<span class="w" aria-hidden="true">'+w.split('').map(function(c){return '<span class="ch" style="--i:'+(ci++)+'">'+c+'</span>'}).join('')+'</span>';
    }).join(' ');
  }).join('<br>');
}

/* ---------- intro ---------- */
var intro=$('#intro');
function go(){
  d.body.classList.add('ready');
  if(intro){intro.classList.add('gone');setTimeout(function(){intro.remove()},900)}
  startAsk();
}
if(!intro||reduced){go()}
else{
  var num=$('#introNum'),bar=$('#introBar'),t0=performance.now(),loaded=false,done=false;
  window.addEventListener('load',function(){loaded=true});
  setTimeout(function(){loaded=true},2600);
  (function tick(now){
    if(done)return;
    var t=Math.min(1,(now-t0)/1300);
    if(!loaded)t=Math.min(t,.86);
    var v=eo(t);
    num.textContent=String(Math.round(v*100)).padStart(2,'0');
    bar.style.transform='scaleX('+v+')';
    if(t>=1){done=true;setTimeout(go,180);return}
    requestAnimationFrame(tick);
  })(t0);
}

/* ---------- nav / menu ---------- */
var nav=$('#nav'),burger=$('#burger'),mm=$('#mmenu');
function setMenu(o){cls(mm,'open',o);burger.setAttribute('aria-expanded',o?'true':'false')}
burger.addEventListener('click',function(e){e.stopPropagation();setMenu(!mm.classList.contains('open'))});
d.addEventListener('click',function(e){if(!mm.contains(e.target))setMenu(false)});
d.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

/* ---------- smooth scroll ---------- */
var lenis=null;
if(window.Lenis&&!reduced){
  try{
    lenis=new Lenis({lerp:.085,smoothWheel:true,wheelMultiplier:.9});
    (function r(t){lenis.raf(t);requestAnimationFrame(r)})(0);
  }catch(e){lenis=null}
}
$$('a[href^="#"]').forEach(function(a){
  a.addEventListener('click',function(e){
    var h=a.getAttribute('href');
    var t=h==='#top'?d.body:d.querySelector(h);
    if(!t)return;
    e.preventDefault();setMenu(false);
    if(lenis)lenis.scrollTo(h==='#top'?0:t,{offset:0,duration:1.6});
    else if(h==='#top')window.scrollTo({top:0,behavior:reduced?'auto':'smooth'});
    else t.scrollIntoView({behavior:reduced?'auto':'smooth'});
  });
});

/* ---------- reveal ---------- */
if('IntersectionObserver' in window&&!reduced){
  var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
  $$('[data-rv]').forEach(function(el,i){el.style.transitionDelay=(el.closest('.hero')?(.9+i*.12):0)+'s';io.observe(el)});
}else $$('[data-rv]').forEach(function(el){el.classList.add('in')});

/* ---------- hero: subscription prompt ---------- */
function sleep(ms){return new Promise(function(r){setTimeout(r,ms)})}
var askStarted=false;
function startAsk(){
  if(askStarted)return;askStarted=true;
  var tEl=$('#askTxt'),ph=$('#askPh'),ok=$('#askOk'),goB=$('#askGo');
  if(!tEl)return;
  var links=[
    'vless://7f3a90c2@fra4.example.net:443?security=reality&sni=www.microsoft.com#Frankfurt',
    'hysteria2://c1d9e4@ams2.example.net:8443?obfs=salamander#Amsterdam',
    'https://sub.example.com/api/v1/client/subscribe?token=9b2e51af'
  ];
  if(reduced){ph.style.opacity=0;tEl.textContent=links[0];ok.classList.add('on');goB.classList.add('hot');return}
  (async function loop(){
    await sleep(1600);
    for(var k=0;;k=(k+1)%links.length){
      var s=links[k];ph.style.opacity=0;
      for(var i=1;i<=s.length;i++){tEl.textContent=s.slice(Math.max(0,i-58),i);await sleep(16+Math.random()*34)}
      await sleep(300);ok.classList.add('on');goB.classList.add('hot');
      await sleep(2200);ok.classList.remove('on');goB.classList.remove('hot');
      for(var j=Math.min(s.length,58);j>=0;j-=3){tEl.textContent=s.slice(s.length-58>0?s.length-58:0).slice(0,j);await sleep(9)}
      tEl.textContent='';ph.style.opacity=1;await sleep(900);
    }
  })();
}

/* ---------- marquee ---------- */
var mq=$('#marq'),mqX=0,mqW=0,mqV=0,lastSY=scrollY;
if(mq){mq.innerHTML+=mq.innerHTML;$$('span',mq).forEach(function(s,i){if(i>=8)s.setAttribute('aria-hidden','true')});}

/* ---------- manifesto scrub ---------- */
var scrub=$('[data-scrub]'),words=[];
if(scrub){
  var acc=/^(секунды|двадцать|четыре|мегабайта|восемь)/i;
  scrub.innerHTML=scrub.textContent.trim().split(/\s+/).map(function(w){return '<span class="wd'+(acc.test(w)?' num':'')+'">'+w+'</span>'}).join(' ');
  words=$$('.wd',scrub);
}

/* ---------- stage fit ---------- */
function fit(){
  $$('.stage').forEach(function(st){
    var box=$('.stage-box',st),dz=$('.dz',box);
    var W=+dz.getAttribute('data-w'),H=+dz.getAttribute('data-h');
    var s=Math.min(st.clientWidth/W,st.clientHeight/H);
    if(!isFinite(s)||s<=0)s=.3;
    box.style.width=(W*s)+'px';box.style.height=(H*s)+'px';
    dz.style.width=W+'px';dz.style.height=H+'px';
    dz.style.transform='scale('+s+')';
  });
}

/* ---------- cursor ---------- */
function mkCursor(dz){
  var el=$('.cur',dz),ring=$('.cur-ring',el),sv=$('svg',el);
  function pt(t){
    if(Array.isArray(t)&&typeof t[0]==='number')return{x:t[0],y:t[1]};
    var sel=t,ox=.5,oy=.5;
    if(Array.isArray(t)){sel=t[0];ox=t[1];oy=t[2]}
    var e=typeof sel==='string'?$(sel,dz):sel;
    if(!e)return{x:0,y:0};
    var dr=dz.getBoundingClientRect(),r=e.getBoundingClientRect(),s=(dr.width/dz.offsetWidth)||1;
    return{x:(r.left-dr.left+r.width*ox)/s,y:(r.top-dr.top+r.height*oy)/s};
  }
  return function(p,keys,clicks){
    var x,y,n=keys.length,i=0;
    if(p<=keys[0][0]){var a0=pt(keys[0][1]);x=a0.x;y=a0.y}
    else if(p>=keys[n-1][0]){var b0=pt(keys[n-1][1]);x=b0.x;y=b0.y}
    else{
      while(i<n-2&&p>keys[i+1][0])i++;
      var a=keys[i],b=keys[i+1],t=eio(clamp((p-a[0])/(b[0]-a[0])));
      var A=pt(a[1]),B=pt(b[1]),dx=B.x-A.x,dy=B.y-A.y,arc=Math.sin(Math.PI*t)*.1;
      x=A.x+dx*t-dy*arc;y=A.y+dy*t+dx*arc;
    }
    var press=0,rt=-1;
    for(var c=0;c<clicks.length;c++){
      var dd=p-clicks[c];
      if(Math.abs(dd)<.012)press=Math.max(press,1-Math.abs(dd)/.012);
      if(dd>=0&&dd<.04)rt=dd/.04;
    }
    el.style.opacity=Math.min(clamp(p/.03),clamp((1-p)/.03));
    el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)';
    sv.style.transform='translate(-4px,-2px) scale('+(1-press*.2).toFixed(3)+')';
    if(rt>=0){ring.style.opacity=(1-rt).toFixed(3);ring.style.transform='scale('+(.4+rt*1.3).toFixed(3)+')'}
    else ring.style.opacity=0;
  };
}
function captions(sc,p,th){
  var lis=sc._lis||(sc._lis=$$('.cap-steps li',sc)),bar=sc._bar||(sc._bar=$('.cap-bar i',sc)),k=0;
  for(var j=0;j<th.length;j++)if(p>=th[j])k=j;
  lis.forEach(function(li,j){cls(li,'on',j===k);cls(li,'done',j<k)});
  bar.style.transform='scaleX('+p.toFixed(4)+')';
}
function inR(p,a,b){return p>=a&&p<b}

var scenes=[];

/* ===== scene 1: connect ===== */
(function(){
  var sc=$('[data-scene=connect]');if(!sc)return;
  var dz=$('.dz',sc),cur=mkCursor(dz),c1=$('.c1',sc),pw=$('.pw',sc),lbl=$('.pw-l',sc),burst=$('.burst',sc),
      srv=$('.srv-card',sc),ks=$('[data-t=ks]',sc),tip=$('#ksTip'),
      ePing=$('#c1ping'),eDn=$('#c1down'),eUp=$('#c1up'),eT=$('#c1time'),eIp=$('#c1ip');
  var ST=['Инициализация…','Резолв сервера…','Рукопожатие Reality…','Сборка маршрутов…','Проверка утечек…','Почти готово…'];
  var K=[[0,[930,600]],[.1,['[data-t=srv]',.35,.55]],[.18,['[data-t=srv]',.4,.55]],[.25,['[data-t=power]',.5,.55]],[.31,['[data-t=power]',.52,.56]],[.5,['[data-t=power]',1.5,.8]],[.66,['[data-t=power]',1.5,.85]],[.76,['[data-t=ks]',.45,.6]],[.9,['[data-t=ks]',.45,.6]],[1,[920,590]]];
  var CL=[.28];
  function pad(n){return (n<10?'0':'')+n}
  scenes.push({el:sc,update:function(p){
    var con=p>=.28&&p<.5,on=p>=.5;
    cls(c1,'loading',con);cls(c1,'on-state',on);
    cls(pw,'hover',inR(p,.22,.3));cls(srv,'hover',inR(p,.08,.2));
    var ksh=inR(p,.74,.93);cls(ks,'hover',ksh);cls(tip,'on',ksh);
    txt(lbl,on?'Отключиться':con?'Подключение…':'Подключиться');
    var bt=seg(p,.5,.57);
    burst.style.opacity=(p>=.5&&p<.57)?(1-bt).toFixed(3):0;
    burst.style.transform='scale('+(1+bt*.9).toFixed(3)+')';
    if(con)txt(eIp,ST[Math.min(5,Math.floor(seg(p,.28,.5)*6))]);
    else txt(eIp,on?'IP скрыт':'IP открыт');
    if(on){
      var s=Math.floor((p-.5)*1400);
      txt(eT,pad(Math.floor(s/3600))+':'+pad(Math.floor(s/60)%60)+':'+pad(s%60));
      txt(ePing,(23+Math.round(Math.sin(p*90)*2))+' мс');
      txt(eDn,(38+Math.sin(p*47)*9+Math.sin(p*131)*3).toFixed(1)+' Мбит/с');
      txt(eUp,(6.2+Math.sin(p*31)*1.8).toFixed(1)+' Мбит/с');
    }else{txt(eT,'00:00:00');txt(ePing,con?'…':'—');txt(eDn,'0 Б/с');txt(eUp,'0 Б/с')}
    cur(p,K,CL);
    captions(sc,p,[0,.2,.28,.5]);
  }});
})();

/* ===== scene 2: servers ===== */
(function(){
  var sc=$('[data-scene=servers]');if(!sc)return;
  var dz=$('.dz',sc),cur=mkCursor(dz),inn=$('#c2in'),btn=$('[data-t=pingall]',sc),bl=$('#c2pl'),sel=$('#c2sel');
  var S=[['Frankfurt №4','de','vless · reality',23],['Amsterdam №2','nl','hysteria2',41],['Helsinki №1','fi','vless · reality',58],['Warszawa №2','pl','trojan',67],['Ashburn №1','us','tuic',112],['Frankfurt №2','de','vmess · ws',31],['Amsterdam №5','nl','shadowsocks',47],['Helsinki №3','fi','hysteria2',19],['Warszawa №1','pl','vless · xhttp',74],['Ashburn №3','us','trojan',139],['Frankfurt №7','de','shadowtls',28]];
  var RH=52;
  inn.innerHTML=S.map(function(r,i){
    return '<div class="sr" style="top:0;transform:translateY('+(i*RH)+'px)"><span class="sr-n"><span class="flag"><img src="flags/'+r[1]+'.svg" alt=""></span>'+r[0]+'<span class="sr-auto">авто</span><i data-i="check" class="sr-ck"></i></span><span class="sr-p">'+r[2]+'</span><span class="sr-ms">—<small>мс</small></span></div>';
  }).join('');
  paintIcons(inn);
  var rows=$$('.sr',inn),ms=rows.map(function(r){return $('.sr-ms',r)});
  var order=S.map(function(r,i){return i}).sort(function(a,b){return S[a][3]-S[b][3]});
  var rank=[];order.forEach(function(ix,r){rank[ix]=r});
  var target=rows[1];
  var K=[[0,[960,610]],[.1,['[data-t=pingall]',.5,.55]],[.2,['[data-t=pingall]',.5,.6]],[.4,['[data-t=list]',.62,.4]],[.58,['[data-t=list]',.62,.42]],[.7,['[data-t=list]',.6,.55]],[.78,[target,.32,.5]],[.9,[target,.34,.52]],[1,[960,600]]];
  var CL=[.15,.82];
  function tier(v){return v<80?'g':v<200?'o':'s'}
  scenes.push({el:sc,update:function(p){
    cls(btn,'hover',inR(p,.08,.15));cls(btn,'press',Math.abs(p-.15)<.01);
    var busy=inR(p,.15,.38);cls(btn,'busy',busy);
    var done=0;
    var st=eio(seg(p,.42,.54));
    var scr=180*eio(seg(p,.58,.66))*(1-eio(seg(p,.72,.78)));
    inn.style.transform='translateY('+(-scr).toFixed(1)+'px)';
    for(var i=0;i<rows.length;i++){
      var r=rows[i],s=.18+i*.018,v=null;
      if(p<.15){v=null}
      else if(p<s){v=10+Math.floor(hs(i*17+Math.floor(p*300))*200)}
      else{v=S[i][3];done++}
      var html=v===null?'—<small>мс</small>':v+'<small>мс</small>';
      if(ms[i].innerHTML!==html)ms[i].innerHTML=html;
      r.className='sr'+(v===null?'':' '+tier(v))+(p>=.54&&rank[i]===0?' auto':'')+((p<.82?i===0:i===1)?' sel':'')+(i===1&&inR(p,.76,.82)?' hover':'');
      r.style.transform='translateY('+(lerp(i,rank[i],st)*RH).toFixed(1)+'px)';
    }
    txt(bl,busy?'Пингую… '+done+'/'+rows.length:'Пинговать все');
    txt(sel,p<.82?'Frankfurt №4':'Amsterdam №2');
    cur(p,K,CL);
    captions(sc,p,[0,.15,.42,.78]);
  }});
})();

/* ===== scene 3: split tunnel ===== */
(function(){
  var sc=$('[data-scene=split]');if(!sc)return;
  var dz=$('.dz',sc),cur=mkCursor(dz),tabA=$('[data-st=apps]',sc),tabG=$('[data-st=games]',sc),apps=$('#c3apps'),scan=$('#c3scan'),
      bar=$('#c3bar'),pct=$('#c3pct'),lab=$('#c3launcher'),gl=$('#c3games'),nEl=$('#c3n'),laneD=$('#laneD');
  var G=[['Counter-Strike 2','Steam','cs2.exe','','oklch(0.55 0.12 70)','CS2'],['VALORANT','Riot','VALORANT-Win64-Shipping.exe','Vanguard','oklch(0.58 0.2 20)','VAL'],['Dota 2','Steam','dota2.exe','','oklch(0.45 0.15 28)','D2'],['Apex Legends','EA','r5apex.exe','EasyAntiCheat','oklch(0.5 0.17 32)','APX'],['Fortnite','Epic Games','FortniteClient-Win64-Shipping.exe','BattlEye','oklch(0.52 0.16 285)','FN']];
  gl.innerHTML=G.map(function(g){return '<div class="gm"><span class="gm-ic" style="background:'+g[4]+'">'+g[5]+'</span><span class="gm-t"><b>'+g[0]+'</b><em>'+g[1]+' · '+g[2]+'</em></span><span class="gm-ac">'+g[3]+'</span><span class="gm-cb">'+svg('check')+'</span></div>'}).join('');
  var gs=$$('.gm',gl),cbs=gs.map(function(g){return $('.gm-cb',g)});
  var L=['Steam','Epic Games','Riot Client','Battle.net','EA App'];
  var K=[[0,[960,650]],[.09,['[data-t=games]',.5,.55]],[.16,['[data-t=games]',.52,.6]],[.3,['#c3games',.55,.3]],[.4,[cbs[0],.5,.5]],[.46,[cbs[0],.5,.5]],[.5,[cbs[1],.5,.5]],[.55,[cbs[1],.5,.5]],[.58,[cbs[3],.5,.5]],[.64,[cbs[3],.5,.5]],[.78,['#laneD',.5,.5]],[.92,['#laneD',.52,.55]],[1,[960,660]]];
  var CL=[.13,.44,.52,.6];
  var CK=[.44,.52,1.1,.6,1.1];
  var pk=[];
  $$('.track',sc).forEach(function(tr,li){for(var j=0;j<4;j++){var e=d.createElement('i');e.className='pk';tr.appendChild(e);pk.push({el:e,lane:li,j:j})}});
  scenes.push({el:sc,live:true,update:function(p,now){
    var g=p>=.13;
    cls(tabA,'on',!g);cls(tabG,'on',g);cls(tabG,'hover',inR(p,.08,.13));
    apps.style.opacity=g?0:1;apps.style.transform=g?'translateY(-8px)':'none';
    scan.style.opacity=g?1:0;scan.style.transform=g?'none':'translateY(8px)';
    var q=seg(p,.14,.36);
    bar.style.transform='scaleX('+q.toFixed(3)+')';txt(pct,Math.round(q*100)+'%');
    txt(lab,q>=1?'Найдено 5 игр и 3 античита':'Сканирую '+L[Math.min(4,Math.floor(q*5))]+'…');
    var n=0;
    gs.forEach(function(el,i){
      cls(el,'in',p>.16+i*.04);
      var on=p>=CK[i];if(on)n++;
      cls(el,'on',on);cls(el,'hover',CK[i]<1&&inR(p,CK[i]-.04,CK[i]));
    });
    txt(nEl,String(n));
    var dOn=p>=.44;
    laneD.style.opacity=dOn?1:.22;
    var t=now/1000;
    pk.forEach(function(k){
      var sp=k.lane===0?1.1:2.2,f=((t/sp)+k.j/4)%1;
      k.el.style.left=(f*100).toFixed(2)+'%';
      k.el.style.opacity=(k.lane===0&&!dOn)?0:Math.min(1,Math.min(f,1-f)*8).toFixed(2);
    });
    cur(p,K,CL);
    captions(sc,p,[0,.13,.4,.62]);
  }});
})();

/* ===== scene 4: kill switch ===== */
(function(){
  var sc=$('[data-scene=kill]');if(!sc)return;
  var dz=$('.dz',sc),cur=mkCursor(dz),tgK=$('[data-t=tgks]',sc),tgA=$('[data-t=tgao]',sc),rK=$('#rowKs'),rA=$('#rowAo'),
      tm=$('#tm'),tmw=$('#tmW'),end=$('[data-t=tmend]',sc),win=$('#k4win'),fw=$('#fw'),rules=$$('.fw-r',fw),
      nEl=$('#fwN'),clk=$('#fwClock'),field=$('#fwField');
  var K=[[0,[960,620]],[.1,['[data-t=tgks]',.5,.5]],[.16,['[data-t=tgks]',.52,.55]],[.22,['[data-t=tgao]',.5,.5]],[.28,['[data-t=tgao]',.52,.55]],[.38,['[data-t=tmw]',.35,.5]],[.46,['[data-t=tmw]',.37,.55]],[.5,['[data-t=tmend]',.5,.5]],[.56,['[data-t=tmend]',.52,.55]],[.7,[720,560]],[1,[780,590]]];
  var CL=[.14,.26,.44,.53];
  var pks=[];
  for(var j=0;j<10;j++){var e=d.createElement('i');e.className='fpk';field.appendChild(e);pks.push({el:e,j:j,lane:j%4,sp:1.1+hs(j)*1.1,off:hs(j*7)})}
  var t0=0;
  scenes.push({el:sc,live:true,update:function(p,now){
    var kOn=p>=.14,aOn=p>=.26;
    cls(tgK,'on',kOn);cls(tgA,'on',aOn);cls(rK,'lit',kOn&&p<.6);cls(rA,'lit',aOn&&p<.6);
    cls(tgK,'hover',inR(p,.1,.14));cls(tgA,'hover',inR(p,.22,.26));
    var ti=eo(seg(p,.3,.37)),to=seg(p,.6,.66);
    tm.style.opacity=(ti*(1-to)).toFixed(3);
    tm.style.transform='translateY('+((1-ti)*20).toFixed(1)+'px) scale('+(.97+.03*ti).toFixed(3)+')';
    cls(tmw,'hover',inR(p,.4,.44));cls(tmw,'sel',p>=.44);
    tmw.style.opacity=(1-seg(p,.53,.57)).toFixed(3);
    cls(end,'hover',inR(p,.48,.53));cls(end,'press',Math.abs(p-.53)<.01);
    var k=eo(seg(p,.54,.62));
    win.style.opacity=(1-k).toFixed(3);
    win.style.transform='scale('+(1-.07*k).toFixed(4)+')';
    var fv=seg(p,.56,.64);
    fw.style.opacity=fv.toFixed(3);
    rules.forEach(function(r,i){cls(r,'in',p>.6+i*.03)});
    txt(clk,p<.53?'wawity-app.exe: работает':'wawity-app.exe: процесса нет');
    if(fv>0){
      if(!t0)t0=now;
      var W=field.clientWidth,H=field.clientHeight,wall=W*.62-22,t=now/1000;
      pks.forEach(function(q){
        var f=((t/q.sp)+q.off)%1,y=(H/4)*(q.lane+.5),x,op=1,hit=f>.78;
        x=lerp(150,wall,Math.min(1,f/.78));
        if(hit)op=1-(f-.78)/.22;
        q.el.style.transform='translate('+x.toFixed(1)+'px,'+(y-1).toFixed(1)+'px)';
        q.el.style.opacity=op.toFixed(2);
        cls(q.el,'hit',hit);
      });
      txt(nEl,String(Math.floor(seg(p,.62,1)*1400+(now-t0)/160)).replace(/\B(?=(\d{3})+(?!\d))/g,' '));
    }else{t0=0;txt(nEl,'0')}
    cur(p,K,CL);
    captions(sc,p,[0,.14,.3,.56]);
  }});
})();

/* ---------- terminal ---------- */
(function(){
  var body=$('#termBody');if(!body)return;
  var P='<span class="p">PS C:\\&gt; </span>';
  var S=[
    {c:'wawity sub add https://sub.example.com/s/9b2e51af'},
    {o:'  <span class="g">✓</span> подписка добавлена · 11 серверов · vless, hysteria2, trojan, tuic'},
    {c:'wawity servers --ping'},
    {o:'  Helsinki №3     <span class="g">19 ms</span>\n  Frankfurt №4    <span class="g">23 ms</span>\n  Frankfurt №7    <span class="g">28 ms</span>\n  Amsterdam №2    <span class="g">41 ms</span>\n  Ashburn №1      <span class="y">112 ms</span>\n  …ещё 6'},
    {c:'wawity connect fastest'},
    {o:'  рукопожатие reality…',w:700},
    {o:'  <span class="g">✓</span> подключено · Helsinki №3 · 19 ms\n  <span class="g">✓</span> kill switch: правила в Windows Firewall'},
    {c:'wawity status --watch'}
  ];
  var html='',started=false;
  function render(extra){body.innerHTML=html+(extra||'')+'<span class="k"></span>'}
  function run(){
    if(started)return;started=true;
    if(reduced){S.forEach(function(s){html+=s.c?P+'<span class="c">'+s.c+'</span>\n':s.o+'\n'});render();return}
    (async function(){
      for(var i=0;i<S.length;i++){
        var s=S[i];
        if(s.c){
          for(var j=1;j<=s.c.length;j++){render(P+'<span class="c">'+s.c.slice(0,j)+'</span>');await sleep(22+Math.random()*40)}
          html+=P+'<span class="c">'+s.c+'</span>\n';render();await sleep(380);
        }else{html+=s.o+'\n';render();await sleep(s.w||520)}
      }
    })();
  }
  render(P);
  if('IntersectionObserver' in window){
    var o=new IntersectionObserver(function(en){if(en[0].isIntersecting){run();o.disconnect()}},{threshold:.35});
    o.observe(body);
  }else run();
})();

/* ---------- main loop ---------- */
var fword=$('.foot-word span'),foot=$('.foot');
var lastP=new Map(),dirty=true,lastY=-1;
function onResize(){fit();mqW=0;dirty=true}
window.addEventListener('resize',onResize);
fit();
if(d.fonts&&d.fonts.ready)d.fonts.ready.then(function(){dirty=true});

function frame(now){
  requestAnimationFrame(frame);
  var y=window.scrollY||d.documentElement.scrollTop,vh=window.innerHeight;
  var moved=y!==lastY;
  /* nav */
  if(moved){
    cls(nav,'scrolled',y>30);
    if(y>lastY+3&&y>vh*.9&&!mm.classList.contains('open'))nav.classList.add('hide');
    else if(y<lastY-3||y<vh*.5)nav.classList.remove('hide');
  }
  /* marquee */
  if(mq&&!reduced){
    var v=y-lastSY;lastSY=y;
    mqV+=(clamp(v,-60,60)-mqV)*.08;
    if(!mqW)mqW=mq.scrollWidth/2;
    mqX-=.6+Math.abs(mqV)*.35;
    if(mqX<=-mqW)mqX+=mqW;
    mq.style.transform='translate3d('+mqX.toFixed(1)+'px,0,0) skewX('+(-mqV*.25).toFixed(2)+'deg)';
  }
  /* scenes */
  for(var i=0;i<scenes.length;i++){
    var s=scenes[i],r=s.el.getBoundingClientRect();
    if(r.bottom<-40||r.top>vh+40)continue;
    var p=clamp(-r.top/Math.max(1,s.el.offsetHeight-vh));
    if(s.live||dirty||lastP.get(s)!==p){s.update(p,now);lastP.set(s,p)}
  }
  if(moved||dirty){
    /* scrub text */
    if(scrub){
      var sr=scrub.getBoundingClientRect(),sp=clamp((vh*.82-sr.top)/(sr.height+vh*.3)),cnt=Math.floor(sp*words.length*1.02);
      for(var w=0;w<words.length;w++)cls(words[w],'on',w<cnt);
    }
    /* footer word */
    if(fword&&foot){
      var fr=foot.getBoundingClientRect(),fp=clamp((vh-fr.top)/fr.height);
      fword.style.transform='translate3d('+((1-eo(fp))*-18).toFixed(2)+'%,0,0)';
    }
  }
  dirty=false;lastY=y;
}
requestAnimationFrame(frame);
})();
