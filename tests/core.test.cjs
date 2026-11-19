const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const C=require('../src/core.js');
const dir=path.resolve(__dirname,'../verification');
const p={mode:'science',bpm:100,timbre:'protocol'};
test('Known DNA / RNA pitch alphabets and protein identity palette',()=>{
  assert.deepEqual(C.makeEvents('ACGTN','dna',p).map(e=>e.pitch),[60,64,67,72,66]);
  assert.deepEqual(C.makeEvents('ACGUN','rna',p).map(e=>e.pitch),[60,64,67,72,66]);
  assert.deepEqual(C.makeEvents(C.AA,'protein',p).map(e=>e.pitch),[48,50,52,53,55,57,59,60,62,64,65,67,69,71,72,74,76,77,79,81]);
});
test('Reference implementation agrees across all alphabets, four BPMs and four steps',()=>{
  const ref=JSON.parse(fs.readFileSync(path.join(dir,'reference-events.json'),'utf8'));let compared=0;
  for(const c of ref.cases){const events=C.makeEvents(c.sequence,c.kind,{...p,bpm:c.bpm,mode:c.step===.3?'science':'creative',step:c.step});for(let i=0;i<events.length;i++){
    const a=events[i],b=c.events[i];assert.equal(a.position,b.position);assert.equal(a.symbol,b.symbol);assert.equal(a.pitch,b.notes[0]);assert.equal(a.velocity,b.velocity);assert.equal(a.feature,b.feature);assert.equal(a.hydropathy,b.hydropathy);assert.ok(Math.abs(a.start-b.start)<=.000001);assert.ok(Math.abs(a.duration-b.duration)<=.000001);compared++;
  }}
  fs.writeFileSync(path.join(dir,'cross-validation.json'),JSON.stringify({source:ref.source,sha256:ref.sha256,referenceVersion:ref.runtime_version,cases:ref.cases.length,events:compared,result:'pass',scope:'Pitch, velocity, feature, hydropathy, position, order and timing (1 microsecond tolerance). No reversible carrier compatibility claim.'},null,2));
});
test('Repeated events are deterministic; scientific mode ignores creative transforms',()=>{
  const a=C.makeEvents('ANCGT','dna',p);assert.deepEqual(a,C.makeEvents('ANCGT','dna',p));assert.deepEqual(a,C.makeEvents('ANCGT','dna',{...p,transpose:12,scale:'minor',swing:.3,step:1}));
});
test('FASTA normalizes whitespace and case; ambiguous type must be explicit',()=>{
  assert.equal(C.parseInput('>demo\nac g\ntn\n; comment','dna').sequence,'ACGTN');assert.throws(()=>C.parseInput('ACGT'));assert.throws(()=>C.parseInput('>a\nAC\n>b\nGT','dna'),/2 条/);assert.throws(()=>C.parseInput('>empty','dna'));assert.throws(()=>C.parseInput('ATGU','dna'),/U/);assert.throws(()=>C.parseInput('AX','protein'),/X/);assert.throws(()=>C.parseInput('AAA-','dna'),/第 4/);
});
test('Single substitution is localized, including repeated bases; unequal lengths refused',()=>{
  assert.deepEqual(C.compare('AAAAA','AACAA'),[3]);assert.deepEqual(C.compare('ACGTN','ACGTN'),[]);assert.throws(()=>C.compare('ACG','ACGT'),/长度不同/);
});
test('BPM changes seconds inversely while MIDI beat positions remain stable',()=>{
  const a=C.makeEvents('ACT','dna',{...p,bpm:60}),b=C.makeEvents('ACT','dna',{...p,bpm:120});assert.equal(a[2].start,2*b[2].start);assert.equal(a[0].duration,2*b[0].duration);assert.equal(a[2].startBeats,b[2].startBeats);
});
test('Creative scale/transpose/swing retains source values and monotonic timing',()=>{
  const base=C.makeEvents('ACGTN','dna',p),art=C.makeEvents('ACGTN','dna',{mode:'creative',bpm:100,transpose:5,scale:'minor',step:.5,swing:.45,timbre:'glass'});
  assert.deepEqual(base.map(e=>e.basePitch),art.map(e=>e.basePitch));assert.notDeepEqual(base.map(e=>e.pitch),art.map(e=>e.pitch));for(let i=1;i<art.length;i++)assert.ok(art[i].start>=art[i-1].start+art[i-1].duration);assert.equal(art[1].start,.435);
});
test('Statistics retain N in denominator and count all amino acids',()=>{assert.equal(C.stats('GCNN','dna').gc,50);assert.equal(C.stats(C.AA,'protein').length,20);assert.equal(C.stats('GCNN','dna').unknown,2);});
function parseMidi(bytes){const b=Buffer.from(bytes);assert.equal(b.toString('ascii',0,4),'MThd');assert.equal(b.readUInt16BE(12),480);assert.equal(b.readUInt32BE(18),b.length-22);let at=22,tick=0,tempo,notes=[];const vlq=()=>{let n=0,x;do{x=b[at++];n=(n<<7)|(x&127);}while(x&128);return n;};while(at<b.length){tick+=vlq();const status=b[at++];if(status===255){const type=b[at++],len=vlq();if(type===81)tempo=b.readUIntBE(at,3);at+=len;}else{const n=b[at++],v=b[at++];if((status&240)===144)notes.push({tick,n,v,channel:status&15,on:true});if((status&240)===128)notes.push({tick,n,channel:status&15,on:false});}}return {tempo,notes};}
test('MIDI serializes valid tempo, beat timestamps, velocities and both pan channels',()=>{
  const events=C.makeEvents('ACGTN','dna',p),bytes=C.midi(events,p),decoded=parseMidi(bytes);assert.equal(decoded.tempo,600000);assert.deepEqual(decoded.notes.filter(e=>e.on).map(e=>e.n),[60,64,67,72,66]);assert.deepEqual(decoded.notes.filter(e=>e.on).map(e=>e.tick),[0,144,288,432,576]);assert.equal(decoded.notes.find(e=>!e.on).tick,118);fs.writeFileSync(path.join(dir,'dna-science.mid'),bytes);
  const stereo=events.map(e=>({...e,pan:-1})).concat(events.map(e=>({...e,pan:1})));assert.deepEqual([...new Set(parseMidi(C.midi(stereo,p)).notes.map(e=>e.channel))],[1,2]);
});
test('WAV is PCM 16-bit stereo, non-silent, finite, deterministic and spectrally mapped',()=>{
  const events=C.makeEvents('ACGTN','dna',p),bytes=C.wav(events),view=new DataView(bytes.buffer);assert.equal(view.getUint16(20,true),1);assert.equal(view.getUint16(22,true),2);assert.equal(view.getUint16(34,true),16);assert.equal(view.getUint32(40,true),bytes.length-44);assert.deepEqual(bytes,C.wav(events));const sr=view.getUint32(24,true);let peak=0;for(let i=44;i<bytes.length;i+=4)peak=Math.max(peak,Math.abs(view.getInt16(i,true)));assert.ok(peak>100&&peak<32767);
  for(const e of events){const a=Math.floor((e.start+.03)*sr),n=Math.floor(.07*sr),powers=[];for(const midi of [60,64,66,67,72]){let re=0,im=0;const f=440*2**((midi-69)/12);for(let j=0;j<n;j++){const value=view.getInt16(44+(a+j)*4,true)*(0.5-0.5*Math.cos(2*Math.PI*j/(n-1)));re+=value*Math.cos(2*Math.PI*f*j/sr);im+=value*Math.sin(2*Math.PI*f*j/sr);}powers.push([midi,re*re+im*im]);}powers.sort((a,b)=>b[1]-a[1]);assert.equal(powers[0][0],e.pitch);}
  fs.writeFileSync(path.join(dir,'dna-science.wav'),bytes);
});
test('WAV hard left produces silence on right; export byte budget is enforced',()=>{const events=C.makeEvents('A','dna',p).map(e=>({...e,pan:-1})),bytes=C.wav(events),v=new DataView(bytes.buffer);for(let i=46;i<bytes.length;i+=4)assert.equal(v.getInt16(i,true),0);assert.throws(()=>C.wav(events,()=>{},100),/超过/);});
test('CSV contains one row per event with original/output pitches and seconds',()=>{
  const ev=C.makeEvents('ACGTN','dna',p),csv=C.csv(ev),lines=csv.trim().split('\r\n');assert.equal(lines.length,6);assert.match(lines[0],/base_midi_pitch,midi_pitch/);const row=lines[2].split(',').map(x=>x.replaceAll('"',''));assert.equal(row[1],'2');assert.equal(row[3],'C');assert.equal(Number(row[6]),64);assert.equal(Number(row[12]),ev[1].start);fs.writeFileSync(path.join(dir,'dna-science.csv'),csv);
});
test('SVG emits explicit event labels and refuses unbounded visual exports',()=>{const ev=C.makeEvents('ACGTN','dna',p);const svg=C.scoreSVG(ev,C.parameters(p));assert.match(svg,/A:A 60/);assert.match(svg,/A:N 66/);assert.throws(()=>C.scoreSVG(C.makeEvents('A'.repeat(2049),'dna',p),C.parameters(p)),/2,048/);fs.writeFileSync(path.join(dir,'dna-science.svg'),svg);});
test('100k event mapping is complete and bounded by validated length',()=>{const begin=performance.now(),ev=C.makeEvents('ACGT'.repeat(25000),'dna',p),ms=performance.now()-begin;assert.equal(ev.length,100000);assert.equal(ev.at(-1).position,100000);assert.ok(ms<3000,`Mapping took ${ms}ms`);assert.throws(()=>C.makeEvents('A'.repeat(100001),'dna',p),/超过/);fs.writeFileSync(path.join(dir,'core-performance.json'),JSON.stringify({events:ev.length,mappingMilliseconds:ms},null,2));});
