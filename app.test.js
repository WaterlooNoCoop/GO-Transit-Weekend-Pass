import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { duration, torontoTime, PREVIEW_DURATION } from './time.js';

async function setup() {
  const elements = new Map();
  const getElement = id => {
    if (!elements.has(id)) elements.set(id, {
      value: '', textContent: '', hidden: false, events: {},
      addEventListener(type, handler) { this.events[type] = handler; },
      focus() { this.focused = true; }
    });
    return elements.get(id);
  };
  let tick;
  const source = await readFile(new URL('./app.js', import.meta.url), 'utf8');
  runInNewContext(source.replace(/^import[^\n]+\n/, ''), {
    duration, torontoTime, PREVIEW_DURATION, Date,
    document: { getElementById: getElement, addEventListener() {} },
    window: { scrollTo() {} },
    setInterval(handler) { tick = handler; }
  });
  return { getElement, tick, submit: () => getElement('route-form').events.submit({ preventDefault() {} }) };
}

test('station flow swaps, validates and renders names safely', async () => {
  const { getElement: get, submit, tick } = await setup();
  get('origin').value = 'Union Station';
  get('destination').value = 'Bramalea GO';
  get('swap').events.click();
  assert.equal(get('origin').value, 'Bramalea GO');
  assert.equal(get('destination').value, 'Union Station');
  get('destination').value = ' bramalea go ';
  submit();
  assert.equal(get('form-error').textContent, 'Enter two different stations.');
  get('destination').value = ' <b>Custom station</b> ';
  submit();
  assert.equal(get('route-title').textContent, 'Bramalea GO to <b>Custom station</b> · Weekend Pass');
  assert.equal(get('setup').hidden, true);
  assert.equal(get('preview').hidden, false);
  assert.equal(get('elapsed').textContent, '00:00:00');
  assert.match(get('remaining').textContent, /^(18:00:00|17:59:59)$/);
  assert.match(get('current-time').dateTime, /^\d{4}-\d{2}-\d{2}T/);
  tick();
});
