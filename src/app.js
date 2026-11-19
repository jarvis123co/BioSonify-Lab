/* BioSonify Lab — offline workbench. */
(() => {
  'use strict';
  const C=BioCore, D=BioCompare, R=BioResearch, APP_VERSION='1.0.0', $=id=>document.getElementById(id), NS='http://www.w3.org/2000/svg';
  const samples={dna:'ATGCGTACGTTAGCATGCTAGCATCGATGCNA',rna:'AUGCGUACGUUAGCAUGCUAGCAUCGAUGCNA',protein:'MKTAYIAKQRQISFVKSHFSRQDILDLWIYHT'};
  const state={mode:'science',kind:'dna',compare:false,A:null,B:null,eventsA:[],eventsB:[],diffs:[],selected:1,track:'A',history:[],original:{A:null,B:null},worker:null,exportBusy:false,cancelExport:null,researchRecord:null,validParams:true,statsCache:{}};
  const player={ctx:null,analyser:null,signal:null,status:'stopped',offset:0,origin:0,queue:[],next:0,voices:new Set(),timer:null,frame:null,generation:0};
  const mobileLayout=window.matchMedia('(max-width:680px)');
  let view={min:48,max:84,lowY:330,highY:100,cell:32},scrollPending=false,lastPlaying=-1;
  function showNotice(message,error=false){$('notice').hidden=false;$('notice').classList.toggle('error',error);$('notice').textContent=message;}
  function clearNotice(){$('notice').hidden=true;}
  function getParams(){return C.parameters({mode:state.compare?'science':state.mode,bpm:$('bpm').value,timbre:state.compare?'protocol':$('timbre').value,step:$('step').value,scale:$('scale').value,transpose:$('transpose').value,swing:Number($('swing').value)/100});}
  function formatTime(s){if(!Number.isFinite(s))s=0;const m=Math.floor(s/60);return `${String(m).padStart(2,'0')}:${(s%60).toFixed(2).padStart(5,'0')}`;}
  function trackEvents(track){return track==='B'?state.eventsB:state.eventsA;}
  function trackRecord(track){return track==='B'?state.B:state.A;}
  function available(target){if(state.compare)return !!state.A&&!!state.B&&state.A.sequence.length===state.B.sequence.length;return target==='A'&&!!state.A;}
  function selectedEvents(target){if(state.compare)return available(target)?D.events(state.eventsA,state.eventsB,{cue:$('mutation-cue').checked,target}):[];return trackEvents(target).map(e=>({...e,track:target,pan:0}));}
  function sourceLength(target){return trackEvents(target==='both'?'A':target).length;}
  function remember(){state.history.push({a:$('sequence-a').value,b:$('sequence-b').value,kind:state.kind,selected:state.selected,track:state.track,original:{...state.original}});if(state.history.length>30)state.history.shift();$('undo').disabled=false;}
  function replaceSelected(symbol){const rec=trackRecord(state.track);if(!symbol||!rec||symbol===rec.sequence[state.selected-1])return;remember();state.original[state.track]??=rec.sequence;rec.sequence=rec.sequence.slice(0,state.selected-1)+symbol+rec.sequence.slice(state.selected);normalizeEditor(state.track);rebuild({resetRange:false});}
  function normalizeEditor(track){const rec=trackRecord(track);if(!rec)return;const el=$('sequence-'+track.toLowerCase());el.value=(rec.name==='自定义序列'?'':`>${rec.name}\n`)+rec.sequence;}
  function validateTrack(track){const low=track.toLowerCase(), status=$('validation-'+low);try{const rec=C.parseInput($('sequence-'+low).value,state.kind);state[track]=rec;status.textContent=`${rec.sequence.length.toLocaleString()} 个${state.kind==='protein'?'氨基酸':'碱基'} · 格式有效`;status.classList.remove('error');$('name-'+low).textContent=rec.name;return rec;}catch(e){state[track]=null;status.textContent=e.message;status.classList.add('error');$('name-'+low).textContent='';return null;}}
  function rebuild({resetRange=true,stop=true}={}) {
    if(stop)stopPlayback();
    clearNotice();let params;try{params=getParams();state.validParams=true;}catch(e){state.validParams=false;showNotice(e.message,true);disableActions();return;}
    validateTrack('A');if(state.compare)validateTrack('B');else state.B=null;
    state.eventsA=state.A?C.makeEvents(state.A.sequence,state.kind,params):[];
    state.eventsB=state.B?C.makeEvents(state.B.sequence,state.kind,params):[];
    state.statsCache={A:state.A?C.stats(state.A.sequence,state.kind):null,B:state.B?C.stats(state.B.sequence,state.kind):null};
    state.diffs=[];
    if(state.compare){try{if(!state.A||!state.B)throw new Error('请先修正两条序列的输入。');state.diffs=C.compare(state.A.sequence,state.B.sequence);$('diff-summary').textContent=state.diffs.length?`${state.diffs.length} 处差异 / ${state.A.sequence.length} 个位置`:'两条序列完全相同';$('diff-summary').classList.remove('error');}catch(e){$('diff-summary').textContent=e.message;$('diff-summary').classList.add('error');}}
    if(!state.compare)state.track='A';
    state.selected=Math.max(1,Math.min(state.selected,Math.max(state.eventsA.length,state.eventsB.length,1)));
    $('session-label').textContent=(state.A?.name||'等待输入')+' / '+(state.kind==='protein'?'Protein':state.kind.toUpperCase());
    $('next-diff').disabled=!state.diffs.length;
    for(const id of ['play-target','export-target']){for(const option of $(id).options)option.disabled=!available(option.value);if(!available($(id).value))$(id).value=state.A?'A':state.B?'B':'A';}
    if(resetRange){$('export-from').value=1;$('export-to').value=sourceLength($('export-target').value)||1;}
    $('export-from').max=$('export-to').max=sourceLength($('export-target').value)||1;
    $('position').max=$('position-range').max=Math.max(state.eventsA.length,state.eventsB.length,1);
    renderTimelineSetup();renderInspector();renderEvents();updateActions();
    $('duration').textContent=formatTime(C.timelineEnd(selectedEvents($('play-target').value)));
    $('clock').textContent=formatTime(0);$('sequence-total').textContent=`${Math.max(state.eventsA.length,state.eventsB.length).toLocaleString()} 个符号`;
    if(mobileLayout.matches&&$('inspector').open)keepInspectedNoteVisible();
    $('export-description').textContent=state.compare?`严格对照 · 突变提示${$('mutation-cue').checked?'开启':'关闭'}`:state.mode==='science'?'科学映射 · 原始位置与事件参数':'创作结果 · 同时保留原始音高与加工参数';
    $('mutation-cue').disabled=!state.compare||!available('both');
    $('comparison-state').textContent=$('mutation-cue').checked?'提示开启 · 差异位点力度 +20，并增加泛音':'提示关闭 · 保留符号固有力度，不额外强调差异';
  }
  function disableActions(){$('play').disabled=true;document.querySelectorAll('[data-export]').forEach(b=>b.disabled=true);}
  function updateActions(){$('play').disabled=!state.validParams||!available($('play-target').value)||player.status==='playing';$('pause').disabled=player.status!=='playing';document.querySelectorAll('[data-export]').forEach(b=>b.disabled=!state.validParams||!available($('export-target').value)||!!state.worker||state.exportBusy);$('save-research').disabled=!state.researchRecord||state.exportBusy;}
  function setCompare(on){state.compare=on;$('editor-b').hidden=!on;$('editors').classList.toggle('comparing',on);$('compare-summary').hidden=!on;$('comparison-controls').hidden=!on;$('inspect-track-label').hidden=!on;$('toggle-compare').setAttribute('aria-pressed',String(on));$('toggle-compare').textContent=on?'收起比较':'添加比较';$('creative').disabled=on;$('timbre').disabled=on;$('comparison-timbre').hidden=!on;$('timbre').options[0].textContent=on?'对照音色':'序列音色';if(on){state.savedTimbre=$('timbre').value;$('timbre').value='protocol';}else{if(state.savedTimbre)$('timbre').value=state.savedTimbre;state.track='A';$('inspect-track').value='A';}setMode(on?'science':state.mode);rebuild();}
  function setMode(mode){if(state.compare)mode='science';state.mode=mode;$('science').setAttribute('aria-pressed',String(mode==='science'));$('creative').setAttribute('aria-pressed',String(mode==='creative'));$('creative-controls').hidden=mode!=='creative';$('mode-description').textContent=state.compare?'严格对照 · 相同速度、时值与基础音色':mode==='science'?'固定音高映射 · 每个符号对应一个音符':'艺术加工 · 输出音高、节奏可调整，保留原始数据';rebuild({resetRange:false});}
  function setSelection(pos,{scroll=false,seek=false}={}){const count=Math.max(state.eventsA.length,state.eventsB.length);state.selected=Math.max(1,Math.min(count||1,Math.round(pos)||1));$('position').value=$('position-range').value=state.selected;if(scroll){const x=(state.selected-1)*view.cell,el=$('timeline-scroll');if(x<el.scrollLeft||x+view.cell>el.scrollLeft+el.clientWidth)el.scrollLeft=Math.max(0,x-el.clientWidth*.35);}renderTimeline();renderInspector();renderEvents();if(mobileLayout.matches&&$('inspector').open)keepInspectedNoteVisible();if(seek){const e=trackEvents($('play-target').value==='B'?'B':'A')[state.selected-1];if(e){const playing=player.status==='playing';haltVoices();player.offset=e.start;player.status='paused';$('play-status').textContent='已定位';$('clock').textContent=formatTime(player.offset);if(playing)startPlayback();else updateActions();}}}
  function yFor(n){return view.lowY-(n-view.min)/(view.max-view.min)*(view.lowY-view.highY);}
  function openInspector(){
    if(!mobileLayout.matches)return;
    if(!$('inspector').open)$('inspector').show();
    keepInspectedNoteVisible();
  }
  function keepInspectedNoteVisible(){
    requestAnimationFrame(()=>{const note=$('timeline').querySelector(`g[data-position="${state.selected}"][data-track="${state.track}"] .note`);if(!note)return;const r=note.getBoundingClientRect(),bottom=$('inspector').getBoundingClientRect().top-12,top=document.querySelector('.transport').getBoundingClientRect().bottom+12;if(r.bottom>bottom)window.scrollBy(0,r.bottom-bottom);else if(r.top<top)window.scrollBy(0,r.top-top);});
  }
  function renderTimelineSetup(){
    view.cell=Number($('zoom').value);view.highY=state.compare?126:100;let min=127,max=0;for(const events of [state.eventsA,state.eventsB])for(const e of events){min=Math.min(min,e.pitch);max=Math.max(max,e.pitch);}
    if(min>max){min=60;max=72;}view.min=Math.floor((min-2)/3)*3;view.max=Math.ceil((max+2)/3)*3;
    let axis='<text x="10" y="17" fill="var(--muted)" font-size="9">位点</text>';
    const stride=view.max-view.min>36?6:3;
    for(let n=view.min;n<=view.max;n+=stride)axis+=`<text x="43" y="${yFor(n)+3}" fill="var(--muted)" font-size="10" text-anchor="end" font-family="Consolas">${n}</text>${n%12===0?`<text x="5" y="${yFor(n)+3}" fill="var(--text)" font-size="9" font-family="Consolas">${C.noteName(n)}</text>`:''}`;
    axis+='<text x="20" y="50" fill="var(--accent)" font-weight="bold" font-size="12" font-family="Consolas">A</text>'+(state.compare?'<text x="20" y="76" fill="var(--variant)" font-weight="bold" font-size="12" font-family="Consolas">B</text>':'');
    axis+=`<text x="11" y="${state.compare?106:80}" fill="var(--muted)" font-size="8" font-family="Consolas">MIDI</text>`;
    $('pitch-axis').innerHTML=axis;
    $('timeline-space').style.width=Math.max($('timeline-scroll').clientWidth,Math.max(state.eventsA.length,state.eventsB.length)*view.cell)+'px';
    const chars=state.kind==='protein'?['A','S','K','D','C']:[...C.ALPHABETS[state.kind]];
    const labels=state.kind==='protein'?['疏水','极性','正电','负电','特殊']:chars;
    $('legend').innerHTML=chars.map((s,i)=>`<span style="--color:${C.color(s,state.kind)}">${labels[i]}</span>`).join('')+(state.compare?'<span style="--color:var(--variant)">B 比较</span>':'');
    renderTimeline();
  }
  function renderTimeline(){
    const el=$('timeline-scroll'), width=el.clientWidth||600, left=el.scrollLeft, start=Math.max(0,Math.floor(left/view.cell)-2),count=Math.max(state.eventsA.length,state.eventsB.length),end=Math.min(count,Math.ceil((left+width)/view.cell)+2);
    const svg=$('timeline');svg.style.left=left+'px';svg.setAttribute('width',width);svg.setAttribute('viewBox',`${left} 0 ${width} 360`);
    let content=`<rect x="${left}" y="0" width="${width}" height="26" fill="var(--field)"/><line x1="${left}" x2="${left+width}" y1="${state.compare?90:64}" y2="${state.compare?90:64}" stroke="var(--strong-line)"/>`;const stride=view.max-view.min>36?6:3;
    for(let n=view.min;n<=view.max;n+=stride)content+=`<line x1="${left}" y1="${yFor(n)}" x2="${left+width}" y2="${yFor(n)}" stroke="${n%12===0?'var(--plot-major)':'var(--plot-line)'}"/>`;
    for(let i=start;i<end;i++){
      const x=i*view.cell, selected=state.selected===i+1,ea=state.eventsA[i],eb=state.eventsB[i],diff=!!ea&&!!eb&&ea.symbol!==eb.symbol;
      content+=`<rect x="${x}" y="26" width="${view.cell}" height="325" fill="${selected?'var(--selected)':'transparent'}"/><line x1="${x}" y1="${state.compare?91:65}" x2="${x}" y2="350" stroke="var(--plot-line)" stroke-dasharray="${(i+1)%5===0?'0':'2 4'}"/><line x1="${x+view.cell/2}" x2="${x+view.cell/2}" y1="${(i+1)%5===0?20:23}" y2="26" stroke="var(--muted)"/>`;
      if(i===0||(i+1)%5===0||selected)content+=`<text x="${x+view.cell/2}" y="15" text-anchor="middle" fill="${selected?'var(--accent)':'var(--muted)'}" font-size="10">${i+1}</text>`;
      content+=`<rect data-position="${i+1}" x="${x}" y="27" width="${view.cell}" height="324" fill="transparent"/>`;
      for(const [e,track,variant] of [[ea,'A',false],[eb,'B',true]]){if(!e)continue;const same=ea&&eb&&ea.pitch===eb.pitch,cy=yFor(e.pitch),color=variant?'var(--variant)':C.color(e.symbol,e.kind),outline=variant&&same,baseY=variant?56:30;
        content+=`<g data-position="${i+1}" data-track="${track}"><title>${track} 第 ${i+1} 位 ${e.symbol} → ${C.noteName(e.pitch)} / MIDI ${e.pitch}${diff?' · 符号不同':''}</title><rect class="note" x="${x+3}" y="${cy-(outline?7:5)}" width="${Math.max(12,view.cell-7)}" height="${outline?14:10}" rx="0" fill="${outline?'none':color}" stroke="${diff?'var(--text)':color}"/><rect x="${x+2}" y="${baseY}" width="${view.cell-4}" height="24" fill="${color}" fill-opacity=".09"/><rect x="${x+2}" y="${baseY+22}" width="${view.cell-4}" height="2" fill="${color}"/><text x="${x+view.cell/2}" y="${baseY+18}" text-anchor="middle" fill="var(--text)" font-size="13" font-weight="${diff?'bold':'normal'}">${e.symbol}${diff?'*':''}</text></g>`;
      }
    }
    if(!count)content+=`<text x="${left+25}" y="210" fill="var(--muted)" font-size="13">输入有效序列后，音符会出现在这里。</text>`;
    svg.innerHTML=content;$('visible-range').textContent=count?`位置 ${Math.floor(left/view.cell)+1}–${Math.min(count,Math.ceil((left+width)/view.cell))}`:'等待序列';
  }
  function inspectedEvent(track){const a=state.eventsA[state.selected-1],b=state.eventsB[state.selected-1];return state.compare&&a&&b&&available('both')?D.events([a],[b],{cue:$('mutation-cue').checked,target:track})[0]:trackEvents(track)[state.selected-1];}
  function renderInspector(){
    const e=inspectedEvent(state.track);$('position').value=$('position-range').value=state.selected;$('stats-track').textContent='轨道 '+state.track;
    $('selected-symbol').textContent=e?.symbol||'—';$('selected-symbol').style.color=e?C.color(e.symbol,e.kind):'';$('selected-note').textContent=e?C.noteName(e.pitch):'—';$('selected-midi').textContent=e?`MIDI ${e.pitch}`:'无事件';
    $('inspect-open').textContent=e?`第 ${e.position} 位 · ${e.symbol} → ${C.noteName(e.pitch)}　编辑 ↑`:'输入有效序列后编辑位点';$('inspect-open').disabled=!e;
    $('selected-detail').textContent=e?`${state.kind==='protein'?'氨基酸':'碱基'} ${e.symbol} · 力度 ${e.velocity}${e.sourceVelocity!==undefined&&e.sourceVelocity!==e.velocity?`（原始 ${e.sourceVelocity}）`:""}\n${e.start.toFixed(3)} 秒开始，持续 ${e.duration.toFixed(3)} 秒${state.mode==='creative'?` · 原始 MIDI ${e.basePitch}`:''}`:'选择有效序列中的一个位置。';
    const a=state.eventsA[state.selected-1],b=state.eventsB[state.selected-1];$('selected-diff').hidden=!(state.compare&&a&&b);
    if(a&&b)$('selected-diff').textContent=a.symbol===b.symbol?`A / B 此处相同：${a.symbol} · MIDI ${a.pitch}`:`A ${a.symbol} / ${a.pitch} → B ${b.symbol} / ${b.pitch}（${b.pitch-a.pitch>=0?'+':''}${b.pitch-a.pitch} 半音）`;
    $('replace-symbols').innerHTML=[...C.ALPHABETS[state.kind]].map(s=>`<button data-symbol="${s}" aria-label="替换为 ${s}" aria-pressed="${e?.symbol===s}" ${e?'':'disabled'}>${s}</button>`).join('');
    const original=state.original[state.track]?.[state.selected-1];
    $('reset-site').disabled=!e||!original||e.symbol===original;
    $('reset-site').title=original?`将轨道 ${state.track} 第 ${state.selected} 位恢复为 ${original}`:'当前位点未修改';
    renderMolecule();if(player.status!=='playing')renderSignal(false);
    const rec=trackRecord(state.track);if(!rec){$('stat-length').textContent='—';$('stat-extra').textContent='—';$('composition').innerHTML='';$('composition').setAttribute('height','0');$('stats-caption').textContent='修正输入后查看统计。';return;}
    const stats=state.statsCache[state.track];$('stat-length').textContent=stats.length.toLocaleString();$('stat-extra-label').textContent=state.kind==='protein'?'符号种类':'GC 占比';$('stat-extra').innerHTML=state.kind==='protein'?Object.values(stats.counts).filter(Boolean).length:stats.gc.toFixed(1)+'<small>%</small>';
    const chars=[...C.ALPHABETS[state.kind]],height=chars.length*23+5;let graph='';
    for(let i=0;i<chars.length;i++){const s=chars[i],n=stats.counts[s],w=n/stats.length*143;graph+=`<text x="0" y="${i*23+13}" fill="var(--text)" font-size="11" font-family="Consolas">${s}</text><rect x="22" y="${i*23+4}" width="143" height="9" rx="2" fill="var(--bar-bg)"/><rect x="22" y="${i*23+4}" width="${w}" height="9" rx="2" fill="${C.color(s,state.kind)}"/><text x="223" y="${i*23+13}" text-anchor="end" fill="var(--muted)" font-size="10" font-family="Consolas">${n}</text>`;}
    $('composition').setAttribute('viewBox',`0 0 225 ${height}`);$('composition').setAttribute('height',height);$('composition').innerHTML='<title>符号计数：'+Object.entries(stats.counts).map(([s,n])=>`${s} ${n}`).join('，')+'</title>'+graph;
    $('stats-caption').textContent=state.kind==='protein'?'颜色按氨基酸类别分组。柱长表示该符号占序列的比例。':`GC = (G + C) / 全部 ${stats.length} 个碱基。${stats.unknown?`含 ${stats.unknown} 个未知碱基 N。`:'当前没有未知碱基。'}`;
  }
  function renderMolecule(){
    const rec=trackRecord(state.track),svg=$('molecule'),width=Math.max(260,svg.clientWidth),capacity=Math.max(5,Math.min(21,Math.floor(width/46))),sequence=rec?.sequence||'',count=Math.min(capacity,sequence.length),start=Math.max(0,Math.min(sequence.length-count,state.selected-1-Math.floor(count/2))),dna=state.kind==='dna';
    svg.setAttribute('viewBox',`0 0 ${width} 160`);
    $('strand-title').textContent=(dna?'DNA · 互补配对':state.kind==='rna'?'RNA · 单链序列':'PROTEIN · 氨基酸链')+'示意';
    $('strand-range').textContent=count?`轨道 ${state.track} / ${start+1}–${start+count}`:'等待输入';
    $('strand-caption').textContent=dna?'上链来自输入，下链按碱基互补关系推导；不表示真实空间结构。':'按输入顺序连接符号；不推断折叠或真实空间结构。';
    const complement={A:'T',T:'A',C:'G',G:'C',N:'N'},nodes=[];
    for(let j=0;j<count;j++){const i=start+j,x=count===1?width/2:27+j*(width-54)/(count-1),wave=Math.sin(i*.6);nodes.push({i,x,y:dna?50+wave*12:77+wave*23,y2:112-wave*12,s:sequence[i]});}
    const curve=(key)=>nodes.map((n,j)=>j?`C${(nodes[j-1].x+n.x)/2} ${nodes[j-1][key]} ${(nodes[j-1].x+n.x)/2} ${n[key]} ${n.x} ${n[key]}`:`M${n.x} ${n[key]}`).join(' ');
    let html=`<path d="${curve('y')}" fill="none" stroke="#41dcea" stroke-width="3" opacity=".65"/>`;
    if(dna&&count)html+=`<text x="3" y="${nodes[0].y-19}" fill="#a3c8bd" font-size="9">5′</text><text x="3" y="${nodes[0].y2+24}" fill="#a3c8bd" font-size="9">3′</text><text x="${width-15}" y="${nodes.at(-1).y-19}" fill="#a3c8bd" font-size="9">3′</text><text x="${width-15}" y="${nodes.at(-1).y2+24}" fill="#a3c8bd" font-size="9">5′</text>`;
    if(dna)html+=`<path d="${curve('y2')}" fill="none" stroke="#ff8b75" stroke-width="3" opacity=".6"/>`;
    for(const n of nodes){const selected=n.i+1===state.selected,other=state.track==='A'?state.B:state.A,diff=other?.sequence[n.i]&&other.sequence[n.i]!==n.s,color=C.color(n.s,state.kind);html+=`<g data-mol-position="${n.i+1}" tabindex="0" role="button" aria-label="选择轨道 ${state.track} 第 ${n.i+1} 位 ${n.s}"><title>第 ${n.i+1} 位 ${n.s}${dna?' · 互补 '+complement[n.s]:''}</title>`;
      if(selected)html+=`<rect x="${n.x-20}" y="9" width="40" height="142" rx="20" fill="#ffffff" opacity=".055"/>`;
      html+=`<text x="${n.x}" y="20" fill="${selected?'#ffc46a':'#8ba59c'}" font-size="10" text-anchor="middle">${n.i+1}${diff?'*':''}</text>`;
      if(dna){const b=complement[n.s],cc=C.color(b==='?'?'N':b,'dna');for(let k=0;k<(n.s==='G'||n.s==='C'?3:2);k++)html+=`<path d="M${n.x-3+k*4} ${n.y+14}V${n.y2-14}" stroke="${n.s==='N'?'#5f756a':'#709b8a'}" opacity=".6" stroke-dasharray="${n.s==='N'?'2 3':'0'}"/>`;html+=`<circle cx="${n.x}" cy="${n.y2}" r="12" fill="#0b1614" stroke="${cc}" stroke-width="1.5"/><text x="${n.x}" y="${n.y2+4}" text-anchor="middle" fill="${cc}" font-size="12">${b}</text>`;}
      html+=`<circle class="base-node" cx="${n.x}" cy="${n.y}" r="${selected?15:13}" fill="${selected?color:'#0b1614'}" stroke="${color}" stroke-width="${selected?2.5:1.5}"/><text x="${n.x}" y="${n.y+5}" text-anchor="middle" fill="${selected?'#090a10':color}" font-weight="bold" font-size="14">${n.s}</text></g>`;
    }
    if(!count)html='<text x="20" y="82" fill="#a3a4b8" font-size="12">输入有效序列后显示符号链。</text>';
    svg.innerHTML=html;
  }
  function renderSignal(live){
    const target=$('play-target').value,e=inspectedEvent(live?(target==='B'?'B':'A'):state.track),hz=e?440*2**((e.pitch-69)/12):0,values=new Float32Array(240);let peak=0;
    if(live&&player.analyser){player.analyser.getFloatTimeDomainData(player.signal);for(let i=0;i<values.length;i++)values[i]=player.signal[Math.floor(i*player.signal.length/values.length)];}
    else if(e){const h=C.harmonics(e.timbre,e.audioFeature??e.feature);for(let i=0;i<values.length;i++){let v=0;for(let n=1;n<h.length;n++)v+=h[n]*Math.sin(2*Math.PI*hz*(i/values.length*.012)*n);values[i]=v*.14*e.velocity/127*.82;}}
    let d='';for(let i=0;i<values.length;i++){peak=Math.max(peak,Math.abs(values[i]));d+=(i?'L':'M')+(i*360/(values.length-1)).toFixed(1)+' '+(56-Math.max(-1,Math.min(1,values[i]*4))*48).toFixed(1);}
    $('scope-wave').setAttribute('d',d);$('scope-status').textContent=live?'实时合成输出':'选中音符预览';
    const b=live&&target==='both'?state.eventsB[state.selected-1]:null;
    $('signal-hz').innerHTML=hz?(b?hz.toFixed(1)+' / '+(440*2**((b.pitch-69)/12)).toFixed(1):hz.toFixed(2))+' <small>Hz</small>':'—';
    $('signal-hz').classList.toggle('dual-frequency',!!b);
    $('signal-level').textContent=live?(peak>1e-5?'混合峰值 '+(20*Math.log10(peak)).toFixed(1)+' dBFS':'静音'):'选中音高 · 12 ms';
  }
  function renderEvents(){let rows='';const count=Math.max(state.eventsA.length,state.eventsB.length),start=Math.max(0,Math.min(count-3,state.selected-2));for(let i=start;i<Math.min(count,start+3);i++)for(const [events,track] of [[state.eventsA,'A'],[state.eventsB,'B']]){const e=events[i];if(!e)continue;rows+=`<tr class="${e.position===state.selected?'is-selected':''}"><td>${e.position}</td><td class="${track==='B'?'variant-cell':''}">${track} / ${e.symbol}</td><td>${e.basePitch}</td><td>${e.pitch} · ${C.noteName(e.pitch)}</td><td>${e.start.toFixed(3)}</td><td>${e.duration.toFixed(3)}</td></tr>`;}$('event-rows').innerHTML=rows||'<tr><td colspan="6">等待有效序列</td></tr>';}
  function haltVoices(){player.generation++;clearInterval(player.timer);cancelAnimationFrame(player.frame);for(const voice of player.voices){try{voice.osc.stop();}catch{}voice.osc.disconnect();voice.gain.disconnect();voice.pan.disconnect();}player.voices.clear();$('playhead').hidden=true;}
  function currentTime(){return player.status==='playing'?Math.max(0,player.ctx.currentTime-player.origin):player.offset;}
  function stopPlayback(){haltVoices();player.status='stopped';player.offset=0;lastPlaying=-1;$('clock').textContent=formatTime(0);$('play-status').textContent='就绪';renderSignal(false);updateActions();}
  function pausePlayback(reason='已暂停'){if(player.status!=='playing')return;player.offset=currentTime();haltVoices();player.status='paused';$('play-status').textContent=reason;renderSignal(false);updateActions();}
  function sound(e,when,duration){const ctx=player.ctx,osc=ctx.createOscillator(),gain=ctx.createGain(),pan=ctx.createStereoPanner(),h=C.harmonics(e.timbre,e.audioFeature??e.feature),real=new Float32Array(h.length),imag=new Float32Array(h);osc.setPeriodicWave(ctx.createPeriodicWave(real,imag,{disableNormalization:true}));osc.frequency.value=440*2**((e.pitch-69)/12);pan.pan.value=D.webAudioPan(e.pan);const amp=.14*(e.velocity/127)*.82,attack=duration>=.055?.02:Math.min(.02,duration*.25),release=duration>=.055?.035:Math.min(.035,duration*.3);gain.gain.setValueAtTime(0,when);gain.gain.linearRampToValueAtTime(amp,when+attack);gain.gain.setValueAtTime(amp,Math.max(when+attack,when+duration-release));gain.gain.linearRampToValueAtTime(0,when+duration);osc.connect(gain).connect(pan).connect(player.analyser);const voice={osc,gain,pan};player.voices.add(voice);osc.onended=()=>{player.voices.delete(voice);osc.disconnect();gain.disconnect();pan.disconnect();};osc.start(when);osc.stop(when+duration+.002);}
  function scheduler(){if(player.status!=='playing')return;const now=player.ctx.currentTime;while(player.next<player.queue.length){const e=player.queue[player.next],at=player.origin+e.start;if(at>now+.12)break;player.next++;const end=at+e.duration;if(end>now){const when=Math.max(now+.002,at);if(end>when)sound(e,when,end-when);}}}
  function animate(){if(player.status!=='playing')return;renderSignal(true);const t=currentTime(),end=C.timelineEnd(player.queue);$('clock').textContent=formatTime(Math.min(t,end));if(t>=end+.025){haltVoices();player.status='stopped';player.offset=0;$('play-status').textContent='播放完成';$('clock').textContent=formatTime(end);renderSignal(false);updateActions();return;}
    const target=$('play-target').value,events=trackEvents(target==='B'?'B':'A');let low=0,high=events.length;while(low<high){const mid=(low+high)>>1;if(events[mid].start<=t)low=mid+1;else high=mid;}const i=Math.max(0,low-1),e=events[i];if(e){const next=events[i+1]?.start??(e.start+getParams().step*60/getParams().bpm),fraction=Math.min(1,Math.max(0,(t-e.start)/(next-e.start))),x=(i+fraction)*view.cell;$('playhead').hidden=false;$('playhead').style.left=x+'px';if(i!==lastPlaying){lastPlaying=i;state.selected=i+1;renderInspector();renderEvents();if($('follow').checked){const el=$('timeline-scroll');if(x<el.scrollLeft||x>el.scrollLeft+el.clientWidth-view.cell)el.scrollLeft=Math.max(0,x-el.clientWidth*.25);}renderTimeline();}}
    player.frame=requestAnimationFrame(animate);
  }
  async function startPlayback(){if(!state.validParams||!available($('play-target').value)||player.status==='playing')return;const token=++player.generation;try{if(!player.ctx){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw new Error('此浏览器无法开启 Web Audio，请使用支持音频的浏览器。');player.ctx=new Audio();player.analyser=player.ctx.createAnalyser();player.analyser.fftSize=512;player.signal=new Float32Array(512);player.analyser.connect(player.ctx.destination);player.ctx.onstatechange=()=>{if(player.ctx.state!=='running'&&player.status==='playing')pausePlayback('音频已暂停，点击播放继续');};}await player.ctx.resume();if(token!==player.generation)return;if(player.ctx.state!=='running')throw new Error('音频尚未开启，请再次点击播放。');player.queue=selectedEvents($('play-target').value).sort((a,b)=>a.start-b.start||a.pan-b.pan);if(player.offset>=C.timelineEnd(player.queue))player.offset=0;player.next=0;while(player.next<player.queue.length&&player.queue[player.next].start+player.queue[player.next].duration<=player.offset)player.next++;player.origin=player.ctx.currentTime+.03-player.offset;player.status='playing';$('play-status').textContent=$('play-target').value==='both'?'播放中 · A 左 / B 右':'播放中 · 轨道 '+$('play-target').value;updateActions();scheduler();player.timer=setInterval(scheduler,25);animate();}catch(e){player.status='stopped';showNotice(e.message,true);updateActions();}}
  function download(data,name,type){const blob=data instanceof Blob?data:new Blob([data],{type}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
  function exportEvents(){const target=$('export-target').value;if(!available(target))throw new Error('请先修正需要导出的序列。');const from=Number($('export-from').value),to=Number($('export-to').value),length=sourceLength(target);if(!Number.isInteger(from)||!Number.isInteger(to)||from<1||to<from||to>length)throw new Error(`导出范围需在 1–${length} 之间，结束位置不得小于起始位置。`);const ev=selectedEvents(target).filter(e=>e.position>=from&&e.position<=to);const first=ev[0];return ev.map(e=>({...e,start:Math.round((e.start-first.start)*1e6)/1e6,startBeats:Math.round((e.startBeats-first.startBeats)*1e6)/1e6,baseStart:Math.round((e.baseStart-first.baseStart)*1e6)/1e6}));}
  function researchSpec(p,events){
    const target=$('export-target').value,from=Number($('export-from').value),to=Number($('export-to').value),first=trackEvents(target==='B'?'B':'A')[from-1];
    const inputs=(state.compare?['A','B']:[target]).map(track=>({track,name:trackRecord(track).name,rawText:$('sequence-'+track.toLowerCase()).value,sequence:trackRecord(track).sequence,length:trackRecord(track).sequence.length,inputMeaning:'current editor text after any edits'}));
    return {application:{name:'BioSonify Lab',version:APP_VERSION,edition:'Research-Ready'},mapping:C.MAPPING,kind:state.kind,parameters:p,
      comparison:{enabled:state.compare,profile:state.compare?D.PROFILE:null,cueMode:state.compare&&$('mutation-cue').checked?'mutation-emphasis':'none',alignment:'position-only',differences:state.compare?[...state.diffs]:[]},
      selection:{target,from,to,positionBase:1,timeOrigin:'rebased-to-selection',sourceStartSeconds:first.start,sourceStartBeats:first.startBeats,sourceBaseStartSeconds:first.baseStart},
      rendering:{wav:{sampleRate:22050,channels:2,pcmBits:16,tailSeconds:.08,panLaw:'linear-power-sqrt',attackSeconds:.02,releaseSeconds:.035},midi:{ppq:480,tempoMicrosecondsPerQuarter:Math.floor(60000000/p.bpm),timbre:'external-player'},live:{engine:'Web Audio',sampleRate:'device-dependent; separate from WAV',resume:'remaining note retriggered'}},
      sourceScripts:{core:$('biocore').textContent,comparison:$('biocompare').textContent,research:$('bioresearch').textContent,app:$('bioapp').textContent},inputs,events};
  }
  function cancelWav(){state.cancelExport?.();}
  function renderWav(events){return new Promise((resolve,reject)=>{
    const source=$('biocore').textContent+`\nonmessage=e=>{try{const bytes=BioCore.wav(e.data,p=>postMessage({progress:p}));postMessage({bytes:bytes.buffer},[bytes.buffer]);}catch(e){postMessage({error:e.message});}};`;
    const url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));state.worker=new Worker(url);URL.revokeObjectURL(url);
    state.cancelExport=()=>{state.exportCancelled=true;state.worker?.terminate();$('export-progress').hidden=true;reject(new DOMException('已取消 WAV 导出。','AbortError'));};
    $('export-progress').hidden=false;$('wav-progress').value=0;$('wav-status').textContent='正在合成 WAV';
    state.worker.onmessage=({data})=>{if(data.progress!==undefined)$('wav-progress').value=data.progress;else if(data.error)reject(new Error(data.error));else if(data.bytes)resolve(data.bytes);};
    state.worker.onerror=()=>reject(new Error('WAV 合成未完成，请缩小导出范围后重试。'));
    state.worker.postMessage(D.audioEvents(events));
  });}
  async function doExport(type){
    if(state.exportBusy)return;
    try{
      clearNotice();const p=getParams(),events=exportEvents(),spec=researchSpec(p,events),target=spec.selection.target;
      const name=`BioSonify-${p.mode}-${state.kind}-${target}-${spec.selection.from}-${spec.selection.to}${state.compare?'-strict-'+($('mutation-cue').checked?'cue-on':'cue-off'):''}`;
      if(type==='svg'&&spec.selection.to-spec.selection.from+1>2048)throw new Error('SVG 每次最多导出 2,048 个位置，请缩小导出范围。');
      if(type==='wav'&&C.wavInfo(events).bytes>64*1048576)throw new Error('WAV 超过 64 MB；请缩小导出范围或提高 BPM。');
      state.exportBusy=true;state.exportCancelled=false;updateActions();
      const run=await R.capture(spec);
      const formats={midi:['mid','audio/midi'],wav:['wav','audio/wav'],csv:['csv','text/csv;charset=utf-8'],svg:['svg','image/svg+xml']};
      const [extension,mimeType]=formats[type],data=type==='midi'?D.midi(events,p):type==='csv'?D.csv(events):type==='svg'?C.scoreSVG(events,p):await renderWav(events);
      const filename=name+'.'+extension,record=await R.addArtifact(run,{format:type,filename,mimeType},data,state.researchRecord);
      if(state.exportCancelled)throw new DOMException('已取消 WAV 导出。','AbortError');
      download(data,filename,mimeType);state.researchRecord=record;
      $('research-status').textContent=`上次导出：${record.kind.toUpperCase()} · ${record.selection.target} · 位置 ${record.selection.from}–${record.selection.to} · ${record.artifacts.map(a=>a.format.toUpperCase()).join(' / ')}`;
      showNotice(`${type.toUpperCase()} 已生成。可保存对应研究记录，保留输入、参数、事件与文件校验值。`);
    }catch(e){showNotice(e.message,e.name!=='AbortError');}
    finally{state.worker?.terminate();state.worker=null;state.cancelExport=null;state.exportBusy=false;$('export-progress').hidden=true;updateActions();}
  }
  function project(){return {format:'biosonify-project-v1',version:APP_VERSION,comparison:{profile:D.PROFILE,cue:$('mutation-cue').checked},kind:state.kind,mode:state.mode,compare:state.compare,inputA:$('sequence-a').value,inputB:$('sequence-b').value,parameters:getParams(),creative:{step:Number($('step').value),transpose:Number($('transpose').value),scale:$('scale').value,swing:Number($('swing').value)/100},selected:state.selected};}
  function loadProject(data){if(data.format!=='biosonify-project-v1'||!C.ALPHABETS[data.kind]||!['science','creative'].includes(data.mode)||typeof data.inputA!=='string'||typeof data.inputB!=='string'||data.inputA.length>2000000||data.inputB.length>2000000||typeof data.compare!=='boolean')throw new Error('项目文件格式不正确。');if(data.comparison!==undefined&&(data.comparison?.profile!==D.PROFILE||typeof data.comparison?.cue!=='boolean'))throw new Error('项目中的对照设置不正确。');const p=C.parameters({...data.parameters,mode:data.mode}),creative=C.parameters({...data.creative,mode:'creative',bpm:p.bpm,timbre:p.timbre});remember();state.original={A:null,B:null};state.kind=data.kind;$('kind').value=data.kind;$('sequence-a').value=data.inputA;$('sequence-b').value=data.inputB;$('bpm').value=p.bpm;$('timbre').value=p.timbre;$('step').value=creative.step;$('transpose').value=creative.transpose;$('scale').value=creative.scale;$('swing').value=creative.swing*100;$('swing-value').textContent=$('swing').value+'%';state.selected=Number(data.selected)||1;$('mutation-cue').checked=data.comparison?.cue===true;setCompare(data.compare);state.savedTimbre=p.timbre;$('timbre').value=data.compare?'protocol':p.timbre;setMode(data.mode);showNotice('项目已打开。');}
  $('sequence-a').value=samples.dna;
  for(const track of ['A','B']){const low=track.toLowerCase(),field=$('sequence-'+low);field.addEventListener('beforeinput',()=>{if(!state.history.length||state.history.at(-1)[low]!==field.value)remember();});field.addEventListener('input',()=>{state.original[track]=null;rebuild();});$('import-'+low).onclick=()=>$('file-'+low).click();$('file-'+low).onchange=async e=>{const file=e.target.files[0];e.target.value='';if(!file)return;try{if(file.size>2000000)throw new Error('FASTA 文件超过 2 MB，请先分段。');const text=await file.text();C.parseInput(text,state.kind);remember();state.original[track]=null;field.value=text;rebuild();}catch(err){showNotice(err.message,true);}};}
  $('kind').onchange=()=>{remember();state.original={A:null,B:null};state.kind=$('kind').value;rebuild();};
  $('sample').onclick=()=>{remember();state.original.A=null;if(state.compare)state.original.B=null;$('sequence-a').value=samples[state.kind];if(state.compare)$('sequence-b').value=samples[state.kind].slice(0,8)+(state.kind==='protein'?'A':'C')+samples[state.kind].slice(9);state.selected=1;rebuild();};
  $('toggle-compare').onclick=()=>setCompare(!state.compare);
  $('mutation-cue').onchange=()=>rebuild({resetRange:false});
  $('copy-a').onclick=()=>{remember();state.original.B=null;$('sequence-b').value=$('sequence-a').value;rebuild();};
  $('science').onclick=()=>setMode('science');$('creative').onclick=()=>setMode('creative');
  for(const id of ['bpm','timbre','transpose','scale','step'])$(id).onchange=()=>rebuild({resetRange:false});
  $('swing').oninput=()=>{$('swing-value').textContent=$('swing').value+'%';rebuild({resetRange:false});};
  $('zoom').oninput=()=>{const old=view.cell,el=$('timeline-scroll'),pos=el.scrollLeft/old;renderTimelineSetup();el.scrollLeft=pos*view.cell;renderTimeline();};
  $('inspect-track').onchange=()=>{state.track=$('inspect-track').value;renderInspector();if(mobileLayout.matches&&$('inspector').open)keepInspectedNoteVisible();};
  $('position').onchange=()=>setSelection(Number($('position').value),{scroll:true,seek:true});$('position-range').oninput=()=>setSelection(Number($('position-range').value),{scroll:true,seek:true});
  $('timeline-scroll').onscroll=()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(()=>{renderTimeline();scrollPending=false;});}};
  $('timeline').onclick=e=>{const node=e.target.closest('[data-position]');if(!node)return;if(node.dataset.track){state.track=node.dataset.track;$('inspect-track').value=state.track;}setSelection(Number(node.dataset.position),{seek:true});openInspector();};
  $('timeline-scroll').onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End',' '].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft')setSelection(state.selected-1,{scroll:true,seek:true});if(e.key==='ArrowRight')setSelection(state.selected+1,{scroll:true,seek:true});if(e.key==='Home')setSelection(1,{scroll:true,seek:true});if(e.key==='End')setSelection(1e9,{scroll:true,seek:true});if(e.key===' ')player.status==='playing'?pausePlayback():startPlayback();};
  $('replace-symbols').onclick=e=>replaceSelected(e.target.dataset.symbol);
  $('reset-site').onclick=()=>replaceSelected(state.original[state.track]?.[state.selected-1]);
  $('undo').onclick=()=>{const h=state.history.pop();if(!h)return;$('sequence-a').value=h.a;$('sequence-b').value=h.b;state.kind=h.kind;$('kind').value=h.kind;state.selected=h.selected;state.track=h.track;$('inspect-track').value=h.track;state.original={...h.original};rebuild();$('undo').disabled=!state.history.length;};
  $('next-diff').onclick=()=>{if(!state.diffs.length)return;setSelection(state.diffs.find(n=>n>state.selected)||state.diffs[0],{scroll:true,seek:true});openInspector();};
  $('play').onclick=startPlayback;$('pause').onclick=()=>pausePlayback();$('stop').onclick=stopPlayback;
  $('play-target').onchange=()=>{stopPlayback();$('duration').textContent=formatTime(C.timelineEnd(selectedEvents($('play-target').value)));};
  $('export-target').onchange=()=>{$('export-from').value=1;$('export-to').value=$('export-to').max=$('export-from').max=sourceLength($('export-target').value)||1;updateActions();};
  document.querySelectorAll('[data-export]').forEach(b=>b.onclick=()=>doExport(b.dataset.export));$('cancel-wav').onclick=()=>{cancelWav();showNotice('已取消 WAV 导出。');};
  $('save-research').onclick=()=>{const record=state.researchRecord;if(!record||state.exportBusy)return;download(JSON.stringify(record,null,2),'BioSonify-research-'+record.runId.slice(0,16)+'.json','application/json');showNotice('研究记录已保存，对应上次导出的输入与文件。');};
  $('save-project').onclick=()=>{try{download(JSON.stringify(project(),null,2),'BioSonify-project.json','application/json');showNotice('项目已保存为 JSON，包含原始输入与音乐参数。');}catch(e){showNotice(e.message,true);}};
  $('open-project').onclick=()=>$('project-file').click();$('project-file').onchange=async e=>{const file=e.target.files[0];e.target.value='';if(!file)return;try{if(file.size>5000000)throw new Error('项目文件超过 5 MB。');loadProject(JSON.parse(await file.text()));}catch(err){showNotice(err.message,true);}};
  $('help-open').onclick=()=>$('help').showModal();$('help-close').onclick=()=>$('help').close();$('help').onclick=e=>{if(e.target===$('help')&&e.clientX< $('help').getBoundingClientRect().left)$('help').close();};
  $('mapping-table').innerHTML='<h3>DNA / RNA</h3><div class="mapping-grid">'+Object.entries(C.NUC).map(([s,n])=>`<span>${s} → ${n}</span>`).join('')+'</div><h3>Protein</h3><div class="mapping-grid">'+Object.entries(C.AA_PITCH).map(([s,n])=>`<span>${s} → ${n}</span>`).join('')+'</div>';
  document.documentElement.dataset.theme='dark';
  document.documentElement.dataset.mobileView='bench';
  document.documentElement.dataset.editorOpen='false';
  document.querySelectorAll('button[data-mobile-view]').forEach(button=>button.onclick=()=>{document.documentElement.dataset.mobileView=button.dataset.mobileView;if(mobileLayout.matches&&$('inspector').open)$('inspector').close();document.querySelectorAll('button[data-mobile-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));requestAnimationFrame(()=>{renderTimelineSetup();renderMolecule();window.scrollTo({top:Math.max(0,document.querySelector('.transport').offsetTop-6),behavior:'instant'});});});
  $('sequence-expand').onclick=()=>{const open=document.documentElement.dataset.editorOpen!=='true';document.documentElement.dataset.editorOpen=String(open);$('sequence-expand').setAttribute('aria-expanded',String(open));$('sequence-expand').textContent=open?'收起输入 ↑':'编辑 / 导入';};
  $('inspect-open').onclick=openInspector;$('inspector-close').onclick=()=>$('inspector').close();
  const adaptInspector=()=>{if(mobileLayout.matches){if($('inspector').open)$('inspector').close();}else $('inspector').setAttribute('open','');};mobileLayout.addEventListener('change',adaptInspector);adaptInspector();
  $('playback-options').onclick=()=>{const open=document.querySelector('.transport').classList.toggle('options-open');$('playback-options').setAttribute('aria-expanded',String(open));$('playback-options').setAttribute('aria-label',open?'收起播放设置':'展开播放设置');};
  $('theme-toggle').onclick=()=>{const contrast=document.documentElement.dataset.theme!=='contrast';document.documentElement.dataset.theme=contrast?'contrast':'dark';$('theme-toggle').setAttribute('aria-pressed',String(contrast));$('theme-toggle').textContent=contrast?'标准对比':'增强对比';};
  $('molecule').onclick=e=>{const node=e.target.closest('[data-mol-position]');if(node){setSelection(Number(node.dataset.molPosition),{scroll:true,seek:true});openInspector();}};
  $('molecule').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){const node=e.target.closest('[data-mol-position]');if(node){e.preventDefault();setSelection(Number(node.dataset.molPosition),{scroll:true,seek:true});openInspector();}}};
  new ResizeObserver(renderMolecule).observe($('molecule'));
  $('version').textContent='v'+APP_VERSION;
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pausePlayback('后台已暂停');});
  window.addEventListener('pagehide',()=>{stopPlayback();cancelWav();});
  new ResizeObserver(()=>renderTimelineSetup()).observe($('timeline-scroll'));
  rebuild();
  // A read-only diagnostic snapshot is used by browser regression checks.
  window.BioLab={snapshot:()=>({kind:state.kind,mode:state.mode,selected:state.selected,compare:state.compare,cue:$('mutation-cue').checked,diffs:[...state.diffs],countA:state.eventsA.length,countB:state.eventsB.length,eventsA:state.eventsA.slice(0,100),eventsB:state.eventsB.slice(0,100),player:player.status,audioState:player.ctx?.state,offset:currentTime(),voices:player.voices.size}),exportEvents,project};
})();
