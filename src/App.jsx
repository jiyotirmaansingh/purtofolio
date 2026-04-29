import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const PROJECTS = [
  { id:"01", name:"STRADA",   sub:"AI Tyre Diagnostic System",      year:"2025", type:"CV · FLASK · REACT",     tags:["React","Flask","Grad-CAM","Python","CV"],           status:"ACTIVE",   health:87,  link:"https://new-strada.vercel.app" },
  { id:"02", name:"MHEWS",    sub:"Multi-Hazard Early Warning",      year:"2025", type:"YOLO · EDGE · MIDAS",    tags:["YOLOv8","MiDaS","Folium","Raspberry Pi"],          status:"TRAINING", health:62,  link:null },
  { id:"03", name:"CLEARLENS",sub:"AI Productivity Tracker",         year:"2024", type:"MEDIAPIPE · MERN · LLM", tags:["MediaPipe","Ollama","MongoDB","Express"],          status:"DEPLOYED", health:100, link:"https://github.com/jiyotirmaansingh/ClearLens-1" },
  { id:"04", name:"FACEID",   sub:"Real-Time Face Detection",        year:"2024", type:"OPENCV · HAAR CASCADE",  tags:["Python","OpenCV","Haar Cascade"],                 status:"ARCHIVED", health:100, link:"https://github.com/jiyotirmaansingh/Face-Recognition" },
];

const CASE_STUDIES = {
  STRADA: {
    id:"01", name:"STRADA", sub:"AI Tyre Diagnostic System", year:"2025", status:"ACTIVE", color:"#8B1A1A",
    problem:"Tyre wear is invisible until it's dangerous. Garages rely on technician intuition — unscalable and inconsistent. The bottleneck: no lightweight model that could classify multi-zone wear, generate pixel-level explanations, and run in under 2 seconds inside a browser-facing Flask API.",
    approach:"Evaluated EfficientNet-B3 and ResNet-50 before settling on EfficientNet-B4. Its compound scaling gave +4% accuracy over ResNet at 40% fewer FLOPs — critical for sub-2s latency. Grad-CAM was layered as a post-inference XAI pass, rendering heatmaps on the exact tyre zones that triggered the classification.",
    solution:"React/Vite frontend → multipart POST to Flask microservice → EfficientNet inference → Grad-CAM overlay generation → JSON response with wear class, confidence score, and base64 heatmap. Full round-trip in 1.7–1.9s on CPU.",
    metrics:[
      {label:"Inference Speed", value:"~1.8s",          sub:"avg CPU round-trip"},
      {label:"XAI Pipeline",    value:"<2s",            sub:"Grad-CAM overlay incl."},
      {label:"Model",           value:"EfficientNet-B4", sub:"fine-tuned"},
      {label:"Dataset",         value:"Custom",          sub:"multi-zone tyre images"},
    ],
    stack:["React","Vite","Flask","PyTorch","EfficientNet-B4","Grad-CAM","TailwindCSS"],
    github:null, demo:"https://new-strada.vercel.app", health:87,
  },
  MHEWS: {
    id:"02", name:"MHEWS", sub:"Multi-Hazard Early Warning System", year:"2025", status:"TRAINING", color:"#1A3A8B",
    problem:"Indian roads kill 150K+ people annually — largely from unmarked speed bumps and potholes invisible at night or in rain. Existing dashcam systems only log incidents; they don't warn. The challenge: detect, depth-estimate, and classify hazard severity at real-time FPS on a Raspberry Pi 5 with a 5W power budget.",
    approach:"Chose YOLOv8n over SSD-MobileNet because it delivered 15% better mAP on our custom classes while still hitting 18+ FPS on Pi 5 with INT8 quantisation. MiDaS small was selected over ZoeDepth for monocular depth — consistent relative depth maps without a stereo rig, running in ~55ms per frame.",
    solution:"Three-tier pipeline: YOLOv8n detects hazard class → MiDaS estimates distance → severity engine cross-references class × distance → alert issued. Folium heatmap layer logs GPS-tagged incidents. Trained on Apple MPS (M4 Pro), deployed to Raspberry Pi 5 via ONNX export.",
    metrics:[
      {label:"Target FPS",    value:"18+",      sub:"Pi 5 · INT8 ONNX"},
      {label:"Depth Latency", value:"~55ms",    sub:"MiDaS small / frame"},
      {label:"Dataset",       value:"33K img",  sub:"3 classes · augmented"},
      {label:"Detector",      value:"YOLOv8n",  sub:"Roboflow trained"},
    ],
    stack:["YOLOv8","MiDaS","PyTorch","ONNX","Raspberry Pi","Folium","Roboflow"],
    github:null, demo:null, health:62,
  },
  CLEARLENS: {
    id:"03", name:"CLEARLENS", sub:"AI Productivity Tracker", year:"2024", status:"DEPLOYED", color:"#1A6B3A",
    problem:"Remote work blurs the line between presence and productivity. Session timers don't capture engagement quality. The challenge: build an ML system that measures real cognitive engagement without sending biometric data to any cloud.",
    approach:"MediaPipe Face Mesh + Pose gives 478 facial landmarks and 33 body keypoints at 30 FPS on CPU. Engagement score is computed from eye aspect ratio (blink rate), head pose Euler angles (attention direction), and posture deviation from neutral. Ollama + Mistral 7B runs entirely locally — zero data leaves the machine.",
    solution:"React frontend streams webcam → MediaPipe WASM inference in-browser → engagement score computed per frame → aggregated to session graphs via MongoDB Atlas. Mistral 7B generates natural language coaching feedback every 15 minutes.",
    metrics:[
      {label:"Inference",     value:"30 FPS",     sub:"MediaPipe WASM"},
      {label:"LLM",           value:"Mistral 7B", sub:"100% local via Ollama"},
      {label:"Landmarks",     value:"478+33",     sub:"face + pose keypoints"},
      {label:"Feedback Loop", value:"15 min",     sub:"AI coaching interval"},
    ],
    stack:["React","Vite","MediaPipe","Ollama","Mistral 7B","Express","MongoDB Atlas"],
    github:"https://github.com/jiyotirmaansingh/ClearLens-1", demo:null, health:100,
  },
};

const EDU = [
  {
    period:"2023 → 2027", type:"B.TECH", institution:"LNCT Group of Colleges",
    degree:"B.Tech CSE: Artificial Intelligence & Machine Learning",
    location:"Bhopal, M.P.", status:"ONGOING", milestone:"SEM 06 · SGPA 9.0",
    grades:{cgpa:"8.04", sgpa:"9.0"},
    coursework:["Data Structures & Algorithms","Machine Learning","Computer Vision","Deep Learning","DBMS & OS","OOP","NLP","Software Engineering"],
    highlights:["LeetCode Guardian — Top 1.07% globally","National Hackathon Finalist — SAMADHAN 2.0 (Rank #7)","2 active research-grade CV projects"],
  },
  {
    period:"2021 → 2023", type:"XII", institution:"Ryan International School",
    degree:"Senior Secondary — PCM + CS", location:"Bhopal, M.P.", status:"COMPLETED",
    milestone:null, grades:null,
    coursework:["Physics","Chemistry","Mathematics","Computer Science"], highlights:[],
  },
  {
    period:"→ 2021", type:"X", institution:"Ryan International School",
    degree:"Secondary Education", location:"Bhopal, M.P.", status:"COMPLETED",
    milestone:null, grades:null, coursework:[], highlights:[],
  },
];

