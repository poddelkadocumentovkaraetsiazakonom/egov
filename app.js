document.addEventListener("DOMContentLoaded", () => {
  const tabDoc = document.getElementById("tabDoc");
  const tabReq = document.getElementById("tabReq");
  const documentSection = document.getElementById("documentSection");
  const requisitesSection = document.getElementById("requisitesSection");

  const openAccessBtn = document.getElementById("openAccessBtn");
  const qrModal = document.getElementById("qrModal");
  const qrcodeDiv = document.getElementById("qrcode");
  const timerDiv = document.getElementById("timer");
  const shortCodeDiv = document.getElementById("shortCode");

  let timerInterval = null;

  // Переключение вкладок
  if (tabDoc && tabReq) {
    tabDoc.addEventListener("click", () => {
      tabDoc.classList.add("active");
      tabReq.classList.remove("active");
      documentSection.classList.remove("hidden");
      requisitesSection.classList.add("hidden");
    });

    tabReq.addEventListener("click", () => {
      tabReq.classList.add("active");
      tabDoc.classList.remove("active");
      requisitesSection.classList.remove("hidden");
      documentSection.classList.add("hidden");
    });
  }

  // Генерация QR-кода при нажатии "Открыть доступ"
  if (openAccessBtn) {
    openAccessBtn.addEventListener("click", () => {
      qrcodeDiv.innerHTML = "";
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();

      new QRCode(qrcodeDiv, {
        text: "https://egov.kz/check/" + randomCode,
        width: 180,
        height: 180
      });

      shortCodeDiv.textContent = randomCode;
      qrModal.classList.remove("hidden");

      let timeLeft = 300;
      updateTimerText(timeLeft);

      if (timerInterval) clearInterval(timerInterval);

      timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerText(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          qrModal.classList.add("hidden");
        }
      }, 1000);
    });
  }

  function updateTimerText(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    if (timerDiv) {
      timerDiv.textContent = `Код обновится через ${min}:${sec < 10 ? "0" : ""}${sec}`;
    }
  }

  if (qrModal) {
    qrModal.addEventListener("click", (e) => {
      if (e.target === qrModal) {
        qrModal.classList.add("hidden");
        if (timerInterval) clearInterval(timerInterval);
      }
    });
  }
});
