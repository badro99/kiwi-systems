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
const theme=read('theme.js').toString(),scene=read('scene.js').toString();
for(const color of ['0x0a1230','0x1e2f7c','0x3955d6','0x5bd5ff'])assert.ok(theme.includes(color));
assert.match(scene,/color:palette\.vif,emissive:palette\.vif/);
assert.match(scene,/color:palette\.neon,intensity:25/);
assert.ok(!scene.includes('HueSaturationEffect'));
console.log('PASS original Kiwi UI and logo assets; sphere-only Majorelle palette');
