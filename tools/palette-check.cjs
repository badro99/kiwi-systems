const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const palette=JSON.parse(read('brand-palette.json'));
assert.deepEqual([palette.nuit,palette.velours,palette.vif,palette.fleur,palette.background],['#1B0E2E','#5C1F4E','#C1487E','#FF8FC8','#000000']);
const approved=new Set([palette.nuit,palette.velours,palette.vif,palette.fleur].map(c=>c.slice(1).toLowerCase()));
const svgFiles=fs.readdirSync(path.join(root,'assets')).filter(f=>f.endsWith('.svg'));
const authored=['styles.css','index.html','app.js','theme.js','scene.js',...svgFiles.map(f=>'assets/'+f)];
for(const file of authored){
 const full=read(file);
 const logo=['kiwi-logo.svg','kiwi-mark.svg','favicon.svg','kiwi-systems.svg','kiwi-commerce.svg'].some(name=>file==='assets/'+name);
 const source=logo?(full.includes('<!-- divider -->')?full.split('<!-- divider -->')[1]:''):full;
 if(logo){assert.match(full,/#(?:398063|058161|058261)/i,'Original Kiwi logo green missing: '+file);if(full.includes('<!-- divider -->'))assert.match(source,/#ff8fc8/i,'Branch descriptor must stay Bougainvillée');}
 for(const match of source.matchAll(/#([\da-f]{3,8})\b/gi)){
  let rgb=match[1].toLowerCase();if(rgb.length===3)rgb=[...rgb].map(x=>x+x).join('');if(rgb.length===8)rgb=rgb.slice(0,6);if(rgb.length!==6)continue;
  const channels=[0,2,4].map(i=>parseInt(rgb.slice(i,i+2),16));
  if(Math.max(...channels)-Math.min(...channels)>12)assert.ok(approved.has(rgb),`Unapproved chromatic color #${rgb} in ${file}`);
 }
 assert.ok(!/#(?:00ffae|aaf0c1|398063|1d4433|058161|058261|074532|94f2bd)\b/i.test(source),'Old green in '+file);
}
assert.match(read('styles.css'),/--color-accent:var\(--bougain-fleur\)/);
assert.match(read('styles.css'),/color:var\(--color-fg\);background:#000/);
const theme=read('theme.js');for(const color of approved)assert.ok(theme.includes('0x'+color),'Missing WebGL palette color '+color);
const scene=read('scene.js');assert.match(scene,/renderer\.setClearColor\(palette\.background,1\)/);assert.match(scene,/color:palette\.vif,emissive:palette\.fleur/);assert.ok(!scene.includes('HueSaturationEffect'),'Old green hue grade must not override the palette');
const {execFileSync}=require('node:child_process');
for(const name of svgFiles){
 const previous=execFileSync('git',['show','HEAD:assets/'+name],{cwd:root,encoding:'utf8'}),current=read('assets/'+name);
 const geometry=s=>[...s.matchAll(/\b(?:d|points|viewBox)="([^"]+)"/g)].map(m=>m[0]);
 assert.deepEqual(geometry(current),geometry(previous),'Logo geometry changed: '+name);
}
console.log('PASS exact reference palette, black background, authored CSS/SVG colors, scene material/lights and unchanged logo geometry');