const TECH_NOTES = [
  {
    id:"TN-001", date:"APR 2025", category:"LEETCODE · HARD", readTime:"3 min",
    title:"Breaking Trapping Rain Water II in O(mn log mn)",
    tags:["Dijkstra","Min-Heap","BFS","Grid"],
    tldr:"Why the naive 2D scan fails and how treating the boundary as a min-heap frontier reduces it to a modified Dijkstra.",
    body:`The instinct on 2D trapping water is to extend the 1D two-pointer approach. It doesn't work because water flows in 3D — a cell can drain through any neighbour.

The insight: treat boundary cells as the initial priority queue. The lowest boundary cell is the first wall. Any interior cell reachable through that wall holds water = wall_height - cell_height (if positive). Pop the min, push unvisited neighbours with height = max(current_wall, neighbour_height). This is Dijkstra on a grid.

Time: O(mn log mn). Space: O(mn).

The trick that kept tripping me: updating the heap value to max(popped_height, neighbour_height) rather than just neighbour_height. Without that, you underestimate walls that are lower than the path you came from.`,
    link:"https://leetcode.com/problems/trapping-rain-water-ii/",
  },
  {
    id:"TN-002", date:"MAR 2025", category:"CV · OPTIMIZATION", readTime:"4 min",
    title:"Cutting STRADA's inference from 4.2s to 1.8s",
    tags:["EfficientNet","Flask","Grad-CAM","Profiling"],
    tldr:"Three specific changes that halved latency: model loaded once at startup, cv2 over PIL, and single-pass Grad-CAM hooks.",
    body:`cProfile + Flask timers revealed three culprits:

1. PyTorch model loaded on every request — 1.1s cold start.
Fix: Load at Flask app init, keep in module-level variable. Saved ~1.0s.

2. PIL image decoding + torchvision transforms: ~0.6s per image.
Fix: Switch to cv2.imdecode on raw bytes, manual numpy→tensor. cv2.INTER_LINEAR at 224×224 is noticeably faster than PIL's ANTIALIAS. Saved ~0.35s.

3. Grad-CAM registering hooks AND running a second forward pass.
Fix: Single forward pass with register_forward_hook, capture activations in-place. No second pass. Saved ~0.5s.

Net: 4.2s → 1.8s avg. The remaining time is EfficientNet's forward pass on CPU. ONNX export would cut another ~0.4s if we drop dynamic shape support.`,
    link:null,
  },
  {
    id:"TN-003", date:"FEB 2025", category:"YOLO · EDGE", readTime:"5 min",
    title:"Why YOLOv8n beats SSD-MobileNet for MHEWS at 18 FPS on Pi 5",
    tags:["YOLOv8","SSD","Raspberry Pi","INT8","ONNX"],
    tldr:"Benchmarked both on Pi 5. YOLOv8n at INT8 hit 18.3 FPS vs SSD's 22 FPS — but mAP@0.5 was 14 points higher. Worth the trade.",
    body:`Common wisdom is SSD-MobileNet for edge — it's lighter. But lighter ≠ better when your classes are small and occluded (potholes at 40km/h from a dashcam).

Benchmark: Pi 5 (8GB), ONNX Runtime 1.17, INT8 quantised, 640×480.

SSD-MobileNet v2: 22.1 FPS, mAP@0.5 = 0.48.
YOLOv8n INT8: 18.3 FPS, mAP@0.5 = 0.62.

The 14-point mAP gap = ~29% fewer missed hazards. At 18 FPS there's still a 55ms window per frame — enough for the MiDaS depth pass running async on a separate thread.

Key: YOLOv8's decoupled head handles small objects better than SSD's single-shot anchors. Our potholes average 40×30px at 2m — right where anchor mismatches hurt SSD most.`,
    link:null,
  },
];

const STACK_ITEMS = [
  "YOLOv8","PyTorch","OpenCV","MiDaS","Grad-CAM","MediaPipe","EfficientNet","Roboflow",
  "React","Node.js","Express","MongoDB","Flask","TailwindCSS","REST APIs","Python","Java","JavaScript","SQL",
  "Git","Raspberry Pi","Apple MPS","Folium","Ollama","VS Code","MongoDB Atlas",
];

const ACCENT = "#8B1A1A";

