const birthdayValue = "2026-10-25";
const message = document.querySelector("#message");

const fields = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds")
};

const bogotaDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Bogota",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hourCycle: "h23"
});

function getBogotaDateParts(date) {
  return Object.fromEntries(
    bogotaDateFormatter.formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)])
  );
}

function getBogotaMidnightTimestamp(year, month, day) {
  const targetUtc = Date.UTC(year, month, day);
  let timestamp = targetUtc;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const parts = getBogotaDateParts(new Date(timestamp));
    const representedUtc = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second
    );
    timestamp += targetUtc - representedUtc;
  }

  return timestamp;
}

function nextBirthday(month, day, now = new Date()) {
  const today = getBogotaDateParts(now);
  const isToday = today.month === month + 1 && today.day === day;
  let target = getBogotaMidnightTimestamp(today.year, month, day);

  if (!isToday && target < now.getTime()) {
    target = getBogotaMidnightTimestamp(today.year + 1, month, day);
  }

  return { target, isToday };
}

function updateCountdown() {
  const [, month, day] = birthdayValue.split("-").map(Number);
  const now = new Date();
  const { target, isToday } = nextBirthday(month - 1, day, now);

  let remaining = Math.max(0, target - now.getTime());
  const days = Math.floor(remaining / 86400000);
  remaining %= 86400000;
  const hours = Math.floor(remaining / 3600000);
  remaining %= 3600000;
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  fields.days.textContent = String(days).padStart(2, "0");
  fields.hours.textContent = String(hours).padStart(2, "0");
  fields.minutes.textContent = String(minutes).padStart(2, "0");
  fields.seconds.textContent = String(seconds).padStart(2, "0");

  if (isToday) {
    message.innerHTML = '<span class="party" aria-hidden="true">🎂</span><p>¡Feliz cumpleaños! Que tengas un día increíble <span class="heart">♥</span></p>';
  } else {
    message.innerHTML = '<span class="party" aria-hidden="true">🎉</span><p>¡Tu día especial se acerca! <span class="heart">♥</span></p>';
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

const imageModal = document.querySelector("#image-modal");
const startJourneyButton = document.querySelector("#start-space-journey");
const modalCloseButton = imageModal.querySelector(".image-modal__close");
const modalImage = imageModal.querySelector(".image-modal__image");
const modalProgress = imageModal.querySelector(".image-modal__progress");
const modalNextButton = imageModal.querySelector(".image-modal__next");
const modalSlides = imageModal.querySelector(".image-modal__slides");
const modalFinalMessage = imageModal.querySelector(".image-modal__final");
const modalImages = [
  ...Array.from({ length: 6 }, (_, index) => `img/${index + 1}.jpeg`),
  ...Array.from({ length: 21 }, (_, index) => `img/${index + 9}.jpeg`),
  "img/30.JPG",
  "img/31.JPG",
  "img/32.JPG",
  ...Array.from({ length: 4 }, (_, index) => `img/${index + 33}.jpg`),
  "img/penultima.jpeg",
  "img/final.jpeg"
];
let previousBodyOverflow = "";
let returnFocusTo = null;
let currentImageIndex = 0;

function showImage(index) {
  currentImageIndex = index;
  const imagePath = modalImages[currentImageIndex];
  const imageName = imagePath.match(/(\d+|penultima|final)\.(?:jpe?g)$/i)[1];
  modalImage.src = imagePath;
  modalImage.alt = `Recuerdo especial, foto ${imageName}`;
  modalProgress.textContent = `Foto ${imageName} · ${currentImageIndex + 1} de ${modalImages.length}`;
  modalNextButton.textContent = currentImageIndex === modalImages.length - 1
    ? "Ver mensaje"
    : "Siguiente";
}

function openImageModal() {
  showImage(0);
  modalSlides.hidden = false;
  modalFinalMessage.hidden = true;
  imageModal.setAttribute("aria-labelledby", "journey-progress");
  returnFocusTo = document.activeElement;
  previousBodyOverflow = document.body.style.overflow;
  imageModal.hidden = false;
  imageModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalCloseButton.focus();
}

function closeImageModal() {
  if (imageModal.hidden) {
    return;
  }

  imageModal.hidden = true;
  imageModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = previousBodyOverflow;

  if (returnFocusTo && typeof returnFocusTo.focus === "function") {
    returnFocusTo.focus();
  }

}

function advanceJourney() {
  if (currentImageIndex < modalImages.length - 1) {
    showImage(currentImageIndex + 1);
    return;
  }

  modalSlides.hidden = true;
  modalFinalMessage.hidden = false;
  imageModal.setAttribute("aria-labelledby", "journey-final-title");
  modalCloseButton.focus();
}

startJourneyButton.addEventListener("click", openImageModal);
modalNextButton.addEventListener("click", advanceJourney);
modalCloseButton.addEventListener("click", closeImageModal);
