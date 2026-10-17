/* ==========================================================================
   SPROUT DESKTOP — DEDICATED CONTROLLER WITH AUTO-DETECTION
   ========================================================================== */

let dCurrentStep = 1;
let dHistory = [1];
let dVerifyTimer = null;

// ==========================================================================
// AUTO-DETECTION: Screen Width & Resize Engine
// ==========================================================================
(function initAutoDetect() {
  // If user opens desktop.html on a screen <= 768px without forcing desktop view:
  if (window.innerWidth <= 768 && sessionStorage.getItem('sprout_preferred_view') !== 'desktop') {
    window.location.replace('mobile.html');
    return;
  }

  // Detect window resizing to mobile dimensions in real time
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth <= 768 && sessionStorage.getItem('sprout_preferred_view') !== 'desktop') {
        window.location.href = 'mobile.html';
      }
    }, 250);
  });
})();

function switchToMobileView() {
  sessionStorage.setItem('sprout_preferred_view', 'mobile');
  window.location.href = 'mobile.html';
}

function clearViewPreference() {
  sessionStorage.removeItem('sprout_preferred_view');
}

// ==========================================================================
// ONBOARDING FLOW CONTROLLER
// ==========================================================================
function openDesktopOnboarding(step = 1) {
  const modal = document.getElementById('d-onboarding-modal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  dHistory = [step];
  renderDesktopStep(step);
}

function closeDesktopOnboarding() {
  const modal = document.getElementById('d-onboarding-modal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
  if (dVerifyTimer) {
    clearTimeout(dVerifyTimer);
    dVerifyTimer = null;
  }
}

function desktopObNext(step) {
  dHistory.push(step);
  renderDesktopStep(step);
}

function desktopObBack() {
  if (dHistory.length > 1) {
    dHistory.pop();
    renderDesktopStep(dHistory[dHistory.length - 1]);
  } else {
    closeDesktopOnboarding();
  }
}

function renderDesktopStep(step) {
  dCurrentStep = step;

  if (step !== 5 && dVerifyTimer) {
    clearTimeout(dVerifyTimer);
    dVerifyTimer = null;
  }

  // Toggle panes
  const panes = document.querySelectorAll('.d-ob-pane');
  panes.forEach((pane, idx) => {
    pane.classList.toggle('active', idx + 1 === step);
  });

  // Progress Bar
  const fill = document.getElementById('d-progress-fill');
  const text = document.getElementById('d-step-text');
  const back = document.getElementById('d-back-btn');

  fill.style.width = `${(step / 5) * 100}%`;
  text.textContent = `Step ${step} of 5`;
  back.style.visibility = (step === 1) ? 'hidden' : 'visible';

  if (step === 3) {
    backToDesktopPhone();
  }

  if (step === 5) {
    runDesktopVerificationSimulation();
  }
}

function showDesktopOtp() {
  const phone = document.getElementById('d-phone-val').value.trim();
  if (phone.length < 10) {
    alert('Please enter a valid 10-digit mobile number');
    return;
  }
  document.getElementById('d-phone-sub').style.display = 'none';
  document.getElementById('d-otp-sub').style.display = 'block';
}

function backToDesktopPhone() {
  document.getElementById('d-phone-sub').style.display = 'block';
  document.getElementById('d-otp-sub').style.display = 'none';
}

function toggleDesktopWhy(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function toggleDesktopFaq(el) {
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.d-faq-item').forEach(item => item.classList.remove('open'));
  if (!isOpen) el.classList.add('open');
}

function setDesktopLang(lang) {
  document.querySelectorAll('.d-lang-btn').forEach(b => b.classList.toggle('active', b.textContent.toLowerCase().includes(lang)));
  if (lang === 'hi') {
    alert('हिन्दी भाषा (Hindi layout enabled)');
  }
}

function setDesktopObLang(lang) {
  document.getElementById('d-lang-en').classList.toggle('active', lang === 'en');
  document.getElementById('d-lang-hi').classList.toggle('active', lang === 'hi');
  if (lang === 'hi') {
    alert('हिन्दी जल्द आ रहा है (Hindi coming soon)');
  }
}

function runDesktopVerificationSimulation() {
  const waitView = document.getElementById('d-wait-view');
  const successView = document.getElementById('d-success-view');
  const aadhaarStat = document.getElementById('d-aadhaar-stat');
  const accountStat = document.getElementById('d-account-stat');
  const fill = document.getElementById('d-progress-fill');

  waitView.style.display = 'block';
  successView.style.display = 'none';
  fill.style.width = '85%';

  aadhaarStat.className = 'd-stat in-prog';
  aadhaarStat.textContent = '⟳ Verifying Aadhaar with UIDAI...';
  accountStat.className = 'd-stat pend';
  accountStat.textContent = '○ Creating Your Investment Account';

  dVerifyTimer = setTimeout(() => {
    aadhaarStat.className = 'd-stat done';
    aadhaarStat.textContent = '✓ Aadhaar Record Confirmed';
    accountStat.className = 'd-stat in-prog';
    accountStat.textContent = '⟳ Finalizing SEBI Registration...';
    fill.style.width = '95%';

    dVerifyTimer = setTimeout(() => {
      fill.style.width = '100%';
      waitView.style.display = 'none';
      successView.style.display = 'block';
    }, 1300);
  }, 1300);
}

function saveAndRemindLaterDesktop() {
  alert('Progress saved! A reminder has been set for your PAN & Aadhaar.');
  closeDesktopOnboarding();
}
