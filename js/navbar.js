document.addEventListener('partials:loaded', () => {
  const navToggle = document.getElementById("nav-toggle");
  const navLeft = document.querySelector(".nav-left");

  navToggle.addEventListener("click", () => {
    navLeft.classList.toggle("active");
  });

  let lastScrollY = window.scrollY;
  const navbar = document.querySelector(".navigation");

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      navbar.classList.add("nav-hidden");
    } else {
      navbar.classList.remove("nav-hidden");
    }
    lastScrollY = currentScrollY;
  });
});