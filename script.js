/* ============================================================
   EASY VOTING · script.js — multi-páginas, protegido
   ✏️ = pontos onde VOCÊ cola seus conteúdos
   ============================================================ */

const REDUZIDO = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ✏️ 2) GRAVAÇÕES */
const GRAVACOES = [
  { titulo:"AGO — Demonstrações financeiras e destinação do resultado", condominio:"Alvorada S.A.", data:"12/03/2026", duracao:"1:24:10", tag:"AGO", tipo:"arquivo", arquivo:"videos/Bradespar.mp4", thumb:"thumbnails/bradespar-capa.jpg", inicio:0, fim:90, seed:"assembleia-ago-contas" },
  { titulo:"AGE — Reforma do estatuto social", condominio:"Torre Norte Capital", data:"28/02/2026", duracao:"58:32", tag:"AGE", tipo:"youtube", id:"COLE_O_ID_AQUI", seed:"assembleia-age-estatuto" },
  { titulo:"AGO/AGE — Eleição dos Conselhos de Administração e Fiscal", condominio:"Vista Verde Energia S.A.", data:"10/02/2026", duracao:"1:05:47", tag:"AGO/AGE", tipo:"youtube", id:"COLE_O_ID_AQUI", seed:"assembleia-conselhos" },
  { titulo:"AGO — Contas dos administradores e parecer dos auditores", condominio:"Vila Romana Têxtil S.A.", data:"22/01/2026", duracao:"1:12:03", tag:"AGO", tipo:"youtube", id:"COLE_O_ID_AQUI", seed:"assembleia-auditores" },
  { titulo:"AGE — Grupamento de ações e ratificação de atos", condominio:"Jardim das Palmeiras Agro S.A.", data:"15/01/2026", duracao:"41:18", tag:"AGE", tipo:"youtube", id:"COLE_O_ID_AQUI", seed:"assembleia-grupamento" },
  { titulo:"AGO — Orçamento de capital e eleição do Conselho Fiscal", condominio:"Horizonte Alimentos S.A.", data:"08/12/2025", duracao:"1:31:26", tag:"AGO", tipo:"youtube", id:"COLE_O_ID_AQUI", seed:"assembleia-orcamento" }
];

/* ✏️ 3) EMPRESAS */
const EMPRESAS = [
  { nome:"Eternit S.A.", tag:"Cia. Aberta", logo:"imagens/eternit.png" },
  { nome:"Itaúsa S.A.", tag:"Cia. Aberta", logo:"imagens/itausa.png" },
  { nome:"Bradespar S.A.", tag:"Cia. Aberta", logo:"imagens/bradespar.png" },
  { nome:"Allos S.A.", tag:"Cia. Aberta", logo:"imagens/allos.png" },
  { nome:"Banco Bradesco S.A.", tag:"Cia. Aberta", logo:"imagens/bradesco.png" },
  { nome:"Itau Unibanco Holding", tag:"Cia. Aberta", logo:"imagens/itau.png" },
  { nome:"Simpar", tag:"Cia. Fechada", logo:"imagens/simpar.png" },
  { nome:"Dexco", tag:"Cia. Fechada", logo:"imagens/dexco.png" },
  { nome:"movida", tag:"Cia. Aberta", logo:"imagens/movida.png" },
  { nome:"mcio", tag:"Cia. Aberta", logo:"imagens/mcio.png" },
  { nome:"automob", tag:"Cia. Aberta", logo:"imagens/automob.png" },
  { nome:"Vamos", tag:"Cia. Aberta", logo:"imagens/vamos.png" },
  { nome:"Trisul", tag:"Holding", logo:"imagens/trisul.png" },
  { nome:"Jsl S.A", tag:"Cia. Aberta", logo:"imagens/jsl.png" },
  { nome:"Sanepar", tag:"Cia. Aberta", logo:"imagens/sanepar.png" },
  { nome:"Magazine Luiza", tag:"Cia. Aberta", logo:"imagens/magalu.png" }
];

