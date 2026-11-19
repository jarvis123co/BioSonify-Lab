> Historical record. Local profile paths redacted for publication; scientific results retained. See ../../VALIDATION.md for the current scope.

# 冻结后缺陷修复：互补链 N 标注

用户明确授权将 DNA 互补链的问号改为 N，科学映射保持冻结。2026-11-17 完成。当前版本仍为 Research-Ready v1.0.0。

改动仅为 src/app.js 中互补显示表的一个字符；生成的 HTML 也仅改变同一字符。悬停说明随之显示“互补 N”，颜色和未知配对虚线保留。其余源文件原始字节 SHA 与初次冻结记录一致。

修复前在桌面和窄屏实际复现“第 5 位 N · 互补 ?”，修复后为“第 5 位 N · 互补 N”。既有冻结门槛修复前 / 后各 9 项通过；本次浏览器补跑 8 项汇总检查通过，0 失败。测试样本 ACGTN 的五个事件及实际下载 CSV / SVG 字节完全相同。研究记录使用更新后的 app 脚本 SHA，记录完整性校验通过。桌面和 319 px 示意图截图已查看；手机真机未测。

测试启动曾受本地执行权限限制；按授权以普通本地权限运行后完成。临时检查脚本首次误把校验结果对象当数组，修正脚本读取方式后完成修复前基线；应用未因此修改。只保留此摘要和恢复点，临时下载、截图及检查脚本清理。

未重跑完整映射矩阵或独立 Seq2Music 交叉验证。既有证据保留在下方原报告；以下当前补丁摘要用于归档校验，不把原 50 项验证改记为本轮新执行结果。播放与导出实现均未变，MIDI / WAV 继续复用原证据。

执行入口：`node scripts/check-science.cjs`（修复前）、`node scripts/build.cjs`（修复后执行同一冻结门槛）。浏览器固定输入 ACGTN；核对五组互补字符、N 悬停说明 / 颜色 / 虚线、点击第 5 位、替换 A 后撤销、A/B 切换、RNA / 蛋白质单链。下载 CSV / SVG 和研究记录，比较文件 SHA、事件与当前脚本 SHA。恢复点为 checkpoints/before-complement-n-label；首次冻结归档保留。

```json
{
  "version": "1.0.0",
  "edition": "Research-Ready",
  "date": "2026-11-17T03:38:25.031458+08:00",
  "scope": "DNA complementary strand label only: N ? -> N; one source byte and one generated HTML byte",
  "freezeEligible": true,
  "failures": [],
  "checksPassed": 17,
  "checks": [
    "1440px: all five complement labels, N tooltip/color/dashes, selection/edit/undo and no horizontal overflow",
    "Downloaded CSV / SVG and research record: valid SVG, N retained, current app source hash and record integrity valid",
    "A/B track switching preserves the selected source symbol and difference position",
    "1440px: RNA and protein remain single-strand diagrams",
    "319px: all five complement labels, N tooltip/color/dashes, selection/edit/undo and no horizontal overflow",
    "319px: RNA and protein remain single-strand diagrams",
    "Before/after events and downloaded CSV / SVG SHA-256 match exactly",
    "Offline local page: no page errors or external network requests"
  ],
  "scienceGate": {
    "before": {
      "passed": 9,
      "failed": 0
    },
    "after": {
      "passed": 9,
      "failed": 0
    }
  },
  "source_hashes": {
    "BioSonify-Lab.html": "a92cdd0d5df9eac6447005685080c7f8f09b9643c9def7dba799e093877075bb",
    "src\\app.js": "fdb484dbbccae1a2cb01778f67f027cdee6183b2d724d8b4128551fdc8b17a82",
    "src\\body.html": "a95f67343fc41c32bf9936bf1e879c10e732bab439a43324a084e283742e4bfc",
    "src\\comparison.js": "3214f5a151d07e6815ac02fcfb2abcb98e4656365726dbd375e8ca92cc7c2895",
    "src\\core.js": "18007ffeaa74b883aa78f81f32549e54e63adbb649cc8f495d0b66d67018d813",
    "src\\page.css": "a07503a9cebe657d9175b7a7dee7b351503f5ad2178476ca10fe8738d8e64f41",
    "src\\research.js": "6746622466f362cccef24d006d7bb9a2252aab176c763a8e082dce3b12ef9fef"
  },
  "normalized_script_hashes": {
    "core": "e12881dbb72a9ad192e5ce9703059db7af54f1b7a70b0d8202655ef8b2dc89bc",
    "comparison": "3214f5a151d07e6815ac02fcfb2abcb98e4656365726dbd375e8ca92cc7c2895",
    "research": "6746622466f362cccef24d006d7bb9a2252aab176c763a8e082dce3b12ef9fef",
    "app": "4d670bad2633c6fceb6df828f89ea6cf0113116c37c0d06135b728823b0e9870"
  },
  "browser": "157.0.4341.60",
  "viewports": [
    "1440x1080",
    "319x518"
  ],
  "physicalPhoneTested": false,
  "eventComparison": "5 ACGTN events exactly equal before/after; N pitch 66, velocity 38",
  "unchangedExportSha256": {
    "csv": "92aafe15870d4d1499017f489241477372a2a3616e3f5971afd41f6d28933238",
    "svg": "35bb28f50204f71c03a090b888d8a1880f0424340a513657b3e8b0f8af0953e9"
  },
  "pageErrors": 0,
  "externalRequests": 0,
  "rollback": "checkpoints/before-complement-n-label",
  "temporaryTestArtifactsRetained": false
}
```

