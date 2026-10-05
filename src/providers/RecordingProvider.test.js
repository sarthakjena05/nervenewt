import test from 'node:test';
import assert from 'node:assert/strict';
import recording from '../data/eeg-recording.js';
import { RecordingProvider } from './RecordingProvider.js';

test('replays original samples at 160 Hz and resets cleanly at loop boundary', () => {
  const provider = new RecordingProvider();
  let frame;
  provider.subscribe(message => { if (message.type === 'frame') frame = message; });
  assert.equal(recording.samples.length, 9600);
  provider.advance(1000);
  assert.deepEqual(frame.channels[1], recording.samples.slice(0, 160));
  provider.advance(2000);
  assert.deepEqual(frame.channels[1], recording.samples.slice(0, 480));
  provider.advance(57000);
  assert.deepEqual(frame.channels[1], recording.samples.slice(-480));
  provider.advance(40);
  assert.deepEqual(frame.channels[1], recording.samples.slice(0, 6));
});

test('jumps originate from recorded threshold crossings with debounce', () => {
  const provider = new RecordingProvider();
  const peaks = [];
  provider.subscribe(message => { if(message.type === 'event') peaks.push({name:message.name,index:provider.cursor-1}); });
  for(let i=0;i<1500;i++) provider.advance(40);
  assert.ok(peaks.length > 5);
  for(let i=0;i<peaks.length;i++) {
    const peak=peaks[i];
    assert.equal(peak.name, 'signal.peak');
    assert.ok(Math.abs(recording.samples[peak.index])>60);
    assert.ok(peak.index===0 || Math.abs(recording.samples[peak.index-1])<=60);
    if(i) assert.ok(peak.index-peaks[i-1].index>112);
  }
});

test('disconnect pauses playback; reconnect resumes without duplicate timers', async () => {
  const provider = new RecordingProvider();
  try {
    provider.connect();
    const timer=provider.timer;
    provider.connect();
    assert.equal(provider.timer,timer);
    await new Promise(resolve=>setTimeout(resolve,130));
    provider.disconnect();
    const cursor=provider.cursor;
    assert.ok(cursor>0);
    await new Promise(resolve=>setTimeout(resolve,100));
    assert.equal(provider.cursor,cursor);
    provider.connect();
    await new Promise(resolve=>setTimeout(resolve,100));
    assert.ok(provider.cursor>cursor);
  } finally { provider.disconnect(); }
});
