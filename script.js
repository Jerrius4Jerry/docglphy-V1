// ==== TOOL MODALS SETUP ====
document.addEventListener("DOMContentLoaded", () => {
  const modalContainer = document.createElement("div");
  modalContainer.id = "toolModal";
  modalContainer.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.6);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999;
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
    <p style="margin-bottom:10px;">Perform PDF operations directly in your browser (client-side only).</p>
    
    <div style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center;">
      <button id="mergePDFsBtn" class="btn">Merge PDFs</button>
      <button id="splitPDFBtn" class="btn">Split PDF</button>
      <button id="imgToPDFBtn" class="btn">Image → PDF</button>
    </div>

    <div id="pdfToolContainer" style="margin-top:18px; text-align:center;"></div>
    <p style="font-size:0.9rem; color:#666; margin-top:16px;">(Powered by PDF-Lib — all client-side)</p>
  `;

  const toolContainer = document.getElementById("pdfToolContainer");

  // --- MERGE PDFs ---
  document.getElementById("mergePDFsBtn").onclick = () => {
    toolContainer.innerHTML = `
      <input type="file" id="mergeInput" accept="application/pdf" multiple />
      <button id="doMerge" class="btn" style="margin-top:10px;">Merge</button>
    `;

    document.getElementById("doMerge").onclick = async () => {
      const files = document.getElementById("mergeInput").files;
      if (files.length < 2) return alert("Select at least two PDF files.");

      const mergedPdf = await PDFLib.PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => mergedPdf.addPage(p));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "merged.pdf";
      link.click();
    };
  };

  // --- SPLIT PDF ---
  document.getElementById("splitPDFBtn").onclick = () => {
    toolContainer.innerHTML = `
      <input type="file" id="splitInput" accept="application/pdf" />
      <button id="doSplit" class="btn" style="margin-top:10px;">Split into Pages</button>
    `;

    document.getElementById("doSplit").onclick = async () => {
      const file = document.getElementById("splitInput").files[0];
      if (!file) return alert("Select a PDF to split.");

      const bytes = await file.arrayBuffer();
      const pdf = await PDFLib.PDFDocument.load(bytes);

      for (let i = 0; i < pdf.getPageCount(); i++) {
        const newPdf = await PDFLib.PDFDocument.create();
        const [page] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(page);
        const newBytes = await newPdf.save();

        const blob = new Blob([newBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = \`page-\${i + 1}.pdf\`;
        link.click();
      }
    };
  };

  // --- IMAGE → PDF ---
  document.getElementById("imgToPDFBtn").onclick = () => {
    toolContainer.innerHTML = `
      <input type="file" id="imgInput" accept="image/*" multiple />
      <button id="doImgToPDF" class="btn" style="margin-top:10px;">Convert</button>
    `;

    document.getElementById("doImgToPDF").onclick = async () => {
      const files = document.getElementById("imgInput").files;
      if (!files.length) return alert("Select one or more images.");

      const pdfDoc = await PDFLib.PDFDocument.create();

      for (const file of files) {
        const imgBytes = await file.arrayBuffer();
        let img;
        if (file.type.includes("png")) {
          img = await pdfDoc.embedPng(imgBytes);
        } else {
          img = await pdfDoc.embedJpg(imgBytes);
        }
        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "images_to_pdf.pdf";
      link.click();
    };
  };
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
// ==== FADE IN TOOL & BLOG CARDS ====
document.addEventListener("DOMContentLoaded", () => {
  const allCards = document.querySelectorAll('.card, .blog-card');
  allCards.forEach((card, index) => {
    setTimeout(() => card.classList.add('visible'), 150 * index);
  });
});
