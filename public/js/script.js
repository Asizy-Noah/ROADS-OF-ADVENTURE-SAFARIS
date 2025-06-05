document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.header');
  var topSection = document.querySelector('.top-section');
  var headerHeight = header.clientHeight;
  var lastScrollTop = 0;

  function handleScroll() {
    var scrollTop = window.scrollY || window.pageYOffset;

    if (scrollTop > 100) {
      // Scrolling down by 100px or more
      header.style.display = 'none';
    } else {
      // Scrolling less than 100px down or at the top
      header.style.display = 'block';
    }

    if (scrollTop <= lastScrollTop || scrollTop === 0) {
      // Scrolling up or at the top
      header.classList.add('scroll-up'); // Add scroll-up class
      header.style.display = 'block'; // Ensure header is displayed when scrolling up or at the top
    } else {
      // Scrolling down
      header.classList.remove('scroll-up'); // Remove scroll-up class
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
  }

  // Add scroll event listener with throttling
  var isScrolling = false;
  window.addEventListener('scroll', function () {
    if (!isScrolling) {
      window.requestAnimationFrame(function () {
        handleScroll();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });
});

/*=============== SHOW MENU ===============*/
const showMenu = (toggleId, navId) =>{
  const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId)

  toggle.addEventListener('click', () =>{
      // Add show-menu class to nav menu
      nav.classList.toggle('show-menu')

      // Add show-icon to show and hide the menu icon
      toggle.classList.toggle('show-icon')
  })
}

showMenu('nav-toggle','nav-menu')







document.addEventListener('DOMContentLoaded', function () {
    // Add click event listener for the menu button
    var menuBtn = document.querySelector('.menu .bx-menu');
    var mainNav = document.querySelector('.nav-menu');
  
    menuBtn.addEventListener('click', function () {
      // Toggle the 'active' class on .main-nav
      mainNav.classList.toggle('active');
  
      // Toggle the icon between 'bx-menu' and 'bx-x'
      menuBtn.classList.toggle('bx-menu');
      menuBtn.classList.toggle('bx-x');
    });
  
    // Add click event listener for closing the menu
    var closeBtn = document.querySelector('.menu .bx-x');
  
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        // Hide .main-nav
        mainNav.classList.remove('active');
  
        // Toggle the icon back to 'bx-menu'
        menuBtn.classList.add('bx-menu');
        menuBtn.classList.remove('bx-x');
      });
    }
});

/* Loop */
const loopContainer = document.querySelector('.loop');
    const originalText = loopContainer.querySelector('span').textContent;

    // Duplicate the text twice to create a loop
    loopContainer.innerHTML += `<span>${originalText}</span>`;
    loopContainer.innerHTML += `<span>${originalText}</span>`;

    // Adjust the animation duration based on the length of the text
    const textWidth = loopContainer.scrollWidth;
    const animationDuration = textWidth / 50; // Adjust the factor based on your preference

    // Apply the animation duration to the span elements
    const spanElements = loopContainer.querySelectorAll('span');
    spanElements.forEach(span => {
        span.style.animationDuration = `${animationDuration}s`;
    });

    /* Poping Video player */
    function openVideoPlayer() {
      // Display the video player container
      document.getElementById('videoPlayerContainer').style.display = 'block';
      }

      function closeVideoPlayer() {
          // Hide the video player container
          document.getElementById('videoPlayerContainer').style.display = 'none';
      }

      // Close the video player when clicking outside of it
      window.addEventListener('click', function (event) {
          if (event.target.classList.contains('video-player-container')) {
              closeVideoPlayer();
          }
    });

    /* carousel */
    $(document).ready(function(){
      $('.carousel').slick({
        
  centerMode: true,
  centerPadding: '60px',
  slidesToShow: 3,
  nextArrow: $('.next'),
  prevArrow: $('.prev'),
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 1
      }
    }
  ]
      });

      $('.slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        centerMode: true,
        centerPadding: '60px',
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ]
      });

      $('.venue-container').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: $('.next'),
        prevArrow: $('.prev'),
        responsive: [
        {
        breakpoint: 1024,
        settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
        }
        },
        {
        breakpoint: 900,
        settings: {
            slidesToShow: 2,
            slidesToScroll: 2
        }
        },
        {
        breakpoint: 580,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1
        }
        }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
      });
      
    });

    /* Overlay Form Adult */
    function openFormAdult() {
      document.getElementById("plan-adult").style.display = "flex";
    }
  
    function closeForm() {
      document.getElementById("plan-adult").style.display = "none";
    }
  
    function submitForm() {
      // Add your form submission logic here
  
      // After successful submission, close the form
      closeForm();
    }

    /* Overlay Form Kid */
    function openFormKid() {
      document.getElementById("plan-kid").style.display = "flex";
    }
  
    function closeForm() {
      document.getElementById("plan-kid").style.display = "none";
    }
  
    function submitForm() {
      // Add your form submission logic here
  
      // After successful submission, close the form
      closeForm();
    }

    /* Overlay Form School */
    function openFormSchool() {
      document.getElementById("plan-school").style.display = "flex";
    }
  
    function closeForm() {
      document.getElementById("plan-school").style.display = "none";
    }
  
    function submitForm() {
      // Add your form submission logic here
  
      // After successful submission, close the form
      closeForm();
    }

    
  // Add event listener for scroll
  window.addEventListener('scroll', function () {
    // Get the current scroll position
    const scrollPosition = window.scrollY;

    // Get all post-info elements
    const postInfos = document.querySelectorAll('.post-info');

    // Loop through each post-info element
    postInfos.forEach(function (postInfo, index) {
        // Get the offsetTop of the post-info element
        const postInfoOffsetTop = postInfo.offsetTop;

        // Check if the post-info element is approximately in the middle of the screen
        if (
            scrollPosition >= postInfoOffsetTop - (window.innerHeight / 2) &&
            scrollPosition < postInfoOffsetTop + postInfo.offsetHeight - (window.innerHeight / 2)
        ) {
            // Remove the 'active' class from all post-info elements
            postInfos.forEach(function (p) {
                p.classList.remove('active');
            });

            // Add the 'active' class to the current post-info element
            postInfo.classList.add('active');
        }
    });
});

