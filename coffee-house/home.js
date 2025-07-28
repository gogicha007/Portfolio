/* Carousel */
const prev = document.querySelector("#prev");
const next = document.querySelector("#next");

const track = document.querySelector(".slider-outer");
const slides = document.querySelectorAll(".slider-inner");
const dots = document.querySelectorAll(".dot");

const mediaQueryList = window.matchMedia("(max-width: 750px)");

let sliderWidth = window.matchMedia("(max-width: 750px)").matches ? 348 : 480;
let index = 0;

mediaQueryList.addEventListener("change", screenTest);

function screenTest(e) {
  sliderWidth = e.matches ? 348 : 480;
  moveSlide(index);
}

Array.from(slides).map((slide) => {
  slide.onmouseenter = (event) => {
    dots[index].style.animationPlayState = "paused";
  };
  slide.onmouseleave = (event) => {
    dots[index].style.animationPlayState = "running";
  };
});

activateDot(index);

next.addEventListener("click", () => {
  moveRight();
  currentSlide(index);
});

prev.addEventListener("click", () => {
  moveLeft();
  currentSlide(index);
});

function moveRight() {
  index === 2 ? (index = 0) : index++;
}
function moveLeft() {
  index === 0 ? (index = 2) : index--;
}
function currentSlide(n) {
  moveSlide((index = n));
  activateDot(n);
}

function moveSlide(index) {
  track.style.transform = `translateX(-${index * sliderWidth}px)`;
}

function activateDot(index) {
  Array.from(dots).map((dot) => dot.classList.remove("active-dot"));
  dots[index].classList.add("active-dot");
  dots[index].onanimationend = (event) => {
    {
      index === 2 ? (index = 0) : index++;
    }
    currentSlide(index);
  };
}
/* SWIPE */
let touchstartX;
let touchendX;
Array.from(slides).map((slide) => {
  slide.addEventListener(
    "touchstart",
    function (event) {
      touchstartX = event.changedTouches[0].screenX;
      dots[index].style.animationPlayState = "paused";
    },
    { passive: true }
  );

  slide.addEventListener(
    "touchend",
    function (event) {
      touchendX = event.changedTouches[0].screenX;
      dots[index].style.animationPlayState = "running";
      handleGesture();
    },
    { passive: true }
  );
});

function handleGesture() {
  if (touchendX < touchstartX) {
    moveRight();
    currentSlide(index);
  }
  if (touchendX > touchstartX) {
    moveLeft();
    currentSlide(index);
  }
}
