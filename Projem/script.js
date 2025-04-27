window.addEventListener("load", function () {
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const stars = [];
  const clouds = [];

  /* ---------- STAR OBJECT ---------- */
  class Star {
    constructor(x, y, size, twinkleSpeed) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.twinkleSpeed = twinkleSpeed;
      this.opacity = Math.random();
      this.fade = Math.random() > 0.5 ? 1 : -1;
    }
    update() {
      this.opacity += this.fade * this.twinkleSpeed;
      if (this.opacity <= 0) {
        this.opacity = 0;
        this.fade = 1;
      } else if (this.opacity >= 1) {
        this.opacity = 1;
        this.fade = -1;
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = "#fefefe";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /* ---------- CLOUD OBJECT ---------- */
  class Cloud {
    constructor(x, y, scale, speed) {
      this.x = x;
      this.y = y;
      this.scale = scale;
      this.speed = speed;
    }
    update() {
      this.x += this.speed;
      if (this.x - 120 * this.scale > width) {
        this.x = -180 * this.scale;
      }
    }
    draw() {
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.15)";      // DARK: çok soluk beyaz
      ctx.shadowColor = "rgba(255,255,255,0.2)";      // DARK
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 40 * this.scale, 0, Math.PI * 2);
      ctx.arc(this.x - 28 * this.scale, this.y + 12 * this.scale, 28 * this.scale, 0, Math.PI * 2);
      ctx.arc(this.x + 28 * this.scale, this.y + 12 * this.scale, 28 * this.scale, 0, Math.PI * 2);
      ctx.arc(this.x, this.y - 18 * this.scale, 22 * this.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /* ---------- BACKGROUND GRADIENT ---------- */
  function drawSkyGradient() {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#0c1623");             // DARK: gece laciverti
    gradient.addColorStop(1, "#14283f");             // DARK: koyu mavi
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  /* ---------- STAR & CLOUD FACTORIES ---------- */
  function createStars() {
    stars.length = 0;
    const count = Math.floor((width * height) / 7000); // biraz fazla yıldız
    for (let i = 0; i < count; i++) {
      stars.push(
        new Star(
          Math.random() * width,
          Math.random() * height * 0.7,
          Math.random() * 1.4,
          0.008 + Math.random() * 0.02
        )
      );
    }
  }
  function createClouds() {
    clouds.length = 0;
    const count = Math.floor(width / 180);
    for (let i = 0; i < count; i++) {
      clouds.push(
        new Cloud(
          Math.random() * width,
          Math.random() * height * 0.55,
          0.65 + Math.random() * 1.1,
          0.15 + Math.random() * 0.25
        )
      );
    }
  }

  /* ---------- MAIN ANIMATION LOOP ---------- */
  function animate() {
    drawSkyGradient();
    for (const s of stars) { s.update(); s.draw(); }
    for (const c of clouds) { c.update(); c.draw(); }
    requestAnimationFrame(animate);
  }

  createStars();
  createClouds();
  animate();

  /* ---------- RESIZE HANDLER ---------- */
  window.addEventListener("resize", function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
    createClouds();
  });
});

/* ========  ARAMA, SCROLL, NAVBAR vb. ORİJİNAL KOD (değişmedi)  ======== */
/* ...   Aşağıdaki satırlar senin eski kodunla bire bir aynı   ... */

function searchWikipedia(query) {
  return fetch(
    `https://tr.wikipedia.org/w/api.php?action=opensearch&origin=*&search=${encodeURIComponent(
      query
    )}`
  ).then((res) => res.json());
}
function getWikipediaArticle(title) {
  return fetch(
    `https://tr.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&format=json&origin=*&titles=${encodeURIComponent(
      title
    )}`
  )
    .then((res) => res.json())
    .then((data) => {
      const pages = data.query.pages;
      const id = Object.keys(pages)[0];
      return pages[id].extract || "Makale bulunamadı.";
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const scrollBtn = document.getElementById("scrollToTop");
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  });
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.getElementById("searchButton").addEventListener("click", async function () {
    const q = document.getElementById("searchInput").value.trim();
    if (!q) { alert("Lütfen arama için bir kelime veya ifade gir!"); return; }

    document.getElementById("loading").style.display = "block";
    document.getElementById("result").style.display = "none";
    document.getElementById("resultHeading").style.display = "none";
    document.getElementById("articleContent").style.display = "none";
    document.getElementById("articleHeading").style.display = "none";

    try {
      const data = await searchWikipedia(q);
      const titles = data[1], urls = data[3];
      if (titles.length) {
        const title = titles[0], link = urls[0];
        document.getElementById("result").innerHTML =
          `<p><strong>Başlık:</strong> ${title}</p><p><strong>URL:</strong> <a href="${link}" target="_blank">${link}</a></p>`;
        const text = await getWikipediaArticle(title);
        document.getElementById("articleContent").textContent = text;

        document.getElementById("loading").style.display = "none";
        document.getElementById("resultHeading").style.display = "block";
        document.getElementById("result").style.display = "block";
        document.getElementById("articleHeading").style.display = "block";
        document.getElementById("articleContent").style.display = "block";
      } else {
        document.getElementById("result").textContent = "Hiç sonuç bulunamadı.";
        document.getElementById("loading").style.display = "none";
        document.getElementById("resultHeading").style.display = "block";
        document.getElementById("result").style.display = "block";
      }
    } catch (e) {
      console.error(e);
      document.getElementById("result").textContent = "Bir hata oluştu.";
      document.getElementById("loading").style.display = "none";
      document.getElementById("resultHeading").style.display = "block";
      document.getElementById("result").style.display = "block";
    }
  });

  const animated = document.querySelectorAll(".animate");
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  animated.forEach((el) => obs.observe(el));

  const overlay = document.getElementById("transition-overlay");
  setTimeout(() => { overlay.classList.add("slide-out"); }, 100);
});

document.querySelectorAll("a.nav-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const t = this.getAttribute("href");
    overlay.classList.remove("slide-out");
    overlay.classList.add("slide-in");
    setTimeout(() => { window.location.href = t; }, 600);
  });
});

document
  .querySelectorAll(".site-nav ul.menu li.dropdown > a")
  .forEach((link) => {
    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        link.parentElement.classList.toggle("open");
      }
    });
  });

const navToggle = document.getElementById("nav-toggle");
const navContainer = document.querySelector(".site-nav");
document.addEventListener("click", (e) => {
  if (navToggle.checked) {
    const inside = navContainer.contains(e.target);
    const isLink = !!e.target.closest("ul.menu li a");
    const isParca = !!e.target.closest(".site-nav ul.menu li.dropdown > a");
    if (!inside || (isLink && !isParca)) { navToggle.checked = false; }
  }
});
