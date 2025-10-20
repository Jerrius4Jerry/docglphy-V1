// ==== TOOL MODALS SETUP ====

// Create modal container (only once)
document.addEventListener("DOMContentLoaded", () => {
  const modalContainer = document.createElement("div");
  modalContainer.id = "toolModal";
  modalContainer.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.6); display: none; 
    justify-content: center; align-items: center; z-index: 9999;
  `;

  modalContainer.innerHTML = `
    <div id="modalContent" style="
      background: white; color: #111; border-radius: 12px;
      padding: 24px; width: 90%; max-width: 500px; position: relative;
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
    ">
      <button id="closeModal" style="
        position: absolute; top: 10px; right: 14px; 
        border: none; background: none; font-size: 1.5rem; cursor: pointer;
      ">&times;</button>
      <h2 id="modalTitle" style="color:#6a5acd; text-align:center;"></h2>
      <div id="modalBody" style="margin-top: 18px;"></div>
    </div>
  `;
  document.body.appendChild(modalContainer);

  document.getElementById("closeModal").addEventListener("click", closeModal);
});

// ==== MODAL CONTROL ====

function openModal(tool) {
  const modal = document.getElementById("toolModal");
  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");

  modal.style.display = "flex";

  switch (tool) {
    case "pdfModal":
      title.textContent = "📄 PDF Tools";
      body.innerHTML = `
        <p>Merge or Split PDF files in your browser (demo only).</p>
        <input type="file" id="pdfInput" accept="application/pdf" multiple />
        <p style="font-size:0.9rem; color:#666;">(PDF-Lib demo — processing client-side)</p>
      `;
      break;

    case "qrModal":
      title.textContent = "🔳 QR Code Generator";
      body.innerHTML = `
        <input id="qrText" placeholder="Enter text or URL" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px;" />
        <button id="generateQR" class="btn" style="margin-top:10px;">Generate QR</button>
        <div id="qrcode" style="margin-top:20px; display:flex; justify-content:center;"></div>
      `;
      document.getElementById("generateQR").onclick = () => {
  const text = document.getElementById("qrText").value.trim();
  const qrDiv = document.getElementById("qrcode");
  qrDiv.innerHTML = "";

  if (!text) {
    alert("Enter text or URL!");
    return;
  }

  new QRCode(qrDiv, { text, width: 150, height: 150 });
};

      break;

    case "pwdModal":
      title.textContent = "🔐 Password Creator";
      body.innerHTML = `
        <p>Generate a strong, random password.</p>
        <button id="generatePwd" class="btn">Generate Password</button>
        <input id="pwdOutput" readonly style="width:100%; margin-top:10px; padding:8px; border-radius:6px; border:1px solid #ccc;" />
      `;
      document.getElementById("generatePwd").onclick = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        const length = 14;
        const cryptoArray = new Uint32Array(length);
        crypto.getRandomValues(cryptoArray);
        for (let i = 0; i < length; i++) {
          password += charset[cryptoArray[i] % charset.length];
        }
        document.getElementById("pwdOutput").value = password;
      };
      break;

    case "phraseModal":
      title.textContent = "🔑 Passphrase / Key Creator";
      body.innerHTML = `
        <p>Generate a human-friendly passphrase (diceware style).</p>
        <button id="generatePhrase" class="btn">Generate Passphrase</button>
        <input id="phraseOutput" readonly style="width:100%; margin-top:10px; padding:8px; border-radius:6px; border:1px solid #ccc;" />
      `;
      document.getElementById("generatePhrase").onclick = () => {
        const words = ["orbit", "quantum", "signal", "pixel", "nova", "cipher", "galaxy", "echo", "neuron", "lumen"];
        let phrase = [];
        for (let i = 0; i < 4; i++) {
          phrase.push(words[Math.floor(Math.random() * words.length)]);
        }
        document.getElementById("phraseOutput").value = phrase.join("-");
      };
      break;

    default:
      title.textContent = "Unknown Tool";
      body.innerHTML = "<p>Something went wrong.</p>";
  }
}

function closeModal() {
  document.getElementById("toolModal").style.display = "none";
}