/* ══════════════════════════════════════════════════════════════
   NEURAL INTRO
══════════════════════════════════════════════════════════════ */
function NeuralIntro({ onComplete }) {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState("computing");
  const [outputLines, setOutputLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(Date.now());
  const doneRef = useRef(false);

  const LINES = [
    "> INIT_NEURAL_NET...",
    "> LOADING_WEIGHTS: [██████████] 100%",
    "> ARCHITECT: JIYOTIRMAAN_SINGH_v1.0",
    "> DOMAIN: AI_ML + FULL_STACK",
    "> LEETCODE: GUARDIAN_2168_TOP_1%",
    "> EDGE_DEPLOY: RASPBERRY_PI_CONFIRMED",
    "> GRAD_CAM: XAI_PIPELINE_ONLINE",
    "> SAMADHAN_2.0: RANK_7_NATIONAL",
    "> FORWARD_PASS: COMPLETE",
    "> OUTPUT: ██ PORTFOLIO_READY ██",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const mob = window.innerWidth <= 768;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const W = canvas.width, H = canvas.height;
    const LAYERS = mob ? [2,4,6,4,2,1] : [3,6,9,12,9,6,3,1];
    const NODE_SPACING = mob ? 26 : 32;
    const marginX = W * (mob ? 0.06 : 0.09);
    const usableW = W - marginX * 2;
    const layerX = LAYERS.map((_,i) => marginX + (i/(LAYERS.length-1)) * usableW);
    const nodes = LAYERS.map((count,li) => {
      const totalH = (count-1)*NODE_SPACING;
      const startY = H/2 - totalH/2;
      return Array.from({length:count},(_,ni) => ({ x:layerX[li], y:startY+ni*NODE_SPACING, activation:0, phase:Math.random()*Math.PI*2 }));
    });
    const conns = [];
    for (let li=0;li<LAYERS.length-1;li++) for (const a of nodes[li]) for (const b of nodes[li+1]) conns.push({a,b,w:0.025+Math.random()*0.055,active:0,sign:Math.random()>0.5?1:-1});
    const signals = [];
    const spawnSignal = (li) => {
      if (li>=LAYERS.length-1) return;
      const from = nodes[li][Math.floor(Math.random()*nodes[li].length)];
      const to = nodes[li+1][Math.floor(Math.random()*nodes[li+1].length)];
      const conn = conns.find(c=>c.a===from&&c.b===to);
      signals.push({x:from.x,y:from.y,tx:to.x,ty:to.y,t:0,speed:(mob?0.028:0.02)+Math.random()*0.016,layer:li,toNode:to,conn});
    };
    let frame=0;
    const DURATION=mob?4.2:5.5, SPAWN_RATE=mob?7:4;
    const draw = () => {
      frame++;
      const elapsed=(Date.now()-startRef.current)/1000;
      const prog=Math.min(elapsed/DURATION,1);
      setProgress(Math.round(prog*100));
      ctx.fillStyle="rgba(8,8,8,0.22)"; ctx.fillRect(0,0,W,H);
      for (const c of conns) {
        c.active*=0.90;
        const alpha=c.w+c.active*0.4;
        ctx.beginPath(); ctx.moveTo(c.a.x,c.a.y); ctx.lineTo(c.b.x,c.b.y);
        if (c.active>0.05) { ctx.strokeStyle=c.sign>0?`rgba(180,45,45,${alpha*1.2})`:`rgba(45,80,180,${alpha*1.2})`; ctx.lineWidth=0.5+c.active*0.7; }
        else { ctx.strokeStyle=`rgba(55,55,55,${c.w*1.4})`; ctx.lineWidth=0.35; }
        ctx.stroke();
      }
      for (let i=signals.length-1;i>=0;i--) {
        const s=signals[i]; s.t+=s.speed;
        const cx=s.x+(s.tx-s.x)*s.t, cy=s.y+(s.ty-s.y)*s.t;
        ctx.beginPath(); ctx.arc(cx,cy,2.2,0,Math.PI*2); ctx.fillStyle=`rgba(230,70,70,${1-s.t*0.25})`; ctx.fill();
        const bt=Math.max(0,s.t-0.05);
        ctx.beginPath(); ctx.arc(s.x+(s.tx-s.x)*bt,s.y+(s.ty-s.y)*bt,1.0,0,Math.PI*2); ctx.fillStyle="rgba(200,50,50,0.28)"; ctx.fill();
        if (s.conn) s.conn.active=Math.min(1,s.conn.active+0.55);
        if (s.t>=1) { s.toNode.activation=Math.min(1,s.toNode.activation+0.55); signals.splice(i,1); if (s.layer+1<LAYERS.length-1) spawnSignal(s.layer+1); }
      }
      if (frame%SPAWN_RATE===0) spawnSignal(0);
      if (frame%(SPAWN_RATE*3)===0) spawnSignal(Math.floor(Math.random()*(LAYERS.length-2)));
      nodes.forEach((layer,li) => {
        const isOut=li===LAYERS.length-1, isIn=li===0;
        layer.forEach(n => {
          n.activation*=0.93; n.phase+=0.015;
          const pulse=0.5+0.5*Math.sin(n.phase);
          const baseR=isOut?5.5:isIn?3.5:2.8;
          const r=baseR+n.activation*2.8;
          if (n.activation>0.08) { const grad=ctx.createRadialGradient(n.x,n.y,r*0.5,n.x,n.y,r+10); grad.addColorStop(0,`rgba(160,30,30,${n.activation*0.22})`); grad.addColorStop(1,"rgba(0,0,0,0)"); ctx.beginPath(); ctx.arc(n.x,n.y,r+10,0,Math.PI*2); ctx.fillStyle=grad; ctx.fill(); }
          ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2);
          ctx.fillStyle=isOut?`rgba(170,35,35,${0.55+n.activation*0.45})`:`rgba(200,195,185,${0.15+n.activation*0.5+pulse*0.04})`; ctx.fill();
          ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2);
          ctx.strokeStyle=isOut?`rgba(210,65,65,${0.4+n.activation*0.5})`:`rgba(110,105,95,${0.2+n.activation*0.35})`; ctx.lineWidth=0.5; ctx.stroke();
          ctx.beginPath(); ctx.arc(n.x-r*0.22,n.y-r*0.22,r*0.22,0,Math.PI*2); ctx.fillStyle=`rgba(255,255,255,${0.28+pulse*0.12+n.activation*0.25})`; ctx.fill();
        });
      });
      if (!mob) {
        ctx.textAlign="center"; ctx.font="7.5px 'Space Mono', monospace";
        nodes.forEach((layer,li) => { const label=li===0?"INPUT":li===LAYERS.length-1?"OUTPUT":`H${li}`; ctx.fillStyle="rgba(80,70,60,0.5)"; ctx.fillText(label,layerX[li],layer[layer.length-1].y+18); });
      }
      if (prog<1) { rafRef.current=requestAnimationFrame(draw); }
      else if (!doneRef.current) {
        doneRef.current=true; setPhase("output");
        let idx=0;
        const addLine=()=>{ if(idx<LINES.length){setOutputLines(p=>[...p,LINES[idx++]]);setTimeout(addLine,mob?75:105);}else{setTimeout(()=>setPhase("dissolve"),400);setTimeout(onComplete,1050);} };
        addLine();
      }
    };
    rafRef.current=requestAnimationFrame(draw);
    return ()=>{ cancelAnimationFrame(rafRef.current); window.removeEventListener("resize",resize); };
  }, []);

  return (
    <div style={{ position:"fixed",inset:0,zIndex:9999,background:"#080808",overflow:"hidden", opacity:phase==="dissolve"?0:1, transform:phase==="dissolve"?"scale(1.03)":"scale(1)", transition:phase==="dissolve"?"opacity 0.8s ease,transform 0.8s ease":"none" }}>
      <canvas ref={canvasRef} style={{position:"absolute",inset:0}} />
      <div style={{position:"relative",zIndex:2,padding:"22px 24px",display:"flex",justifyContent:"space-between"}}>
        <div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:"0.2em",color:"#333"}}>NEURAL_NET // FORWARD_PASS</div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:"0.12em",color:"#8B1A1A",marginTop:3}}>JIYOTIRMAAN.SYS</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:30,fontWeight:700,color:"#E8E3D8",lineHeight:1}}>{progress}%</div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:7,letterSpacing:"0.2em",color:"#333",marginTop:2}}>COMPUTING</div>
        </div>
      </div>
      {phase==="output"&&(
        <div style={{position:"absolute",bottom:24,left:24,right:24,zIndex:2,fontFamily:"'Space Mono',monospace",fontSize:9,lineHeight:2.0,maxHeight:"38vh",overflow:"hidden"}}>
          {outputLines.map((line,i)=>(<div key={i} style={{color:i===outputLines.length-1?"#CC3333":"#444",animation:"nn-fade 0.1s ease"}}>{line}</div>))}
        </div>
      )}
      <style>{`@keyframes nn-fade{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CASE STUDY MODAL
══════════════════════════════════════════════════════════════ */
function CaseStudyModal({ study, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key==="Escape") onClose(); };
    window.addEventListener("keydown",h);
    document.body.style.overflow="hidden";
    return () => { window.removeEventListener("keydown",h); document.body.style.overflow=""; };
  },[onClose]);

  if (!study) return null;
  const ac = study.color;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        transition={{duration:0.22}}
        onClick={onClose}
        style={{ position:"fixed",inset:0,zIndex:9000,background:"rgba(4,4,4,0.88)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",overflowY:"auto" }}
      >
        <motion.div
          key="panel"
          initial={{opacity:0,y:48,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:32,scale:0.98}}
          transition={{duration:0.38,ease:[0.16,1,0.3,1]}}
          onClick={e=>e.stopPropagation()}
          style={{background:"#0C0C0C",border:"1px solid #222",width:"100%",maxWidth:780,position:"relative",overflow:"hidden",fontFamily:"'IBM Plex Mono',monospace"}}
        >
          {/* Accent bar */}
          <div style={{height:2,background:ac,width:"100%"}} />

          {/* Header */}
          <div style={{padding:"28px 32px 22px",borderBottom:"1px solid #1A1A1A",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
            <div>
              <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                {[`PRJ_${study.id}`,study.year,study.status].map(t=>(
                  <span key={t} style={{fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:"0.2em",padding:"3px 8px",border:`1px solid ${ac}55`,color:ac}}>{t}</span>
                ))}
              </div>
              <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(38px,7vw,64px)",lineHeight:0.9,letterSpacing:"-0.02em",color:"#E8E3D8",marginBottom:6}}>{study.name}</h2>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:"0.12em",color:ac}}>{study.sub}</div>
            </div>
            <button onClick={onClose} style={{background:"none",border:"1px solid #2A2A2A",color:"#6A6A6A",cursor:"pointer",padding:"7px 10px",fontSize:14,lineHeight:1,flexShrink:0,transition:"border-color 0.2s,color 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=ac;e.currentTarget.style.color=ac;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#2A2A2A";e.currentTarget.style.color="#6A6A6A";}}>✕</button>
          </div>

          {/* Metrics */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderBottom:"1px solid #1A1A1A"}}>
            {study.metrics.map((m,i)=>(
              <div key={i} style={{padding:"18px 14px",borderRight:i<3?"1px solid #1A1A1A":"none",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,${ac},transparent)`,opacity:0.4}} />
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,lineHeight:1,color:"#E8E3D8",letterSpacing:"-0.01em",marginBottom:4}}>{m.value}</div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,letterSpacing:"0.1em",color:"#7A7A7A"}}>{m.label}</div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:"#444",marginTop:2}}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Body */}
          <div style={{padding:"28px 32px"}}>
            {[
              {label:"01 · THE PROBLEM",content:study.problem},
              {label:"02 · MODEL SELECTION + APPROACH",content:study.approach},
              {label:"03 · ARCHITECTURE + SOLUTION",content:study.solution},
            ].map((s,i)=>(
              <div key={i} style={{marginBottom:24}}>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:"0.22em",color:ac,marginBottom:10}}>{s.label}</div>
                <p style={{fontSize:11.5,color:"#7A7A7A",lineHeight:1.9,fontWeight:300}}>{s.content}</p>
              </div>
            ))}

            {/* Stack chips */}
            <div style={{marginBottom:24}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:"0.22em",color:"#4A4A4A",marginBottom:10}}>// STACK</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {study.stack.map(t=>(<span key={t} style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,letterSpacing:"0.08em",padding:"3px 9px",border:"1px solid #2A2A2A",color:"#6A6A6A"}}>{t}</span>))}
              </div>
            </div>

            {/* Health bar */}
            <div style={{marginBottom:28}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:"0.15em",color:"#4A4A4A"}}>PROJECT HEALTH</span>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:ac}}>{study.health}%</span>
              </div>
              <div style={{height:2,background:"#1A1A1A"}}>
                <motion.div initial={{width:0}} animate={{width:`${study.health}%`}} transition={{duration:0.9,ease:[0.16,1,0.3,1],delay:0.3}} style={{height:"100%",background:ac}} />
              </div>
            </div>

            {/* CTAs */}
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {study.demo&&(
                <a href={study.demo} target="_blank" rel="noopener noreferrer"
                  style={{display:"inline-flex",alignItems:"center",gap:8,background:ac,color:"#E8E3D8",fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:"0.18em",padding:"11px 22px",textDecoration:"none"}}
                  onMouseEnter={e=>e.currentTarget.style.opacity="0.82"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  ↗ VISIT LIVE
                </a>
              )}
              {study.github&&(
                <a href={study.github} target="_blank" rel="noopener noreferrer"
                  style={{display:"inline-flex",alignItems:"center",gap:8,background:"transparent",color:"#C8C3B8",fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:"0.18em",padding:"10px 20px",textDecoration:"none",border:"1px solid #2C2C2C",transition:"border-color 0.2s,color 0.2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=ac;e.currentTarget.style.color=ac;}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#2C2C2C";e.currentTarget.style.color="#C8C3B8";}}>
                  ⌥ GITHUB
                </a>
              )}
              {!study.demo&&!study.github&&(<span style={{fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:"0.15em",color:"#3A3A3A",padding:"10px 0"}}>// LINKS AVAILABLE ON COMPLETION</span>)}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════
   EDUCATION TIMELINE
══════════════════════════════════════════════════════════════ */
function EduRow({ item, index }) {
  const [open, setOpen] = useState(index===0);
  const isPrimary = index===0;

  return (
    <motion.div initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.1}} transition={{duration:0.65,delay:index*0.1,ease:[0.16,1,0.3,1]}} style={{position:"relative"}}>
      {/* Spine dot */}
      <div style={{position:"absolute",left:-25,top:22,width:isPrimary?8:5,height:isPrimary?8:5,borderRadius:"50%",background:isPrimary?ACCENT:"#2A2A2A",border:`1px solid ${isPrimary?ACCENT:"#333"}`,boxShadow:isPrimary?`0 0 8px ${ACCENT}55`:"none",animation:isPrimary?"pulse-dot 2.5s ease infinite":"none"}} />

      {/* Clickable header */}
      <button onClick={()=>setOpen(!open)} style={{width:"100%",background:"none",border:"none",cursor:"pointer",display:"grid",gridTemplateColumns:"90px 1fr auto",gap:16,alignItems:"center",padding:"20px 0",borderTop:"1px solid #1A1A1A",textAlign:"left"}}>
        <div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:"0.12em",color:"#5A5A5A"}}>{item.period}</div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:"#3A3A3A",marginTop:2}}>{item.location.split(",")[1]?.trim()}</div>
        </div>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,padding:"2px 7px",border:"1px solid #2A2A2A",color:"#5A5A5A",letterSpacing:"0.1em"}}>{item.type}</span>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,padding:"2px 7px",letterSpacing:"0.1em",border:item.status==="ONGOING"?`1px solid ${ACCENT}55`:"1px solid #1A1A1A",color:item.status==="ONGOING"?ACCENT:"#3A3A3A"}}>{item.status}</span>
            {item.milestone&&<span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:"#6A6A6A"}}>{item.milestone}</span>}
          </div>
          <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:isPrimary?14:12,fontWeight:500,color:"#E8E3D8",letterSpacing:"-0.01em"}}>{item.institution}</div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:isPrimary?ACCENT:"#4A4A4A",marginTop:3,letterSpacing:"0.05em"}}>{item.degree}</div>
        </div>
        {(item.coursework.length>0||item.highlights.length>0)&&(
          <motion.div animate={{rotate:open?180:0}} transition={{duration:0.25}} style={{color:"#4A4A4A",fontSize:12,lineHeight:1}}>▾</motion.div>
        )}
      </button>

      {/* Expandable */}
      <AnimatePresence>
        {open&&(item.coursework.length>0||item.highlights.length>0)&&(
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.38,ease:[0.16,1,0.3,1]}} style={{overflow:"hidden"}}>
            <div style={{paddingBottom:24,display:"grid",gridTemplateColumns:item.highlights.length?"1fr 1fr":"1fr",gap:24}}>
              {item.coursework.length>0&&(
                <div>
                  <div style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,letterSpacing:"0.22em",color:ACCENT,marginBottom:14}}>// RELEVANT COURSEWORK</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {item.coursework.map(c=>(<span key={c} style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:"#7A7A7A",padding:"4px 10px",border:"1px solid #1E1E1E"}}>{c}</span>))}
                  </div>
                </div>
              )}
              {item.highlights.length>0&&(
                <div>
                  <div style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,letterSpacing:"0.22em",color:"#4A4A4A",marginBottom:14}}>// MILESTONES</div>
                  {item.highlights.map((h,i)=>(
                    <div key={i} style={{display:"flex",gap:10,padding:"6px 0",borderBottom:i<item.highlights.length-1?"1px solid #111":"none"}}>
                      <span style={{width:3,height:3,background:ACCENT,flexShrink:0,marginTop:5}} />
                      <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10.5,color:"#7A7A7A",lineHeight:1.7}}>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Grades — secondary */}
            {item.grades&&(
              <div style={{display:"flex",gap:20,paddingBottom:20,borderTop:"1px solid #111",paddingTop:16}}>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,letterSpacing:"0.1em",color:"#3A3A3A"}}>CGPA <span style={{color:"#5A5A5A",marginLeft:6}}>{item.grades.cgpa}</span></div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,letterSpacing:"0.1em",color:"#3A3A3A"}}>SGPA <span style={{color:"#5A5A5A",marginLeft:6}}>{item.grades.sgpa}</span></div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TECH NOTES
