const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

window.addEventListener("load", () => {
  setTimeout(() => $("#loader")?.classList.add("hide"), 900);
  setTimeout(() => { const l=$("#loader"); if(l) l.style.display="none"; }, 1500);
});

const nav = $(".nav");
window.addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 40));

const menu = $(".menu-toggle"), links = $(".nav-links");
menu?.addEventListener("click", () => {
  const open = !links.classList.contains("open");
  links.classList.toggle("open", open);
  menu.classList.toggle("open", open);
  menu.setAttribute("aria-expanded", open);
  document.body.classList.toggle("menu-open", open);
});
$$(".nav-links a").forEach(a => a.addEventListener("click", () => {
  links.classList.remove("open"); menu.classList.remove("open"); document.body.classList.remove("menu-open");
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add("visible"); revealObserver.unobserve(e.target); }});
},{threshold:.12});
$$(".reveal").forEach(el => revealObserver.observe(el));

const cursorDot = $(".cursor-dot"), cursorRing = $(".cursor-ring");
if (matchMedia("(pointer:fine)").matches) {
  let mx=0,my=0,rx=0,ry=0;
  addEventListener("mousemove", e => { mx=e.clientX; my=e.clientY; cursorDot.style.left=mx+"px"; cursorDot.style.top=my+"px"; });
  function cursorLoop(){ rx+=(mx-rx)*.16; ry+=(my-ry)*.16; cursorRing.style.left=rx+"px"; cursorRing.style.top=ry+"px"; requestAnimationFrame(cursorLoop); }
  cursorLoop();
  $$("a,button,.project-card,.art-card").forEach(el=>{
    el.addEventListener("mouseenter",()=>cursorRing.classList.add("hover"));
    el.addEventListener("mouseleave",()=>cursorRing.classList.remove("hover"));
  });
}

const canvas=$("#heroCanvas"), ctx=canvas?.getContext("2d");
let particles=[];
function resizeCanvas(){
  if(!canvas) return;
  canvas.width=innerWidth*devicePixelRatio; canvas.height=innerHeight*devicePixelRatio;
  canvas.style.width=innerWidth+"px"; canvas.style.height=innerHeight+"px"; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  particles=Array.from({length:Math.min(85,Math.floor(innerWidth/14))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5+.3,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25}));
}
function drawParticles(){
  if(!ctx) return;
  ctx.clearRect(0,0,innerWidth,innerHeight);
  particles.forEach((p,i)=>{
    p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=innerWidth;if(p.x>innerWidth)p.x=0;if(p.y<0)p.y=innerHeight;if(p.y>innerHeight)p.y=0;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle="rgba(199,182,255,.6)";ctx.fill();
    for(let j=i+1;j<particles.length;j++){const q=particles[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy);if(d<120){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(157,124,255,${(1-d/120)*.12})`;ctx.stroke();}}
  });
  requestAnimationFrame(drawParticles);
}
resizeCanvas(); addEventListener("resize",resizeCanvas); drawParticles();

$$(".skill-node").forEach(node=>{
  node.addEventListener("click",()=>{
    $$(".skill-node").forEach(n=>n.classList.remove("selected"));
    node.classList.add("selected");
    $("#skillInfo").textContent=node.dataset.info;
  });
});

const communityInfo={
 toastmasters:["RESONANCE TOASTMASTERS","Secretary · Vice President — Education","Public speaking, leadership, communication and confidence."],
 face:["FACE ANCHORING CLUB","Anchoring · Stage Presence","Building confidence through hosting, presentation and audience engagement."],
 oscode:["OS CODE","Coding · Technology · Community","Exposure to coding, collaboration and the student developer ecosystem."],
 under25:["UNDER 25","Community · Exposure · Ideas","A youth community experience that opened doors to new ideas, people and opportunities."],
 arts:["ARTS & CRAFTS CLUB","Creativity · Design · Expression","A creative space for hands-on art, craft, visual expression and imagination."]
};
$$(".community-node").forEach(node=>{
  const show=()=>{
    $$(".community-node").forEach(n=>n.classList.remove("active"));node.classList.add("active");
    const d=communityInfo[node.dataset.community];
    $("#communityDetail").innerHTML=`<span>${d[0]}</span><h3>${d[1]}</h3><p>${d[2]}</p>`;
  };
  node.addEventListener("mouseenter",show);node.addEventListener("click",show);
});

$$(".tilt").forEach(card=>{
  card.addEventListener("mousemove",e=>{
    if(!matchMedia("(pointer:fine)").matches)return;
    const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`rotateX(${-y*5}deg) rotateY(${x*5}deg)`;
  });
  card.addEventListener("mouseleave",()=>card.style.transform="");
});

$$(".magnetic").forEach(el=>{
  el.addEventListener("mousemove",e=>{
    if(!matchMedia("(pointer:fine)").matches)return;
    const r=el.getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2);
    el.style.transform=`translate(${x*.12}px,${y*.12}px)`;
  });
  el.addEventListener("mouseleave",()=>el.style.transform="");
});

let konami="";
addEventListener("keydown",e=>{
  konami=(konami+e.key.toLowerCase()).slice(-5);
  if(konami==="sahan") $("#easterEgg").classList.add("show");
});
$(".closeEgg")?.addEventListener("click",()=>$("#easterEgg").classList.remove("show"));
$("#closeEgg")?.addEventListener("click",()=>$("#easterEgg").classList.remove("show"));
document.addEventListener("keydown",e=>{if(e.key==="Escape")$("#easterEgg").classList.remove("show")});
