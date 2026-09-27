export const PREVIEW_DURATION = 18 * 60 * 60 * 1000;

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
