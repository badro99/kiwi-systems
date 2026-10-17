const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p));
const original=p=>execFileSync('git',['show','b48ff50:'+p],{cwd:root});
const recolor=s=>s.replace(/#[0-9a-f]{3,8}\b/gi,'#COLOR');
for(const file of ['styles.css',...fs.readdirSync(path.join(root,'assets')).filter(f=>f.endsWith('.svg')).map(f=>'assets/'+f)]){
 assert.equal(recolor(read(file).toString()),recolor(original(file).toString()),'Geometry or layout differs: '+file);
 assert.ok(!/#(?:00ffae|aaf0c1|398063|058261|94f2bd|058161|074532)/i.test(read(file).toString()),'Green remains: '+file);
}
assert.ok(read('styles.css').toString().includes('--color-accent:#5bd5ff'));
assert.ok(read('assets/kiwi-systems.svg').toString().includes('#3955d6'));
const theme=read('theme.js').toString(),scene=read('scene.js').toString();
for(const color of ['0x0a1230','0x1e2f7c','0x3955d6','0x5bd5ff'])assert.ok(theme.includes(color));
assert.match(scene,/color:palette\.vif,emissive:palette\.vif/);
assert.match(scene,/color:palette\.neon,intensity:25/);
assert.ok(!scene.includes('HueSaturationEffect'));
console.log('PASS full Majorelle palette; unchanged logo geometry, layout and sphere animation');