══════════════════════════════════════════════════════════════ */
function NoteCard({ note, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{opacity:0,y:32}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.05}} transition={{duration:0.7,delay:index*0.08,ease:[0.16,1,0.3,1]}}
      style={{borderTop:"1px solid #1A1A1A",position:"relative",overflow:"hidden",transition:"background 0.25s"}}
      onMouseEnter={e=>e.currentTarget.style.background="rgba(139,26,26,0.025)"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
    >
      {/* Left accent */}
      <motion.div style={{position:"absolute",left:0,top:0,width:2,background:ACCENT,height:"100%",scaleY:0,transformOrigin:"top"}} whileHover={{scaleY:1}} transition={{duration:0.35,ease:[0.16,1,0.3,1]}} />

      <div onClick={()=>setOpen(!open)} style={{display:"grid",gridTemplateColumns:"100px 1fr auto",gap:16,padding:"22px 0 22px 16px",alignItems:"start",cursor:"pointer"}}>
        <div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,letterSpacing:"0.12em",color:"#4A4A4A"}}>{note.date}</div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:7,color:ACCENT,marginTop:4,letterSpacing:"0.08em"}}>{note.id}</div>
        </div>
        <div>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,letterSpacing:"0.18em",color:ACCENT,marginBottom:8}}>{note.category}</div>
          <h3 style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"clamp(12px,1.8vw,15px)",fontWeight:500,color:"#E8E3D8",lineHeight:1.4,marginBottom:8,letterSpacing:"-0.01em"}}>{note.title}</h3>
          <p style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:"#5A5A5A",lineHeight:1.7}}>{note.tldr}</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
            {note.tags.map(t=>(<span key={t} style={{fontFamily:"'Space Mono',monospace",fontSize:7,letterSpacing:"0.06em",padding:"2px 7px",border:"1px solid #2A2A2A",color:"#5A5A5A"}}>{t}</span>))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:"#3A3A3A"}}>{note.readTime}</span>
          <motion.div animate={{rotate:open?45:0}} transition={{duration:0.22}} style={{width:22,height:22,border:"1px solid #2A2A2A",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:14,color:"#6A6A6A",lineHeight:1}}>+</span>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {open&&(
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.38,ease:[0.16,1,0.3,1]}} style={{overflow:"hidden"}}>
            <div style={{padding:"0 0 28px 132px"}}>
              <div style={{width:"40%",height:1,background:ACCENT,opacity:0.3,marginBottom:20}} />
              {note.body.trim().split("\n\n").map((para,pi)=>(
                <p key={pi} style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11.5,color:"#7A7A7A",lineHeight:1.95,marginBottom:14,whiteSpace:"pre-wrap"}}>{para}</p>
              ))}
              {note.link&&(
                <a href={note.link} target="_blank" rel="noopener noreferrer"
                  style={{display:"inline-flex",alignItems:"center",gap:6,fontFamily:"'Space Mono',monospace",fontSize:8.5,letterSpacing:"0.15em",color:"#6A6A6A",textDecoration:"none",border:"1px solid #2A2A2A",padding:"6px 12px",marginTop:8,transition:"color 0.2s,border-color 0.2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.color=ACCENT;e.currentTarget.style.borderColor=ACCENT;}} onMouseLeave={e=>{e.currentTarget.style.color="#6A6A6A";e.currentTarget.style.borderColor="#2A2A2A";}}>
                  ↗ VIEW ON LEETCODE
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SMALL SHARED COMPONENTS
══════════════════════════════════════════════════════════════ */
function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  const pos = useRef({x:0,y:0}), tgt = useRef({x:0,y:0});
  const isLight = useRef(false);
  const [hasTouch] = useState(()=>typeof window!=="undefined"&&"ontouchstart" in window);
  useEffect(()=>{
    if (hasTouch) return;
    const mv=e=>{tgt.current={x:e.clientX,y:e.clientY};};
    window.addEventListener("mousemove",mv);
    let raf,frame=0;
    const animate=()=>{
      pos.current.x+=(tgt.current.x-pos.current.x)*0.11;
      pos.current.y+=(tgt.current.y-pos.current.y)*0.11;
      frame++;
      if (frame%8===0) {
        const el=document.elementFromPoint(tgt.current.x,tgt.current.y);
        if (el) { let node=el; while(node&&node.tagName!=="BODY"){const bg=window.getComputedStyle(node).backgroundColor;const m=bg.match(/\d+/g);if(m&&bg!=="rgba(0, 0, 0, 0)"){const lum=0.299*+m[0]+0.587*+m[1]+0.114*+m[2];isLight.current=lum>130;break;}node=node.parentElement;} }
      }
      const dc=isLight.current?"#0A0A0A":"#E8E3D8";
      const rc=isLight.current?"rgba(10,10,10,0.4)":"rgba(232,227,216,0.32)";
      if (dot.current){dot.current.style.left=`${tgt.current.x}px`;dot.current.style.top=`${tgt.current.y}px`;dot.current.style.background=dc;}
      if (ring.current){ring.current.style.left=`${pos.current.x}px`;ring.current.style.top=`${pos.current.y}px`;ring.current.style.borderColor=rc;}
      raf=requestAnimationFrame(animate);
    };
    animate();
    return()=>{window.removeEventListener("mousemove",mv);cancelAnimationFrame(raf);};
  },[hasTouch]);
  if (hasTouch) return null;
  return (<>
    <div ref={dot} style={{position:"fixed",width:5,height:5,background:"#E8E3D8",borderRadius:"50%",pointerEvents:"none",zIndex:9998,transform:"translate(-50%,-50%)",transition:"background 0.12s"}} />
    <div ref={ring} style={{position:"fixed",width:24,height:24,border:"1px solid rgba(232,227,216,0.32)",borderRadius:"50%",pointerEvents:"none",zIndex:9997,transform:"translate(-50%,-50%)",transition:"border-color 0.12s"}} />
  </>);
}

function SR({children,delay=0,style={}}) {
  const ref=useRef(null);
  const [v,setV]=useState(false);
  useEffect(()=>{const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);io.disconnect();}},{threshold:0.05});if(ref.current)io.observe(ref.current);return()=>io.disconnect();},[]);
  return (<div ref={ref} style={{opacity:v?1:0,transform:v?"none":"translateY(36px)",transition:`opacity 0.8s ${delay}s cubic-bezier(0.16,1,0.3,1),transform 0.8s ${delay}s cubic-bezier(0.16,1,0.3,1)`,...style}}>{children}</div>);
}