/* ✏️ 4) DEPOIMENTOS (rotação editorial) */
const DEPOIMENTOS = [
  { t:"O BVD foi incluído no CICORP e a consolidação dos votos saiu automática, com rastreabilidade total. Zero retrabalho.", a:"Mariana Duarte", r:"Head de RI · Magazine Luiza S.A." },
  { t:"Advogados sêniores conduziram do edital à eleição dos Conselhos. Nunca vi uma assembleia tão tranquila.", a:"Carlos Menezes", r:"Diretor Jurídico · Grupo Alvorada S.A." },
  { t:"As auditorias recorrentes de instituições financeiras deram ao compliance a segurança que exigíamos.", a:"Ana Paula Freitas", r:"CCO · Prisma Asset" },
  { t:"Relatórios claros de status e quórum prévio elevaram o nível da nossa governança.", a:"João Carlos Lima", r:"CFO · Torre Norte Capital" }
];

/* ================= LOGOS (grade) ================= */
function buildLogos(){
  const g = document.getElementById("logosGrid");
  if (!g) return;
  g.innerHTML = EMPRESAS.map(e => `
    <div class="logo-cell" title="${e.nome}">
      ${e.logo ? `<img class="logo-img" src="${e.logo}" alt="${e.nome}">` : `<span class="logo-word">${e.nome}</span>`}
    </div>`).join("");
}

/* ================= GRAVAÇÕES ================= */
function buildGrid(){
  const grid = document.getElementById("vgrid");
  if (!grid) return;
  grid.innerHTML = GRAVACOES.map((v,i) => {
    const thumbSrc = v.thumb || `https://picsum.photos/seed/${v.seed}/640/360`;
    return `
      <article class="vcard reveal" data-tag="${v.tag}">
        <button class="vthumb" data-i="${i}" aria-label="Reproduzir: ${v.titulo}">
          <img loading="lazy" src="${thumbSrc}" alt="Capa da gravação: ${v.titulo}">
          <span class="vplay" aria-hidden="true">▶</span>
          <span class="vdur mono">${v.duracao}</span>
        </button>
        <div class="vinfo">
          <span class="vtag mono">${v.tag}</span>
          <h3>${v.titulo}</h3>
          <p class="vmeta mono">${v.condominio} · ${v.data}</p>
        </div>
      </article>`;
  }).join("");

  grid.addEventListener("click", e => {
    const b = e.target.closest(".vthumb");
    if (b) abrirVideo(GRAVACOES[+b.dataset.i]);
  });
}

function buildFiltros(){
  const box = document.getElementById("filtros");
  if (!box) return;
  const tags = ["Todas", ...new Set(GRAVACOES.map(v => v.tag))];
  box.innerHTML = tags.map((t,i) =>
    `<button class="chip ${i===0?"ativo":""}" data-tag="${t}">${t}</button>`).join("");
  box.addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    box.querySelectorAll(".chip").forEach(c => c.classList.toggle("ativo", c === chip));
    document.querySelectorAll(".vcard").forEach(card => {
      const mostra = chip.dataset.tag === "Todas" || card.dataset.tag === chip.dataset.tag;
      card.hidden = !mostra;
      if (mostra && !REDUZIDO){ card.classList.remove("entrar"); void card.offsetWidth; card.classList.add("entrar"); }
    });
  });
}

/* ================= LIGHTBOX ================= */
const lb = document.getElementById("lightbox");
const lbMedia = document.getElementById("lbMedia");
const lbClose = document.getElementById("lbClose");

function ehPlaceholder(v){ return v.tipo === "youtube" && /COLE/i.test(v.id || ""); }

