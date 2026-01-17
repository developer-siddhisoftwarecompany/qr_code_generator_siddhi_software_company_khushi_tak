let qr;
let qrText = "";
let qrColor = "#008AED";
let bgColor = "#ffffff";

const qrBox = document.getElementById("qrcode");

function generateQR(text) {
  qrText = text;

  const placeholder = document.getElementById("qrPlaceholder");

  if (!text) {
    qrBox.innerHTML = "";
    qrBox.style.display = "none";
    placeholder.style.display = "block";
    return;
  }

  // ✅ Text present → show QR
  placeholder.style.display = "none";
  qrBox.style.display = "block";
  qrBox.innerHTML = "";

  qr = new QRCode(qrBox, {
    text,
    width: 350,
    height: 350,
    colorDark: qrColor,
    colorLight: bgColor
  });
}

function getBrandedCanvas() {
  const canvas = qrBox.querySelector("canvas");
  if (!canvas) return null;

  const size = canvas.width;
  const extra = 60;

  const c = document.createElement("canvas");
  c.width = size;
  c.height = size + extra;

  const ctx = c.getContext("2d");

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.drawImage(canvas, 0, 0);

  ctx.strokeStyle = "#e6e6e6";
  ctx.beginPath();
  ctx.moveTo(20, size + 10);
  ctx.lineTo(c.width - 20, size + 10);
  ctx.stroke();

  ctx.fillStyle = "#008AED";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.fillText("ToolsWala", c.width / 2, size + 35);

  return c;
}




// ---------- URL ----------
document.querySelector('#url input')
  .addEventListener("input", e =>
    generateQR(e.target.value.trim())
  );


// ---------- PDF ----------
document.querySelector('#pdf input[type="file"]')
  .addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const fileURL = URL.createObjectURL(file);
    generateQR(fileURL);
  });


// ---------- CONTACT (vCard) ----------
const contactTab = document.querySelector("#contact");
contactTab.addEventListener("input", () => {
  const inputs = contactTab.querySelectorAll("input");

  const [
    first, last, title, org,
    phone, mobile, email
  ] = [...inputs].map(i => i.value.trim());

  if (!first && !phone && !email) return;

  const vCard = `
BEGIN:VCARD
VERSION:3.0
N:${last};${first}
FN:${first} ${last}
ORG:${org}
TITLE:${title}
TEL;WORK:${phone}
TEL;CELL:${mobile}
EMAIL:${email}
END:VCARD`;

  generateQR(vCard);
});


// ---------- PLAIN TEXT ----------
document.querySelector('#text textarea')
  .addEventListener("input", e =>
    generateQR(e.target.value)
  );


// ---------- APP ----------
const appTab = document.querySelector("#app");
appTab.addEventListener("input", () => {
  const android = appTab.querySelectorAll("input")[0].value;
  const ios = appTab.querySelectorAll("input")[1].value;

  if (android) generateQR(android);
  else if (ios) generateQR(ios);
});


// ---------- SMS ----------
const smsTab = document.querySelector("#sms");
smsTab.addEventListener("input", () => {
  const phone = smsTab.querySelector("input").value;
  const msg = smsTab.querySelector("textarea").value;

  if (!phone) return;
  generateQR(`sms:${phone}?body=${msg}`);
});


// ---------- EMAIL ----------
const emailTab = document.querySelector("#email");
emailTab.addEventListener("input", () => {
  const email = emailTab.querySelector('input[type="email"]').value;
  const subject = emailTab.querySelectorAll("input")[1].value;
  const body = emailTab.querySelector("textarea").value;

  if (!email) return;
  generateQR(`mailto:${email}?subject=${subject}&body=${body}`);
});


// ---------- PHONE ----------
document.querySelector('#phone input')
  .addEventListener("input", e =>
    generateQR(`tel:${e.target.value}`)
  );

// ============================= BUTTON ACTIONS ======================================

