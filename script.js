gsap.registerPlugin(ScrollTrigger);

// --- 1. ENTRANCE CHOREOGRAPHY ---
const tl = gsap.timeline();
tl.from(".hud-nav", { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" })
  .from(".eyebrow", { x: -30, opacity: 0, duration: 0.6 }, "-=0.4")
  .from(".glitch-title", { y: 60, opacity: 0, skewY: 4, duration: 0.9, ease: "power4.out" }, "-=0.4")
  .fromTo(".hero-render", { x: 80, opacity: 0 }, { x: 0, opacity: 0.65, duration: 1, ease: "power3.out" }, "-=0.7")
  .from(".quote", { opacity: 0, x: -20, duration: 0.6 }, "-=0.5")
  .from(".cyber-btn", { scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.12, ease: "back.out(1.7)" }, "-=0.3")
  .from("#standard-roster .char-card", { y: 40, opacity: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" }, "-=0.3");

// --- 2. SCROLL ANIMATIONS (SCROLLTRIGGER) ---
gsap.utils.toArray(".reveal-up").forEach(elem => {
    gsap.from(elem, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
            trigger: elem,
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });
});

gsap.utils.toArray(".stat-fill").forEach(bar => {
    const targetWidth = bar.getAttribute("data-width");
    gsap.to(bar, {
        width: targetWidth,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".stats-box",
            start: "top 80%"
        }
    });
});

// --- 3. MOUSE PARALLAX ---
document.addEventListener("mousemove", (e) => {
    const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
    const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;

    gsap.to("#hero-render", { x: xNorm * -22, y: yNorm * -12, duration: 0.8, ease: "power2.out" });
    gsap.to("#kanji-bg", { x: xNorm * 35, y: yNorm * 25, duration: 1, ease: "power2.out" });
});

// --- 4. PARTICLE SYSTEM (REIATSU EMBERS OR FALLING SNOW) ---
const canvas = document.getElementById("reiatsu-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleColor = "rgba(255, 77, 0, 0.75)";
let particleSpeedMultiplier = 1;
let particleStretch = 1;
let snowMode = false;

const particles = Array.from({ length: 100 }, () => ({
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
        if (snowMode) {
            p.y += Math.abs(p.speedY) * 1.4;
            p.x += Math.sin(p.y * 0.02) * 0.8;
            if (p.y > canvas.height) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }
        } else {
            p.y += p.speedY * particleSpeedMultiplier;
            p.x += p.speedX;
            if (p.y < -20) {
                p.y = canvas.height + 10;
                p.x = Math.random() * canvas.width;
            }
        }

        ctx.beginPath();
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

// --- 5. ROSTER CARD INTERACTIONS ---
const standardRosterEl = document.getElementById("standard-roster");
const iconicRosterEl = document.getElementById("iconic-roster");
const kanjiBg = document.getElementById("kanji-bg");
const heroRender = document.getElementById("hero-render");
const quoteText = document.getElementById("quote-text");

function applyCardData(card, rosterContainer) {
    if (!card || !rosterContainer) return;
    rosterContainer.querySelectorAll(".char-card").forEach(c => c.classList.remove("active-card"));
    card.classList.add("active-card");

    const newKanji = card.getAttribute("data-kanji");
    const newImg = card.getAttribute("data-img");
    const newQuote = card.getAttribute("data-quote");

    gsap.to(kanjiBg, { opacity: 0, scale: 0.85, duration: 0.15, onComplete: () => {
        kanjiBg.textContent = newKanji;
        gsap.to(kanjiBg, { opacity: 1, scale: 1, duration: 0.25 });
    }});

    gsap.to(heroRender, { opacity: 0, x: 50, duration: 0.15, onComplete: () => {
        heroRender.src = newImg;
        gsap.to(heroRender, { opacity: 0.65, x: 0, duration: 0.35, ease: "power3.out" });
    }});

    gsap.fromTo(quoteText, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.3 });
    quoteText.textContent = newQuote;
}

[standardRosterEl, iconicRosterEl].forEach(container => {
    if (container) {
        container.querySelectorAll(".char-card").forEach(card => {
            card.addEventListener("mouseenter", () => applyCardData(card, container));
        });
    }
});

function switchRosterView(showIconic) {
    if (showIconic) {
        standardRosterEl.classList.add("hidden-roster");
        iconicRosterEl.classList.remove("hidden-roster");
        const firstCard = iconicRosterEl.querySelector(".char-card");
        applyCardData(firstCard, iconicRosterEl);
        gsap.fromTo("#iconic-roster .char-card", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 });
    } else {
        iconicRosterEl.classList.add("hidden-roster");
        standardRosterEl.classList.remove("hidden-roster");
        const firstCard = standardRosterEl.querySelector(".char-card");
        applyCardData(firstCard, standardRosterEl);
        gsap.fromTo("#standard-roster .char-card", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 });
    }
}

// --- 6. STANDARD BANKAI BUTTON (ICHIGO CRIMSON MODE) ---
const btnBankai = document.getElementById("btn-bankai");
const btnRukia = document.getElementById("btn-rukia");
const statusText = document.getElementById("reiatsu-status");
const mainTitle = document.getElementById("main-title");
const eyebrowText = document.getElementById("eyebrow-text");
let bankaiActive = false;
let rukiaActive = false;

function triggerImpactFX() {
    const impactTl = gsap.timeline();
    impactTl
        .to(".impact-invert", { opacity: 1, duration: 0.06 })
        .to(".impact-invert", { opacity: 0, duration: 0.08 })
        .to(".slash-1", { scaleX: 1, duration: 0.1, ease: "power4.in" }, "<")
        .to(".slash-2", { scaleX: 1, duration: 0.1, ease: "power4.in" }, "-=0.04")
        .to(".slash-flash", { opacity: 0.9, duration: 0.05 })
        .fromTo(".shockwave-ring", { scale: 0, opacity: 1 }, { scale: 22, opacity: 0, duration: 0.75, ease: "power3.out" }, "<")
        .to(".slash-flash", { opacity: 0, duration: 0.35 })
        .to(".slash-1", { scaleX: 0, transformOrigin: "right", duration: 0.14 }, "-=0.3")
        .to(".slash-2", { scaleX: 0, transformOrigin: "left", duration: 0.14 }, "<");

    gsap.fromTo("main", { x: -22, y: 10 }, { x: 22, y: -10, duration: 0.045, repeat: 8, yoyo: true, clearProps: "x,y" });
    gsap.fromTo(mainTitle, { scale: 1.18, skewX: 15 }, { scale: 1, skewX: 0, duration: 0.45, ease: "elastic.out(1, 0.4)" });
}

function resetToNormal() {
    bankaiActive = false;
    rukiaActive = false;
    snowMode = false;
    document.body.classList.remove("bankai-mode", "rukia-mode");
    document.documentElement.style.setProperty("--bg-color", "#060608");
    document.documentElement.style.setProperty("--accent", "#ff4d00");
    particleColor = "rgba(255, 77, 0, 0.75)";
    particleSpeedMultiplier = 1;
    particleStretch = 1;
    btnBankai.innerHTML = "<span>卍解 // RELEASE BANKAI</span>";
    btnRukia.innerHTML = "<span>白霞罸 // HAKKA NO TOGAME</span>";
    statusText.textContent = "REIATSU: STABLE";
    eyebrowText.textContent = "THOUSAND-YEAR BLOOD WAR";
    kanjiBg.style.color = "rgba(255, 255, 255, 0.035)";
    switchRosterView(false);
}

btnBankai.addEventListener("click", () => {
    triggerImpactFX();
    if (!bankaiActive) {
        rukiaActive = false;
        snowMode = false;
        bankaiActive = true;
        document.body.classList.remove("rukia-mode");
        document.body.classList.add("bankai-mode");
        document.documentElement.style.setProperty("--bg-color", "#140004");
        document.documentElement.style.setProperty("--accent", "#ff002b");
        particleColor = "rgba(255, 0, 43, 0.95)";
        particleSpeedMultiplier = 6.5;
        particleStretch = 4.5;
        btnBankai.innerHTML = "<span>SEAL ZANPAKUTŌ</span>";
        btnRukia.innerHTML = "<span>白霞罸 // HAKKA NO TOGAME</span>";
        statusText.textContent = "REIATSU: CRITICAL // BANKAI RELEASED";
        eyebrowText.textContent = "BANKAI // TENSA ZANGETSU";
        kanjiBg.style.color = "rgba(255, 0, 43, 0.11)";
        switchRosterView(false);
    } else {
        resetToNormal();
    }
});

// --- 7. RUKIA BANKAI BUTTON (CINEMATIC SCALE + AUDIO FADE + FROST DISPERSION) ---
const videoOverlay = document.getElementById("video-overlay");
const rukiaVideo = document.getElementById("rukia-video");
const skipVideoBtn = document.getElementById("skip-video");
let isTransitioningOut = false;

function activateRukiaIceState() {
    if (isTransitioningOut) return;
    isTransitioningOut = true;

    // Smooth audio fade-out and frost dispersion (without altering original video colors)
    gsap.to(rukiaVideo, {
        volume: 0,
        scale: 1.25,
        filter: "blur(24px) brightness(2.2)",
        duration: 1.1,
        ease: "power2.inOut"
    });

    gsap.to(videoOverlay, {
        opacity: 0,
        duration: 1.1,
        ease: "power2.inOut",
        onComplete: () => {
            videoOverlay.classList.remove("active");
            rukiaVideo.pause();
            rukiaVideo.currentTime = 0;
            rukiaVideo.volume = 1.0;
            gsap.set(rukiaVideo, { scale: 0.72, filter: "none" });
            isTransitioningOut = false;
        }
    });

    gsap.delayedCall(0.45, () => {
        triggerImpactFX();
        bankaiActive = false;
        rukiaActive = true;
        snowMode = true;

        document.body.classList.remove("bankai-mode");
        document.body.classList.add("rukia-mode");
        document.documentElement.style.setProperty("--bg-color", "#031324");
        document.documentElement.style.setProperty("--accent", "#7dd3fc");

        particleColor = "rgba(224, 242, 254, 0.9)";
        particleSpeedMultiplier = 1;
        particleStretch = 1;

        btnRukia.innerHTML = "<span>SEAL HAKKA NO TOGAME</span>";
        btnBankai.innerHTML = "<span>卍解 // RELEASE BANKAI</span>";
        statusText.textContent = "TEMP: -273.15°C // ABSOLUTE ZERO";
        eyebrowText.textContent = "BANKAI REMASTERED // WHITE HAZE";
        kanjiBg.style.color = "rgba(125, 211, 252, 0.12)";

        switchRosterView(true);
    });
}

rukiaVideo.addEventListener("timeupdate", () => {
    if (rukiaVideo.duration && !isTransitioningOut && (rukiaVideo.duration - rukiaVideo.currentTime) <= 1.1) {
        activateRukiaIceState();
    }
});

btnRukia.addEventListener("click", () => {
    if (!rukiaActive) {
        isTransitioningOut = false;
        videoOverlay.classList.add("active");
        rukiaVideo.currentTime = 0;
        rukiaVideo.muted = false;
        rukiaVideo.volume = 1.0;

        gsap.fromTo("#video-frost-flash", { opacity: 0.9 }, { opacity: 0, duration: 0.8, ease: "power2.out" });
        gsap.to(videoOverlay, { opacity: 1, duration: 0.5, ease: "power2.out" });
        gsap.fromTo(rukiaVideo, 
            { scale: 0.72, filter: "blur(12px) brightness(1.4)" }, 
            { scale: 1.04, filter: "blur(0px) brightness(1.06) contrast(1.08)", duration: 5, ease: "power1.out" }
        );

        rukiaVideo.play().catch((error) => {
            console.log("Video playback error:", error);
            activateRukiaIceState();
        });
    } else {
        triggerImpactFX();
        resetToNormal();
    }
});

rukiaVideo.addEventListener("ended", activateRukiaIceState);
skipVideoBtn.addEventListener("click", activateRukiaIceState);