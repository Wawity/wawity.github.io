(function () {
  "use strict";
  function boot() {
    var list = [].slice.call(document.querySelectorAll('.hero-hole,.spl-hole'));
    list.forEach(makeHole);
  }
  function makeHole(cv) {
    if (!cv) return;
    var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!cv.getContext) return;

    var gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
    if (!gl) return;

    var vertSrc = 'attribute vec2 spot;\nvarying vec2 vUv;\nvoid main(){vUv=spot*0.5+0.5;gl_Position=vec4(spot,0.0,1.0);}';

    var sceneSrc = 'precision highp float;\n' +
'uniform vec2 res;\n' +
'uniform float time;\n' +
'uniform vec2 drift;\n' +
'\n' +
'const float DIN = 2.6;\n' +
'const float DOUT = 9.5;\n' +
'\n' +
'float hash(vec2 s){return fract(sin(dot(s,vec2(127.1,311.7)))*43758.5453123);}\n' +
'float noise(vec2 s){\n' +
'  vec2 i=floor(s);vec2 f=fract(s);vec2 u=f*f*(3.0-2.0*f);\n' +
'  float a=hash(i);float b=hash(i+vec2(1.0,0.0));float c=hash(i+vec2(0.0,1.0));float d=hash(i+vec2(1.0,1.0));\n' +
'  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);\n' +
'}\n' +
'float fbm(vec2 s){\n' +
'  float acc=0.0;float amp=0.5;\n' +
'  for(int i=0;i<4;i++){acc+=amp*noise(s);s=s*2.03+vec2(19.7,7.3);amp*=0.5;}\n' +
'  return acc;\n' +
'}\n' +
'mat2 whirl(float a){float c=cos(a);float s=sin(a);return mat2(c,-s,s,c);}\n' +
'vec3 bbody(float k){\n' +
'  vec3 col=mix(vec3(0.45,0.08,0.02),vec3(1.0,0.42,0.12),smoothstep(0.0,0.4,k));\n' +
'  col=mix(col,vec3(1.0,0.85,0.62),smoothstep(0.4,0.75,k));\n' +
'  col=mix(col,vec3(0.85,0.90,1.0),smoothstep(0.75,1.05,k));\n' +
'  return col;\n' +
'}\n' +
'float diskGlow(vec3 hit,float rr){\n' +
'  float ang=atan(hit.z,hit.x);\n' +
'  float omega=6.0/pow(rr,1.5);\n' +
'  float shear=ang+(fract(time/36.0)-0.5)*36.0*omega;\n' +
'  float lr=log(rr);\n' +
'  float lanes=noise(vec2(shear*4.0,lr*5.0))*0.65+noise(vec2(shear*8.0+47.3,lr*11.0+9.1))*0.35;\n' +
'  float calm=smoothstep(DOUT*0.9,DOUT*0.4,rr);\n' +
'  lanes=mix(0.5,lanes,0.3+0.7*calm);\n' +
'  float fadeIn=smoothstep(DIN,DIN*1.35,rr);\n' +
'  float fadeOut=1.0-smoothstep(DOUT*0.45,DOUT*0.95,rr);\n' +
'  return (0.35+0.9*lanes)*fadeIn*fadeOut;\n' +
'}\n' +
'float hash3(vec3 s){return fract(sin(dot(s,vec3(127.1,311.7,74.7)))*43758.5453123);}\n' +
'float noise3(vec3 s){\n' +
'  vec3 i=floor(s);vec3 f=fract(s);\n' +
'  f=f*f*(3.0-2.0*f);\n' +
'  float a=hash3(i);float b=hash3(i+vec3(1.0,0.0,0.0));\n' +
'  float c=hash3(i+vec3(0.0,1.0,0.0));float d=hash3(i+vec3(1.0,1.0,0.0));\n' +
'  float e=hash3(i+vec3(0.0,0.0,1.0));float g=hash3(i+vec3(1.0,0.0,1.0));\n' +
'  float h=hash3(i+vec3(0.0,1.0,1.0));float k=hash3(i+vec3(1.0,1.0,1.0));\n' +
'  return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(h,k,f.x),f.y),f.z);\n' +
'}\n' +
'float fbm3(vec3 s){\n' +
'  float acc=0.0;float amp=0.5;\n' +
'  for(int i=0;i<5;i++){acc+=amp*noise3(s);s=s*2.03+vec3(19.7,7.3,11.1);amp*=0.5;}\n' +
'  return acc;\n' +
'}\n' +
'float starfield(vec3 dir,float cells,float cut,float sd){\n' +
'  vec3 cell=floor(dir*cells)+0.5;\n' +
'  if(hash3(cell+sd)<cut){return 0.0;}\n' +
'  vec3 jitter=vec3(hash3(cell+sd+7.3),hash3(cell+sd+3.1),hash3(cell+sd+1.7))-0.5;\n' +
'  float ang=max(dot(normalize(cell+jitter),dir),0.0);\n' +
'  return exp(-(1.0-ang)*480.0*cells*cells);\n' +
'}\n' +
'void main(){\n' +
'  vec2 sc=(gl_FragCoord.xy-res*vec2(0.80,0.56))/res.y;\n' +
'  sc=whirl(-0.22)*sc;\n' +
'  float aim=length(sc);\n' +
'  float yaw=0.18*sin(time*0.021)+drift.x*0.10;\n' +
'  float pitch=0.30+0.05*sin(time*0.013+1.7)+drift.y*0.06;\n' +
'  vec3 ro=vec3(sin(yaw)*cos(pitch),sin(pitch),cos(yaw)*cos(pitch))*24.0;\n' +
'  vec3 fwd=normalize(-ro);\n' +
'  vec3 right=normalize(cross(vec3(0.0,1.0,0.0),fwd));\n' +
'  vec3 up=cross(fwd,right);\n' +
'  vec3 rd=normalize(fwd*1.5+right*sc.x+up*sc.y);\n' +
'  vec3 p=ro;\n' +
'  vec3 v=rd;\n' +
'  vec3 hv=cross(p,v);\n' +
'  float h2=dot(hv,hv);\n' +
'  vec3 acc=vec3(0.0);\n' +
'  float trans=1.0;\n' +
'  float captured=0.0;\n' +
'  int hits=0;\n' +
'  for(int i=0;i<100;i++){\n' +
'    float r2=dot(p,p);\n' +
'    if(r2<1.0){captured=1.0;break;}\n' +
'    if(r2>1600.0){break;}\n' +
'    float r=sqrt(r2);\n' +
'    float dt=clamp(0.045*r,0.03,0.6);\n' +
'    dt=min(dt,abs(p.y)*0.9+0.05);\n' +
'    vec3 pull=-1.5*h2*p/(r2*r2*r);\n' +
'    vec3 pPrev=p;\n' +
'    v+=pull*dt;\n' +
'    p+=v*dt;\n' +
'    if(pPrev.y*p.y<0.0&&hits<3){\n' +
'      float f=pPrev.y/(pPrev.y-p.y);\n' +
'      vec3 hit=mix(pPrev,p,f);\n' +
'      float rr=length(hit.xz);\n' +
'      if(rr>DIN&&rr<DOUT){\n' +
'        bool secondary=hits>0;\n' +
'        if(!secondary||rr<DOUT*0.75){\n' +
'          float glow=diskGlow(hit,rr);\n' +
'          float temp=pow(DIN/rr,0.75);\n' +
'          vec3 tint=bbody(temp);\n' +
'          vec3 tangent=normalize(vec3(-hit.z,0.0,hit.x));\n' +
'          float beta=min(sqrt(0.5/rr),0.7);\n' +
'          float dop=1.0/max(1.0-beta*dot(tangent,normalize(v)),0.35);\n' +
'          float beam=clamp(dop*dop*dop,0.15,3.2);\n' +
'          float gred=sqrt(max(1.0-1.0/rr,0.0));\n' +
'          float w=secondary?0.42:1.0;\n' +
'          acc+=tint*glow*beam*gred*1.6*trans*w;\n' +
'          trans*=mix(1.0,0.55,clamp(glow,0.0,1.0));\n' +
'        }\n' +
'      }\n' +
'      hits++;\n' +
'    }\n' +
'  }\n' +
'  vec3 col=acc;\n' +
'  if(captured<0.5){\n' +
'    vec3 dome=normalize(v);\n' +
'    vec3 neb=vec3(0.13,0.09,0.24)*fbm3(dome*2.6)+vec3(0.05,0.08,0.18)*fbm3(dome*1.3);\n' +
'    float glint=starfield(dome,46.0,0.9945,0.0)+starfield(dome,130.0,0.997,31.7)*0.6;\n' +
'    float skyReach=1.0-smoothstep(0.18,0.46,aim);\n' +
'    col+=(neb*0.35+vec3(0.9,0.93,1.0)*glint*0.55)*skyReach*trans;\n' +
'    vec3 nebFar=vec3(0.11,0.09,0.22)*fbm3(dome*2.4+5.0)+vec3(0.05,0.07,0.16)*fbm3(dome*1.2+9.4);\n' +
'    float glintFar=starfield(dome,96.0,0.9955,11.3)+starfield(dome,224.0,0.9975,57.9)*0.6;\n' +
'    col+=(nebFar*0.55+vec3(0.9,0.93,1.0)*glintFar*0.75)*(1.0-skyReach)*trans;\n' +
'  }\n' +
'  col=1.0-exp(-col);\n' +
'  float vin=0.52+0.48*(1.0-smoothstep(0.55,1.5,aim));\n' +
'  col*=vin;\n' +
'  float lum=dot(col,vec3(0.299,0.587,0.114));\n' +
'  float alpha=clamp(lum*1.7+captured*0.9*(1.0-smoothstep(0.75,1.5,aim)),0.0,1.0);\n' +
'  gl_FragColor=vec4(col,alpha);\n' +
'}';

    var postSrc = 'precision highp float;\n' +
'uniform sampler2D tex;\n' +
'uniform sampler2D bloom;\n' +
'uniform vec2 res;\n' +
'uniform float time;\n' +
'uniform float detail;\n' +
'varying vec2 vUv;\n' +
'\n' +
'float hash(vec2 s){return fract(sin(dot(s,vec2(127.1,311.7)))*43758.5453);}\n' +
'vec3 aces(vec3 x){return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.0,1.0);}\n' +
'\n' +
'void main(){\n' +
'  vec4 base=texture2D(tex,vUv);\n' +
'  vec2 bpx=1.5/res;\n' +
'  vec3 bl=texture2D(bloom,vUv).rgb*0.4;\n' +
'  bl+=texture2D(bloom,vUv+vec2(bpx.x,bpx.y)).rgb*0.15;\n' +
'  bl+=texture2D(bloom,vUv+vec2(-bpx.x,bpx.y)).rgb*0.15;\n' +
'  bl+=texture2D(bloom,vUv+vec2(bpx.x,-bpx.y)).rgb*0.15;\n' +
'  bl+=texture2D(bloom,vUv+vec2(-bpx.x,-bpx.y)).rgb*0.15;\n' +
'  vec3 col=base.rgb+bl*(1.05+0.55*detail)*vec3(1.12,0.95,0.72);\n' +
'  col=aces(col);\n' +
'  float vig=1.0-smoothstep(0.42,1.55,length(vUv-vec2(0.62,0.52))*1.32);\n' +
'  float sweep=0.32+0.68*smoothstep(-0.14,0.60,vUv.x);\n' +
'  float shade=(0.52+0.48*vig)*sweep;\n' +
'  col*=shade;\n' +
'  col+=(hash(gl_FragCoord.xy+fract(time*0.25)*61.7)-0.5)*0.010;\n' +
'  float alpha=clamp(base.a*1.05+dot(bl,vec3(0.299,0.587,0.114))*1.4,0.0,1.0);\n' +
'  alpha*=shade;\n' +
'  gl_FragColor=vec4(col*alpha,alpha);\n' +
'}';

    var downSrc = 'precision highp float;\n' +
'uniform sampler2D tex;\n' +
'uniform vec2 res;\n' +
'uniform float cut;\n' +
'varying vec2 vUv;\n' +
'void main(){\n' +
'  vec2 px=1.0/res;\n' +
'  vec4 s=texture2D(tex,vUv)*4.0;\n' +
'  s+=texture2D(tex,vUv+vec2(px.x,px.y));\n' +
'  s+=texture2D(tex,vUv+vec2(-px.x,px.y));\n' +
'  s+=texture2D(tex,vUv+vec2(px.x,-px.y));\n' +
'  s+=texture2D(tex,vUv+vec2(-px.x,-px.y));\n' +
'  s/=8.0;\n' +
'  s.rgb=max(s.rgb-vec3(cut),vec3(0.0));\n' +
'  gl_FragColor=s;\n' +
'}';

    var upSrc = 'precision highp float;\n' +
'uniform sampler2D tex;\n' +
'uniform sampler2D add;\n' +
'uniform vec2 res;\n' +
'varying vec2 vUv;\n' +
'void main(){\n' +
'  vec2 px=1.0/res;\n' +
'  vec4 s=texture2D(tex,vUv)*4.0;\n' +
'  s+=texture2D(tex,vUv+vec2(px.x,0.0))*2.0;\n' +
'  s+=texture2D(tex,vUv-vec2(px.x,0.0))*2.0;\n' +
'  s+=texture2D(tex,vUv+vec2(0.0,px.y))*2.0;\n' +
'  s+=texture2D(tex,vUv-vec2(0.0,px.y))*2.0;\n' +
'  s+=texture2D(tex,vUv+px);\n' +
'  s+=texture2D(tex,vUv-px);\n' +
'  s+=texture2D(tex,vUv+vec2(px.x,-px.y));\n' +
'  s+=texture2D(tex,vUv+vec2(-px.x,px.y));\n' +
'  gl_FragColor=s/16.0+texture2D(add,vUv);\n' +
'}';

    var MIN_FRAME_MS = 1000 / 31, MAX_STEP_MS = 100;
    var sceneProg = null, postProg = null, downProg = null, upProg = null;
    var sceneU = {}, postU = {}, downU = {}, upU = {};
    var meshBuf = null, film = null, downs = [], ups = [];
    var texType = gl.UNSIGNED_BYTE;
    var frameId = 0, last = 0, clock = 0, dozing = true, visible = false;
    var aimX = 0, aimY = 0, driftX = 0, driftY = 0, pointerQueued = false;

    function grabLocs(prog, names) {
      var out = {}, i;
      for (i = 0; i < names.length; i++) out[names[i]] = gl.getUniformLocation(prog, names[i]);
      return out;
    }
    function compile(kind, src) {
      var s = gl.createShader(kind);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    }
    function link(frag) {
      var vs = compile(gl.VERTEX_SHADER, vertSrc);
      var fs = compile(gl.FRAGMENT_SHADER, frag);
      if (!vs || !fs) return null;
      var p = gl.createProgram();
      gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
      gl.deleteShader(vs); gl.deleteShader(fs);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { gl.deleteProgram(p); return null; }
      return p;
    }
    function bindMesh(prog) {
      var slot = gl.getAttribLocation(prog, 'spot');
      gl.enableVertexAttribArray(slot);
      gl.vertexAttribPointer(slot, 2, gl.FLOAT, false, 0, 0);
    }
    function cacheLocs() {
      sceneU = grabLocs(sceneProg, ['res', 'time', 'drift']);
      postU = grabLocs(postProg, ['tex', 'bloom', 'res', 'time', 'detail']);
      downU = grabLocs(downProg, ['tex', 'res', 'cut']);
      upU = grabLocs(upProg, ['tex', 'add', 'res']);
      gl.useProgram(postProg); gl.uniform1i(postU.tex, 0); gl.uniform1i(postU.bloom, 1);
      gl.useProgram(downProg); gl.uniform1i(downU.tex, 0);
      gl.useProgram(upProg); gl.uniform1i(upU.tex, 0); gl.uniform1i(upU.add, 1);
    }
    function makeTarget(w, h) {
      var tex = gl.createTexture(), fb = gl.createFramebuffer();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, texType, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      var ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      if (!ok) { gl.deleteTexture(tex); gl.deleteFramebuffer(fb); return null; }
      return { tex: tex, fbo: fb, w: w, h: h };
    }
    function dropTargets() {
      var list = [film].concat(downs).concat(ups), i;
      for (i = 0; i < list.length; i++) {
        if (list[i]) { gl.deleteTexture(list[i].tex); gl.deleteFramebuffer(list[i].fbo); }
      }
      film = null; downs = []; ups = [];
    }
    function buildTargets(w, h) {
      dropTargets();
      film = makeTarget(w, h);
      if (!film && texType !== gl.UNSIGNED_BYTE) {
        var hf = gl.getExtension('OES_texture_half_float');
        var hfl = gl.getExtension('OES_texture_half_float_linear');
        if (hf && hfl) { texType = gl.UNSIGNED_BYTE; film = makeTarget(w, h); }
      }
      if (!film) return;
      var dw = w, dh = h, i, t;
      for (i = 0; i < 4; i++) {
        dw = Math.max(1, dw >> 1); dh = Math.max(1, dh >> 1);
        t = makeTarget(dw, dh);
        if (!t) { dropTargets(); return; }
        downs.push(t);
      }
      for (i = 2; i >= 0; i--) {
        t = makeTarget(downs[i].w, downs[i].h);
        if (!t) { dropTargets(); return; }
        ups.push(t);
      }
    }
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(8, Math.round(cv.clientWidth * dpr));
      var h = Math.max(8, Math.round(cv.clientHeight * dpr));
      if (cv.width === w && cv.height === h && film) return;
      cv.width = w; cv.height = h;
      buildTargets(w, h);
    }
    function paint(t) {
      if (!sceneProg || !postProg || !downProg || !upProg) return;
      resize();
      var filmT = film;
      if (!filmT || downs.length < 4 || ups.length < 3) return;
      driftX += (aimX - driftX) * 0.03;
      driftY += (aimY - driftY) * 0.03;

      gl.bindFramebuffer(gl.FRAMEBUFFER, filmT.fbo);
      gl.viewport(0, 0, filmT.w, filmT.h);
      gl.useProgram(sceneProg);
      gl.uniform2f(sceneU.res, filmT.w, filmT.h);
      gl.uniform1f(sceneU.time, t);
      gl.uniform2f(sceneU.drift, driftX, driftY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.useProgram(downProg);
      var src = filmT, i, dst, add;
      for (i = 0; i < downs.length; i++) {
        dst = downs[i];
        gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
        gl.viewport(0, 0, dst.w, dst.h);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, src.tex);
        gl.uniform2f(downU.res, src.w, src.h);
        gl.uniform1f(downU.cut, i === 0 ? 0.30 : 0.0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        src = dst;
      }

      gl.useProgram(upProg);
      var carry = downs[3];
      for (i = 0; i < ups.length; i++) {
        dst = ups[i];
        add = downs[2 - i];
        gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
        gl.viewport(0, 0, dst.w, dst.h);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, carry.tex);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, add.tex);
        gl.uniform2f(upU.res, carry.w, carry.h);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        carry = dst;
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, cv.width, cv.height);
      gl.useProgram(postProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, filmT.tex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, carry.tex);
      gl.uniform2f(postU.res, cv.width, cv.height);
      gl.uniform1f(postU.time, t);
      gl.uniform1f(postU.detail, 1.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function loop(stamp) {
      if (dozing) return;
      frameId = requestAnimationFrame(loop);
      if (!last) last = stamp;
      var step = stamp - last;
      if (step < MIN_FRAME_MS) return;
      last = stamp;
      clock += Math.min(step, MAX_STEP_MS) / 1000;
      if (cv.clientWidth > 0) paint(clock);
    }
    function nap() {
      var sleep = document.hidden || !visible;
      if (sleep && !dozing) { dozing = true; cancelAnimationFrame(frameId); }
      else if (!sleep && dozing) { dozing = false; last = 0; frameId = requestAnimationFrame(loop); }
    }
    function onPointer(e) {
      if (pointerQueued) return;
      pointerQueued = true;
      requestAnimationFrame(function () {
        pointerQueued = false;
        aimX = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth - 0.5) * 2));
        aimY = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight - 0.5) * 2));
      });
    }
    function onCtxLost(e) { e.preventDefault(); cancelAnimationFrame(frameId); }
    function onCtxRestore() { if (wire()) { last = 0; frameId = requestAnimationFrame(loop); } }
    function wire() {
      film = null; downs = []; ups = [];
      sceneProg = link(sceneSrc);
      postProg = link(postSrc);
      downProg = link(downSrc);
      upProg = link(upSrc);
      if (!sceneProg || !postProg || !downProg || !upProg) return false;
      meshBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, meshBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      bindMesh(sceneProg); bindMesh(postProg); bindMesh(downProg); bindMesh(upProg);
      cacheLocs();
      var hf = gl.getExtension('OES_texture_half_float');
      var hfl = gl.getExtension('OES_texture_half_float_linear');
      texType = hf && hfl ? hf.HALF_FLOAT_OES : gl.UNSIGNED_BYTE;
      return true;
    }

    if (!wire()) return;
    cv.addEventListener('webglcontextlost', onCtxLost);
    cv.addEventListener('webglcontextrestored', onCtxRestore);

    if (reduced || !('IntersectionObserver' in window)) {
      paint(12);
      return;
    }

    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', nap);

    var io = new IntersectionObserver(function (en) {
      for (var i = 0; i < en.length; i++) {
        if (en[i].isIntersecting) {
          visible = true;
          cv.classList.add('is-live');
        } else {
          visible = false;
          cv.classList.remove('is-live');
        }
      }
      nap();
    }, { threshold: 0.05 });
    io.observe(cv);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
