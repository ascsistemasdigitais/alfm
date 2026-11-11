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

/* ================= LOGOS (grade) ================= */
function buildLogos(){
  const g = document.getElementById("logosGrid");
  if (!g) return;
  const metade = Math.ceil(EMPRESAS.length / 2);
  const linhas = [EMPRESAS.slice(0, metade), EMPRESAS.slice(metade)];
  const renderizarLogos = (empresas, duplicada = false) => empresas.map(e => `
    <div class="logo-cell" title="${e.nome}" role="listitem">
      ${e.logo ? `<img class="logo-img" src="${e.logo}" alt="${duplicada ? "" : e.nome}">` : `<span class="logo-word">${e.nome}</span>`}
    </div>`).join("");

  g.innerHTML = linhas.map((empresas, i) => `
    <div class="logo-marquee-row" role="group" aria-label="${idiomaAtual === "en" ? "Company row" : "Linha"} ${i + 1} ${idiomaAtual === "en" ? "of companies" : "de empresas"}">
      <div class="logo-track ${i === 1 ? "logo-track-reverse" : ""}">
        <div class="logo-group" role="list">${renderizarLogos(empresas)}</div>
        <div class="logo-group" role="list" aria-hidden="true">${renderizarLogos(empresas, true)}</div>
      </div>
    </div>`).join("");

  g.querySelectorAll(".logo-track").forEach(track => {
    const grupo = track.querySelector(".logo-group");
    track.style.setProperty("--logo-distance", `-${grupo.offsetWidth}px`);
  });
}

/* ================= GRAVAÇÕES ================= */
function buildGrid(){
  const grid = document.getElementById("vgrid");
  if (!grid) return;
  grid.innerHTML = GRAVACOES.map((v,i) => {
    const thumbSrc = v.thumb || `https://picsum.photos/seed/${v.seed}/640/360`;
    return `
      <article class="vcard reveal" data-tag="${v.tag}">
        <button class="vthumb" data-i="${i}" aria-label="${idiomaAtual === "en" ? "Play: " : "Reproduzir: "}${v.titulo}">
          <img loading="lazy" src="${thumbSrc}" alt="${idiomaAtual === "en" ? "Recording cover: " : "Capa da gravação: "}${v.titulo}">
          <span class="vplay" aria-hidden="true">▶</span>
          <span class="vdur mono">${v.duracao}</span>
        </button>
        <div class="vinfo">
          <span class="vtag mono">${traduzirDinamico(v.tag)}</span>
          <h3>${traduzirDinamico(v.titulo)}</h3>
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
  box.innerHTML = tags.map((tag,i) =>
    `<button class="chip ${i===0?"ativo":""}" data-tag="${tag}">${traduzirDinamico(tag)}</button>`).join("");
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
      <p>${traduzirDinamico("Cole o link deste vídeo na lista GRAVACOES do script.js.")}</p></div></div>`;
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
    playBtn.setAttribute("aria-label", traduzirDinamico(tocando ? "Pausar áudio" : "Reproduzir áudio"));
    if (tocando){
      statusEl.textContent = traduzirDinamico(audio.muted ? "Tocando no mudo" : "Tocando…");
    } else {
      statusEl.textContent = traduzirDinamico(audio.ended ? "Fim — ▶ para ouvir de novo" : "Pausado");
    }
  }
  function paintMute(){
    muteBtn.textContent = traduzirDinamico(audio.muted ? "🔇 Ativar som" : "🔊 Silenciar");
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
    statusEl.textContent = traduzirDinamico("⚠ Áudio não carregou — confira o caminho do .mp3");
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
    statusEl.textContent = traduzirDinamico("▶ Clique em qualquer lugar para ouvir com som");
    document.addEventListener("click",    liberarSom, true);
    document.addEventListener("keydown",  liberarSom);
    document.addEventListener("touchend", liberarSom);
  });
})();

/* ================= PAINEL DE VOTAÇÃO ================= */
const PAUTAS = [
  { n:"PAUTA 1/4", t:"Aprovação das demonstrações financeiras" },
  { n:"PAUTA 2/4", t:"Eleição do Conselho de Administração" },
  { n:"PAUTA 3/4", t:"Destinação do resultado do exercício" },
  { n:"PAUTA 4/4", t:"Eleição do Conselho Fiscal" }
];
const META_QUORUM = 48;
const VOTOS_INICIAIS = { a:14, r:7, ab:4 };
let pi = 1, V = { ...VOTOS_INICIAIS }, presentes = 120;

function renderVotos(){
  const { a, r, ab } = V, tot = a + r + ab || 1;
  const set = (bar, n, val) => {
    document.getElementById(bar).style.width = (val/tot*100) + "%";
    document.getElementById(n).textContent = `${val} · ${Math.round(val/tot*100)}%`;
  };
  set("barA","nA",a); set("barR","nR",r); set("barAb","nAb",ab);
  document.getElementById("presentes").textContent = presentes;
  const q = document.getElementById("quorum");
  if (tot >= META_QUORUM){ q.textContent = traduzirDinamico("ATINGIDO ✓"); q.classList.add("ok"); }
  else { q.textContent = traduzirDinamico(`faltam ${META_QUORUM - tot} votos`); q.classList.remove("ok"); }
}

function simular(){
  if (REDUZIDO){ renderVotos(); return; }
  renderVotos();
  setInterval(() => {
    if (V.a + V.r + V.ab < presentes){
      const categoria = ["a", "r", "ab"][Math.floor(Math.random() * 3)];
      V[categoria]++;
    }
    renderVotos();
  }, 900);
  setInterval(() => {
    pi = (pi + 1) % PAUTAS.length;
    V = { ...VOTOS_INICIAIS };
    document.getElementById("pautaNum").textContent = traduzirDinamico(PAUTAS[pi].n);
    document.getElementById("pautaTitulo").textContent = traduzirDinamico(PAUTAS[pi].t);
    const p = document.getElementById("painelPauta");
    p.classList.remove("flash"); void p.offsetWidth; p.classList.add("flash");
    renderVotos();
  }, 27000);
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
      nome.textContent = traduzirDinamico(atual.dataset.nome);
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

  const formContato = document.getElementById("formContato");
  const formContatoStatus = document.getElementById("formContatoStatus");
  if (formContato && formContatoStatus){
    formContato.addEventListener("submit", async event => {
      event.preventDefault();
      if (!formContato.reportValidity()) return;

      const botao = formContato.querySelector('button[type="submit"]');
      const textoBotao = botao?.textContent;
      formContatoStatus.textContent = "";
      formContatoStatus.classList.remove("show", "form-error");
      formContato.setAttribute("aria-busy", "true");
      if (botao){
        botao.disabled = true;
        botao.textContent = traduzirDinamico("Enviando...");
      }

      try{
        const resposta = await fetch(formContato.action, {
          method: "POST",
          body: new FormData(formContato),
          headers: { Accept: "application/json" }
        });
        const resultado = await resposta.json();
        if (!resposta.ok || resultado.ok !== true){
          throw new Error("O serviço não confirmou o envio.");
        }

        formContato.reset();
        formContatoStatus.textContent = traduzirDinamico("Formulário enviado com sucesso! Nossa equipe entrará em contato.");
      }catch(erro){
        console.error("Não foi possível enviar o formulário de contato.", erro);
        formContatoStatus.textContent = traduzirDinamico("Não foi possível enviar sua mensagem agora. Tente novamente em alguns instantes.");
        formContatoStatus.classList.add("form-error");
      }finally{
        formContato.setAttribute("aria-busy", "false");
        if (botao){
          botao.disabled = false;
          botao.textContent = textoBotao;
        }
        formContatoStatus.classList.add("show");
      }
    });
  }

  const burger = document.getElementById("burger");
  if (burger && header){
    burger.addEventListener("click", () => {
      const aberto = header.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", aberto);
    });
  }
  document.querySelectorAll(".menu a").forEach(a =>
    a.addEventListener("click", () => header && header.classList.remove("menu-open")));

}

