// script.js

document.addEventListener("DOMContentLoaded", function () {
  let currentPage = window.location.pathname.split("/").pop() || "index.html";

  const navLinks = document.querySelectorAll(".navbar-custom .nav-link");

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");

    if (linkHref === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  document.querySelectorAll("a.nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = this.getAttribute("href");
      window.location.href = target;
    });
  });

  const scrollToTopBtn = document.getElementById("scrollToTop");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollToTopBtn.style.display = "block";
    } else {
      scrollToTopBtn.style.display = "none";
    }
  });
  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("resize", () => {
    console.log(
      "Pencere boyutu: " + window.innerWidth + "x" + window.innerHeight
    );
  });
});

window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar-custom");
  const topAnimation = document.getElementById("top-animation");

  if (window.scrollY > 20) {
    navbar.classList.add("scrolled");
    if (topAnimation) topAnimation.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
    if (topAnimation) topAnimation.classList.remove("scrolled");
  }
});

// Custom Scrollbar
const track = document.getElementById("custom-scrollbar-track");
const thumb = document.getElementById("custom-scrollbar-thumb");

if (track && thumb) {
  let isDragging = false;
  let dragOffsetY = 0;

  window.addEventListener("scroll", function () {
    if (!isDragging) {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = window.scrollY / scrollableHeight;
      const maxTop = track.offsetHeight - thumb.offsetHeight;
      thumb.style.top = scrollPercentage * maxTop + "px";
    }
  });

  thumb.addEventListener("mousedown", function (e) {
    isDragging = true;
    dragOffsetY = e.clientY - thumb.getBoundingClientRect().top;
    e.preventDefault();
  });

  document.addEventListener("mousemove", function (e) {
    if (isDragging) {
      const trackRect = track.getBoundingClientRect();
      let newTop = e.clientY - trackRect.top - dragOffsetY;
      const maxTop = track.offsetHeight - thumb.offsetHeight;
      newTop = Math.max(0, Math.min(newTop, maxTop));
      thumb.style.top = newTop + "px";
      const scrollPercentage = newTop / maxTop;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: scrollPercentage * scrollableHeight,
        behavior: "auto",
      });
    }
  });

  document.addEventListener("mouseup", function () {
    isDragging = false;
  });

  thumb.addEventListener(
    "touchstart",
    function (e) {
      isDragging = true;
      dragOffsetY = e.touches[0].clientY - thumb.getBoundingClientRect().top;
      e.preventDefault();
    },
    { passive: false }
  );

  document.addEventListener(
    "touchmove",
    function (e) {
      if (isDragging) {
        const trackRect = track.getBoundingClientRect();
        let newTop = e.touches[0].clientY - trackRect.top - dragOffsetY;
        const maxTop = track.offsetHeight - thumb.offsetHeight;
        newTop = Math.max(0, Math.min(newTop, maxTop));
        thumb.style.top = newTop + "px";
        const scrollPercentage = newTop / maxTop;
        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({
          top: scrollPercentage * scrollableHeight,
          behavior: "auto",
        });
        e.preventDefault();
      }
    },
    { passive: false }
  );

  document.addEventListener("touchend", function () {
    isDragging = false;
  });
}
