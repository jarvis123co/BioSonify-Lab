# BioSonify Lab

Offline, deterministic sonification of DNA, RNA and protein sequences. Open `BioSonify-Lab.html` in a browser to edit a sequence, hear its mapped notes, compare equal-length variants, and export events and audio.

**Release:** Research-Ready v1.0.0, frozen on 17 November 2026. This is a project release designation; it does not imply journal acceptance or validation of human perceptual benefit.

The complete application is one HTML file with no external API, account, server, installation or runtime library dependency. Computation runs locally. The current interface is in Chinese; the [English user guide](docs/USER_GUIDE.md) includes a control-label glossary. An English interface is not implemented in this release.

## Use

Download this repository using **Code → Download ZIP**, extract it, and open `BioSonify-Lab.html` in a desktop browser. Opening the file page on GitHub displays its source. Playback starts after clicking the play control.

1. Choose **DNA**, **RNA** or **Protein** explicitly; paste a sequence or import one FASTA record.
2. Keep scientific mode selected for the fixed mapping. Set BPM and play.
3. Add an equal-length comparison sequence to inspect positional substitutions. Mutation emphasis is independently switchable and off by default.
4. Export MIDI, PCM WAV, CSV or SVG, then save the corresponding research JSON record.

Try DNA `ACGTACGT` and variant `ACGTGCGT`: the only substitution is position 5, A → G, MIDI pitch 60 → 67.

## Mapping and traceability

Scientific mode follows **seq2music-mapping-v2**, adapted from [Seq2Music 0.3.2](https://github.com/jvogan/seq2music): one event per symbol, 0.3 beats per symbol and 82% gate. DNA maps A=60, C=64, G=67, T=72 and N=66; RNA uses U=72. Protein pitches and velocities follow the reference tables. Creative parameters retain source and output values separately.

Strict comparison preserves intrinsic symbol velocities, uses a common sine baseline and places A/B at logical pan −0.82/+0.82. An optional mutation cue adds velocity and a second harmonic at changed positions. CSV and research JSON record the cue configuration. MIDI synthesizer timbre is player-dependent.

Research records bind inputs, parameters, events, selected ranges and output-file SHA-256 checksums. [Validation scope and limitations](VALIDATION.md) distinguish event agreement, musical payload agreement and complete file identity. Seq2Music reversible metadata codecs, MusicXML, reverse decoding, insertions/deletions and alignment are not implemented.

## Development and checks

The application requires no build step for use. Development checks use Node.js (tested with 24.22.1):

```sh
node --test tests/science-lock.test.cjs tests/comparison.test.cjs tests/research.test.cjs tests/core.test.cjs
node scripts/build.cjs
```

The core tests use the retained reference fixture and write temporary output files under `verification/`; these outputs are ignored by Git. The fixture contains 48 earlier reference configurations and is separate from the historical 96-configuration controlled study. To regenerate it from an independently obtained copy of Seq2Music:

```sh
python tests/reference.py --source /path/to/seq2music/scripts/seq2music.py
```

The historical reference source SHA-256 is `7ec4a7fa6211f6c429031b3fd1df89371f7d1aae356ae8e695df647b74c45ba2`. A different reference version requires a separate validation decision. The public fixture's private acquisition path was replaced; event values and the reference checksum were preserved.

Verify a saved research record against its exported files:

```sh
node scripts/verify-research.cjs research.json actual.csv actual.mid actual.wav actual.svg
```

The scientific module is byte-frozen. Changes require relevant regression checks; publishing documentation must not alter its mapping. `SOURCE_SHA256.json` records the original-byte hashes of the distributed program and sources. `.gitattributes` disables automatic line-ending conversion to preserve them.

## License and attribution

MIT © 2026 Yunpeng Cao. See [LICENSE.txt](LICENSE.txt). Seq2Music-derived mapping and deterministic synthesis rules retain MIT © 2026 Jacob Vogan in [THIRD_PARTY_NOTICES.txt](THIRD_PARTY_NOTICES.txt) and in the standalone HTML. See [CITATION.cff](CITATION.cff) for software citation metadata.

Codex and ChatGPT assisted implementation, tests and documentation. Technical checks do not establish human recognition accuracy or speed. The package contains no participant data.
