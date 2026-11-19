"""Read the installed Seq2Music reference without changing its source."""
import argparse
import hashlib
import importlib.util
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--source', required=True, help='Path to the independently obtained Seq2Music 0.3.2 scripts/seq2music.py')
args = parser.parse_args()
source = pathlib.Path(args.source)
spec = importlib.util.spec_from_file_location('seq2music_reference', source)
reference = importlib.util.module_from_spec(spec)
spec.loader.exec_module(reference)
cases = []
for kind, seq in [('dna', 'ACGTNACCGGTTAAA'), ('rna', 'ACGUNACCGGUUAAA'), ('protein', reference.AA_ORDER)]:
    for bpm in [40, 100, 137, 240]:
        for step in [.25, .3, .5, 1.0]:
            cases.append(dict(kind=kind, sequence=seq, bpm=bpm, step=step,
                              events=reference.sequence_events(seq, kind, step*60/bpm)))
data = dict(source=str(source), sha256=hashlib.sha256(source.read_bytes()).hexdigest(),
            runtime_version=reference.runtime_version(), cases=cases)
(ROOT/'verification'/'reference-events.json').write_text(json.dumps(data, indent=2), encoding='utf-8')
print(f'Generated {len(cases)} reference event cases from Seq2Music {data["runtime_version"]}')
