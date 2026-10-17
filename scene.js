/**
 * Kiwi OS scene, ported from its shipped module 47373.
 * Original model, animation, camera, pointer easing and scroll keyframes
 * are preserved. Materials and lights use the Majorelle palette. Asset URLs are relative
 * to this module so the same scene works on GitHub project Pages.
 */
import {THREE as T, POST as P} from './assets/vendor/kiwi-three.js';
import {GLTFLoader, DRACOLoader} from './assets/vendor/kiwi-loaders.js';
import {MAJORELLE as palette} from './theme.js?v=7';

const host = document.querySelector('#kiwi-scene');
const asset = path => new URL(path, import.meta.url).href;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try {
  renderer = new T.WebGLRenderer({antialias:false, alpha:false, powerPreference:'high-performance'});
} catch {
  host.dataset.state = 'fallback';
}
if (renderer) {
  const scene = new T.Scene();
  scene.background = new T.Color(palette.background);
  scene.add(new T.AmbientLight(0xffffff, 2));
  renderer.setClearColor(palette.background,1);
  renderer.domElement.setAttribute('aria-hidden','true');
  host.appendChild(renderer.domElement);

  const camera = new T.PerspectiveCamera(30, innerWidth/innerHeight, .1, 1000);
  const cameraGroup = new T.Group();
  cameraGroup.add(camera);
  scene.add(cameraGroup);
  const modelGroup = new T.Group();
  scene.add(modelGroup);
  const lights = [
    {color:palette.vif,intensity:25,distance:20,decay:1.76,position:[-1.0800012920987254,-.9419390674979656,1.2214126197837032]},
    {color:palette.neon,intensity:25,distance:34.15,decay:0,position:[.8663944921239622,1.1823807542632467,1.2214126197837032]}
  ];
  for (const settings of lights) {
    const light = new T.PointLight(settings.color,settings.intensity,settings.distance,settings.decay);
    light.position.set(...settings.position);
    modelGroup.add(light);
  }
  const composer = new P.EffectComposer(renderer);
  composer.addPass(new P.RenderPass(scene,camera));
  const bloom = new P.BloomEffect({intensity:1.5,radius:.75,luminanceThreshold:.9,luminanceSmoothing:.02849,mipmapBlur:true});
  bloom.luminancePass.enabled = false;
  composer.addPass(new P.EffectPass(camera,bloom,new P.ToneMappingEffect({mode:7})));
  // Composite the original black-backed glow onto porcelain without changing
  // the sphere's material, lighting, bloom, camera or animation.
  const lightScene = new T.Scene();
  const lightCamera = new T.OrthographicCamera(-1,1,1,-1,0,1);
  const lightMaterial = new T.ShaderMaterial({
    uniforms:{inputTexture:{value:null}}, depthTest:false, depthWrite:false,
    vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
    fragmentShader:'uniform sampler2D inputTexture;varying vec2 vUv;void main(){vec3 c=texture2D(inputTexture,vUv).rgb;float a=clamp(max(c.r,max(c.g,c.b))*1.5,0.,1.);gl_FragColor=vec4(mix(vec3(247./255.,247./255.,242./255.),c,a),1.);}'
  });
  lightScene.add(new T.Mesh(new T.PlaneGeometry(2,2),lightMaterial));
  composer.addPass({enabled:true,needsSwap:true,renderToScreen:false,
    initialize(){},setSize(){},dispose(){lightMaterial.dispose();},
    render(renderer,inputBuffer,outputBuffer){
      lightMaterial.uniforms.inputTexture.value=inputBuffer.texture;
      renderer.setRenderTarget(this.renderToScreen?null:outputBuffer);
      renderer.render(lightScene,lightCamera);
    }
  });
  function resize() {
    const aspect = innerWidth/innerHeight;
    camera.aspect = aspect;
    camera.position.set(0,-.02141615313266465,8.391871340979279*Math.min(Math.max(Math.sqrt((16/9)/aspect),1),2.6));
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.5:2));
    renderer.setSize(innerWidth,innerHeight);
    composer.setSize(innerWidth,innerHeight);
    bloom.intensity = innerWidth<700?1.15:1.5;
  }
  resize();
  addEventListener('resize',resize);
  const draco = new DRACOLoader().setDecoderPath(asset('assets/draco/gltf/'));
  const loader = new GLTFLoader().setDRACOLoader(draco);
  const alpha = new T.TextureLoader().load(asset('assets/scene/alpha-map.png'));
  alpha.wrapS = alpha.wrapT = T.ClampToEdgeWrapping;
  alpha.colorSpace = T.NoColorSpace;
  const material = new T.MeshPhysicalMaterial({
    color:palette.vif,emissive:palette.vif,emissiveIntensity:1,metalness:1,roughness:1,
    ior:1.5,reflectivity:.5,specularIntensity:0,alphaMap:alpha,alphaTest:.1,
    side:T.FrontSide,transparent:false
  });
  let mixer,ready=false;
  loader.load(asset('assets/scene/model.glb'), gltf => {
    const model = gltf.scene;
    model.scale.setScalar(1.5);
    model.traverse(object => {
      if (!object.isMesh) return;
      const previous = Array.isArray(object.material)?object.material:[object.material];
      if (previous[0]?.map && !material.map) {material.map=previous[0].map;material.needsUpdate=true;}
      object.material = material;
      previous.forEach(m=>m?.dispose());
    });
    modelGroup.add(model);
    const clip = gltf.animations.find(a=>a.name==='Animation') || gltf.animations[0];
    if (clip) {
      mixer = new T.AnimationMixer(model);
      mixer.clipAction(clip).setLoop(T.LoopRepeat,Infinity).play();
      mixer.timeScale = reduced.matches?0:.5;
    }
    ready=true;
    host.dataset.state='ready';
    host.dataset.animation=clip?.name||'none';
  },undefined,error=>{host.dataset.state='fallback';console.error('Kiwi scene could not load',error);});

  const timeline = [[0,0],[3847/9137,10],[5523/9137,22.5],[6790/9137,22.5],[8324/9137,25],[8324/9137,35],[1,40]];
  const tracks = {
    x:[[0,0],[9,0],[12.51,0],[22.5,.0036],[25,.0258],[35.02,.0258],[40.02,2.1136]],
    y:[[0,-.8727],[9,3.2648],[12.51,3.2648],[22.5,-.0005],[25,3.8231],[35.02,3.8231],[40.02,0]],
    z:[[0,3.9964],[9,3.9964],[12.51,3.9964],[22.5,3.9863],[25,3.9864],[35.02,3.9864],[40.02,4.6503]],
    rx:[[0,-1.5708],[9,-1.5708],[12.51,-1.5708],[22.5,0],[25,0],[35.02,0],[40.02,0]],
    ry:[[0,0],[9,0],[12.51,0],[22.5,1.5681],[25,1.5681],[35.02,1.5681],[40.02,0]],
    rz:[[0,0],[40.02,0]]
  };
  function interpolate(points,time) {
    if(time<=points[0][0]) return points[0][1];
    for(let i=1;i<points.length;i++) if(time<=points[i][0]) {
      const [from,a]=points[i-1],[to,b]=points[i];
      return to===from?b:a+(time-from)/(to-from)*(b-a);
    }
    return points.at(-1)[1];
  }
  function scrollTime() {
    return interpolate(timeline.map(([progress,time])=>[Math.max(0,progress*document.documentElement.scrollHeight-innerHeight),time]),scrollY);
  }
  let targetX=0,targetY=0,currentX=0,currentY=0,request=0,last=performance.now();
  addEventListener('pointermove',event=>{
    if(reduced.matches)return;
    targetY=(event.clientX/innerWidth*2-1)*.017453292519943295;
    targetX=(event.clientY/innerHeight*2-1)*.017453292519943295;
  },{passive:true});
  function render(now) {
    request=requestAnimationFrame(render);
    if(document.hidden){last=now;return;}
    const dt=Math.min((now-last)/1000,.1);last=now;
    const time=scrollTime();
    modelGroup.position.set(interpolate(tracks.x,time),interpolate(tracks.y,time),interpolate(tracks.z,time));
    modelGroup.rotation.set(interpolate(tracks.rx,time),interpolate(tracks.ry,time),interpolate(tracks.rz,time));
    const ease=1-Math.exp(-dt/(.6/3));
    currentX+=(targetX-currentX)*ease;currentY+=(targetY-currentY)*ease;
    cameraGroup.rotation.x=currentX;cameraGroup.rotation.y=currentY;
    mixer?.update(reduced.matches?0:dt);
    composer.render(dt);
    if(ready){host.dataset.frame=String((Number(host.dataset.frame)||0)+1);host.dataset.time=String(mixer?.time||0);}
  }
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(request);host.dataset.state='fallback';});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{host.dataset.state='ready';last=performance.now();render(last);});
  reduced.addEventListener('change',()=>{if(mixer)mixer.timeScale=reduced.matches?0:.5;});
  render(last);
}
