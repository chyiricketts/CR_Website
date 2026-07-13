const navToggle = document.getElementById("nav-toggle");
const navLeft = document.querySelector(".nav-left");

navToggle.addEventListener("click", () => {
    navLeft.classList.toggle("active");
});


let lastScrollY = window.scrollY;

const navbar = document.querySelector(".navigation");

window.addEventListener("scroll", () => {

    // current position
    const currentScrollY = window.scrollY;

    // scrolling DOWN
    if(currentScrollY > lastScrollY &&
       currentScrollY > 80) {

        navbar.classList.add("nav-hidden");
    }

    // scrolling UP
    else {

        navbar.classList.remove("nav-hidden");
    }

    // update last position
    lastScrollY = currentScrollY;
});