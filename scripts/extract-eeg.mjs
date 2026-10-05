import fs from 'node:fs';
import crypto from 'node:crypto';
// Download S001/S001R01.edf from the source URL in eeg-recording.md, then pass its path.
const b = fs.readFileSync(process.argv[2]);
const n = Number(b.toString('ascii', 252, 256));
let offset = 256;
function fields(length) {
  const values = Array.from({length:n}, (_,i) => b.toString('ascii',offset+i*length,offset+(i+1)*length).trim());
  offset += n*length;
  return values;
}
const labels=fields(16); fields(80);
const units=fields(8), low=fields(8).map(Number), high=fields(8).map(Number), digitalLow=fields(8).map(Number), digitalHigh=fields(8).map(Number);
fields(80);
const counts=fields(8).map(Number);
const channel=labels.indexOf('Af7.');
if(channel<0 || units[channel]!=='uV') throw new Error('Expected AF7 in microvolts');
const header=Number(b.toString('ascii',184,192)), duration=Number(b.toString('ascii',244,252));
const stride=counts.reduce((a,b)=>a+b,0)*2;
const channelOffset=counts.slice(0,channel).reduce((a,b)=>a+b,0)*2;
const samples=[];
for(let record=0;record<60;record++) for(let i=0;i<counts[channel];i++) {
  const raw=b.readInt16LE(header+record*stride+channelOffset+i*2);
  samples.push((raw-digitalLow[channel])*(high[channel]-low[channel])/(digitalHigh[channel]-digitalLow[channel])+low[channel]);
}
const recording={channel:'AF7',sampleRate:counts[channel]/duration,samples};
fs.writeFileSync('src/data/eeg-recording.js',`// Real EEG; provenance and license: eeg-recording.md\nexport default ${JSON.stringify(recording)};\n`);
console.log({samples:samples.length,min:Math.min(...samples),max:Math.max(...samples),sha256:crypto.createHash('sha256').update(b).digest('hex')});
