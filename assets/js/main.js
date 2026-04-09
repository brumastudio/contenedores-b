/* ============================================
   Contenedores B — Main JS
   ============================================ */

(function () {
  "use strict";

  // --- Mobile menu toggle ---
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const navLinks = document.querySelectorAll(".nav-links a");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      nav.classList.toggle("open");
      const isOpen = nav.classList.contains("open");
      menuToggle.setAttribute("aria-expanded", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        nav.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // --- Header scroll effect ---
  const header = document.querySelector(".header");
  let lastScrollY = 0;

  function onScroll() {
    const scrollY = window.scrollY;
    if (header) {
      header.classList.toggle("scrolled", scrollY > 50);
    }
    lastScrollY = scrollY;
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  // --- Reveal on scroll (Intersection Observer) ---
  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll("section[id]");

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });

  // --- Testimonial slider ---
  const track = document.getElementById("testimonial-track");
  const dotsContainer = document.getElementById("testimonial-dots");
  const prevBtn = document.querySelector(".testimonial-prev");
  const nextBtn = document.querySelector(".testimonial-next");

  if (track && dotsContainer) {
    const cards = track.querySelectorAll(".testimonial-card");
    let current = 0;
    const total = cards.length;

    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "testimonial-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Testimonio ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".testimonial-dot");

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    }

    prevBtn.addEventListener("click", () => goTo(current - 1));
    nextBtn.addEventListener("click", () => goTo(current + 1));

    // Auto-advance every 6s
    let autoplay = setInterval(() => goTo(current + 1), 6000);
    const slider = track.closest(".testimonial-slider");

    function stopAutoplay() { clearInterval(autoplay); }
    function startAutoplay() {
      clearInterval(autoplay);
      autoplay = setInterval(() => goTo(current + 1), 6000);
    }

    // Pause on hover and focus
    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);
    slider.addEventListener("focusin", stopAutoplay);
    slider.addEventListener("focusout", startAutoplay);

    // Swipe support
    let touchStartX = 0;
    track.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      stopAutoplay();
    }, { passive: true });
    track.addEventListener("touchend", (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
      startAutoplay();
    }, { passive: true });
  }

  // --- Contact form ---
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    const statusEl = document.getElementById("form-status");
    const submitBtn = contactForm.querySelector(".form-submit");
    const submitLabel = contactForm.querySelector(".form-submit-label");
    const ENDPOINT = "/api/contact";

    const setStatus = (kind, text) => {
      if (!statusEl) return;
      statusEl.className = `form-status form-status--${kind}`;
      statusEl.textContent = text;
    };

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        setStatus("error", "Por favor completa todos los campos.");
        contactForm.reportValidity();
        return;
      }

      const formData = new FormData(contactForm);
      const payload = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        message: formData.get("message"),
        website: formData.get("website") || "",
      };

      submitBtn.disabled = true;
      if (submitLabel) submitLabel.textContent = "Enviando...";
      setStatus("loading", "Enviando tu mensaje...");

      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.ok) {
          setStatus("success", "¡Mensaje enviado! Te contactaremos pronto.");
          contactForm.reset();
        } else {
          throw new Error(data.error || "send_failed");
        }
      } catch (err) {
        console.error("Contact form error:", err);
        setStatus(
          "error",
          "No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos por WhatsApp."
        );
      } finally {
        submitBtn.disabled = false;
        if (submitLabel) submitLabel.textContent = "Enviar mensaje";
      }
    });
  }

  // --- Number counter animation ---
  function animateCounters() {
    const counters = document.querySelectorAll("[data-count]");
    counters.forEach((counter) => {
      const target = parseInt(counter.dataset.count, 10);
      const prefix = counter.dataset.prefix || "";
      const suffix = counter.dataset.suffix || "";
      let current = 0;
      const increment = target / 40;
      const step = () => {
        current += increment;
        if (current >= target) {
          counter.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          return;
        }
        counter.textContent = `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
        requestAnimationFrame(step);
      };
      step();
    });
  }

  // Trigger counters when hero is visible
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters();
          counterObserver.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    counterObserver.observe(heroSection);
  }
})();
