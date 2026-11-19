const {test}=require('node:test'),assert=require('node:assert/strict');
const C=require('../src/core.js'),D=require('../src/comparison.js');
const a=C.makeEvents('ACGTACGT','dna',{bpm:100}),b=C.makeEvents('ACGTGCGT','dna',{bpm:100});
test('Browser angular pan produces the frozen WAV channel gains',()=>{
 for(const p of [-1,-.82,0,.82,1]){const theta=(D.webAudioPan(p)+1)*Math.PI/4;assert(Math.abs(Math.cos(theta)-Math.sqrt((1-p)/2))<1e-12);assert(Math.abs(Math.sin(theta)-Math.sqrt((1+p)/2))<1e-12);}
});
test('Strict default preserves identity, velocity and timing; interleaves A/B with reference stereo pan',()=>{
 const input=JSON.stringify([a,b]),e=D.events(a,b);
 assert.deepEqual(e.filter(x=>x.changed).map(x=>[x.position,x.track,x.pitch,x.velocity]),[[5,'A',60,64],[5,'B',67,84]]);
 e.forEach((x,i)=>{const src=i%2?b[Math.floor(i/2)]:a[Math.floor(i/2)];assert.equal(x.event,i+1);assert.equal(x.position,Math.floor(i/2)+1);assert.equal(x.pan,i%2?.82:-.82);assert.equal(x.pitch,src.pitch);assert.equal(x.velocity,src.velocity);assert.equal(x.start,src.start);assert.equal(x.duration,src.duration);assert.equal(x.audioFeature,'match');assert.equal(x.cueMode,'none');});
 assert.equal(JSON.stringify([a,b]),input);
});
test('Cue only affects the two mutation events and is reversible without editing source events',()=>{
 const off=D.events(a,b),on=D.events(a,b,{cue:true});
 for(let i=0;i<off.length;i++){const x=off[i],y=on[i];assert.equal(y.pitch,x.pitch);assert.equal(y.start,x.start);assert.equal(y.pan,x.pan);assert.equal(y.velocity,x.velocity+(x.changed?20:0));assert.equal(y.audioFeature,x.changed?'positive':'match');}
 const pcm0=C.wav(D.audioEvents(off)),pcm1=C.wav(D.audioEvents(on));
 assert.deepEqual(pcm0.subarray(0,44+Math.floor(.72*22050)*4),pcm1.subarray(0,44+Math.floor(.72*22050)*4));
 assert.notDeepEqual(pcm0,pcm1);assert.deepEqual(off,D.events(a,b));
});
test('Single-track auditions use identical cue rules with centered pan',()=>{
 for(const target of ['A','B']){const e=D.events(a,b,{target,cue:true});assert.equal(e.length,8);assert(e.every(x=>x.track===target&&x.pan===0));assert.equal(e[4].velocity,target==='A'?84:104);}
});
test('Invalid pair or creative events cannot enter strict comparison',()=>{
 assert.throws(()=>D.events(a,b.slice(1)));assert.throws(()=>D.events([],[]));
 assert.throws(()=>D.events(a,C.makeEvents('ACGTGCGT','protein',{bpm:100})));
 assert.throws(()=>D.events(a,C.makeEvents('ACGTGCGT','dna',{bpm:120})));
 assert.throws(()=>D.events(a,C.makeEvents('ACGTGCGT','dna',{mode:'creative',bpm:100})));
});
test('Three repeated renders have identical events and export bytes; single-sequence exports unchanged',()=>{
 for(const cue of [false,true]){const render=()=>{const e=D.events(a,b,{cue});return [JSON.stringify(e),D.csv(e),D.midi(e,{bpm:100}),C.wav(D.audioEvents(e))];};const first=render();for(let i=0;i<3;i++)assert.deepEqual(render(),first);}
 assert.equal(D.csv(a),C.csv(a));assert.deepEqual(D.midi(a,{bpm:100}),C.midi(a,{bpm:100}));assert.deepEqual(C.wav(D.audioEvents(a)),C.wav(a));
});
test('CSV explicitly records source and playback values, mutation, comparison and cue',()=>{
 const csv=D.csv(D.events(a,b,{cue:true}));assert.match(csv,/source_velocity,source_feature,audio_feature/);assert.match(csv,/"mutation-emphasis","true","A","G","7","64","purine","positive"/);assert.equal(csv.trimEnd().split('\r\n').length,17);
});
