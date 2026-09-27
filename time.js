export const PREVIEW_DURATION = 24 * 60 * 60 * 1000;

const torontoCalendar = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Toronto', year: 'numeric', month: 'numeric', day: 'numeric',
  hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23'
});

function localTimestamp(date) {
  const parts = torontoCalendar.formatToParts(date);
  const get = type => Number(parts.find(part => part.type === type).value);
  return Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
}

// Convert the Toronto calendar date to an instant, including daylight saving time.
function torontoInstant(local) {
  let instant = local;
  for (let i = 0; i < 3; i++) instant += local - localTimestamp(new Date(instant));
  return instant;
}

export function mondayCutoff(now) {
  const local = new Date(localTimestamp(now));
  const monday = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(),
    local.getUTCDate() + (8 - local.getUTCDay()) % 7, 4);
  const cutoff = torontoInstant(monday);
  return cutoff > now.getTime() ? cutoff : torontoInstant(monday + 7 * 24 * 60 * 60 * 1000);
}

export function isWeekend(now) {
  const local = new Date(localTimestamp(now));
  const day = local.getUTCDay();
  const hour = local.getUTCHours();
  return (day === 6 && hour >= 4) || day === 0 || (day === 1 && hour < 4);
}

export function duration(milliseconds) {
  const seconds = Math.floor(Math.max(0, milliseconds) / 1000);
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map(value => String(value).padStart(2, '0')).join(':');
}

export function torontoTime(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Toronto', month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
  }).formatToParts(date);
  const get = type => parts.find(part => part.type === type).value;
  return `${get('month')} ${get('day')}, ${get('year')} ${get('hour')}:${get('minute')}:${get('second')} ${get('dayPeriod')}`;
}
