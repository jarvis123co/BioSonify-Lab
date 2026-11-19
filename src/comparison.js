/* Positional comparison is separate from the frozen sequence mapping. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./core.js'));else root.BioCompare=factory(root.BioCore);})(typeof globalThis!=='undefined'?globalThis:this,function(C){
  'use strict';
  const PROFILE='biosonify-strict-comparison-v1';
  function events(a,b,{cue=false,target='both'}={}){
    if(!a.length||a.length!==b.length)throw new Error('严格对照需要两条有效、等长的序列。');
    if(!['A','B','both'].includes(target))throw new Error('请选择 A、B 或双轨。');
    const out=[];
    for(let i=0;i<a.length;i++){
      const x=a[i],y=b[i];
      if(x.kind!==y.kind||x.mode!=='science'||y.mode!=='science'||x.bpm!==y.bpm||x.start!==y.start||x.duration!==y.duration||x.step!==.3||y.step!==.3)throw new Error('严格对照要求同类型、同速度及科学映射。');
      const changed=x.symbol!==y.symbol;
      for(const [e,track,pan] of [[x,'A',-.82],[y,'B',.82]]){
        if(target!=='both'&&target!==track)continue;
        out.push({...e,event:out.length+1,track,pan:target==='both'?pan:0,timbre:'protocol',
          sourceVelocity:e.velocity,sourceFeature:e.feature,feature:changed?'substitution':'match',
          audioFeature:cue&&changed?'positive':'match',velocity:cue&&changed?Math.min(120,e.velocity+20):e.velocity,
          comparison:PROFILE,cueMode:cue?'mutation-emphasis':'none',changed,
          referenceSymbol:x.symbol,variantSymbol:y.symbol,pitchDelta:y.pitch-x.pitch});
      }
    }
    return out;
  }
  function audioEvents(events){return events.map(e=>({...e,feature:e.audioFeature??e.feature}));}
  // Map the reference linear-power pan to Web Audio's angular pan control.
  function webAudioPan(pan){return 2/Math.PI*Math.asin(pan);}
  function csv(events){
    if(!events.some(e=>e.comparison))return C.csv(events);
    const fields=['comparison','cueMode','changed','referenceSymbol','variantSymbol','pitchDelta','sourceVelocity','sourceFeature','audioFeature'];
    const names=['comparison_profile','cue_mode','changed','reference_symbol','variant_symbol','pitch_delta_semitones','source_velocity','source_feature','audio_feature'];
    const rows=C.csv(events).trimEnd().split('\r\n');
    rows[0]+=','+names.join(',');
    for(let i=0;i<events.length;i++)rows[i+1]+=','+fields.map(k=>'"'+String(events[i][k]??'').replace(/"/g,'""')+'"').join(',');
    return rows.join('\r\n')+'\r\n';
  }
  function midi(events,p){
    const bytes=C.midi(events,p);if(!events.some(e=>e.comparison))return bytes;
    // The frozen writer emits a single track with explicit status bytes.
    let i=22;
    const vlq=()=>{let n=0,b;do{b=bytes[i++];n=n*128+(b&127);}while(b&128);return n;};
    while(i<bytes.length){vlq();const status=bytes[i++];if(status===255){i++;const size=vlq();i+=size;}else if(status===241||status===240||status===247){throw new Error('不支持的 MIDI 事件。');}else{if((status&240)===176&&bytes[i]===10){if((status&15)===1)bytes[i+1]=12;if((status&15)===2)bytes[i+1]=115;}i+=((status&240)===192||(status&240)===208)?1:2;}}
    // Descriptive text only; this is not a reversible Seq2Music codec.
    const label=new TextEncoder().encode(JSON.stringify({comparison:PROFILE,cueMode:events[0].cueMode,panLeft:-.82,panRight:.82}));
    const size=[];let n=label.length;size.unshift(n&127);while((n>>>=7))size.unshift((n&127)|128);
    const meta=new Uint8Array([0,255,1,...size,...label]),out=new Uint8Array(bytes.length+meta.length);
    out.set(bytes.subarray(0,22));out.set(meta,22);out.set(bytes.subarray(22),22+meta.length);
    new DataView(out.buffer).setUint32(18,out.length-22);return out;
  }
  return Object.freeze({PROFILE,events,audioEvents,webAudioPan,csv,midi});
});
