
(function(){
  'use strict';
  var d=document;
  function init(){
    var posters=[].slice.call(d.querySelectorAll('.promo-poster[data-src]')),modal=d.getElementById('promoModal');
    if(!posters.length||!modal)return;
    var frame=modal.querySelector('.promo-frame'),v=d.getElementById('promoVideo'),
        amb=modal.querySelector('.promo-ambient'),ctx=amb&&amb.getContext('2d'),
        scrub=modal.querySelector('.pc-scrub'),fill=modal.querySelector('.pc-fill'),buf=modal.querySelector('.pc-buf'),
        thumb=modal.querySelector('.pc-thumb'),tip=modal.querySelector('.pc-tip'),time=modal.querySelector('.pc-time'),
        flash=modal.querySelector('.promo-flash'),chaps=modal.querySelector('.pc-chapters'),
        btnPlay=modal.querySelector('[data-act=play]'),btnMute=modal.querySelector('[data-act=mute]'),btnFs=modal.querySelector('[data-act=fs]');
    var CH=[[0,'']],current=null;
    function parseChapters(raw){return (raw||'0').split('|').map(function(c){var i=c.indexOf(' ');return i<0?[parseFloat(c)||0,'']:[parseFloat(c.slice(0,i))||0,c.slice(i+1)]})}
    function choose(card){
      if(current===card)return;
      current=card;CH=parseChapters(card.dataset.chapters);
      v.poster=card.dataset.poster||'';v.src=card.dataset.src;v.preload='auto';v.load();
      modal.setAttribute('aria-label',card.dataset.title||'Демонстрация Wawity');
      buildChapters();
    }
    var lastFocus=null,idleT=0,raf=0,dragging=false;
    function fmt(s){s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
    function dur(){return isFinite(v.duration)&&v.duration>0?v.duration:1}
    function chapterAt(t){var n=CH[0][1];for(var i=0;i<CH.length;i++)if(t>=CH[i][0])n=CH[i][1];return n}
    function buildChapters(){chaps.innerHTML='';if(!(v.duration>0))return;CH.slice(1).forEach(function(c){var s=d.createElement('span');s.style.left=(c[0]/dur()*100)+'%';chaps.appendChild(s)})}
    function paint(){
      var p=v.currentTime/dur()*100;fill.style.width=p+'%';thumb.style.left=p+'%';
      time.textContent=fmt(v.currentTime)+' / '+fmt(dur());
      if(v.buffered.length)buf.style.width=(v.buffered.end(v.buffered.length-1)/dur()*100)+'%';
    }
    var lastAmb=0;
    function loop(ts){
      paint();
      if(ctx&&v.readyState>=2&&ts-lastAmb>120){lastAmb=ts;try{ctx.drawImage(v,0,0,amb.width,amb.height)}catch(e){}}
      raf=requestAnimationFrame(loop);
    }
    function poke(){frame.classList.remove('idle');clearTimeout(idleT);if(!v.paused)idleT=setTimeout(function(){if(!dragging)frame.classList.add('idle')},2200)}
    function showFlash(){if(!flash)return;flash.innerHTML=v.paused?'<svg viewBox="0 0 24 24" fill="#fff"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>':'<svg viewBox="0 0 24 24" fill="#fff"><path d="M8 5.5v13l11-6.5z"/></svg>';flash.classList.remove('show');void flash.offsetWidth;flash.classList.add('show')}
    function toggle(){if(v.paused){v.play().catch(function(){})}else v.pause();showFlash();poke()}
    function lock(on){d.documentElement.classList.toggle('promo-lock',on);var l=window.__lenis;if(l){on?l.stop():l.start()}}
    function show(card){
      lastFocus=d.activeElement;choose(card);modal.hidden=false;void modal.offsetWidth;modal.classList.add('open');lock(true);
      v.currentTime=0;v.muted=false;frame.classList.remove('muted');
      var pr=v.play();if(pr&&pr.catch)pr.catch(function(){v.muted=true;frame.classList.add('muted');v.play().catch(function(){})});
      cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);poke();
      setTimeout(function(){btnPlay&&btnPlay.focus({preventScroll:true})},60);
    }
    function hide(){
      modal.classList.remove('open');v.pause();lock(false);cancelAnimationFrame(raf);
      if(d.fullscreenElement)d.exitFullscreen().catch(function(){});
      setTimeout(function(){if(!modal.classList.contains('open'))modal.hidden=true},500);
      if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
    }
    function seekFrom(e){var r=scrub.getBoundingClientRect(),x=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));v.currentTime=x*dur();paint()}
    posters.forEach(function(card){card.addEventListener('click',function(){show(card)})});
    modal.addEventListener('click',function(e){if(e.target.closest('[data-close]'))hide()});
    v.addEventListener('click',toggle);
    v.addEventListener('play',function(){frame.classList.add('playing');poke()});
    v.addEventListener('pause',function(){frame.classList.remove('playing');poke()});
    v.addEventListener('ended',function(){frame.classList.remove('playing','idle')});
    v.addEventListener('loadedmetadata',function(){buildChapters();paint()});
    v.addEventListener('volumechange',function(){frame.classList.toggle('muted',v.muted)});
    btnPlay.addEventListener('click',toggle);
    btnMute.addEventListener('click',function(){v.muted=!v.muted;poke()});
    btnFs.addEventListener('click',function(){if(d.fullscreenElement)d.exitFullscreen();else if(frame.requestFullscreen)frame.requestFullscreen().catch(function(){});else if(v.webkitEnterFullscreen)v.webkitEnterFullscreen()});
    frame.addEventListener('pointermove',poke);
    scrub.addEventListener('pointerdown',function(e){dragging=true;scrub.classList.add('drag');scrub.setPointerCapture(e.pointerId);seekFrom(e)});
    scrub.addEventListener('pointermove',function(e){
      var r=scrub.getBoundingClientRect(),x=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));
      tip.style.left=(x*100)+'%';tip.textContent=fmt(x*dur())+' · '+chapterAt(x*dur());
      if(dragging)seekFrom(e);
    });
    scrub.addEventListener('pointerup',function(){dragging=false;scrub.classList.remove('drag');poke()});
    d.addEventListener('keydown',function(e){
      if(!modal.classList.contains('open'))return;
      var k=e.key;
      if(k==='Escape'&&!d.fullscreenElement){e.preventDefault();hide()}
      else if(k===' '||k==='k'){if(e.target.closest&&e.target.closest('button')&&k===' ')return;e.preventDefault();toggle()}
      else if(k==='ArrowRight'){v.currentTime=Math.min(dur(),v.currentTime+5);poke()}
      else if(k==='ArrowLeft'){v.currentTime=Math.max(0,v.currentTime-5);poke()}
      else if(k==='m'){v.muted=!v.muted}
      else if(k==='f'){btnFs.click()}
      else if(k==='Tab'){var f=[].slice.call(modal.querySelectorAll('button')).filter(function(b){return b.offsetParent!==null});
        if(!f.length)return;var i=f.indexOf(d.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}
    });
    var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    var watch='IntersectionObserver' in window&&!still?new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting)en.target.play().catch(function(){});else en.target.pause()})},{threshold:.15}):null;
    posters.forEach(function(card){
      var teaser=card.querySelector('video');
      if(!teaser)return;
      if(still){teaser.removeAttribute('autoplay');teaser.pause()}
      else if(watch)watch.observe(teaser);
    });
  }
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',init);else init();
})();
