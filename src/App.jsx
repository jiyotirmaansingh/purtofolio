import { useEffect, useRef, useState } from "react";

const PROJECTS = [
  { id:"01", name:"STRADA", sub:"AI Tyre Diagnostic System", year:"2025", type:"CV · FLASK · REACT", desc:"Multi-image wear analysis. Grad-CAM heatmap overlays. Full XAI pipeline in under 2 seconds.", tags:["React","Flask","Grad-CAM","Python","CV"], status:"ACTIVE", health:87, link:"https://new-strada.vercel.app" },
  { id:"02", name:"MHEWS", sub:"Multi-Hazard Early Warning", year:"2025", type:"YOLO · EDGE · MIDAS", desc:"YOLOv8 on 33K images. MiDaS depth estimation. Raspberry Pi edge deployment on Indian roads.", tags:["YOLOv8","MiDaS","Folium","Raspberry Pi"], status:"TRAINING", health:62, link:null },
  { id:"03", name:"CLEARLENS", sub:"AI Productivity Tracker", year:"2024", type:"MEDIAPIPE · MERN · LLM", desc:"Face+posture engagement scoring. Ollama/Mistral feedback loop. National hackathon finalist.", tags:["MediaPipe","Ollama","MongoDB","Express"], status:"DEPLOYED", health:100, link:"https://github.com/jiyotirmaansingh/ClearLens-1" },
  { id:"04", name:"FACEID", sub:"Real-Time Face Detection", year:"2024", type:"OPENCV · HAAR CASCADE", desc:"Haar Cascade pipeline. Optimised for variable lighting. Clean minimal CV implementation.", tags:["Python","OpenCV","Haar Cascade"], status:"ARCHIVED", health:100, link:"https://github.com/jiyotirmaansingh/Face-Recognition" },
];

