if (window.top !== window.self) { try { window.top.location = window.self.location; } catch (e) { document.documentElement.style.display = 'none'; } }
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  /* nav border on scroll */
  var nav = document.getElementById('nav');
  addEventListener('scroll', function(){ nav.classList.toggle('scrolled', scrollY > 10); }, {passive:true});

  /* reveal */
  var rev = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }); }, {threshold:.12});
    rev.forEach(function(el){ var r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add('in'); else io.observe(el); });
  } else rev.forEach(function(el){ el.classList.add('in'); });

  /* typewriter */
  var words = ['React portals','Django REST APIs','n8n automations','RAG pipelines','multi-agent systems','CI/CD with Docker'];
  var tEl = document.getElementById('typer'), wi = 0, ci = words[0].length, del = true;
  if (!reduce) (function tick(){
    var w = words[wi];
    if (del) { ci--; if (ci <= 0) { del = false; wi = (wi + 1) % words.length; } }
    else { ci++; if (ci >= words[wi].length) { del = true; tEl.textContent = words[wi]; return setTimeout(tick, 1800); } }
    tEl.textContent = words[wi].slice(0, Math.max(ci,0)) || '​';
    setTimeout(tick, del ? 35 : 70);
  })();

  /* tabs */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  function select(t, focus){
    tabs.forEach(function(x){
      var on = x === t, p = document.getElementById(x.getAttribute('aria-controls'));
      x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1;
      p.hidden = !on; p.classList.toggle('show', on);
    });
    if (focus) t.focus();
  }
  tabs.forEach(function(t, i){
    t.addEventListener('click', function(){ select(t); });
    t.addEventListener('keydown', function(e){
      var d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
      if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); }
    });
  });

  /* card spotlight */
  document.querySelectorAll('.card').forEach(function(c){
    c.addEventListener('pointermove', function(e){ var r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
  });

  /* skills explorer */
  var P = {
    oms:['B2B trading platform','Elvinci · multi-role portals'], auto:['Workflow automation','Elvinci · n8n'],
    kal:['Kalanit Rehab','Drop Solutions · medical app'], den:['Denaio','Alfabolt · fintech'], soc:['Social apps','Alfabolt · real-time chat'],
    nuc:['Nuclear knowledge assistant','AI · multi-agent RAG'], med:['AI medical writer','AI · agent pipeline'],
    camp:['AI campaign portal','AI · full stack + vision'], uk:['UK property pipeline','Data · scraping']
  };
  var G = [
    ['Frontend', {'React':['oms','den','soc'],'TypeScript':['oms'],'React Native':['kal'],'Material UI':['kal','oms'],'Storybook':['kal'],'WebSockets':['soc'],'Streamlit':['nuc','med']}],
    ['Backend', {'Django REST':['oms'],'Node.js':['kal','den'],'Python':['oms','nuc','med','camp','uk'],'FastAPI':['med'],'Flask':['camp'],'PostgreSQL':['oms','auto','camp','uk'],'Celery':['oms','auto']}],
    ['AI', {'LangGraph':['nuc'],'LangChain':['med'],'RAG':['nuc','med'],'Vector DBs':['nuc','med'],'LLM APIs':['nuc','med','camp'],'TensorFlow.js':['kal'],'MediaPipe':['kal']}],
    ['DevOps & automation', {'Docker':['oms'],'GitHub Actions':['oms'],'n8n':['auto'],'Jira API':['auto'],'Stripe':['den','camp'],'OAuth / JWT':['camp','uk']}]
  ];
  var groups = document.getElementById('groups'), title = document.getElementById('used-title'), list = document.getElementById('used-list'), btns = [];
  function show(name, ids, btn){
    btns.forEach(function(b){ b.setAttribute('aria-pressed', b === btn); });
    title.textContent = name; list.textContent = '';
    ids.forEach(function(id, i){ var li = document.createElement('li'); li.style.setProperty('--i', i); var sm = document.createElement('small'); sm.textContent = P[id][1]; li.textContent = P[id][0]; li.appendChild(sm); list.appendChild(li); });
  }
  G.forEach(function(g){
    var wrap = document.createElement('div'), h = document.createElement('h3'), sk = document.createElement('div');
    h.textContent = g[0]; sk.className = 'sk'; wrap.appendChild(h); wrap.appendChild(sk);
    Object.keys(g[1]).forEach(function(k){
      var b = document.createElement('button'); b.type = 'button'; b.textContent = k; b.setAttribute('aria-pressed','false');
      b.addEventListener('click', function(){ show(k, g[1][k], b); }); sk.appendChild(b); btns.push(b);
    });
    groups.appendChild(wrap);
  });
  show('React', G[0][1]['React'], btns[0]);

  /* photo lightbox */
  var dlg = document.getElementById('photo-dlg'), open = document.getElementById('photo-open');
  if (dlg && open && dlg.showModal) {
    open.addEventListener('click', function(){ dlg.showModal(); });
    dlg.addEventListener('click', function(e){ if (e.target === dlg || e.target.closest('.dlg-close')) dlg.close(); });
  }

  /* copy email */
  document.getElementById('copy').addEventListener('click', function(){
    var btn = this, el = document.getElementById('email');
    function done(){ btn.textContent = 'Copied'; setTimeout(function(){ btn.textContent = 'Copy email'; }, 1600); }
    function fallback(){ var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = 'Selected, press Ctrl+C'; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(el.textContent).then(done, fallback); else fallback();
  });

  /* live system map */
  var cv = document.getElementById('map'), ctx = cv.getContext('2d');
  var N = [
    {id:'buyer', l:'Buyer portal', x:.0, y:.12, c:'a'}, {id:'sales', l:'Sales portal', x:.0, y:.42, c:'a'}, {id:'wh', l:'Warehouse', x:.0, y:.72, c:'a'},
    {id:'api', l:'Django API', x:.5, y:.42, c:'b'},
    {id:'db', l:'PostgreSQL', x:1, y:.12, c:'c'}, {id:'ai', l:'LLM agent', x:1, y:.42, c:'c'}, {id:'n8n', l:'n8n', x:1, y:.72, c:'c'},
    {id:'jira', l:'Jira · Teams', x:.5, y:.95, c:'c'}
  ];
  var E = [['buyer','api'],['sales','api'],['wh','api'],['api','db'],['api','ai'],['api','n8n'],['n8n','jira'],['n8n','db']];
  var byId = {}; N.forEach(function(n){ byId[n.id] = n; n.glow = 0; });
  var W, H, dpr, mouse = {x:-999, y:-999}, packets = [];
  function css(v){ return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
  var col = {line:css('--line'), ink:css('--ink'), muted:css('--muted'), a:css('--accent'), b:css('--accent2'), panel:css('--panel')};
  function size(){
    var r = cv.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    var fs = W < 420 ? 11 : 12.5; ctx.font = '500 ' + fs + 'px "IBM Plex Mono", monospace';
    N.forEach(function(n){ n.w = ctx.measureText(n.l).width + 22; n.h = fs + 16; n.fs = fs; });
    var padX = 14, padTop = 22, padBot = 40;
    N.forEach(function(n){
      var minX = padX + n.w/2, maxX = W - padX - n.w/2;
      n.px = minX + n.x * (maxX - minX); n.py = padTop + n.h/2 + n.y * (H - padTop - padBot - n.h);
    });
  }
  function spawn(){
    var e = E[Math.floor(Math.random()*E.length)], rev = Math.random() < .4;
    packets.push({a: byId[rev ? e[1] : e[0]], b: byId[rev ? e[0] : e[1]], t:0, s:.006 + Math.random()*.008, c: Math.random() < .5 ? col.a : col.b});
  }
  function rr(x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
  function draw(){
    ctx.clearRect(0,0,W,H);
    var hover = null;
    N.forEach(function(n){ if (Math.abs(mouse.x-n.px) < n.w/2+6 && Math.abs(mouse.y-n.py) < n.h/2+6) hover = n; });
    E.forEach(function(e){
      var a = byId[e[0]], b = byId[e[1]], hot = hover && (hover === a || hover === b);
      ctx.strokeStyle = hot ? col.a : col.line; ctx.lineWidth = hot ? 1.6 : 1.2;
      ctx.setLineDash(hot ? [] : [4,5]); ctx.beginPath(); ctx.moveTo(a.px,a.py); ctx.lineTo(b.px,b.py); ctx.stroke();
    });
    ctx.setLineDash([]);
    packets.forEach(function(p){
      var x = p.a.px + (p.b.px-p.a.px)*p.t, y = p.a.py + (p.b.py-p.a.py)*p.t;
      ctx.shadowColor = p.c; ctx.shadowBlur = 12; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(x,y,3.2,0,6.283); ctx.fill(); ctx.shadowBlur = 0;
    });
    N.forEach(function(n){
      var on = hover && (hover === n || E.some(function(e){ return (e[0]===hover.id&&e[1]===n.id)||(e[1]===hover.id&&e[0]===n.id); }));
      var g = Math.max(n.glow, on ? .8 : 0);
      var x = n.px - n.w/2, y = n.py - n.h/2;
      if (g > .02) { ctx.shadowColor = col.a; ctx.shadowBlur = 20*g; }
      ctx.fillStyle = col.panel; rr(x,y,n.w,n.h,8); ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = g > .05 ? col.a : (n.c === 'b' ? col.b : col.line); ctx.lineWidth = 1.2; rr(x,y,n.w,n.h,8); ctx.stroke();
      ctx.fillStyle = g > .05 || n.c === 'b' ? col.ink : col.muted; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(n.l, n.px, n.py + .5);
    });
  }
  function step(){
    if (Math.random() < .06 && packets.length < 14) spawn();
    packets = packets.filter(function(p){ p.t += p.s; if (p.t >= 1) { p.b.glow = 1; return false; } return true; });
    N.forEach(function(n){ n.glow *= .94; });
    draw(); requestAnimationFrame(step);
  }
  cv.addEventListener('pointermove', function(e){ var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  cv.addEventListener('pointerleave', function(){ mouse.x = mouse.y = -999; });
  function init(){ size(); if (reduce) { for (var i=0;i<6;i++){ spawn(); packets[i].t = Math.random(); } draw(); } else step(); }
  if ('ResizeObserver' in window) new ResizeObserver(function(){ size(); if (reduce) draw(); }).observe(cv);
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(init);
})();
