import { duration, torontoTime, PREVIEW_DURATION, mondayCutoff, isWeekend } from './time.js';

const byId = id => document.getElementById(id);
const form = byId('route-form');
const origin = byId('origin');
const destination = byId('destination');
let startedAt = null;
let expiresAt = null;

function updateClocks() {
  byId('weekend-warning').hidden = isWeekend(new Date());
  if (startedAt === null) return;
  const now = new Date();
  const elapsed = now.getTime() - startedAt;
  byId('current-time').textContent = torontoTime(now);
  byId('current-time').dateTime = now.toISOString();
  byId('elapsed').textContent = duration(elapsed);
  byId('remaining').textContent = duration(expiresAt - now.getTime());
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
  const oneWay = byId('one-way-option').checked;
  byId('preview').className = oneWay ? 'preview one-way' : 'preview';
  byId('preview').setAttribute('aria-label', oneWay ? 'One way ticket demo' : 'Weekend pass demo');
  byId('route-title').textContent = oneWay ? `${from} to ${to}` : `${from} to ${to} · Weekend Pass`;
  byId('one-way-brand').hidden = false;
  byId('one-way-arrow').hidden = !oneWay;
  byId('fare-label').textContent = oneWay ? '1x Adult' : '1x Weekend Pass';
  byId('usage-label').textContent = oneWay ? 'One-Way' : 'Multi Use Pass';
  byId('ticket-status').textContent = oneWay ? 'VALID FOR TRAVEL' : 'ACTIVE';
  byId('current-time-label').textContent = oneWay ? 'CURRENT TIME:' : 'CURRENT DATE & TIME:';
  byId('ticket-instructions').innerHTML = oneWay
    ? 'Please show this screen to the proper<br>authority on board the train.'
    : 'Please show proof of your ticket to the<br>Customer Protective Officers when<br>asked';
  const now = new Date();
  const elapsedSeconds = Math.floor(Math.random() * (PREVIEW_DURATION / 1000));
  startedAt = now.getTime() - elapsedSeconds * 1000;
  expiresAt = Math.min(startedAt + PREVIEW_DURATION, mondayCutoff(now));
  updateClocks();
  byId('setup').hidden = true;
  byId('preview').hidden = false;
  window.scrollTo({ top: 0 });
});

// Tick every second so the clocks advance in real time.
updateClocks();
setInterval(updateClocks, 1000);
document.addEventListener('visibilitychange', updateClocks);
