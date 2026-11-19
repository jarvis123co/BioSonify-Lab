# English user guide

## Input and playback

Open `BioSonify-Lab.html` locally. The interface is currently Chinese; molecule selectors and export format names use Latin labels. Choose the molecule type before entering sequence text. Uppercase and lowercase input and whitespace-separated sequence lines normalize to the same symbols. FASTA input is limited to one record per track. Unsupported symbols, empty input and multiple records are rejected. DNA accepts ACGTN, RNA ACGUN, and Protein the 20 standard amino acids. ACGT is not assigned a molecule type automatically.

Click play to enable audio. Pause retains the playback position; stop ends playback. BPM controls time. Scientific mode fixes the sequence-to-pitch mapping and the 0.3-beat step. A timbre change affects sound quality. Creative mode allows changes to transposition, scale, step and swing; exports preserve the original values.

Click a symbol or its note to select a position. The site editor shows its source symbol and pitch. Replacing a symbol updates the event. Undo reverts an edit; reset restores the selected position's original input value. The sequence-aligned timeline scrolls horizontally. Within it, arrow keys change the selection, Home/End go to the first/last position, and Space toggles playback.

## Compare a substitution

Enter `ACGTACGT` as DNA track A and use the add-comparison control to enter `ACGTGCGT` as B. Equal-length, same-type comparison identifies position 5. With the mutation cue off, A uses pitch 60 and velocity 64, while B uses pitch 67 and velocity 84. At 100 BPM both events start at 0.72 seconds and last 0.1476 seconds.

Both tracks use a common baseline sound. Simultaneous A/B playback uses logical pan −0.82/+0.82; individual auditions are centered. The cue adds 20 velocity units at changed positions, capped at 120, and a second harmonic in Web Audio/WAV. Turning it on changes the auditory presentation without editing the source sequence. MIDI includes velocity emphasis; its instrument is controlled by the external player. Comparison CSV includes the cue mode, changed flag and original and output values.

## Export and preserve a run

Choose track A, B or both, then set the first and last positions to export. Export MIDI, WAV, CSV or SVG. Original one-based positions remain in the events; range export time starts at zero and the research record stores the offset.

Save the research JSON after the output downloads finish. It captures the input snapshot used by the export, normalized sequences, settings, events, source hashes and file checksums. Exporting other formats for the same run merges them into that record. A new run replaces the last in-memory record, so download it before starting another run. Project JSON serves a different purpose: restoring editable application state.

Output files and research JSON can contain the source sequence. Keep them with the data they describe and share them intentionally. No automatic network upload is performed.

## Control labels

| Chinese label | English meaning |
| --- | --- |
| 科学模式 / 创作模式 | Scientific / creative mode |
| 序列输入 / 序列编辑器 | Sequence input / editor |
| 载入示例 | Load example |
| 导入 FASTA | Import FASTA |
| 添加比较 | Add comparison |
| 原始序列 / 比较序列 | Reference sequence / variant sequence |
| 播放 / 暂停 / 停止 | Play / pause / stop |
| 播放对象 | Playback target |
| 突变提示 | Mutation emphasis cue |
| 位点编辑 / 替换此处符号 | Position editor / replace this symbol |
| 撤销 / 复位 | Undo / reset selected position |
| 跟随播放 | Follow playback |
| 输出文件 / 导出轨道 | Export files / export track |
| 起始位置 / 结束位置 | First / last export position |
| 保存研究记录 JSON | Save research record JSON |
| 打开项目 / 保存项目 | Open / save project |
| 数据 / 导出 | Data / export mobile workspace |

## Limits

The application accepts at most 100,000 symbols. Each WAV is limited to 64 MiB and each SVG to 2,048 positions. Export smaller ranges as needed. Unequal lengths and alignment are not supported. The N symbol stays N in the DNA complementary display and has MIDI pitch 66; it represents an unknown nucleotide.

MIDI and WAV are ordinary musical carriers without Seq2Music's exact reversible metadata. Use the event records for exact interpretation. Physical-phone behavior and human perceptual benefit have not been established by the retained desktop and simulated-viewport checks.