/* ================= IDIOMAS ================= */
const TRADUCOES = {
  "Easy Voting — Assembleias Gerais com segurança cibernética e assessoramento jurídico":"Easy Voting — General Meetings with Cybersecurity and Legal Counsel",
  "Sobre nós — Easy Voting · Tecnologia e rigor jurídico":"About Us — Easy Voting · Technology and Legal Rigor",
  "Plataforma — Easy Voting · Assembleias Gerais Digitais":"Platform — Easy Voting · Digital General Meetings",
  "Contato — Easy Voting · Agende uma reunião":"Contact — Easy Voting · Schedule a Meeting",
  "BVD — Boletim de Voto a Distância · Easy Voting":"Remote Voting Ballot · Easy Voting",
  "Gravações de Assembleias · Easy Voting":"General Meeting Recordings · Easy Voting",
  "Política de Privacidade — Easy Voting":"Privacy Policy — Easy Voting",
  "A experiência definitiva para Assembleias Gerais: BVD, consolidação automática de votos, segurança cibernética e assessoramento jurídico de alto nível.":"The definitive general meeting experience: remote voting ballots, automatic vote consolidation, cybersecurity and senior legal counsel.",
  "Conheça a história da Easy Voting: tecnologia dedicada a assembleias digitais, com segurança e assessoramento jurídico especializado desde 2020.":"Discover Easy Voting: technology dedicated to digital general meetings, with security and specialized legal counsel since 2020.",
  "Veja por dentro como uma sessão Easy Voting funciona: vídeo de apresentação, método da convocação à consolidação e segurança cibernética.":"See how an Easy Voting session works: an introductory video, the process from meeting notice to vote consolidation, and cybersecurity.",
  "Agende uma reunião com a Easy Voting: proposta de assembleia demonstrativa, atendimento personalizado em todo o Brasil.":"Schedule a meeting with Easy Voting: a demo meeting proposal and personalized service throughout Brazil.",
  "Elaboração, envio pelo Empresas.NET, validação e gestão integral do Boletim de Voto a Distância.":"Preparation, submission through Empresas.NET, validation and end-to-end management of the Remote Voting Ballot.",
  "Biblioteca de sessões gravadas: AGOs e AGEs conduzidas pela Easy Voting, com filtros por tipo de assembleia.":"Library of recorded sessions: ordinary and extraordinary general meetings conducted by Easy Voting, filterable by meeting type.",
  "Política de Privacidade da Easy Voting: como coletamos, usamos e protegemos os seus dados, em conformidade com a LGPD.":"Easy Voting Privacy Policy: how we collect, use and protect your data in compliance with Brazil's LGPD.",
  "Pular para o conteúdo":"Skip to content",
  "Navegação principal":"Main navigation",
  "Soluções":"Solutions",
  "AGO":"OGM",
  "AGE":"EGM",
  "AGO/AGE":"OGM/EGM",
  "Assembleias Gerais Digitais":"Digital General Meetings",
  "Direito":"Law",
  "68% do capital votante ✓":"68% of voting capital ✓",
  "AGO — Demonstrações financeiras e destinação do resultado":"OGM — Financial statements and allocation of results",
  "AGE — Reforma do estatuto social":"EGM — Amendments to the bylaws",
  "AGO/AGE — Eleição dos Conselhos de Administração e Fiscal":"OGM/EGM — Election of the Board of Directors and Fiscal Council",
  "AGO — Contas dos administradores e parecer dos auditores":"OGM — Management accounts and auditors' report",
  "AGE — Grupamento de ações e ratificação de atos":"EGM — Share consolidation and ratification of acts",
  "AGO — Orçamento de capital e eleição do Conselho Fiscal":"OGM — Capital budget and election of the Fiscal Council",
  "Alvorada S.A.":"Alvorada S.A.",
  "Torre Norte Capital":"Torre Norte Capital",
  "Vista Verde Energia S.A.":"Vista Verde Energia S.A.",
  "Vila Romana Têxtil S.A.":"Vila Romana Têxtil S.A.",
  "Jardim das Palmeiras Agro S.A.":"Jardim das Palmeiras Agro S.A.",
  "Horizonte Alimentos S.A.":"Horizonte Alimentos S.A.",
  "APRESENTAÇÃO · 02:14":"INTRODUCTION · 02:14",
  "Voltar 10 segundos":"Back 10 seconds",
  "Avançar 10 segundos":"Forward 10 seconds",
  "Clique para voltar ou avançar":"Click to seek backward or forward",
  "✕ Fechar (Esc)":"✕ Close (Esc)",
  "Clientes":"Clients",
  "Plataforma":"Platform",
  "Gravações":"Recordings",
  "Política de Privacidade":"Privacy Policy",
  "Sobre nós":"About us",
  "Contato":"Contact",
  "Agendar reunião":"Schedule a meeting",
  "assembleias digitais":"digital meetings",
  "Tecnologia e respaldo jurídico em um só lugar.":"Technology and legal support in one place.",
  "Fale com a equipe":"Talk to our team",
  "Cia. Aberta":"Public company",
  "Cia. Fechada":"Private company",
  "Holding":"Holding company",
  "Todas":"All",
  "Institucional":"Corporate",
  "Conosco, seus dados estão protegidos.":"Your data is protected with us.",
  "Falar com a Easy Voting no WhatsApp":"Contact Easy Voting on WhatsApp",
  "✓ LANÇAMENTO DO BVD NO CICORP/EMPRESAS.NET":"✓ BVD NOW AVAILABLE ON CICORP/EMPRESAS.NET",
  "CONSOLIDAÇÃO AUTOMÁTICA dos Mapas de Votos dos Escrituradores e Depositários Centrais":"AUTOMATIC CONSOLIDATION of Vote Maps from Bookkeeping Agents and Central Depositories",
  "CONSOLIDAÇÃO AUTOMÁTICA DOS MAPAS DE VOTOS DOS ESCRITURADORES E DEPOSITARIOS CENTRAIS":"AUTOMATIC CONSOLIDATION OF VOTE MAPS FROM BOOKKEEPING AGENTS AND CENTRAL DEPOSITORIES",
  "CONTROLE DE QUÓRUM EM TEMPO REAL":"REAL-TIME QUORUM MONITORING",
  "▶ GRAVAÇÃO DE TODOS OS EVENTOS EM AMBIENTE SEGURO E AUDITÁVEL":"▶ EVERY EVENT RECORDED IN A SECURE, AUDITABLE ENVIRONMENT",
  "● AO VIVO — ASSEMBLEIA EM ANDAMENTO (Demonstração).":"● LIVE — MEETING IN PROGRESS (Demo).",
  "Tecnologia + respaldo jurídico · Alves Ferreira & Mesquita":"Technology + legal support · Alves Ferreira & Mesquita",
  "O seu mais alto nível de ":"Your highest standard of ",
  "governança":"governance",
  "A experiência definitiva para Assembleias Gerais: segurança cibernética, boletim de voto a distância e assessoramento jurídico de alto nível, em um só lugar.":"The definitive general meeting experience: cybersecurity, remote voting ballots and senior legal counsel, all in one place.",
  "BVD, segurança cibernética e assessoramento jurídico sênior em um só lugar.":"Remote voting ballots, cybersecurity and senior legal counsel in one place.",
  "Ver a plataforma":"Explore the platform",
  "Boletim de Voto a Distância →":"Remote Voting Ballot →",
  "rastreabilidade dos votos":"vote traceability",
  "gestão do envio pelo Cicorp/Empresas.NET":"Cicorp/Empresas.NET submission management",
  "assessoramento jurídico":"legal counsel",
  "CONTEÚDO MERAMENTE ILUSTRATIVO":"FOR ILLUSTRATIVE PURPOSES ONLY",
  "Sessão aberta":"Session open",
  "Companhia Exemplo S.A. — AGO/2026":"Sample Company Inc. — OGM/2026",
  "PAUTA 2/4":"AGENDA ITEM 2/4",
  "Eleição do Conselho de Administração":"Election of the Board of Directors",
  "Aprovar":"Approve",
  "Rejeitar":"Reject",
  "Abstenção":"Abstain",
  "Presentes:":"Present: ",
  "Quórum:":"Quorum: ",
  "faltam 23 votos":"23 votes remaining",
  "Segurança e conformidade":"Security and compliance",
  "Resolução CVM nº 81/2022":"CVM Resolution No. 81/2022",
  "Regras sobre voto a distância":"Remote voting rules",
  "Dados protegidos":"Data protection",
  "Criptografia em repouso e em trânsito":"Encryption at rest and in transit",
  "SEGURANÇA":"SECURITY",
  "Medidas de proteção":"Protective measures",
  "Proporcionais aos dados tratados":"Proportionate to the data processed",
  "TRILHA":"AUDIT TRAIL",
  "Auditoria completa":"Full audit trail",
  "Rastro imutável de cada voto":"Immutable record of every vote",
  "Assinatura digital":"Digital signature",
  "Conforme os requisitos aplicáveis ao documento":"In accordance with applicable document requirements",
  "A assembleia é o momento soberano de uma companhia. ":"A general meeting is a company's sovereign decision-making forum. ",
  "Nós o tratamos como tal.":"We treat it as such.",
  "CLIENTES E PARCEIROS":"CLIENTS AND PARTNERS",
  "Organizações que fizeram e fazem parte da nossa trajetória":"Organizations that have been part of our journey",
  "Companhias abertas, holdings, assets e engenharia — em todo o Brasil.":"Public companies, holding companies, asset managers and engineering firms across Brazil.",
  "Explore":"Explore",
  "Cada camada da plataforma":"Every layer of the platform",
  "Como uma sessão funciona":"How a meeting works",
  "Vídeo de apresentação e o método completo, da convocação à consolidação dos votos.":"Introductory video and the complete process, from the notice of meeting to vote consolidation.",
  "Boletim de Voto a Distância":"Remote Voting Ballot",
  "Do edital ao Empresas.NET: elaboração, validação e gestão integral dos BVDs recebidos.":"From the meeting notice to Empresas.NET: preparation, validation and end-to-end management of received ballots.",
  "Biblioteca de sessões":"Meeting library",
  "Assembleias já realizadas, com filtros por tipo — AGO, AGE e AGO/AGE.":"Past meetings, filterable by type — OGM, EGM and combined OGM/EGM.",
  "Segurança e compliance, em números":"Security and compliance, in numbers",
  "consolidação automática dos votos":"automatic vote consolidation",
  "cumprimento regulatório":"regulatory compliance",
  "monitoramento contínuo dos dados":"continuous data monitoring",
  "escrituradores integrados":"integrated bookkeeping agents",
  "Conheça o fluxo":"Discover the process",
  " Explore a plataforma em uma demonstração":" Explore the platform in a demo",
  "Preparação":"Preparation",
  "Conheça o fluxo de organização da assembleia, dos materiais de convocação ao Boletim de Voto a Distância.":"Explore the meeting preparation process, from meeting materials to the Remote Voting Ballot.",
  "Participação":"Participation",
  "Veja como é a experiência de acesso à sessão e acompanhamento dos itens em votação.":"See how participants access the session and follow items being voted on.",
  "Encerramento":"Closing",
  "Explore como os votos e as informações da sessão podem ser consultados ao final do processo.":"See how votes and session information can be reviewed at the end of the process.",
  "Agende uma demonstração →":"Schedule a demo →",
  "Próximo passo":"Next step",
  "Pronto para elevar o padrão das suas assembleias?":"Ready to raise the standard of your general meetings?",
  "Agendar uma reunião →":"Schedule a meeting →",
  "Nossa história · Desde 2020":"Our story · Since 2020",
  "Onde a tecnologia encontra o ":"Where technology meets ",
  "rigor jurídico.":"legal rigor.",
  "A assembleia é o momento soberano de uma companhia. Foi a convicção de que cada decisão merece tecnologia robusta e segurança jurídica que deu origem à Easy Voting.":"A general meeting is a company's sovereign decision-making forum. Easy Voting was founded on the belief that every decision deserves robust technology and legal certainty.",
  "Conheça nossa história ":"Discover our story ",
  "Uma ideia que virou propósito":"An idea that became a purpose",
  "O início de uma nova forma de realizar assembleias.":"The beginning of a new way to hold general meetings.",
  "Governança · Tecnologia · Direito":"Governance · Technology · Law",
  "01 · De onde viemos":"01 · Where we came from",
  "Decisões que moldam o futuro merecem um processo à altura.":"Decisions that shape the future deserve a process to match.",
  "A assembleia é o momento soberano de uma companhia: nela se decidem rumos, se elegem administradores e se registram, com valor jurídico, as deliberações que moldam o futuro de uma organização.":"A general meeting is a company's sovereign decision-making forum: it sets direction, elects directors and legally records the resolutions that shape an organization's future.",
  "Fundadores":"Founders",
  "Tecnologia com respaldo jurídico":"Technology backed by legal counsel",
  "Um único parceiro, do primeiro passo ao registro final.":"One partner, from the first step to the final filing.",
  "Essa visão ganhou solidez com a parceria com o escritório ":"This vision was strengthened through our partnership with the law firm ",
  ", cujo assessoramento jurídico sênior acompanha cada etapa do processo, da convocação ao registro final da ata.":", whose senior legal counsel supports every stage, from the notice of meeting to the final filing of the minutes.",
  "O resultado é uma operação em que tecnologia e direito caminham juntos, e em que o cliente conta com um único parceiro para conduzir sua assembleia com tranquilidade.":"The result is an operation where technology and law work together, and clients have one trusted partner to manage their general meetings with confidence.",
  "03 · O que fazemos":"03 · What we do",
  "Uma estrutura completa para cada assembleia.":"A complete framework for every general meeting.",
  "Da preparação à prestação de contas, tecnologia e cuidado jurídico em cada detalhe.":"Technology and legal care in every detail, from preparation through reporting.",
  "Assembleias digitais":"Digital general meetings",
  "Plataforma completa com controle de quórum em tempo real e acompanhamento ao vivo das votações.":"A complete platform with real-time quorum monitoring and live vote tracking.",
  "Gestão integral do BVD, da elaboração à consolidação automática dos mapas de votos de escrituradores e depositários centrais.":"End-to-end ballot management, from preparation to automatic consolidation of vote maps from bookkeeping agents and central depositories.",
  "Segurança e proteção de dados":"Security and data protection",
  "Proteção em conformidade com a LGPD, com criptografia em repouso e em trânsito.":"LGPD-compliant protection, with encryption at rest and in transit.",
  "Rastreabilidade total":"Full traceability",
  "Trilha de auditoria de cada voto e gravação de todos os eventos em ambiente seguro e auditável.":"An audit trail for every vote and a record of every event in a secure, auditable environment.",
  "Aderência regulatória":"Regulatory compliance",
  "Atuação alinhada às regras da Resolução CVM nº 81/2022 sobre voto a distância.":"Operations aligned with CVM Resolution No. 81/2022 on remote voting.",
  "04 · Nosso compromisso":"04 · Our commitment",
  "Governança mais acessível. Decisões mais transparentes.":"More accessible governance. More transparent decisions.",
  "Atendemos companhias abertas, holdings, gestoras de ativos e empresas dos mais diversos setores, em todo o Brasil, sempre com o mesmo compromisso: tratar cada assembleia com a seriedade que ela merece.":"We serve public companies, holding companies, asset managers and businesses across many sectors throughout Brazil, with one commitment: to treat every general meeting with the seriousness it deserves.",
  "Nossa missão é elevar o padrão de governança das organizações, tornando a participação dos acionistas mais acessível, as decisões mais transparentes e os resultados absolutamente confiáveis.":"Our mission is to raise organizations' governance standards by making shareholder participation more accessible, decisions more transparent and results fully reliable.",
  "Vamos conversar ":"Let's talk ",
  "Apresentação":"Introduction",
  "Como uma sessão Easy Voting funciona por dentro.":"How an Easy Voting session works.",
  "Ouça a apresentação e conheça o método completo: jornada pré-assembleia, BVD, consolidação dos votos e respaldo jurídico sênior.":"Listen to our introduction and learn about the complete process: pre-meeting preparation, remote voting ballots, vote consolidation and senior legal support.",
  "Ouça em 2 minutos":"Listen in 2 minutes",
  "A sessão, ouvida por dentro":"A session, from the inside",
  "Aperte play para ouvir a apresentação. Nela você acompanha o fluxo completo.":"Press play to hear the introduction and follow the complete process.",
  "Edital de convocação, proposta da administração, manual de participação e BVD":"Notice of meeting, management proposal, participation guide and remote voting ballot",
  "Envio do BVD pelo CICORP/Empresas.NET e gestão dos cadastros recebidos":"Ballot submission through CICORP/Empresas.NET and management of received registrations",
  "Consolidação automática e processamento centralizado dos votos recebidos dos escrituradores.":"Automatic consolidation and centralized processing of votes received from bookkeeping agents.",
  "Advogados Parceiros da Alves Ferreira & Mesquita em cada etapa":"Alves Ferreira & Mesquita partner lawyers at every stage",
  "Clique para ouvir":"Click to listen",
  "🔊 Silenciar":"🔊 Mute",
  "Da convocação à consolidação":"From meeting notice to vote consolidation",
  "Gestão integral: cuidamos de tudo nos bastidores":"End-to-end management: we take care of everything behind the scenes",
  "Jornada pré-assembleia":"Pre-meeting process",
  "Acionistas e BVDs":"Shareholders and ballots",
  "Sessão e consolidação":"Meeting and consolidation",
  "Jurídico e governança":"Legal counsel and governance",
  "Elaboração do edital de convocação, proposta da administração, manual de participação e do boletim de voto a distância, com gestão do envio pelo Empresas.NET.":"Preparation of the notice of meeting, management proposal, participation guide and remote voting ballot, including submission management through Empresas.NET.",
  "Gestão de acionistas e BVDs":"Shareholder and ballot management",
  "Análise criteriosa da documentação apresentada pelo acionista, gestão dos cadastros e BVDs recebidos, contato e suporte aos acionistas e representantes.":"Careful review of shareholder documents, management of registrations and received ballots, and support for shareholders and their representatives.",
  "Sessão ao vivo e consolidação dos votos":"Live meeting and vote consolidation",
  "Processamento automático dos mapas dos escrituradores — Bradesco, Itaú, BTG, entre outros — com consolidação integral, rastreabilidade e transparência.":"Automatic processing of vote maps from bookkeeping agents — including Bradesco, Itaú and BTG — with full consolidation, traceability and transparency.",
  "Jurídico especializado e governança":"Specialized legal counsel and governance",
  "Advogados seniores do escritório Alves Ferreira & Mesquita conduzem cada etapa, incluindo a estratégia nas eleições dos Conselhos de Administração e Fiscal.":"Senior lawyers from Alves Ferreira & Mesquita guide every stage, including strategy for Board of Directors and Fiscal Council elections.",
  "Veja a plataforma operando uma assembleia sua.":"See the platform in action at one of your general meetings.",
  "BVD sem fricção, do edital ao Empresas.NET.":"A seamless remote ballot process, from notice to Empresas.NET.",
  "O acionista vota de onde estiver, com validade e rastreabilidade — e você acompanha o quórum prévio em tempo real.":"Shareholders can vote from anywhere, with validity and traceability, while you monitor preliminary quorum in real time.",
  "Gestão integral":"End-to-end management",
  "Nós cuidamos de tudo nos bastidores":"We take care of everything behind the scenes",
  "Você foca onde realmente importa; a operação integral do BVD fica com a nossa equipe, sob supervisão jurídica sênior.":"You focus on what matters; our team manages the entire ballot process under senior legal supervision.",
  "Elaboração do BVD e do manual de participação":"Preparation of the remote voting ballot and participation guide",
  "Envio do BVD pelo Cicorp/Empresas.NET":"Ballot submission through Cicorp/Empresas.NET",
  "Análise criteriosa da documentação apresentada pelo acionista":"Careful review of shareholder documents",
  "Gestão dos cadastros e dos BVDs recebidos":"Management of registrations and received ballots",
  "Contato e suporte aos acionistas e representantes":"Communication with and support for shareholders and representatives",
  "Relatórios com status da assembleia e quórum prévio":"Reports on meeting status and preliminary quorum",
  "Demonstrativo de mapa de BVDs":"Remote voting ballot map example",
  "Mapa de BVDs":"Remote voting ballot map",
  "Recebidos":"Received",
  "Validados":"Validated",
  "Em análise":"Under review",
  "Quórum prévio:":"Preliminary quorum: ",
  "Atualizado há 5 min":"Updated 5 min ago",
  "Pilares do BVD Easy Voting":"Easy Voting remote ballot pillars",
  "Envio organizado":"Organized submission",
  "Gestão do envio do BVD e da documentação correspondente.":"Management of ballot submission and related documentation.",
  "VALIDAÇÃO":"VALIDATION",
  "Análise criteriosa":"Careful review",
  "Documentação do acionista conferida pela equipe sob supervisão jurídica.":"Shareholder documentation reviewed by our team under legal supervision.",
  "QUÓRUM":"QUORUM",
  "Visão prévia da sessão":"Meeting preview",
  "Relatórios contínuos de status e quórum antes da abertura dos trabalhos.":"Ongoing status and quorum reports before the meeting begins.",
  "Quer ver o BVD da sua próxima assembleia conosco?":"Would you like us to manage the ballot for your next general meeting?",
  "Acervo & conformidade":"Archive & compliance",
  "Cada assembleia é gravada e guardada com segurança. ":"Every general meeting is recorded and securely stored. ",
  "Sob demanda da companhia.":"At the company's request.",
  "Cada assembleia é gravada e guardada com segurança. Sob demanda da companhia.":"Every general meeting is recorded and securely stored. At the company's request.",
  "Em respeito à confidencialidade das deliberações, os vídeos das assembleias não são publicados neste site. Todas as sessões conduzidas pela Easy Voting são gravadas e preservadas em nosso banco de dados seguro, permanecendo à disposição da companhia sempre que necessário — conforme a legislação vigente e as normas da CVM.":"To protect the confidentiality of resolutions, meeting videos are not published on this website. Every session conducted by Easy Voting is recorded and kept in our secure database, available to the company whenever needed, in accordance with applicable law and CVM regulations.",
  "Assembleia Geral Ordinária":"Ordinary General Meeting",
  "Gravação integral da sessão, com registro fiel das deliberações, votações e quórum.":"Full session recording, faithfully documenting resolutions, votes and quorum.",
  "Assembleia Geral Extraordinária":"Extraordinary General Meeting",
  "Registro completo e armazenamento confidencial, pronto para consulta da companhia.":"Complete record and confidential storage, available for the company to review.",
  "Ordinária & Extraordinária":"Ordinary & Extraordinary",
  "Sessões unificadas gravadas em arquivo único, com a mesma garantia de guarda.":"Combined sessions recorded in a single file with the same secure storage.",
  "Acervo sob guarda segura.":"Securely stored archive.",
  "As gravações não são públicas: o acesso é disponibilizado à companhia mediante solicitação, conforme a legislação vigente e as normas da CVM.":"Recordings are not public. Access is provided to the company upon request, in accordance with applicable law and CVM regulations.",
  "Solicitar acesso →":"Request access →",
  "A sua próxima assembleia também pode ser assim.":"Your next general meeting can be like this too.",
  "Biblioteca de sessões":"Meeting library",
  "Gravações de assembleias já realizadas.":"Recordings of past general meetings.",
  "Transparência total: cada sessão conduzida pela Easy Voting fica registrada e disponível, com filtros por tipo de assembleia.":"Full transparency: every Easy Voting session is recorded and available, with filters by meeting type.",
  "Fechar (Esc)":"Close (Esc)",
  "Agende uma reunião":"Schedule a meeting",
  "Conheça a Easy Voting.":"Get to know Easy Voting.",
  "Conte sobre a sua companhia e retornaremos com uma proposta de assembleia demonstrativa. Atendimento personalizado: aqui você é prioridade.":"Tell us about your company and we'll get back to you with a proposal for a demo meeting. Personalized service, with you as our priority.",
  "Canais diretos":"Direct contacts",
  "Fale com a nossa equipe":"Talk to our team",
  "Preencha o formulário para enviar sua solicitação por e-mail. Nossa equipe retornará em até 1 dia útil.":"Fill out the form to send your request by email. Our team will respond within one business day.",
  "Envie uma mensagem pelo formulário":"Send us a message using the form",
  "Atendimento em todo o Brasil":"Serving companies throughout Brazil",
  "Nome":"Name",
  "Empresa / Companhia":"Company",
  "Telefone":"Phone",
  "Mensagem":"Message",
  "Nova solicitação pelo site Easy Voting":"New request through the Easy Voting website",
  "Enviar solicitação":"Send request",
  "Seus dados serão enviados pelo Formspree para que nossa equipe responda. Consulte nossa ":"Your information will be sent through Formspree so our team can respond. Read our ",
  "Agende uma reunião →":"Schedule a meeting →",
  "Privacidade/LGPD":"Privacy/LGPD",
  "Última atualização: outubro de 2026":"Last updated: October 2026",
  "Razão social:":"Company name: ",
  "CNPJ:":"Brazilian tax ID: ",
  "O controlador dos dados pessoais tratados no contexto do Easy Voting é a EASYVOTING TECNOLOGIA DA INFORMACAO SOCIEDADE EMPRESARIA LIMITADA, inscrita no CNPJ sob o nº 57.511.568/0001-94. Esta política descreve o tratamento de dados no site e, quando aplicável, nos serviços de assembleias gerais digitais.":"The controller of personal data processed in connection with Easy Voting is EASYVOTING TECNOLOGIA DA INFORMACAO SOCIEDADE EMPRESARIA LIMITADA, registered under CNPJ No. 57.511.568/0001-94. This policy describes data processing on the website and, where applicable, in digital general meeting services.",
  "Para exercer direitos ou encaminhar dúvidas sobre privacidade, utilize o ":"To exercise your rights or ask questions about privacy, use the ",
  " e identifique a solicitação como “Privacidade/LGPD”, ou ligue para +55 11 2050-0700.":" and identify your request as “Privacy/LGPD,” or call +55 11 2050-0700.",
  "Recomendamos a leitura da ":"We recommend reading ",
  "política de privacidade do Formspree":"Formspree's privacy policy",
  " para entender como eles tratam esses dados.":" to understand how it handles this data.",
  "Este site não utiliza cookies próprios para fins de rastreamento, análise de comportamento (analytics) ou publicidade. No entanto, cookies estritamente necessários para o funcionamento técnico do site ou de serviços de terceiros (como proteção contra spam) podem ser ativados. Além disso, nossos provedores de hospedagem e serviços de infraestrutura podem registrar automaticamente dados técnicos (como endereço IP e dados de log do navegador) para garantir a segurança e a estabilidade do serviço, conforme suas respectivas políticas de privacidade.":"This website does not use its own cookies for tracking, behavioral analytics or advertising. However, cookies strictly necessary for the technical operation of the website or third-party services (such as spam protection) may be enabled. In addition, our hosting and infrastructure providers may automatically record technical data (such as IP addresses and browser logs) to ensure service security and stability, in accordance with their respective privacy policies.",
  "1. Controlador e abrangência":"1. Data controller and scope",
  "2. Dados tratados":"2. Data processed",
  "3. Finalidades e bases legais":"3. Purposes and legal bases",
  "4. Segurança da informação":"4. Information security",
  "5. Armazenamento e retenção":"5. Storage and retention",
  "6. Direitos dos titulares":"6. Data subject rights",
  "7. Encarregado e contato":"7. Data Protection Officer and contact",
  "8. Cookies e tecnologias semelhantes":"8. Cookies and similar technologies",
  "Contato:":"Contact: ",
  "Dados de assembleias:":"Meeting data: ",
  "Dados técnicos:":"Technical data: ",
  "formulário de contato":"contact form",
  "Política de Privacidade.":"Privacy Policy.",
  "Transparência no tratamento de dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).":"Transparency in the processing of personal data, in compliance with Brazil's General Data Protection Law (Law No. 13,709/2018 — LGPD).",
  "2020":"2020",
  "E-mail:":"Email: ",
  "RESOLUÇÃO CVM":"CVM RESOLUTION",
  "O acionista vota de onde estiver, com validade e rastreabilidade — e você acompanha o quórum prévio em tempo real.":"Shareholders can vote from anywhere, with validity and traceability, while you monitor preliminary quorum in real time.",
  "BVD sem fricção, do edital ao Empresas.NET.":"A seamless remote ballot process, from the meeting notice to Empresas.NET.",
  "Boletim de Voto a Distância · Easy Voting":"Remote Voting Ballot · Easy Voting",
  "Boletim de Voto a Distância.":"Remote Voting Ballot.",
  "Boletim de Voto a Distância — Easy Voting":"Remote Voting Ballot — Easy Voting",
  "Eleições do Conselho de Administração":"Board of Directors election",
  "Aprovar":"Approve",
  "Rejeitar":"Reject",
  "Faltam ":"Remaining ",
  "PAUTA 1/4":"AGENDA ITEM 1/4",
  "PAUTA 3/4":"AGENDA ITEM 3/4",
  "PAUTA 4/4":"AGENDA ITEM 4/4",
  "Aprovação das demonstrações financeiras":"Approval of the financial statements",
  "Destinação do resultado do exercício":"Allocation of the year's results",
  "Eleição do Conselho Fiscal":"Election of the Fiscal Council",
  "Pausar áudio":"Pause audio",
  "Reproduzir áudio":"Play audio",
  "ATINGIDO ✓":"REACHED ✓",
  "Todas as sessões":"All sessions",
  "Cole o link deste vídeo na lista GRAVACOES do script.js.":"Add this video's link to the GRAVACOES list in script.js.",
  "Tocando no mudo":"Playing muted",
  "Tocando…":"Playing…",
  "Fim — ▶ para ouvir de novo":"Finished — ▶ play again",
  "Pausado":"Paused",
  "🔇 Ativar som":"🔇 Unmute",
  "⚠ Áudio não carregou — confira o caminho do .mp3":"⚠ Audio could not be loaded — check the .mp3 path",
  "▶ Clique em qualquer lugar para ouvir com som":"▶ Click anywhere to listen with sound",
  "Enviando...":"Sending...",
  "Formulário enviado com sucesso! Nossa equipe entrará em contato.":"Form submitted successfully! Our team will be in touch.",
  "Não foi possível enviar sua mensagem agora. Tente novamente em alguns instantes.":"We couldn't send your message right now. Please try again in a few moments.",
  "01 · De onde viemos":"01 · Where we came from",
  "02":"02",
  "Os dados de contato preenchidos no formulário são enviados por meio do serviço Formspree ao endereço de contato da Easy Voting para receber, analisar e responder à solicitação, inclusive para preparar propostas. Também podemos tratar dados para executar serviços contratados e cumprir obrigações legais ou regulatórias. Conforme o contexto, as bases legais podem incluir procedimentos preliminares relacionados a contrato, execução de contrato, cumprimento de obrigação legal, exercício regular de direitos e legítimo interesse, observados os requisitos da LGPD.":"Contact details submitted through the form are sent via Formspree to Easy Voting's contact address so we can receive, review and respond to requests, including preparing proposals. We may also process data to provide contracted services and meet legal or regulatory obligations. Depending on the circumstances, legal bases may include pre-contractual steps, contract performance, compliance with legal obligations, the regular exercise of rights and legitimate interests, subject to LGPD requirements.",
  "O controlador dos dados pessoais tratados no contexto do Easy Voting é a EASYVOTING TECNOLOGIA DA INFORMACAO SOCIEDADE EMPRESARIA LIMITADA, inscrita no CNPJ sob o nº 57.511.568/0001-94. Esta política descreve o tratamento de dados no site e, quando aplicável, nos serviços de assembleias gerais digitais.":"The controller of personal data processed in connection with Easy Voting is EASYVOTING TECNOLOGIA DA INFORMACAO SOCIEDADE EMPRESARIA LIMITADA, registered under CNPJ No. 57.511.568/0001-94. This policy describes data processing on the website and, where applicable, in digital general meeting services.",
  "nome, empresa, e-mail, telefone e mensagem preenchidos no formulário;":"name, company, email, phone number and message submitted through the form;",
  "informações cadastrais e documentos de acionistas e representantes, quando necessários aos serviços contratados;":"registration details and documents of shareholders and representatives, when required for contracted services;",
  "informações de acesso e do navegador que podem ser registradas pela hospedagem e pelos serviços externos utilizados.":"access and browser information that may be recorded by the hosting provider and external services.",
  "Adotamos medidas técnicas e administrativas de segurança compatíveis com os dados tratados para protegê-los contra acessos não autorizados e situações acidentais ou ilícitas, nos termos da LGPD.":"We adopt technical and administrative security measures appropriate to the data processed to protect it against unauthorized access and accidental or unlawful situations, as required by the LGPD.",
  "Os dados de contato são mantidos enquanto houver interesse legítimo ou até a revogação do consentimento. Os dados relativos a assembleias são conservados pelo prazo exigido pela legislação societária e tributária aplicável (geralmente 5 a 10 anos). Os registros de conexão (dados técnicos de acesso) são mantidos pelo prazo de 6 meses, conforme o art. 15 do Marco Civil da Internet (Lei nº 12.965/2014).":"Contact data is retained while there is a legitimate interest or until consent is withdrawn. Meeting-related data is retained for the period required by applicable corporate and tax laws (generally 5 to 10 years). Connection records (technical access data) are retained for 6 months, as required by Article 15 of the Brazilian Civil Rights Framework for the Internet (Law No. 12,965/2014).",
  "Nos termos da LGPD, o titular pode solicitar confirmação da existência de tratamento, acesso, correção, anonimização, bloqueio, eliminação, portabilidade, informações sobre compartilhamento e revisão de decisões automatizadas, quando aplicável, além de revogar consentimento. As solicitações podem ser encaminhadas pelo canal abaixo.":"Under the LGPD, data subjects may request confirmation of processing, access, correction, anonymization, blocking, deletion, portability, information about sharing and review of automated decisions, where applicable, as well as withdraw consent. Requests may be submitted through the channel below.",
  "✓ TECNOLOGIA E RIGOR JURÍDICO":"✓ TECHNOLOGY AND LEGAL RIGOR",
  "TECNOLOGIA E RIGOR JURÍDICO":"TECHNOLOGY AND LEGAL RIGOR",
  "ASSEMBLEIAS DIGITAIS DESDE 2020":"DIGITAL GENERAL MEETINGS SINCE 2020",
  "GOVERNANÇA COM TRANQUILIDADE":"GOVERNANCE WITH CONFIDENCE",
  "Fundada por Ricardo José Martins Gimenez, Rodrigo de Mesquita Pereira e Paulo Roberto Bellentani Brandão, a Easy Voting surgiu da percepção de que, enquanto a economia se digitalizava, as assembleias gerais seguiam exigindo uma combinação rara: tecnologia robusta, conformidade regulatória e segurança jurídica.":"Founded by Ricardo José Martins Gimenez, Rodrigo de Mesquita Pereira and Paulo Roberto Bellentani Brandão, Easy Voting emerged from the realization that, as the economy went digital, general meetings still required a rare combination: robust technology, regulatory compliance and legal certainty.",
  "Os fundadores conceberam uma plataforma dedicada exclusivamente à realização de assembleias digitais, de todos os tipos e formatos, capaz de unir a sofisticação tecnológica ao rigor que um ato societário exige.":"The founders envisioned a platform dedicated exclusively to digital general meetings of every type and format, combining technological sophistication with the rigor required for corporate proceedings.",
  "Ricardo José Martins Gimenez · Rodrigo de Mesquita Pereira · Paulo Roberto Bellentani Brandão":"Founders: Ricardo José Martins Gimenez · Rodrigo de Mesquita Pereira · Paulo Roberto Bellentani Brandão",
  "Sênior":"Senior",
  "Fundada por ":"Founded by ",
  ", a Easy Voting surgiu da percepção de que, enquanto a economia se digitalizava, as assembleias gerais seguiam exigindo uma combinação rara: tecnologia robusta, conformidade regulatória e segurança jurídica.":", Easy Voting emerged from the realization that, as the economy went digital, general meetings still required a rare combination: robust technology, regulatory compliance and legal certainty.",
  " e ":" and ",
  "APRESENTAÇÃO · 02:14":"INTRODUCTION · 02:14",
  "governança.":"governance.",
  "O encarregado pelo tratamento de dados pessoais é Paulo Roberto Brandão. Para exercer direitos ou encaminhar dúvidas sobre privacidade, utilize o ":"The Data Protection Officer is Paulo Roberto Brandão. To exercise your rights or ask questions about privacy, use the ",
  "O formulário deste site é processado pelo Formspree, um serviço externo que encaminha os dados informados ao endereço de contato configurado pela Easy Voting. O envio ocorre no momento da submissão do formulário. Recomendamos a leitura da ":"This website's form is processed by Formspree, an external service that forwards submitted data to Easy Voting's configured contact address. Data is sent when the form is submitted. We recommend reading ",
  " para entender como eles tratam esses dados.\nEste site não utiliza cookies próprios para fins de rastreamento, análise de comportamento (analytics) ou publicidade. No entanto, cookies estritamente necessários para o funcionamento técnico do site ou de serviços de terceiros (como proteção contra spam) podem ser ativados.\nAlém disso, nossos provedores de hospedagem e serviços de infraestrutura podem registrar automaticamente dados técnicos (como endereço IP e dados de log do navegador) para garantir a segurança e a estabilidade do serviço, conforme suas respectivas políticas de privacidade.":" to understand how it handles this data. This website does not use its own cookies for tracking, behavioral analytics or advertising. However, cookies strictly necessary for the technical operation of the website or third-party services (such as spam protection) may be enabled. In addition, our hosting and infrastructure providers may automatically record technical data (such as IP addresses and browser logs) to ensure service security and stability, in accordance with their respective privacy policies.",
  "O encarregado pelo tratamento de dados pessoais é Paulo Roberto Brandão. Para exercer direitos ou encaminhar dúvidas sobre privacidade, utilize o formulário de contato e identifique a solicitação como “Privacidade/LGPD”, ou ligue para +55 11 2050-0700.":"The Data Protection Officer is Paulo Roberto Brandão. To exercise your rights or ask questions about privacy, use the contact form and identify your request as “Privacy/LGPD,” or call +55 11 2050-0700.",
  "O formulário deste site é processado pelo Formspree, um serviço externo que encaminha os dados informados ao endereço de contato configurado pela Easy Voting. O envio ocorre no momento da submissão do formulário. Recomendamos a leitura da política de privacidade do Formspree para entender como eles tratam esses dados. Este site não utiliza cookies próprios para fins de rastreamento, análise de comportamento (analytics) ou publicidade. No entanto, cookies estritamente necessários para o funcionamento técnico do site ou de serviços de terceiros (como proteção contra spam) podem ser ativados. Além disso, nossos provedores de hospedagem e serviços de infraestrutura podem registrar automaticamente dados técnicos (como endereço IP e dados de log do navegador) para garantir a segurança e a estabilidade do serviço, conforme suas respectivas políticas de privacidade.":"This website's form is processed by Formspree, an external service that forwards submitted data to the contact address configured by Easy Voting. Data is sent when the form is submitted. We recommend reading Formspree's privacy policy to understand how it handles this data. This website does not use its own cookies for tracking, behavioral analytics or advertising. However, cookies strictly necessary for the technical operation of the website or third-party services (such as spam protection) may be enabled. In addition, our hosting and infrastructure providers may automatically record technical data (such as IP addresses and browser logs) to ensure service security and stability, in accordance with their respective privacy policies.",
  "\"Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças em nossos processos ou exigências legais. A data da 'Última atualização' no topo deste documento será revisada, e alterações significativas serão comunicadas por meio de aviso destacado no site.\"":"\"This Privacy Policy may be updated periodically to reflect changes in our processes or legal requirements. The 'Last updated' date at the top of this document will be revised, and significant changes will be communicated through a prominent notice on the website.\""
};
const TRADUCOES_NORMALIZADAS = Object.fromEntries(
  Object.entries(TRADUCOES).map(([portugues, ingles]) => [portugues.trim().replace(/\s+/g, " "), ingles])
);

