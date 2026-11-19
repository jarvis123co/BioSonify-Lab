# Validation scope

The records below describe tests performed during development on 17 November 2026. They are retained historical results, not new experiments performed during public-repository preparation. Cross-implementation checks used the original Seq2Music 0.3.2 Python source within the same project; no independent laboratory or participant study was involved.

Historical environment: Windows 11, Python 3.12.14, NumPy 2.3.5, Node.js 24.22.1 and Edge 157.0.4341.60. Reference source SHA-256: `7ec4a7fa6211f6c429031b3fd1df89371f7d1aae356ae8e695df647b74c45ba2`.

| Scope | Recorded result | Boundary |
| --- | --- | --- |
| Mapping | 96 configurations, 1,104 events; exact discrete fields and zero observed timing difference | Six synthetic fixtures, four tempos and four steps; non-0.3 steps used creative identity settings |
| Long input | 100,000-event normalized stream hash matched | Not a complete 100,000-note audio rendering test |
| Musical carriers | MIDI note events and CSV common fields matched; six WAV fixtures matched frame counts and PCM hashes | 100 BPM, 0.3 beat; container metadata and CSV schemas differ |
| WAV acoustics | Maximum pitch error 0.004687 cents; onset 0.227 ms; offset 0.544 ms | Predeclared limits: 25 cents, 2 ms on/off, one frame, 0.5 dB RMS and normalized RMSE 0.0001 |
| Strict comparison | 32 configurations; cue-on matched positional reference diff; cue-off matched the declared no-extra-emphasis configuration | Same-type, equal-length substitutions only |
| Repeatability | Three repeats had stable event and export hashes within each implementation | Timestamp-bearing research records are not expected to be byte-identical |
| Offline browser | Loading, playback, edits, comparison and downloads passed; zero HTTP(S) requests and page errors | Tested desktop browser and simulated touch viewports |
| Final freeze supplement | 50 aggregate checks passed, zero failed; two cue-state PCM comparisons had RMSE zero | Limited affected checks; do not sum aggregate counts as independent experiments |
| Complement label patch | Nine freeze gates and eight limited browser checks passed | N display only; scientific module unchanged |

## Historical evidence

The retained summaries are in `docs/history/`. They contain Chinese prose and machine-readable result blocks. Private local profile paths were redacted; numeric results and checksums were retained. The older controlled-study comparison used different pan and event-order rules; those comparison findings were superseded by the strict-comparison report and final freeze. Do not describe the older behavior as current.

Temporary carrier files, screenshots and run directories from the controlled experiments were deleted after summarization. The public package includes the existing portable Node unit checks and the retained 48-configuration reference fixture. That fixture belongs to an earlier regression check and does not constitute the entire 96-configuration experiment. The original full browser orchestration is environment-specific and is not advertised as a portable command in this package.

## Current guarantees and exclusions

`src/core.js` retains raw-byte SHA-256 `18007ffeaa74b883aa78f81f32549e54e63adbb649cc8f495d0b66d67018d813`. The complete current standalone HTML has SHA-256 `a92cdd0d5df9eac6447005685080c7f8f09b9643c9def7dba799e093877075bb`. All program source hashes are in `SOURCE_SHA256.json`.

The comparison profile preserves symbol-dependent velocity when cues are off. Cues on add emphasis. A/B serialization alternates by position; logical pan is −0.82/+0.82 and MIDI CC10 is 12/115. The default cue-off profile differs from the reference's default diff rendering.

Full Seq2Music MIDI/WAV/MusicXML codec compatibility, exact recovery, alignment, protein structure analysis, human detection gains, physical-device latency and unrestricted browser portability are not established. Metadata-free audio decoding has known losses for quiet and repeated symbols. SHA-256 checks establish internal integrity, not authorship or independent certification.
