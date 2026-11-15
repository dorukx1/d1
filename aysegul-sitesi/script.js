// 1. SMOOTH SCROLL BUTTONS
document.querySelectorAll("[data-scroll]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(btn.dataset.scroll);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// 2. THEME TOGGLE (GECE / GÜNDÜZ)
const themeToggle = document.getElementById("themeToggle");
const htmlEl = document.documentElement;

themeToggle.addEventListener("click", () => {
  const isDark = htmlEl.getAttribute("data-theme") === "dark";
  const nextTheme = isDark ? "light" : "dark";
  htmlEl.setAttribute("data-theme", nextTheme);
  themeToggle.textContent = nextTheme === "dark" ? "🌙 Gece Modu" : "☀️ Şafak Modu";
});

// 3. ETYMOLOGY TABS
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    tabButtons.forEach((b) => {
      b.classList.toggle("active", b === btn);
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });
    tabPanels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === `panel-${target}`);
    });
  });
});

// 4. WEB AUDIO SYNTH FOR SYLLABLES & MELODY
let audioCtx = null;

function playTone(freq, duration = 0.45) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (!audioCtx) audioCtx = new AudioContextClass();
  if (audioCtx.state === "suspended") audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.16, audioCtx.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

const syllableBtns = document.querySelectorAll(".syllable-btn");
const syllableInfo = document.getElementById("syllableInfo");

syllableBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const freq = parseFloat(btn.dataset.note);
    playTone(freq, 0.55);
    syllableInfo.textContent = btn.dataset.info;
    btn.classList.add("playing");
    setTimeout(() => btn.classList.remove("playing"), 420);
  });
});

document.getElementById("playNameMelody").addEventListener("click", () => {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playTone(freq, 0.5);
      if (syllableBtns[idx]) {
        syllableBtns[idx].classList.add("playing");
        setTimeout(() => syllableBtns[idx].classList.remove("playing"), 360);
      }
    }, idx * 240);
  });
});

// 5. LETTER ACROSTIC EXPLORER
const letterData = {
  A: {
    title: "Asalet ve Aydınlık",
    desc: "Girdiği ortama ışık ve duru bir enerji katan başlangıç harfi."
  },
  Y: {
    title: "Yürektenlik",
    desc: "Samimiyeti, içtenliği ve sıcak dostluğu temsil eder."
  },
  Ş: {
    title: "Şefkat ve Neşe",
    desc: "Sesindeki yumuşaklıkla isme zarafet ve huzur katar."
  },
  E: {
    title: "Estetik Bakış",
    desc: "Detaylarda güzelliği görebilen ince ruhun simgesi."
  },
  G: {
    title: "Gülümseme ve Zarafet",
    desc: "İsmin ikinci yarısını başlatan, bahar tazeliği taşıyan harf."
  },
  Ü: {
    title: "Ümit ve Özgünlük",
    desc: "Türkçenin ince ünlüsüyle isme melodik bir derinlik verir."
  },
  L: {
    title: "Lütuf ve Kalıcılık",
    desc: "Akıcı bir finalle hafızalarda iz bırakan son dokunuş."
  }
};

const letterBtns = document.querySelectorAll(".letter-btn");
const letterDisplay = document.getElementById("letterDisplay");
const revealAllBtn = document.getElementById("revealAllLetters");
let showingAll = false;

function renderSingleLetter(letter) {
  const info = letterData[letter];
  letterDisplay.innerHTML = `
    <span class="letter-badge">${letter}</span>
    <div>
      <strong>${info.title}</strong>
      <p>${info.desc}</p>
    </div>
  `;
}

letterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    showingAll = false;
    revealAllBtn.textContent = "📜 Tüm Akrostişi Göster";
    letterBtns.forEach((b) => b.classList.toggle("active", b === btn));
    renderSingleLetter(btn.dataset.letter);
  });
});

