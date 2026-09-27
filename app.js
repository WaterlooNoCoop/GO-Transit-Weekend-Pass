import { duration, torontoTime, PREVIEW_DURATION } from './time.js';

const byId = id => document.getElementById(id);
const form = byId('route-form');
const origin = byId('origin');
const destination = byId('destination');
let startedAt = null;

function updateClocks() {
  if (startedAt === null) return;
  const now = new Date();
  const elapsed = now.getTime() - startedAt;
  byId('current-time').textContent = torontoTime(now);
  byId('current-time').dateTime = now.toISOString();
  byId('elapsed').textContent = duration(elapsed);
  byId('remaining').textContent = duration(PREVIEW_DURATION - elapsed);
}

byId('swap').addEventListener('click', () => {
  [origin.value, destination.value] = [destination.value, origin.value];
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const from = origin.value.trim();
  const to = destination.value.trim();
  if (!from || !to || from.toLowerCase() === to.toLowerCase()) {
    byId('form-error').textContent = 'Enter two different stations.';
    return;
  }
  byId('form-error').textContent = '';
  byId('route-title').textContent = `${from} to ${to} - Weekend Pass`;
  startedAt = Date.now();
  updateClocks();
  byId('setup').hidden = true;
  byId('preview').hidden = false;
  window.scrollTo({ top: 0 });
});

// Tick every second so the clocks advance in real time.
setInterval(updateClocks, 1000);
document.addEventListener('visibilitychange', updateClocks);
