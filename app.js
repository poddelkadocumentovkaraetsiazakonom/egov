let qrInterval = null;

document.addEventListener("DOMContentLoaded", function() {

  const tabDoc = document.getElementById("tabDoc");
  const tabReq = document.getElementById("tabReq");
  const documentSection = document.getElementById("documentSection");
  const requisitesSection = document.getElementById("requisitesSection");
  const openBtn = document.getElementById("openAccessBtn");
  const shareBtn = document.getElementById("shareBtn");

  // === Tabs ===
  if (tabDoc && tabReq) {
    tabDoc.addEventListener("click", function() {
      documentSection.classList.remove("hidden");
      requisitesSection.classList.add("hidden");
      tabDoc.classList.add("active");
      tabReq.classList.remove("active");
    });

    tabReq.addEventListener("click", function() {
      documentSection.classList.add("hidden");
      requisitesSection.classList.remove("hidden");
      tabReq.classList.add("active");
      tabDoc.classList.remove("active");
    });
  }

  // === Open QR ===
  if (openBtn) {
    openBtn.addEventListener("click", showQR);
  }

  // === Share ===
  if (shareBtn) {
    shareBtn.addEventListener("click", async function() {
      const text = `
ФИО: Зәрубаев Серікболсын Асхатұлы
ИИН: 031103551653
Дата рождения: 31.11.2003
Номер документа: 059261764
`;
      if (navigator.share) {
        await navigator.share({ title: "Реквизиты", text });
      }
    });
  }

  // === Swipe down QR modal ===
  const qrModal = document.getElementById("qrModal");
  if (qrModal) {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    qrModal.addEventListener("touchstart", (e) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    });

    qrModal.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      let diff = currentY - startY;
      if (diff > 0) qrModal.style.transform = `translateY(${diff}px)`;
    });

    qrModal.addEventListener("touchend", () => {
      let diff = currentY - startY;
      if (diff > 120) closeQR();
      qrModal.style.transform = "translateY(0)";
      isDragging = false;
    });
  }

  // =========================
  // === SAFE IMAGE ZOOM =====
  // =========================

  const img = document.getElementById("zoomImage");
  const wrapper = img ? img.parentElement : null;

  if (img && wrapper) {

    let scale = 1;
    let lastScale = 1;
    let startDistance = 0;

    let startX = 0;
    let startY = 0;
    let translateX = 0;
    let translateY = 0;

    let lastTap = 0;

    function getDistance(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function updateTransform() {
      img.style.transform =
        `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    function limitBounds() {
      const rect = wrapper.getBoundingClientRect();
      const imgW = rect.width * scale;
      const imgH = rect.height * scale;

      const maxX = (imgW - rect.width) / 2;
      const maxY = (imgH - rect.height) / 2;

      translateX = Math.max(-maxX, Math.min(maxX, translateX));
      translateY = Math.max(-maxY, Math.min(maxY, translateY));
    }

    img.addEventListener("touchstart", (e) => {

      const now = Date.now();
      if (now - lastTap < 300) {
        scale = scale > 1 ? 1 : 2.5;
        translateX = 0;
        translateY = 0;
        updateTransform();
      }
      lastTap = now;

      if (e.touches.length === 2) {
        startDistance = getDistance(e.touches);
        lastScale = scale;
      }

      if (e.touches.length === 1 && scale > 1) {
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
      }

    }, { passive: true });

    img.addEventListener("touchmove", (e) => {

      if (e.touches.length === 2) {
        e.preventDefault();
        const newDistance = getDistance(e.touches);
        scale = lastScale * (newDistance / startDistance);
        scale = Math.max(1, Math.min(scale, 4));
        limitBounds();
        updateTransform();
      }

      if (e.touches.length === 1 && scale > 1) {
        e.preventDefault();
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        limitBounds();
        updateTransform();
      }

    }, { passive: false });

    img.addEventListener("touchend", () => {
      if (scale === 1) {
        translateX = 0;
        translateY = 0;
        updateTransform();
      }
    });

  }

});


// =========================
// === QR FUNCTIONS ========
// =========================

function showQR() {
  const modal = document.getElementById("qrModal");
  modal.classList.remove("hidden");

  if (qrInterval) clearInterval(qrInterval);

  const randomCode = Math.floor(100000 + Math.random() * 900000);
  document.getElementById("shortCode").innerText = randomCode;

  document.getElementById("qrcode").innerHTML = "";

  new QRCode(document.getElementById("qrcode"), {
    text: randomCode.toString(),
    width: 220,
    height: 220
  });

  let time = 60;
  const timerEl = document.getElementById("timer");
  timerEl.innerText = "Срок действия: 01:00";

  qrInterval = setInterval(() => {
    time--;
    let seconds = time < 10 ? "0" + time : time;
    timerEl.innerText = "Срок действия: 00:" + seconds;
    if (time <= 0) closeQR();
  }, 1000);
}

function closeQR() {
  const modal = document.getElementById("qrModal");
  if (qrInterval) clearInterval(qrInterval);
  modal.classList.add("hidden");
}
