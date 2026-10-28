// Run the canvas animation that matches the theme
function switchCanvasForTheme(isLight) {
  if (window.DarkCanvas) window.DarkCanvas.stop();
  if (window.LightCanvas) window.LightCanvas.stop();

  const next = isLight ? window.LightCanvas : window.DarkCanvas;
  if (next) next.start();
}

// Load saved theme (defaults to light)
const savedIsLight = localStorage.getItem('theme') !== 'dark';
document.body.classList.toggle('light-theme', savedIsLight);
switchCanvasForTheme(savedIsLight);

// Theme toggle (the button is loaded with the nav partial)
$(document).on("click", ".theme-toggle", function () {
  document.body.classList.add('theme-transition');
  $("body").toggleClass("light-theme");
  const isLight = document.body.classList.contains('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  switchCanvasForTheme(isLight);
});