function abrirVideo(v){
  if (!lb || !lbMedia) return;

  if (v.tipo === "youtube" && !ehPlaceholder(v)){
    let url = `https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`;
    if (v.inicio != null) url += `&start=${v.inicio}`;
    if (v.fim    != null) url += `&end=${v.fim}`;
    lbMedia.innerHTML = `<iframe src="${url}" title="${v.titulo}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;

  } else if (v.tipo === "arquivo"){
    lbMedia.innerHTML = `<video src="${v.arquivo}" controls autoplay></video>`;
    const vid = lbMedia.querySelector("video");
    if (vid){
      if (v.inicio != null){
        vid.addEventListener("loadedmetadata", () => { vid.currentTime = v.inicio; });
      }
      if (v.fim != null){
        vid.addEventListener("timeupdate", () => {
          if (vid.currentTime >= v.fim) vid.pause();
        });
      }
    }

  } else {
    lbMedia.innerHTML = `<div class="lb-placeholder"><div><span>▶</span>
      <p>Cole o link deste vídeo na lista <code>GRAVACOES</code> do <code>script.js</code>.</p></div></div>`;
  }

  document.getElementById("lbTitulo").textContent = v.titulo;
  document.getElementById("lbMeta").textContent = v.meta || `${v.condominio || ""} · ${v.tag || ""}`.replace(/^ · /,"");
  lb.classList.add("aberto");
  lb.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
  if (lbClose) lbClose.focus();
}

function fecharVideo(){
  if (!lb || !lbMedia) return;
  lb.classList.remove("aberto");
  lb.setAttribute("aria-hidden","true");
  lbMedia.innerHTML = "";
  document.body.style.overflow = "";
}
if (lbClose) lbClose.addEventListener("click", fecharVideo);
if (lb) lb.addEventListener("click", e => { if (e.target === lb) fecharVideo(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") fecharVideo(); });

/* ============================================================
   PLAYER DE ÁUDIO DA APRESENTAÇÃO (página plataforma)
   - Toca automaticamente COM SOM ao abrir (se o navegador deixar)
   - Se o navegador bloquear, o 1º clique/toque/tecla na página ativa
   - Botões −10s / +10s e clique na barra para navegar
   ============================================================ */
(function initAudioApresentacao(){
  const audio    = document.getElementById("audioPlayer");
  const frame    = document.getElementById("audioApresentacao");
  if (!audio || !frame) return;

  const playBtn  = document.getElementById("audioPlayBtn");
  const muteBtn  = document.getElementById("audioMuteBtn");
  const seekBar  = document.getElementById("audioSeek");
  const fill     = document.getElementById("audioProgress");
  const curEl    = document.getElementById("audioCurrent");
  const durEl    = document.getElementById("audioDuration");
  const statusEl = document.getElementById("audioStatus");
  const backBtn  = document.getElementById("avBack");
  const fwdBtn   = document.getElementById("avFwd");

  const fmt = s => (!isFinite(s) || isNaN(s)) ? "0:00"
    : Math.floor(s/60) + ":" + String(Math.floor(s%60)).padStart(2,"0");

  function paintState(){
    const tocando = !audio.paused && !audio.ended;
    frame.classList.toggle("playing", tocando);
    playBtn.querySelector(".icon-play").style.display  = tocando ? "none"  : "block";
    playBtn.querySelector(".icon-pause").style.display = tocando ? "block" : "none";
    playBtn.setAttribute("aria-label", tocando ? "Pausar áudio" : "Reproduzir áudio");
    if (tocando){
      statusEl.textContent = audio.muted ? "Tocando no mudo" : "Tocando…";
    } else {
      statusEl.textContent = audio.ended ? "Fim — ▶ para ouvir de novo" : "Pausado";
    }
  }
  function paintMute(){
    muteBtn.textContent = audio.muted ? "🔇 Ativar som" : "🔊 Silenciar";
  }

  audio.addEventListener("loadedmetadata", () => { durEl.textContent = fmt(audio.duration); });
  audio.addEventListener("timeupdate", () => {
    curEl.textContent = fmt(audio.currentTime);
    if (audio.duration) fill.style.width = (audio.currentTime / audio.duration * 100) + "%";
  });
  audio.addEventListener("play",  paintState);
  audio.addEventListener("pause", paintState);
  audio.addEventListener("ended", paintState);
  audio.addEventListener("error", () => {
    statusEl.textContent = "⚠ Áudio não carregou — confira o caminho do .mp3";
  });

  /* play / pause */
  playBtn.addEventListener("click", () => {
    if (audio.paused){
      if (audio.ended) audio.currentTime = 0;
      audio.play().catch(()=>{});
    } else {
      audio.pause();
    }
  });

  /* silenciar / ativar som */
  muteBtn.addEventListener("click", () => { audio.muted = !audio.muted; paintMute(); paintState(); });

  /* ⏪ voltar / avançar 10 segundos */
  backBtn.addEventListener("click", () => { audio.currentTime = Math.max(0, audio.currentTime - 10); });
  fwdBtn .addEventListener("click", () => { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10); });

  /* 🖱️ clicar na barra pula para qualquer ponto (inclusive início) */
  seekBar.addEventListener("click", e => {
    const r = seekBar.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    if (audio.duration) audio.currentTime = pct * audio.duration;
  });

  /* ---- AUTOPLAY COM SOM ---- */
  function liberarSom(){
    audio.muted = false; paintMute();
    audio.play().then(paintState).catch(()=>{});
    document.removeEventListener("click",    liberarSom, true);
    document.removeEventListener("keydown",  liberarSom);
    document.removeEventListener("touchend", liberarSom);
  }

  audio.muted = false; /* começa SEM estar no mudo */
  audio.play().then(paintState).catch(() => {
    /* navegador bloqueou autoplay: 1ª interação na página liga com som */
    statusEl.textContent = "▶ Clique em qualquer lugar para ouvir com som";
    document.addEventListener("click",    liberarSom, true);
    document.addEventListener("keydown",  liberarSom);
    document.addEventListener("touchend", liberarSom);
  });
})();

/* ================= ROTAÇÃO DE DEPOIMENTOS ================= */
let qi = 0, qTimer = null;
const qBox = document.getElementById("quoteBox");
function pintaQuote(){
  const d = DEPOIMENTOS[qi];
  document.getElementById("quoteText").textContent = d.t;
  document.getElementById("quoteAuthor").innerHTML = `<strong>${d.a}</strong> &nbsp;·&nbsp; ${d.r}`;
  document.getElementById("qCount").textContent = `${qi+1} / ${DEPOIMENTOS.length}`;
}
function trocaQuote(n){
  qi = (n + DEPOIMENTOS.length) % DEPOIMENTOS.length;
  qBox.classList.add("troca");
  setTimeout(() => { pintaQuote(); qBox.classList.remove("troca"); }, 260);
}
if (qBox){
  pintaQuote();
  document.getElementById("qPrev").addEventListener("click", () => trocaQuote(qi-1));
  document.getElementById("qNext").addEventListener("click", () => trocaQuote(qi+1));
  if (!REDUZIDO){
    qTimer = setInterval(() => trocaQuote(qi+1), 8000);
    qBox.addEventListener("mouseenter", () => clearInterval(qTimer));
    qBox.addEventListener("mouseleave", () => { qTimer = setInterval(() => trocaQuote(qi+1), 8000); });
  }
}

/* ================= PAINEL DE VOTAÇÃO ================= */
const PAUTAS = [
  { n:"PAUTA 1/4", t:"Aprovação das demonstrações financeiras" },
  { n:"PAUTA 2/4", t:"Eleição do Conselho de Administração" },
  { n:"PAUTA 3/4", t:"Destinação do resultado do exercício" },
  { n:"PAUTA 4/4", t:"Eleição do Conselho Fiscal" }
];
const META_QUORUM = 48;
let pi = 1, V = { a:18, r:9, ab:5 }, presentes = 84;

function renderVotos(){
  const { a, r, ab } = V, tot = a + r + ab || 1;
  const set = (bar, n, val) => {
    document.getElementById(bar).style.width = (val/tot*100) + "%";
    document.getElementById(n).textContent = `${val} · ${Math.round(val/tot*100)}%`;
  };
  set("barA","nA",a); set("barR","nR",r); set("barAb","nAb",ab);
  document.getElementById("presentes").textContent = presentes;
  const q = document.getElementById("quorum");
  if (tot >= META_QUORUM){ q.textContent = "ATINGIDO ✓"; q.classList.add("ok"); }
  else { q.textContent = `faltam ${META_QUORUM - tot} votos`; q.classList.remove("ok"); }
}

function simular(){
  if (REDUZIDO){ V = { a:64, r:23, ab:9 }; presentes = 96; renderVotos(); return; }
  renderVotos();
  setInterval(() => {
    V.a  += Math.round(Math.random()*2);
    V.r  += Math.round(Math.random()*1.4);
    V.ab += Math.random() < .25 ? 1 : 0;
    if (Math.random() < .3 && presentes < 120) presentes++;
    renderVotos();
  }, 900);
  setInterval(() => {
    pi = (pi + 1) % PAUTAS.length;
    V = { a:6, r:3, ab:2 };
    document.getElementById("pautaNum").textContent = PAUTAS[pi].n;
    document.getElementById("pautaTitulo").textContent = PAUTAS[pi].t;
    const p = document.getElementById("painelPauta");
    p.classList.remove("flash"); void p.offsetWidth; p.classList.add("flash");
    renderVotos();
  }, 9000);
}

/* ================= OBSERVADORES ================= */
function initObservadores(){
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("on");
      if (e.target.hasAttribute("data-count")) animarNumero(e.target);
      io.unobserve(e.target);
    });
  }, { threshold:.18 });
  document.querySelectorAll(".reveal, .mask, [data-count]").forEach(el => io.observe(el));

  document.querySelectorAll(".vcard").forEach((c,i) => c.style.transitionDelay = (i%3)*90 + "ms");

  const num = document.getElementById("passoNum"), nome = document.getElementById("passoNome");
  const passos = [...document.querySelectorAll(".passo")];
  if (num && nome && passos.length){
    const atualizaPasso = () => {
      const linha = innerHeight * .3;
      let atual = passos[0];
      passos.forEach(p => { if (p.getBoundingClientRect().top < linha) atual = p; });
      num.textContent = atual.dataset.num;
      nome.textContent = atual.dataset.nome;
    };
    addEventListener("scroll", atualizaPasso, { passive:true });
    atualizaPasso();
  }
}

function animarNumero(el){
  const alvo = +el.dataset.count, suf = el.dataset.suf || "";
  if (REDUZIDO){ el.textContent = alvo.toLocaleString("pt-BR") + suf; return; }
  const t0 = performance.now(), dur = 1500;
  (function passo(t){
    const p = Math.min((t - t0)/dur, 1), e = 1 - Math.pow(1-p, 3);
    el.textContent = Math.round(alvo * e).toLocaleString("pt-BR") + suf;
    if (p < 1) requestAnimationFrame(passo);
  })(t0);
}

/* ================= UI ================= */
function initUI(){
  const header = document.getElementById("header");
  if (header) addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 10), { passive:true });

  const burger = document.getElementById("burger");
  if (burger && header){
    burger.addEventListener("click", () => {
      const aberto = header.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", aberto);
    });
  }
  document.querySelectorAll(".menu a").forEach(a =>
    a.addEventListener("click", () => header && header.classList.remove("menu-open")));

  /* ----- FORMULÁRIO DE CONTATO ----- */
  const form = document.getElementById("formContato");
  if (form){
    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (!form.checkValidity()){ form.reportValidity(); return; }
      const btn = form.querySelector("button");
      btn.disabled = true;
      btn.textContent = "Enviando…";

      const destinos = [
        "alexandre.costa@alfm.adv.br",
      ];

      try {
        const resultados = await Promise.all(destinos.map(dest =>
          fetch(`https://formsubmit.co/ajax/${dest}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
              _subject:  "🗳️ Nova solicitação de reunião — Easy Voting",
              _template: "table",
              _replyto:  form.email.value,
              "Nome":        form.nome.value,
              "E-mail":      form.email.value,
              "Empresa":     form.organizacao.value,
              "Mensagem":    form.mensagem.value,
              "Recebido em": new Date().toLocaleString("pt-BR")
            })
          })
        ));
        if (!resultados.every(r => r.ok)) throw new Error("Falha no envio");
        btn.textContent = "Enviado ✓";
        document.getElementById("formOk").classList.add("show");
        form.reset();
      } catch (err) {
        btn.textContent = "Erro ao enviar ✕";
        console.error("Erro no envio:", err);
      }
      setTimeout(() => { btn.textContent = "Enviar solicitação"; btn.disabled = false; }, 3000);
    });
  }
}

/* ================= INICIALIZAÇÃO ================= */
buildLogos();
buildFiltros();
buildGrid();
initObservadores();
initUI();
if (document.getElementById("painelPauta")) simular();

/* ================= DROPDOWN DO MENU ================= */
(function () {
  const dropdown = document.querySelector('.dropdown');
  const toggle   = document.getElementById('dropdownToggle');
  const menu     = document.getElementById('dropdownMenu');

  if (!toggle || !dropdown || !menu) return;

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      dropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();