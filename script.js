/**
 * MODO Coffee — Scroll Animations & Interactions
 */

; (function () {
  'use strict';

  /* ──────────────────────────────
     NAVBAR scroll effect
  ────────────────────────────── */
  const navbar = document.getElementById('navbar');
  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  /* ──────────────────────────────
     INTERSECTION OBSERVER — Reveal
  ────────────────────────────── */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // Once revealed, no need to observe anymore
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal, .value-item, .step, .mode-card').forEach((el) => {
    revealObs.observe(el);
  });

  /* ──────────────────────────────
     PRODUCT JOURNEY — Scroll-driven
  ────────────────────────────── */
  const journeySection = document.getElementById('product-journey');
  const stages = Array.from(document.querySelectorAll('.journey-stage'));
  const dots = Array.from(document.querySelectorAll('.jp-dot'));
  const stageText = document.getElementById('journey-text');

  const stageLabels = [
    'El paquete llega.',
    'Abrís la caja.',
    'El filtro drip se despliega.',
    'Lo apoyás sobre tu taza.',
    'Vertís el agua caliente.',
    'Listo para tomar.'
  ];

  let currentStage = -1;

  function setJourneyStage(idx) {
    if (idx === currentStage) return;
    currentStage = idx;

    stages.forEach((s, i) => {
      s.classList.remove('active', 'exit');
      if (i < idx) s.classList.add('exit');
      if (i === idx) s.classList.add('active');
    });

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });

    if (stageText && stageLabels[idx] !== undefined) {
      stageText.style.opacity = '0';
      setTimeout(() => {
        stageText.textContent = stageLabels[idx];
        stageText.style.opacity = '0.7';
      }, 300);
    }
  }

  function onJourneyScroll() {
    if (!journeySection) return;

    const rect = journeySection.getBoundingClientRect();
    const total = journeySection.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;

    if (scrolled < 0 || scrolled > total) return;

    const progress = scrolled / total;   // 0 → 1
    const stageCount = stages.length;
    const idx = Math.min(
      stageCount - 1,
      Math.floor(progress * stageCount)
    );

    setJourneyStage(idx);
  }

  window.addEventListener('scroll', onJourneyScroll, { passive: true });
  // Init on load
  onJourneyScroll();

  /* ──────────────────────────────
     DOT navigation (click)
  ────────────────────────────── */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      if (!journeySection) return;
      const total = journeySection.offsetHeight - window.innerHeight;
      const stageCount = stages.length;
      const targetScroll =
        journeySection.offsetTop + (i / stageCount) * total;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    });
  });

  /* ──────────────────────────────
     PARALLAX — Hero
  ────────────────────────────── */
  const heroLogo = document.querySelector('.hero-logo');
  function onParallax() {
    const scrollY = window.scrollY;
    if (heroLogo && scrollY < window.innerHeight) {
      heroLogo.style.transform =
        `translateY(${scrollY * 0.1}px)`;
    }
  }
  window.addEventListener('scroll', onParallax, { passive: true });

  /* ──────────────────────────────
     Smooth cursor scale for CTAs
  ────────────────────────────── */
  document.querySelectorAll('.cta-btn, .contact-link').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s';
    });
  });

  /* ──────────────────────────────
     Step hover – highlight connector
  ────────────────────────────── */
  document.querySelectorAll('.step').forEach((step) => {
    step.addEventListener('mouseenter', () => {
      step.querySelector('.step-icon')?.classList.add('hovered');
    });
    step.addEventListener('mouseleave', () => {
      step.querySelector('.step-icon')?.classList.remove('hovered');
    });
  });

  /* ──────────────────────────────
     Floating particles on hero
  ────────────────────────────── */
  (function createParticles() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const colors = ['#FFD45A', '#AEE5AF', '#97ADFF', '#EDEDED'];
    const count = 18;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position: absolute;
        width: ${Math.random() * 5 + 2}px;
        height: ${Math.random() * 5 + 2}px;
        border-radius: 50%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        opacity: ${Math.random() * 0.25 + 0.05};
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: particle-float ${Math.random() * 12 + 8}s ease-in-out ${Math.random() * 8}s infinite alternate;
        pointer-events: none;
      `;
      hero.appendChild(p);
    }

    // Inject keyframe if not present
    if (!document.getElementById('particle-keyframes')) {
      const style = document.createElement('style');
      style.id = 'particle-keyframes';
      style.textContent = `
        @keyframes particle-float {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 30 + 10)}px, -${Math.floor(Math.random() * 40 + 20)}px) scale(0.7); }
        }
      `;
      document.head.appendChild(style);
    }
  })();

  /* ──────────────────────────────
     Manifesto text split animation
  ────────────────────────────── */
  const manifestoObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.manifesto-sub').forEach((el) => {
    manifestoObs.observe(el);
  });

  /* ──────────────────────────────
     Mode card tilt on hover (desktop)
  ────────────────────────────── */
  if (window.matchMedia('(min-width: 900px)').matches) {
    document.querySelectorAll('.mode-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `
          translateY(-8px)
          rotateX(${-y * 6}deg)
          rotateY(${x * 6}deg)
          scale(1.01)
        `;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s';
      });
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  }

})();