---

以下为首次冻结的补充验收历史记录，日期、源码哈希与执行范围保持原样。

# Research-Ready v1.0 补充验收报告

本轮由用户明确追加授权：只修复 UTF-8 读取和源码哈希定义，科学核心及比较计算不改；只补跑受影响与上次中断检查。没有追加分子 / BPM 矩阵、受试者实验或编解码功能。

结果：通过 50 项汇总检查，失败 0 项。补充验收通过，可结合保留证据发布并冻结。

## 两项修复

1. 所有研究 JSON 读取明确为 UTF-8；JSON 写入与文本哈希也明确使用 UTF-8。包含中文、希腊字符的实际下载记录由独立 Python hashlib 重新检查。CSV 按 UTF-8 BOM 规范读取。
2. 研究记录新增 sourceHashDefinition：SHA-256、UTF-8、CRLF 与单独 CR 转 LF、script-text。源码哈希只针对归一化脚本文本，不做 Unicode、空白或其他转换；发布清单的文件哈希始终针对原始字节。输入、事件与实际导出文件保持各自原有字节 / 序列化规则，不参与源码换行归一化。

## 复用与补跑边界

科学核心、比较文件、app.js、界面结构和样式与上次已测候选逐字节一致。复用原 96 组 / 1104 映射事件、100000 事件哈希、32 组比较及上轮 12 项浏览器工作流（含编辑期间导出、取消、错误保留、完整音符包络与触控下载）。没有重跑这些工作流。构建既有冻结门槛照常执行；research.js 的记录单元检查属于受影响回归。

本轮重新产生上次已清理的 5 份研究记录和所需载体，完成独立输入 / 事件 / runId / 记录 / 源码哈希绑定，两个固定对照载体的 MIDI、WAV、CSV、SVG 解析，以及损坏记录、损坏文件和缺失文件拒绝。生成这些文件只为完成原验收，使用后删除。

## 固定判据与兼容范围

原文件冻结 SHA 完全一致；归一化源码 SHA、输入 SHA、事件 SHA、记录 SHA 及实际载体 SHA 完全一致；MIDI tick、音高、力度、声道控制与参考完全相等；WAV 帧数相等、归一化 PCM RMSE ≤0.0001；篡改和缺失文件必须拒绝。未降低原标准。提示开启的等长位置样本对照 Seq2Music 原始 diff，提示关闭按已声明的无额外强调规则核对。没有 MusicXML 或严格可逆兼容声明。

## 实际执行摘要