function Marquee({items}) {
  return (
    <div style={{overflow:"hidden",whiteSpace:"nowrap",borderTop:"1px solid #1C1C1C",borderBottom:"1px solid #1C1C1C",padding:"12px 0",background:"#0A0A0A"}}>
      <div style={{display:"inline-block",animation:"marquee 28s linear infinite"}}>
        {[...items,...items,...items].map((item,i)=>(<span key={i} style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:"0.2em",color:"#5A5A5A",marginRight:36}}>{item} <span style={{color:"#8B1A1A",marginRight:36}}>×</span></span>))}
      </div>
    </div>
  );
}

function Clock() {
  const [t,setT]=useState(new Date());
  useEffect(()=>{const i=setInterval(()=>setT(new Date()),1000);return()=>clearInterval(i);},[]);
  return <>{t.toLocaleTimeString("en-IN",{hour12:false})}</>;
}

/* ══════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════ */
export default function App() {
  const [ready,setReady]=useState(false);
  const [visible,setVisible]=useState(false);
  const [activeStudy,setActiveStudy]=useState(null);
  const [openNote,setOpenNote]=useState(null);

  useEffect(()=>{ if(ready) setTimeout(()=>setVisible(true),80); },[ready]);

  // Resume download — file must be in /public/Jiyotirmaan_Singh_Resume.pdf
  const handleResumeDownload = () => {
    const a = document.createElement("a");
    a.href = "/Jiyotirmaan_Singh_Resume.pdf";
    a.download = "Jiyotirmaan_Singh_Resume.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;background:#0A0A0A;}
        body{overflow-x:hidden;}
        ::-webkit-scrollbar{width:2px;}
        ::-webkit-scrollbar-thumb{background:#2A2A2A;}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-33.333%)}}
        @keyframes heroReveal{from{opacity:0;transform:translateY(56px) skewY(2deg)}to{opacity:1;transform:none}}
        @keyframes scanline{0%{top:-5%}100%{top:105%}}
        @keyframes pulse-dot{0%,100%{box-shadow:0 0 5px #8B1A1A}50%{box-shadow:0 0 14px #8B1A1A,0 0 24px rgba(139,26,26,0.35)}}
        @media(hover:hover){*{cursor:none!important;}}
        .bebas{font-family:'Bebas Neue',sans-serif;}
        .mono{font-family:'Space Mono',monospace;}
        .ibm{font-family:'IBM Plex Mono',monospace;}
        .lbl{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#7A7A7A;}
        .tag{font-family:'Space Mono',monospace;font-size:7.5px;letter-spacing:0.08em;text-transform:uppercase;padding:3px 8px;border:1px solid #2C2C2C;color:#7A7A7A;}
        .tag-r{font-family:'Space Mono',monospace;font-size:7.5px;letter-spacing:0.08em;text-transform:uppercase;padding:3px 8px;border:1px solid rgba(139,26,26,0.45);color:#CC3333;}
        .nav-link{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#9A9A9A;background:none;border:none;cursor:pointer;transition:color 0.2s;position:relative;padding:4px 0;}
        .nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1px;background:#E8E3D8;transition:width 0.3s;}
        .nav-link:hover{color:#E8E3D8;}
        .nav-link:hover::after{width:100%;}
        .btn-p{display:inline-flex;align-items:center;gap:8px;background:#E8E3D8;color:#0A0A0A;font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;padding:11px 20px;border:none;cursor:pointer;transition:background 0.25s,color 0.25s;text-decoration:none;white-space:nowrap;}
        .btn-p:hover{background:#8B1A1A;color:#E8E3D8;}
        .btn-g{display:inline-flex;align-items:center;gap:8px;background:transparent;color:#C8C3B8;font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;padding:10px 18px;border:1px solid #2C2C2C;cursor:pointer;transition:border-color 0.25s,color 0.25s;text-decoration:none;white-space:nowrap;}
        .btn-g:hover{border-color:#8B1A1A;color:#8B1A1A;}
        .stat-box{border:1px solid #1A1A1A;padding:20px 16px;position:relative;overflow:hidden;transition:border-color 0.3s;}
        .stat-box:hover{border-color:rgba(139,26,26,0.4);}
        .stat-box::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:#8B1A1A;transform:scaleX(0);transform-origin:left;transition:transform 0.4s cubic-bezier(0.16,1,0.3,1);}
        .stat-box:hover::after{transform:scaleX(1);}
        .proj-row{padding:28px 0;border-top:1px solid #1A1A1A;position:relative;overflow:hidden;transition:background 0.3s;display:grid;grid-template-columns:80px 1fr 1.1fr auto;gap:16px;align-items:center;}
        .proj-row:hover{background:rgba(139,26,26,0.03);}
        .proj-row::before{content:'';position:absolute;left:0;top:0;width:2px;height:0;background:#8B1A1A;transition:height 0.45s cubic-bezier(0.16,1,0.3,1);}
        .proj-row:hover::before{height:100%;}
        .proj-bg-num{font-family:'Bebas Neue',sans-serif;font-size:90px;color:transparent;-webkit-text-stroke:1px #161616;position:absolute;right:0;bottom:-8px;line-height:1;pointer-events:none;transition:-webkit-text-stroke-color 0.3s;}
        .proj-row:hover .proj-bg-num{-webkit-text-stroke-color:rgba(139,26,26,0.28);}
        .stack-cell{border:1px solid #1A1A1A;padding:24px 18px;position:relative;overflow:hidden;transition:border-color 0.3s;background:#0A0A0A;}
        .stack-cell:hover{border-color:rgba(139,26,26,0.4);}
        .stack-cell::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,#8B1A1A,transparent);transform:scaleX(0);transform-origin:left;transition:transform 0.4s cubic-bezier(0.16,1,0.3,1);}
        .stack-cell:hover::before{transform:scaleX(1);}
        .proj-link{display:inline-flex;align-items:center;gap:5px;font-family:'Space Mono',monospace;font-size:8px;letter-spacing:0.13em;text-transform:uppercase;color:#7A7A7A;text-decoration:none;border:1px solid #1A1A1A;padding:5px 10px;transition:color 0.2s,border-color 0.2s;cursor:pointer;background:none;}
        .proj-link:hover{color:#CC3333;border-color:rgba(139,26,26,0.5);}

        /* RESUME BUTTON — primary action feel */
        .btn-resume{display:inline-flex;align-items:center;gap:10px;background:#0A0A0A;color:#E8E3D8;font-family:'Space Mono',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;padding:14px 28px;text-decoration:none;border:none;cursor:pointer;position:relative;overflow:hidden;transition:background 0.25s;}
        .btn-resume::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:#8B1A1A;}
        .btn-resume:hover{background:#8B1A1A;}

        /* MOBILE */
        @media(max-width:768px){
          .hide-mob{display:none!important;}
          nav{padding:0 16px!important;height:48px!important;}
          #about{padding:56px 20px 40px!important;min-height:auto!important;}
          .stat-grid{grid-template-columns:1fr 1fr!important;}
          .stat-box{padding:14px 12px!important;}
          #projects{padding:56px 20px!important;}
          .proj-row{grid-template-columns:1fr!important;padding:20px 0!important;gap:8px!important;}
          .proj-bg-num{font-size:64px!important;opacity:0.6;}
          .feat-grid{grid-template-columns:1fr!important;}
          .feat-right{display:none!important;}
          #stack{padding:56px 20px!important;}
          .stack-grid{grid-template-columns:1fr 1fr!important;}
          #education,#notes{padding:56px 20px!important;}
          .edu-body-grid{grid-template-columns:1fr!important;}
          .about-section{padding:56px 20px!important;}
          .about-grid{grid-template-columns:1fr!important;}
          #contact .contact-inner{padding:56px 20px 48px!important;}
          .contact-grid{grid-template-columns:1fr!important;gap:32px!important;}
          .footer-bar{padding:16px 20px 14px!important;}
          .note-grid{grid-template-columns:1fr!important;padding-left:12px!important;}
        }
        @media(max-width:480px){
          .stack-grid{grid-template-columns:1fr!important;}
          h1.bebas{font-size:clamp(52px,14vw,80px)!important;}
        }
      `}</style>

      {!ready&&<NeuralIntro onComplete={()=>setReady(true)} />}
      {ready&&<Cursor />}

      {/* Case Study Modal */}
      {activeStudy&&<CaseStudyModal study={activeStudy} onClose={()=>setActiveStudy(null)} />}

      {visible&&(
        <div style={{background:"#0A0A0A",color:"#E8E3D8",minHeight:"100vh"}}>

          {/* Grain */}
          <div style={{position:"fixed",inset:0,zIndex:100,pointerEvents:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E\")",opacity:0.5}} />

          {/* Scanline */}
          <div style={{position:"fixed",inset:0,zIndex:99,pointerEvents:"none",overflow:"hidden"}}>
            <div style={{position:"absolute",left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,rgba(139,26,26,0.06),transparent)",animation:"scanline 10s linear infinite"}} />
          </div>

          {/* ── NAV ── */}
          <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,height:52,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 40px",background:"rgba(8,8,8,0.97)",backdropFilter:"blur(16px)",borderBottom:"1px solid #1C1C1C"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#8B1A1A",animation:"pulse-dot 2.5s ease infinite",flexShrink:0}} />
              <span className="mono" style={{fontSize:10,letterSpacing:"0.16em",color:"#E8E3D8"}}>J.SINGH</span>
              <span className="hide-mob" style={{width:1,height:10,background:"#2C2C2C",margin:"0 6px"}} />
              <span className="lbl hide-mob" style={{fontSize:8,color:"#8A8A8A"}}>AI/ML ENG</span>
            </div>
            <div className="hide-mob" style={{display:"flex",gap:26}}>
              {["about","projects","notes","stack","education","contact"].map(s=>(
                <button key={s} className="nav-link" onClick={()=>document.getElementById(s)?.scrollIntoView({behavior:"smooth"})}>{s}</button>
              ))}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div className="hide-mob" style={{textAlign:"right"}}>
                <div className="lbl" style={{fontSize:8,color:"#9A9A9A"}}><Clock /></div>
                <div className="lbl" style={{fontSize:7,marginTop:2,color:"#4A4A4A"}}>IST · BPL</div>
              </div>
              {/* FIXED: programmatic download via handleResumeDownload */}
              <button onClick={handleResumeDownload} className="btn-g" style={{padding:"6px 12px",fontSize:8}}>↓ CV</button>
              <a href="mailto:singhjiyotirmaan@gmail.com" className="btn-p" style={{padding:"6px 12px",fontSize:8}}>HIRE →</a>
            </div>
          </nav>

          {/* ── HERO ── */}
          <section id="about" style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"52px 44px 52px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(#0F0F0F 1px,transparent 1px),linear-gradient(90deg,#0F0F0F 1px,transparent 1px)",backgroundSize:"72px 72px",opacity:0.65}} />
            <div className="bebas hide-mob" style={{position:"absolute",right:"-1%",top:"5%",fontSize:"clamp(160px,26vw,380px)",color:"transparent",WebkitTextStroke:"1px #111",lineHeight:1,pointerEvents:"none"}}>2025</div>

            <div style={{maxWidth:1200,margin:"0 auto",width:"100%",position:"relative",zIndex:2}}>
              <div style={{display:"flex",gap:8,marginBottom:36,animation:"heroReveal 0.9s 0.1s both",flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:7,padding:"5px 11px",border:"1px solid #2C2C2C"}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"#8B1A1A",animation:"pulse-dot 2.5s ease infinite"}} />
                  <span className="lbl" style={{color:"#9A9A9A"}}>SYS_ONLINE</span>
                </div>
                <div style={{padding:"5px 11px",border:"1px solid #1C1C1C"}}>
                  <span className="lbl" style={{color:"#6A6A6A"}}>B.TECH AI/ML · SEM 06 · LNCT GROUP</span>
                </div>
              </div>
              <div style={{animation:"heroReveal 1s 0.2s both"}}>
                <h1 className="bebas" style={{fontSize:"clamp(60px,12vw,175px)",lineHeight:0.88,letterSpacing:"-0.02em",color:"#E8E3D8"}}>JIYOTIRMAAN</h1>
              </div>
              <div style={{animation:"heroReveal 1s 0.34s both"}}>
                <h1 className="bebas" style={{fontSize:"clamp(60px,12vw,175px)",lineHeight:0.88,letterSpacing:"-0.02em",color:"transparent",WebkitTextStroke:"2px #E8E3D8"}}>SINGH</h1>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:20,marginTop:28,animation:"heroReveal 1s 0.48s both"}}>
                <div style={{maxWidth:360}}>
                  <div className="lbl" style={{marginBottom:11,color:"#8B1A1A"}}>// AI/ML ENGINEER · FULL-STACK DEV · BHOPAL IN</div>
                  <p className="ibm" style={{fontSize:12.5,color:"#7A7A7A",lineHeight:1.85,fontWeight:300}}>
                    Building AI systems that actually ship.<br/>Computer vision pipelines, edge models on<br/>Raspberry Pi, full-stack ML end to end.<br/>
                    <span style={{color:"#CC3333"}}>No demos. Real data. Real edge.</span>
                  </p>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <a href="#projects" className="btn-p" onClick={e=>{e.preventDefault();document.getElementById("projects")?.scrollIntoView({behavior:"smooth"});}}>VIEW WORK →</a>
                  <a href="mailto:singhjiyotirmaan@gmail.com" className="btn-g">CONTACT</a>
                </div>
              </div>

              {/* Stats */}
              <div className="stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",marginTop:40,animation:"heroReveal 1s 0.62s both"}}>
                {[
                  {v:"2168",l:"LeetCode",s:"GUARDIAN · TOP 1.07%"},
                  {v:"631",l:"Problems Solved",s:"LC · 358 ACTIVE DAYS"},
                  {v:"172",l:"Max Streak",s:"LEETCODE"},
                  {v:"#7",l:"Samadhan 2.0",s:"NATIONAL FINAL"},
                ].map((s,i)=>(
                  <div key={i} className="stat-box" style={{borderRight:i<3?"none":undefined,borderLeft:i>0?"1px solid #1A1A1A":undefined}}>
                    <div className="bebas" style={{fontSize:"clamp(28px,4.5vw,48px)",lineHeight:1,color:"#E8E3D8",letterSpacing:"-0.02em"}}>{s.v}</div>
                    <div className="ibm" style={{fontSize:10,color:"#6A6A6A",marginTop:4}}>{s.l}</div>
                    <div className="lbl" style={{marginTop:2,color:"#4A4A4A",fontSize:7.5}}>{s.s}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Marquee items={STACK_ITEMS} />

          {/* ── PROJECTS ── */}
          <section id="projects" style={{padding:"76px 44px",borderTop:"1px solid #111"}}>
            <div style={{maxWidth:1200,margin:"0 auto"}}>
              <SR>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:48,flexWrap:"wrap",gap:14}}>
                  <div>
                    <div className="lbl" style={{marginBottom:12,color:"#7A7A7A"}}>// SELECTED_PROJECTS</div>
                    <h2 className="bebas" style={{fontSize:"clamp(44px,7vw,96px)",lineHeight:0.9,letterSpacing:"-0.02em"}}>WHAT I <span style={{color:"#8B1A1A"}}>SHIP.</span></h2>
                  </div>
                  <p className="ibm hide-mob" style={{fontSize:11,color:"#5A5A5A",maxWidth:230,lineHeight:1.75}}>Systems on real hardware. Real data. Real users.</p>
                </div>
              </SR>

              {/* Featured — STRADA */}
              <SR delay={0.05}>
                <div className="feat-grid" style={{display:"grid",gridTemplateColumns:"1.1fr 0.9fr",gap:0,border:"1px solid #1C1C1C",marginBottom:2}}>
                  <div style={{padding:"36px 32px",borderRight:"1px solid #1C1C1C"}}>
                    <div style={{display:"flex",gap:7,marginBottom:20}}><span className="tag-r">FEATURED</span><span className="tag-r">ACTIVE</span></div>
                    <h3 className="bebas" style={{fontSize:"clamp(44px,6vw,84px)",lineHeight:0.88,letterSpacing:"-0.02em",color:"#E8E3D8",marginBottom:5}}>STRADA</h3>
                    <div className="lbl" style={{color:"#CC3333",marginBottom:16,fontSize:7.5}}>AI TYRE DIAGNOSTIC SYSTEM · 2025</div>
                    <div style={{width:"32%",height:1,background:"#8B1A1A",marginBottom:18}} />
                    <p className="ibm" style={{fontSize:11.5,color:"#7A7A7A",lineHeight:1.85,marginBottom:20}}>Multi-image wear analysis pipeline. React/Vite frontend → Python/Flask ML microservice. Wear classification, Grad-CAM heatmap overlays — full XAI in under 2s.</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
                      {["React","Flask","Grad-CAM","Python","CV"].map(t=><span key={t} className="tag-r">{t}</span>)}
                    </div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      <a href="https://new-strada.vercel.app" target="_blank" rel="noopener noreferrer" className="proj-link">VISIT LIVE →</a>
                      <button className="proj-link" style={{color:"#CC3333",borderColor:"rgba(139,26,26,0.4)"}} onClick={()=>setActiveStudy(CASE_STUDIES.STRADA)}>CASE STUDY →</button>
                    </div>
                  </div>
                  <div className="feat-right" style={{background:"#8B1A1A",padding:"36px 32px",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                    <div className="bebas" style={{position:"absolute",right:"-5%",bottom:"-8%",fontSize:"13vw",color:"rgba(0,0,0,0.14)",lineHeight:1,letterSpacing:"-0.04em"}}>01</div>
                    <div>
                      <div className="lbl" style={{color:"rgba(232,227,216,0.5)",marginBottom:16}}>PRJ_A1 · BHOPAL-IN</div>
                      <div className="ibm" style={{fontSize:11,color:"rgba(232,227,216,0.7)",lineHeight:2}}>STACK: REACT · FLASK · PYTORCH<br/>LATENCY: &lt;2s XAI PIPELINE<br/>DEPLOY: PRODUCTION<br/>HEALTH: 87%</div>
                    </div>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                        <div className="lbl" style={{color:"rgba(232,227,216,0.5)",fontSize:7.5}}>HEALTH</div>
                        <span className="mono" style={{fontSize:9,color:"rgba(232,227,216,0.7)"}}>87%</span>
                      </div>
                      <div style={{height:2,background:"rgba(0,0,0,0.2)",borderRadius:1}}>
                        <div style={{width:"87%",height:"100%",background:"rgba(232,227,216,0.65)",borderRadius:1}} />
                      </div>
                    </div>
                  </div>
                </div>
              </SR>

              {/* Other projects */}
              {PROJECTS.slice(1).map((p,i)=>(
                <SR key={p.id} delay={0.07*(i+1)}>
                  <div className="proj-row">
                    <div className="proj-bg-num">{p.id}</div>
                    <div>
                      <div className="lbl" style={{marginBottom:2,color:"#5A5A5A"}}>{p.year}</div>
                      <div className="ibm" style={{fontSize:9,color:"#4A4A4A"}}>{p.type}</div>
                    </div>
                    <div>
                      <h3 className="bebas" style={{fontSize:"clamp(22px,2.8vw,40px)",letterSpacing:"-0.02em",color:"#E8E3D8",lineHeight:1}}>{p.name}</h3>
                      <div className="lbl" style={{marginTop:3,color:"#CC3333",fontSize:7.5}}>{p.sub}</div>
                    </div>
                    <p className="ibm hide-mob" style={{fontSize:11,color:"#5A5A5A",lineHeight:1.75}}>
                      {p.name==="MHEWS"&&"YOLOv8 on 33K images. MiDaS depth estimation. Raspberry Pi edge deployment on Indian roads."}
                      {p.name==="CLEARLENS"&&"Face+posture engagement scoring. Ollama/Mistral feedback loop. National hackathon finalist."}
                      {p.name==="FACEID"&&"Haar Cascade pipeline. Optimised for variable lighting. Clean minimal CV implementation."}
                    </p>
                    <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end"}}>
                      <span className={p.status==="ARCHIVED"?"tag":"tag-r"}>{p.status}</span>
                      <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"flex-end"}}>
                        {p.tags.slice(0,2).map(t=><span key={t} className="tag">{t}</span>)}
                      </div>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:3}}>
                        {p.link&&(<a href={p.link} target="_blank" rel="noopener noreferrer" className="proj-link">{p.link.includes("github")?"GITHUB →":"LIVE →"}</a>)}
                        {CASE_STUDIES[p.name]&&(<button className="proj-link" style={{color:"#CC3333",borderColor:"rgba(139,26,26,0.4)"}} onClick={()=>setActiveStudy(CASE_STUDIES[p.name])}>DETAILS →</button>)}
                      </div>
                    </div>
                  </div>
                </SR>
              ))}
              <div style={{height:1,background:"#1A1A1A"}} />
            </div>
          </section>

          {/* ── TECH NOTES ── */}
          <section id="notes" style={{padding:"76px 44px",borderTop:"1px solid #111",background:"#080808"}}>
            <div style={{maxWidth:1200,margin:"0 auto"}}>
              <SR>
                <div className="lbl" style={{marginBottom:12,color:"#7A7A7A"}}>// TECHNICAL_NOTES</div>
                <h2 className="bebas" style={{fontSize:"clamp(44px,7vw,96px)",lineHeight:0.9,letterSpacing:"-0.02em",marginBottom:12}}>HOW I <span style={{color:"#8B1A1A"}}>THINK.</span></h2>
                <p className="ibm" style={{fontSize:11.5,color:"#5A5A5A",lineHeight:1.8,maxWidth:480,marginBottom:52}}>LeetCode hard breakdowns, CV pipeline teardowns, model selection reasoning. Engineering thinking made legible.</p>
              </SR>
              {TECH_NOTES.map((note,i)=>(<NoteCard key={note.id} note={note} index={i} />))}
              <div style={{height:1,background:"#1A1A1A"}} />
            </div>
          </section>

          {/* ── STACK ── */}
          <section id="stack" style={{padding:"76px 44px",borderTop:"1px solid #111"}}>
            <div style={{maxWidth:1200,margin:"0 auto"}}>
              <SR>
                <div className="lbl" style={{marginBottom:12,color:"#7A7A7A"}}>// TECH ARSENAL</div>
                <h2 className="bebas" style={{fontSize:"clamp(44px,7vw,96px)",lineHeight:0.9,letterSpacing:"-0.02em",marginBottom:44}}>THE <span style={{color:"#8B1A1A"}}>TOOLKIT.</span></h2>
              </SR>
              <div className="stack-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"#151515"}}>
                {[
                  {cat:"CV / DEEP LEARNING",items:["YOLOv8","PyTorch","OpenCV","MiDaS","Grad-CAM","MediaPipe","EfficientNet","Roboflow"]},
                  {cat:"FULL-STACK",items:["React (Vite)","Node.js","Express.js","MongoDB","Flask","REST APIs","TailwindCSS","Framer Motion"]},
                  {cat:"LANGUAGES",items:["Python","Java","JavaScript","SQL"]},
                  {cat:"INFRA / TOOLS",items:["Git","Raspberry Pi","Apple MPS","Folium","Ollama","Roboflow","VS Code","MongoDB Atlas"]},
                ].map((cat,ci)=>(
                  <SR key={ci} delay={0.07*ci}>
                    <div className="stack-cell" style={{height:"100%"}}>
                      <div className="lbl" style={{color:"#CC3333",marginBottom:20,fontSize:7.5}}>{cat.cat}</div>
                      {cat.items.map((item,ii)=>(
                        <div key={item} style={{display:"flex",alignItems:"center",gap:9,padding:"7px 0",borderBottom:ii<cat.items.length-1?"1px solid #0F0F0F":"none"}}>
                          <span style={{width:3,height:3,background:"#8B1A1A",flexShrink:0}} />
                          <span className="ibm" style={{fontSize:11,color:"#8A8A8A"}}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </SR>
                ))}
              </div>
            </div>
          </section>

          {/* ── EDUCATION (Timeline) ── */}
          <section id="education" style={{padding:"76px 44px",borderTop:"1px solid #111"}}>
            <div style={{maxWidth:1200,margin:"0 auto"}}>
              <SR>
                <div className="lbl" style={{marginBottom:12,color:"#7A7A7A"}}>// ACADEMIC_RECORD</div>
                <h2 className="bebas" style={{fontSize:"clamp(44px,7vw,96px)",lineHeight:0.9,letterSpacing:"-0.02em",marginBottom:52}}>THE <span style={{color:"#8B1A1A"}}>EDUCATION.</span></h2>
              </SR>
              <div style={{position:"relative",paddingLeft:26}}>
                {/* Vertical spine */}
                <div style={{position:"absolute",left:0,top:0,bottom:0,width:1,background:"linear-gradient(to bottom,#2A2A2A 60%,transparent)"}} />
                {EDU.map((item,i)=>(<EduRow key={i} item={item} index={i} />))}
                <div style={{height:1,background:"#1A1A1A",marginTop:4}} />
              </div>
            </div>
          </section>

          {/* ── ABOUT CARDS ── */}
          <section className="about-section" style={{padding:"68px 44px",borderTop:"1px solid #111",background:"#080808"}}>
            <div style={{maxWidth:1200,margin:"0 auto"}}>
              <div className="about-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:"#111"}}>
                {[
                  {icon:"◈",title:"Computer Vision",txt:"YOLOv8 · MiDaS · Grad-CAM. Training on Apple MPS. Edge deploy on Raspberry Pi. Real hardware, real inference.",accent:true},
                  {icon:"⬡",title:"Full-Stack ML",txt:"React → Flask microservices. End-to-end ML product engineering. No hand-wavy prototypes. Ships to production.",accent:false},
                  {icon:"▣",title:"Competitive CP",txt:"LeetCode Guardian · 2168 · Top 1.07% globally. 631+ problems. 172-day max streak. Consistent.",accent:true},
                ].map((c,i)=>(
                  <SR key={i} delay={0.09*i}>
                    <div style={{background:"#0A0A0A",padding:"30px 22px",position:"relative",height:"100%"}}>
                      {c.accent&&<div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,#8B1A1A,transparent)"}} />}
                      <div style={{fontSize:17,color:c.accent?"#8B1A1A":"#E8E3D8",marginBottom:12}}>{c.icon}</div>
                      <div className="ibm" style={{fontSize:12,fontWeight:500,color:"#E8E3D8",marginBottom:9}}>{c.title}</div>
                      <div className="ibm" style={{fontSize:11,color:"#6A6A6A",lineHeight:1.8}}>{c.txt}</div>
                    </div>
                  </SR>
                ))}
              </div>
            </div>
          </section>

          {/* ── CONTACT ── */}
          <section id="contact" style={{borderTop:"1px solid #111"}}>
            <div className="contact-inner" style={{background:"#E8E3D8",padding:"68px 44px 60px"}}>
              <div style={{maxWidth:1200,margin:"0 auto"}}>
                <SR>
                  <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:"0.25em",color:"#888070",marginBottom:16}}>// OPEN TO WORK</div>
                  <h2 className="bebas" style={{fontSize:"clamp(48px,9vw,144px)",lineHeight:0.88,letterSpacing:"-0.03em",color:"#0A0A0A",marginBottom:40}}>BUILD<br/>SOMETHING<br/>REAL.</h2>
                </SR>
                <SR delay={0.1}>
                  <div className="contact-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:52,alignItems:"end"}}>
                    <div>
                      <p className="ibm" style={{fontSize:13,color:"#5A5040",lineHeight:1.85}}>Open to ML engineering internships,<br/>full-stack roles, and hard problems.<br/>Building at the edge of possible.</p>
                      <div style={{marginTop:24}}>
                        {[{l:"EMAIL",v:"singhjiyotirmaan@gmail.com"},{l:"PHONE",v:"+91 74156 82591"},{l:"LOCATION",v:"BHOPAL, INDIA"}].map(c=>(
                          <div key={c.l} style={{display:"flex",gap:14,padding:"10px 0",borderTop:"1px solid #D4CEBC",alignItems:"baseline",flexWrap:"wrap"}}>
                            <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,letterSpacing:"0.2em",color:"#A09880",minWidth:68}}>{c.l}</span>
                            <span className="mono" style={{fontSize:9,color:"#0A0A0A",letterSpacing:"0.03em"}}>{c.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:10,alignItems:"flex-start"}}>
                      <a href="mailto:singhjiyotirmaan@gmail.com"
                        style={{display:"inline-flex",alignItems:"center",gap:8,background:"#0A0A0A",color:"#E8E3D8",fontFamily:"'Space Mono',monospace",fontSize:9,letterSpacing:"0.17em",textTransform:"uppercase",padding:"14px 28px",textDecoration:"none",transition:"background 0.25s",cursor:"pointer"}}
                        onMouseEnter={e=>e.currentTarget.style.background="#8B1A1A"} onMouseLeave={e=>e.currentTarget.style.background="#0A0A0A"}>
                        EMAIL ME →
                      </a>

                      {/* FIXED PRIMARY RESUME BUTTON */}
                      <button onClick={handleResumeDownload} className="btn-resume">
                        ↓ DOWNLOAD RESUME
                      </button>

                      <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
                        {[{lbl:"GITHUB",href:"https://github.com/jiyotirmaansingh"},{lbl:"LINKEDIN",href:"https://linkedin.com"}].map(({lbl,href})=>(
                          <a key={lbl} href={href} target="_blank" rel="noopener noreferrer"
                            style={{display:"inline-flex",alignItems:"center",gap:7,background:"transparent",color:"#0A0A0A",fontFamily:"'Space Mono',monospace",fontSize:8.5,letterSpacing:"0.15em",textTransform:"uppercase",padding:"11px 18px",border:"1px solid #0A0A0A",textDecoration:"none",transition:"border-color 0.25s,color 0.25s",cursor:"pointer"}}
                            onMouseEnter={e=>{e.currentTarget.style.borderColor="#8B1A1A";e.currentTarget.style.color="#8B1A1A";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#0A0A0A";e.currentTarget.style.color="#0A0A0A";}}>
                            {lbl}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </SR>
              </div>
            </div>

            <div className="footer-bar" style={{background:"#8B1A1A",padding:"18px 44px 14px",overflow:"hidden"}}>
              <div className="bebas" style={{fontSize:"clamp(32px,6vw,84px)",lineHeight:1,letterSpacing:"-0.02em",color:"#0A0A0A",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>JIYOTIRMAAN SINGH</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:18,borderTop:"1px solid rgba(0,0,0,0.2)",marginTop:11,paddingTop:11}}>
                {["AI/ML ENGINEER · FULL-STACK DEV","LNCT GROUP · BHOPAL","OPEN TO INTERNSHIP","REACT + VITE · 2025"].map((t,i)=>(
                  <div key={i} className="lbl" style={{color:"rgba(0,0,0,0.38)",fontSize:7.5}}>{t}</div>
                ))}
              </div>
            </div>
          </section>

        </div>
      )}
    </>
  );
}