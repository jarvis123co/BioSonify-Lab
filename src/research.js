/* Research records bind an input snapshot and event stream to actual output bytes. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BioResearch=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const PROFILE='biosonify-research-record-v1',CANONICAL='biosonify-canonical-json-v1';
  const SOURCE_HASH_DEFINITION=Object.freeze({algorithm:'SHA-256',encoding:'UTF-8',normalization:'CRLF-and-CR-to-LF',scope:'script-text'});
  function canonical(value){
    if(value===null||typeof value!=='object')return JSON.stringify(value);
    if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
    return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';
  }
  function bytes(value){
    if(typeof value==='string')return new TextEncoder().encode(value);
    if(ArrayBuffer.isView(value))return new Uint8Array(value.buffer,value.byteOffset,value.byteLength);
    return new Uint8Array(value);
  }
  async function hash(value){
    if(!globalThis.crypto?.subtle)throw new Error('此浏览器未提供 SHA-256，请使用支持本地文件加密接口的浏览器。');
    return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes(value)))].map(x=>x.toString(16).padStart(2,'0')).join('');
  }
  async function capture(spec){
    // Clone before the first asynchronous step: later edits must not alter this run.
    const {events,inputs,sourceScripts,...context}=JSON.parse(JSON.stringify(spec));
    for(const input of inputs){input.rawTextSha256=await hash(input.rawText);input.sequenceSha256=await hash(input.sequence);}
    const sourceHashes={};for(const [name,source] of Object.entries(sourceScripts))sourceHashes[name]=await hash(source.replace(/\r\n?/g,'\n'));
    const identity={profile:PROFILE,...context,sourceHashDefinition:SOURCE_HASH_DEFINITION,sourceHashes,inputs,eventsSha256:await hash(canonical(events))};
    return {...identity,runId:await hash(canonical(identity)),createdAtUtc:new Date().toISOString(),events,artifacts:[]};
  }
  async function addArtifact(run,descriptor,data,previous){
    const artifact={...descriptor,bytes:bytes(data).byteLength,sha256:await hash(data)};
    const same=previous?.runId===run.runId,artifacts=(same?previous.artifacts:[]).filter(x=>x.format!==artifact.format);
    artifacts.push(artifact);artifacts.sort((a,b)=>a.format.localeCompare(b.format,'en'));
    const record={...run,createdAtUtc:same?previous.createdAtUtc:run.createdAtUtc,artifacts};
    record.integrity={algorithm:'SHA-256',canonicalization:CANONICAL,payloadSha256:await hash(canonical(record))};
    return record;
  }
  async function verify(record){
    if(record.profile!==PROFILE||record.integrity?.canonicalization!==CANONICAL||record.integrity?.algorithm!=='SHA-256')throw new Error('不支持的研究记录格式。');
    if(canonical(record.sourceHashDefinition)!==canonical(SOURCE_HASH_DEFINITION))throw new Error('研究记录的源码哈希定义缺失或不受支持。');
    const {integrity,...payload}=record;
    const {runId,createdAtUtc,events,artifacts,...identity}=payload;
    const checks=[{name:'record',ok:await hash(canonical(payload))===integrity.payloadSha256},{name:'runIdentity',ok:await hash(canonical(identity))===runId},{name:'events',ok:await hash(canonical(events))===record.eventsSha256}];
    for(const input of record.inputs){checks.push({name:'input-'+input.track,ok:await hash(input.rawText)===input.rawTextSha256&&await hash(input.sequence)===input.sequenceSha256});}
    return {ok:checks.every(c=>c.ok),checks};
  }
  return Object.freeze({PROFILE,CANONICAL,SOURCE_HASH_DEFINITION,canonical,hash,capture,addArtifact,verify});
});
