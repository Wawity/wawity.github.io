/* Scroll-driven Kill Switch storyboard for the existing page. */
(function(){
  'use strict';
  function init(){
    var stage=document.querySelector('.ks-stage');
    var screen=document.querySelector('.ks-stage-fade');
    var killRow=screen&&screen.querySelector('.ks-set-row--danger:nth-child(2)');
    if(!stage||!screen||!killRow||stage.dataset.storyReady)return;
    stage.dataset.storyReady='true';
    var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hud=document.createElement('div');
    hud.className='ks-story-hud';
    hud.setAttribute('aria-hidden','true');
    hud.innerHTML='<div class="ks-hud-top"><span class="ks-hud-live"><i></i>Kill switch / scenario</span><span>01—03</span></div><div class="ks-hud-phase"><div class="ks-hud-step"><b>Route is protected</b><span>Windows Firewall rules armed</span></div><div class="ks-hud-step"><b>Client process terminated</b><span>wawity-app.exe is no longer running</span></div><div class="ks-hud-step"><b>Traffic stays blocked</b><span>Firewall holds the line</span></div></div><div class="ks-hud-foot"><span>LEAKED DATA</span><strong>0 BYTES</strong></div><div class="ks-hud-progress"><i></i></div>' ;
    var mouse=document.createElement('span');
    mouse.className='ks-mouse';
    mouse.setAttribute('aria-hidden','true');
    mouse.innerHTML='<svg viewBox="0 0 24 30"><path d="M3 2.2v21.1l5.3-5.1 3.4 8 3.1-1.3-3.4-7.8h7.1L3 2.2z"/></svg>' ;
    var ring=document.createElement('i');
    ring.className='ks-click-ring';
    ring.setAttribute('aria-hidden','true');
    stage.appendChild(hud);
    screen.appendChild(mouse);
    screen.appendChild(ring);
    var steps=[].slice.call(hud.querySelectorAll('.ks-hud-step'));
    var progress=hud.querySelector('.ks-hud-progress i');
    if(reduced){hud.style.opacity='1';hud.style.visibility='visible';steps[0].style.opacity='1';steps[0].style.visibility='visible';return;}
    if(!window.gsap||!window.ScrollTrigger){
      if('IntersectionObserver'in window){
        var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){hud.style.opacity='1';hud.style.visibility='visible';steps[0].style.opacity='1';steps[0].style.visibility='visible';steps[0].style.transform='none';progress.style.transform='scaleX(1)';io.disconnect();}});},{threshold:.2});
        io.observe(stage);
      }
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    gsap.set(hud,{autoAlpha:0,y:12});
    gsap.set(steps,{autoAlpha:0,y:8});
    gsap.set(mouse,{autoAlpha:0,x:()=>screen.clientWidth*.13,y:()=>screen.clientHeight*.72,scale:.92});
    gsap.set(ring,{autoAlpha:0,scale:.35,x:()=>screen.clientWidth*.9,y:()=>screen.clientHeight*.405});
    gsap.set(progress,{scaleX:0});
    gsap.timeline({
      scrollTrigger:{trigger:stage,start:'top 18%',end:()=>'+='+Math.round(window.innerHeight*(window.innerWidth<820?1.4:2.05)),scrub:.65,pin:stage,pinSpacing:true,anticipatePin:1,invalidateOnRefresh:true}
    })
      .to(screen,{rotationX:0,rotationY:0,rotationZ:0,scale:1,y:0,duration:.22,ease:'none'},0)
      .to(hud,{autoAlpha:1,y:0,duration:.1,ease:'none'},0)
      .to(steps[0],{autoAlpha:1,y:0,duration:.06,ease:'none'},.08)
      .to(progress,{scaleX:.34,duration:.2,ease:'none'},.06)
      .to(mouse,{autoAlpha:1,duration:.05,ease:'none'},.15)
      .to(mouse,{x:()=>screen.clientWidth*.9,y:()=>screen.clientHeight*.405,scale:1,duration:.18,ease:'power2.inOut'},.18)
      .to(ring,{autoAlpha:.85,scale:1,duration:.08,ease:'power2.out'},.37)
      .to(killRow,{className:'ks-set-row ks-set-row--danger is-live',duration:.01},.39)
      .to(screen,{className:'ks-stage-fade is-armed',duration:.01},.4)
      .to(mouse,{scale:.82,duration:.04,ease:'power1.in'},.39)
      .to(mouse,{scale:1,duration:.07,ease:'power2.out'},.43)
      .to(ring,{autoAlpha:0,scale:1.55,duration:.17,ease:'power2.out'},.4)
      .to(steps[0],{autoAlpha:0,y:-7,duration:.06,ease:'none'},.48)
      .to(steps[1],{autoAlpha:1,y:0,duration:.08,ease:'none'},.53)
      .to(progress,{scaleX:.68,duration:.2,ease:'none'},.49)
      .to(mouse,{autoAlpha:0,duration:.05,ease:'none'},.56)
      .to(steps[1],{autoAlpha:0,y:-7,duration:.06,ease:'none'},.72)
      .to(steps[2],{autoAlpha:1,y:0,duration:.08,ease:'none'},.77)
      .to(progress,{scaleX:1,duration:.19,ease:'none'},.74)
      .to(hud,{scale:1.015,duration:.12,ease:'none'},.84)
      .to(hud,{scale:1,duration:.1,ease:'none'},.96);
    window.addEventListener('resize',function(){ScrollTrigger.refresh();},{passive:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();