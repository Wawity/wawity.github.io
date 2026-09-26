(function(){
  'use strict';
  var scriptUrl=document.currentScript&&document.currentScript.src||location.href;
  var base=new URL('.',scriptUrl);
  function localFile(name){return new URL(name,base).href;}
  function addCss(){var link=document.createElement('link');link.rel='stylesheet';link.href=localFile('killswitch-motion.css');document.head.appendChild(link);}
  function addScene(){var js=document.createElement('script');js.src=localFile('killswitch-motion.js');document.head.appendChild(js);}
  function start(){addCss();[].slice.call(document.querySelectorAll('.hero-hole,.spl-hole')).forEach(makeHole);addScene();}
  function makeHole(canvas){
    if(!canvas||!canvas.getContext)return;
    var reduced=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    var gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,depth:false,stencil:false,powerPreference:'low-power'});if(!gl)return;
    var vert='attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}';
    var frag='precision highp float; uniform vec2 res; uniform float time; uniform vec2 drift;'+
      'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'+
      'float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}'+
      'void main(){vec2 uv=gl_FragCoord.xy/res;vec2 q=(uv-vec2(.79,.55))/vec2(res.y/res.x,1.);q-=drift*.018;'+
      'float r=length(q);float a=atan(q.y,q.x);float swirl=a+time*.075+1.7/(r+.045);'+
      'float stars=step(.9975,hash(floor(uv*vec2(420.,260.))))*.75+step(.9994,hash(floor(uv*vec2(190.,130.))+23.))*1.2;'+
      'float neb=noise(q*5.+vec2(time*.012,-time*.009))*.22+noise(q*11.-time*.018)*.08;'+
      'vec3 col=vec3(.055,.045,.09)*neb+vec3(.55,.62,.8)*stars;'+
      'float diskR=length(vec2(q.x,q.y*2.35));float band=exp(-pow((diskR-.185)*34.,2.));'+
      'float lanes=.48+.52*noise(vec2(swirl*3.2,diskR*27.-time*.9));'+
      'float temp=smoothstep(.24,.075,diskR);vec3 hot=mix(vec3(.9,.17,.045),vec3(1.,.72,.36),temp);'+
      'float dop=.55+.85*smoothstep(-.9,.85,sin(a+1.1));col+=hot*band*lanes*dop*1.35;'+
      'float ring=exp(-pow((r-.125)*155.,2.));col+=vec3(1.,.8,.58)*ring*.75;'+
      'float hole=smoothstep(.067,.052,r);col*=hole;float halo=exp(-pow((r-.23)*10.,2.))*.16;col+=vec3(.9,.23,.08)*halo;'+
      'float vign=1.-smoothstep(.3,.82,length((uv-vec2(.5,.5))*vec2(res.x/res.y,1.)));col*=.42+.58*vign;'+
      'float alpha=clamp(max(max(col.r,col.g),col.b)*1.8,0.,.94);gl_FragColor=vec4(col*alpha,alpha);}';
    function shader(type,source){var s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);return null;}return s;}
    var vs=shader(gl.VERTEX_SHADER,vert),fs=shader(gl.FRAGMENT_SHADER,frag);if(!vs||!fs)return;
    var program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;
    var buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);gl.useProgram(program);var p=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
    var uRes=gl.getUniformLocation(program,'res'),uTime=gl.getUniformLocation(program,'time'),uDrift=gl.getUniformLocation(program,'drift');
    var active=false,frame=0,last=0,clock=0,px=0,py=0,dx=0,dy=0,visible=true;
    function resize(){var dpr=Math.min(devicePixelRatio||1,1.6),w=Math.max(8,Math.round(canvas.clientWidth*dpr)),h=Math.max(8,Math.round(canvas.clientHeight*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}}
    function render(t){resize();if(!canvas.width||!canvas.height)return;dx+=(px-dx)*.025;dy+=(py-dy)*.025;gl.viewport(0,0,canvas.width,canvas.height);gl.useProgram(program);gl.uniform2f(uRes,canvas.width,canvas.height);gl.uniform1f(uTime,t);gl.uniform2f(uDrift,dx,dy);gl.drawArrays(gl.TRIANGLES,0,3);canvas.classList.add('is-live');}
    function loop(ms){if(!active)return;frame=requestAnimationFrame(loop);if(!last)last=ms;if(ms-last<32)return;clock+=Math.min(ms-last,100)/1000;last=ms;render(clock);}
    function onVisibility(){if(document.hidden||!visible){active=false;cancelAnimationFrame(frame);}else if(!reduced&&!active){active=true;last=0;frame=requestAnimationFrame(loop);}}
    function onPointer(e){px=(e.clientX/innerWidth-.5)*2;py=(e.clientY/innerHeight-.5)*2;}
    resize();if(reduced){render(14);return;}
    window.addEventListener('pointermove',onPointer,{passive:true});document.addEventListener('visibilitychange',onVisibility);
    if('IntersectionObserver'in window){var io=new IntersectionObserver(function(entries){entries.forEach(function(e){visible=e.isIntersecting;onVisibility();});},{threshold:.03});io.observe(canvas);}else{active=true;frame=requestAnimationFrame(loop);}
    window.addEventListener('resize',resize,{passive:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();