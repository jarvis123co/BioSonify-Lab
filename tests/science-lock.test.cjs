const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const C=require('../src/core.js'),lock=require('./science-lock.json');
test('Frozen scientific core matches the independently verified source byte for byte',()=>{
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(require.resolve('../src/core.js'))).digest('hex'),lock.coreSha256);
 assert.equal(C.MAPPING,lock.mapping);
});
test('All scientific alphabets, velocities, clock and gate obey fixed independent rules',()=>{
 const protein='ACDEFGHIKLMNPQRSTVWY',pitches=[48,50,52,53,55,57,59,60,62,64,65,67,69,71,72,74,76,77,79,81];
 const hydro=[1.8,2.5,-3.5,-3.5,2.8,-.4,-3.2,4.5,-3.9,3.8,1.9,-3.5,-1.6,-3.5,-4.5,-.8,-.7,4.2,-.9,-1.3];
 for(const [kind,sequence,notes,vel] of [['dna','ACGTN',[60,64,67,72,66],[64,84,84,64,38]],['rna','ACGUN',[60,64,67,72,66],[64,84,84,64,38]],['protein',protein,pitches,hydro.map(h=>Math.max(24,Math.min(112,40+Math.trunc(48*(h+4.5)/9))))]]){
  for(const bpm of [40,100,137,240]){const e=C.makeEvents(sequence,kind,{mode:'science',bpm,transpose:12,swing:.45,step:1,scale:'minor'});
   assert.deepEqual(e.map(x=>x.pitch),notes);assert.deepEqual(e.map(x=>x.velocity),vel);
   e.forEach((x,i)=>{assert.equal(x.position,i+1);assert.equal(x.symbol,sequence[i]);assert.equal(x.pan,0);assert.equal(x.start,Math.round(i*.3*60/bpm*1e6)/1e6);assert.equal(x.duration,Math.round(.3*60/bpm*.82*1e6)/1e6);});
   for(let j=0;j<3;j++)assert.deepEqual(e,C.makeEvents(sequence,kind,{mode:'science',bpm}));
  }
 }
});
