async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  const res = await fetch(url);
  el.outerHTML = await res.text();
}

Promise.all([
  loadPartial('#site-nav', 'partials/nav.html'),
  loadPartial('#site-footer', 'partials/footer.html')
]).then(() => {
  document.dispatchEvent(new Event('partials:loaded'));
});