revealAllBtn.addEventListener("click", () => {
  showingAll = !showingAll;
  if (showingAll) {
    revealAllBtn.textContent = "🔙 Tek Harfe Dön";
    letterBtns.forEach((b) => b.classList.remove("active"));
    const items = Object.entries(letterData)
      .map(([ch, val]) => `<div><strong>${ch}</strong> — ${val.title}</div>`)
      .join("");
    letterDisplay.innerHTML = `<div class="acrostic-list">${items}</div>`;
  } else {
    revealAllBtn.textContent = "📜 Tüm Akrostişi Göster";
    letterBtns[0].classList.add("active");
    renderSingleLetter("A");
  }
});

// 6. QUOTE GENERATOR & COPY
const quotes = [
  "“Hayatın canlılığını (Ayşe) ve baharın zarafetini (Gül) aynı isimde taşıyan nadide bir imza.”",
  "“Ayşegül: Dirlik ve neşeyle açan, solmayan bir gülün adı.”",
  "“İki kadim dilin en güzel iki kelimesi, Türkçenin ezgisinde ‘Ayşegül’ diye buluşur.”",
  "“Hem yaşam enerjisi kadar güçlü, hem gül yaprağı kadar ince bir anlam.”",
  "“Adında hem hayatın kendisi hem de hayatın en güzel çiçeği saklı.”"
];

const quoteBox = document.getElementById("quoteBox");
const copyToast = document.getElementById("copyToast");
let currentQuoteIdx = 0;

document.getElementById("newQuoteBtn").addEventListener("click", () => {
  let nextIdx;
  do {
    nextIdx = Math.floor(Math.random() * quotes.length);
  } while (nextIdx === currentQuoteIdx && quotes.length > 1);
  currentQuoteIdx = nextIdx;
  quoteBox.textContent = quotes[currentQuoteIdx];
  copyToast.textContent = "";
});

document.getElementById("copyQuoteBtn").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(quoteBox.textContent);
    copyToast.textContent = "✓ Panoya kopyalandı!";
    setTimeout(() => {
      copyToast.textContent = "";
    }, 2200);
  } catch {
    copyToast.textContent = "Kopyalama için metni seçebilirsiniz.";
  }
});

// 7. FLOATING ROSE PETALS CANVAS + BURST BUTTON
const canvas = document.getElementById("petalCanvas");
const ctx = canvas.getContext("2d");
let petals = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createPetal(burst = false) {
  return {
    x: burst ? canvas.width * (0.2 + Math.random() * 0.6) : Math.random() * canvas.width,
    y: burst ? -10 - Math.random() * 80 : Math.random() * canvas.height,
    size: 5 + Math.random() * 7,
    speedY: burst ? 2.2 + Math.random() * 2.5 : 0.45 + Math.random() * 0.9,
    speedX: (Math.random() - 0.5) * (burst ? 3.2 : 0.7),
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.04,
    alpha: 0.25 + Math.random() * 0.45,
    hue: Math.random() > 0.25 ? "255, 77, 121" : "229, 193, 88"
  };
}

for (let i = 0; i < 26; i++) {
  petals.push(createPetal(false));
}

function animatePetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = petals.length - 1; i >= 0; i--) {
    const p = petals[i];
    p.y += p.speedY;
    p.x += p.speedX + Math.sin(p.y * 0.015) * 0.35;
    p.angle += p.spin;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.fillStyle = `rgba(${p.hue}, ${p.alpha})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (p.y > canvas.height + 20) {
      if (petals.length > 30) {
        petals.splice(i, 1);
      } else {
        petals[i] = createPetal(false);
        petals[i].y = -15;
      }
    }
  }
  requestAnimationFrame(animatePetals);
}
animatePetals();

document.getElementById("burstBtn").addEventListener("click", () => {
  for (let i = 0; i < 45; i++) {
    petals.push(createPetal(true));
  }
  playTone(659.25, 0.35);
});
