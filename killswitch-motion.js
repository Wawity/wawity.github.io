/* Scroll-driven window-only Kill Switch animation. No library dependency. */
(function(){
  'use strict';
  function init(){
    var stage=document.querySelector('.ks-stage');
    var screen=document.querySelector('.ks-stage-fade');
    if(!stage||!screen||stage.dataset.windowMotion)return;
    stage.dataset.windowMotion='true';
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    var raf=0;
    function paint(){
      raf=0;
      var rect=stage.getBoundingClientRect();
      var start=window.innerHeight*.9;
      var end=window.innerHeight*.25;
      var p=Math.max(0,Math.min(1,(start-rect.top)/(start-end)));
      var inv=1-p;
      screen.style.transform='perspective(1400px) rotateX('+(12*inv)+'deg) rotateY('+(-17*inv)+'deg) rotateZ('+(1.2*inv)+'deg) scale('+(0.88+0.12*p)+') translateY('+(40*inv)+'px)';
    }
    function requestPaint(){if(!raf)raf=requestAnimationFrame(paint);}
    window.addEventListener('scroll',requestPaint,{passive:true});
    window.addEventListener('resize',requestPaint,{passive:true});
    paint();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();