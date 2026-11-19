(() => {
  const WHATSAPP = "5533999748857";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Ano no rodapé */
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  /* Header ao rolar + botão flutuante */
  const header = $(".header");
  const wa = $(".wa-float");
  const onScroll = () => {
    const sy = window.scrollY;
    header.classList.toggle("is-scrolled", sy > 30);
    wa.classList.toggle("is-visible", sy > window.innerHeight * 0.6);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Menu mobile */
  const burger = $("#burger");
  const nav = $("#nav");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  /* Revelar ao rolar */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* Link ativo na navegação */
  const links = $$('.nav a[href^="#"]');
  const sections = links.map((l) => $(l.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const so = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
        }
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => so.observe(s));
  }

  /* Brilho que segue o cursor nos cards */
  $$(".card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* Parallax suave no banner */
  const banner = $(".manifesto__bg");
  if (banner && !reduce) {
    const sec = banner.closest(".manifesto");
    let ticking = false;
    const update = () => {
      const r = sec.getBoundingClientRect();
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      banner.style.transform = `scale(1.08) translateY(${p * -40}px)`;
      ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();
  }

  /* Formulário → WhatsApp */
  const form = $("#form");
  const err = $("#formError");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    const assunto = form.assunto.value;
    const msg = form.mensagem.value.trim();
    form.nome.closest(".field").classList.toggle("is-invalid", !nome);
    form.assunto.closest(".field").classList.toggle("is-invalid", !assunto);
    if (!nome || !assunto) { err.hidden = false; return; }
    err.hidden = true;
    const text =
      `Olá, Dr. Filipe! Meu nome é ${nome}.\n` +
      `Assunto: ${assunto}` +
      (msg ? `\n\n${msg}` : "");
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });
})();
