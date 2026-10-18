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
})();
