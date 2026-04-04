document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("mainNav");
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  const navLinks = document.querySelectorAll('.navbar a[href^="#"], .site-footer a[href^="#"]');
  const revealItems = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll(".counter");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const collapseEl = document.getElementById("navbarMenu");
  const navbarCollapse =
    collapseEl && window.bootstrap ? new bootstrap.Collapse(collapseEl, { toggle: false }) : null;

  const toggleNavbarState = () => {
    const isScrolled = window.scrollY > 40;
    navbar.classList.toggle("scrolled", isScrolled);
    scrollTopBtn.classList.toggle("show", window.scrollY > 320);
  };

  const smoothScrollTo = (targetId) => {
    const target = document.querySelector(targetId);
    if (!target) return;

    const offset = navbar ? navbar.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset + 1;

    window.scrollTo({
      top,
      behavior: "smooth"
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      smoothScrollTo(href);

      if (collapseEl && collapseEl.classList.contains("show") && navbarCollapse) {
        navbarCollapse.hide();
      }
    });
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target || 0);
    const duration = 1400;
    const suffix = target === 10 ? "+" : target === 100 ? "%" : "";
    let startTimestamp = null;

    const updateValue = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * target);
      counter.textContent = `${currentValue}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(updateValue);
      } else {
        counter.textContent = `${target}${suffix}`;
      }
    };

    window.requestAnimationFrame(updateValue);
  };

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  const validators = {
    name: (value) => {
      if (!value.trim()) return "Please enter your name.";
      if (value.trim().length < 2) return "Name must be at least 2 characters.";
      return "";
    },
    email: (value) => {
      if (!value.trim()) return "Please enter your email address.";
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value.trim())) return "Please enter a valid email address.";
      return "";
    },
    phone: (value) => {
      if (!value.trim()) return "Please enter your phone number.";
      const phonePattern = /^[+\d\s().-]{7,}$/;
      if (!phonePattern.test(value.trim())) return "Please enter a valid phone number.";
      return "";
    },
    message: (value) => {
      if (!value.trim()) return "Please enter your message.";
      if (value.trim().length < 10) return "Message should be at least 10 characters.";
      return "";
    }
  };

  const showFieldError = (field, message) => {
    const errorElement = document.getElementById(`${field.id}Error`);
    field.classList.toggle("is-invalid", Boolean(message));
    if (errorElement) {
      errorElement.textContent = message;
    }
  };

  const validateField = (field) => {
    const validator = validators[field.name];
    if (!validator) return true;

    const message = validator(field.value);
    showFieldError(field, message);
    return !message;
  };

  if (contactForm) {
    const fields = Array.from(contactForm.querySelectorAll("input, textarea"));

    fields.forEach((field) => {
      field.addEventListener("input", () => validateField(field));
      field.addEventListener("blur", () => validateField(field));
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      let isValid = true;
      fields.forEach((field) => {
        const fieldValid = validateField(field);
        if (!fieldValid) isValid = false;
      });

      if (!isValid) {
        formStatus.textContent = "Please correct the highlighted fields and try again.";
        formStatus.style.color = "#c23636";
        return;
      }

      formStatus.textContent =
        "Thank you for reaching out. Your message has been validated and is ready to be sent.";
      formStatus.style.color = "#1f7a35";
      contactForm.reset();
      fields.forEach((field) => showFieldError(field, ""));
    });
  }

  toggleNavbarState();
  window.addEventListener("scroll", toggleNavbarState, { passive: true });
});
