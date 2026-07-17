/* ============================================================
   DocuClerk, features.js
   Feature explorer: click a feature in the nav to reveal its panel.
   ============================================================ */

'use strict';

(function () {
  function init() {
    const btns = [...document.querySelectorAll('.feat-btn')];
    if (!btns.length) return;
    const panels = [...document.querySelectorAll('.feat-panel')];

    const show = (id) => {
      btns.forEach(b => b.classList.toggle('active', b.dataset.feat === id));
      panels.forEach(p => p.classList.toggle('active', p.dataset.feat === id));
    };

    btns.forEach(b => {
      b.addEventListener('click', () => show(b.dataset.feat));
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
