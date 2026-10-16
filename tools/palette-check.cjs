const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p));
const original=p=>execFileSync('git',['show','b48ff50:'+p],{cwd:root});
for(const file of ['styles.css',...fs.readdirSync(path.join(root,'assets')).filter(f=>f.endsWith('.svg')).map(f=>'assets/'+f)]){
 assert.ok(read(file).equals(original(file)),'Original Kiwi identity differs: '+file);
}
for(const file of ['scene.js','theme.js','assets/scene/poster-landscape.webp','assets/scene/poster-portrait.webp']){
 assert.ok(read(file).equals(execFileSync('git',['show','b367e0f:'+file],{cwd:root})),'Pink sphere must stay unchanged: '+file);
}
assert.match(read('scene.js').toString(),/color:palette\.vif,emissive:palette\.fleur/);
console.log('PASS original Kiwi UI and logo assets; pink sphere code and posters unchanged');