// ---------- DOWNLOAD ----------
document.querySelector(".green").onclick = () => {
  const canvas = qrBox.querySelector("canvas");
  if (!canvas) return;

  const brandText = "ToolsWala"; // 👈 yahan apna naam

  const qrSize = canvas.width;
  const padding = 10;
  const extraHeight = 60;

  // 🆕 new canvas for download only
  const downloadCanvas = document.createElement("canvas");
  downloadCanvas.width = qrSize;
  downloadCanvas.height = qrSize + extraHeight;

  const ctx = downloadCanvas.getContext("2d");

  // background white
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);

  // original QR
  ctx.drawImage(
  canvas,
  padding,
  padding,
  qrSize - padding * 2,
  qrSize - padding * 2
);


// ---- BRANDING TEXT (bookmark style) ----
// ---------- BRAND DIVIDER ----------
ctx.strokeStyle = "#E6E6E6";   // soft divider
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(20, qrSize + 10);
ctx.lineTo(downloadCanvas.width - 20, qrSize + 10);
ctx.stroke();

// ---------- BRAND NAME ----------
ctx.fillStyle = "#008AED";    // ToolsWala blue
ctx.font = "bold 16px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

ctx.fillText(
  "ToolsWala",
  downloadCanvas.width / 2,
  qrSize + 28
);

// ---------- TAGLINE ----------
ctx.fillStyle = "#666666";    // subtle gray
ctx.font = "12px Arial";

ctx.fillText(
  "Smart QR Generator",
  downloadCanvas.width / 2,
  qrSize + 46
);

 
 // 🔽 DOWNLOAD LOGIC (SAFE)
  const dataURL = downloadCanvas.toDataURL("image/png");

  const isSafari = navigator.userAgent.includes("Safari") &&
                   !navigator.userAgent.includes("Chrome");

  if (isSafari) {
    window.open(dataURL);
  } else {
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `toolswala_qr_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};


// ---------- COPY ----------
document.querySelector(".purple").onclick = () => {

  // ✅ Safari detection
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isSafari) {
    alert("Safari users: Please use Download option");
    return; // 👈 yahin stop ho jayega
  }

  const canvas = getBrandedCanvas();
  if (!canvas) return alert("Generate QR first");

  canvas.toBlob(async (blob) => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ]);
      alert("QR copied successfully");
    } catch (e) {
      alert("Copy failed");
    }
  });
};


// ---------- SHARE ----------
document.querySelector(".blue").onclick = () => {
  if (!navigator.share) {
    alert("Share supported only on mobile devices");
    return;
  }

  const canvas = getBrandedCanvas();
  if (!canvas) return alert("Generate QR first");

  canvas.toBlob(async (blob) => {
    const file = new File([blob], "toolswala_qr.png", {
      type: "image/png"
    });

    if (!navigator.canShare || !navigator.canShare({ files: [file] })) {
      alert("Share supported only on mobile devices");
      return;
    }

    try {
      await navigator.share({
        title: "ToolsWala QR",
        text: "Scan this QR",
        files: [file]
      });
    } catch {
      console.log("Share cancelled");
    }
  });
};


// ---------- COLOR TOGGLE (Paint) ----------
// const paintBtn = document.getElementById("paintBtn");
// const colorPicker = document.getElementById("qrColorPicker");

// paintBtn.addEventListener("click", () => {
//   if (!qrText) return;        // QR nahi hai → open mat karo
//   colorPicker.click();       // 🎯 direct palette open
// });

// colorPicker.addEventListener("input", (e) => {
//   qrColor = e.target.value;
//   generateQR(qrText);        // real-time update
// });

const paintBtn = document.getElementById("paintBtn");
const palette = document.getElementById("colorPalette");

paintBtn.onclick = () => {
  palette.style.display =
    palette.style.display === "flex" ? "none" : "flex";
};

palette.querySelectorAll("span").forEach(color => {
  color.style.background = color.dataset.color;

  color.onclick = () => {
    qrColor = color.dataset.color;
    generateQR(qrText);
    palette.style.display = "none";
  };
});



const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));

    tab.classList.add("active");
    const target = document.getElementById(tab.dataset.tab);
    if (target) {
      target.classList.add("active");
    }
  });
});

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    // close all
    faqItems.forEach(i => i.classList.remove("active"));

    // open current
    item.classList.add("active");
  });
});












