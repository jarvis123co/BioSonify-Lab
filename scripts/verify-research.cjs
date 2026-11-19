// Usage: node scripts/verify-research.cjs record.json [downloaded-file ...]
const fs=require('node:fs'),path=require('node:path'),R=require('../src/research.js');
(async()=>{
 const [recordPath,...files]=process.argv.slice(2);if(!recordPath)throw new Error('请提供研究记录 JSON，可再附上需要核对的实际导出文件。');
 const record=JSON.parse(fs.readFileSync(recordPath,'utf8')),result=await R.verify(record);
 const artifacts=[];for(const file of files){const data=fs.readFileSync(file),sha256=await R.hash(data);artifacts.push({file:path.resolve(file),bytes:data.length,sha256,matches:record.artifacts.filter(x=>x.sha256===sha256&&x.bytes===data.length).map(x=>x.filename)});}
 const missing=record.artifacts.filter(x=>!artifacts.some(a=>a.sha256===x.sha256&&a.bytes===x.bytes)).map(x=>x.filename);
 result.artifacts=artifacts;result.uncheckedArtifacts=missing;result.scope=files.length?'Record integrity and supplied file bytes':'Record integrity only; output files not supplied';
 result.ok=result.ok&&artifacts.every(x=>x.matches.length>0)&&(!files.length||missing.length===0);
 console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=1;
})().catch(e=>{console.error(e.message);process.exitCode=1;});
