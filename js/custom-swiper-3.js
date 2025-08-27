document.addEventListener('DOMContentLoaded', function () {
    if (window.Swiper) {
        new Swiper('.main-slider', {
            loop: true,
            autoplay: { delay: 4000, disableOnInteraction: false },
            effect: 'fade',
            speed: 900,
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
        });
    }
});

const de_swiper = new Swiper('.swiper', {

  autoplay: {
     delay: 3000,
     disableOnInteraction: false
   },

  // Optional parameters
  effect: "slide", // cards, coverflow, cube, fade, flip, slide 
  slidesPerView: 1,
  loop: true,
  speed: 1200,
  mousewheel: false,
  watchSlidesProgress: true,
  parallax: true,
  spaceBetween: -1,

  // If we need pagination
   pagination: {
      el: ".swiper-pagination",
      type: "fraction",
    },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  watchSlidesProgress: true

});