let idiomaAtual = "pt";
const textosOriginais = new WeakMap();

function traduzirTexto(texto, idioma) {
  if (idioma !== "en") return texto;
  const aparado = texto.trim().replace(/\s+/g, " ");
  const traducao = TRADUCOES_NORMALIZADAS[aparado];
  if (!traducao) return texto;
  const inicio = texto.match(/^\s*/)[0];
  const fim = texto.match(/\s*$/)[0];
  return inicio + traducao + fim;
}

function traduzirDinamico(texto) {
  if (idiomaAtual !== "en") return texto;
  const quorum = texto.match(/^faltam (\d+) votos$/);
  if (quorum) return `${quorum[1]} votes remaining`;
  return TRADUCOES[texto] || texto;
}

function salvarIdiomaNaUrl() {
  const urlAtual = new URL(window.location.href);
  urlAtual.searchParams.set("lang", idiomaAtual);
  window.history.replaceState(null, "", urlAtual.href);
}

function atualizarLinksComIdioma() {
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.href.includes("wa.me")) return;
    if (!link.hasAttribute("data-language-href")) {
      link.setAttribute("data-language-href", link.getAttribute("href"));
    }

    const url = new URL(link.getAttribute("data-language-href"), window.location.href);
    if (url.protocol !== window.location.protocol) return;
    if (window.location.protocol === "file:" &&
        url.pathname.substring(0, url.pathname.lastIndexOf("/") + 1) !==
        window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1)) return;
    if (!url.pathname.endsWith(".html") && url.pathname !== window.location.pathname) return;

    url.searchParams.set("lang", idiomaAtual);
    link.href = url.href;
  });
}

