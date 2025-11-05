document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('back-to-top');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const contactForm = document.getElementById('contact-form');
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  let currentImageIndex = 0;
  const galleryImages = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt
  }));

  let hasCountedStats = false;

  function handleScroll() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
      backToTop.classList.add('visible');
    } else {
      header.classList.remove('scrolled');
      backToTop.classList.remove('visible');
    }

    revealSections();

    if (!hasCountedStats) {
      animateCounters();
    }
  }

  function toggleMobileMenu() {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');

    if (!isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function closeMobileMenu() {
    mobileToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  function revealSections() {
    const reveals = document.querySelectorAll('.section-reveal');
    reveals.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        element.classList.add('visible');
      }
    });
  }

  function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const statsSection = document.querySelector('.stats');

    if (!statsSection) return;

    const statsSectionTop = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (statsSectionTop < windowHeight - 100 && !hasCountedStats) {
      hasCountedStats = true;

      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const counter = setInterval(() => {
          current += step;
          if (current >= target) {
            stat.textContent = target + '+';
            clearInterval(counter);
          } else {
            stat.textContent = Math.floor(current) + '+';
          }
        }, 16);
      });
    }
  }

  function openLightbox(index) {
    currentImageIndex = index;
    lightboxImage.src = galleryImages[index].src;
    lightboxImage.alt = galleryImages[index].alt;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImageIndex].src;
    lightboxImage.alt = galleryImages[currentImageIndex].alt;
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImage.src = galleryImages[currentImageIndex].src;
    lightboxImage.alt = galleryImages[currentImageIndex].alt;
  }

  function toggleAccordion(button) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    accordionHeaders.forEach(header => {
      header.setAttribute('aria-expanded', 'false');
    });

    if (!isExpanded) {
      button.setAttribute('aria-expanded', 'true');
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function showError(input, message) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    input.classList.add('error');
    errorMessage.textContent = message;
  }

  function clearError(input) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    input.classList.remove('error');
    errorMessage.textContent = '';
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  function validateForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    let isValid = true;

    if (nameInput.value.trim() === '') {
      showError(nameInput, 'Please enter your name');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    if (emailInput.value.trim() === '') {
      showError(emailInput, 'Please enter your email');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    if (messageInput.value.trim() === '') {
      showError(messageInput, 'Please enter your message');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    return isValid;
  }

  window.addEventListener('scroll', () => {
    handleScroll();
    updateActiveNavLink();
  });

  mobileToggle.addEventListener('click', toggleMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }

      closeMobileMenu();
    });
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightboxNext.addEventListener('click', showNextImage);

  lightboxPrev.addEventListener('click', showPrevImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'ArrowLeft') {
      showPrevImage();
    }
  });

  accordionHeaders.forEach(button => {
    button.addEventListener('click', () => {
      toggleAccordion(button);
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm()) {
      const submitButton = contactForm.querySelector('.btn-submit');
      const originalText = submitButton.textContent;

      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;

      setTimeout(() => {
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        showToast('Message sent successfully! We will get back to you soon.');
      }, 1500);
    }
  });

  const formInputs = contactForm.querySelectorAll('input, textarea');
  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        clearError(input);
      }
    });
  });

  handleScroll();
  revealSections();

  /* Video behavior simplified: thumbnail + link in HTML, no JS required */
});
