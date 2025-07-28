/* Hamburger Menu */
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("nav ul");

document.onclick = function (e) {
  if (e.target.id !== "navbar" && !e.target.classList.contains("hamburger")) {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  }
};

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

document.querySelectorAll("nav ul li a").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  })
);
/* End of Hamburger Menu */