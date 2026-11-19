> Historical record. Local profile paths redacted for publication; scientific results retained. See ../../VALIDATION.md for the current scope.

# BioSonify Lab｜对照实验与独立验证总结

2026-11-17，Asia/Shanghai。被测版本 **v0.3.1**。技术检查在当前覆盖范围内通过；比较模式和可逆载体存在明确兼容差异。尚无真实参与者数据，不能证明可听化提高识别效率或准确率。

本轮最后一次完整执行 **204 项检查判据通过，0 失败**；另完成最小有损解码反例与试题生成器检查。204 项包含分组回归检查，并非 204 个互相独立的用户功能。首轮有 3 项浏览器频率读数误判，原失败摘要保留在后面的 `prior_runs`，处理过程见下文。

稳定版 HTML 与全部 src 文件的 SHA-256 在执行前后完全相同。没有覆盖发行包、修改应用或项目策略文件。只新增总结、感知方案和复跑脚本；本轮音频、MIDI、CSV、MusicXML、FASTA、截图、日志、运行副本和临时目录均已清理，既有历史验证资料未删除。

## 1. 环境与基准来源

| 对象 | 实际使用 |
|---|---|
| 应用 | 本地 BioSonify Lab v0.3.1；从交付 HTML 提取核心代码执行，并核实与 src/core.js 完全相同 |
| 参考 | 本机插件缓存中的 Seq2Music 0.3.2 原始 Python 实现；直接执行原函数和 encode/decode 命令流程 |
| 来源 | `<LOCAL_PROFILE>\.codex\plugins\cache\openai-curated-remote\seq2music\0.3.2\scripts\seq2music.py` |
| 参考源码 SHA-256 | `7ec4a7fa6211f6c429031b3fd1df89371f7d1aae356ae8e695df647b74c45ba2` |
| 交付 HTML SHA-256 | `96725b199c12135d554651752d546de34d43bd6dabaae0897ccdc6e668c13610` |
| 运行环境 | Python 3.12.14、NumPy 2.3.5、Node v24.22.1、Windows Edge 157.0.4341.60 |
| 参考自带测试 | 61 项：56 通过、5 跳过；测试文件未修改，跳过按原平台条件执行 |
| 应用已有测试 | 临时副本中核心 14 项、浏览器 21 项通过；均重新执行，未仅引用旧报告 |

已完整读取 mapping-contract、roundtrip-contract、audio-score-import 和 evidence-boundaries，并记录每份文件哈希。此次取得原源码，映射结论属于原实现交叉验证，**不属于 spec-only 自测**。没有声称对应某个未经核实的远端 Git 提交。

## 2. 固定变量与执行前判据

主载体实验：分子类型显式指定，100 BPM，每符号 0.3 拍，82% gate，原始音高，无移调、和声或摇摆，protocol 音色，WAV 22,050 Hz、双声道、16-bit PCM、末尾 80 ms 余量；单轨 pan=0。MIDI 480 PPQ，tempo 为整数微秒/四分音符。

事件补充矩阵覆盖 40 / 100 / 137 / 240 BPM 与 0.25 / 0.3 / 0.5 / 1 拍。应用科学模式固定 0.3 拍；其余三种时值通过无艺术变换的创作模式测试，不能记成可调时值的科学模式。载体声学检查集中在 100 BPM / 0.3 拍主条件，未声称所有参数组合都完成声学验收。

| 项目 | 事先固定的判据 |
|---|---|
| 位置、符号、音高、Velocity、Pan、顺序 | 单序列逐事件精确一致 |
| 事件起点与时长 | 1 微秒，另加 1e-12 秒数值比较余量 |
| MIDI | 音符、力度、通道、on/off tick 与 tempo 精确一致 |
| WAV | 时长误差 ≤ 1 帧；音高误差 ≤ 25 cents；起止误差各 ≤ 2 ms；RMS 差 ≤ 0.5 dB；归一化 PCM RMSE ≤ 0.0001；非静音且无削波 |
| 播放调度 | 原生 Web Audio 计划起止误差 ≤ 3 ms；声像正确 |
| 播放指示 | 相对音频渲染时钟的位点边界误差 ≤ 60 ms；与物理声卡输出分开 |
| 确定性 | 相同输入、参数至少 3 次，区分规范化语义哈希与文件哈希 |

主矩阵与阈值的计划哈希两轮相同：`7b33bc0d5aff8c31aba5a16eee4d7f9b6c4e8f3803652d2f1f536fcfca22a2f2`。实时浏览器 AudioContext 本机为 48,000 Hz；该组用于原生调度与画面同步，不与 22,050 Hz WAV 直接进行逐采样比较。

## 3. 完整样本

| 编号 | 类型 | 序列 / 目的 |
|---|---|---|
| A | DNA | `ACGTACGT` |
| B | DNA | `ACGTGCGT`，第 5 位 A→G |
| C | DNA | `ACGTNACGT`，未知碱基 |
| D | RNA | `ACGUACGU`，U 与 T 的类型区分 |
| E | Protein | `ACDEFGHIKLMNPQRSTVWY`，全部 20 种标准氨基酸 |
| R | DNA | `AAAAAAAAAAAAAAAA`，重复符号 |
| 长序列 | DNA | `ACGT` 重复 25,000 次，共 100,000 个符号 |
| 超限 | DNA | `A` 重复 100,001 次 |

异常/规范化输入：空字符串、`ACXG`、`acgtn`、带空格换行与注释的单记录 FASTA、多记录 FASTA、未指定类型的 `ACGT`、显式 DNA 与 Protein 的 `ACGT`、DNA 中的 `ACGU`、RNA 中的 `ACGT`。完整字符串和实际返回消息见后面的 `input_cases` 与对应检查。每个异常/规范化用例重复 3 次。

FASTA 样本：`>control\nac g\ntn\n;comment`；多记录样本：`>a\nAC\n>b\nGT`。这里的 `\n` 表示换行。

## 4. 实际结果与一致性指标

| 实验 | 结果 |
|---|---|
| A 映射 | 96 组、1,104 个事件，离散字段 100% 一致；本次最大起点/时长差为 0。另有 100,000 事件规范化流哈希一致 |
| 已知规则 | DNA A=60、C=64、G=67、T=72、N=66；RNA U=72；蛋白质全部 20 音高分别与明确表值和原函数核对通过 |
| B 变异 | 差异仅位于第 5 位：A→G，60→67，Velocity 64→84；其他位置事件保持一致，时间不变 |
| B 双轨 | 应用 MIDI 通道 1/2 对应硬左/硬右；WAV 左右通道分别与独立单轨合成逐采样相同，交叉声道为零；浏览器原生声像也已核对 |
| B CSV | A/B 原始符号、位置、音高和时间可按 position 对齐得出唯一差异；CSV 没有单独的“突变类型”列 |
| B 播放 | 3 次双轨播放，每次 16 个原生声音事件。调度误差约浮点机器精度；最大画面边界误差 30.0 ms，符合预设 60 ms。物理扬声器/耳机同步未测 |
| C MIDI | A–E 与 R 的音符 on/off、音高、力度、tempo、PPQ 与原插件严格载体的音乐部分一致；另用自写 SMF 解析器与插件解析器分别读取 |
| C WAV | 6 组时长帧数相同；最大音高误差 0.004687 cents、起点误差 0.227 ms、结束误差 0.544 ms。此环境中 PCM 数据哈希也相同；WAV 整个文件因元数据不同而不同 |
| C CSV | 使用 Python CSV 解析器逐行核对位置、符号、音高、力度、起点、时长与 Pan；全部与参考事件一致。两者文件列结构不同，不要求跨实现 CSV 字节相同 |
| D 可复现 | 两套实现各对 A–E、R 重复 3 次；同一实现内事件/载体哈希稳定。另在离线浏览器中对 A–E 每组下载 3 次 MIDI/WAV/CSV，哈希稳定且等于已独立验证的核心产物 |
| E 离线 | file URL 直接加载，浏览器网络设为离线；播放、编辑、复位、比较及真实下载通过；0 HTTP(S) 请求、0 页面异常 |

长序列核心事件生成本机约 149.8 ms。浏览器另实际输入并定位到第 99,999 位。该结果不等于手机性能承诺，未合成或保留十万个音符的完整音频文件。

## 5. 已确认的差异与未支持能力

| 范围 | BioSonify Lab | Seq2Music 原实现 | 状态 |
|---|---|---|---|
| 比较声像 | −1 / +1，硬左右 | −0.82 / +0.82 | 产品规则不同 |
| 第 5 位变异力度 | A=64、B=84 | A=84、B=104，非匹配加 20 | 产品规则不同，原插件有额外突变强调 |
| 比较事件表顺序 | 先全部 A，再全部 B | 按位置交替 reference/variant | 序列化顺序不同；播放按时间排序 |
| 比较音色类别 | 原符号的类别 | match/substitution 等比较类别 | 声音表达不同 |
| 类型省略 | 拒绝，要求明确类型 | auto 将 ACGT 判为 DNA | 显式类型策略不同 |
| MIDI 容器 | 本地参数文本，无 Seq2Music codec | 专用 0x7F 嵌入元数据 | 不兼容严格可逆载体 |
| WAV 容器 | 普通 PCM，无 s2mc | PCM 摘要绑定的 s2mc | 不兼容严格可逆载体 |
| MusicXML / FASTA 反向恢复 | 未实现 | 已实现；参考自产载体完整往返通过 | BioSonify 不支持 |
| 插入、删除和对齐 | 拒绝不等长比较 | 有界 Needleman–Wunsch | BioSonify 不支持 |

MIDI 中未使用的声像通道初始化也不同，因此“音乐事件一致”不能写成整个 MIDI 文件或所有控制事件逐字节一致。应用未实现的 codec 不以文档阅读冒充通过；三种 codec 的要求已核查，只有原插件自产载体实际取得 `exact-embedded`、`exact-manifest-matched`、`exact-wav-embedded`、`exact-score-embedded`。

对 BioSonify 的普通 MIDI，严格解码实际拒绝缺失元数据；显式允许旧式恢复时状态为 `edited-or-unverified`。对其 WAV，状态为 `lossy-audio-quantized`，没有任何 BioSonify 产物取得 exact 状态。

## 6. 失败反例、原因与处理

### 有损音频恢复的最小复现

固定 100 BPM、0.3 拍、protocol 音色，将下列序列导出为 BioSonify WAV，再以插件默认 0.08 秒窗口、0.015 静音阈值、相邻符号折叠执行 `audio-decode --kind ...`：

- DNA `N`、Protein `D`：找不到超过静音阈值的有声窗口。
- DNA `A`：恢复为 `A`，作为阳性对照。
- DNA `AA`：恢复为 `A`；`AAA`→`AA`；`AAAA`→`AAA`。
- 完整样本 C 丢失 N；样本 E 恢复为 `ACFGHILMNPQSTVWY`；R 的 16 个 A 恢复为 12 个 A。

原文件声学音高和时序检查通过，问题发生在无元数据的窗口推断：低力度符号可能低于静音阈值，相邻同音可能被折叠。不能通过改高科学映射力度或更改参考阈值来包装成精确恢复；本轮保留原规则，将这些结果明确归为有损解码限制。复现代码已加入 `lossy_probes`。

### 首轮频率读数检查的修正