const STACK_ITEMS = [
  "YOLOv8","PyTorch","OpenCV","MiDaS","Grad-CAM","MediaPipe","EfficientNet","Roboflow",
  "React","Node.js","Express","MongoDB","Flask","TailwindCSS","REST APIs","Python","Java","JavaScript","SQL",
  "Git","Raspberry Pi","Apple MPS","Folium","Ollama","VS Code","MongoDB Atlas",
];

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


    const LAYERS = mob
      ? [2, 4, 6, 4, 2, 1]
      : [3, 6, 9, 12, 9, 6, 3, 1];

    const NODE_SPACING = mob ? 26 : 32;
    const marginX = W * (mob ? 0.06 : 0.09);
    const usableW = W - marginX * 2;
    const layerX = LAYERS.map((_, i) => marginX + (i / (LAYERS.length - 1)) * usableW);

    /* Build nodes — vertically centered, tightly packed */
    const nodes = LAYERS.map((count, li) => {
      const totalH = (count - 1) * NODE_SPACING;
      const startY = H / 2 - totalH / 2;
      return Array.from({ length: count }, (_, ni) => ({
        x: layerX[li],
        y: startY + ni * NODE_SPACING,
        activation: 0,
        phase: Math.random() * Math.PI * 2,
      }));
    });

    const conns = [];
    for (let li = 0; li < LAYERS.length - 1; li++) {
      for (const a of nodes[li]) {
        for (const b of nodes[li + 1]) {
          conns.push({ a, b, w: 0.025 + Math.random() * 0.055, active: 0, sign: Math.random() > 0.5 ? 1 : -1 });
        }
      }
    }

    const signals = [];
    const spawnSignal = (li) => {
      if (li >= LAYERS.length - 1) return;
      const from = nodes[li][Math.floor(Math.random() * nodes[li].length)];
      const to = nodes[li + 1][Math.floor(Math.random() * nodes[li + 1].length)];
      const conn = conns.find(c => c.a === from && c.b === to);
      signals.push({ x: from.x, y: from.y, tx: to.x, ty: to.y, t: 0, speed: (mob ? 0.028 : 0.02) + Math.random() * 0.016, layer: li, toNode: to, conn });
    };

    let frame = 0;
    const DURATION = mob ? 4.2 : 5.5;
    const SPAWN_RATE = mob ? 7 : 4;

    const draw = () => {
      frame++;
      const elapsed = (Date.now() - startRef.current) / 1000;
      const prog = Math.min(elapsed / DURATION, 1);
      setProgress(Math.round(prog * 100));

      ctx.fillStyle = "rgba(8,8,8,0.22)";
      ctx.fillRect(0, 0, W, H);

      /* ── Connections ── */
      for (const c of conns) {
        c.active *= 0.90;
        const alpha = c.w + c.active * 0.4;
        ctx.beginPath();
        ctx.moveTo(c.a.x, c.a.y);
        ctx.lineTo(c.b.x, c.b.y);
        if (c.active > 0.05) {
          ctx.strokeStyle = c.sign > 0
            ? `rgba(180,45,45,${alpha * 1.2})`
            : `rgba(45,80,180,${alpha * 1.2})`;
          ctx.lineWidth = 0.5 + c.active * 0.7;
        } else {
          ctx.strokeStyle = `rgba(55,55,55,${c.w * 1.4})`;
          ctx.lineWidth = 0.35;
        }
        ctx.stroke();
      }

      /* ── Signals ── */
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i];
        s.t += s.speed;
        const cx = s.x + (s.tx - s.x) * s.t;
        const cy = s.y + (s.ty - s.y) * s.t;

        ctx.beginPath();
        ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,70,70,${1 - s.t * 0.25})`;
        ctx.fill();

        const bt = Math.max(0, s.t - 0.05);
        ctx.beginPath();
        ctx.arc(s.x + (s.tx - s.x) * bt, s.y + (s.ty - s.y) * bt, 1.0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,50,50,0.28)";
        ctx.fill();

        if (s.conn) s.conn.active = Math.min(1, s.conn.active + 0.55);

        if (s.t >= 1) {
          s.toNode.activation = Math.min(1, s.toNode.activation + 0.55);
          signals.splice(i, 1);
          if (s.layer + 1 < LAYERS.length - 1) spawnSignal(s.layer + 1);
        }
      }


      if (frame % SPAWN_RATE === 0) spawnSignal(0);
      if (frame % (SPAWN_RATE * 3) === 0) spawnSignal(Math.floor(Math.random() * (LAYERS.length - 2)));


      nodes.forEach((layer, li) => {
        const isOut = li === LAYERS.length - 1;
        const isIn = li === 0;
        layer.forEach(n => {
          n.activation *= 0.93;
          n.phase += 0.015;
          const pulse = 0.5 + 0.5 * Math.sin(n.phase);
          // node radii: input=3.5, hidden=2.8, output=5.5
          const baseR = isOut ? 5.5 : isIn ? 3.5 : 2.8;
          const r = baseR + n.activation * 2.8;


          if (n.activation > 0.08) {
            const grad = ctx.createRadialGradient(n.x, n.y, r * 0.5, n.x, n.y, r + 10);
            grad.addColorStop(0, `rgba(160,30,30,${n.activation * 0.22})`);
            grad.addColorStop(1, "rgba(0,0,0,0)");
            ctx.beginPath();
            ctx.arc(n.x, n.y, r + 10, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
          }

          /* Fill */
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          if (isOut) {
            ctx.fillStyle = `rgba(170,35,35,${0.55 + n.activation * 0.45})`;
          } else {
            ctx.fillStyle = `rgba(200,195,185,${0.15 + n.activation * 0.5 + pulse * 0.04})`;
          }
          ctx.fill();

          /* Thin border */
          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.strokeStyle = isOut
            ? `rgba(210,65,65,${0.4 + n.activation * 0.5})`
            : `rgba(110,105,95,${0.2 + n.activation * 0.35})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();

          /* Specular dot */
          ctx.beginPath();
          ctx.arc(n.x - r * 0.22, n.y - r * 0.22, r * 0.22, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.28 + pulse * 0.12 + n.activation * 0.25})`;
          ctx.fill();
        });
      });

      /* Layer labels — desktop only */
      if (!mob) {
        ctx.textAlign = "center";
        ctx.font = "7.5px 'Space Mono', monospace";
        nodes.forEach((layer, li) => {
          const label = li === 0 ? "INPUT" : li === LAYERS.length - 1 ? "OUTPUT" : `H${li}`;
          const bottomY = layer[layer.length - 1].y + 18;
          ctx.fillStyle = "rgba(80,70,60,0.5)";
          ctx.fillText(label, layerX[li], bottomY);
        });
        // node count below label
        nodes.forEach((layer, li) => {
          if (li > 0 && li < LAYERS.length - 1) {
            const bottomY = layer[layer.length - 1].y + 28;
            ctx.fillStyle = "rgba(60,55,50,0.4)";
            ctx.fillText(`n=${layer.length}`, layerX[li], bottomY);
          }
        });
      }

      if (prog < 1) {
        rafRef.current = requestAnimationFrame(draw);
      } else if (!doneRef.current) {
        doneRef.current = true;
        setPhase("output");
        let idx = 0;
        const addLine = () => {
          if (idx < LINES.length) {
            setOutputLines(p => [...p, LINES[idx++]]);
            setTimeout(addLine, mob ? 75 : 105);
          } else {
            setTimeout(() => setPhase("dissolve"), 400);
            setTimeout(onComplete, 1050);
          }
        };
        addLine();
      }
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999, background:"#080808", overflow:"hidden",
      opacity: phase==="dissolve" ? 0 : 1,
      transform: phase==="dissolve" ? "scale(1.03)" : "scale(1)",
      transition: phase==="dissolve" ? "opacity 0.8s ease, transform 0.8s ease" : "none"
    }}>
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0 }} />
      {/* HUD */}
      <div style={{ position:"relative", zIndex:2, padding:"22px 24px", display:"flex", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:8, letterSpacing:"0.2em", color:"#333" }}>NEURAL_NET // FORWARD_PASS</div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.12em", color:"#8B1A1A", marginTop:3 }}>JIYOTIRMAAN.SYS</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:30, fontWeight:700, color:"#E8E3D8", lineHeight:1 }}>{progress}%</div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:7, letterSpacing:"0.2em", color:"#333", marginTop:2 }}>COMPUTING</div>
        </div>
      </div>
      {/* Terminal */}
      {phase==="output" && (
        <div style={{ position:"absolute", bottom:24, left:24, right:24, zIndex:2, fontFamily:"'Space Mono',monospace", fontSize:9, lineHeight:2.0, maxHeight:"38vh", overflow:"hidden" }}>
          {outputLines.map((line, i) => (
            <div key={i} style={{ color: i===outputLines.length-1 ? "#CC3333" : "#444", animation:"nn-fade 0.1s ease" }}>{line}</div>
          ))}
        </div>
      )}
      <style>{`@keyframes nn-fade{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const pos = useRef({ x:0, y:0 });
  const tgt = useRef({ x:0, y:0 });
  const isLight = useRef(false);
  const [hasTouch] = useState(() => typeof window !== "undefined" && "ontouchstart" in window);

  useEffect(() => {
    if (hasTouch) return;
    const mv = e => { tgt.current = { x:e.clientX, y:e.clientY }; };
    window.addEventListener("mousemove", mv);

    let raf, frame = 0;
    const animate = () => {
      pos.current.x += (tgt.current.x - pos.current.x) * 0.11;
      pos.current.y += (tgt.current.y - pos.current.y) * 0.11;

      frame++;
      if (frame % 8 === 0) {
        const el = document.elementFromPoint(tgt.current.x, tgt.current.y);
        if (el) {
          let node = el;
          while (node && node.tagName !== "BODY") {
            const bg = window.getComputedStyle(node).backgroundColor;
            const m = bg.match(/\d+/g);
            if (m && bg !== "rgba(0, 0, 0, 0)") {
              const lum = 0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2];
              isLight.current = lum > 130;
              break;
            }
            node = node.parentElement;
          }
        }
      }

      const dc = isLight.current ? "#0A0A0A" : "#E8E3D8";
      const rc = isLight.current ? "rgba(10,10,10,0.4)" : "rgba(232,227,216,0.32)";

      if (dot.current) {
        dot.current.style.left = `${tgt.current.x}px`;
        dot.current.style.top = `${tgt.current.y}px`;
        dot.current.style.background = dc;
      }
      if (ring.current) {
        ring.current.style.left = `${pos.current.x}px`;
        ring.current.style.top = `${pos.current.y}px`;
        ring.current.style.borderColor = rc;
      }
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("mousemove", mv); cancelAnimationFrame(raf); };
  }, [hasTouch]);

  if (hasTouch) return null;
  return (<>
    <div ref={dot} style={{ position:"fixed", width:5, height:5, background:"#E8E3D8", borderRadius:"50%", pointerEvents:"none", zIndex:9998, transform:"translate(-50%,-50%)", transition:"background 0.12s" }} />
    <div ref={ring} style={{ position:"fixed", width:24, height:24, border:"1px solid rgba(232,227,216,0.32)", borderRadius:"50%", pointerEvents:"none", zIndex:9997, transform:"translate(-50%,-50%)", transition:"border-color 0.12s" }} />
  </>);
}


