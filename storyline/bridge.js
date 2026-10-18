/* MeliCases -> Storyline 360 bridge
 * À charger dans un contexte où le Web Object peut communiquer avec le parent.
 * Dégradation silencieuse hors Storyline pour conserver le mode standalone.
 */
(function () {
  function player() {
    try {
      if (window.parent && typeof window.parent.GetPlayer === 'function') return window.parent.GetPlayer();
      if (typeof window.GetPlayer === 'function') return window.GetPlayer();
    } catch (_) {}
    return null;
  }

  function setVar(name, value) {
    try {
      const p = player();
      if (p && typeof p.SetVar === 'function') p.SetVar(name, value);
    } catch (_) {}
  }

  window.MeliCasesStoryline = {
    ready(seed) {
      setVar('EscapeSeed', String(seed || ''));
      setVar('EscapeSolved', 0);
      setVar('EscapeScore', 0);
      setVar('EscapeCompleted', false);
    },
    caseSolved(id, solved, total) {
      setVar('EscapeLastCase', String(id || ''));
      setVar('EscapeSolved', Number(solved || 0));
      setVar('EscapeScore', Math.round((Number(solved || 0) / Math.max(1, Number(total || 1))) * 100));
    },
    completed(seed) {
      setVar('EscapeSeed', String(seed || ''));
      setVar('EscapeSolved', 5);
      setVar('EscapeScore', 100);
      setVar('EscapeCompleted', true);
    }
  };

  // Correctifs de compatibilité du mode 3D : les menus superposés ne doivent
  // jamais intercepter les clics et le clavier reste utilisable lorsque le
  // verrouillage du pointeur est refusé (Web Object, navigateur headless, etc.).
  window.addEventListener('DOMContentLoaded', () => {
    const start = document.getElementById('start');
    const options = document.getElementById('options');
    const openOptions = document.getElementById('startOptions');
    const closeOptions = document.getElementById('closeOptions');
    if (start && options && openOptions && closeOptions) {
      let returnToStart = false;
      openOptions.addEventListener('click', () => {
        returnToStart = start.classList.contains('open');
        start.classList.remove('open');
        options.classList.add('open');
      });
      closeOptions.addEventListener('click', () => {
        options.classList.remove('open');
        if (returnToStart) start.classList.add('open');
      });
    }

    const held = new Set();
    let previous = performance.now();
    addEventListener('keydown', event => held.add(event.code));
    addEventListener('keyup', event => held.delete(event.code));
    function keyboardFallback(now) {
      const api = window.__MELI_TEST__;
      const playing = start && !start.classList.contains('open');
      const blockedByUi = ['modal', 'pause', 'options'].some(id => document.getElementById(id)?.classList.contains('open'));
      if (api && playing && !blockedByUi && !document.pointerLockElement && held.has(api.controls.forward)) {
        const dt = Math.min((now - previous) / 1000, .05);
        const speed = held.has(api.controls.run) ? 5.2 : 3.1;
        api.teleport(api.position.x, api.position.z - speed * dt);
      }
      previous = now;
      requestAnimationFrame(keyboardFallback);
    }
    requestAnimationFrame(keyboardFallback);
  });
})();
