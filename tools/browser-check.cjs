const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const url = process.argv[2] || 'http://127.0.0.1:8080';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`);});
 await page.goto(url,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('#kiwi-scene').dataset.state==='ready');
 assert.equal(await page.locator('#kiwi-scene canvas').count(),1);
 assert.equal(await page.locator('#kiwi-scene').getAttribute('data-animation'),'Animation');
 const before=Number(await page.locator('#kiwi-scene').getAttribute('data-time'));
 await page.waitForTimeout(600);
 assert.ok(Number(await page.locator('#kiwi-scene').getAttribute('data-time'))>before,'Real GLB animation must advance');
 assert.equal(await page.locator('.scene-fallback').isVisible(),false,'Poster must not replace the live scene');
 console.log('PASS original GLB, animated mixer, WebGL canvas and hidden fallback');
 const links=page.locator('.desktop-nav a'),lens=page.locator('.desktop-nav .kw-lens');
 await links.first().hover();await page.waitForTimeout(400);
 const initial=await lens.boundingBox();
 await links.nth(1).hover();await page.waitForTimeout(75);
 const stretched=await lens.boundingBox();
 assert.ok(stretched.width>initial.width,'Liquid lens must stretch between links');
 await page.waitForTimeout(500);
 const settled=await lens.boundingBox(),target=await links.nth(1).boundingBox();
 assert.ok(Math.abs(settled.width-target.width)<2&&Math.abs(settled.x-target.x)<2,'Lens must settle on target');
 console.log('PASS original liquid lens stretch and settle');
 for(const lang of ['fr','en','ar']){
  await page.locator('#locale-trigger').click();await page.locator(`[data-locale="${lang}"]`).click();
  assert.equal(await page.locator('html').getAttribute('lang'),lang);
  assert.equal(await page.locator('html').getAttribute('dir'),lang==='ar'?'rtl':'ltr');
  assert.ok(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Desktop overflow '+lang);
  for(const name of ['app','commerce','web']){await page.locator(`[data-preview="${name}"]`).click();assert.ok(await page.locator('#preview-'+name).isVisible());}
  await page.locator('#confirm-demo').click();assert.equal(await page.locator('#demo-pending').innerText(),'00');
  await page.locator('#confirm-demo').click();assert.equal(await page.locator('#demo-pending').innerText(),'01');
  await page.locator('[data-choice="commerce"]').click();assert.ok((await page.locator('#contact-whatsapp').getAttribute('href')).includes('text='));
  console.log('PASS desktop language, tabs, COD confirmation and contact: '+lang);
 }
 for(const width of [360,390,768,1024]){
  await page.setViewportSize({width,height:844});
  for(const lang of ['fr','en','ar']){
   await page.locator('#locale-trigger').click();await page.locator(`[data-locale="${lang}"]`).click();
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
   assert.ok(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Responsive overflow '+width+' '+lang);
   await page.locator('.menu-toggle').click();assert.ok(await page.locator('#mobile-nav').isVisible());
   await page.keyboard.press('Escape');assert.ok(!await page.locator('#mobile-nav').isVisible());
  }
  console.log('PASS mobile/tablet languages and menu: '+width+'px');
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('#kiwi-scene').dataset.state==='ready');
 const frozen=await page.locator('#kiwi-scene').getAttribute('data-time');await page.waitForTimeout(400);
 assert.equal(await page.locator('#kiwi-scene').getAttribute('data-time'),frozen,'Reduced motion must freeze the model animation');
 assert.equal(await page.locator('.reveal').first().evaluate(e=>getComputedStyle(e).opacity),'1');
 assert.deepEqual(await page.evaluate(()=>[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)),[]);
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 console.log('PASS reduced motion, image assets, no HTTP failures or browser errors');
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
