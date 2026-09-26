(function(){
  'use strict';
  var base=new URL('.',document.currentScript.src).href;
  function loadScene(src,fallback){
    var script=document.createElement('script');
    script.src=src;
    script.onload=function(){
      var style=document.createElement('link');
      style.rel='stylesheet';
      style.href=base+'killswitch-motion.css';
      document.head.appendChild(style);
      var scene=document.createElement('script');
      scene.src=base+'killswitch-motion.js';
      document.head.appendChild(scene);
    };
    script.onerror=function(){if(fallback)loadScene(fallback,null);};
    document.head.appendChild(script);
  }
  loadScene('https://cdn.jsdelivr.net/gh/Wawity/wawity.github.io@ffa643f1607fe5342466de2eecab0de2ac888a6c/blackhole.js','https://raw.githubusercontent.com/Wawity/wawity.github.io/ffa643f1607fe5342466de2eecab0de2ac888a6c/blackhole.js');
})();