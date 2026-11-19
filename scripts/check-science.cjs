const {execFileSync}=require('node:child_process');
const path=require('node:path');
execFileSync(process.execPath,['--test','tests/science-lock.test.cjs','tests/comparison.test.cjs'],{cwd:path.resolve(__dirname,'..'),stdio:'inherit'});
