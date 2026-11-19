const {test}=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const C=require('../src/core.js'),R=require('../src/research.js');
const digest=x=>crypto.createHash('sha256').update(x).digest('hex');
function spec(){return {application:{version:'1.0.0'},mapping:C.MAPPING,parameters:C.parameters({bpm:100}),inputs:[{track:'A',rawText:'>α样本\nacgtn',sequence:'ACGTN',length:5}],sourceScripts:{core:'fixed-source'},events:C.makeEvents('ACGTN','dna',{bpm:100})};}
test('SHA-256 uses exact UTF-8 bytes and typed-array slice boundaries',async()=>{
 assert.equal(await R.hash('abc'),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
 assert.equal(await R.hash('α样本\r\n'),digest(Buffer.from('α样本\r\n')));
 assert.equal(await R.hash(new Uint8Array([9,1,2,3,8]).subarray(1,4)),digest(Buffer.from([1,2,3])));
});
test('Source hashes normalize only line endings; raw input and artifact bytes stay exact',async()=>{
 const runs=[];
 for(const source of ['α\r\n中\r终\n','α\n中\n终\n']){const s=spec();s.sourceScripts.core=source;s.inputs[0].rawText='>α\r\nacgtn';runs.push(await R.capture(s));}
 assert.equal(runs[0].sourceHashes.core,digest('α\n中\n终\n'));assert.equal(runs[0].runId,runs[1].runId);
 assert.equal(runs[0].inputs[0].rawTextSha256,digest('>α\r\nacgtn'));assert.notEqual(runs[0].inputs[0].rawTextSha256,digest('>α\nacgtn'));
 const file='header\r\ndata\r\n',r=await R.addArtifact(runs[0],{format:'csv',filename:'x.csv'},file);
 assert.equal(r.artifacts[0].sha256,digest(file));assert.deepEqual(r.sourceHashDefinition,{algorithm:'SHA-256',encoding:'UTF-8',normalization:'CRLF-and-CR-to-LF',scope:'script-text'});
 assert((await R.verify(r)).ok);delete r.sourceHashDefinition;await assert.rejects(()=>R.verify(r),/源码哈希定义/);
});
test('Capture is isolated from edits before asynchronous hashing finishes',async()=>{
 const s=spec(),pending=R.capture(s);s.inputs[0].sequence='TT';s.events[0].pitch=127;
 const r=await pending;assert.equal(r.inputs[0].sequence,'ACGTN');assert.equal(r.events[0].pitch,60);assert.equal(r.inputs[0].rawTextSha256,digest('>α样本\nacgtn'));
});
test('Three identical captures have identical semantic identities and event hashes',async()=>{
 const runs=await Promise.all([R.capture(spec()),R.capture(spec()),R.capture(spec())]);assert.equal(new Set(runs.map(r=>r.runId)).size,1);assert.equal(new Set(runs.map(r=>r.eventsSha256)).size,1);
});
test('Actual artifact bytes bind to record; same run merges formats and a new run starts cleanly',async()=>{
 const a=await R.capture(spec()),b=await R.capture(spec()),e=a.events,p=a.parameters;
 const first=await R.addArtifact(a,{format:'csv',filename:'x.csv'},C.csv(e));
 const second=await R.addArtifact(b,{format:'midi',filename:'x.mid'},C.midi(e,p),first);
 assert.deepEqual(second.artifacts.map(x=>x.format),['csv','midi']);assert((await R.verify(second)).ok);assert.equal(second.createdAtUtc,first.createdAtUtc);
 assert.equal(second.artifacts[0].sha256,digest(Buffer.from(C.csv(e))));
 const changed=spec();changed.parameters.bpm=120;const third=await R.addArtifact(await R.capture(changed),{format:'csv',filename:'x.csv'},'different',second);assert.equal(third.artifacts.length,1);assert.notEqual(third.runId,second.runId);
});
test('Event, input, parameter and artifact tampering are detected',async()=>{
 const r=await R.addArtifact(await R.capture(spec()),{format:'csv',filename:'x.csv'},'data');
 for(const edit of [x=>x.events[0].pitch++,x=>x.inputs[0].sequence='T',x=>x.parameters.bpm++,x=>x.artifacts[0].sha256='0'.repeat(64)]){const bad=structuredClone(r);edit(bad);assert.equal((await R.verify(bad)).ok,false);}
 const {integrity,...payload}=r;assert.equal(integrity.payloadSha256,digest(R.canonical(payload)));
});
