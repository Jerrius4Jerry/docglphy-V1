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

  /// --- SPLIT PDF ---
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
      link.download = `page-${i + 1}.pdf`;  // ✅ Correct syntax
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

// ==== TOOL MODAL CONTROLS ====
function openToolModal(tool) {
  const modal = document.getElementById("toolModal");
  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  switch (tool) {
    case "pdfModal":
      title.textContent = "📄 PDF Tools";
      body.innerHTML = `
        <p>Perform PDF operations in your browser.</p>
        <button class="btn" onclick="mergePDFs()">Merge PDFs</button>
        <button class="btn" onclick="splitPDF()">Split PDF</button>
        <button class="btn" onclick="imageToPDF()">Image → PDF</button>
      `;
      break;

    case "qrModal":
      title.textContent = "🔳 QR Generator";
      body.innerHTML = `
        <input id="qrText" placeholder="Enter text or URL" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px;" />
        <button class="btn" onclick="generateQR()">Generate</button>
        <div id="qrcode" style="margin-top:20px;display:flex;justify-content:center;"></div>
      `;
      break;

    case "pwdModal":
      title.textContent = "🔐 Password Creator";
      body.innerHTML = `
        <p>Generate a secure random password.</p>
        <button class="btn" onclick="generatePassword()">Generate</button>
        <input id="pwdOutput" readonly style="width:100%;margin-top:10px;padding:8px;border-radius:6px;border:1px solid #ccc;" />
      `;
      break;

    case "phraseModal":
      title.textContent = "🔑 Passphrase Creator";
      body.innerHTML = `
        <button class="btn" onclick="generatePassphrase()">Generate</button>
        <input id="phraseOutput" readonly style="width:100%;margin-top:10px;padding:8px;border-radius:6px;border:1px solid #ccc;" />
      `;
      break;

    case "colorModal":
      title.textContent = "🎨 Color Extractor";
      body.innerHTML = `
        <p>Upload an image to extract its dominant colors.</p>
        <input type="file" id="colorInput" accept="image/*" />
        <div id="colorResult" style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;"></div>
      `;
      document.getElementById("colorInput").onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => extractColors(img);
      };
      break;

    case "compressModal":
      title.textContent = "🖼️ Image Compressor";
      body.innerHTML = `
        <p>Select an image to compress client-side.</p>
        <input type="file" id="compressInput" accept="image/*" />
        <button class="btn" style="margin-top:10px;" onclick="compressImage()">Compress</button>
        <div id="compressResult" style="margin-top:16px;text-align:center;"></div>
      `;
      break;

    default:
      title.textContent = "Unknown Tool";
      body.innerHTML = "<p>Something went wrong.</p>";
  }
}

function closeToolModal() {
  document.getElementById("toolModal").classList.remove("active");
  document.body.style.overflow = "auto";
}

// ==== COLOR EXTRACTOR ====
function extractColors(image) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const colors = {};
  for (let i = 0; i < data.length; i += 4) {
    const rgb = `${data[i]},${data[i+1]},${data[i+2]}`;
    colors[rgb] = (colors[rgb] || 0) + 1;
  }
  const topColors = Object.entries(colors).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const container = document.getElementById("colorResult");
  container.innerHTML = "";
  topColors.forEach(([rgb]) => {
    const div = document.createElement("div");
    div.style.cssText = `width:40px;height:40px;background:rgb(${rgb});border-radius:6px;border:1px solid #ccc;`;
    container.appendChild(div);
  });
}

// ==== IMAGE COMPRESSOR ====
function compressImage() {
  const file = document.getElementById("compressInput").files[0];
  if (!file) return alert("Please upload an image first!");
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = 0.7;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "compressed.jpg";
        link.click();
        document.getElementById("compressResult").innerHTML = `<p>✅ Image compressed successfully!</p>`;
      }, "image/jpeg", 0.7);
    };
  };
  reader.readAsDataURL(file);
}

