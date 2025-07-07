// Reveal content sections on scroll
    $(document).ready(function(){
      $('.content-section').each(function(){
        var section = $(this);
        new Waypoint({
          element: section[0],
          handler: function(direction){
            if(direction === 'down'){
              section.addClass('show');
            }
          },
          offset: '85%'
        });
      });
      
      // Update progress bar on scroll
      $(window).on('scroll', function(){
        var scrollTop = $(this).scrollTop();
        var docHeight = $(document).height() - $(window).height();
        var scrollPercent = (scrollTop / docHeight) * 100;
        $('#progressBar').css('width', scrollPercent + '%');
      });
    });
    
    // Close navbar on mobile after clicking a link
    document.addEventListener("DOMContentLoaded", function(){
      let navLinks = document.querySelectorAll(".navbar-nav .nav-link");
      let bsCollapse = new bootstrap.Collapse(document.querySelector(".navbar-collapse"), { toggle: false });
      navLinks.forEach(function(link){
        link.addEventListener("click", function(){
          if(window.innerWidth < 992){
            bsCollapse.hide();
          }
        });
      });
    });
    
    // Preload first background image for parallax
    document.addEventListener('DOMContentLoaded', function() {
      const sections = document.querySelectorAll('.content-section[data-bg]');
      const parallax1 = document.getElementById('globalParallax1');
      parallax1.style.backgroundImage = "url('upscaled/eric.jpg')";
      const parallax2 = document.getElementById('globalParallax2');
      let currentActive = 1; // 1 means parallax1 is active, 2 means parallax2

      // Adjusted observer options: threshold 0.5 and a rootMargin offset (e.g., -20% from the bottom)
      const observerOptions = {
        threshold: 0.5,
        rootMargin: "0px 0px 70% 0px"
      };


const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const newBg = entry.target.getAttribute('data-bg');
      const desktopPos = entry.target.getAttribute('data-bg-pos') || 'center center';
      const mobilePos = entry.target.getAttribute('data-mobile-bg-pos') || 'center center';
      const isMobile = window.innerWidth <= 770;

      const bgPosition = isMobile ? mobilePos : desktopPos;

      let activeDiv, inactiveDiv;
      if (currentActive === 1) {
        activeDiv = parallax1;
        inactiveDiv = parallax2;
      } else {
        activeDiv = parallax2;
        inactiveDiv = parallax1;
      }

      // Only update if the inactive div doesn't already have the new background
      if (inactiveDiv.style.backgroundImage !== `url("${newBg}")`) {
        inactiveDiv.style.backgroundImage = `url('${newBg}')`;
        inactiveDiv.style.backgroundPosition = bgPosition;
        inactiveDiv.style.backgroundSize = 'cover';
        inactiveDiv.style.backgroundRepeat = 'no-repeat';
        inactiveDiv.style.opacity = 0;

        setTimeout(() => {
          activeDiv.style.opacity = 0;
          inactiveDiv.style.opacity = 1;
          currentActive = (currentActive === 1) ? 2 : 1;
        }, 100);
      }
    }
  });
}, observerOptions);

      sections.forEach(section => observer.observe(section));
    });

    // Lightbox: open modal when clicking on a gallery or recipient image
    document.querySelectorAll('.gallery-image, .recipient-image').forEach(div => {
      div.addEventListener('click', function(){
        const style = window.getComputedStyle(this);
        const bgImage = style.getPropertyValue('background-image');
        const src = bgImage.slice(5, -2);
        const caption = this.getAttribute('data-caption') || '';
        document.getElementById('lightboxImage').src = src;
        document.getElementById('lightboxCaption').innerText = caption;
        new bootstrap.Modal(document.getElementById('lightboxModal')).show();
      });
    });

  // Fixed Downward Chevron: scroll smoothly to next section and hide at page bottom.
document.getElementById('fixedChevron').addEventListener('click', function() {
  const viewportHeight = window.innerHeight;
  const currentScroll = window.scrollY;
  let nextSection = null;

  // Find the first .content-section whose top is below half the viewport from current scroll
  document.querySelectorAll('.content-section').forEach(function(sec) {
    if (sec.offsetTop > currentScroll + viewportHeight / 2 && !nextSection) {
      nextSection = sec;
    }
  });
  
  if (nextSection) {
    let target = nextSection.offsetTop;
    // If the section is shorter than the viewport, center it vertically.
    if (nextSection.offsetHeight < viewportHeight) {
      target = nextSection.offsetTop - ((viewportHeight - nextSection.offsetHeight) / 2);
    }
    window.scrollTo({ top: target, behavior: 'smooth' });
  }
});

// Hide the chevron when nearing the bottom of the page
window.addEventListener('scroll', function() {
  const chevron = document.getElementById('fixedChevron');
  // Check if we're within 100px of the bottom
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    chevron.style.opacity = 0;
  } else {
    chevron.style.opacity = 1;
  }
});