function SR({ children, delay=0, style={} }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if(e.isIntersecting){setV(true);io.disconnect();} }, { threshold:0.05 });
    if(ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity:v?1:0, transform:v?"none":"translateY(36px)", transition:`opacity 0.8s ${delay}s cubic-bezier(0.16,1,0.3,1), transform 0.8s ${delay}s cubic-bezier(0.16,1,0.3,1)`, ...style }}>
      {children}
    </div>
  );
}

function Marquee({ items }) {
  return (
    <div style={{ overflow:"hidden", whiteSpace:"nowrap", borderTop:"1px solid #1C1C1C", borderBottom:"1px solid #1C1C1C", padding:"12px 0", background:"#0A0A0A" }}>
      <div style={{ display:"inline-block", animation:"marquee 28s linear infinite" }}>
        {[...items,...items,...items].map((item,i) => (
          <span key={i} style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.2em", color:"#5A5A5A", marginRight:36 }}>
            {item} <span style={{ color:"#8B1A1A", marginRight:36 }}>×</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(()=>{ const i=setInterval(()=>setT(new Date()),1000); return ()=>clearInterval(i); },[]);
  return <>{t.toLocaleTimeString("en-IN",{hour12:false})}</>;
}

/* ══════════════════ MAIN ══════════════════ */
export default function App() {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(()=>{ if(ready) setTimeout(()=>setVisible(true), 80); },[ready]);

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
        @keyframes fadeIn{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:none}}
        @keyframes scanline{0%{top:-5%}100%{top:105%}}
        @keyframes pulse-dot{0%,100%{box-shadow:0 0 5px #8B1A1A}50%{box-shadow:0 0 14px #8B1A1A,0 0 24px rgba(139,26,26,0.35)}}
        /* hide system cursor only on hover-capable (desktop) */
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
        .edu-row{display:grid;grid-template-columns:100px 1fr auto;gap:16px;align-items:center;padding:22px 0;border-top:1px solid #1A1A1A;transition:background 0.3s;}
        .edu-row:hover{background:rgba(139,26,26,0.03);}
        .proj-link{display:inline-flex;align-items:center;gap:5px;font-family:'Space Mono',monospace;font-size:8px;letter-spacing:0.13em;text-transform:uppercase;color:#7A7A7A;text-decoration:none;border:1px solid #1A1A1A;padding:5px 10px;transition:color 0.2s,border-color 0.2s;cursor:pointer;}
        .proj-link:hover{color:#CC3333;border-color:rgba(139,26,26,0.5);}

        /* ══ MOBILE ══ */
        @media(max-width:768px){
          .hide-mob{display:none!important;}
          /* nav */
          nav{padding:0 16px!important;height:48px!important;}
          /* hero */
          #about{padding:56px 20px 40px!important;min-height:auto!important;}
          .stat-grid{grid-template-columns:1fr 1fr!important;}
          .stat-box{padding:14px 12px!important;}
          /* projects */
          #projects{padding:56px 20px!important;}
          .proj-row{grid-template-columns:1fr!important;padding:20px 0!important;gap:8px!important;}
          .proj-bg-num{font-size:64px!important;opacity:0.6;}
          .feat-grid{grid-template-columns:1fr!important;}
          .feat-right{display:none!important;}
          /* stack */
          #stack{padding:56px 20px!important;}
          .stack-grid{grid-template-columns:1fr 1fr!important;}
          /* education */
          #education{padding:56px 20px!important;}
          .edu-row{grid-template-columns:1fr!important;gap:8px!important;padding:18px 0!important;}
          .edu-status{display:none!important;}
          /* about cards */
          .about-section{padding:56px 20px!important;}
          .about-grid{grid-template-columns:1fr!important;}
          /* contact */
          #contact .contact-inner{padding:56px 20px 48px!important;}
          .contact-grid{grid-template-columns:1fr!important;gap:32px!important;}
          .footer-bar{padding:16px 20px 14px!important;}
        }
        @media(max-width:480px){
          .stack-grid{grid-template-columns:1fr!important;}
          h1.bebas{font-size:clamp(52px,14vw,80px)!important;}
        }
      `}</style>

      {!ready && <NeuralIntro onComplete={()=>setReady(true)} />}
      {ready && <Cursor />}

      {visible && (
        <div style={{ background:"#0A0A0A", color:"#E8E3D8", minHeight:"100vh", opacity:1 }}>

          {/* grain */}
          <div style={{ position:"fixed", inset:0, zIndex:100, pointerEvents:"none",
            backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E\")",
            opacity:0.5 }} />

          {/* scanline */}
          <div style={{ position:"fixed", inset:0, zIndex:99, pointerEvents:"none", overflow:"hidden" }}>
            <div style={{ position:"absolute", left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,rgba(139,26,26,0.06),transparent)", animation:"scanline 10s linear infinite" }} />
          </div>

          {/* ── NAV ── */}
          <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, height:52, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 40px", background:"rgba(8,8,8,0.97)", backdropFilter:"blur(16px)", borderBottom:"1px solid #1C1C1C" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#8B1A1A", animation:"pulse-dot 2.5s ease infinite", flexShrink:0 }} />
              <span className="mono" style={{ fontSize:10, letterSpacing:"0.16em", color:"#E8E3D8" }}>J.SINGH</span>
              <span className="hide-mob" style={{ width:1, height:10, background:"#2C2C2C", margin:"0 6px" }} />
              <span className="lbl hide-mob" style={{ fontSize:8, color:"#8A8A8A" }}>AI/ML ENG</span>
            </div>
            <div className="hide-mob" style={{ display:"flex", gap:26 }}>
              {["about","projects","stack","education","contact"].map(s=>(
                <button key={s} className="nav-link" onClick={()=>document.getElementById(s)?.scrollIntoView({behavior:"smooth"})}>{s}</button>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div className="hide-mob" style={{ textAlign:"right" }}>
                <div className="lbl" style={{ fontSize:8, color:"#9A9A9A" }}><Clock /></div>
                <div className="lbl" style={{ fontSize:7, marginTop:2, color:"#4A4A4A" }}>IST · BPL</div>
              </div>
              <a href="/Jiyotirmaan_Singh_Resume.pdf" download="Jiyotirmaan_Singh_Resume.pdf" className="btn-g" style={{ padding:"6px 12px", fontSize:8 }}>↓ CV</a>
              <a href="mailto:singhjiyotirmaan@gmail.com" className="btn-p" style={{ padding:"6px 12px", fontSize:8 }}>HIRE →</a>
            </div>
          </nav>

          {/* ── HERO ── */}
          <section id="about" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"52px 44px 52px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(#0F0F0F 1px,transparent 1px),linear-gradient(90deg,#0F0F0F 1px,transparent 1px)", backgroundSize:"72px 72px", opacity:0.65 }} />
            <div className="bebas hide-mob" style={{ position:"absolute", right:"-1%", top:"5%", fontSize:"clamp(160px,26vw,380px)", color:"transparent", WebkitTextStroke:"1px #111", lineHeight:1, pointerEvents:"none" }}>2025</div>

            <div style={{ maxWidth:1200, margin:"0 auto", width:"100%", position:"relative", zIndex:2 }}>
              <div style={{ display:"flex", gap:8, marginBottom:36, animation:"heroReveal 0.9s 0.1s both", flexWrap:"wrap" }}>
                <div style={{ display:"flex", alignItems:"center", gap:7, padding:"5px 11px", border:"1px solid #2C2C2C" }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:"#8B1A1A", animation:"pulse-dot 2.5s ease infinite" }} />
                  <span className="lbl" style={{ color:"#9A9A9A" }}>SYS_ONLINE</span>
                </div>
                <div style={{ padding:"5px 11px", border:"1px solid #1C1C1C" }}>
                  <span className="lbl" style={{ color:"#6A6A6A" }}>B.TECH AI/ML · SEM 06 · LNCT GROUP</span>
                </div>
              </div>

              <div style={{ animation:"heroReveal 1s 0.2s both" }}>
                <h1 className="bebas" style={{ fontSize:"clamp(60px,12vw,175px)", lineHeight:0.88, letterSpacing:"-0.02em", color:"#E8E3D8" }}>JIYOTIRMAAN</h1>
              </div>
              <div style={{ animation:"heroReveal 1s 0.34s both" }}>
                <h1 className="bebas" style={{ fontSize:"clamp(60px,12vw,175px)", lineHeight:0.88, letterSpacing:"-0.02em", color:"transparent", WebkitTextStroke:"2px #E8E3D8" }}>SINGH</h1>
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:20, marginTop:28, animation:"heroReveal 1s 0.48s both" }}>
                <div style={{ maxWidth:360 }}>
                  <div className="lbl" style={{ marginBottom:11, color:"#8B1A1A" }}>// AI/ML ENGINEER · FULL-STACK DEV · BHOPAL IN</div>
                  <p className="ibm" style={{ fontSize:12.5, color:"#7A7A7A", lineHeight:1.85, fontWeight:300 }}>
                    Building AI systems that actually ship.<br/>
                    Computer vision pipelines, edge models on<br/>
                    Raspberry Pi, full-stack ML end to end.<br/>
                    <span style={{ color:"#CC3333" }}>No demos. Real data. Real edge.</span>
                  </p>
                </div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <a href="#projects" className="btn-p" onClick={e=>{e.preventDefault();document.getElementById("projects")?.scrollIntoView({behavior:"smooth"});}}>VIEW WORK →</a>
                  <a href="mailto:singhjiyotirmaan@gmail.com" className="btn-g">CONTACT</a>
                </div>
              </div>

              {/* Stats */}
              <div className="stat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", marginTop:40, animation:"heroReveal 1s 0.62s both" }}>
                {[
                  {v:"2168",l:"LeetCode",s:"GUARDIAN · TOP 1.07%"},
                  {v:"631",l:"Problems Solved",s:"LC · 358 ACTIVE DAYS"},
                  {v:"172",l:"Max Streak",s:"LEETCODE"},
                  {v:"#7",l:"Samadhan 2.0",s:"NATIONAL FINAL"},
                ].map((s,i)=>(
                  <div key={i} className="stat-box" style={{ borderRight:i<3?"none":undefined, borderLeft:i>0?"1px solid #1A1A1A":undefined }}>
                    <div className="bebas" style={{ fontSize:"clamp(28px,4.5vw,48px)", lineHeight:1, color:"#E8E3D8", letterSpacing:"-0.02em" }}>{s.v}</div>
                    <div className="ibm" style={{ fontSize:10, color:"#6A6A6A", marginTop:4 }}>{s.l}</div>
                    <div className="lbl" style={{ marginTop:2, color:"#4A4A4A", fontSize:7.5 }}>{s.s}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Marquee items={STACK_ITEMS} />

          {/* ── PROJECTS ── */}
          <section id="projects" style={{ padding:"76px 44px", borderTop:"1px solid #111" }}>
            <div style={{ maxWidth:1200, margin:"0 auto" }}>
              <SR>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:48, flexWrap:"wrap", gap:14 }}>
                  <div>
                    <div className="lbl" style={{ marginBottom:12, color:"#7A7A7A" }}>// SELECTED_PROJECTS</div>
                    <h2 className="bebas" style={{ fontSize:"clamp(44px,7vw,96px)", lineHeight:0.9, letterSpacing:"-0.02em" }}>
                      WHAT I <span style={{ color:"#8B1A1A" }}>SHIP.</span>
                    </h2>
                  </div>
                  <p className="ibm hide-mob" style={{ fontSize:11, color:"#5A5A5A", maxWidth:230, lineHeight:1.75 }}>Systems on real hardware. Real data. Real users.</p>
                </div>
              </SR>

              {/* Featured — STRADA */}
              <SR delay={0.05}>
                <div className="feat-grid" style={{ display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:0, border:"1px solid #1C1C1C", marginBottom:2 }}>
                  <div style={{ padding:"36px 32px", borderRight:"1px solid #1C1C1C" }}>
                    <div style={{ display:"flex", gap:7, marginBottom:20 }}>
                      <span className="tag-r">FEATURED</span>
                      <span className="tag-r">ACTIVE</span>
                    </div>
                    <h3 className="bebas" style={{ fontSize:"clamp(44px,6vw,84px)", lineHeight:0.88, letterSpacing:"-0.02em", color:"#E8E3D8", marginBottom:5 }}>STRADA</h3>
                    <div className="lbl" style={{ color:"#CC3333", marginBottom:16, fontSize:7.5 }}>AI TYRE DIAGNOSTIC SYSTEM · 2025</div>
                    <div style={{ width:"32%", height:1, background:"#8B1A1A", marginBottom:18 }} />
                    <p className="ibm" style={{ fontSize:11.5, color:"#7A7A7A", lineHeight:1.85, marginBottom:20 }}>Multi-image wear analysis pipeline. React/Vite frontend → Python/Flask ML microservice. Wear classification, Grad-CAM heatmap overlays — full XAI in under 2s.</p>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
                      {["React","Flask","Grad-CAM","Python","CV"].map(t=><span key={t} className="tag-r">{t}</span>)}
                    </div>
                    <a href="https://new-strada.vercel.app" target="_blank" rel="noopener noreferrer" className="proj-link">VISIT LIVE →</a>
                  </div>
                  <div className="feat-right" style={{ background:"#8B1A1A", padding:"36px 32px", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
                    <div className="bebas" style={{ position:"absolute", right:"-5%", bottom:"-8%", fontSize:"13vw", color:"rgba(0,0,0,0.14)", lineHeight:1, letterSpacing:"-0.04em" }}>01</div>
                    <div>
                      <div className="lbl" style={{ color:"rgba(232,227,216,0.5)", marginBottom:16 }}>PRJ_A1 · BHOPAL-IN</div>
                      <div className="ibm" style={{ fontSize:11, color:"rgba(232,227,216,0.7)", lineHeight:2 }}>
                        STACK: REACT · FLASK · PYTORCH<br/>
                        LATENCY: &lt;2s XAI PIPELINE<br/>
                        DEPLOY: PRODUCTION<br/>
                        HEALTH: 87%
                      </div>
                    </div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                        <div className="lbl" style={{ color:"rgba(232,227,216,0.5)", fontSize:7.5 }}>HEALTH</div>
                        <span className="mono" style={{ fontSize:9, color:"rgba(232,227,216,0.7)" }}>87%</span>
                      </div>
                      <div style={{ height:2, background:"rgba(0,0,0,0.2)", borderRadius:1 }}>
                        <div style={{ width:"87%", height:"100%", background:"rgba(232,227,216,0.65)", borderRadius:1 }} />
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
                      <div className="lbl" style={{ marginBottom:2, color:"#5A5A5A" }}>{p.year}</div>
                      <div className="ibm" style={{ fontSize:9, color:"#4A4A4A" }}>{p.type}</div>
                    </div>
                    <div>
                      <h3 className="bebas" style={{ fontSize:"clamp(22px,2.8vw,40px)", letterSpacing:"-0.02em", color:"#E8E3D8", lineHeight:1 }}>{p.name}</h3>
                      <div className="lbl" style={{ marginTop:3, color:"#CC3333", fontSize:7.5 }}>{p.sub}</div>
                      {/* desc visible on mobile */}
                      <p className="ibm" style={{ fontSize:11, color:"#5A5A5A", lineHeight:1.7, marginTop:6, display:"none" }}>{p.desc}</p>
                    </div>
                    <p className="ibm hide-mob" style={{ fontSize:11, color:"#5A5A5A", lineHeight:1.75 }}>{p.desc}</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:5, alignItems:"flex-end" }}>
                      <span className={p.status==="ARCHIVED"?"tag":"tag-r"}>{p.status}</span>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:4, justifyContent:"flex-end" }}>
                        {p.tags.slice(0,2).map(t=><span key={t} className="tag">{t}</span>)}
                      </div>
                      {p.link&&(
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="proj-link" style={{ marginTop:3 }}>
                          {p.link.includes("github")?"GITHUB →":"LIVE →"}
                        </a>
                      )}
                    </div>
                  </div>
                </SR>
              ))}
              <div style={{ height:1, background:"#1A1A1A" }} />
            </div>
          </section>

          {/* ── STACK ── */}
          <section id="stack" style={{ padding:"76px 44px", borderTop:"1px solid #111" }}>
            <div style={{ maxWidth:1200, margin:"0 auto" }}>
              <SR>
                <div className="lbl" style={{ marginBottom:12, color:"#7A7A7A" }}>// TECH ARSENAL</div>
                <h2 className="bebas" style={{ fontSize:"clamp(44px,7vw,96px)", lineHeight:0.9, letterSpacing:"-0.02em", marginBottom:44 }}>
                  THE <span style={{ color:"#8B1A1A" }}>TOOLKIT.</span>
                </h2>
              </SR>
              <div className="stack-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:"#151515" }}>
                {[
                  {cat:"CV / DEEP LEARNING", items:["YOLOv8","PyTorch","OpenCV","MiDaS","Grad-CAM","MediaPipe","EfficientNet","Roboflow"]},
                  {cat:"FULL-STACK", items:["React (Vite)","Node.js","Express.js","MongoDB","Flask","REST APIs","TailwindCSS","Framer Motion"]},
                  {cat:"LANGUAGES", items:["Python","Java","JavaScript","SQL"]},
                  {cat:"INFRA / TOOLS", items:["Git","Raspberry Pi","Apple MPS","Folium","Ollama","Roboflow","VS Code","MongoDB Atlas"]},
                ].map((cat,ci)=>(
                  <SR key={ci} delay={0.07*ci}>
                    <div className="stack-cell" style={{ height:"100%" }}>
                      <div className="lbl" style={{ color:"#CC3333", marginBottom:20, fontSize:7.5 }}>{cat.cat}</div>
                      {cat.items.map((item,ii)=>(
                        <div key={item} style={{ display:"flex", alignItems:"center", gap:9, padding:"7px 0", borderBottom:ii<cat.items.length-1?"1px solid #0F0F0F":"none" }}>
                          <span style={{ width:3, height:3, background:"#8B1A1A", flexShrink:0 }} />
                          <span className="ibm" style={{ fontSize:11, color:"#8A8A8A" }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </SR>
                ))}
              </div>
            </div>
          </section>

          {/* ── EDUCATION ── */}
          <section id="education" style={{ padding:"76px 44px", borderTop:"1px solid #111" }}>
            <div style={{ maxWidth:1200, margin:"0 auto" }}>
              <SR>
                <div className="lbl" style={{ marginBottom:12, color:"#7A7A7A" }}>// ACADEMIC_RECORD</div>
                <h2 className="bebas" style={{ fontSize:"clamp(44px,7vw,96px)", lineHeight:0.9, letterSpacing:"-0.02em", marginBottom:48 }}>
                  THE <span style={{ color:"#8B1A1A" }}>EDUCATION.</span>
                </h2>
              </SR>
              {[
                {type:"B.TECH",inst:"LNCT Group of Colleges",sub:"B.Tech CSE: AI & ML",date:"2023–2027",note:"CGPA 8.04 · SGPA 9.0",status:"ONGOING",loc:"BHOPAL, M.P."},
                {type:"XII",inst:"Ryan International School",sub:"Senior Secondary Education",date:"2023",note:null,status:"COMPLETED",loc:"BHOPAL, M.P."},
                {type:"X",inst:"Ryan International School",sub:"Secondary Education",date:"2021",note:null,status:"COMPLETED",loc:"BHOPAL, M.P."},
              ].map((e,i)=>(
                <SR key={i} delay={0.08*i}>
                  <div className="edu-row">
                    <div>
                      <div className="lbl" style={{ fontSize:8, marginBottom:2, color:"#6A6A6A" }}>{e.date}</div>
                      <div className="lbl hide-mob" style={{ fontSize:7, color:"#3A3A3A" }}>{e.loc}</div>
                    </div>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:5, flexWrap:"wrap" }}>
                        <span className="tag" style={{ fontSize:7.5 }}>{e.type}</span>
                        <span className="tag-r" style={{ fontSize:7.5 }}>{e.status}</span>
                      </div>
                      <div className="ibm" style={{ fontSize:14, fontWeight:500, color:"#E8E3D8", letterSpacing:"-0.01em" }}>{e.inst}</div>
                      <div className="mono" style={{ fontSize:9, color:"#CC3333", marginTop:3, letterSpacing:"0.07em" }}>{e.sub}</div>
                      {e.note&&<div className="lbl" style={{ marginTop:3, color:"#6A6A6A" }}>{e.note}</div>}
                    </div>
                    <div className="edu-status" style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", border:"1px solid #1C1C1C", alignSelf:"flex-start" }}>
                      <div style={{ width:4, height:4, borderRadius:"50%", background:e.status==="ONGOING"?"#8B1A1A":"#3A3A3A", animation:e.status==="ONGOING"?"pulse-dot 2.5s ease infinite":"none" }} />
                      <span className="lbl" style={{ fontSize:7.5, color:e.status==="ONGOING"?"#CC3333":"#4A4A4A" }}>{e.status}</span>
                    </div>
                  </div>
                </SR>
              ))}
              <div style={{ height:1, background:"#1A1A1A" }} />
            </div>
          </section>

          {/* ── ABOUT CARDS ── */}
          <section className="about-section" style={{ padding:"68px 44px", borderTop:"1px solid #111", background:"#080808" }}>
            <div style={{ maxWidth:1200, margin:"0 auto" }}>
              <div className="about-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"#111" }}>
                {[
                  {icon:"◈",title:"Computer Vision",txt:"YOLOv8 · MiDaS · Grad-CAM. Training on Apple MPS. Edge deploy on Raspberry Pi. Real hardware, real inference.",accent:true},
                  {icon:"⬡",title:"Full-Stack ML",txt:"React → Flask microservices. End-to-end ML product engineering. No hand-wavy prototypes. Ships to production.",accent:false},
                  {icon:"▣",title:"Competitive CP",txt:"LeetCode Guardian · 2168 · Top 1.07% globally. 631+ problems. 172-day max streak. Consistent.",accent:true},
                ].map((c,i)=>(
                  <SR key={i} delay={0.09*i}>
                    <div style={{ background:"#0A0A0A", padding:"30px 22px", position:"relative", height:"100%" }}>
                      {c.accent&&<div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,#8B1A1A,transparent)" }} />}
                      <div style={{ fontSize:17, color:c.accent?"#8B1A1A":"#E8E3D8", marginBottom:12 }}>{c.icon}</div>
                      <div className="ibm" style={{ fontSize:12, fontWeight:500, color:"#E8E3D8", marginBottom:9 }}>{c.title}</div>
                      <div className="ibm" style={{ fontSize:11, color:"#6A6A6A", lineHeight:1.8 }}>{c.txt}</div>
                    </div>
                  </SR>
                ))}
              </div>
            </div>
          </section>

          {/* ── CONTACT ── */}
          <section id="contact" style={{ borderTop:"1px solid #111" }}>
            <div className="contact-inner" style={{ background:"#E8E3D8", padding:"68px 44px 60px" }}>
              <div style={{ maxWidth:1200, margin:"0 auto" }}>
                <SR>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.25em", color:"#888070", marginBottom:16 }}>// OPEN TO WORK</div>
                  <h2 className="bebas" style={{ fontSize:"clamp(48px,9vw,144px)", lineHeight:0.88, letterSpacing:"-0.03em", color:"#0A0A0A", marginBottom:40 }}>
                    BUILD<br/>SOMETHING<br/>REAL.
                  </h2>
                </SR>
                <SR delay={0.1}>
                  <div className="contact-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:52, alignItems:"end" }}>
                    <div>
                      <p className="ibm" style={{ fontSize:13, color:"#5A5040", lineHeight:1.85 }}>
                        Open to ML engineering internships,<br/>full-stack roles, and hard problems.<br/>Building at the edge of possible.
                      </p>
                      <div style={{ marginTop:24 }}>
                        {[{l:"EMAIL",v:"singhjiyotirmaan@gmail.com"},{l:"PHONE",v:"+91 74156 82591"},{l:"LOCATION",v:"BHOPAL, INDIA"}].map(c=>(
                          <div key={c.l} style={{ display:"flex", gap:14, padding:"10px 0", borderTop:"1px solid #D4CEBC", alignItems:"baseline", flexWrap:"wrap" }}>
                            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:8, letterSpacing:"0.2em", color:"#A09880", minWidth:68 }}>{c.l}</span>
                            <span className="mono" style={{ fontSize:9, color:"#0A0A0A", letterSpacing:"0.03em" }}>{c.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:10, alignItems:"flex-start" }}>
                      <a href="mailto:singhjiyotirmaan@gmail.com"
                        style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#0A0A0A", color:"#E8E3D8", fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.17em", textTransform:"uppercase", padding:"14px 28px", textDecoration:"none", transition:"background 0.25s", cursor:"pointer" }}
                        onMouseEnter={e=>e.currentTarget.style.background="#8B1A1A"}
                        onMouseLeave={e=>e.currentTarget.style.background="#0A0A0A"}>
                        EMAIL ME →
                      </a>
                      <a href="/Jiyotirmaan_Singh_Resume.pdf" download="Jiyotirmaan_Singh_Resume.pdf"
                        style={{ display:"inline-flex", alignItems:"center", gap:8, background:"transparent", color:"#0A0A0A", fontFamily:"'Space Mono',monospace", fontSize:9, letterSpacing:"0.17em", textTransform:"uppercase", padding:"13px 28px", textDecoration:"none", border:"1px solid #0A0A0A", transition:"all 0.25s", cursor:"pointer" }}
                        onMouseEnter={e=>{e.currentTarget.style.background="#0A0A0A";e.currentTarget.style.color="#E8E3D8";}}
                        onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#0A0A0A";}}>
                        ↓ DOWNLOAD RESUME
                      </a>
                      <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
                        {[{lbl:"GITHUB",href:"https://github.com/jiyotirmaansingh"},{lbl:"LINKEDIN",href:"https://linkedin.com"}].map(({lbl,href})=>(
                          <a key={lbl} href={href} target="_blank" rel="noopener noreferrer"
                            style={{ display:"inline-flex", alignItems:"center", gap:7, background:"transparent", color:"#0A0A0A", fontFamily:"'Space Mono',monospace", fontSize:8.5, letterSpacing:"0.15em", textTransform:"uppercase", padding:"11px 18px", border:"1px solid #0A0A0A", textDecoration:"none", transition:"border-color 0.25s,color 0.25s", cursor:"pointer" }}
                            onMouseEnter={e=>{e.currentTarget.style.borderColor="#8B1A1A";e.currentTarget.style.color="#8B1A1A";}}
                            onMouseLeave={e=>{e.currentTarget.style.borderColor="#0A0A0A";e.currentTarget.style.color="#0A0A0A";}}>
                            {lbl}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </SR>
              </div>
            </div>

            <div className="footer-bar" style={{ background:"#8B1A1A", padding:"18px 44px 14px", overflow:"hidden" }}>
              <div className="bebas" style={{ fontSize:"clamp(32px,6vw,84px)", lineHeight:1, letterSpacing:"-0.02em", color:"#0A0A0A", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                JIYOTIRMAAN SINGH
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:18, borderTop:"1px solid rgba(0,0,0,0.2)", marginTop:11, paddingTop:11 }}>
                {["AI/ML ENGINEER · FULL-STACK DEV","LNCT GROUP · BHOPAL","OPEN TO INTERNSHIP","REACT + VITE · 2025"].map((t,i)=>(
                  <div key={i} className="lbl" style={{ color:"rgba(0,0,0,0.38)", fontSize:7.5 }}>{t}</div>
                ))}
              </div>
            </div>
          </section>

        </div>
      )}
    </>
  );
}