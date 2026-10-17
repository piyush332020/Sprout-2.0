/* ==========================================================================
   SPROUT MOBILE — DEDICATED CONTROLLER WITH AUTO-DETECTION
   ========================================================================== */

let mCurrentStep = 1;
let mHistory = [1];
let mVerifyTimer = null;

// ==========================================================================
// AUTO-DETECTION: Screen Width & Resize Engine
// ==========================================================================
(function initMobileAutoDetect() {
  // If user opens mobile.html on a desktop display > 900px without forcing mobile view:
  if (window.innerWidth > 900 && sessionStorage.getItem('sprout_preferred_view') !== 'mobile') {
    window.location.replace('desktop.html');
    return;
  }

  // Detect window resizing to desktop dimensions in real time
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 900 && sessionStorage.getItem('sprout_preferred_view') !== 'mobile') {
        window.location.href = 'desktop.html';
      }
    }, 250);
  });
})();

function switchToDesktopView() {
  sessionStorage.setItem('sprout_preferred_view', 'desktop');
  window.location.href = 'desktop.html';
}

function clearMobileViewPreference() {
  sessionStorage.removeItem('sprout_preferred_view');
}

// ==========================================================================
// MOBILE ONBOARDING FLOW CONTROLLER
// ==========================================================================
function openOnboarding(step = 1) {
  const modal = document.getElementById('m-onboarding-container');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  mHistory = [step];
  renderMobileStep(step);
}

function closeOnboarding() {
  const modal = document.getElementById('m-onboarding-container');
  modal.style.display = 'none';
  document.body.style.overflow = '';
  if (mVerifyTimer) {
    clearTimeout(mVerifyTimer);
    mVerifyTimer = null;
  }
}

function onboardingNext(step) {
  mHistory.push(step);
  renderMobileStep(step);
}

function onboardingBack() {
  if (mHistory.length > 1) {
    mHistory.pop();
    renderMobileStep(mHistory[mHistory.length - 1]);
  } else {
    closeOnboarding();
  }
}

function renderMobileStep(step) {
  mCurrentStep = step;

  if (step !== 5 && mVerifyTimer) {
    clearTimeout(mVerifyTimer);
    mVerifyTimer = null;
  }

  // Toggle panes
  const panes = document.querySelectorAll('.m-ob-pane');
  panes.forEach((pane, idx) => {
    pane.classList.toggle('active', idx + 1 === step);
  });

  // Update progress
  const fill = document.getElementById('m-progress-fill');
  const text = document.getElementById('m-step-text');
  const back = document.getElementById('m-btn-back');

  fill.style.width = `${(step / 5) * 100}%`;
  text.textContent = `${step}/5`;
  back.style.visibility = (step === 1) ? 'hidden' : 'visible';

  if (step === 3) {
    editPhoneMobile();
  }

  if (step === 5) {
    runMobileVerificationSimulation();
  }
}

function sendOtpMobile() {
  const phone = document.getElementById('m-phone-input').value.trim();
  if (phone.length < 10) {
    alert('Please enter a valid 10-digit mobile number');
    return;
  }
  document.getElementById('m-phone-view').style.display = 'none';
  document.getElementById('m-otp-view').style.display = 'block';
}

function editPhoneMobile() {
  document.getElementById('m-phone-view').style.display = 'block';
  document.getElementById('m-otp-view').style.display = 'none';
}

function toggleMobileHelp(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function toggleMobileFaq(el) {
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.m-faq-item').forEach(item => item.classList.remove('open'));
  if (!isOpen) el.classList.add('open');
}

function setMobileLang(lang) {
  document.querySelectorAll('.m-lang-btn').forEach(b => b.classList.toggle('active', b.id.includes(lang)));
  if (lang === 'hi') {
    alert('हिन्दी भाषा (Hindi layout enabled)');
  }
}

function setObLang(lang) {
  document.getElementById('m-ob-lang-en').classList.toggle('active', lang === 'en');
  document.getElementById('m-ob-lang-hi').classList.toggle('active', lang === 'hi');
  if (lang === 'hi') {
    alert('हिन्दी जल्द आ रहा है (Hindi coming soon)');
  }
}

function runMobileVerificationSimulation() {
  const waitView = document.getElementById('m-wait-view');
  const successView = document.getElementById('m-success-view');
  const aadhaarStatus = document.getElementById('m-aadhaar-status');
  const accountStatus = document.getElementById('m-account-status');
  const fill = document.getElementById('m-progress-fill');

  waitView.style.display = 'block';
  successView.style.display = 'none';
  fill.style.width = '85%';

  aadhaarStatus.className = 'm-status-row active';
  aadhaarStatus.textContent = '⟳ Verifying Aadhaar with UIDAI...';
  accountStatus.className = 'm-status-row pending';
  accountStatus.textContent = '○ Setting up your investment account';

  mVerifyTimer = setTimeout(() => {
    aadhaarStatus.className = 'm-status-row done';
    aadhaarStatus.textContent = '✓ Aadhaar Record Confirmed';
    accountStatus.className = 'm-status-row active';
    accountStatus.textContent = '⟳ Finalizing SEBI Registration...';
    fill.style.width = '95%';

    mVerifyTimer = setTimeout(() => {
      fill.style.width = '100%';
      waitView.style.display = 'none';
      successView.style.display = 'block';
    }, 1300);
  }, 1300);
}

function saveAndRemindLater() {
  alert('Progress saved! A reminder has been set for your PAN & Aadhaar.');
  closeOnboarding();
}

function completeMobileInvestment() {
  alert('🎉 Congratulations! You have completed mobile onboarding. Entering the ₹100 UPI payment flow.');
}
