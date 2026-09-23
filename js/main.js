/* ============================================
   CREDO PEST CONTROL — JavaScript v4
   ============================================ */

// ---- Header scroll ----
const siteHeader = document.getElementById('site-header');
const heroWrap   = document.querySelector('.hero-slider-wrap');
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset > 40;
  siteHeader.classList.toggle('header-scrolled', scrolled);
  if (heroWrap) heroWrap.style.paddingTop = scrolled ? '72px' : '108px';
}, { passive: true });

// ---- Mobile menu ----
const menuBtn    = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn) menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
function closeMobileMenu() { mobileMenu && mobileMenu.classList.add('hidden'); }

// ---- Smooth scroll ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = siteHeader ? siteHeader.offsetHeight + 8 : 90;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
    closeMobileMenu();
  });
});

// ============================
// HERO SLIDER
// ============================
const slides   = document.querySelectorAll('.slide');
const dots     = document.querySelectorAll('.dot');
const prevBtn  = document.getElementById('sliderPrev');
const nextBtn  = document.getElementById('sliderNext');
let current    = 0;
let autoTimer  = null;

function goTo(idx) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (idx + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}
function startAuto() { stopAuto(); autoTimer = setInterval(() => goTo(current + 1), 5500); }
function stopAuto()  { if (autoTimer) clearInterval(autoTimer); }

if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); startAuto(); }));

let touchX = 0;
const slider = document.getElementById('heroSlider');
if (slider) {
  slider.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); startAuto(); }
  }, { passive: true });
}
startAuto();

// ============================
// SERVICE TABS
// ============================
const svcTabs   = document.querySelectorAll('.svc-tab');
const svcPanels = document.querySelectorAll('.svc-panel');

svcTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    svcTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    svcPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const panel = document.getElementById('tab-' + target);
    if (panel) {
      panel.classList.add('active');
      // Re-trigger reveals for newly shown cards
      panel.querySelectorAll('.reveal:not(.visible)').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 60);
      });
    }
  });
});

// ============================
// ENQUIRY FORM
// ============================
const form      = document.getElementById('enquiryForm');
const submitBtn = document.getElementById('formSubmitBtn');
const success   = document.getElementById('formSuccess');

function showError(fieldId, msg) {
  const el = document.getElementById('err-' + fieldId);
  const input = document.getElementById(fieldId);
  if (el) el.textContent = msg;
  if (input) input.classList.add('error');
}
function clearError(fieldId) {
  const el = document.getElementById('err-' + fieldId);
  const input = document.getElementById(fieldId);
  if (el) el.textContent = '';
  if (input) input.classList.remove('error');
}

// Live validation
['fname', 'fphone', 'fproperty'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => clearError(id));
});

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name  = document.getElementById('fname');
    const phone = document.getElementById('fphone');
    const prop  = document.getElementById('fproperty');
    const pests = [...document.querySelectorAll('input[name="pest"]:checked')];

    // Validate name
    if (!name.value.trim() || name.value.trim().length < 2) {
      showError('fname', 'Please enter your full name'); valid = false;
    } else clearError('fname');

    // Validate phone
    if (!/^[6-9]\d{9}$/.test(phone.value.trim())) {
      showError('fphone', 'Enter a valid 10-digit mobile number'); valid = false;
    } else clearError('fphone');

    // Validate property type
    if (!prop.value) {
      showError('fproperty', 'Please select property type'); valid = false;
    } else clearError('fproperty');

    // Validate pest selection
    if (pests.length === 0) {
      document.getElementById('err-pest').textContent = 'Please select at least one pest type';
      valid = false;
    } else {
      document.getElementById('err-pest').textContent = '';
    }

    if (!valid) return;

    // Animate button
    submitBtn.textContent = '⏳ Submitting...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      form.style.display = 'none';
      success.classList.remove('hidden');
      success.style.display = 'flex';

      // Build WhatsApp message and open
      const pestList = pests.map(p => p.value).join(', ');
      const msg = encodeURIComponent(
        `Hi CREDO Pest Control!\n\nName: ${name.value.trim()}\nPhone: ${phone.value.trim()}\nProperty: ${prop.value}\nPests: ${pestList}\n\nPlease contact me for a free inspection.`
      );
      setTimeout(() => {
        window.open('https://wa.me/919994382776?text=' + msg, '_blank');
      }, 1000);
    }, 1200);
  });
}

// ============================
// COUNTER ANIMATION
// ============================
function animateCounter(el, target, ms = 1600) {
  const step = target / (ms / 16);
  let v = 0;
  const t = setInterval(() => {
    v += step;
    if (v >= target) {
      el.textContent = target >= 1000 ? target.toLocaleString() : target;
      clearInterval(t);
    } else {
      el.textContent = Math.floor(v) >= 1000 ? Math.floor(v).toLocaleString() : Math.floor(v);
    }
  }, 16);
}

// ============================
// INTERSECTION OBSERVER
// ============================
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const siblings = [...(entry.target.parentElement?.querySelectorAll('.reveal') || [])];
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), Math.min(idx * 55, 320));
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Counter
const statsSection = document.querySelector('.stats-bar');
if (statsSection) {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.counter[data-target]').forEach(el =>
        animateCounter(el, parseInt(el.dataset.target))
      );
    });
  }, { threshold: 0.4 }).observe(statsSection);
}

// ============================
// ACTIVE NAV HIGHLIGHT
// ============================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  const top = window.scrollY + (siteHeader ? siteHeader.offsetHeight + 10 : 100);
  sections.forEach(sec => {
    if (sec.offsetTop <= top && sec.offsetTop + sec.offsetHeight > top) {
      navLinks.forEach(l => {
        l.style.color = l.getAttribute('href') === `#${sec.id}` ? '#3B2FE8' : '';
      });
    }
  });
}, { passive: true });

// ============================
// SCROLL TO TOP BUTTON
// ============================
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.pageYOffset > 320);
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

console.log('%cCREDO Pest Control ✓ — உங்கள் வீடு, எங்கள் பொறுப்பு', 'color:#6A3FD4;font-size:14px;font-weight:bold;');
