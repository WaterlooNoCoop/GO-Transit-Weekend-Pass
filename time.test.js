import test from 'node:test';
import assert from 'node:assert/strict';
import { duration, torontoTime, PREVIEW_DURATION } from './time.js';

test('duration handles elapsed time, hour boundaries and expiry', () => {
  assert.equal(duration(0), '00:00:00');
  assert.equal(duration(3599999), '00:59:59');
  assert.equal(duration(3600000), '01:00:00');
  assert.equal(duration(PREVIEW_DURATION), '18:00:00');
  assert.equal(duration(-1000), '00:00:00');
});

test('Toronto time follows daylight saving and calendar rollover', () => {
  assert.equal(torontoTime(new Date('2026-08-29T15:33:53Z')), 'Aug 29, 2026 11:33:53 AM');
  assert.equal(torontoTime(new Date('2026-01-01T04:59:59Z')), 'Dec 31, 2025 11:59:59 PM');
  assert.equal(torontoTime(new Date('2026-01-01T05:00:00Z')), 'Jan 1, 2026 12:00:00 AM');
});
