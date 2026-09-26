/* Scroll-driven window-only Kill Switch animation. */
(function(){
  'use strict';
  function init(){
    var stage=document.querySelector('.ks-stage');
    var screen=document.querySelector('.ks-stage-fade');
    if(!stage||!screen||stage.dataset.windowMotion)return;
    stage.dataset.windowMotion='true';
    var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced)return;
    if(!window.gsap||!window.ScrollTrigger)return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(screen,
      {rotationX:13,rotationY:-12,rotationZ:1.2,scale:.9,y:52,transformOrigin:'50% 45%'},
      {rotationX:0,rotationY:0,rotationZ:0,scale:1,y:0,ease:'none',
       scrollTrigger:{trigger:stage,start:'top 78%',end:'top 18%',scrub:.8,invalidateOnRefresh:true}}
    );
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();