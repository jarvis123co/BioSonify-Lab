const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
require('./check-science.cjs');
const read=name=>fs.readFileSync(path.join(root,'src',name),'utf8');
const html=`<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; media-src blob:; worker-src blob:; connect-src 'none'; base-uri 'none'; form-action 'none'"><title>BioSonify Lab · 生物音乐实验室</title><style>${read('page.css')}</style></head><body>${read('body.html')}<script id="biocore">${read('core.js')}</script><script id="biocompare">${read('comparison.js')}</script><script id="bioresearch">${read('research.js')}</script><script id="bioapp">${read('app.js')}</script><script type="text/plain" id="third-party-license">${fs.readFileSync(path.join(root,'THIRD_PARTY_NOTICES.txt'),'utf8')}</script></body></html>`;
fs.writeFileSync(path.join(root,'BioSonify-Lab.html'),html);
console.log(`Built BioSonify-Lab.html · ${Buffer.byteLength(html).toLocaleString()} bytes`);
