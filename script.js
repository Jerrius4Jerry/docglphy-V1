// Show specific tool section
function showSection(sectionId) {
  document.querySelectorAll('.tool-section').forEach(sec => sec.classList.add('hidden'));
  document.getElementById(sectionId).classList.remove('hidden');
}

// QR Code Generator
function generateQR() {
  const qrDiv = document.getElementById("qrcode");
  qrDiv.innerHTML = "";
  const text = document.getElementById("qrInput").value.trim();

  if (text) {
    new QRCode(qrDiv, {
      text: text,
      width: 128,
      height: 128
    });
  } else {
    qrDiv.innerHTML = "<p>Please enter text or a URL.</p>";
  }
}

// Password Generator
function generatePassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  document.getElementById("passwordOutput").textContent = password;
}

// 🔐 Passphrase / Key Generator
function generatePassphrase() {
  const words = [
    "sun", "moon", "ocean", "sky", "river", "stone", "dream", "light", "wind", "forest",
    "spark", "fire", "echo", "storm", "cloud", "crystal", "shadow", "leaf", "ember", "wave"
  ];
  let phrase = [];
  for (let i = 0; i < 4; i++) {
    phrase.push(words[Math.floor(Math.random() * words.length)]);
  }

  const number = Math.floor(Math.random() * 100);
  const symbol = "!@#$%^&*"[Math.floor(Math.random() * 8)];
  const key = phrase.join("-") + number + symbol;

  document.getElementById("passphraseOutput").textContent = key;
}

// 🪄 Fade-up Animation using IntersectionObserver
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".card, .blog-card").forEach(el => observer.observe(el));
});
