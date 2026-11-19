/* Mapping tables and deterministic event rules adapted from Seq2Music.
 * Copyright (c) 2026 Jacob Vogan. MIT license; see embedded THIRD_PARTY notice. */
(function (root) {
  'use strict';
  const VERSION = '0.3.1';
  const MAPPING = 'seq2music-mapping-v2';
  const AA = 'ACDEFGHIKLMNPQRSTVWY';
  const AA_PITCH = Object.fromEntries([...AA].map((s,i)=>[s,[48,50,52,53,55,57,59,60,62,64,65,67,69,71,72,74,76,77,79,81][i]]));
  const HYDRO = Object.fromEntries([...AA].map((s,i)=>[s,[1.8,2.5,-3.5,-3.5,2.8,-.4,-3.2,4.5,-3.9,3.8,1.9,-3.5,-1.6,-3.5,-4.5,-.8,-.7,4.2,-.9,-1.3][i]]));
  const NUC = {A:60,C:64,G:67,T:72,U:72,N:66};
  const ALPHABETS = {dna:'ACGTN',rna:'ACGUN',protein:AA};
  const MAX_LENGTH = 100000;
  const COLORS = {A:'#41dcea',C:'#a68aff',G:'#f1c453',T:'#ff8b75',U:'#ff8b75',N:'#8f9db0'};
  const round6 = n=>Math.round(n*1e6)/1e6;
  const escapeXML = v=>String(v).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
  function parseInput(text, kind) {
    if (!ALPHABETS[kind]) throw new Error('请明确选择 DNA、RNA 或 Protein 类型。');
    if (text.length > 2000000) throw new Error('输入超过 2 MB，请选取更短的序列。');
    const records=[]; let name=null, parts=[];
    for (const raw of text.split(/\r?\n/)) {
      const line=raw.trim(); if (!line || line.startsWith(';')) continue;
      if (line.startsWith('>')) { if(name!==null) records.push({name,sequence:parts.join('')}); name=line.slice(1).trim().slice(0,200)||'未命名序列'; parts=[]; }
      else { if(name===null)name='自定义序列'; parts.push(line.replace(/\s/g,'')); }
    }
    if(name!==null)records.push({name,sequence:parts.join('')});
    if(records.length>1)throw new Error(`检测到 ${records.length} 条 FASTA 记录，请每次导入一条。`);
    if(!records.length || !records[0].sequence)throw new Error('请输入序列，或载入示例。');
    const record=records[0]; record.sequence=record.sequence.toUpperCase();
    if(record.sequence.length>MAX_LENGTH)throw new Error(`序列超过 ${MAX_LENGTH.toLocaleString()} 个符号，请分段导入。`);
    const invalid=[];
    for(let i=0;i<record.sequence.length;i++)if(!ALPHABETS[kind].includes(record.sequence[i])) { invalid.push(`${record.sequence[i]}（第 ${i+1} 位）`); if(invalid.length===4)break; }
    if(invalid.length)throw new Error(`不支持的 ${kind==='protein'?'Protein':kind.toUpperCase()} 符号：${invalid.join('、')}。允许 ${ALPHABETS[kind]}。`);
    return record;
  }
  function parameters(p={}) {
    const mode=p.mode==='creative'?'creative':'science';
    const bpm=Number(p.bpm??100), step=mode==='science'?.3:Number(p.step??.3), transpose=mode==='science'?0:Number(p.transpose??0), swing=mode==='science'?0:Number(p.swing??0);
    if(!Number.isInteger(bpm)||bpm<40||bpm>240)throw new Error('BPM 需为 40–240 的整数。');
    if(![.25,.3,.5,1].includes(step)||!Number.isInteger(transpose)||Math.abs(transpose)>12||!Number.isFinite(swing)||swing<0||swing>.45)throw new Error('音乐参数超出允许范围。');
    const scale=mode==='science'?'identity':(p.scale??'identity');
    if(!['identity','major','minor','pentatonic'].includes(scale))throw new Error('请选择支持的调式。');
    const timbre=p.timbre??'protocol'; if(!['protocol','sine','soft','glass'].includes(timbre))throw new Error('请选择支持的音色。');
    return {mode,bpm,step,transpose,swing,scale,timbre};
  }
  function feature(s,kind) {
    if(kind!=='protein')return s==='N'?'ambiguous':('AG'.includes(s)?'purine':'pyrimidine');
    return 'AVILMFWY'.includes(s)?'hydrophobic':'STNQ'.includes(s)?'polar':'KRH'.includes(s)?'positive':'DE'.includes(s)?'negative':'special';
  }
  function pitchInScale(n,scale) {
    if(scale==='identity')return n;
    const allowed={major:[0,2,4,5,7,9,11],minor:[0,2,3,5,7,8,10],pentatonic:[0,2,4,7,9]}[scale];
    for(let d=0;d<12;d++){ if(allowed.includes(((n-d)%12+12)%12))return n-d; if(allowed.includes((n+d)%12))return n+d; }
  }
  function makeEvents(sequence,kind,raw={}) {
    sequence=parseInput(sequence,kind).sequence;
    const p=parameters(raw), stepSeconds=p.step*60/p.bpm, baseStep=.3*60/p.bpm;
    return [...sequence].map((symbol,i)=>{
      const basePitch=kind==='protein'?AA_PITCH[symbol]:NUC[symbol];
      const velocity=kind==='protein'?Math.max(24,Math.min(112,40+Math.trunc(48*(HYDRO[symbol]+4.5)/9))):symbol==='N'?38:'GC'.includes(symbol)?84:64;
      const startBeats=i*p.step+(i%2?p.step*p.swing:0);
      const nextBeats=(i+1)*p.step+((i+1)%2?p.step*p.swing:0);
      const durationBeats=(nextBeats-startBeats)*.82;
      return {event:i+1,position:i+1,symbol,kind,basePitch,pitch:pitchInScale(basePitch+p.transpose,p.scale),velocity,feature:feature(symbol,kind),hydropathy:kind==='protein'?HYDRO[symbol]:null,pan:0,baseStart:round6(i*baseStep),baseDuration:round6(baseStep*.82),start:round6(startBeats*60/p.bpm),duration:round6(durationBeats*60/p.bpm),startBeats:round6(startBeats),durationBeats:round6(durationBeats),mapping:MAPPING,...p};
    });
  }
  function compare(a,b) {
    if(a.length!==b.length)throw new Error(`两条序列长度不同（${a.length} / ${b.length}），当前仅支持等长比较。`);
    const differences=[]; for(let i=0;i<a.length;i++)if(a[i]!==b[i])differences.push(i+1);
    return differences;
  }
  function stats(sequence,kind) {
    const counts=Object.fromEntries([...ALPHABETS[kind]].map(c=>[c,0]));for(const c of sequence)counts[c]++;
    return {length:sequence.length,counts,gc:kind==='protein'?null:(counts.G+counts.C)/sequence.length*100,unknown:kind==='protein'?0:counts.N};
  }
  function noteName(n){return ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'][n%12]+(Math.floor(n/12)-1);}
  function color(s,kind){return kind==='protein'?({hydrophobic:'#41dcea',polar:'#a68aff',positive:'#f1c453',negative:'#ff8b75',special:'#8f9db0'}[feature(s,kind)]):COLORS[s];}
  function harmonics(timbre,f) {
    if(timbre==='sine')return [0,1];
    if(timbre==='soft')return [0,.78,.12,.06];
    if(timbre==='glass')return [0,.7,0,.15,0,.08];
    return ({positive:[0,.72,.22],negative:[0,.68,0,.18],special:[0,.75,0,0,.12],purine:[0,.76,.16],pyrimidine:[0,.76,0,.13],ambiguous:[0,.55,0,0,0,.10]})[f]||[0,1];
  }
  function timelineEnd(events){let end=0;for(const e of events)end=Math.max(end,e.start+e.duration);return end;}
  function csv(events) {
    const fields=['event','position','track','symbol','kind','basePitch','pitch','velocity','feature','hydropathy','baseStart','baseDuration','start','duration','startBeats','durationBeats','pan','mode','bpm','step','transpose','scale','swing','timbre','mapping'];
    const names=['event','position','track','symbol','kind','base_midi_pitch','midi_pitch','velocity','feature','hydropathy','base_start_seconds','base_duration_seconds','start_seconds','duration_seconds','start_beats','duration_beats','pan','mode','bpm','step_beats','transpose_semitones','scale','swing','timbre','mapping'];
    const quote=x=>'"'+String(x??'').replace(/"/g,'""')+'"';
    return '\uFEFF'+names.join(',')+'\r\n'+events.map(e=>fields.map(k=>quote(k==='track'?(e.track||'A'):e[k])).join(',')).join('\r\n')+'\r\n';
  }
  function midi(events,p) {
    p=parameters(p); const list=[], ppq=480;
    const vlq=n=>{const a=[n&127];while((n>>>=7))a.unshift((n&127)|128);return a;};
    const tempo=Math.floor(60000000/p.bpm); list.push({t:0,order:0,b:[255,81,3,(tempo>>16)&255,(tempo>>8)&255,tempo&255]});
    const meta=new TextEncoder().encode(JSON.stringify({application:'BioSonify Lab',version:VERSION,profile:'biosonify-export-v1',mapping:MAPPING,...p}));
    list.push({t:0,order:0,b:[255,1,...vlq(meta.length),...meta]});
    for(const [channel,pan] of [[0,64],[1,0],[2,127]])list.push({t:0,order:0,b:[176|channel,10,pan]});
    for(const e of events){const ch=e.pan<0?1:e.pan>0?2:0, t=Math.round(e.startBeats*ppq), gate=Math.max(1,Math.round(e.durationBeats*ppq));list.push({t,order:2,b:[144|ch,e.pitch,e.velocity]},{t:t+gate,order:1,b:[128|ch,e.pitch,0]});}
    list.sort((a,b)=>a.t-b.t||a.order-b.order);const track=[];let prev=0;
    for(const e of list){track.push(...vlq(e.t-prev),...e.b);prev=e.t;}track.push(0,255,47,0);
    const bytes=new Uint8Array(22+track.length),v=new DataView(bytes.buffer);bytes.set([77,84,104,100]);v.setUint32(4,6);v.setUint16(8,0);v.setUint16(10,1);v.setUint16(12,480);bytes.set([77,84,114,107],14);v.setUint32(18,track.length);bytes.set(track,22);return bytes;
  }
  function wavInfo(events,sampleRate=22050){const frames=Math.floor((timelineEnd(events)+.08)*sampleRate);return {sampleRate,frames,bytes:44+frames*4,duration:frames/sampleRate};}
  function wav(events,progress=()=>{},maxBytes=64*1024*1024) {
    const {frames,bytes,sampleRate}=wavInfo(events);if(bytes>maxBytes)throw new Error(`WAV 约需 ${(bytes/1048576).toFixed(1)} MB，超过 64 MB；请缩小导出范围或提高 BPM。`);
    const out=new Uint8Array(bytes),view=new DataView(out.buffer);const ascii=(offset,s)=>[...s].forEach((c,i)=>view.setUint8(offset+i,c.charCodeAt(0)));
    ascii(0,'RIFF');view.setUint32(4,bytes-8,true);ascii(8,'WAVE');ascii(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,2,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*4,true);view.setUint16(32,4,true);view.setUint16(34,16,true);ascii(36,'data');view.setUint32(40,bytes-44,true);
    const sorted=[...events].sort((a,b)=>a.start-b.start).map(e=>({...e,begin:Math.floor(e.start*sampleRate),count:Math.max(1,Math.floor(e.duration*sampleRate)),hz:440*2**((e.pitch-69)/12),harmonics:harmonics(e.timbre,e.feature)}));
    let next=0,active=[];const size=8192;
    for(let offset=0;offset<frames;offset+=size){const end=Math.min(frames,offset+size), left=new Float64Array(end-offset),right=new Float64Array(end-offset);
      while(next<sorted.length&&sorted[next].begin<end)active.push(sorted[next++]);active=active.filter(e=>e.begin+e.count>offset);
      for(const e of active){const amp=.14*(e.velocity/127)*.82,lg=Math.sqrt((1-e.pan)/2),rg=Math.sqrt((1+e.pan)/2);
        for(let j=Math.max(offset,e.begin);j<Math.min(end,e.begin+e.count);j++){const k=j-e.begin,phase=2*Math.PI*e.hz*k/sampleRate,env=Math.min(1,k/(.02*sampleRate))*Math.min(1,(e.count-k)/(.035*sampleRate));let value=0;
          for(let h=1;h<e.harmonics.length;h++)value+=e.harmonics[h]*Math.sin(phase*h);value*=amp*env;left[j-offset]+=value*lg;right[j-offset]+=value*rg;
        }
      }
      for(let k=0;k<left.length;k++){view.setInt16(44+(offset+k)*4,Math.trunc(Math.max(-1,Math.min(1,left[k]))*32767),true);view.setInt16(46+(offset+k)*4,Math.trunc(Math.max(-1,Math.min(1,right[k]))*32767),true);}
      if(offset%(size*8)===0)progress(Math.round(end/frames*100));
    }
    progress(100); return out;
  }
  function scoreSVG(events,p) {
    const positions=[...new Set(events.map(e=>e.position))];if(positions.length>2048)throw new Error('SVG 每次最多导出 2,048 个位置，请缩小导出范围。');
    const columns=24, rows=Math.ceil(positions.length/columns), height=100+rows*215, width=1120;
    let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img"><title>BioSonify Lab 序列音符图</title><desc>横轴为序列位置，纵轴为 MIDI 音高。A 为参考序列，B 为比较序列。</desc><rect width="100%" height="100%" fill="#080f10"/><g font-family="Consolas, monospace" fill="#e8e9df"><text x="32" y="36" font-size="22">BioSonify Lab · ${p.mode==='science'?'科学模式':'创作模式'}</text><text x="32" y="63" font-size="13">${escapeXML(MAPPING)} · ${p.bpm} BPM · ${p.step} beat · ${escapeXML(p.scale)} · transpose ${p.transpose} · swing ${p.swing} · ${escapeXML(p.timbre)}</text>`;
    let min=127,max=0;for(const e of events){min=Math.min(min,e.pitch);max=Math.max(max,e.pitch);}min=Math.floor((min-2)/3)*3;max=Math.ceil((max+2)/3)*3;
    const byPos=new Map();for(const e of events){if(!byPos.has(e.position))byPos.set(e.position,[]);byPos.get(e.position).push(e);}
    for(let row=0;row<rows;row++){const y0=100+row*215;
      for(let n=min;n<=max;n+=(max-min>36?6:3)){const y=y0+140-(n-min)/(max-min)*140;s+=`<line x1="60" y1="${y}" x2="1090" y2="${y}" stroke="#39514a"/><text x="18" y="${y+4}" font-size="11">${n}</text>`;}
      for(let c=0;c<columns;c++){const pos=positions[row*columns+c];if(pos===undefined)break;const x=66+c*42;s+=`<text x="${x}" y="${y0+163}" font-size="10" fill="#adb6ad">${pos}</text>`;
        for(const e of byPos.get(pos)){const y=y0+140-(e.pitch-min)/(max-min)*140,variant=e.track==='B',outline=variant&&byPos.get(pos).some(a=>a.track!=='B'&&a.pitch===e.pitch),fill=variant?'#ff8b75':color(e.symbol,e.kind);s+=`<rect x="${x}" y="${y-(outline?6:4)}" width="29" height="${outline?12:8}" rx="2" fill="${outline?'none':fill}" stroke="${fill}"/><text x="${x}" y="${y0+180+(variant?15:0)}" font-size="11">${e.track||'A'}:${escapeXML(e.symbol)} ${e.pitch}</text>`;}
      }
    }
    return s+'</g></svg>';
  }
  const api={VERSION,MAPPING,AA,AA_PITCH,HYDRO,NUC,ALPHABETS,MAX_LENGTH,parseInput,parameters,makeEvents,compare,stats,noteName,color,harmonics,timelineEnd,csv,midi,wav,wavInfo,scoreSVG,escapeXML};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BioCore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