```json
{
  "version": "1.0.0",
  "edition": "Research-Ready",
  "date": "2026-11-17T02:26:53.440100+08:00",
  "freezeEligible": true,
  "source_hashes": {
    "BioSonify-Lab.html": "105e85219feb2a8c3617b914f484c64200243ca86f5a20bfe92088e5c8d33df4",
    "src\\app.js": "8acbd070c1b878626c767be0f8bfb52cb402d7fa3ff8e9700040d86395a82c2c",
    "src\\body.html": "a95f67343fc41c32bf9936bf1e879c10e732bab439a43324a084e283742e4bfc",
    "src\\comparison.js": "3214f5a151d07e6815ac02fcfb2abcb98e4656365726dbd375e8ca92cc7c2895",
    "src\\core.js": "18007ffeaa74b883aa78f81f32549e54e63adbb649cc8f495d0b66d67018d813",
    "src\\page.css": "a07503a9cebe657d9175b7a7dee7b351503f5ad2178476ca10fe8738d8e64f41",
    "src\\research.js": "6746622466f362cccef24d006d7bb9a2252aab176c763a8e082dce3b12ef9fef"
  },
  "normalized_script_hashes": {
    "core": "e12881dbb72a9ad192e5ce9703059db7af54f1b7a70b0d8202655ef8b2dc89bc",
    "comparison": "3214f5a151d07e6815ac02fcfb2abcb98e4656365726dbd375e8ca92cc7c2895",
    "research": "6746622466f362cccef24d006d7bb9a2252aab176c763a8e082dce3b12ef9fef",
    "app": "0471d5c89e5cc05ff452c40f152b804d93c998a88bab5f446b6191ce76374977"
  },
  "reused_workflows": [
    {
      "name": "FASTA normalization, four actual outputs and one merged SHA-256 research record"
    },
    {
      "name": "Invalid and multi-record input cannot replace or export an invalid dataset"
    },
    {
      "name": "RNA and protein record types, event counts and new-run isolation"
    },
    {
      "name": "Positional comparison, order, source/output velocities, stereo and rebased range trace"
    },
    {
      "name": "Project JSON restores scientific comparison; saved research records remain separate files"
    },
    {
      "name": "Single-site change, reset and undo preserve exact difference location"
    },
    {
      "name": "Real background WAV uses its captured input and range after the editor changes"
    },
    {
      "name": "Cancel leaves the last complete record intact and creates no artifact"
    },
    {
      "name": "Hash failure is visible and cannot replace a valid record"
    },
    {
      "name": "240 BPM full-note Web Audio envelope uses the frozen 20/35 ms values",
      "detail": {
        "attack": 0.020000000000000004,
        "release": 0.035
      }
    },
    {
      "name": "319px touch viewport: exports and record download reachable without overflow"
    },
    {
      "name": "Zero page errors and zero HTTP(S) requests in offline browser sessions"
    }
  ],
  "prior_attempt_sha256": "35fe589a8b2faa244a1b5e1d700637266c53efb5698d79fcd244d79d2d53b88e",
  "environment": {
    "python": "3.12.14",
    "os": "Windows-11-10.0.26300-SP0",
    "browser": "157.0.4341.60"
  },
  "checks": [
    {
      "name": "Reuse unchanged source src\\core.js",
      "passed": true,
      "detail": null
    },
    {
      "name": "Reuse unchanged source src\\comparison.js",
      "passed": true,
      "detail": null
    },
    {
      "name": "Reuse unchanged source src\\app.js",
      "passed": true,
      "detail": null
    },
    {
      "name": "Reuse unchanged source src\\body.html",
      "passed": true,
      "detail": null
    },
    {
      "name": "Reuse unchanged source src\\page.css",
      "passed": true,
      "detail": null
    },
    {
      "name": "Reuse verified src\\core.js",
      "passed": true,
      "detail": null
    },
    {
      "name": "Reuse verified src\\comparison.js",
      "passed": true,
      "detail": null
    },
    {
      "name": "Build and existing freeze/invariant checks",
      "passed": true,
      "detail": null
    },
    {
      "name": "Research record units",
      "passed": true,
      "detail": null
    },
    {
      "name": "Affected export records only",
      "passed": true,
      "detail": null
    },
    {
      "name": "Browser: UTF-8 FASTA, four downloaded formats and explicit source-hash definition",
      "passed": true,
      "detail": null
    },
    {
      "name": "Browser: Regenerated RNA and protein records for interrupted independent checks",
      "passed": true,
      "detail": null
    },
    {
      "name": "Browser: Same DNA pair, range 2–7, cue off/on downloads; no expanded matrix",
      "passed": true,
      "detail": null
    },
    {
      "name": "Independent record hashes: single",
      "passed": true,
      "detail": null
    },
    {
      "name": "Input / source binding: single",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual artifact bytes: single/csv",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual artifact bytes: single/midi",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual artifact bytes: single/svg",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual artifact bytes: single/wav",
      "passed": true,
      "detail": null
    },
    {
      "name": "Standalone record verifier",
      "passed": true,
      "detail": null
    },
    {
      "name": "Independent record hashes: rna",
      "passed": true,
      "detail": null
    },
    {
      "name": "Input / source binding: rna",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual artifact bytes: rna/csv",
      "passed": true,
      "detail": null
    },
    {
      "name": "Independent record hashes: protein",
      "passed": true,
      "detail": null
    },
    {
      "name": "Input / source binding: protein",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual artifact bytes: protein/csv",
      "passed": true,
      "detail": null
    },
    {
      "name": "Independent record hashes: cue-off",
      "passed": true,
      "detail": null
    },
    {
      "name": "Input / source binding: cue-off",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual artifact bytes: cue-off/csv",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual artifact bytes: cue-off/midi",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual artifact bytes: cue-off/wav",
      "passed": true,
      "detail": null
    },
    {
      "name": "Independent record hashes: cue-on",
      "passed": true,
      "detail": null
    },
    {
      "name": "Input / source binding: cue-on",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual artifact bytes: cue-on/csv",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual artifact bytes: cue-on/midi",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual artifact bytes: cue-on/wav",
      "passed": true,
      "detail": null
    },
    {
      "name": "Reference source unchanged",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual comparison MIDI: cue-off",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual comparison WAV: cue-off",
      "passed": true,
      "detail": {
        "normalized_rmse": 0.0,
        "frames": 24863
      }
    },
    {
      "name": "Actual comparison CSV: cue-off",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual comparison MIDI: cue-on",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual comparison WAV: cue-on",
      "passed": true,
      "detail": {
        "normalized_rmse": 0.0,
        "frames": 24863
      }
    },
    {
      "name": "Actual comparison CSV: cue-on",
      "passed": true,
      "detail": null
    },
    {
      "name": "Actual SVG parses",
      "passed": true,
      "detail": null
    },
    {
      "name": "Input UTF-8 semantic text preserved",
      "passed": true,
      "detail": null
    },
    {
      "name": "Tampered record rejected",
      "passed": true,
      "detail": null
    },
    {
      "name": "Tampered file rejected",
      "passed": true,
      "detail": null
    },
    {
      "name": "Missing output files rejected",
      "passed": true,
      "detail": null
    },
    {
      "name": "Tests did not change production",
      "passed": true,
      "detail": null
    },
    {
      "name": "Temporary carriers removed",
      "passed": true,
      "detail": null
    }
  ],
  "failures": [],
  "runs": [
    {
      "name": "Build and existing freeze/invariant checks",
      "exit": 0,
      "summary": "✔ Browser angular pan produces the frozen WAV channel gains (1.9401ms)\n✔ Strict default preserves identity, velocity and timing; interleaves A/B with reference stereo pan (0.936ms)\n✔ Cue only affects the two mutation events and is reversible without editing source events (29.5987ms)\n✔ Single-track auditions use identical cue rules with centered pan (0.1886ms)\n✔ Invalid pair or creative events cannot enter strict comparison (1.4855ms)\n✔ Three repeated renders have identical events and export bytes; single-sequence exports unchanged (47.2258ms)\n✔ CSV explicitly records source and playback values, mutation, comparison and cue (0.4059ms)\n✔ Frozen scientific core matches the independently verified source byte for byte (2.8978ms)\n✔ All scientific alphabets, velocities, clock and gate obey fixed independent rules (7.1172ms)\nℹ tests 9\nℹ suites 0\nℹ pass 9\nℹ fail 0\nℹ cancelled 0\nℹ skipped 0\nℹ todo 0\nℹ duration_ms 199.9246\nBuilt BioSonify-Lab.html · 111,351 bytes\n"
    },
    {
      "name": "Research record units",
      "exit": 0,
      "summary": "✔ SHA-256 uses exact UTF-8 bytes and typed-array slice boundaries (13.2856ms)\n✔ Source hashes normalize only line endings; raw input and artifact bytes stay exact (14.1605ms)\n✔ Capture is isolated from edits before asynchronous hashing finishes (2.5172ms)\n✔ Three identical captures have identical semantic identities and event hashes (2.1834ms)\n✔ Actual artifact bytes bind to record; same run merges formats and a new run starts cleanly (33.2009ms)\n✔ Event, input, parameter and artifact tampering are detected (6.9193ms)\nℹ tests 6\nℹ suites 0\nℹ pass 6\nℹ fail 0\nℹ cancelled 0\nℹ skipped 0\nℹ todo 0\nℹ duration_ms 219.623\n"
    },
    {
      "name": "Affected export records only",
      "exit": 0,
      "summary": "{\"checks\":3,\"downloads\":12,\"records\":5}\n"
    },
    {
      "name": "Standalone record verifier",
      "exit": 0,
      "summary": "{\n  \"ok\": true,\n  \"checks\": [\n    {\n      \"name\": \"record\",\n      \"ok\": true\n    },\n    {\n      \"name\": \"runIdentity\",\n      \"ok\": true\n    },\n    {\n      \"name\": \"events\",\n      \"ok\": true\n    },\n    {\n      \"name\": \"input-A\",\n      \"ok\": true\n    }\n  ],\n  \"artifacts\": [\n    {\n      \"file\": \"<LOCAL_PROFILE>\\\\AppData\\\\Local\\\\Temp\\\\biosonify-v1-final-gfe6d622\\\\outputs\\\\single.csv\",\n      \"bytes\": 1140,\n      \"sha256\": \"92aafe15870d4d1499017f489241477372a2a3616e3f5971afd41f6d28933238\",\n      \"matches\": [\n        \"BioSonify-science-dna-A-1-5.csv\"\n      ]\n    },\n    {\n      \"file\": \"<LOCAL_PROFILE>\\\\AppData\\\\Local\\\\Temp\\\\biosonify-v1-final-gfe6d622\\\\outputs\\\\single.midi\",\n      \"bytes\": 305,\n      \"sha256\": \"71d68347945b54703c43e4f215c0668b1dd6268083a6159a762f1a423369aa54\",\n      \"matches\": [\n        \"BioSonify-science-dna-A-1-5.mid\"\n      ]\n    },\n    {\n      \"file\": \"<LOCAL_PROFILE>\\\\AppData\\\\Local\\\\Temp\\\\biosonify-v1-final-gfe6d622\\\\outputs\\\\single.svg\",\n      \"bytes\": 2504,\n      \"sha256\": \"35bb28f50204f71c03a090b888d8a1880f0424340a513657b3e8b0f8af0953e9\",\n      \"matches\": [\n        \"BioSonify-science-dna-A-1-5.svg\"\n      ]\n    },\n    {\n      \"file\": \"<LOCAL_PROFILE>\\\\AppData\\\\Local\\\\Temp\\\\biosonify-v1-final-gfe6d622\\\\outputs\\\\single.wav\",\n      \"bytes\": 83620,\n      \"sha256\": \"a44b14a969a09f52466539f241ff2cfed5e16f2bac47861fe561fbfda7da2d72\",\n      \"matches\": [\n        \"BioSonify-science-dna-A-1-5.wav\"\n      ]\n    }\n  ],\n  \"uncheckedArtifacts\": [],\n  \"scope\": \"Record integrity and supplied file bytes\"\n}\n"
    },
    {
      "name": "Tampered record rejected",
      "exit": 1,
      "summary": "{\n  \"ok\": false,\n  \"checks\": [\n    {\n      \"name\": \"record\",\n      \"ok\": false\n    },\n    {\n      \"name\": \"runIdentity\",\n      \"ok\": false\n    },\n    {\n      \"name\": \"events\",\n      \"ok\": true\n    },\n    {\n      \"name\": \"input-A\",\n      \"ok\": true\n    }\n  ],\n  \"artifacts\": [],\n  \"uncheckedArtifacts\": [\n    \"BioSonify-science-dna-A-1-5.csv\",\n    \"BioSonify-science-dna-A-1-5.mid\",\n    \"BioSonify-science-dna-A-1-5.svg\",\n    \"BioSonify-science-dna-A-1-5.wav\"\n  ],\n  \"scope\": \"Record integrity only; output files not supplied\"\n}\n"
    },
    {
      "name": "Tampered file rejected",
      "exit": 1,
      "summary": "{\n  \"ok\": false,\n  \"checks\": [\n    {\n      \"name\": \"record\",\n      \"ok\": true\n    },\n    {\n      \"name\": \"runIdentity\",\n      \"ok\": true\n    },\n    {\n      \"name\": \"events\",\n      \"ok\": true\n    },\n    {\n      \"name\": \"input-A\",\n      \"ok\": true\n    }\n  ],\n  \"artifacts\": [\n    {\n      \"file\": \"<LOCAL_PROFILE>\\\\AppData\\\\Local\\\\Temp\\\\biosonify-v1-final-gfe6d622\\\\outputs\\\\tampered.csv\",\n      \"bytes\": 1141,\n      \"sha256\": \"2094089a29eba192a9ebcdf992a4cefccb323c7bc69a72685f9d14459b1c70ca\",\n      \"matches\": []\n    }\n  ],\n  \"uncheckedArtifacts\": [\n    \"BioSonify-science-dna-A-1-5.csv\",\n    \"BioSonify-science-dna-A-1-5.mid\",\n    \"BioSonify-science-dna-A-1-5.svg\",\n    \"BioSonify-science-dna-A-1-5.wav\"\n  ],\n  \"scope\": \"Record integrity and supplied file bytes\"\n}\n"
    },
    {
      "name": "Missing output files rejected",
      "exit": 1,
      "summary": "{\n  \"ok\": false,\n  \"checks\": [\n    {\n      \"name\": \"record\",\n      \"ok\": true\n    },\n    {\n      \"name\": \"runIdentity\",\n      \"ok\": true\n    },\n    {\n      \"name\": \"events\",\n      \"ok\": true\n    },\n    {\n      \"name\": \"input-A\",\n      \"ok\": true\n    }\n  ],\n  \"artifacts\": [\n    {\n      \"file\": \"<LOCAL_PROFILE>\\\\AppData\\\\Local\\\\Temp\\\\biosonify-v1-final-gfe6d622\\\\outputs\\\\single.csv\",\n      \"bytes\": 1140,\n      \"sha256\": \"92aafe15870d4d1499017f489241477372a2a3616e3f5971afd41f6d28933238\",\n      \"matches\": [\n        \"BioSonify-science-dna-A-1-5.csv\"\n      ]\n    }\n  ],\n  \"uncheckedArtifacts\": [\n    \"BioSonify-science-dna-A-1-5.mid\",\n    \"BioSonify-science-dna-A-1-5.svg\",\n    \"BioSonify-science-dna-A-1-5.wav\"\n  ],\n  \"scope\": \"Record integrity and supplied file bytes\"\n}\n"
    }
  ],
  "comparison_downloads": [
    {
      "label": "cue-off",
      "events": 12,
      "pcm_rmse": 0.0,
      "frames": 24863,
      "file_hashes": {
        "midi": "b08db23a8ff71f9b9f5d0472686d64a4b415cb5e737a87bcf8bfc93d91d3713f",
        "wav": "cfdaf4dfc889d2c9dc64a549abb1ebd6a8e2580964ae1fb657d7f4ec4ae665d7",
        "csv": "9560a87cc1bf8e1c9fe53fc2d17bb691e87a6a888b0cae7cce0e853b2d3d4d30"
      }
    },
    {
      "label": "cue-on",
      "events": 12,
      "pcm_rmse": 0.0,
      "frames": 24863,
      "file_hashes": {
        "midi": "6f55a17980d4136834b547a378e7971279178c103c96a5b53ed9ea64521f2854",
        "wav": "f35d4da9f51955e987520acd2390c4b58cd877623feef235a183dd12f4780cc1",
        "csv": "d17f587c4400ef2d9a97a1c21d8b849da54030e004f2f402259af978c74b6222"
      }
    }
  ],
  "browser_checks": [
    {
      "name": "UTF-8 FASTA, four downloaded formats and explicit source-hash definition"
    },
    {
      "name": "Regenerated RNA and protein records for interrupted independent checks"
    },
    {
      "name": "Same DNA pair, range 2–7, cue off/on downloads; no expanded matrix"
    }
  ],
  "browser_errors": [],
  "network": [],
  "temporary_removed": true
}
```
