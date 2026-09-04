// Switches which canvas animation is running to match the theme:
// LightCanvas (canvas-shapes.js) for light mode, DarkCanvas
// (canvas-animate.js) for dark mode. Only one ever runs at a time.
function switchCanvasForTheme(isLight) {
  if (window.DarkCanvas) window.DarkCanvas.stop();
  if (window.LightCanvas) window.LightCanvas.stop();

  const next = isLight ? window.LightCanvas : window.DarkCanvas;
  if (next) next.start();
}

// Apply saved theme preference on every page load, and start the matching
// canvas animation. Defaults to dark (the current default) if nothing has
// been saved yet.
const savedIsLight = localStorage.getItem('theme') === 'light';
document.body.classList.toggle('light-theme', savedIsLight);
switchCanvasForTheme(savedIsLight);

// Delegated to `document` instead of `.theme-toggle` directly, because
// `.theme-toggle` lives inside the nav partial that's injected async by
// include-partials.js — binding directly here would silently attach to
// nothing, since the button doesn't exist yet at the moment this script runs.
$(document).on("click", ".theme-toggle", function () {
  // Only animate from the first real toggle onward - never on page load.
  document.body.classList.add('theme-transition');
  $("body").toggleClass("light-theme");
  const isLight = document.body.classList.contains('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  switchCanvasForTheme(isLight);
});
