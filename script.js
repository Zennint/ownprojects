// --- 1. ENTRANCE CHOREOGRAPHY WITH GSAP ---
const tl = gsap.timeline();

tl.from(".hud-nav", { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" })
  .from(".eyebrow", { x: -30, opacity: 0, duration: 0.6 }, "-=0.4")
  .from(".glitch-title", { y: 60, opacity: 0, skewY: 4, duration: 0.9, ease: "power4.out" }, "-=0.4")
  .fromTo(".hero-render", { x: 80, opacity: 0 }, { x: 0, opacity: 0.65, duration: 1, ease: "power3.out" }, "-=0.7")
  .from(".quote", { opacity: 0, x: -20, duration: 0.6 }, "-=0.5")
  .from(".cyber-btn", { scale: 0.8, opacity: 0, duration: 0.5, ease: "back.out(1.7)" }, "-=0.3")
  .from(".char-card", { y: 40, opacity: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" }, "-=0.3");

// --- 2. INTERACTIVE MOUSE PARALLAX (DEPTH EFFECT) ---
document.addEventListener("mousemove", (e) => {
    const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
    const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;

    gsap.to("#hero-render", {
        x: xNorm * -22,
        y: yNorm * -12,
        duration: 0.8,
        ease: "power2.out"
    });

    gsap.to("#kanji-bg", {
        x: xNorm * 35,
        y: yNorm * 25,
        duration: 1,
        ease: "power2.out"
    });
});

// --- 3. REIATSU PARTICLE SYSTEM ON CANVAS ---
const canvas = document.getElementById("reiatsu-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleColor = "rgba(255, 77, 0, 0.75)";
let particleSpeedMultiplier = 1;
let particleStretch = 1;

const particles = Array.from({ length: 95 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 3 + 1.2,
    speedY: Math.random() * -1.8 - 0.6,
    speedX: (Math.random() - 0.5) * 0.9
}));

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = particleColor;

    particles.forEach(p => {
        p.y += p.speedY * particleSpeedMultiplier;
        p.x += p.speedX;

        if (p.y < -20) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        // Stretches particles into energy streaks during Bankai
        ctx.ellipse(p.x, p.y, p.size, p.size * particleStretch, 0, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// --- 4. EXPLOSIVE BANKAI MODE ---
const btnBankai = document.getElementById("btn-bankai");
const statusText = document.getElementById("reiatsu-status");
const kanjiBg = document.getElementById("kanji-bg");
const mainTitle = document.getElementById("main-title");
const eyebrowText = document.getElementById("eyebrow-text");
const quoteText = document.getElementById("quote-text");
let bankaiActive = false;

btnBankai.addEventListener("click", () => {
    bankaiActive = !bankaiActive;

    // 1. Anime negative-color impact flash + double X katana slash + shockwave
    const impactTl = gsap.timeline();
    impactTl
        .to(".impact-invert", { opacity: 1, duration: 0.06 })
        .to(".impact-invert", { opacity: 0, duration: 0.08 })
        .to(".slash-1", { scaleX: 1, duration: 0.1, ease: "power4.in" }, "<")
        .to(".slash-2", { scaleX: 1, duration: 0.1, ease: "power4.in" }, "-=0.04")
        .to(".slash-flash", { opacity: 0.9, duration: 0.05 })
        .fromTo(".shockwave-ring", 
            { scale: 0, opacity: 1 }, 
            { scale: 22, opacity: 0, duration: 0.75, ease: "power3.out" }, "<"
        )
        .to(".slash-flash", { opacity: 0, duration: 0.35 })
        .to(".slash-1", { scaleX: 0, transformOrigin: "right", duration: 0.14 }, "-=0.3")
        .to(".slash-2", { scaleX: 0, transformOrigin: "left", duration: 0.14 }, "<");

    // 2. Violent camera earthquake
    gsap.fromTo("main", 
        { x: -22, y: 10 }, 
        { x: 22, y: -10, duration: 0.045, repeat: 8, yoyo: true, clearProps: "x,y" }
    );

    // 3. Title glitch punch
    gsap.fromTo(mainTitle, 
        { scale: 1.18, skewX: 15 }, 
        { scale: 1, skewX: 0, duration: 0.45, ease: "elastic.out(1, 0.4)" }
    );

    if (bankaiActive) {
        document.body.classList.add("bankai-mode");
        document.documentElement.style.setProperty("--bg-color", "#140004");
        document.documentElement.style.setProperty("--accent", "#ff002b");
        
        particleColor = "rgba(255, 0, 43, 0.95)";
        particleSpeedMultiplier = 6.5;
        particleStretch = 4.5; // Particles turn into fast vertical energy streaks
        
        btnBankai.innerHTML = "<span>SEAL ZANPAKUTŌ</span>";
        statusText.textContent = "REIATSU: CRITICAL // BANKAI RELEASED";
        eyebrowText.textContent = "BANKAI // TENSA ZANGETSU";
        quoteText.textContent = '"All things in this universe, turn to ashes — spiritual pressure unleashed."';
        
        kanjiBg.textContent = "卍";
        kanjiBg.style.color = "rgba(255, 0, 43, 0.11)";
    } else {
        document.body.classList.remove("bankai-mode");
        document.documentElement.style.setProperty("--bg-color", "#060608");
        document.documentElement.style.setProperty("--accent", "#ff4d00");
        
        particleColor = "rgba(255, 77, 0, 0.75)";
        particleSpeedMultiplier = 1;
        particleStretch = 1;
        
        btnBankai.innerHTML = "<span>卍解 // RELEASE BANKAI</span>";
        statusText.textContent = "REIATSU: STABLE";
        eyebrowText.textContent = "THOUSAND-YEAR BLOOD WAR";
        quoteText.textContent = '"If you give me a sword, I will protect. If you don\'t give me one, I cannot protect."';
        
        kanjiBg.textContent = "死神";
        kanjiBg.style.color = "rgba(255, 255, 255, 0.035)";
    }
});

// --- 5. CAPTAIN CARDS INTERACTION ---
const cards = document.querySelectorAll(".char-card");
const heroRender = document.getElementById("hero-render");

cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        cards.forEach(c => c.classList.remove("active-card"));
        card.classList.add("active-card");

        const newKanji = card.getAttribute("data-kanji");
        const newQuote = card.getAttribute("data-quote");
        const newImg = card.getAttribute("data-img");

        // Animated Kanji swap
        gsap.to(kanjiBg, { opacity: 0, scale: 0.85, duration: 0.15, onComplete: () => {
            kanjiBg.textContent = newKanji;
            gsap.to(kanjiBg, { opacity: 1, scale: 1, duration: 0.25 });
        }});

        // Animated Character swap (keeps low 0.65 opacity)
        gsap.to(heroRender, { opacity: 0, x: 50, duration: 0.15, onComplete: () => {
            heroRender.src = newImg;
            gsap.to(heroRender, { opacity: 0.65, x: 0, duration: 0.35, ease: "power3.out" });
        }});

        // Quote swap
        gsap.fromTo(quoteText, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.3 });
        quoteText.textContent = newQuote;
    });
});