function aplicarIdioma(idioma) {
  idiomaAtual = idioma === "en" ? "en" : "pt";
  document.documentElement.lang = idiomaAtual === "en" ? "en" : "pt-BR";
  salvarIdiomaNaUrl();
  atualizarLinksComIdioma();

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (!textosOriginais.has(node)) textosOriginais.set(node, node.nodeValue);
    const original = textosOriginais.get(node);
    node.nodeValue = traduzirTexto(original, idiomaAtual);
  }

  document.querySelectorAll("[aria-label], [title], [alt], [placeholder]").forEach(element => {
    ["aria-label", "title", "alt", "placeholder"].forEach(attribute => {
      if (!element.hasAttribute(attribute)) return;
      const originalAttribute = `data-pt-${attribute}`;
      if (!element.hasAttribute(originalAttribute)) element.setAttribute(originalAttribute, element.getAttribute(attribute));
      element.setAttribute(attribute, traduzirTexto(element.getAttribute(originalAttribute), idiomaAtual));
    });
  });

  const titulo = document.querySelector("title");
  if (titulo) {
    if (!titulo.hasAttribute("data-pt-title")) titulo.setAttribute("data-pt-title", titulo.textContent);
    titulo.textContent = traduzirTexto(titulo.getAttribute("data-pt-title"), idiomaAtual);
  }
  const descricao = document.querySelector('meta[name="description"]');
  if (descricao) {
    if (!descricao.hasAttribute("data-pt-content")) descricao.setAttribute("data-pt-content", descricao.content);
    descricao.content = traduzirTexto(descricao.getAttribute("data-pt-content"), idiomaAtual);
  }
  document.querySelectorAll('meta[property^="og:"]').forEach(meta => {
    if (!meta.hasAttribute("data-pt-content")) meta.setAttribute("data-pt-content", meta.content);
    meta.content = traduzirTexto(meta.getAttribute("data-pt-content"), idiomaAtual);
  });
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    if (!link.hasAttribute("data-pt-href")) link.setAttribute("data-pt-href", link.href);
    const linkOriginal = link.getAttribute("data-pt-href");
    if (idiomaAtual === "pt") {
      link.href = linkOriginal;
      return;
    }
    const mensagemOriginal = decodeURIComponent(linkOriginal);
    const mensagem = mensagemOriginal.toLowerCase().includes("agendar uma reunião")
      ? "Hello! I would like to schedule a meeting with Easy Voting."
      : "Hello! I would like to learn more about Easy Voting.";
    const url = new URL(linkOriginal);
    url.searchParams.set("text", mensagem);
    link.href = url.href;
  });

  document.querySelectorAll(".language-switch button").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.language === idiomaAtual));
  });
  document.querySelectorAll(".ticker-track").forEach(track => {
    if (track.dataset.originalWidth) track.style.width = track.dataset.originalWidth;
  });
}

