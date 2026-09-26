(function(){
  'use strict';
  var base=new URL('.',document.currentScript.src).href;
  var legacy=document.createElement('script');
  legacy.src='https://raw.githubusercontent.com/Wawity/wawity.github.io/ffa643f1607fe5342466de2eecab0de2ac888a6c/blackhole.js';
  legacy.async=false;
  document.head.appendChild(legacy);
  var style=document.createElement('link');
  style.rel='stylesheet';
  style.href=base+'killswitch-motion.css';
  document.head.appendChild(style);
  var scene=document.createElement('script');
  scene.src=base+'killswitch-motion.js';
  scene.async=false;
  document.head.appendChild(scene);
})();