/* Pop up */

window.addEventListener('scroll', function() {
  var swimmingCoursesSection = document.getElementById('swimming-courses');
  var popup = document.getElementById('popup');

  var rect = swimmingCoursesSection.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom >= 0) {
    // Show popup animation
    popup.style.display = 'block';
    // You can customize the animation here, e.g., fadeIn
    popup.classList.add('fadeIn');
  } else {
    // Hide popup animation
    popup.style.display = 'none';
    popup.classList.remove('fadeIn');
  }
});

document.getElementById('close-btn').addEventListener('click', function() {
  document.getElementById('popup').style.display = 'none';
});


      
$(document).ready(function () {
  // Initially, show only the project with data-service="travel-policy"
  $(".project").hide();
  $(".project[data-service='travel-policy']").show();

  // Click event handler for service menu items
  $(".service-menu li").click(function () {
      // Remove the 'active' class from all menu items
      $(".service-menu li").removeClass("active");

      // Add 'active' class to the clicked menu item
      $(this).addClass("active");

      // Get the service category from the 'data-service' attribute
      const serviceCategory = $(this).data("service");

      // Show projects that match the selected service category
      if (serviceCategory === "all") {
          $(".project").show();
      } else {
          // Hide all projects and then show the ones that match the category
          $(".project").hide();
          $(`.project[data-service="${serviceCategory}"]`).show();
      }
  });

  // Partner Carousel JavaScript

  // Initialize the Bootstrap carousel with options
  const partnerCarousel = document.getElementById('partnerCarousel');
  
  if (partnerCarousel) {
    // Create a Bootstrap carousel instance with custom options
    const carousel = new bootstrap.Carousel(partnerCarousel, {
      interval: 3000,      // Time between automatic cycling (in milliseconds)
      wrap: true,          // Whether the carousel should cycle continuously
      keyboard: true,      // Whether the carousel should react to keyboard events
      pause: 'hover',      // Pauses the cycling on mouseenter
      touch: true          // Whether the carousel should support left/right swipe on touchscreen devices
    });
    
    // Optional: Add event listeners for carousel events
    partnerCarousel.addEventListener('slide.bs.carousel', function() {
      // Code to execute when the carousel starts sliding
      // console.log('Carousel is sliding to the next item');
    });
    
    partnerCarousel.addEventListener('slid.bs.carousel', function() {
      // Code to execute after the carousel has completed sliding
      // console.log('Carousel has slid to the next item');
    });
    
    // Function to ensure the carousel keeps running even if user interacts with it
    function ensureAutoplay() {
      carousel.cycle();
    }
    
    // Restart autoplay after user interaction (after 10 seconds)
    partnerCarousel.addEventListener('mouseout', function() {
      setTimeout(ensureAutoplay, 10000);
    });
  }

  
});


// WhatsApp Chat Functionality
    document.addEventListener('DOMContentLoaded', function() {
        const chatInput = document.querySelector('.chat-input input');
        const chatSendBtn = document.querySelector('.chat-input button');
        const chatBody = document.querySelector('.chat-body');
        const whatsappNumber = '+256740384876'; // Replace with the desired WhatsApp number

        // Send message when button is clicked
        chatSendBtn.addEventListener('click', sendMessageToWhatsApp);

        // Send message when Enter key is pressed
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessageToWhatsApp();
            }
        });

        function sendMessageToWhatsApp() {
            const message = chatInput.value.trim();
            if (message) {
                // Encode the message for the URL
                const encodedMessage = encodeURIComponent(message);

                // Construct the WhatsApp URL
                const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

                // Open WhatsApp in a new tab/window
                window.open(whatsappURL, '_blank');

                // Optionally, you can still display the user's message in your local chat interface
                const userMessage = document.createElement('div');
                userMessage.className = 'chat-message user-message';
                userMessage.style.backgroundColor = '#f0f0f0';
                userMessage.style.marginLeft = 'auto';
                userMessage.style.textAlign = 'right';
                userMessage.textContent = message;
                chatBody.appendChild(userMessage);

                chatInput.value = '';
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        }

    // Simulate response (remains the same for local chat display)
    setTimeout(() => {
        const responseMessage = document.createElement('div');
        responseMessage.className = 'chat-message';
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 1000);
            
            // Pagination functionality
            const paginationLinks = document.querySelectorAll('.pagination .page-link');
            paginationLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all page items
                    document.querySelectorAll('.pagination .page-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    // Add active class to clicked page item
                    if (!this.parentElement.classList.contains('disabled')) {
                        this.parentElement.classList.add('active');
                        
                        // In a real application, this would load the next page of blog posts
                        // For this demo, we'll just scroll to top
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
            });
        });

        