function inicializarIdiomas() {
  const burger = document.getElementById("burger");
  if (!burger || !burger.parentElement) return;
  const controle = document.createElement("div");
  controle.className = "language-switch";
  controle.setAttribute("role", "group");
  controle.setAttribute("aria-label", "Language / Idioma");
  controle.innerHTML = '<button type="button" data-language="pt" aria-label="Português">PT</button><button type="button" data-language="en" aria-label="English">EN</button>';
  burger.parentElement.insertBefore(controle, burger);
  controle.addEventListener("click", event => {
    const button = event.target.closest("button[data-language]");
    if (!button) return;
    aplicarIdioma(button.dataset.language);
    try {
      localStorage.setItem("easyVotingLanguage", idiomaAtual);
    } catch (erro) {
      console.warn("Não foi possível salvar a preferência de idioma.", erro);
    }
  });

  let idiomaSalvo = "pt";
  const idiomaDaUrl = new URLSearchParams(window.location.search).get("lang");
  try {
    idiomaSalvo = idiomaDaUrl === "en" || idiomaDaUrl === "pt"
      ? idiomaDaUrl
      : localStorage.getItem("easyVotingLanguage") || "pt";
  } catch (erro) {
    console.warn("Não foi possível ler a preferência de idioma.", erro);
    if (idiomaDaUrl === "en" || idiomaDaUrl === "pt") idiomaSalvo = idiomaDaUrl;
  }
  aplicarIdioma(idiomaSalvo);
}

/* ================= INICIALIZAÇÃO ================= */
inicializarIdiomas();
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