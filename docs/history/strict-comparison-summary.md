> Historical record. Local profile paths redacted for publication; scientific results retained. See ../../VALIDATION.md for the current scope.

# 严格变异对照与科学核心冻结验证

科学核心按既有独立基准冻结；严格对照关闭突变提示时保留符号固有音高和力度、使用统一正弦基础音色。开启提示后，差异位点力度 +20（上限 120）并使用原插件 substitution 波形。A/B 交错事件、左右 ±0.82、MIDI 声像 12/115。比较仍限同类型等长序列。

独立基准使用 Seq2Music 0.3.2 原始 diff / sequence / MIDI / WAV 实现。提示开启的相同位置样本直接比较 diff；提示关闭的预期按事先确定的规则去除额外力度及波形强调。关闭提示属于本工具的严格对照配置，不能标成原插件默认 diff。事件容差 1 微秒、MIDI tick 零误差、WAV 帧差 ≤1、PCM 归一化 RMSE ≤0.0001；实时调度 ≤3 毫秒、显示位置 ≤60 毫秒。

执行时间：2026-11-17T01:39:03.472245+08:00。通过 215 项；失败 0 项。Python 3.12.14；Windows-11-10.0.26300-SP0。真实参与者 0；未做感知实验，未生成模拟参与者结果。

## 基线异常与处理

v0.3.1 重跑 203 项通过、1 项失败，详情见 strict-comparison-baseline.md：原 WAV 播放测试固定等待 140 毫秒后 currentTime 未超过 0.05 秒。现在等实际播放时钟达到同一门槛，最长 2 秒；没有改变音频数据、有效播放门槛或声学容差。旧比较断言按本次明确变更的 ±0.82 声像、交错顺序及创作锁定更新；单序列核心断言保持原样。

## 实际结果

