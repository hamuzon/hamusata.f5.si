// js/foldable.js
// Device Posture API sync helper (No UI elements or text added)

(function () {
  'use strict';

  function updatePosture() {
    if (window.navigator.devicePosture) {
      const type = window.navigator.devicePosture.type;
      if (type === 'folded') {
        document.documentElement.classList.add('device-folded');
      } else {
        document.documentElement.classList.remove('device-folded');
      }
    }
  }

  if (window.navigator.devicePosture) {
    updatePosture();
    window.navigator.devicePosture.addEventListener('change', updatePosture);
  }
})();
