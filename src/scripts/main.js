/* ── Cursor ────────────────────────── */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursor.style.left=mx+'px';cursor.style.top=my+'px'});
function animRing(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing)}
animRing();
document.querySelectorAll('a,button,.project-card,.blog-card,.about-card,.skill-cat').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));
});

/* ── Particles ─────────────────────── */
const canvas=document.getElementById('particles');
const ctx=canvas.getContext('2d');
let particles=[];
function resize(){canvas.width=innerWidth;canvas.height=innerHeight}
resize();
window.addEventListener('resize',resize);
class Particle{
  constructor(){this.reset()}
  reset(){
    this.x=Math.random()*canvas.width;
    this.y=Math.random()*canvas.height;
    this.vx=(Math.random()-.5)*.3;
    this.vy=(Math.random()-.5)*.3-0.1;
    this.size=Math.random()*2+.5;
    this.alpha=Math.random()*.5+.1;
    this.color=Math.random()>.5?'130,110,255':'255,110,199';
    this.life=Math.random()*300+100;
    this.maxLife=this.life;
  }
  update(){
    this.x+=this.vx;this.y+=this.vy;
    this.life--;
    if(this.life<=0||this.y<-10)this.reset();
  }
  draw(){
    const progress=this.life/this.maxLife;
    ctx.save();
    ctx.globalAlpha=this.alpha*progress;
    ctx.fillStyle=`rgb(${this.color})`;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}
for(let i=0;i<80;i++)particles.push(new Particle());
function animParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{p.update();p.draw()});
  // Draw connections
  const isDark=document.documentElement.getAttribute('data-theme')==='dark';
  particles.forEach((p,i)=>{
    for(let j=i+1;j<particles.length;j++){
      const d=Math.hypot(p.x-particles[j].x,p.y-particles[j].y);
      if(d<100){
        ctx.save();
        ctx.globalAlpha=(1-d/100)*.06;
        ctx.strokeStyle=isDark?'rgba(130,110,255,1)':'rgba(100,80,220,1)';
        ctx.lineWidth=.5;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(particles[j].x,particles[j].y);ctx.stroke();
        ctx.restore();
      }
    }
  });
  requestAnimationFrame(animParticles);
}
animParticles();

/* ── Theme Toggle ──────────────────── */
const themeBtn=document.getElementById('themeBtn');
const html=document.documentElement;
function setTheme(t){
  html.setAttribute('data-theme',t);
  themeBtn.textContent=t==='dark'?'🌙':'☀️';
  localStorage.setItem('theme',t);
}
const saved=localStorage.getItem('theme')||'dark';
setTheme(saved);
themeBtn.addEventListener('click',()=>setTheme(html.getAttribute('data-theme')==='dark'?'light':'dark'));

/* ── Hamburger ─────────────────────── */
const ham=document.getElementById('hamburger');
const mob=document.getElementById('mobileMenu');
if (ham && mob) {
  ham.addEventListener('click',()=>mob.classList.toggle('open'));
}
window.closeMobile = function() {
  const mob = document.getElementById('mobileMenu');
  if (mob) mob.classList.remove('open');
}

/* ── Scroll Reveal ─────────────────── */
const obs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible')}});
},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>obs.observe(el));

/* ── Skill Bars ────────────────────── */
const barObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.skill-fill').forEach(b=>{
        b.style.width=b.getAttribute('data-w');
      });
    }
  });
},{threshold:.3});
document.querySelectorAll('.skill-cat').forEach(c=>barObs.observe(c));

/* ── Contact Form ──────────────────── */
const form=document.getElementById('contactForm');
const msg=document.getElementById('formMsg');
if (form) {
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const btn=form.querySelector('.form-submit');
    btn.textContent='Sending...';
    btn.disabled=true;
    try{
      const fd=new FormData(form);
      const res=await fetch('https://api.web3forms.com/submit',{method:'POST',body:fd});
      const data=await res.json();
      if(data.success){
        msg.textContent='✅ Message sent! I\'ll get back to you soon.';
        msg.style.color='var(--accent3)';
        form.reset();
      } else {
        msg.textContent='❌ Error: ' + (data.message || 'Something went wrong.');
        msg.style.color='#ff6e6e';
      }
    }catch{
      msg.textContent='❌ Network error. Please try again.';
      msg.style.color='#ff6e6e';
    }
    msg.classList.add('show');
    btn.textContent='Send Message';
    btn.disabled=false;
    setTimeout(()=>msg.classList.remove('show'),6000);
  });
}

/* ── Nav Active on Scroll ──────────── */
const sections=document.querySelectorAll('section[id]');
window.addEventListener('scroll',()=>{
  const y=window.scrollY+100;
  sections.forEach(s=>{
    const top=s.offsetTop,h=s.offsetHeight;
    if(y>=top&&y<top+h){
      document.querySelectorAll('.nav-links a').forEach(a=>{
        a.style.color=a.getAttribute('href')==='#'+s.id?'var(--text)':'';
      });
    }
  });
},{passive:true});

/* ── Stagger Reveal Delays ─────────── */
document.querySelectorAll('.skills-grid .skill-cat').forEach((c,i)=>c.style.transitionDelay=i*.08+'s');
document.querySelectorAll('.blog-grid .blog-card').forEach((c,i)=>c.style.transitionDelay=i*.1+'s');
document.querySelectorAll('.projects-grid .project-card').forEach((c,i)=>c.style.transitionDelay=i*.1+'s');
