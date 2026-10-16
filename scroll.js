// Same desktop smooth-scroll setup as Kiwi OS module 20032.
import {Lenis} from './assets/vendor/kiwi-scroll.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const coarse=matchMedia('(pointer: coarse)');
let lenis,frame;
function configure(){
 cancelAnimationFrame(frame);lenis?.destroy();lenis=null;
 if(reduced.matches||coarse.matches)return;
 lenis=new Lenis({duration:1.2,smoothWheel:true});
 function tick(time){lenis.raf(time);frame=requestAnimationFrame(tick);}
 frame=requestAnimationFrame(tick);
}
reduced.addEventListener('change',configure);coarse.addEventListener('change',configure);
configure();