```json
{
  "source_hashes": {
    "BioSonify-Lab.html": "89c2aefbe002c7aec2d243bb513875eea7a6b096fca2c0f30c2cca3a50b9cf85",
    "src\\app.js": "c210dc0fca5ef3dede818a65cc551f40bbf062e012c5719c46cdd32513e21e49",
    "src\\body.html": "7f4e26b1b350863fbd3b728959d21ebcf1be1a9c0e9e091bd2de4b96c8fb7b94",
    "src\\comparison.js": "3214f5a151d07e6815ac02fcfb2abcb98e4656365726dbd375e8ca92cc7c2895",
    "src\\core.js": "18007ffeaa74b883aa78f81f32549e54e63adbb649cc8f495d0b66d67018d813",
    "src\\page.css": "b947ca0e972d995d8a0dda1ac6a2b32d669ce0cba27fbee98334a7f378606aaf"
  },
  "reference_sha256": "7ec4a7fa6211f6c429031b3fd1df89371f7d1aae356ae8e695df647b74c45ba2",
  "limits": {
    "event_seconds": 1.000001e-06,
    "midi_ticks": 0,
    "wav_frames": 1,
    "pcm_rmse": 0.0001,
    "scheduled_seconds": 0.003,
    "visual_seconds": 0.06
  },
  "regression": [
    {
      "name": "Reference event fixture",
      "exit": 0,
      "summary": "Generated 48 reference event cases from Seq2Music 0.3.2\n"
    },
    {
      "name": "Core and frozen comparison regression",
      "exit": 0,
      "summary": "✔ Browser angular pan produces the frozen WAV channel gains (3.9207ms)\n✔ Strict default preserves identity, velocity and timing; interleaves A/B with reference stereo pan (1.0608ms)\n✔ Cue only affects the two mutation events and is reversible without editing source events (26.3055ms)\n✔ Single-track auditions use identical cue rules with centered pan (0.7243ms)\n✔ Invalid pair or creative events cannot enter strict comparison (1.5517ms)\n✔ Three repeated renders have identical events and export bytes; single-sequence exports unchanged (89.6181ms)\n✔ CSV explicitly records source and playback values, mutation, comparison and cue (0.4354ms)\n✔ Known DNA / RNA pitch alphabets and protein identity palette (4.5656ms)\n✔ Reference implementation agrees across all alphabets, four BPMs and four steps (7.4483ms)\n✔ Repeated events are deterministic; scientific mode ignores creative transforms (0.294ms)\n✔ FASTA normalizes whitespace and case; ambiguous type must be explicit (0.4844ms)\n✔ Single substitution is localized, including repeated bases; unequal lengths refused (0.1683ms)\n✔ BPM changes seconds inversely while MIDI beat positions remain stable (0.1771ms)\n✔ Creative scale/transpose/swing retains source values and monotonic timing (0.4094ms)\n✔ Statistics retain N in denominator and count all amino acids (0.2626ms)\n✔ MIDI serializes valid tempo, beat timestamps, velocities and both pan channels (3.5699ms)\n✔ WAV is PCM 16-bit stereo, non-silent, finite, deterministic and spectrally mapped (25.6025ms)\n✔ WAV hard left produces silence on right; export byte budget is enforced (2.6069ms)\n✔ CSV contains one row per event with original/output pitches and seconds (1.1575ms)\n✔ SVG emits explicit event labels and refuses unbounded visual exports (3.9517ms)\n✔ 100k event mapping is complete and bounded by validated length (68.9768ms)\n✔ Frozen scientific core matches the independently verified source byte for byte (3.6321ms)\n✔ All scientific alphabets, velocities, clock and gate obey fixed independent rules (4.5438ms)\nℹ tests 23\nℹ suites 0\nℹ pass 23\nℹ fail 0\nℹ cancelled 0\nℹ skipped 0\nℹ todo 0\nℹ duration_ms 246.0576\n"
    },
    {
      "name": "Existing offline browser regression",
      "exit": 0,
      "summary": "PASS Single HTML boots directly from file URL while offline \nPASS User-gesture playback, moving position, pause/resume and stop \nPASS Single-symbol editing refreshes pitch and undo restores input \nPASS BPM timing and invalid-parameter action gating \nPASS Invalid symbols and multi-record FASTA rejected; valid import preserves label \nPASS Equal-length comparison, exact differing position, stereo playback and length guard \nPASS Equal pitches in two tracks share the exact vertical coordinate \nPASS Creative transforms preserve base pitch; science restores mapping \nPASS RNA and protein input, note generation and live playback \nPASS All four download formats, dual-track range export and preserved original positions \nPASS Downloaded WAV decoded and played by browser native audio {\n  channels: 2,\n  sampleRate: 22050,\n  duration: 0.5875736961451247,\n  currentTime: 0.06999,\n  error: null\n}\nPASS Project JSON save/open restores both sequences and settings \nPASS 100k-symbol input, virtual timeline and jump near sequence end { elapsedMs: 176, visibleSvgNodes: 286 }\nPASS Oversized WAV / SVG gives useful range guidance \nPASS Keyboard timeline navigation and accessible help dialog \nPASS Large background WAV render can be canceled and editor remains available \nPASS Touch viewport 320px: playback, pause, comparison, editing, vertical scroll, no page overflow \nPASS Touch viewport 390px: playback, pause, comparison, editing, vertical scroll, no page overflow \nPASS Touch viewport 768px: playback, pause, comparison, editing, vertical scroll, no page overflow \nPASS Touch viewport 1024px: playback, pause, comparison, editing, vertical scroll, no page overflow \nPASS No page errors and zero HTTP(S) requests across tested offline sessions \n"
    },
    {
      "name": "Existing reset and undo regression",
      "exit": 0,
      "summary": ""
    },
    {
      "name": "Native stereo gains match frozen WAV",
      "exit": 0,
      "summary": "{\"tolerance\":0.000001,\"pass\":true,\"evidence\":[{\"logical\":-0.82,\"control\":-0.6120532751083374,\"gains\":[0.9539391994476318,0.29999998211860657],\"expected\":[0.9539392014169457,0.30000000000000004],\"maxError\":1.788139347702611e-8},{\"logical\":0.82,\"control\":0.6120532751083374,\"gains\":[0.29999998211860657,0.9539391994476318],\"expected\":[0.30000000000000004,0.9539392014169457],\"maxError\":1.788139347702611e-8}]}\n"
    },
    {
      "name": "Strict comparison exports and live browser",
      "exit": 0,
      "summary": "{\"cases\":32,\"browserChecks\":8,\"syncRuns\":6,\"errors\":0,\"network\":0}\n"
    }
  ],
  "checks": [
    {
      "name": "Frozen scientific core",
      "passed": true,
      "detail": null
    },
    {
      "name": "Independent reference identity",
      "passed": true,
      "detail": {
        "version": "0.3.2",
        "source": "<LOCAL_PROFILE>\\.codex\\plugins\\cache\\openai-curated-remote\\seq2music\\0.3.2\\scripts\\seq2music.py",
        "sha256": "7ec4a7fa6211f6c429031b3fd1df89371f7d1aae356ae8e695df647b74c45ba2"
      }
    },
    {
      "name": "Reference event fixture",
      "passed": true,
      "detail": null
    },
    {
      "name": "Core and frozen comparison regression",
      "passed": true,
      "detail": null
    },
    {
      "name": "Existing offline browser regression",
      "passed": true,
      "detail": null
    },
    {
      "name": "Existing reset and undo regression",
      "passed": true,
      "detail": null
    },
    {
      "name": "Native stereo gains match frozen WAV",
      "passed": true,
      "detail": null
    },
    {
      "name": "Strict comparison exports and live browser",
      "passed": true,
      "detail": null
    },
    {
      "name": "Offline console and network",
      "passed": true,
      "detail": {
        "browser": "157.0.4341.60",
        "errors": [],
        "network": [],
        "checks": [
          "Default off; fixed scientific parameters; browser events and all downloads match tested adapter",
          "Cue changes stop pending voices before rebuilding",
          "Project restores cue; legacy projects default off",
          "Invalid unequal pair blocks all strict playback and export targets",
          "Edit, reset and undo keep mutation position exact",
          "Entering comparison clears artistic transforms from effective parameters",
          "319px touch viewport: cue reachable with input collapsed, no page overflow, stereo playback, scroll",
          "390px touch viewport: cue reachable with input collapsed, no page overflow, stereo playback, scroll"
        ]
      }
    },
    {
      "name": "0 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "0 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "0 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "0 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "0 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "0 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "1 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "1 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "1 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "1 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "1 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "1 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "2 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "2 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "2 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "2 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "2 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "2 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "3 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "3 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "3 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "3 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "3 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "3 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "4 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "4 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "4 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "4 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "4 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "4 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "5 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "5 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "5 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "5 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "5 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "5 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "6 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "6 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "6 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "6 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "6 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "6 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "7 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "7 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "7 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "7 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "7 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "7 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "8 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "8 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "8 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "8 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "8 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "8 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "9 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "9 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "9 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "9 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "9 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "9 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "10 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "10 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "10 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "10 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "10 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "10 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "11 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "11 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "11 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "11 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "11 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "11 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "12 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "12 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "12 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "12 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "12 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "12 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "13 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "13 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "13 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "13 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "13 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "13 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "14 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "14 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "14 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "14 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "14 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "14 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "15 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "15 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "15 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "15 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "15 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "15 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "16 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "16 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "16 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "16 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "16 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "16 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "17 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "17 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "17 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "17 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "17 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "17 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "18 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "18 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "18 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "18 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "18 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "18 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "19 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "19 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "19 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "19 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "19 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "19 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "20 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "20 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "20 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "20 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "20 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "20 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "21 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "21 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "21 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "21 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "21 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "21 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "22 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "22 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "22 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "22 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "22 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "22 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "23 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "23 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "23 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "23 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "23 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "23 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "24 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "24 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "24 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "24 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "24 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "24 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "25 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "25 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "25 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "25 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "25 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "25 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "26 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "26 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "26 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "26 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "26 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "26 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "27 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "27 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "27 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "27 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "27 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "27 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "28 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "28 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "28 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "28 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "28 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "28 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "29 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "29 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "29 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "29 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "29 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "29 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "30 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "30 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "30 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "30 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "30 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "30 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "31 alignment is positional",
      "passed": true,
      "detail": null
    },
    {
      "name": "31 independent events",
      "passed": true,
      "detail": {
        "mismatches": [],
        "max_time_error": 0
      }
    },
    {
      "name": "31 MIDI notes controls tempo",
      "passed": true,
      "detail": null
    },
    {
      "name": "31 PCM independent synthesis",
      "passed": true,
      "detail": {
        "frame_delta": 0,
        "normalized_rmse": 0.0
      }
    },
    {
      "name": "31 CSV trace",
      "passed": true,
      "detail": null
    },
    {
      "name": "31 three deterministic runs",
      "passed": true,
      "detail": null
    },
    {
      "name": "Browser False midi byte equality",
      "passed": true,
      "detail": null
    },
    {
      "name": "Browser False wav byte equality",
      "passed": true,
      "detail": null
    },
    {
      "name": "Browser False csv byte equality",
      "passed": true,
      "detail": null
    },
    {
      "name": "Browser True midi byte equality",
      "passed": true,
      "detail": null
    },
    {
      "name": "Browser True wav byte equality",
      "passed": true,
      "detail": null
    },
    {
      "name": "Browser True csv byte equality",
      "passed": true,
      "detail": null
    },
    {
      "name": "Live cue=False run=0",
      "passed": true,
      "detail": {
        "onset": 0.0,
        "visual": 0.03,
        "notes": 16
      }
    },
    {
      "name": "Live cue=False run=1",
      "passed": true,
      "detail": {
        "onset": 2.220446049250313e-16,
        "visual": 0.02200000000000002,
        "notes": 16
      }
    },
    {
      "name": "Live cue=False run=2",
      "passed": true,
      "detail": {
        "onset": 3.3306690738754696e-16,
        "visual": 0.020666666666667277,
        "notes": 16
      }
    },
    {
      "name": "Live cue=True run=0",
      "passed": true,
      "detail": {
        "onset": 3.3306690738754696e-16,
        "visual": 0.0206666666666665,
        "notes": 16
      }
    },
    {
      "name": "Live cue=True run=1",
      "passed": true,
      "detail": {
        "onset": 8.881784197001252e-16,
        "visual": 0.02200000000000024,
        "notes": 16
      }
    },
    {
      "name": "Live cue=True run=2",
      "passed": true,
      "detail": {
        "onset": 8.881784197001252e-16,
        "visual": 0.01933333333333359,
        "notes": 16
      }
    },
    {
      "name": "Production source unchanged by tests",
      "passed": true,
      "detail": null
    },
    {
      "name": "Temporary outputs removed",
      "passed": true,
      "detail": null
    }
  ],
  "cases": [
    {
      "id": 0,
      "kind": "dna",
      "bpm": 40,
      "cue": false,
      "event_count": 16,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "173a81008775a5b8708a5353f306f25d7147d84809048e1ea5d3ebba7c68fab7",
        "midi": "9edb6fe828df7f2a411f8e11591a0d5505fc94951f9be153f51ef04d83a1dc17",
        "csv": "1f464a873828c185d4b4f21c765c56c3b7c41cbc2335711108f27ba4d89136d2",
        "wav": "6bfba252062ab06a7f30f7c1189b3460b4c6bbc1c2d1dc71e784458dcb57bcb1"
      }
    },
    {
      "id": 1,
      "kind": "dna",
      "bpm": 40,
      "cue": true,
      "event_count": 16,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "2efd88f83133df66cbb0fe05b0fd6f76e6814e745201321f4d712590b14489ac",
        "midi": "f19ef3891d509f7a85b5702ba1779be9592464f18de6a57b106f7a249968a52a",
        "csv": "877b13c224ca4d15370ad4610c2d2a0bbd956dd210018d880953a73281c0e697",
        "wav": "60126bc700496d2bf6bcfd951c3a8c8dbe1da933b90102b173a19c9086ed6b59"
      }
    },
    {
      "id": 2,
      "kind": "dna",
      "bpm": 100,
      "cue": false,
      "event_count": 16,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "bded3106533229aa4d9da97f42ec91f7004c2e8906cc0925485f22c8b1146f7a",
        "midi": "5c2a0fa7c9cf21dbe3e728ec8b047c512789a79d0304f1ec2e910da95420e716",
        "csv": "69c2cc4055b1cfda5c6d9e205201c6cf848e838674df0cd3479a4318428a8eb8",
        "wav": "d6ff91b9d0a3d3fe1f518bc18074ac6b00c56d53c9da367aedc4fe9a25e07472"
      }
    },
    {
      "id": 3,
      "kind": "dna",
      "bpm": 100,
      "cue": true,
      "event_count": 16,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "455ed94ba6f5c374f0a3c506a783e9de93db75e846339c3b61dd799b4445aa62",
        "midi": "f44da74eb1cd8ee38bc9a2306528c5239ca590869572c526f8c9d10a04a54e97",
        "csv": "381264f42ddc1f583a25818283821af895e4ab5bc7bf4d83b278533c781c5c29",
        "wav": "84455e711a60a4ff3ec8b98b760aaff4c68718c9a7c0579c95f4f681eeed74a5"
      }
    },
    {
      "id": 4,
      "kind": "dna",
      "bpm": 137,
      "cue": false,
      "event_count": 16,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "7e8cac606f4d32db81a0d7d93fea2d479406a9bc0c1f5a752dad96782f6706e0",
        "midi": "b28ccb29d16b9f062fec508c910f752260331c3ce3acf1d67b2f20acc9f38019",
        "csv": "3ac23bddc24794927cb6fbb925a0ce190bad0e082b4a6530cb2ffb9d2e5a1fa2",
        "wav": "9439ae587262e0bd36d39ad84a5f6fb5fd5a259941661108bfed460004465aaf"
      }
    },
    {
      "id": 5,
      "kind": "dna",
      "bpm": 137,
      "cue": true,
      "event_count": 16,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "b28e21c86eee5b038c61ba1c09dcb7296cfa6d5c7e13e9fbdc41c6de4b397150",
        "midi": "4146cda4fdc5e6751072a1bb52311b10d8f6616fbbfcfc13bea50a569ba74f0b",
        "csv": "a6f9c6a732de5f5fa4c0ce417904df1d57c1e3ca56e47478f7a9e0731fc86f1a",
        "wav": "765babe885d17e77c4a0dbd611e423aba6327339d3e5535926770f892c0408ca"
      }
    },
    {
      "id": 6,
      "kind": "dna",
      "bpm": 240,
      "cue": false,
      "event_count": 16,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "76d53635211bc4a078684131b6be6bf62bf6a1733e8c3fd5a141be8f19cb949e",
        "midi": "f410323a6a5810c5f4a8f3521616277ed526f5399360faac8ac60ed201abea70",
        "csv": "c351a4564c592144855c3efa1858c0956eea1e3ca195bdaf600a165ddf0fb0a9",
        "wav": "3087d3b202e435575277ccd4228c214bb857760896def058c8e9b770c23aa029"
      }
    },
    {
      "id": 7,
      "kind": "dna",
      "bpm": 240,
      "cue": true,
      "event_count": 16,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "c26088ae93c2a38696db34f55fa636ed624fa71d2f745b73b45fc71e4dcbcdc0",
        "midi": "3ec50b545cf246e654e00039757ca024bcdf07b6c812610097ab4f732652f42d",
        "csv": "112f67f789b53813e2d635a1e69cd97dacff831cc0ecad5aebed178544de0431",
        "wav": "387af7b2cd697ac8c6a4054ce82a5b4eb35c6ee34d8102ebf6ad0b02579de7da"
      }
    },
    {
      "id": 8,
      "kind": "dna",
      "bpm": 40,
      "cue": false,
      "event_count": 18,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "824dadadff96a372c965f85a3c267d8b76858e4005b1842ad49ee3ef6d4212b5",
        "midi": "59ec25f1f67770a53efb388a72c4ee9a7a2767add3579e0bbe76f331c63b91c6",
        "csv": "ae2f6eb514f674d1121b41d7e456c088cb7003d1aa5e254ff2364ae6888df28c",
        "wav": "8446d852d85d68f5df9cb58987b69a0d68943202c2ff512aedc21b491a9cac2d"
      }
    },
    {
      "id": 9,
      "kind": "dna",
      "bpm": 40,
      "cue": true,
      "event_count": 18,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "8657af9e978b4a196aeb26fda37f59955d4f042a6a7ed5aa65a663611db907bf",
        "midi": "3fbe1974253cfa3703f7b4d6aa6b0bc8537b32a09b464c2a52645d44dabcbd2e",
        "csv": "d4dd4977983d3fa4bb27c653bce3106d752642d4c1c4af7b4b1092563cc42577",
        "wav": "6caaa88572932589af046aee60423858125a7800115ac8fe5734895b12633308"
      }
    },
    {
      "id": 10,
      "kind": "dna",
      "bpm": 100,
      "cue": false,
      "event_count": 18,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "44a201bd6000de963a6db8c5085bfbb746172d05d28a6a883fe7967628febbd0",
        "midi": "acf227b740918842bec92bc1a65e7a331349cee3f4d7c4375bc558732d010e06",
        "csv": "4d1edaece862857c905276499eaa7da3fec6ce10dbec153c4d92d073ac85367a",
        "wav": "eb759ef408a19ab71122e5696ab008e17201f17b46f03e3779489359b615be3d"
      }
    },
    {
      "id": 11,
      "kind": "dna",
      "bpm": 100,
      "cue": true,
      "event_count": 18,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "77a14629a500c3f418da96370216c3d9bede0296477cf546733839509878c85e",
        "midi": "e78eee8bcf6012c6486e68c696f263f936ea33e963e5f0f212734dfecaea992e",
        "csv": "01733bc05e841b0f5651f7f4110f50aed863064d8f011bb1acab8bf0466df673",
        "wav": "f2a5554d7ce69c6ba5bbda0f1bd050f51a6798357dc500f8b4ccb00995a14501"
      }
    },
    {
      "id": 12,
      "kind": "dna",
      "bpm": 137,
      "cue": false,
      "event_count": 18,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "2f131b7dfba224a96cd37ba7d6d500c1e3b9aff766a563a1b15b086579ef18e0",
        "midi": "d241f0f2e44f7068bf0056d9b3a93b0849f922d31033f31d1cf0a1c4cdfb0e70",
        "csv": "bb56843059abeba86a75d6e85c18656d184bfaea92a88eb3ce52894674d60f32",
        "wav": "5f3e70453fd2b37e79326cd95f9958f38cadfdc7a6557f8f85a919e81ebe4c70"
      }
    },
    {
      "id": 13,
      "kind": "dna",
      "bpm": 137,
      "cue": true,
      "event_count": 18,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "a4060bb92b087ba7fb558d7ca772f717d161c0598e4fe5ea444355abd875aa4b",
        "midi": "4232700de334aa123cc3c4c89f0456b95e015c6d7d5641478e1f8bda5d014164",
        "csv": "e2eb8ab445ac9c1720ab744b49244c24c9583aecd88ff1f5b69315fd7eeba340",
        "wav": "8584254c00631acdd24f8cfe9de4a56bd5fd319cbce3983f8732f11dc2cf2525"
      }
    },
    {
      "id": 14,
      "kind": "dna",
      "bpm": 240,
      "cue": false,
      "event_count": 18,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "7733af5a73d9039b441cf57e96fc2a36c51d6f731746fcf115755856e4d90e94",
        "midi": "797261eabe988afb09dbd12e9bcfb4abfe62b5cf17903e80cc34883b20e1b27f",
        "csv": "304907c56b860ca2e3a52170bd12a531bf74e6861e735e5ffe4d691e3ff732bc",
        "wav": "34af0ac6a6cc2dc00d728429f4e6c6ae8bd130a75902fbfb7e23975dcc098236"
      }
    },
    {
      "id": 15,
      "kind": "dna",
      "bpm": 240,
      "cue": true,
      "event_count": 18,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "9e7f7dbc2732c493f60f1cbf7747608487671561f78aa179f5e17178d80243ad",
        "midi": "7961559c0887e16ac5e84888cb9b4f7834e64c8c20f92c7fb4f02679ad24f126",
        "csv": "a6c1e216d7a40c07300a55907f6ff7ab80eaeb3c75c20babe6514c599cd47971",
        "wav": "d5826164bacaeb382041bda5bbf540142b8419d2644944cf3f935bafe0a9108a"
      }
    },
    {
      "id": 16,
      "kind": "rna",
      "bpm": 40,
      "cue": false,
      "event_count": 16,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "2b0d95c5650a316a10ff510310433238022f463ac8eb2407c188acf2f95dc5fc",
        "midi": "9edb6fe828df7f2a411f8e11591a0d5505fc94951f9be153f51ef04d83a1dc17",
        "csv": "03e71ce821405496e1011cff7280ad25079f7c23189016f2f2068eaeb327e526",
        "wav": "6bfba252062ab06a7f30f7c1189b3460b4c6bbc1c2d1dc71e784458dcb57bcb1"
      }
    },
    {
      "id": 17,
      "kind": "rna",
      "bpm": 40,
      "cue": true,
      "event_count": 16,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "44338743f2d121da99030b0dc8f7153418e8b8b725b929c2d7d729ad7ac28c2c",
        "midi": "f19ef3891d509f7a85b5702ba1779be9592464f18de6a57b106f7a249968a52a",
        "csv": "f660f7aa8672d6ed40d2fef6b723da7ce3d914a1d1805c5ceea6fbc821b8f598",
        "wav": "60126bc700496d2bf6bcfd951c3a8c8dbe1da933b90102b173a19c9086ed6b59"
      }
    },
    {
      "id": 18,
      "kind": "rna",
      "bpm": 100,
      "cue": false,
      "event_count": 16,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "bc1fef4988cdeb2a424b6b70749c73e5d31151e72723943e340d088691330010",
        "midi": "5c2a0fa7c9cf21dbe3e728ec8b047c512789a79d0304f1ec2e910da95420e716",
        "csv": "b51f07c6fd09909067991d3f03cdca76d76749231cfecce18f5d86d2492c0ae4",
        "wav": "d6ff91b9d0a3d3fe1f518bc18074ac6b00c56d53c9da367aedc4fe9a25e07472"
      }
    },
    {
      "id": 19,
      "kind": "rna",
      "bpm": 100,
      "cue": true,
      "event_count": 16,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "20d8a8ebda9a2506a9048f1e306abb1f2e4f2841e98ccf1c173f972de9f8f78a",
        "midi": "f44da74eb1cd8ee38bc9a2306528c5239ca590869572c526f8c9d10a04a54e97",
        "csv": "88c34b61834356a6034ea963b5d1d148b85fc24bb00dc68faba7f73a38a8891f",
        "wav": "84455e711a60a4ff3ec8b98b760aaff4c68718c9a7c0579c95f4f681eeed74a5"
      }
    },
    {
      "id": 20,
      "kind": "rna",
      "bpm": 137,
      "cue": false,
      "event_count": 16,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "fa35519e25f18e96f3e8173dece1985798f906c32a3e70f028dc0387b8e4a39e",
        "midi": "b28ccb29d16b9f062fec508c910f752260331c3ce3acf1d67b2f20acc9f38019",
        "csv": "0091bf026e5f693ade800794e04b4c718d59304e390c2e1a297fb1fbc82e6b7e",
        "wav": "9439ae587262e0bd36d39ad84a5f6fb5fd5a259941661108bfed460004465aaf"
      }
    },
    {
      "id": 21,
      "kind": "rna",
      "bpm": 137,
      "cue": true,
      "event_count": 16,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "d9f0c73fd5831c3659735f95727f2423bac15b34f3d6df46d886d5a2dabdb2e0",
        "midi": "4146cda4fdc5e6751072a1bb52311b10d8f6616fbbfcfc13bea50a569ba74f0b",
        "csv": "5ce0988f0fd4f013961d9804eb278a6d7509e9aba9801ff1fb3ffb8f33e704ee",
        "wav": "765babe885d17e77c4a0dbd611e423aba6327339d3e5535926770f892c0408ca"
      }
    },
    {
      "id": 22,
      "kind": "rna",
      "bpm": 240,
      "cue": false,
      "event_count": 16,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "21f3afef0fe4bf17cdfdd9e6d03797ea73d6edbcad852457b916eb13207ae8a9",
        "midi": "f410323a6a5810c5f4a8f3521616277ed526f5399360faac8ac60ed201abea70",
        "csv": "76343ec28c2c3d86348c31ef74ad49cb12b5941b00c0343323cfbffc97cede11",
        "wav": "3087d3b202e435575277ccd4228c214bb857760896def058c8e9b770c23aa029"
      }
    },
    {
      "id": 23,
      "kind": "rna",
      "bpm": 240,
      "cue": true,
      "event_count": 16,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "004ad2157d4edcb7b979f7832857f696852e9200e50c0f3d922aa541de3b8787",
        "midi": "3ec50b545cf246e654e00039757ca024bcdf07b6c812610097ab4f732652f42d",
        "csv": "7fb16d3465a1e336679dfd69086c445d703000df04cbf781c75aa46fa65b2afe",
        "wav": "387af7b2cd697ac8c6a4054ce82a5b4eb35c6ee34d8102ebf6ad0b02579de7da"
      }
    },
    {
      "id": 24,
      "kind": "protein",
      "bpm": 40,
      "cue": false,
      "event_count": 40,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "5a55387591b0f3fddf21af64d282a0973d29afa9063e59129f4b1a34f95e4bec",
        "midi": "766624b5be61e4a540e02d3619b4214912e909f095f2662c508b50f4cc66d728",
        "csv": "68ebdf5e0f994bb572dadf50b1ad9054afcd3e0941d2200347cf77eca7756069",
        "wav": "881c2f4ca15dca33d9a45786b75c6c6d0c0adc8e355cebc674abffe2a6b638c8"
      }
    },
    {
      "id": 25,
      "kind": "protein",
      "bpm": 40,
      "cue": true,
      "event_count": 40,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "ec94ac6d57aa21c76c753d36a2c2adbbe04f665efbabb232d55a1aa4dc47cede",
        "midi": "ed268d94841ec831970a1bfbc0dd275b637a9d3faf1a02e710683dc87d8ed07b",
        "csv": "0ca4b5a815dc4a8e6eefc5400559b9994354e9c7e0152458887c2fec9bed363d",
        "wav": "85b523fe74d311e6cbceae3768c30633c8d98c802bb113f5781e24c2e3b85eef"
      }
    },
    {
      "id": 26,
      "kind": "protein",
      "bpm": 100,
      "cue": false,
      "event_count": 40,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "06918618d13070bcd78c2dc2884046f9de97af460e9674d3223829f22ff5a364",
        "midi": "80483c10dde4b3c0ad30151c5469ecaf10c03246f1fca8c8c703759fc5611cd6",
        "csv": "ee3c138577cd6c0cb3e1845f83ee2f42b3a64696319cf6e5046951971c3b5f3e",
        "wav": "6bc19fc38ddd50291fcb87a6593a07d7c156d12524b7af1a4f2fefb63a37e297"
      }
    },
    {
      "id": 27,
      "kind": "protein",
      "bpm": 100,
      "cue": true,
      "event_count": 40,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "8493cffb89f4b06171ae63f4d3d383bf21733c7fd57b0c6c212032f3f239aa59",
        "midi": "7ba040ecfecfd8cc53bf37db708a37438ecbc6590230e257c0501cb24357b6bb",
        "csv": "fecf0978933a21365de821d90fc11171d1ac4d282c1203c27602b732aeaeac83",
        "wav": "91a6421862f183c4a23858c445a37d9678c6746aac0309879a7632fbf5c2284a"
      }
    },
    {
      "id": 28,
      "kind": "protein",
      "bpm": 137,
      "cue": false,
      "event_count": 40,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "a7a0a826df4858402756f5e85ce0449550d4fa5d990fd4530bc800865a339699",
        "midi": "d3155dde8801b8e1ff7c844c448c4a3664bdeaecc5f380a05f079af1fcd41ee0",
        "csv": "f946b6f0c639f620c407aed22ff0df6866ab533e0c3616a6dc9377de0686e7d7",
        "wav": "12c80110143c7e53ca097c7896285ff29a331445cd37122e482fbe6c90835069"
      }
    },
    {
      "id": 29,
      "kind": "protein",
      "bpm": 137,
      "cue": true,
      "event_count": 40,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "8dfe64f5b3aca2767151fc3cfd5ce2602fdc7328c46719e2c7ca8fc841ba2e36",
        "midi": "4b524cd31642828719150c90327c1fedf9dfc6e788d24c9c6800ed8fbafd992a",
        "csv": "555baaee7d291122c4ee392e2764e80c4b77463ad4d7e808ef9dbb92007ca974",
        "wav": "d43160e358052246ab0ae6c6286e2bd403141d614e65a85c431b76ccd0016526"
      }
    },
    {
      "id": 30,
      "kind": "protein",
      "bpm": 240,
      "cue": false,
      "event_count": 40,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "077d8f051ac54a7545cca89d501287452e264e6529f53f3bea29f6818778a2de",
        "midi": "a56356f3088d7ffb8171d257492657271af7811fe58e60f566cb777c291a2a17",
        "csv": "fc36610150b080b0df3661383658d492bfbf2bfdc19a4fa155a5a59ab7c9f241",
        "wav": "538934267df8109e7b8ae8b335878963a731df846614baa8f3573c17957ab594"
      }
    },
    {
      "id": 31,
      "kind": "protein",
      "bpm": 240,
      "cue": true,
      "event_count": 40,
      "time_error": 0,
      "frame_delta": 0,
      "pcm_rmse": 0.0,
      "hashes": {
        "events": "ddd28c95d76e8556680aeaeb7146c60c4879af9a6c26daa6528b8a619e269c6d",
        "midi": "81c68bfe1be4ad5a84ae4eed04e005c91f7ffa131d7b58e30557e918da402fd4",
        "csv": "cd0240d5ff777b5e181b1a536d5b7007e650c497ed732cf2cc766836cb631d91",
        "wav": "ff4fc12c9d3cfaa322b6bd62bb8b8bd8afd7c8579b41aa28879269a81eff9c1b"
      }
    }
  ],
  "live": [
    {
      "cue": false,
      "run": 0,
      "notes": 16,
      "onset_error_seconds": 0.0,
      "visual_error_seconds": 0.03
    },
    {
      "cue": false,
      "run": 1,
      "notes": 16,
      "onset_error_seconds": 2.220446049250313e-16,
      "visual_error_seconds": 0.02200000000000002
    },
    {
      "cue": false,
      "run": 2,
      "notes": 16,
      "onset_error_seconds": 3.3306690738754696e-16,
      "visual_error_seconds": 0.020666666666667277
    },
    {
      "cue": true,
      "run": 0,
      "notes": 16,
      "onset_error_seconds": 3.3306690738754696e-16,
      "visual_error_seconds": 0.0206666666666665
    },
    {
      "cue": true,
      "run": 1,
      "notes": 16,
      "onset_error_seconds": 8.881784197001252e-16,
      "visual_error_seconds": 0.02200000000000024
    },
    {
      "cue": true,
      "run": 2,
      "notes": 16,
      "onset_error_seconds": 8.881784197001252e-16,
      "visual_error_seconds": 0.01933333333333359
    }
  ],
  "failures": []
}
```

## 边界

未实施插入删除、序列对齐、MusicXML 和完整可逆元数据编解码。不同音色播放器中的 MIDI 听感不由本工具控制；泛音提示保存在 WAV 与 Web Audio 中，MIDI 保留力度提示。浏览器音频时钟验证不包括扬声器实测延迟。手机检查为触控视口模拟，未做手机真机验收。当前整体视觉风格仍未获得用户认可，本次仅修改比较操作。AI 模拟不能证明真实人类听觉识别效率；此项仅供后续笔记引用，不加入工具。
