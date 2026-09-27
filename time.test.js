import test from 'node:test';
import assert from 'node:assert/strict';
import { duration, torontoTime, PREVIEW_DURATION, mondayCutoff, isWeekend } from './time.js';

test('duration handles elapsed time, hour boundaries and expiry', () => {
  assert.equal(duration(0), '00:00:00');
  assert.equal(duration(3599999), '00:59:59');
  assert.equal(duration(3600000), '01:00:00');
  assert.equal(duration(PREVIEW_DURATION), '24:00:00');
  assert.equal(duration(-1000), '00:00:00');
});

test('Toronto time follows daylight saving and calendar rollover', () => {
  assert.equal(torontoTime(new Date('2026-08-29T15:33:53Z')), 'Aug 29, 2026 11:33:53 AM');
  assert.equal(torontoTime(new Date('2026-01-01T04:59:59Z')), 'Dec 31, 2025 11:59:59 PM');
  assert.equal(torontoTime(new Date('2026-01-01T05:00:00Z')), 'Jan 1, 2026 12:00:00 AM');
});

test('Monday cutoff follows Toronto time and daylight saving changes', () => {
  assert.equal(new Date(mondayCutoff(new Date('2026-09-27T20:00:00Z'))).toISOString(), '2026-09-28T08:00:00.000Z');
  assert.equal(new Date(mondayCutoff(new Date('2026-09-28T07:59:59Z'))).toISOString(), '2026-09-28T08:00:00.000Z');
  assert.equal(new Date(mondayCutoff(new Date('2026-09-28T08:00:00Z'))).toISOString(), '2026-10-05T08:00:00.000Z');
  assert.equal(new Date(mondayCutoff(new Date('2026-03-07T12:00:00Z'))).toISOString(), '2026-03-09T08:00:00.000Z');
  assert.equal(new Date(mondayCutoff(new Date('2026-10-31T12:00:00Z'))).toISOString(), '2026-11-02T09:00:00.000Z');
});

test('weekend starts Saturday at four and ends Monday at four in Toronto', () => {
  assert.equal(isWeekend(new Date('2026-09-26T07:59:59Z')), false);
  assert.equal(isWeekend(new Date('2026-09-26T08:00:00Z')), true);
  assert.equal(isWeekend(new Date('2026-09-27T20:00:00Z')), true);
  assert.equal(isWeekend(new Date('2026-09-28T07:59:59Z')), true);
  assert.equal(isWeekend(new Date('2026-09-28T08:00:00Z')), false);
  assert.equal(isWeekend(new Date('2026-09-30T12:00:00Z')), false);
  assert.equal(isWeekend(new Date('2026-01-03T08:59:59Z')), false);
  assert.equal(isWeekend(new Date('2026-01-03T09:00:00Z')), true);
});
