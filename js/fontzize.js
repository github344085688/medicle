'use strict';
(function(doc, win) {
     var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function() {
      var clientWidth = docEl.clientWidth;
      if(!clientWidth) return;
      if(clientWidth<750){
        docEl.style.fontSize = 30 * (clientWidth /750) + 'px';
      }else {
        docEl.style.fontSize = 30 + 'px';
      }
  };
  if(!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
function stopTouchendPropagationAfterScroll() {
  var locked = false;
  window.addEventListener('touchmove', function(ev) {
    locked || (locked = true, window.addEventListener('touchend', stopTouchendPropagation, true));
  }, true);

  function stopTouchendPropagation(ev) {
    ev.stopPropagation();
    window.removeEventListener('touchend', stopTouchendPropagation, true);
    locked = false;
  }
}

