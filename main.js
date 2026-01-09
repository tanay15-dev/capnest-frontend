// ===== STATE MANAGEMENT =====
class AppState {
  constructor() {
    this.currentScreen = 'splash';
    this.user = {
      phone: '',
      pan: '',
      language: 'en',
      isAccessibleMode: false,
      accessibilityFeatures: {
        voiceGuidance: false,
        largeText: false,
        highContrast: false,
        simpleLanguage: false
      },
      isDisabled: false,
      disabilityDocuments: null,
      creditScore: null,
      existingLoans: [],
      selectedLoan: null,
      loanApplication: null,
      managedLoans: [],
      managedCreditCards: []
    };
    this.voiceEnabled = false;
  }

  setState(updates) {
    Object.assign(this.user, updates);
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem('capnest_user', JSON.stringify(this.user));
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem('capnest_user');
    if (saved) {
      this.user = { ...this.user, ...JSON.parse(saved) };
    }
  }

  reset() {
    this.user = {
      phone: '',
      pan: '',
      language: 'en',
      isAccessibleMode: false,
      accessibilityFeatures: {
        voiceGuidance: false,
        largeText: false,
        highContrast: false,
        simpleLanguage: false
      },
      isDisabled: false,
      disabilityDocuments: null,
      creditScore: null,
      existingLoans: [],
      selectedLoan: null,
      loanApplication: null,
      managedLoans: [],
      managedCreditCards: []
    };
    localStorage.removeItem('capnest_user');
  }
}

const appState = new AppState();
window.appState = appState; // Export to global scope

// ===== VOICE ASSISTANT =====
class VoiceAssistant {
  constructor() {
    this.synth = window.speechSynthesis;
    this.enabled = false;
    this.currentLanguage = 'en-US';
    this.languageMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'mr': 'mr-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'es': 'es-ES',
      'zh': 'zh-CN'
    };
  }

  setLanguage(lang) {
    this.currentLanguage = this.languageMap[lang] || 'en-US';
  }

  speak(text) {
    if (!this.enabled || !text) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.currentLanguage;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    this.synth.speak(utterance);
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
    this.synth.cancel();
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.synth.cancel();
    }
  }
}

const voiceAssistant = new VoiceAssistant();
window.voiceAssistant = voiceAssistant; // Export to global scope

// ===== TRANSLATIONS =====
const translations = {
  en: {
    appName: 'CapNest',
    tagline: 'Equal access to loans and protection for everyone.',
    trustTitle: 'Your Trust, Our Priority',
    trustPoint1: 'Works with regulated banks and approved financial partners',
    trustPoint2: 'No hidden charges',
    trustPoint3: 'No loan submitted without your consent',
    trustPoint4: 'Your data is secure and encrypted',
    understand: 'I Understand',
    selectLanguage: 'Select Your Language',
    start: 'Start',
    accessibleMode: 'Accessible Mode',
    enterPhone: 'Enter Your Mobile Number',
    enterOTP: 'Enter OTP',
    verify: 'Verify',
    enterPAN: 'Enter Your PAN Card Number',
    continue: 'Continue',
    dashboard: 'Dashboard',
    applyLoan: 'Apply for Loan',
    insurance: 'Insurance',
    trackStatus: 'Track Applications',
    helpSupport: 'Help & Support',
    manageLoans: 'Manage Loans',
    loanApproved: 'Loan Approved!',
    loanRejected: 'Application Not Approved',
    disbursementPending: 'Disbursement Pending',
    confirmDisbursement: 'Confirm Disbursement',
    creditScore: 'Credit Score',
    approvalChance: 'Approval Probability'
  },
  hi: {
    appName: 'कैपनेस्ट',
    tagline: 'सभी के लिए ऋण और सुरक्षा तक समान पहुंच।',
    trustTitle: 'आपका विश्वास, हमारी प्राथमिकता',
    trustPoint1: 'विनियमित बैंकों और अनुमोदित वित्तीय साझेदारों के साथ काम करता है',
    trustPoint2: 'कोई छिपा हुआ शुल्क नहीं',
    trustPoint3: 'आपकी सहमति के बिना कोई ऋण जमा नहीं',
    trustPoint4: 'आपका डेटा सुरक्षित और एन्क्रिप्टेड है',
    understand: 'मैं समझता हूं',
    selectLanguage: 'अपनी भाषा चुनें',
    start: 'शुरू करें',
    accessibleMode: 'सुलभ मोड',
    enterPhone: 'अपना मोबाइल नंबर दर्ज करें',
    enterOTP: 'OTP दर्ज करें',
    verify: 'सत्यापित करें',
    enterPAN: 'अपना पैन कार्ड नंबर दर्ज करें',
    continue: 'जारी रखें',
    dashboard: 'डैशबोर्ड',
    applyLoan: 'ऋण के लिए आवेदन करें',
    insurance: 'बीमा',
    trackStatus: 'आवेदन ट्रैक करें',
    helpSupport: 'सहायता और समर्थन',
    manageLoans: 'ऋण प्रबंधित करें',
    loanApproved: 'ऋण स्वीकृत!',
    loanRejected: 'आवेदन स्वीकृत नहीं',
    disbursementPending: 'वितरण लंबित',
    confirmDisbursement: 'वितरण की पुष्टि करें',
    creditScore: 'क्रेडिट स्कोर',
    approvalChance: 'स्वीकृति संभावना'
  }
  // Add more languages as needed
};

