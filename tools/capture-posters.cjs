// Capture fallback posters from the real recolored scene, never recolor the old images.
// Requires Playwright + installed Chrome. Pass a local site URL and output directory.
const {chromium}=require('playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--ignore-gpu-blocklist']});
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 await page.goto(process.argv[2]||'http://127.0.0.1:8080',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('#kiwi-scene').dataset.state==='ready');
 await page.waitForFunction(()=>Number(document.querySelector('#kiwi-scene').dataset.time)>3);
 await page.addStyleTag({content:'body > :not(#kiwi-scene){visibility:hidden!important} #kiwi-scene{--scene-dim:0!important}'});
 const output=process.argv[3]||'/private/tmp';
 await page.locator('#kiwi-scene').screenshot({path:path.join(output,'bougainvillee-landscape.png')});
 await page.setViewportSize({width:900,height:1600});
 await page.waitForTimeout(350);
 await page.locator('#kiwi-scene').screenshot({path:path.join(output,'bougainvillee-portrait.png')});
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1);});
