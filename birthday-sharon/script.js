const birthdayValue = "2026-10-25";
const message = document.querySelector("#message");

const fields = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds")
};

function nextBirthday(month, day, now = new Date()) {
  // Construct dates locally to avoid UTC/time-zone shifts from date-only strings.
  let target = new Date(now.getFullYear(), month, day, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (target < today) {
    target = new Date(now.getFullYear() + 1, month, day, 0, 0, 0);
  }
  return target;
}

function updateCountdown() {
  const [, month, day] = birthdayValue.split("-").map(Number);
  const now = new Date();
  const target = nextBirthday(month - 1, day, now);
  const isToday = target.getFullYear() === now.getFullYear()
    && target.getMonth() === now.getMonth()
    && target.getDate() === now.getDate();

  let remaining = Math.max(0, target.getTime() - now.getTime());
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