function t(key) {
  const lang = appState.user.language || 'en';
  return translations[lang]?.[key] || translations['en'][key] || key;
}

// ===== UTILITY FUNCTIONS =====
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function showLoader() {
  const loader = document.createElement('div');
  loader.className = 'loader';
  loader.id = 'global-loader';
  document.body.appendChild(loader);
}

function hideLoader() {
  const loader = document.getElementById('global-loader');
  if (loader) loader.remove();
}

// ===== SCREEN RENDERER =====
function renderScreen(screenName, content) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="screen">
      <div class="screen-content">
        ${content}
      </div>
    </div>
  `;
  appState.currentScreen = screenName;
}

// Export utility functions to global scope
window.showToast = showToast;
window.showLoader = showLoader;
window.hideLoader = hideLoader;
window.renderScreen = renderScreen;
window.t = t;

// ===== SCREENS =====

// Splash Screen
function showSplashScreen() {
  renderScreen('splash', `
    <h1 style="font-size: calc(var(--font-size-5xl) * 1.2); margin-bottom: var(--spacing-md);">
      ${t('appName')}
    </h1>
    <p style="font-size: calc(var(--font-size-xl) * var(--accessible-font-multiplier)); color: var(--text-secondary); max-width: 500px; margin: 0 auto;">
      ${t('tagline')}
    </p>
  `);

  voiceAssistant.speak(t('appName') + '. ' + t('tagline'));

  setTimeout(() => {
    showTrustPopup();
  }, 2000);
}

// Trust Popup
function showTrustPopup() {
  const app = document.getElementById('app');
  app.innerHTML += `
    <div class="modal-overlay" id="trust-modal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">${t('trustTitle')}</h2>
        </div>
        <div class="modal-body">
          <ul style="text-align: left; list-style: none; padding: 0;">
            <li style="margin-bottom: var(--spacing-sm); padding-left: var(--spacing-lg); position: relative;">
              <span style="position: absolute; left: 0; color: var(--success-color);">✓</span>
              ${t('trustPoint1')}
            </li>
            <li style="margin-bottom: var(--spacing-sm); padding-left: var(--spacing-lg); position: relative;">
              <span style="position: absolute; left: 0; color: var(--success-color);">✓</span>
              ${t('trustPoint2')}
            </li>
            <li style="margin-bottom: var(--spacing-sm); padding-left: var(--spacing-lg); position: relative;">
              <span style="position: absolute; left: 0; color: var(--success-color);">✓</span>
              ${t('trustPoint3')}
            </li>
            <li style="margin-bottom: var(--spacing-sm); padding-left: var(--spacing-lg); position: relative;">
              <span style="position: absolute; left: 0; color: var(--success-color);">✓</span>
              ${t('trustPoint4')}
            </li>
          </ul>
        </div>
        <div class="modal-footer" style="margin-top: var(--spacing-lg);">
          <button class="btn btn-primary btn-large" onclick="closeTrustPopup()" style="width: 100%;">
            ${t('understand')}
          </button>
        </div>
      </div>
    </div>
  `;

  voiceAssistant.speak(t('trustTitle') + '. ' + t('trustPoint1') + '. ' + t('trustPoint2') + '. ' + t('trustPoint3') + '. ' + t('trustPoint4'));
}

function closeTrustPopup() {
  document.getElementById('trust-modal').remove();
  showLanguageSelection();
}

// Language Selection
function showLanguageSelection() {
  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'zh', name: 'Mandarin', native: '中文' }
  ];

  renderScreen('language', `
    <h2 style="margin-bottom: var(--spacing-xl);">${t('selectLanguage')}</h2>
    <div class="grid grid-3">
      ${languages.map(lang => `
        <div class="card card-interactive" onclick="selectLanguage('${lang.code}')">
          <h3 style="margin-bottom: var(--spacing-xs);">${lang.native}</h3>
          <p style="font-size: var(--font-size-sm); color: var(--text-muted);">${lang.name}</p>
        </div>
      `).join('')}
    </div>
  `);

  voiceAssistant.speak(t('selectLanguage'));
}

function selectLanguage(langCode) {
  appState.setState({ language: langCode });
  voiceAssistant.setLanguage(langCode);
  showHomeScreen();
}

// Home Screen with Start and Accessible Mode
function showHomeScreen() {
  renderScreen('home', `
    <div style="position: relative;">
      <button class="accessibility-toggle" onclick="showAccessibilitySetup()">
        👁️ ${t('accessibleMode')}
      </button>
      
      <h1 style="font-size: calc(var(--font-size-5xl) * 1.2); margin-bottom: var(--spacing-xl);">
        ${t('appName')}
      </h1>
      
      <button class="btn btn-primary btn-large" onclick="startNormalFlow()" style="min-width: 200px;">
        ${t('start')}
      </button>
    </div>
  `);

  voiceAssistant.speak('Welcome to ' + t('appName') + '. Click Start to begin or enable Accessible Mode.');
}

// Accessibility Setup
function showAccessibilitySetup() {
  renderScreen('accessibility', `
    <h2 style="margin-bottom: var(--spacing-lg);">Accessibility Features</h2>
    <p style="margin-bottom: var(--spacing-xl);">Select features that will help you:</p>
    
    <div class="grid grid-2" style="text-align: left;">
      <div class="card card-interactive" onclick="toggleAccessibilityFeature('voiceGuidance')">
        <h3>🔊 Voice Guidance</h3>
        <p>Screen read-out for all content</p>
        <div id="voice-indicator" class="badge badge-info mt-sm">Disabled</div>
      </div>
      
      <div class="card card-interactive" onclick="toggleAccessibilityFeature('largeText')">
        <h3>👁️ Large Text</h3>
        <p>Increased font size</p>
        <div id="largetext-indicator" class="badge badge-info mt-sm">Disabled</div>
      </div>
      
      <div class="card card-interactive" onclick="toggleAccessibilityFeature('highContrast')">
        <h3>🌓 High Contrast</h3>
        <p>Enhanced visibility</p>
        <div id="contrast-indicator" class="badge badge-info mt-sm">Disabled</div>
      </div>
      
      <div class="card card-interactive" onclick="toggleAccessibilityFeature('simpleLanguage')">
        <h3>🧠 Simple Language</h3>
        <p>Easy to understand content</p>
        <div id="simple-indicator" class="badge badge-info mt-sm">Disabled</div>
      </div>
    </div>
    
    <button class="btn btn-primary btn-large mt-xl" onclick="confirmAccessibilitySetup()">
      ${t('continue')}
    </button>
  `);

  voiceAssistant.enable();
  voiceAssistant.speak('Accessibility setup. Select features that will help you. Voice guidance, Large text, High contrast, or Simple language mode.');
}

function toggleAccessibilityFeature(feature) {
  const current = appState.user.accessibilityFeatures[feature];
  appState.user.accessibilityFeatures[feature] = !current;

  const indicator = document.getElementById(`${feature === 'voiceGuidance' ? 'voice' : feature === 'largeText' ? 'largetext' : feature === 'highContrast' ? 'contrast' : 'simple'}-indicator`);

  if (appState.user.accessibilityFeatures[feature]) {
    indicator.textContent = 'Enabled';
    indicator.className = 'badge badge-success mt-sm';

    if (feature === 'voiceGuidance') {
      voiceAssistant.enable();
    } else if (feature === 'largeText') {
      document.body.style.setProperty('--accessible-font-multiplier', '1.3');
    } else if (feature === 'highContrast') {
      document.body.classList.add('high-contrast');
    }

    voiceAssistant.speak(feature + ' enabled');
  } else {
    indicator.textContent = 'Disabled';
    indicator.className = 'badge badge-info mt-sm';

    if (feature === 'voiceGuidance') {
      voiceAssistant.disable();
    } else if (feature === 'largeText') {
      document.body.style.setProperty('--accessible-font-multiplier', '1');
    } else if (feature === 'highContrast') {
      document.body.classList.remove('high-contrast');
    }
  }
}

function confirmAccessibilitySetup() {
  appState.setState({ isAccessibleMode: true });
  document.body.classList.add('accessible-mode');
  showTrustPopupAccessible();
}

function showTrustPopupAccessible() {
  const app = document.getElementById('app');
  app.innerHTML += `
    <div class="modal-overlay" id="trust-modal-accessible">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">${t('trustTitle')}</h2>
        </div>
        <div class="modal-body">
          <ul style="text-align: left; list-style: none; padding: 0;">
            <li style="margin-bottom: var(--spacing-md); padding-left: var(--spacing-lg); position: relative;">
              <span style="position: absolute; left: 0; color: var(--success-color); font-size: var(--font-size-xl);">✓</span>
              ${t('trustPoint1')}
            </li>
            <li style="margin-bottom: var(--spacing-md); padding-left: var(--spacing-lg); position: relative;">
              <span style="position: absolute; left: 0; color: var(--success-color); font-size: var(--font-size-xl);">✓</span>
              ${t('trustPoint2')}
            </li>
            <li style="margin-bottom: var(--spacing-md); padding-left: var(--spacing-lg); position: relative;">
              <span style="position: absolute; left: 0; color: var(--success-color); font-size: var(--font-size-xl);">✓</span>
              ${t('trustPoint3')}
            </li>
            <li style="margin-bottom: var(--spacing-md); padding-left: var(--spacing-lg); position: relative;">
              <span style="position: absolute; left: 0; color: var(--success-color); font-size: var(--font-size-xl);">✓</span>
              No extra charges for persons with disabilities
            </li>
          </ul>
        </div>
        <div class="modal-footer" style="margin-top: var(--spacing-lg);">
          <button class="btn btn-primary btn-large" onclick="closeTrustPopupAccessible()" style="width: 100%;">
            ${t('understand')}
          </button>
        </div>
      </div>
    </div>
  `;

  voiceAssistant.speak(t('trustTitle') + '. ' + t('trustPoint1') + '. ' + t('trustPoint2') + '. ' + t('trustPoint3') + '. No extra charges for persons with disabilities. Click I understand to continue.');
}

function closeTrustPopupAccessible() {
  document.getElementById('trust-modal-accessible').remove();
  showPhoneInput();
}

// Normal Flow Start
function startNormalFlow() {
  showPhoneInput();
}

// Phone Input
function showPhoneInput() {
  renderScreen('phone', `
    <h2 style="margin-bottom: var(--spacing-xl);">${t('enterPhone')}</h2>
    
    <div class="input-group">
      <input 
        type="tel" 
        class="input" 
        id="phone-input" 
        placeholder="10-digit mobile number"
        maxlength="10"
        style="text-align: center; font-size: calc(var(--font-size-xl) * var(--accessible-font-multiplier));"
      />
    </div>
    
    <button class="btn btn-primary btn-large" onclick="sendOTP()">
      ${t('continue')}
    </button>
  `);

  voiceAssistant.speak(t('enterPhone'));

  document.getElementById('phone-input').focus();
}

function sendOTP() {
  const phone = document.getElementById('phone-input').value;

  if (phone.length !== 10) {
    showToast('Please enter a valid 10-digit mobile number', 'error');
    voiceAssistant.speak('Please enter a valid 10-digit mobile number');
    return;
  }

  appState.setState({ phone });
  showOTPInput();
}

// OTP Input
function showOTPInput() {
  renderScreen('otp', `
    <h2 style="margin-bottom: var(--spacing-md);">${t('enterOTP')}</h2>
    <p style="margin-bottom: var(--spacing-xl);">Sent to ${appState.user.phone}</p>
    
    <div class="input-group">
      <input 
        type="text" 
        class="input" 
        id="otp-input" 
        placeholder="6-digit OTP"
        maxlength="6"
        style="text-align: center; font-size: calc(var(--font-size-2xl) * var(--accessible-font-multiplier)); letter-spacing: 0.5em;"
      />
    </div>
    
    <button class="btn btn-primary btn-large" onclick="verifyOTP()">
      ${t('verify')}
    </button>
  `);

  voiceAssistant.speak(t('enterOTP') + ' sent to ' + appState.user.phone);

  // Simulate OTP (in real app, this would be sent via SMS)
  const mockOTP = '123456';
  console.log('Mock OTP:', mockOTP);

  if (appState.user.isAccessibleMode && appState.user.accessibilityFeatures.voiceGuidance) {
    setTimeout(() => {
      voiceAssistant.speak('Your OTP is 1 2 3 4 5 6');
    }, 2000);
  }

  document.getElementById('otp-input').focus();
}

function verifyOTP() {
  const otp = document.getElementById('otp-input').value;

  if (otp.length !== 6) {
    showToast('Please enter a valid 6-digit OTP', 'error');
    voiceAssistant.speak('Please enter a valid 6-digit OTP');
    return;
  }

  // Simulate verification
  showLoader();
  setTimeout(() => {
    hideLoader();
    showPANInput();
  }, 1500);
}

// PAN Input
function showPANInput() {
  renderScreen('pan', `
    <h2 style="margin-bottom: var(--spacing-xl);">${t('enterPAN')}</h2>
    
    <div class="input-group">
      <input 
        type="text" 
        class="input" 
        id="pan-input" 
        placeholder="ABCDE1234F"
        maxlength="10"
        style="text-align: center; font-size: calc(var(--font-size-xl) * var(--accessible-font-multiplier)); text-transform: uppercase;"
      />
    </div>
    
    <p style="font-size: var(--font-size-sm); color: var(--text-muted); margin-top: var(--spacing-md);">
      We'll check your credit score and existing loans with your consent
    </p>
    
    <button class="btn btn-primary btn-large mt-lg" onclick="submitPAN()">
      ${t('continue')}
    </button>
  `);

  voiceAssistant.speak(t('enterPAN') + '. We will check your credit score and existing loans with your consent.');

  document.getElementById('pan-input').focus();
}

function submitPAN() {
  const pan = document.getElementById('pan-input').value.toUpperCase();

  if (pan.length !== 10) {
    showToast('Please enter a valid PAN number', 'error');
    voiceAssistant.speak('Please enter a valid PAN number');
    return;
  }

  appState.setState({ pan });

  // Simulate fetching credit score and loans
  showLoader();
  setTimeout(() => {
    hideLoader();

    // Mock data - Multiple loans and credit cards
    const mockCreditScore = Math.floor(Math.random() * (800 - 600) + 600); // Random score between 600-800
    const mockExistingLoans = [
      {
        bank: 'HDFC Bank',
        type: 'Personal Loan',
        amount: 200000,
        emi: 8500,
        dueDate: new Date(2026, 0, 15), // Jan 15, 2026
        tenure: 36,
        remainingTenure: 24
      },
      {
        bank: 'SBI',
        type: 'Home Loan',
        amount: 2500000,
        emi: 25000,
        dueDate: new Date(2026, 0, 5), // Jan 5, 2026
        tenure: 240,
        remainingTenure: 220
      }
    ];

    const mockCreditCards = [
      {
        bank: 'ICICI Bank',
        cardName: 'Platinum Credit Card',
        limit: 200000,
        used: 45000,
        emi: 5000,
        dueDate: new Date(2026, 0, 20) // Jan 20, 2026
      }
    ];

    appState.setState({
      creditScore: mockCreditScore,
      existingLoans: mockExistingLoans,
      managedCreditCards: mockCreditCards
    });

    // Small delay to ensure all modules are loaded
    setTimeout(() => {
      if (appState.user.isAccessibleMode) {
        showDisabilityCheck();
      } else {
        if (typeof window.showDashboard === 'function') {
          window.showDashboard();
        } else {
          console.error('showDashboard not loaded yet');
          showToast('Loading dashboard...', 'info');
          setTimeout(() => window.showDashboard(), 500);
        }
      }
    }, 100);
  }, 2000);
}

// Disability Check (Accessible Mode Only)
function showDisabilityCheck() {
  renderScreen('disability-check', `
    <h2 style="margin-bottom: var(--spacing-lg);">Disability Information</h2>
    <p style="margin-bottom: var(--spacing-xl);">
      Are you living with a disability? This information is only for better support and will help you get priority assistance.
    </p>
    
    <div class="grid grid-2">
      <button class="btn btn-primary btn-large" onclick="confirmDisability(true)">
        Yes
      </button>
      <button class="btn btn-secondary btn-large" onclick="confirmDisability(false)">
        No
      </button>
    </div>
  `);

  voiceAssistant.speak('Are you living with a disability? This information is only for better support and will help you get priority assistance.');
}

function confirmDisability(isDisabled) {
  if (isDisabled) {
    showDisabilityDocumentUpload();
  } else {
    appState.setState({ isDisabled: false });
    setTimeout(() => {
      if (typeof window.showDashboard === 'function') {
        window.showDashboard();
      } else {
        showToast('Loading dashboard...', 'info');
        setTimeout(() => window.showDashboard(), 500);
      }
    }, 100);
  }
}

// Disability Document Upload
function showDisabilityDocumentUpload() {
  renderScreen('disability-docs', `
    <h2 style="margin-bottom: var(--spacing-lg);">Upload Disability Certificate</h2>
    <p style="margin-bottom: var(--spacing-xl);">
      Please upload your disability certificate for verification. This will give you priority assistance.
    </p>
    
    <div class="input-group">
      <input 
        type="file" 
        class="input" 
        id="disability-doc-input"
        accept="image/*,.pdf"
      />
    </div>
    
    <div class="grid grid-2 mt-lg">
      <button class="btn btn-secondary btn-large" onclick="showHomeScreen()">
        Skip
      </button>
      <button class="btn btn-primary btn-large" onclick="verifyDisabilityDocument()">
        Upload & Verify
      </button>
    </div>
  `);

  voiceAssistant.speak('Upload your disability certificate for verification. This will give you priority assistance.');
}

function verifyDisabilityDocument() {
  const fileInput = document.getElementById('disability-doc-input');

  if (!fileInput.files || fileInput.files.length === 0) {
    showToast('Please select a document to upload', 'error');
    voiceAssistant.speak('Please select a document to upload');
    return;
  }

  showLoader();

  // Simulate AI verification
  setTimeout(() => {
    hideLoader();

    // Mock verification success
    appState.setState({
      isDisabled: true,
      disabilityDocuments: fileInput.files[0].name
    });

    showToast('Document verified successfully', 'success');
    voiceAssistant.speak('Document verified successfully. You will receive priority assistance.');

    setTimeout(() => {
      if (typeof window.showDashboard === 'function') {
        window.showDashboard();
      } else {
        showToast('Loading dashboard...', 'info');
        setTimeout(() => window.showDashboard(), 500);
      }
    }, 1500);
  }, 3000);
}

// Export functions to global scope
window.closeTrustPopup = closeTrustPopup;
window.selectLanguage = selectLanguage;
window.showAccessibilitySetup = showAccessibilitySetup;
window.toggleAccessibilityFeature = toggleAccessibilityFeature;
window.confirmAccessibilitySetup = confirmAccessibilitySetup;
window.closeTrustPopupAccessible = closeTrustPopupAccessible;
window.startNormalFlow = startNormalFlow;
window.sendOTP = sendOTP;
window.verifyOTP = verifyOTP;
window.submitPAN = submitPAN;
window.confirmDisability = confirmDisability;
window.verifyDisabilityDocument = verifyDisabilityDocument;

// Initialize app
appState.loadFromLocalStorage();
showSplashScreen();
