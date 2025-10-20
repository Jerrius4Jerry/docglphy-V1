function showSection(sectionId) {
    document.querySelectorAll('.tool-section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

function generateQR() {
    const qrDiv = document.getElementById("qrcode");
    qrDiv.innerHTML = "";
    const text = document.getElementById("qrInput").value;
    if (text.trim() !== "") {
        new QRCode(qrDiv, { text: text, width: 128, height: 128 });
    } else {
        qrDiv.innerHTML = "<p>Please enter text or a URL.</p>";
    }
}

function generatePassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById("passwordOutput").textContent = password;
}