首轮 3 次播放的时间条件均满足，但频率读数被错误地要求接近双精度计算值到 1e-8 Hz。Web Audio 的 AudioParam 使用 WebIDL `float`；例如 C4 的双精度计算值为 261.6255653005986 Hz，规范要求的单精度值为 261.6255798339844 Hz。依据 [W3C AudioParam 规范](https://www.w3.org/TR/webaudio/#AudioParam)，后续改为与独立 IEEE-754 binary32 转换结果**完全相等**。实测最大双精度差为 0.000029067 Hz，全部原生读数与单精度预期完全相等。

首轮失败信息未删除或改写。修正发生在测量脚本的表示类型比较，应用及原插件未改动；事件、MIDI、声学和时序阈值均保持原值。随后重新执行原矩阵及全部回归，结果为 204 项通过。没有发现需要覆盖稳定版来修复的技术实现缺陷。

## 7. 证据等级与实用性判断

- **已独立验证一致：** 规范化单序列的基础映射、时序、力度、顺序与居中声像；本次单轨 MIDI 音符、WAV PCM 和 CSV 共同字段；三次可复现与当前浏览器离线操作。
- **仅规范/源码核查：** BioSonify 对 MusicXML、可逆编码与结构/对齐等未实现功能的支持边界。不能声称这些功能符合协议或测试通过。
- **存在差异：** 比较模式的力度、声像、类别与事件表顺序；类型推断策略；载体元数据和 CSV 格式。
- **尚无独立证据：** 人类识别增益、学习效果、真实 Android/iPhone、物理声卡端到端延迟、跨浏览器/跨操作系统文件字节确定性、外部 DAW/硬件 MIDI 播放、参数空间中未测的声学组合。

**建议进入小规模感知先导实验准备。** 原因是可重复的输入、变异与声音事件已能被控制和验证；这只建立了实验基础。先完成专用盲测呈现端、实际输出计时与设备校准，再采集数据。详见 [感知实验方案](perception-experiment.md)。108 题生成与 18 个平衡分配单元已检查，没有真实参与者或模拟响应结果。

## 8. 可重复执行与保留内容

运行命令（开发环境需 Python/NumPy、Node/Playwright 与 Edge；应用本身仍无需这些依赖）：

```powershell
$env:NODE_PATH='<LOCAL_PROFILE>\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
$env:PYTHONIOENCODING='utf-8'
$env:PYTHONDONTWRITEBYTECODE='1'
& '<LOCAL_PROFILE>\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -B tests/control-study.py
& '<LOCAL_PROFILE>\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -B tests/perception-trials.py --self-check
```

`tests/control-study.py` 负责临时副本、原实现调用、独立 MIDI/CSV/PCM 分析及清理；`tests/control-study.cjs` 读取交付 HTML、生成对照事件并执行离线浏览器流程。参考路径可用 `--reference` 指定。正文中的最小有损诊断在完整复跑后单独执行并清理，现已纳入相同运行脚本；对应执行哈希分别记录，未将新增诊断冒充之前的 204 项。

只保留本总结、[感知方案](perception-experiment.md)和三个测试/试题脚本。汇总里的哈希、指标、返回状态及少量失败消息属于总结证据，不包含生成载体或参与者记录。运行脚本自动清理临时目录；若参考源码缺失，会明确报错，不能继续产生“原实现一致”的结论。

## 9. 逐项汇总与哈希

以下为实际运行汇总，包含原始失败摘要、最终结果、参考版本/哈希、每组判据和三次重复哈希。可用于复核上述结论。

```json
{
  "date": "2026-11-17T00:51:41.841113+08:00",
  "environment": {
    "python": "3.12.14 (main, Aug 25 2026, 14:01:42) [MSC v.1944 64 bit (AMD64)]",
    "node": "v24.22.1",
    "numpy": "2.3.5",
    "os": "Windows-11-10.0.26300-SP0"
  },
  "production": {
    "BioSonify-Lab.html": "96725b199c12135d554651752d546de34d43bd6dabaae0897ccdc6e668c13610",
    "src\\app.js": "f3cda0e34335f9f0a20b68c0eeb05b869cb7f6cdc54217a46bc9712bf22f5f35",
    "src\\body.html": "97105efcd088b98e83792b99a4e3a8b06730a9d9ed3b8c69eb28b368e8aa3a2e",
    "src\\core.js": "18007ffeaa74b883aa78f81f32549e54e63adbb649cc8f495d0b66d67018d813",
    "src\\page.css": "2c2d25ee466db48fe9ae65aecc3c368f1f6f511fd4eb4695a6f9051510f06611"
  },
  "limits": {
    "event_seconds": 1.000001e-06,
    "midi_ticks": 0,
    "wav_frames": 1,
    "pitch_cents": 25,
    "onset_seconds": 0.002,
    "offset_seconds": 0.002,
    "rms_delta_db": 0.5,
    "pcm_normalized_rmse": 0.0001,
    "visual_seconds": 0.06,
    "scheduled_seconds": 0.003,
    "rms_floor": 0.001
  },
  "checks": [
    {
      "name": "existing-reference-events",
      "status": "pass",
      "detail": {
        "exit": 0,
        "tail": "Generated 48 reference event cases from Seq2Music 0.3.2\n"
      }
    },
    {
      "name": "existing-core",
      "status": "pass",
      "detail": {
        "exit": 0,
        "tail": "✔ Known DNA / RNA pitch alphabets and protein identity palette (2.4855ms)\n✔ Reference implementation agrees across all alphabets, four BPMs and four steps (4.7195ms)\n✔ Repeated events are deterministic; scientific mode ignores creative transforms (0.2941ms)\n✔ FASTA normalizes whitespace and case; ambiguous type must be explicit (0.4673ms)\n✔ Single substitution is localized, including repeated bases; unequal lengths refused (0.1571ms)\n✔ BPM changes seconds inversely while MIDI beat positions remain stable (0.1045ms)\n✔ Creative scale/transpose/swing retains source values and monotonic timing (0.2646ms)\n✔ Statistics retain N in denominator and count all amino acids (0.2072ms)\n✔ MIDI serializes valid tempo, beat timestamps, velocities and both pan channels (2.0492ms)\n✔ WAV is PCM 16-bit stereo, non-silent, finite, deterministic and spectrally mapped (16.9279ms)\n✔ WAV hard left produces silence on right; export byte budget is enforced (2.7913ms)\n✔ CSV contains one row per event with original/output pitches and seconds (1.1945ms)\n✔ SVG emits explicit event labels and refuses unbounded visual exports (2.4413ms)\n✔ 100k event mapping is complete and bounded by validated length (57.4508ms)\nℹ tests 14\nℹ suites 0\nℹ pass 14\nℹ fail 0\nℹ cancelled 0\nℹ skipped 0\nℹ todo 0\nℹ duration_ms 184.1323\n"
      }
    },
    {
      "name": "existing-browser",
      "status": "pass",
      "detail": {
        "exit": 0,
        "tail": "PASS Single HTML boots directly from file URL while offline \nPASS User-gesture playback, moving position, pause/resume and stop \nPASS Single-symbol editing refreshes pitch and undo restores input \nPASS BPM timing and invalid-parameter action gating \nPASS Invalid symbols and multi-record FASTA rejected; valid import preserves label \nPASS Equal-length comparison, exact differing position, stereo playback and length guard \nPASS Equal pitches in two tracks share the exact vertical coordinate \nPASS Creative transforms preserve base pitch; science restores mapping \nPASS RNA and protein input, note generation and live playback \nPASS All four download formats, dual-track range export and preserved original positions \nPASS Downloaded WAV decoded and played by browser native audio {\n  channels: 2,\n  sampleRate: 22050,\n  duration: 0.5875736961451247,\n  currentTime: 0.097366,\n  error: null\n}\nPASS Project JSON save/open restores both sequences and settings \nPASS 100k-symbol input, virtual timeline and jump near sequence end { elapsedMs: 103, visibleSvgNodes: 286 }\nPASS Oversized WAV / SVG gives useful range guidance \nPASS Keyboard timeline navigation and accessible help dialog \nPASS Large background WAV render can be canceled and editor remains available \nPASS Touch viewport 320px: playback, pause, comparison, editing, vertical scroll, no page overflow \nPASS Touch viewport 390px: playback, pause, comparison, editing, vertical scroll, no page overflow \nPASS Touch viewport 768px: playback, pause, comparison, editing, vertical scroll, no page overflow \nPASS Touch viewport 1024px: playback, pause, comparison, editing, vertical scroll, no page overflow \nPASS No page errors and zero HTTP(S) requests across tested offline sessions \n"
      }
    },
    {
      "name": "reference-original-suite",
      "status": "pass",
      "detail": ".......seq2music: output exists: \\\\?\\<LOCAL_PROFILE>\\AppData\\Local\\Temp\\biosonify-control-i4bf7pg8\\ref-unit\\tmp0lqd5os2\\decoded; pass --force to replace it\n...ss..s........................s...............s.....\n----------------------------------------------------------------------\nRan 61 tests in 2.953s\n\nOK (skipped=5)\n"
    },
    {
      "name": "data-harness",
      "status": "pass",
      "detail": ""
    },
    {
      "name": "shipping-HTML-matches-source",
      "status": "pass",
      "detail": null
    },
    {
      "name": "mapping-A-40-0.25",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-A-40-0.3",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-A-40-0.5",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-A-40-1",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-A-100-0.25",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-A-100-0.3",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-A-100-0.5",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-A-100-1",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-A-137-0.25",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-A-137-0.3",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-A-137-0.5",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-A-137-1",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-A-240-0.25",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-A-240-0.3",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-A-240-0.5",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-A-240-1",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-B-40-0.25",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-B-40-0.3",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-B-40-0.5",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-B-40-1",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-B-100-0.25",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-B-100-0.3",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-B-100-0.5",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-B-100-1",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-B-137-0.25",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-B-137-0.3",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-B-137-0.5",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-B-137-1",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-B-240-0.25",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-B-240-0.3",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-B-240-0.5",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-B-240-1",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-C-40-0.25",
      "status": "pass",
      "detail": {
        "events": 9,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-C-40-0.3",
      "status": "pass",
      "detail": {
        "events": 9,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-C-40-0.5",
      "status": "pass",
      "detail": {
        "events": 9,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-C-40-1",
      "status": "pass",
      "detail": {
        "events": 9,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-C-100-0.25",
      "status": "pass",
      "detail": {
        "events": 9,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-C-100-0.3",
      "status": "pass",
      "detail": {
        "events": 9,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-C-100-0.5",
      "status": "pass",
      "detail": {
        "events": 9,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-C-100-1",
      "status": "pass",
      "detail": {
        "events": 9,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-C-137-0.25",
      "status": "pass",
      "detail": {
        "events": 9,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-C-137-0.3",
      "status": "pass",
      "detail": {
        "events": 9,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-C-137-0.5",
      "status": "pass",
      "detail": {
        "events": 9,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-C-137-1",
      "status": "pass",
      "detail": {
        "events": 9,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-C-240-0.25",
      "status": "pass",
      "detail": {
        "events": 9,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-C-240-0.3",
      "status": "pass",
      "detail": {
        "events": 9,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-C-240-0.5",
      "status": "pass",
      "detail": {
        "events": 9,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-C-240-1",
      "status": "pass",
      "detail": {
        "events": 9,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-D-40-0.25",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-D-40-0.3",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-D-40-0.5",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-D-40-1",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-D-100-0.25",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-D-100-0.3",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-D-100-0.5",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-D-100-1",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-D-137-0.25",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-D-137-0.3",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-D-137-0.5",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-D-137-1",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-D-240-0.25",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-D-240-0.3",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-D-240-0.5",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-D-240-1",
      "status": "pass",
      "detail": {
        "events": 8,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-E-40-0.25",
      "status": "pass",
      "detail": {
        "events": 20,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-E-40-0.3",
      "status": "pass",
      "detail": {
        "events": 20,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-E-40-0.5",
      "status": "pass",
      "detail": {
        "events": 20,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-E-40-1",
      "status": "pass",
      "detail": {
        "events": 20,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-E-100-0.25",
      "status": "pass",
      "detail": {
        "events": 20,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-E-100-0.3",
      "status": "pass",
      "detail": {
        "events": 20,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-E-100-0.5",
      "status": "pass",
      "detail": {
        "events": 20,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-E-100-1",
      "status": "pass",
      "detail": {
        "events": 20,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-E-137-0.25",
      "status": "pass",
      "detail": {
        "events": 20,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-E-137-0.3",
      "status": "pass",
      "detail": {
        "events": 20,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-E-137-0.5",
      "status": "pass",
      "detail": {
        "events": 20,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-E-137-1",
      "status": "pass",
      "detail": {
        "events": 20,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-E-240-0.25",
      "status": "pass",
      "detail": {
        "events": 20,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-E-240-0.3",
      "status": "pass",
      "detail": {
        "events": 20,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-E-240-0.5",
      "status": "pass",
      "detail": {
        "events": 20,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-E-240-1",
      "status": "pass",
      "detail": {
        "events": 20,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-R-40-0.25",
      "status": "pass",
      "detail": {
        "events": 16,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-R-40-0.3",
      "status": "pass",
      "detail": {
        "events": 16,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-R-40-0.5",
      "status": "pass",
      "detail": {
        "events": 16,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-R-40-1",
      "status": "pass",
      "detail": {
        "events": 16,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-R-100-0.25",
      "status": "pass",
      "detail": {
        "events": 16,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-R-100-0.3",
      "status": "pass",
      "detail": {
        "events": 16,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-R-100-0.5",
      "status": "pass",
      "detail": {
        "events": 16,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-R-100-1",
      "status": "pass",
      "detail": {
        "events": 16,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-R-137-0.25",
      "status": "pass",
      "detail": {
        "events": 16,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-R-137-0.3",
      "status": "pass",
      "detail": {
        "events": 16,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-R-137-0.5",
      "status": "pass",
      "detail": {
        "events": 16,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-R-137-1",
      "status": "pass",
      "detail": {
        "events": 16,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-R-240-0.25",
      "status": "pass",
      "detail": {
        "events": 16,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-R-240-0.3",
      "status": "pass",
      "detail": {
        "events": 16,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-R-240-0.5",
      "status": "pass",
      "detail": {
        "events": 16,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "mapping-R-240-1",
      "status": "pass",
      "detail": {
        "events": 16,
        "max_seconds_error": 0,
        "mismatches": []
      }
    },
    {
      "name": "science-ignores-artistic-parameters",
      "status": "pass",
      "detail": null
    },
    {
      "name": "public-pitch-table-A",
      "status": "pass",
      "detail": null
    },
    {
      "name": "public-pitch-table-B",
      "status": "pass",
      "detail": null
    },
    {
      "name": "public-pitch-table-C",
      "status": "pass",
      "detail": null
    },
    {
      "name": "public-pitch-table-D",
      "status": "pass",
      "detail": null
    },
    {
      "name": "public-pitch-table-E",
      "status": "pass",
      "detail": null
    },
    {
      "name": "public-pitch-table-R",
      "status": "pass",
      "detail": null
    },
    {
      "name": "input-empty",
      "status": "pass",
      "detail": {
        "accepted": false,
        "message": "请输入序列，或载入示例。"
      }
    },
    {
      "name": "normalization-vs-reference-empty",
      "status": "pass",
      "detail": {
        "accepted": false,
        "message": "FASTA must contain at least one non-empty sequence"
      }
    },
    {
      "name": "input-illegal",
      "status": "pass",
      "detail": {
        "accepted": false,
        "message": "不支持的 DNA 符号：X（第 3 位）。允许 ACGTN。"
      }
    },
    {
      "name": "normalization-vs-reference-illegal",
      "status": "pass",
      "detail": {
        "accepted": false,
        "message": "unsupported dna symbols: X"
      }
    },
    {
      "name": "input-lowercase",
      "status": "pass",
      "detail": {
        "accepted": true,
        "name": "自定义序列",
        "sequence": "ACGTN"
      }
    },
    {
      "name": "normalization-vs-reference-lowercase",
      "status": "pass",
      "detail": {
        "accepted": true,
        "sequence": "ACGTN",
        "kind": "dna"
      }
    },
    {
      "name": "input-fasta",
      "status": "pass",
      "detail": {
        "accepted": true,
        "name": "control",
        "sequence": "ACGTN"
      }
    },
    {
      "name": "normalization-vs-reference-fasta",
      "status": "pass",
      "detail": {
        "accepted": true,
        "sequence": "ACGTN",
        "kind": "dna"
      }
    },
    {
      "name": "input-multi-fasta",
      "status": "pass",
      "detail": {
        "accepted": false,
        "message": "检测到 2 条 FASTA 记录，请每次导入一条。"
      }
    },
    {
      "name": "normalization-vs-reference-multi-fasta",
      "status": "pass",
      "detail": {
        "accepted": false,
        "message": "encode requires exactly one FASTA record"
      }
    },
    {
      "name": "input-ambiguous-unset",
      "status": "pass",
      "detail": {
        "accepted": false,
        "message": "请明确选择 DNA、RNA 或 Protein 类型。"
      }
    },
    {
      "name": "input-ambiguous-explicit-dna",
      "status": "pass",
      "detail": {
        "accepted": true,
        "name": "自定义序列",
        "sequence": "ACGT"
      }
    },
    {
      "name": "normalization-vs-reference-ambiguous-explicit-dna",
      "status": "pass",
      "detail": {
        "accepted": true,
        "sequence": "ACGT",
        "kind": "dna"
      }
    },
    {
      "name": "input-ambiguous-explicit-protein",
      "status": "pass",
      "detail": {
        "accepted": true,
        "name": "自定义序列",
        "sequence": "ACGT"
      }
    },
    {
      "name": "normalization-vs-reference-ambiguous-explicit-protein",
      "status": "pass",
      "detail": {
        "accepted": true,
        "sequence": "ACGT",
        "kind": "protein"
      }
    },
    {
      "name": "input-dna-U",
      "status": "pass",
      "detail": {
        "accepted": false,
        "message": "不支持的 DNA 符号：U（第 4 位）。允许 ACGTN。"
      }
    },
    {
      "name": "normalization-vs-reference-dna-U",
      "status": "pass",
      "detail": {
        "accepted": false,
        "message": "unsupported dna symbols: U"
      }
    },
    {
      "name": "input-rna-T",
      "status": "pass",
      "detail": {
        "accepted": false,
        "message": "不支持的 RNA 符号：T（第 4 位）。允许 ACGUN。"
      }
    },
    {
      "name": "normalization-vs-reference-rna-T",
      "status": "pass",
      "detail": {
        "accepted": false,
        "message": "unsupported rna symbols: T"
      }
    },
    {
      "name": "input-repeat",
      "status": "pass",
      "detail": {
        "accepted": true,
        "name": "自定义序列",
        "sequence": "AAAAAAAAAAAAAAAA"
      }
    },
    {
      "name": "normalization-vs-reference-repeat",
      "status": "pass",
      "detail": {
        "accepted": true,
        "sequence": "AAAAAAAAAAAAAAAA",
        "kind": "dna"
      }
    },
    {
      "name": "input-over-limit",
      "status": "pass",
      "detail": {
        "accepted": false,
        "message": "序列超过 100,000 个符号，请分段导入。"
      }
    },
    {
      "name": "normalization-vs-reference-over-limit",
      "status": "pass",
      "detail": {
        "accepted": false,
        "message": "configured max-events 100000 exceeded"
      }
    },
    {
      "name": "100k-event-stream",
      "status": "pass",
      "detail": {
        "count": 100000,
        "milliseconds": 149.83730000000014,
        "hash": "6c1fefafb3fdd2403bb7d5831b4369dc6ac20b6abd36314ec236dcfb037c9143",
        "first": [
          1,
          "A",
          60,
          64,
          "0.000000",
          "0.147600",
          0
        ],
        "last": [
          100000,
          "T",
          72,
          64,
          "17999.820000",
          "0.147600",
          0
        ]
      }
    },
    {
      "name": "mutation-position-and-only-event",
      "status": "pass",
      "detail": {
        "changed": [
          5
        ],
        "A": {
          "event": 5,
          "position": 5,
          "symbol": "A",
          "kind": "dna",
          "basePitch": 60,
          "pitch": 60,
          "velocity": 64,
          "feature": "purine",
          "hydropathy": null,
          "pan": 0,
          "baseStart": 0.72,
          "baseDuration": 0.1476,
          "start": 0.72,
          "duration": 0.1476,
          "startBeats": 1.2,
          "durationBeats": 0.246,
          "mapping": "seq2music-mapping-v2",
          "mode": "science",
          "bpm": 100,
          "step": 0.3,
          "transpose": 0,
          "swing": 0,
          "scale": "identity",
          "timbre": "protocol"
        },
        "B": {
          "event": 5,
          "position": 5,
          "symbol": "G",
          "kind": "dna",
          "basePitch": 67,
          "pitch": 67,
          "velocity": 84,
          "feature": "purine",
          "hydropathy": null,
          "pan": 0,
          "baseStart": 0.72,
          "baseDuration": 0.1476,
          "start": 0.72,
          "duration": 0.1476,
          "startBeats": 1.2,
          "durationBeats": 0.246,
          "mapping": "seq2music-mapping-v2",
          "mode": "science",
          "bpm": 100,
          "step": 0.3,
          "transpose": 0,
          "swing": 0,
          "scale": "identity",
          "timbre": "protocol"
        }
      }
    },
    {
      "name": "mutation-pitch",
      "status": "pass",
      "detail": null
    },
    {
      "name": "diff-common-pitches-times",
      "status": "pass",
      "detail": null
    },
    {
      "name": "app-three-runs-A",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-three-runs-A",
      "status": "pass",
      "detail": null
    },
    {
      "name": "independent-midi-A",
      "status": "pass",
      "detail": {
        "app_codec": false,
        "reference_codec": true,
        "notes": 8
      }
    },
    {
      "name": "original-parser-reads-app-midi-A",
      "status": "pass",
      "detail": null
    },
    {
      "name": "independent-csv-A",
      "status": "pass",
      "detail": null
    },
    {
      "name": "wav-acoustics-A",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-integrity-statuses-A",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-normalized-fasta-roundtrip-A",
      "status": "pass",
      "detail": null
    },
    {
      "name": "app-three-runs-B",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-three-runs-B",
      "status": "pass",
      "detail": null
    },
    {
      "name": "independent-midi-B",
      "status": "pass",
      "detail": {
        "app_codec": false,
        "reference_codec": true,
        "notes": 8
      }
    },
    {
      "name": "original-parser-reads-app-midi-B",
      "status": "pass",
      "detail": null
    },
    {
      "name": "independent-csv-B",
      "status": "pass",
      "detail": null
    },
    {
      "name": "wav-acoustics-B",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-integrity-statuses-B",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-normalized-fasta-roundtrip-B",
      "status": "pass",
      "detail": null
    },
    {
      "name": "app-three-runs-C",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-three-runs-C",
      "status": "pass",
      "detail": null
    },
    {
      "name": "independent-midi-C",
      "status": "pass",
      "detail": {
        "app_codec": false,
        "reference_codec": true,
        "notes": 9
      }
    },
    {
      "name": "original-parser-reads-app-midi-C",
      "status": "pass",
      "detail": null
    },
    {
      "name": "independent-csv-C",
      "status": "pass",
      "detail": null
    },
    {
      "name": "wav-acoustics-C",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-integrity-statuses-C",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-normalized-fasta-roundtrip-C",
      "status": "pass",
      "detail": null
    },
    {
      "name": "app-three-runs-D",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-three-runs-D",
      "status": "pass",
      "detail": null
    },
    {
      "name": "independent-midi-D",
      "status": "pass",
      "detail": {
        "app_codec": false,
        "reference_codec": true,
        "notes": 8
      }
    },
    {
      "name": "original-parser-reads-app-midi-D",
      "status": "pass",
      "detail": null
    },
    {
      "name": "independent-csv-D",
      "status": "pass",
      "detail": null
    },
    {
      "name": "wav-acoustics-D",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-integrity-statuses-D",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-normalized-fasta-roundtrip-D",
      "status": "pass",
      "detail": null
    },
    {
      "name": "app-three-runs-E",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-three-runs-E",
      "status": "pass",
      "detail": null
    },
    {
      "name": "independent-midi-E",
      "status": "pass",
      "detail": {
        "app_codec": false,
        "reference_codec": true,
        "notes": 20
      }
    },
    {
      "name": "original-parser-reads-app-midi-E",
      "status": "pass",
      "detail": null
    },
    {
      "name": "independent-csv-E",
      "status": "pass",
      "detail": null
    },
    {
      "name": "wav-acoustics-E",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-integrity-statuses-E",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-normalized-fasta-roundtrip-E",
      "status": "pass",
      "detail": null
    },
    {
      "name": "app-three-runs-R",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-three-runs-R",
      "status": "pass",
      "detail": null
    },
    {
      "name": "independent-midi-R",
      "status": "pass",
      "detail": {
        "app_codec": false,
        "reference_codec": true,
        "notes": 16
      }
    },
    {
      "name": "original-parser-reads-app-midi-R",
      "status": "pass",
      "detail": null
    },
    {
      "name": "independent-csv-R",
      "status": "pass",
      "detail": null
    },
    {
      "name": "wav-acoustics-R",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-integrity-statuses-R",
      "status": "pass",
      "detail": null
    },
    {
      "name": "reference-normalized-fasta-roundtrip-R",
      "status": "pass",
      "detail": null
    },
    {
      "name": "stereo-midi-channels",
      "status": "pass",
      "detail": null
    },
    {
      "name": "stereo-wav-channel-isolation",
      "status": "pass",
      "detail": null
    },
    {
      "name": "stereo-csv-difference",
      "status": "pass",
      "detail": null
    },
    {
      "name": "browser-harness",
      "status": "pass",
      "detail": ""
    },
    {
      "name": "offline-zero-errors-network",
      "status": "pass",
      "detail": {
        "errors": [],
        "network": []
      }
    },
    {
      "name": "browser-edit-reset-compare",
      "status": "pass",
      "detail": null
    },
    {
      "name": "browser-three-runs-A",
      "status": "pass",
      "detail": null
    },
    {
      "name": "browser-files-equal-tested-core-A",
      "status": "pass",
      "detail": null
    },
    {
      "name": "browser-three-runs-B",
      "status": "pass",
      "detail": null
    },
    {
      "name": "browser-files-equal-tested-core-B",
      "status": "pass",
      "detail": null
    },
    {
      "name": "browser-three-runs-C",
      "status": "pass",
      "detail": null
    },
    {
      "name": "browser-files-equal-tested-core-C",
      "status": "pass",
      "detail": null
    },
    {
      "name": "browser-three-runs-D",
      "status": "pass",
      "detail": null
    },
    {
      "name": "browser-files-equal-tested-core-D",
      "status": "pass",
      "detail": null
    },
    {
      "name": "browser-three-runs-E",
      "status": "pass",
      "detail": null
    },
    {
      "name": "browser-files-equal-tested-core-E",
      "status": "pass",
      "detail": null
    },
    {
      "name": "browser-stereo-files-equal-tested-core",
      "status": "pass",
      "detail": null
    },
    {
      "name": "audio-display-sync-0",
      "status": "pass",
      "detail": {
        "run": 0,
        "notes": 16,
        "frames": 117,
        "max_onset_seconds": 0.0,
        "max_duration_seconds": 5.724587470723463e-17,
        "max_visual_boundary_error_seconds": 0.03,
        "float32_frequency_exact": true,
        "pan_exact": true,
        "max_binary64_difference_hz": 2.9066771503494238e-05,
        "observed_frequencies": [
          261.6255798339844,
          329.6275634765625,
          391.99542236328125,
          523.2511596679688
        ],
        "sample_rate": 48000,
        "output_latency": 0.04,
        "scope": "Web Audio render clock; no physical output capture"
      }
    },
    {
      "name": "audio-display-sync-1",
      "status": "pass",
      "detail": {
        "run": 1,
        "notes": 16,
        "frames": 89,
        "max_onset_seconds": 2.220446049250313e-16,
        "max_duration_seconds": 5.377642775528102e-17,
        "max_visual_boundary_error_seconds": 0.02066666666666661,
        "float32_frequency_exact": true,
        "pan_exact": true,
        "max_binary64_difference_hz": 2.9066771503494238e-05,
        "observed_frequencies": [
          261.6255798339844,
          329.6275634765625,
          391.99542236328125,
          523.2511596679688
        ],
        "sample_rate": 48000,
        "output_latency": 0.04,
        "scope": "Web Audio render clock; no physical output capture"
      }
    },
    {
      "name": "audio-display-sync-2",
      "status": "pass",
      "detail": {
        "run": 2,
        "notes": 16,
        "frames": 88,
        "max_onset_seconds": 4.440892098500626e-16,
        "max_duration_seconds": 4.978656376053436e-16,
        "max_visual_boundary_error_seconds": 0.020666666666667277,
        "float32_frequency_exact": true,
        "pan_exact": true,
        "max_binary64_difference_hz": 2.9066771503494238e-05,
        "observed_frequencies": [
          261.6255798339844,
          329.6275634765625,
          391.99542236328125,
          523.2511596679688
        ],
        "sample_rate": 48000,
        "output_latency": 0.04,
        "scope": "Web Audio render clock; no physical output capture"
      }
    }
  ],
  "differences": [
    {
      "name": "Implicit type",
      "app": {
        "accepted": false,
        "message": "请明确选择 DNA、RNA 或 Protein 类型。"
      },
      "reference": {
        "accepted": true,
        "sequence": "ACGT",
        "kind": "dna"
      },
      "classification": "intentional explicit-type policy"
    },
    {
      "name": "Comparison mode",
      "app": {
        "pan": [
          -1,
          1
        ],
        "changed_velocity": [
          64,
          84
        ],
        "order": "all A then all B",
        "features": [
          "purine",
          "purine"
        ]
      },
      "reference": {
        "pan": [
          -0.82,
          0.82
        ],
        "changed_velocity": [
          84,
          104
        ],
        "order": "A/B interleaved by position",
        "feature": "substitution"
      },
      "classification": "documented product difference; comparison is not fully Seq2Music diff-compatible"
    }
  ],
  "failures": [],
  "harness_sha256": {
    "control-study.py": "0eeab3d0c0df38cc3ca614cf3fcfd2da49ba9445441ead47f026a115a5283c7f",
    "control-study.cjs": "057e353427d2d490472b04eb2e7af8d5e5fcf6803ab7d087e2ec98169bc3b0ae"
  },
  "measurement_correction": {
    "reason": "AudioParam.value uses WebIDL float (IEEE-754 binary32); the first-run 1e-8 Hz double-precision comparison was invalid for this storage type.",
    "source": "https://www.w3.org/TR/webaudio/#AudioParam",
    "rule": "Compare observed AudioParam frequency exactly to independently rounded IEEE-754 binary32 expected frequency. No timing, event, MIDI or acoustic tolerance changed."
  },
  "prior_runs": [
    {
      "date": "2026-11-17T00:47:42.880204+08:00",
      "plan_sha256": "7b33bc0d5aff8c31aba5a16eee4d7f9b6c4e8f3803652d2f1f536fcfca22a2f2",
      "totals": {
        "pass_count": 201,
        "fail_count": 3
      },
      "failures": [
        {
          "name": "audio-display-sync-0",
          "status": "fail",
          "detail": {
            "run": 0,
            "notes": 16,
            "frames": 117,
            "max_onset_seconds": 0.0,
            "max_duration_seconds": 5.724587470723463e-17,
            "max_visual_boundary_error_seconds": 0.03,
            "sample_rate": 48000,
            "output_latency": 0.04,
            "scope": "Web Audio render clock; no physical output capture"
          }
        },
        {
          "name": "audio-display-sync-1",
          "status": "fail",
          "detail": {
            "run": 1,
            "notes": 16,
            "frames": 86,
            "max_onset_seconds": 2.220446049250313e-16,
            "max_duration_seconds": 5.377642775528102e-17,
            "max_visual_boundary_error_seconds": 0.019333333333333202,
            "sample_rate": 48000,
            "output_latency": 0.04,
            "scope": "Web Audio render clock; no physical output capture"
          }
        },
        {
          "name": "audio-display-sync-2",
          "status": "fail",
          "detail": {
            "run": 2,
            "notes": 16,
            "frames": 88,
            "max_onset_seconds": 4.440892098500626e-16,
            "max_duration_seconds": 4.978656376053436e-16,
            "max_visual_boundary_error_seconds": 0.020666666666666944,
            "sample_rate": 48000,
            "output_latency": 0.04,
            "scope": "Web Audio render clock; no physical output capture"
          }
        }
      ],
      "production_unchanged": true,
      "temporary_directory_removed": true
    }
  ],
  "reference": {
    "source": "<LOCAL_PROFILE>\\.codex\\plugins\\cache\\openai-curated-remote\\seq2music\\0.3.2\\scripts\\seq2music.py",
    "version": "0.3.2",
    "sha256": "7ec4a7fa6211f6c429031b3fd1df89371f7d1aae356ae8e695df647b74c45ba2",
    "contracts": {
      "mapping-contract.md": "6e18c28f7545570418d5e98f6660cd9de361f7da453f37dcd9782ef8d511a380",
      "roundtrip-contract.md": "0a851121c7fd72006efb7d11a477c4520164d8131d53e9b7d2c16a9dee79a575",
      "audio-score-import.md": "6cb15f9679108baa8571bf70b0a6142a348aaffd66b37574ec9e61cc487fc12e",
      "evidence-boundaries.md": "98a3a0901ffbc66577c6a1f854850b4011cf335d1c67a833cae5633e9245a8f9"
    }
  },
  "plan_sha256": "7b33bc0d5aff8c31aba5a16eee4d7f9b6c4e8f3803652d2f1f536fcfca22a2f2",
  "samples": {
    "A": "ACGTACGT",
    "B": "ACGTGCGT",
    "C": "ACGTNACGT",
    "D": "ACGUACGU",
    "E": "ACDEFGHIKLMNPQRSTVWY",
    "R": "AAAAAAAAAAAAAAAA"
  },
  "input_cases": [
    {
      "id": "empty",
      "text": "",
      "kind": "dna",
      "accepted": false
    },
    {
      "id": "illegal",
      "text": "ACXG",
      "kind": "dna",
      "accepted": false
    },
    {
      "id": "lowercase",
      "text": "acgtn",
      "kind": "dna",
      "accepted": true
    },
    {
      "id": "fasta",
      "text": ">control\nac g\ntn\n;comment",
      "kind": "dna",
      "accepted": true
    },
    {
      "id": "multi-fasta",
      "text": ">a\nAC\n>b\nGT",
      "kind": "dna",
      "accepted": false
    },
    {
      "id": "ambiguous-unset",
      "text": "ACGT",
      "kind": null,
      "accepted": false
    },
    {
      "id": "ambiguous-explicit-dna",
      "text": "ACGT",
      "kind": "dna",
      "accepted": true
    },
    {
      "id": "ambiguous-explicit-protein",
      "text": "ACGT",
      "kind": "protein",
      "accepted": true
    },
    {
      "id": "dna-U",
      "text": "ACGU",
      "kind": "dna",
      "accepted": false
    },
    {
      "id": "rna-T",
      "text": "ACGT",
      "kind": "rna",
      "accepted": false
    },
    {
      "id": "repeat",
      "text": "AAAAAAAAAAAAAAAA",
      "kind": "dna",
      "accepted": true
    },
    {
      "id": "over-limit",
      "text": "'A' repeated 100001 times",
      "kind": "dna",
      "accepted": false
    }
  ],
  "version": "0.3.1",
  "mapping": {
    "cases": 96,
    "events": 1104,
    "matched": 1104,
    "max_time_error": 0
  },
  "unsupported": [
    "BioSonify indel/alignment",
    "BioSonify MusicXML",
    "BioSonify exact embedded MIDI/WAV/score codecs",
    "BioSonify normalized FASTA reverse decoder"
  ],
  "indel_message": "两条序列长度不同（4 / 5），当前仅支持等长比较。",
  "app_determinism": [
    {
      "id": "A",
      "normalized": "ACGTACGT",
      "hashes": [
        {
          "events": "93dd5cdc3e529f77df7c2e24b392694f2ea1e3f48f6c745f539183457d77ae6b",
          "midi": "1068685340e4a6b2f0e0cf062e002b14a294d31b08a639b17f755a2831d5b212",
          "wav": "4707d2edc8301a349b780b6be80f92bf3e785c7ee2aa0f2eab35f3e955ed7ec6",
          "csv": "f68a44a6c3b4d66eec70e209b9380a469ea408cf00007956e29db3ec429c731b"
        },
        {
          "events": "93dd5cdc3e529f77df7c2e24b392694f2ea1e3f48f6c745f539183457d77ae6b",
          "midi": "1068685340e4a6b2f0e0cf062e002b14a294d31b08a639b17f755a2831d5b212",
          "wav": "4707d2edc8301a349b780b6be80f92bf3e785c7ee2aa0f2eab35f3e955ed7ec6",
          "csv": "f68a44a6c3b4d66eec70e209b9380a469ea408cf00007956e29db3ec429c731b"
        },
        {
          "events": "93dd5cdc3e529f77df7c2e24b392694f2ea1e3f48f6c745f539183457d77ae6b",
          "midi": "1068685340e4a6b2f0e0cf062e002b14a294d31b08a639b17f755a2831d5b212",
          "wav": "4707d2edc8301a349b780b6be80f92bf3e785c7ee2aa0f2eab35f3e955ed7ec6",
          "csv": "f68a44a6c3b4d66eec70e209b9380a469ea408cf00007956e29db3ec429c731b"
        }
      ]
    },
    {
      "id": "B",
      "normalized": "ACGTGCGT",
      "hashes": [
        {
          "events": "4dad884e18802eaf71bf028d125d592e04d110374567ccaa69f6cccb900cbd9c",
          "midi": "4a4da513daf1230d1282052c3caccdb0fa07a2ff6730e02f2e79dd79d73eb5d1",
          "wav": "520336c03e913306bb05baf84602adb67016099c8f68dc6dae9407b46b9bfd5b",
          "csv": "36afac2c25fee7d79ed79b802525b3e8d750179f5f20c014c5603db995a54e94"
        },
        {
          "events": "4dad884e18802eaf71bf028d125d592e04d110374567ccaa69f6cccb900cbd9c",
          "midi": "4a4da513daf1230d1282052c3caccdb0fa07a2ff6730e02f2e79dd79d73eb5d1",
          "wav": "520336c03e913306bb05baf84602adb67016099c8f68dc6dae9407b46b9bfd5b",
          "csv": "36afac2c25fee7d79ed79b802525b3e8d750179f5f20c014c5603db995a54e94"
        },
        {
          "events": "4dad884e18802eaf71bf028d125d592e04d110374567ccaa69f6cccb900cbd9c",
          "midi": "4a4da513daf1230d1282052c3caccdb0fa07a2ff6730e02f2e79dd79d73eb5d1",
          "wav": "520336c03e913306bb05baf84602adb67016099c8f68dc6dae9407b46b9bfd5b",
          "csv": "36afac2c25fee7d79ed79b802525b3e8d750179f5f20c014c5603db995a54e94"
        }
      ]
    },
    {
      "id": "C",
      "normalized": "ACGTNACGT",
      "hashes": [
        {
          "events": "02abf0c895d6131a7734adf0e33355735f5094cc770bc34a8b68b594548fbf6d",
          "midi": "4233def1293267cb2bc90fd693888526e61535bd597702530971d87b9fa5a2b5",
          "wav": "96875640dda7de7bb0393cc4fef97f5aadcf386b58f44a6a11b0e287cd852712",
          "csv": "15955aba2659cad90ea8e4315d41b23a4f4320a8a6937010bb5ab843af70785b"
        },
        {
          "events": "02abf0c895d6131a7734adf0e33355735f5094cc770bc34a8b68b594548fbf6d",
          "midi": "4233def1293267cb2bc90fd693888526e61535bd597702530971d87b9fa5a2b5",
          "wav": "96875640dda7de7bb0393cc4fef97f5aadcf386b58f44a6a11b0e287cd852712",
          "csv": "15955aba2659cad90ea8e4315d41b23a4f4320a8a6937010bb5ab843af70785b"
        },
        {
          "events": "02abf0c895d6131a7734adf0e33355735f5094cc770bc34a8b68b594548fbf6d",
          "midi": "4233def1293267cb2bc90fd693888526e61535bd597702530971d87b9fa5a2b5",
          "wav": "96875640dda7de7bb0393cc4fef97f5aadcf386b58f44a6a11b0e287cd852712",
          "csv": "15955aba2659cad90ea8e4315d41b23a4f4320a8a6937010bb5ab843af70785b"
        }
      ]
    },
    {
      "id": "D",
      "normalized": "ACGUACGU",
      "hashes": [
        {
          "events": "4b3e783c35cd15a095ab809de9f5a73e58c2f911cba0a867adf8d121fdf9d984",
          "midi": "1068685340e4a6b2f0e0cf062e002b14a294d31b08a639b17f755a2831d5b212",
          "wav": "4707d2edc8301a349b780b6be80f92bf3e785c7ee2aa0f2eab35f3e955ed7ec6",
          "csv": "0861f6fd2961f7c4a3a366bb95d1b6209c9b4b0e3a28754ce946233610c53307"
        },
        {
          "events": "4b3e783c35cd15a095ab809de9f5a73e58c2f911cba0a867adf8d121fdf9d984",
          "midi": "1068685340e4a6b2f0e0cf062e002b14a294d31b08a639b17f755a2831d5b212",
          "wav": "4707d2edc8301a349b780b6be80f92bf3e785c7ee2aa0f2eab35f3e955ed7ec6",
          "csv": "0861f6fd2961f7c4a3a366bb95d1b6209c9b4b0e3a28754ce946233610c53307"
        },
        {
          "events": "4b3e783c35cd15a095ab809de9f5a73e58c2f911cba0a867adf8d121fdf9d984",
          "midi": "1068685340e4a6b2f0e0cf062e002b14a294d31b08a639b17f755a2831d5b212",
          "wav": "4707d2edc8301a349b780b6be80f92bf3e785c7ee2aa0f2eab35f3e955ed7ec6",
          "csv": "0861f6fd2961f7c4a3a366bb95d1b6209c9b4b0e3a28754ce946233610c53307"
        }
      ]
    },
    {
      "id": "E",
      "normalized": "ACDEFGHIKLMNPQRSTVWY",
      "hashes": [
        {
          "events": "fff817cf1bdfc6961f342e59d407d5182983e494f7c245d9233d640242bb2578",
          "midi": "c126764bc544738efa06956ca891364e5389b96516a7096d7cdd30faf4081ae6",
          "wav": "19b15b9b4d14617e20b5cf4e8cd72d985fb589740f4ac089a1672cc006777140",
          "csv": "c2e2d8734d405d2fbd63d43d66bbff3900d9e9ce98045fc5d51f2ff0d8c2e5da"
        },
        {
          "events": "fff817cf1bdfc6961f342e59d407d5182983e494f7c245d9233d640242bb2578",
          "midi": "c126764bc544738efa06956ca891364e5389b96516a7096d7cdd30faf4081ae6",
          "wav": "19b15b9b4d14617e20b5cf4e8cd72d985fb589740f4ac089a1672cc006777140",
          "csv": "c2e2d8734d405d2fbd63d43d66bbff3900d9e9ce98045fc5d51f2ff0d8c2e5da"
        },
        {
          "events": "fff817cf1bdfc6961f342e59d407d5182983e494f7c245d9233d640242bb2578",
          "midi": "c126764bc544738efa06956ca891364e5389b96516a7096d7cdd30faf4081ae6",
          "wav": "19b15b9b4d14617e20b5cf4e8cd72d985fb589740f4ac089a1672cc006777140",
          "csv": "c2e2d8734d405d2fbd63d43d66bbff3900d9e9ce98045fc5d51f2ff0d8c2e5da"
        }
      ]
    },
    {
      "id": "R",
      "normalized": "AAAAAAAAAAAAAAAA",
      "hashes": [
        {
          "events": "3e35014bc623c75f8d8cfce71e95b190c1a211b9393a24a6dc77fc6aae66c414",
          "midi": "0371989206f0ff42814cf33656ad243ea7a566d783fd75f9243d007bc221b4da",
          "wav": "dff9914774328a1a94d50a7a36a94bc91f270de5c6e7dae8e6c24602563e42db",
          "csv": "f319bb16653b01f34d5146f1d53238a00daa718f071d6de737bbdf71887cf2a2"
        },
        {
          "events": "3e35014bc623c75f8d8cfce71e95b190c1a211b9393a24a6dc77fc6aae66c414",
          "midi": "0371989206f0ff42814cf33656ad243ea7a566d783fd75f9243d007bc221b4da",
          "wav": "dff9914774328a1a94d50a7a36a94bc91f270de5c6e7dae8e6c24602563e42db",
          "csv": "f319bb16653b01f34d5146f1d53238a00daa718f071d6de737bbdf71887cf2a2"
        },
        {
          "events": "3e35014bc623c75f8d8cfce71e95b190c1a211b9393a24a6dc77fc6aae66c414",
          "midi": "0371989206f0ff42814cf33656ad243ea7a566d783fd75f9243d007bc221b4da",
          "wav": "dff9914774328a1a94d50a7a36a94bc91f270de5c6e7dae8e6c24602563e42db",
          "csv": "f319bb16653b01f34d5146f1d53238a00daa718f071d6de737bbdf71887cf2a2"
        }
      ]
    }
  ],
  "reference_determinism": [
    {
      "id": "A",
      "hashes": [
        {
          ".mid": "45d063c79c8459592cc94ea9d08f1a0645efb4347a54d1cad4a922ddc3f45113",
          ".wav": "c4dbcbf3efab99755a017dce77d3b01831f476f23e8c8ddadddbb0074c600422",
          ".events.csv": "52575737f24f443fdac472d3e709d55ad49406bb31f76846e161328e1ffa47e8",
          ".musicxml": "e29b2dcf820999d0f17711735a0ef5c5b577cc7233c95c24e5ceaa5e16ada4a2"
        },
        {
          ".mid": "45d063c79c8459592cc94ea9d08f1a0645efb4347a54d1cad4a922ddc3f45113",
          ".wav": "c4dbcbf3efab99755a017dce77d3b01831f476f23e8c8ddadddbb0074c600422",
          ".events.csv": "52575737f24f443fdac472d3e709d55ad49406bb31f76846e161328e1ffa47e8",
          ".musicxml": "e29b2dcf820999d0f17711735a0ef5c5b577cc7233c95c24e5ceaa5e16ada4a2"
        },
        {
          ".mid": "45d063c79c8459592cc94ea9d08f1a0645efb4347a54d1cad4a922ddc3f45113",
          ".wav": "c4dbcbf3efab99755a017dce77d3b01831f476f23e8c8ddadddbb0074c600422",
          ".events.csv": "52575737f24f443fdac472d3e709d55ad49406bb31f76846e161328e1ffa47e8",
          ".musicxml": "e29b2dcf820999d0f17711735a0ef5c5b577cc7233c95c24e5ceaa5e16ada4a2"
        }
      ]
    },
    {
      "id": "B",
      "hashes": [
        {
          ".mid": "6dcfa2fa011b41aa6121936372493d42695216ec4ba9b5fc48bd81466b631b43",
          ".wav": "d7ebe438931bc4c436f2caf50809f06ec73f9dbf35c201ce0a7961aaecd47f35",
          ".events.csv": "deaf997ff3fe7572ba9a8ce4ba9db7f019973b94751f3c0b9729104312e107c6",
          ".musicxml": "4aff6cd2e9c263ebbb191e130358379b44905e41c2e27396259951b82b540a2f"
        },
        {
          ".mid": "6dcfa2fa011b41aa6121936372493d42695216ec4ba9b5fc48bd81466b631b43",
          ".wav": "d7ebe438931bc4c436f2caf50809f06ec73f9dbf35c201ce0a7961aaecd47f35",
          ".events.csv": "deaf997ff3fe7572ba9a8ce4ba9db7f019973b94751f3c0b9729104312e107c6",
          ".musicxml": "4aff6cd2e9c263ebbb191e130358379b44905e41c2e27396259951b82b540a2f"
        },
        {
          ".mid": "6dcfa2fa011b41aa6121936372493d42695216ec4ba9b5fc48bd81466b631b43",
          ".wav": "d7ebe438931bc4c436f2caf50809f06ec73f9dbf35c201ce0a7961aaecd47f35",
          ".events.csv": "deaf997ff3fe7572ba9a8ce4ba9db7f019973b94751f3c0b9729104312e107c6",
          ".musicxml": "4aff6cd2e9c263ebbb191e130358379b44905e41c2e27396259951b82b540a2f"
        }
      ]
    },
    {
      "id": "C",
      "hashes": [
        {
          ".mid": "4776011f8a9d4f334ab01bb0ad04de534234a0e1b8c975831bf896be0bea1eba",
          ".wav": "1c8a16147a29f51101e38aadfe8a9ab21cf9eba6f9a002c062e0da95289daa81",
          ".events.csv": "75d2a2557511d038ae160c986bba0d37aa7d617cd5ef60767274c1058a6d928b",
          ".musicxml": "5ba08bb16a53a5fb53401edd361886582958d23e048837bb14c82c7fbc0c1a98"
        },
        {
          ".mid": "4776011f8a9d4f334ab01bb0ad04de534234a0e1b8c975831bf896be0bea1eba",
          ".wav": "1c8a16147a29f51101e38aadfe8a9ab21cf9eba6f9a002c062e0da95289daa81",
          ".events.csv": "75d2a2557511d038ae160c986bba0d37aa7d617cd5ef60767274c1058a6d928b",
          ".musicxml": "5ba08bb16a53a5fb53401edd361886582958d23e048837bb14c82c7fbc0c1a98"
        },
        {
          ".mid": "4776011f8a9d4f334ab01bb0ad04de534234a0e1b8c975831bf896be0bea1eba",
          ".wav": "1c8a16147a29f51101e38aadfe8a9ab21cf9eba6f9a002c062e0da95289daa81",
          ".events.csv": "75d2a2557511d038ae160c986bba0d37aa7d617cd5ef60767274c1058a6d928b",
          ".musicxml": "5ba08bb16a53a5fb53401edd361886582958d23e048837bb14c82c7fbc0c1a98"
        }
      ]
    },
    {
      "id": "D",
      "hashes": [
        {
          ".mid": "c4bd51bdcaee446592f577ab9947d054d9cfa39154fdea61cc39647c4fa61b86",
          ".wav": "d34c271b6d759f2db3fa02d2605ae35b3d8cc3816d9fbb6ad9bcf1da3b336104",
          ".events.csv": "637f580663361e30a3e06b5596c1040585c3ec74b61e5dd84d07045a80d274c5",
          ".musicxml": "7fddbc671a063579d9d83a000d149442536e676d305284f91bac7bb818e29ac0"
        },
        {
          ".mid": "c4bd51bdcaee446592f577ab9947d054d9cfa39154fdea61cc39647c4fa61b86",
          ".wav": "d34c271b6d759f2db3fa02d2605ae35b3d8cc3816d9fbb6ad9bcf1da3b336104",
          ".events.csv": "637f580663361e30a3e06b5596c1040585c3ec74b61e5dd84d07045a80d274c5",
          ".musicxml": "7fddbc671a063579d9d83a000d149442536e676d305284f91bac7bb818e29ac0"
        },
        {
          ".mid": "c4bd51bdcaee446592f577ab9947d054d9cfa39154fdea61cc39647c4fa61b86",
          ".wav": "d34c271b6d759f2db3fa02d2605ae35b3d8cc3816d9fbb6ad9bcf1da3b336104",
          ".events.csv": "637f580663361e30a3e06b5596c1040585c3ec74b61e5dd84d07045a80d274c5",
          ".musicxml": "7fddbc671a063579d9d83a000d149442536e676d305284f91bac7bb818e29ac0"
        }
      ]
    },
    {
      "id": "E",
      "hashes": [
        {
          ".mid": "8ff297afa4629cfaa0a73c6bfb566a726764b6d0393b2a561fa8ba11b036004d",
          ".wav": "9c883006332f9a609d5899fb24e4ab2160b4cca37c43ab53b046bf57e9dfbabb",
          ".events.csv": "8115fb31926996cc91d898238f96f232a50a4d594031d376ee78f17f3077e181",
          ".musicxml": "1897f14b53a7a16867ef6e2db9e948d53dac1c3cf0007c3493b9984e3abaa381"
        },
        {
          ".mid": "8ff297afa4629cfaa0a73c6bfb566a726764b6d0393b2a561fa8ba11b036004d",
          ".wav": "9c883006332f9a609d5899fb24e4ab2160b4cca37c43ab53b046bf57e9dfbabb",
          ".events.csv": "8115fb31926996cc91d898238f96f232a50a4d594031d376ee78f17f3077e181",
          ".musicxml": "1897f14b53a7a16867ef6e2db9e948d53dac1c3cf0007c3493b9984e3abaa381"
        },
        {
          ".mid": "8ff297afa4629cfaa0a73c6bfb566a726764b6d0393b2a561fa8ba11b036004d",
          ".wav": "9c883006332f9a609d5899fb24e4ab2160b4cca37c43ab53b046bf57e9dfbabb",
          ".events.csv": "8115fb31926996cc91d898238f96f232a50a4d594031d376ee78f17f3077e181",
          ".musicxml": "1897f14b53a7a16867ef6e2db9e948d53dac1c3cf0007c3493b9984e3abaa381"
        }
      ]
    },
    {
      "id": "R",
      "hashes": [
        {
          ".mid": "2169754fdff20210925097d5a57da6265afc02cb2cb8e627bc052c1f75fa8d96",
          ".wav": "c006488473dd0ec3c3a131e8c3546f5522a0452a02e36b3c26189985eb686f65",
          ".events.csv": "c84bbe6d8f324138ba3f8ab454073eddd0efe9bda37082aef911b1d5db8d6ad2",
          ".musicxml": "9c6948466a56f8d8a5b105425e0b6445120f5d1dff63ed689f09f7ba816c876a"
        },
        {
          ".mid": "2169754fdff20210925097d5a57da6265afc02cb2cb8e627bc052c1f75fa8d96",
          ".wav": "c006488473dd0ec3c3a131e8c3546f5522a0452a02e36b3c26189985eb686f65",
          ".events.csv": "c84bbe6d8f324138ba3f8ab454073eddd0efe9bda37082aef911b1d5db8d6ad2",
          ".musicxml": "9c6948466a56f8d8a5b105425e0b6445120f5d1dff63ed689f09f7ba816c876a"
        },
        {
          ".mid": "2169754fdff20210925097d5a57da6265afc02cb2cb8e627bc052c1f75fa8d96",
          ".wav": "c006488473dd0ec3c3a131e8c3546f5522a0452a02e36b3c26189985eb686f65",
          ".events.csv": "c84bbe6d8f324138ba3f8ab454073eddd0efe9bda37082aef911b1d5db8d6ad2",
          ".musicxml": "9c6948466a56f8d8a5b105425e0b6445120f5d1dff63ed689f09f7ba816c876a"
        }
      ]
    }
  ],
  "acoustics": [
    {
      "id": "A",
      "app": {
        "frames": 32801,
        "max_pitch_cents": 0.000993854166090444,
        "max_onset_seconds": 0.00013605442176870748,
        "max_offset_seconds": 0.0005442176870748299,
        "rms": [
          0.022013993605464494,
          0.028668112245009567,
          0.02891946591300672,
          0.021846206500239492,
          0.022013993605464494,
          0.028668112245009567,
          0.02891946591300672,
          0.021846206500239492
        ],
        "peak": 1437,
        "center_channels_equal": true
      },
      "reference": {
        "frames": 32801,
        "max_pitch_cents": 0.000993854166090444,
        "max_onset_seconds": 0.00013605442176870748,
        "max_offset_seconds": 0.0005442176870748299,
        "rms": [
          0.022013993605464494,
          0.028668112245009567,
          0.02891946591300672,
          0.021846206500239492,
          0.022013993605464494,
          0.028668112245009567,
          0.02891946591300672,
          0.021846206500239492
        ],
        "peak": 1437,
        "center_channels_equal": true
      },
      "normalized_rmse": 0.0,
      "rms_delta_db": 0.0,
      "expected_frames": 32801,
      "app_pcm_sha256": "a858d6521484b7b6614a289def41e06a647ca9223857a1fc9676e94356f23f48",
      "reference_pcm_sha256": "a858d6521484b7b6614a289def41e06a647ca9223857a1fc9676e94356f23f48"
    },
    {
      "id": "B",
      "app": {
        "frames": 32801,
        "max_pitch_cents": 0.000993854166090444,
        "max_onset_seconds": 0.00013605442176870748,
        "max_offset_seconds": 0.0005442176870748299,
        "rms": [
          0.022013993605464494,
          0.028668112245009567,
          0.02891946591300672,
          0.021846206500239492,
          0.02891946591300672,
          0.028668112245009567,
          0.02891946591300672,
          0.021846206500239492
        ],
        "peak": 1437,
        "center_channels_equal": true
      },
      "reference": {
        "frames": 32801,
        "max_pitch_cents": 0.000993854166090444,
        "max_onset_seconds": 0.00013605442176870748,
        "max_offset_seconds": 0.0005442176870748299,
        "rms": [
          0.022013993605464494,
          0.028668112245009567,
          0.02891946591300672,
          0.021846206500239492,
          0.02891946591300672,
          0.028668112245009567,
          0.02891946591300672,
          0.021846206500239492
        ],
        "peak": 1437,
        "center_channels_equal": true
      },
      "normalized_rmse": 0.0,
      "rms_delta_db": 0.0,
      "expected_frames": 32801,
      "app_pcm_sha256": "e220887788ca867ffb3a2943adaf5cd1953c382df6b342830fb9f41bc3495aa3",
      "reference_pcm_sha256": "e220887788ca867ffb3a2943adaf5cd1953c382df6b342830fb9f41bc3495aa3"
    },
    {
      "id": "C",
      "app": {
        "frames": 36770,
        "max_pitch_cents": 0.0022536595555979174,
        "max_onset_seconds": 0.00018140589569160998,
        "max_offset_seconds": 0.0005442176870748299,
        "rms": [
          0.022013993605464494,
          0.028668112245009567,
          0.02891946591300672,
          0.021846206500239492,
          0.009406800310062687,
          0.022013993605464494,
          0.028668112245009567,
          0.02891946591300672,
          0.021846206500239492
        ],
        "peak": 1437,
        "center_channels_equal": true
      },
      "reference": {
        "frames": 36770,
        "max_pitch_cents": 0.0022536595555979174,
        "max_onset_seconds": 0.00018140589569160998,
        "max_offset_seconds": 0.0005442176870748299,
        "rms": [
          0.022013993605464494,
          0.028668112245009567,
          0.02891946591300672,
          0.021846206500239492,
          0.009406800310062687,
          0.022013993605464494,
          0.028668112245009567,
          0.02891946591300672,
          0.021846206500239492
        ],
        "peak": 1437,
        "center_channels_equal": true
      },
      "normalized_rmse": 0.0,
      "rms_delta_db": 0.0,
      "expected_frames": 36770,
      "app_pcm_sha256": "6feca64a4c3915b093beca5d7b385dabc3b6d0b4353f40867196449cefe9caef",
      "reference_pcm_sha256": "6feca64a4c3915b093beca5d7b385dabc3b6d0b4353f40867196449cefe9caef"
    },
    {
      "id": "D",
      "app": {
        "frames": 32801,
        "max_pitch_cents": 0.000993854166090444,
        "max_onset_seconds": 0.00013605442176870748,
        "max_offset_seconds": 0.0005442176870748299,
        "rms": [
          0.022013993605464494,
          0.028668112245009567,
          0.02891946591300672,
          0.021846206500239492,
          0.022013993605464494,
          0.028668112245009567,
          0.02891946591300672,
          0.021846206500239492
        ],
        "peak": 1437,
        "center_channels_equal": true
      },
      "reference": {
        "frames": 32801,
        "max_pitch_cents": 0.000993854166090444,
        "max_onset_seconds": 0.00013605442176870748,
        "max_offset_seconds": 0.0005442176870748299,
        "rms": [
          0.022013993605464494,
          0.028668112245009567,
          0.02891946591300672,
          0.021846206500239492,
          0.022013993605464494,
          0.028668112245009567,
          0.02891946591300672,
          0.021846206500239492
        ],
        "peak": 1437,
        "center_channels_equal": true
      },
      "normalized_rmse": 0.0,
      "rms_delta_db": 0.0,
      "expected_frames": 32801,
      "app_pcm_sha256": "a858d6521484b7b6614a289def41e06a647ca9223857a1fc9676e94356f23f48",
      "reference_pcm_sha256": "a858d6521484b7b6614a289def41e06a647ca9223857a1fc9676e94356f23f48"
    },
    {
      "id": "E",
      "app": {
        "frames": 80429,
        "max_pitch_cents": 0.004687032602696774,
        "max_onset_seconds": 0.00022675736961451248,
        "max_offset_seconds": 0.00022675736961451248,
        "rms": [
          0.03226037139339476,
          0.025941988176811214,
          0.014011324201706966,
          0.014000516878919178,
          0.03444514302068655,
          0.02046379376615026,
          0.01531645184119067,
          0.038946737927451534,
          0.014318283089217313,
          0.03718122153781823,
          0.032777910088983155,
          0.019924979754422017,
          0.0184811456372082,
          0.019907239334634286,
          0.013327107903440806,
          0.0261046519368126,
          0.026565546790559082,
          0.038051632903946565,
          0.02610676061943206,
          0.025227314600424783
        ],
        "peak": 1843,
        "center_channels_equal": true
      },
      "reference": {
        "frames": 80429,
        "max_pitch_cents": 0.004687032602696774,
        "max_onset_seconds": 0.00022675736961451248,
        "max_offset_seconds": 0.00022675736961451248,
        "rms": [
          0.03226037139339476,
          0.025941988176811214,
          0.014011324201706966,
          0.014000516878919178,
          0.03444514302068655,
          0.02046379376615026,
          0.01531645184119067,
          0.038946737927451534,
          0.014318283089217313,
          0.03718122153781823,
          0.032777910088983155,
          0.019924979754422017,
          0.0184811456372082,
          0.019907239334634286,
          0.013327107903440806,
          0.0261046519368126,
          0.026565546790559082,
          0.038051632903946565,
          0.02610676061943206,
          0.025227314600424783
        ],
        "peak": 1843,
        "center_channels_equal": true
      },
      "normalized_rmse": 0.0,
      "rms_delta_db": 0.0,
      "expected_frames": 80429,
      "app_pcm_sha256": "11a591bc268d54f4796aff1031699fcddbe06d32a37935eef38189c4a2e99ec9",
      "reference_pcm_sha256": "11a591bc268d54f4796aff1031699fcddbe06d32a37935eef38189c4a2e99ec9"
    },
    {
      "id": "R",
      "app": {
        "frames": 64553,
        "max_pitch_cents": 0.00019700541460018986,
        "max_onset_seconds": 0.00013605442176870748,
        "max_offset_seconds": 0.0005442176870748299,
        "rms": [
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494
        ],
        "peak": 1095,
        "center_channels_equal": true
      },
      "reference": {
        "frames": 64553,
        "max_pitch_cents": 0.00019700541460018986,
        "max_onset_seconds": 0.00013605442176870748,
        "max_offset_seconds": 0.0005442176870748299,
        "rms": [
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494,
          0.022013993605464494
        ],
        "peak": 1095,
        "center_channels_equal": true
      },
      "normalized_rmse": 0.0,
      "rms_delta_db": 0.0,
      "expected_frames": 64553,
      "app_pcm_sha256": "96baa12409376b691bea969284d0ca6eb3f74a6c99dd1552a6f6d19d41c3eaa1",
      "reference_pcm_sha256": "96baa12409376b691bea969284d0ca6eb3f74a6c99dd1552a6f6d19d41c3eaa1"
    }
  ],
  "carrier_statuses": [
    {
      "id": "A",
      "reference_midi": "exact-embedded",
      "reference_manifest": "exact-manifest-matched",
      "reference_wav": "exact-wav-embedded",
      "reference_score": "exact-score-embedded",
      "app_midi_strict": "MIDI lacks Seq2Music roundtrip metadata; legacy recovery requires --kind and --allow-edited",
      "app_midi_legacy": "edited-or-unverified",
      "app_wav": "lossy-audio-quantized",
      "app_wav_inferred_sequence": "ACGTACGT"
    },
    {
      "id": "B",
      "reference_midi": "exact-embedded",
      "reference_manifest": "exact-manifest-matched",
      "reference_wav": "exact-wav-embedded",
      "reference_score": "exact-score-embedded",
      "app_midi_strict": "MIDI lacks Seq2Music roundtrip metadata; legacy recovery requires --kind and --allow-edited",
      "app_midi_legacy": "edited-or-unverified",
      "app_wav": "lossy-audio-quantized",
      "app_wav_inferred_sequence": "ACGTGCGT"
    },
    {
      "id": "C",
      "reference_midi": "exact-embedded",
      "reference_manifest": "exact-manifest-matched",
      "reference_wav": "exact-wav-embedded",
      "reference_score": "exact-score-embedded",
      "app_midi_strict": "MIDI lacks Seq2Music roundtrip metadata; legacy recovery requires --kind and --allow-edited",
      "app_midi_legacy": "edited-or-unverified",
      "app_wav": "lossy-audio-quantized",
      "app_wav_inferred_sequence": "ACGTACGT"
    },
    {
      "id": "D",
      "reference_midi": "exact-embedded",
      "reference_manifest": "exact-manifest-matched",
      "reference_wav": "exact-wav-embedded",
      "reference_score": "exact-score-embedded",
      "app_midi_strict": "MIDI lacks Seq2Music roundtrip metadata; legacy recovery requires --kind and --allow-edited",
      "app_midi_legacy": "edited-or-unverified",
      "app_wav": "lossy-audio-quantized",
      "app_wav_inferred_sequence": "ACGUACGU"
    },
    {
      "id": "E",
      "reference_midi": "exact-embedded",
      "reference_manifest": "exact-manifest-matched",
      "reference_wav": "exact-wav-embedded",
      "reference_score": "exact-score-embedded",
      "app_midi_strict": "MIDI lacks Seq2Music roundtrip metadata; legacy recovery requires --kind and --allow-edited",
      "app_midi_legacy": "edited-or-unverified",
      "app_wav": "lossy-audio-quantized",
      "app_wav_inferred_sequence": "ACFGHILMNPQSTVWY"
    },
    {
      "id": "R",
      "reference_midi": "exact-embedded",
      "reference_manifest": "exact-manifest-matched",
      "reference_wav": "exact-wav-embedded",
      "reference_score": "exact-score-embedded",
      "app_midi_strict": "MIDI lacks Seq2Music roundtrip metadata; legacy recovery requires --kind and --allow-edited",
      "app_midi_legacy": "edited-or-unverified",
      "app_wav": "lossy-audio-quantized",
      "app_wav_inferred_sequence": "AAAAAAAAAAAA"
    }
  ],
  "browser": "157.0.4341.60",
  "browser_determinism": [
    {
      "id": "A",
      "run": 0,
      "eventsHash": "0ba0f506e26912855f8954fc1e2e4cb607944fa89d1bc0a1512df78a646fdcc8",
      "files": {
        "midi": {
          "file": "browser-A-0.mid",
          "sha256": "1068685340e4a6b2f0e0cf062e002b14a294d31b08a639b17f755a2831d5b212"
        },
        "wav": {
          "file": "browser-A-0.wav",
          "sha256": "4707d2edc8301a349b780b6be80f92bf3e785c7ee2aa0f2eab35f3e955ed7ec6"
        },
        "csv": {
          "file": "browser-A-0.csv",
          "sha256": "f68a44a6c3b4d66eec70e209b9380a469ea408cf00007956e29db3ec429c731b"
        }
      }
    },
    {
      "id": "A",
      "run": 1,
      "eventsHash": "0ba0f506e26912855f8954fc1e2e4cb607944fa89d1bc0a1512df78a646fdcc8",
      "files": {
        "midi": {
          "file": "browser-A-1.mid",
          "sha256": "1068685340e4a6b2f0e0cf062e002b14a294d31b08a639b17f755a2831d5b212"
        },
        "wav": {
          "file": "browser-A-1.wav",
          "sha256": "4707d2edc8301a349b780b6be80f92bf3e785c7ee2aa0f2eab35f3e955ed7ec6"
        },
        "csv": {
          "file": "browser-A-1.csv",
          "sha256": "f68a44a6c3b4d66eec70e209b9380a469ea408cf00007956e29db3ec429c731b"
        }
      }
    },
    {
      "id": "A",
      "run": 2,
      "eventsHash": "0ba0f506e26912855f8954fc1e2e4cb607944fa89d1bc0a1512df78a646fdcc8",
      "files": {
        "midi": {
          "file": "browser-A-2.mid",
          "sha256": "1068685340e4a6b2f0e0cf062e002b14a294d31b08a639b17f755a2831d5b212"
        },
        "wav": {
          "file": "browser-A-2.wav",
          "sha256": "4707d2edc8301a349b780b6be80f92bf3e785c7ee2aa0f2eab35f3e955ed7ec6"
        },
        "csv": {
          "file": "browser-A-2.csv",
          "sha256": "f68a44a6c3b4d66eec70e209b9380a469ea408cf00007956e29db3ec429c731b"
        }
      }
    },
    {
      "id": "B",
      "run": 0,
      "eventsHash": "e76630491fc47b6fc7da09120eb9fc9852837f5550907710a00b72e2727c40e7",
      "files": {
        "midi": {
          "file": "browser-B-0.mid",
          "sha256": "4a4da513daf1230d1282052c3caccdb0fa07a2ff6730e02f2e79dd79d73eb5d1"
        },
        "wav": {
          "file": "browser-B-0.wav",
          "sha256": "520336c03e913306bb05baf84602adb67016099c8f68dc6dae9407b46b9bfd5b"
        },
        "csv": {
          "file": "browser-B-0.csv",
          "sha256": "36afac2c25fee7d79ed79b802525b3e8d750179f5f20c014c5603db995a54e94"
        }
      }
    },
    {
      "id": "B",
      "run": 1,
      "eventsHash": "e76630491fc47b6fc7da09120eb9fc9852837f5550907710a00b72e2727c40e7",
      "files": {
        "midi": {
          "file": "browser-B-1.mid",
          "sha256": "4a4da513daf1230d1282052c3caccdb0fa07a2ff6730e02f2e79dd79d73eb5d1"
        },
        "wav": {
          "file": "browser-B-1.wav",
          "sha256": "520336c03e913306bb05baf84602adb67016099c8f68dc6dae9407b46b9bfd5b"
        },
        "csv": {
          "file": "browser-B-1.csv",
          "sha256": "36afac2c25fee7d79ed79b802525b3e8d750179f5f20c014c5603db995a54e94"
        }
      }
    },
    {
      "id": "B",
      "run": 2,
      "eventsHash": "e76630491fc47b6fc7da09120eb9fc9852837f5550907710a00b72e2727c40e7",
      "files": {
        "midi": {
          "file": "browser-B-2.mid",
          "sha256": "4a4da513daf1230d1282052c3caccdb0fa07a2ff6730e02f2e79dd79d73eb5d1"
        },
        "wav": {
          "file": "browser-B-2.wav",
          "sha256": "520336c03e913306bb05baf84602adb67016099c8f68dc6dae9407b46b9bfd5b"
        },
        "csv": {
          "file": "browser-B-2.csv",
          "sha256": "36afac2c25fee7d79ed79b802525b3e8d750179f5f20c014c5603db995a54e94"
        }
      }
    },
    {
      "id": "C",
      "run": 0,
      "eventsHash": "ada049cc862b920c6cd893e3589c48d8a8e2a62b99810a1d5dfa1278921f886c",
      "files": {
        "midi": {
          "file": "browser-C-0.mid",
          "sha256": "4233def1293267cb2bc90fd693888526e61535bd597702530971d87b9fa5a2b5"
        },
        "wav": {
          "file": "browser-C-0.wav",
          "sha256": "96875640dda7de7bb0393cc4fef97f5aadcf386b58f44a6a11b0e287cd852712"
        },
        "csv": {
          "file": "browser-C-0.csv",
          "sha256": "15955aba2659cad90ea8e4315d41b23a4f4320a8a6937010bb5ab843af70785b"
        }
      }
    },
    {
      "id": "C",
      "run": 1,
      "eventsHash": "ada049cc862b920c6cd893e3589c48d8a8e2a62b99810a1d5dfa1278921f886c",
      "files": {
        "midi": {
          "file": "browser-C-1.mid",
          "sha256": "4233def1293267cb2bc90fd693888526e61535bd597702530971d87b9fa5a2b5"
        },
        "wav": {
          "file": "browser-C-1.wav",
          "sha256": "96875640dda7de7bb0393cc4fef97f5aadcf386b58f44a6a11b0e287cd852712"
        },
        "csv": {
          "file": "browser-C-1.csv",
          "sha256": "15955aba2659cad90ea8e4315d41b23a4f4320a8a6937010bb5ab843af70785b"
        }
      }
    },
    {
      "id": "C",
      "run": 2,
      "eventsHash": "ada049cc862b920c6cd893e3589c48d8a8e2a62b99810a1d5dfa1278921f886c",
      "files": {
        "midi": {
          "file": "browser-C-2.mid",
          "sha256": "4233def1293267cb2bc90fd693888526e61535bd597702530971d87b9fa5a2b5"
        },
        "wav": {
          "file": "browser-C-2.wav",
          "sha256": "96875640dda7de7bb0393cc4fef97f5aadcf386b58f44a6a11b0e287cd852712"
        },
        "csv": {
          "file": "browser-C-2.csv",
          "sha256": "15955aba2659cad90ea8e4315d41b23a4f4320a8a6937010bb5ab843af70785b"
        }
      }
    },
    {
      "id": "D",
      "run": 0,
      "eventsHash": "e0c30c9d582978147d6eaa2493bb7e966bd17a4e5ddd03ae08df5b190e403aba",
      "files": {
        "midi": {
          "file": "browser-D-0.mid",
          "sha256": "1068685340e4a6b2f0e0cf062e002b14a294d31b08a639b17f755a2831d5b212"
        },
        "wav": {
          "file": "browser-D-0.wav",
          "sha256": "4707d2edc8301a349b780b6be80f92bf3e785c7ee2aa0f2eab35f3e955ed7ec6"
        },
        "csv": {
          "file": "browser-D-0.csv",
          "sha256": "0861f6fd2961f7c4a3a366bb95d1b6209c9b4b0e3a28754ce946233610c53307"
        }
      }
    },
    {
      "id": "D",
      "run": 1,
      "eventsHash": "e0c30c9d582978147d6eaa2493bb7e966bd17a4e5ddd03ae08df5b190e403aba",
      "files": {
        "midi": {
          "file": "browser-D-1.mid",
          "sha256": "1068685340e4a6b2f0e0cf062e002b14a294d31b08a639b17f755a2831d5b212"
        },
        "wav": {
          "file": "browser-D-1.wav",
          "sha256": "4707d2edc8301a349b780b6be80f92bf3e785c7ee2aa0f2eab35f3e955ed7ec6"
        },
        "csv": {
          "file": "browser-D-1.csv",
          "sha256": "0861f6fd2961f7c4a3a366bb95d1b6209c9b4b0e3a28754ce946233610c53307"
        }
      }
    },
    {
      "id": "D",
      "run": 2,
      "eventsHash": "e0c30c9d582978147d6eaa2493bb7e966bd17a4e5ddd03ae08df5b190e403aba",
      "files": {
        "midi": {
          "file": "browser-D-2.mid",
          "sha256": "1068685340e4a6b2f0e0cf062e002b14a294d31b08a639b17f755a2831d5b212"
        },
        "wav": {
          "file": "browser-D-2.wav",
          "sha256": "4707d2edc8301a349b780b6be80f92bf3e785c7ee2aa0f2eab35f3e955ed7ec6"
        },
        "csv": {
          "file": "browser-D-2.csv",
          "sha256": "0861f6fd2961f7c4a3a366bb95d1b6209c9b4b0e3a28754ce946233610c53307"
        }
      }
    },
    {
      "id": "E",
      "run": 0,
      "eventsHash": "feab4e81698782616e1660bd608cf61a3a09a8457956fd5589f843cad1bf2034",
      "files": {
        "midi": {
          "file": "browser-E-0.mid",
          "sha256": "c126764bc544738efa06956ca891364e5389b96516a7096d7cdd30faf4081ae6"
        },
        "wav": {
          "file": "browser-E-0.wav",
          "sha256": "19b15b9b4d14617e20b5cf4e8cd72d985fb589740f4ac089a1672cc006777140"
        },
        "csv": {
          "file": "browser-E-0.csv",
          "sha256": "c2e2d8734d405d2fbd63d43d66bbff3900d9e9ce98045fc5d51f2ff0d8c2e5da"
        }
      }
    },
    {
      "id": "E",
      "run": 1,
      "eventsHash": "feab4e81698782616e1660bd608cf61a3a09a8457956fd5589f843cad1bf2034",
      "files": {
        "midi": {
          "file": "browser-E-1.mid",
          "sha256": "c126764bc544738efa06956ca891364e5389b96516a7096d7cdd30faf4081ae6"
        },
        "wav": {
          "file": "browser-E-1.wav",
          "sha256": "19b15b9b4d14617e20b5cf4e8cd72d985fb589740f4ac089a1672cc006777140"
        },
        "csv": {
          "file": "browser-E-1.csv",
          "sha256": "c2e2d8734d405d2fbd63d43d66bbff3900d9e9ce98045fc5d51f2ff0d8c2e5da"
        }
      }
    },
    {
      "id": "E",
      "run": 2,
      "eventsHash": "feab4e81698782616e1660bd608cf61a3a09a8457956fd5589f843cad1bf2034",
      "files": {
        "midi": {
          "file": "browser-E-2.mid",
          "sha256": "c126764bc544738efa06956ca891364e5389b96516a7096d7cdd30faf4081ae6"
        },
        "wav": {
          "file": "browser-E-2.wav",
          "sha256": "19b15b9b4d14617e20b5cf4e8cd72d985fb589740f4ac089a1672cc006777140"
        },
        "csv": {
          "file": "browser-E-2.csv",
          "sha256": "c2e2d8734d405d2fbd63d43d66bbff3900d9e9ce98045fc5d51f2ff0d8c2e5da"
        }
      }
    }
  ],
  "synchronization": [
    {
      "run": 0,
      "notes": 16,
      "frames": 117,
      "max_onset_seconds": 0.0,
      "max_duration_seconds": 5.724587470723463e-17,
      "max_visual_boundary_error_seconds": 0.03,
      "float32_frequency_exact": true,
      "pan_exact": true,
      "max_binary64_difference_hz": 2.9066771503494238e-05,
      "observed_frequencies": [
        261.6255798339844,
        329.6275634765625,
        391.99542236328125,
        523.2511596679688
      ],
      "sample_rate": 48000,
      "output_latency": 0.04,
      "scope": "Web Audio render clock; no physical output capture"
    },
    {
      "run": 1,
      "notes": 16,
      "frames": 89,
      "max_onset_seconds": 2.220446049250313e-16,
      "max_duration_seconds": 5.377642775528102e-17,
      "max_visual_boundary_error_seconds": 0.02066666666666661,
      "float32_frequency_exact": true,
      "pan_exact": true,
      "max_binary64_difference_hz": 2.9066771503494238e-05,
      "observed_frequencies": [
        261.6255798339844,
        329.6275634765625,
        391.99542236328125,
        523.2511596679688
      ],
      "sample_rate": 48000,
      "output_latency": 0.04,
      "scope": "Web Audio render clock; no physical output capture"
    },
    {
      "run": 2,
      "notes": 16,
      "frames": 88,
      "max_onset_seconds": 4.440892098500626e-16,
      "max_duration_seconds": 4.978656376053436e-16,
      "max_visual_boundary_error_seconds": 0.020666666666667277,
      "float32_frequency_exact": true,
      "pan_exact": true,
      "max_binary64_difference_hz": 2.9066771503494238e-05,
      "observed_frequencies": [
        261.6255798339844,
        329.6275634765625,
        391.99542236328125,
        523.2511596679688
      ],
      "sample_rate": 48000,
      "output_latency": 0.04,
      "scope": "Web Audio render clock; no physical output capture"
    }
  ],
  "baseline_browser": {
    "scope": "File URL, offline Edge desktop and touch viewport simulation; no physical phone testing",
    "checks": [
      {
        "name": "Single HTML boots directly from file URL while offline"
      },
      {
        "name": "User-gesture playback, moving position, pause/resume and stop"
      },
      {
        "name": "Single-symbol editing refreshes pitch and undo restores input"
      },
      {
        "name": "BPM timing and invalid-parameter action gating"
      },
      {
        "name": "Invalid symbols and multi-record FASTA rejected; valid import preserves label"
      },
      {
        "name": "Equal-length comparison, exact differing position, stereo playback and length guard"
      },
      {
        "name": "Equal pitches in two tracks share the exact vertical coordinate"
      },
      {
        "name": "Creative transforms preserve base pitch; science restores mapping"
      },
      {
        "name": "RNA and protein input, note generation and live playback"
      },
      {
        "name": "All four download formats, dual-track range export and preserved original positions"
      },
      {
        "name": "Downloaded WAV decoded and played by browser native audio",
        "detail": {
          "channels": 2,
          "sampleRate": 22050,
          "duration": 0.5875736961451247,
          "currentTime": 0.097366,
          "error": null
        }
      },
      {
        "name": "Project JSON save/open restores both sequences and settings"
      },
      {
        "name": "100k-symbol input, virtual timeline and jump near sequence end",
        "detail": {
          "elapsedMs": 103,
          "visibleSvgNodes": 286
        }
      },
      {
        "name": "Oversized WAV / SVG gives useful range guidance"
      },
      {
        "name": "Keyboard timeline navigation and accessible help dialog"
      },
      {
        "name": "Large background WAV render can be canceled and editor remains available"
      },
      {
        "name": "Touch viewport 320px: playback, pause, comparison, editing, vertical scroll, no page overflow"
      },
      {
        "name": "Touch viewport 390px: playback, pause, comparison, editing, vertical scroll, no page overflow"
      },
      {
        "name": "Touch viewport 768px: playback, pause, comparison, editing, vertical scroll, no page overflow"
      },
      {
        "name": "Touch viewport 1024px: playback, pause, comparison, editing, vertical scroll, no page overflow"
      },
      {
        "name": "No page errors and zero HTTP(S) requests across tested offline sessions"
      }
    ],
    "errors": [],
    "network": [],
    "browser": "157.0.4341.60",
    "when": "2026-11-16T16:51:43.091Z",
    "longInputMilliseconds": 103,
    "result": "pass"
  },
  "production_unchanged": true,
  "temporary_directory_removed": true,
  "totals": {
    "pass_count": 204,
    "fail_count": 0
  },
  "lossy_minimal_reproductions": [
    {
      "kind": "dna",
      "input": "N",
      "error": "audio inference found no voiced windows above the silence threshold"
    },
    {
      "kind": "protein",
      "input": "D",
      "error": "audio inference found no voiced windows above the silence threshold"
    },
    {
      "kind": "dna",
      "input": "A",
      "status": "lossy-audio-quantized",
      "recovered": "A"
    },
    {
      "kind": "dna",
      "input": "AA",
      "status": "lossy-audio-quantized",
      "recovered": "A"
    },
    {
      "kind": "dna",
      "input": "AAA",
      "status": "lossy-audio-quantized",
      "recovered": "AA"
    },
    {
      "kind": "dna",
      "input": "AAAA",
      "status": "lossy-audio-quantized",
      "recovered": "AAA"
    }
  ],
  "lossy_diagnostic_temporary_removed": true,
  "followup_diagnostic_runner_sha256": "4f4168e926fef4c54f33820c9429a3637304a78bf680a912bd57f3ff74047855",
  "perception_material_validation": {
    "result": "pass",
    "stimuli": 108,
    "assignment_cells": 18,
    "trials_per_condition": 36,
    "no_change_per_condition": 18,
    "one_change_per_condition": 9,
    "two_changes_per_condition": 9,
    "each_item_exposures_per_condition_across_18_assignments": 6,
    "actual_participants": 0,
    "responses_generated": 0,
    "temporary_materials_retained": false,
    "items_sha256": "d9f1148f4bd992becf6145201afcc35a46ac42970eeed9f6eddf64f8c08bea2d"
  },
  "followup_diff_common_fields": {
    "result": "pass",
    "events": 16,
    "max_timing_error": 0,
    "scope": "Ordered symbol, pitch, start and duration; different velocity/pan rules remain separately reported"
  },
  "delivered_script_sha256": {
    "control-study.py": "ef3a943e054f19ebe59740821e30179317011bfdc3b5ded33b5e77cfcf2cf15c",
    "control-study.cjs": "057e353427d2d490472b04eb2e7af8d5e5fcf6803ab7d087e2ec98169bc3b0ae",
    "perception-trials.py": "6e42d63b240d192cf69e9ea9a732baaecb2d07cac1ff453a19c495cbbf5b1fb4"
  }
}
```
