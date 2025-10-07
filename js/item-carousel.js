$(document).ready(function() {
  // --- Initialize Owl Carousels ---
  var sync1 = $("#sync1");
  var sync2 = $("#sync2");
  var slidesPerPage = 3; // Number of thumbnails
  var syncedSecondary = true;

  function initSync1() {
    sync1.owlCarousel({
      items: 1,
      slideSpeed: 2000,
      nav: true,
      autoplay: false,
      dots: false,
      loop: true,
      responsiveRefreshRate: 200,
      navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    }).on('changed.owl.carousel', syncPosition);
  }

  function initSync2() {
    sync2
      .on('initialized.owl.carousel', function() {
        sync2.find(".owl-item").eq(0).addClass("current");
      })
      .owlCarousel({
        items: slidesPerPage,
        dots: true,
        nav: false,
        smartSpeed: 200,
        slideSpeed: 500,
        slideBy: slidesPerPage,
        responsiveRefreshRate: 100
      }).on('changed.owl.carousel', syncPosition2);
  }

  initSync1();
  initSync2();

  function syncPosition(el) {
    var count = el.item.count - 1;
    var current = Math.round(el.item.index - (el.item.count / 2) - .5);

    if (current < 0) {
      current = count;
    }
    if (current > count) {
      current = 0;
    }

    sync2
      .find(".owl-item")
      .removeClass("current")
      .eq(current)
      .addClass("current");
    var onscreen = sync2.find('.owl-item.active').length - 1;
    var start = sync2.find('.owl-item.active').first().index();
    var end = sync2.find('.owl-item.active').last().index();

    if (current > end) {
      sync2.data('owl.carousel').to(current, 100, true);
    }
    if (current < start) {
      sync2.data('owl.carousel').to(current - onscreen, 100, true);
    }
  }

  function syncPosition2(el) {
    if (syncedSecondary) {
      var number = el.item.index;
      sync1.data('owl.carousel').to(number, 100, true);
    }
  }

  sync2.on("click", ".owl-item", function(e) {
    e.preventDefault();
    var number = $(this).index();
    sync1.data('owl.carousel').to(number, 300, true);
  });

  // --- Color Change Logic ---
  $('.atr__colors .atr__color').on('click', function() {
    // Set active class
    $('.atr__colors .atr__color').removeClass('active');
    $(this).addClass('active');

    // Get the new images from data attribute
    var newImages = $(this).data('images');

    if (newImages && Array.isArray(newImages)) {
      updateCarousel(sync1, newImages);
      updateCarousel(sync2, newImages);
    }
  });

  /**
   * Updates the images in an Owl Carousel instance without destroying it.
   * @param {jQuery} carouselInstance - The jQuery object for the carousel.
   * @param {string[]} newImages - An array of new image URLs.
   */
  function updateCarousel(carouselInstance, newImages) {
    const owl = carouselInstance.data('owl.carousel');
    if (!owl) return; // Safety check if carousel is not initialized

    const itemsCount = newImages.length;

    // Update the src for all images, including clones, by calculating the correct index.
    carouselInstance.find('.owl-item').each(function(index) {
        const $item = $(this);
        // This formula maps the DOM index (which includes prepended clones)
        // back to the original item's index (e.g., 0, 1, 2...).
        const originalItemIndex = (index - (owl.clones().length / 2) + itemsCount) % itemsCount;
        
        const newSrc = newImages[originalItemIndex];
        if (newSrc) {
            $item.find('img').attr('src', newSrc);
        }
    });

    // After updating, go to the first "real" slide instantly (without animation).
    // This is crucial to prevent the carousel from showing a cloned item as the first one.
    owl.to(0, 0, true);
  }
});