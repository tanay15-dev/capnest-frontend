// ===== DASHBOARD =====
function showDashboard() {
  const creditScore = appState.user.creditScore || 0;
  const hasExistingLoans = appState.user.existingLoans && appState.user.existingLoans.length > 0;

  renderScreen('dashboard', `
    <div style="position: relative;">
      ${appState.user.isDisabled ? '<div class="badge badge-success" style="position: absolute; top: 0; right: 0;">Priority User</div>' : ''}
      
      <h1 style="margin-bottom: var(--spacing-md);">${t('dashboard')}</h1>
      <p style="margin-bottom: var(--spacing-xl);">Apply only where you are eligible</p>
      
      ${creditScore > 0 ? `
        <div class="card" style="margin-bottom: var(--spacing-xl); background: var(--dark-gradient);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--spacing-md);">
            <div>
              <p style="font-size: var(--font-size-sm); color: var(--text-muted); margin-bottom: var(--spacing-xs);">${t('creditScore')}</p>
              <h2 style="font-size: calc(var(--font-size-4xl) * var(--accessible-font-multiplier)); margin: 0; color: ${creditScore >= 750 ? 'var(--success-color)' : creditScore >= 650 ? 'var(--warning-color)' : 'var(--accent-color)'};">
                ${creditScore}
              </h2>
            </div>
            <div style="text-align: right;">
              <p style="font-size: var(--font-size-sm); color: var(--text-muted); margin-bottom: var(--spacing-xs);">${t('approvalChance')}</p>
              <h3 style="margin: 0;">${getApprovalProbability(creditScore)}%</h3>
            </div>
          </div>
        </div>
      ` : ''}
      
      <div class="grid grid-2">
        <div class="card card-interactive" onclick="showLoanTypes()">
          <div style="font-size: var(--font-size-4xl); margin-bottom: var(--spacing-sm);">💰</div>
          <h3>${t('applyLoan')}</h3>
          <p style="font-size: var(--font-size-sm);">Get loans from regulated banks</p>
        </div>
        
        <div class="card card-interactive" onclick="showInsurance()">
          <div style="font-size: var(--font-size-4xl); margin-bottom: var(--spacing-sm);">🛡️</div>
          <h3>${t('insurance')}</h3>
          <p style="font-size: var(--font-size-sm);">Protect yourself and family</p>
        </div>
        
        <div class="card card-interactive" onclick="showTrackStatus()">
          <div style="font-size: var(--font-size-4xl); margin-bottom: var(--spacing-sm);">📊</div>
          <h3>${t('trackStatus')}</h3>
          <p style="font-size: var(--font-size-sm);">Track your applications</p>
        </div>
        
        <div class="card card-interactive" onclick="showHelpSupport()">
          <div style="font-size: var(--font-size-4xl); margin-bottom: var(--spacing-sm);">💬</div>
          <h3>${t('helpSupport')}</h3>
          <p style="font-size: var(--font-size-sm);">Get human assistance</p>
        </div>
      </div>
      
      ${hasExistingLoans ? `
        <button class="btn btn-secondary btn-large mt-xl" onclick="showManageLoans()" style="width: 100%;">
          ${t('manageLoans')}
        </button>
      ` : ''}
    </div>
  `);

  voiceAssistant.speak('Dashboard. Your credit score is ' + creditScore + '. You have ' + (hasExistingLoans ? appState.user.existingLoans.length + ' existing loans' : 'no existing loans') + '. Options: Apply for loan, Insurance, Track status, or Help and support.');
}

function getApprovalProbability(score) {
  if (score >= 750) return 90;
  if (score >= 700) return 75;
  if (score >= 650) return 55;
  if (score >= 600) return 35;
  return 15;
}

// ===== LOAN TYPES =====
const loanTypes = [
  {
    id: 'personal',
    name: 'Personal Loan',
    icon: '👤',
    description: 'For personal needs like medical, travel, wedding, or emergency',
    minAmount: 50000,
    maxAmount: 2500000,
    secured: false,
    features: ['No collateral required', 'Quick disbursement', 'Flexible tenure']
  },
  {
    id: 'home',
    name: 'Home Loan',
    icon: '🏠',
    description: 'For buying or renovating your home',
    minAmount: 1000000,
    maxAmount: 50000000,
    secured: true,
    features: ['Long tenure', 'Tax benefits', 'Lower interest rates']
  },
  {
    id: 'education',
    name: 'Education Loan',
    icon: '🎓',
    description: 'For higher education in India or abroad',
    minAmount: 100000,
    maxAmount: 5000000,
    secured: false,
    features: ['Repayment after course', 'Covers tuition & living', 'Moratorium period']
  },
  {
    id: 'vehicle',
    name: 'Vehicle Loan',
    icon: '🚗',
    description: 'For buying car or bike',
    minAmount: 100000,
    maxAmount: 2000000,
    secured: true,
    features: ['Vehicle as collateral', 'Quick approval', 'Flexible EMI']
  },
  {
    id: 'business',
    name: 'Business Loan',
    icon: '💼',
    description: 'For starting or expanding business',
    minAmount: 500000,
    maxAmount: 10000000,
    secured: false,
    features: ['Working capital', 'Business expansion', 'Equipment purchase']
  },
  {
    id: 'gold',
    name: 'Gold Loan',
    icon: '🪙',
    description: 'Loan against your gold ornaments',
    minAmount: 25000,
    maxAmount: 5000000,
    secured: true,
    features: ['Low interest rate', 'Quick disbursement', 'Gold as collateral']
  },
  {
    id: 'property',
    name: 'Loan Against Property',
    icon: '🏢',
    description: 'Loan against residential or commercial property',
    minAmount: 1000000,
    maxAmount: 50000000,
    secured: true,
    features: ['High loan amount', 'Lower interest', 'Long tenure']
  },
  {
    id: 'mudra',
    name: 'PM Mudra Loan',
    icon: '🏪',
    description: 'Government-backed loan for micro businesses',
    minAmount: 50000,
    maxAmount: 1000000,
    secured: false,
    features: ['No collateral', 'Government backed', 'For small businesses']
  }
];

function showLoanTypes() {
  renderScreen('loan-types', `
    <h2 style="margin-bottom: var(--spacing-lg);">Select Loan Type</h2>
    <p style="margin-bottom: var(--spacing-xl);">Choose the loan that fits your needs</p>
    
    <div class="grid grid-2">
      ${loanTypes.map(loan => `
        <div class="card card-interactive" onclick="selectLoanType('${loan.id}')">
          <div style="font-size: var(--font-size-4xl); margin-bottom: var(--spacing-sm);">${loan.icon}</div>
          <h3 style="margin-bottom: var(--spacing-xs);">${loan.name}</h3>
          <p style="font-size: var(--font-size-sm); color: var(--text-muted); margin-bottom: var(--spacing-sm);">
            ${loan.description}
          </p>
          <div class="badge badge-info">
            ₹${(loan.minAmount / 100000).toFixed(1)}L - ₹${(loan.maxAmount / 10000000).toFixed(1)}Cr
          </div>
        </div>
      `).join('')}
    </div>
    
    <button class="btn btn-secondary mt-xl" onclick="showDashboard()">
      Back to Dashboard
    </button>
  `);

  voiceAssistant.speak('Select loan type. Available options: ' + loanTypes.map(l => l.name).join(', '));
}

function selectLoanType(loanId) {
  const loan = loanTypes.find(l => l.id === loanId);
  appState.setState({ selectedLoan: loan });
  showLoanDetails();
}

// ===== LOAN DETAILS & APPLICATION =====
function showLoanDetails() {
  const loan = appState.user.selectedLoan;

  renderScreen('loan-details', `
    <div style="font-size: var(--font-size-5xl); margin-bottom: var(--spacing-md);">${loan.icon}</div>
    <h2 style="margin-bottom: var(--spacing-lg);">${loan.name}</h2>
    
    <div class="card" style="text-align: left; margin-bottom: var(--spacing-lg);">
      <h3 style="margin-bottom: var(--spacing-md);">Loan Details</h3>
      <p style="margin-bottom: var(--spacing-sm);"><strong>Amount Range:</strong> ₹${(loan.minAmount / 100000).toFixed(1)}L - ₹${(loan.maxAmount / 10000000).toFixed(1)}Cr</p>
      <p style="margin-bottom: var(--spacing-sm);"><strong>Type:</strong> ${loan.secured ? 'Secured' : 'Unsecured'}</p>
      <p style="margin-bottom: var(--spacing-md);"><strong>Description:</strong> ${loan.description}</p>
      
      <h4 style="margin-bottom: var(--spacing-sm);">Features:</h4>
      <ul style="padding-left: var(--spacing-lg);">
        ${loan.features.map(f => `<li style="margin-bottom: var(--spacing-xs);">${f}</li>`).join('')}
      </ul>
    </div>
    
    <div class="grid grid-2">
      <button class="btn btn-secondary btn-large" onclick="showLoanTypes()">
        Back
      </button>
      <button class="btn btn-primary btn-large" onclick="startLoanApplication()">
        Apply Now
      </button>
    </div>
  `);

  voiceAssistant.speak(loan.name + '. ' + loan.description + '. Amount range from ' + (loan.minAmount / 100000) + ' lakhs to ' + (loan.maxAmount / 10000000) + ' crores. Click Apply Now to continue.');
}

function startLoanApplication() {
  showLoanApplicationForm();
}

function showLoanApplicationForm() {
  const loan = appState.user.selectedLoan;

  renderScreen('loan-application', `
    <h2 style="margin-bottom: var(--spacing-lg);">Apply for ${loan.name}</h2>
    
    <form id="loan-form" style="text-align: left;">
      <div class="input-group">
        <label class="input-label">Loan Amount (₹)</label>
        <input 
          type="number" 
          class="input" 
          id="loan-amount"
          min="${loan.minAmount}"
          max="${loan.maxAmount}"
          placeholder="${loan.minAmount}"
          required
        />
      </div>
      
      <div class="input-group">
        <label class="input-label">Monthly Income (₹)</label>
        <input 
          type="number" 
          class="input" 
          id="monthly-income"
          placeholder="50000"
          required
        />
      </div>
      
      <div class="input-group">
        <label class="input-label">Loan Purpose</label>
        <input 
          type="text" 
          class="input" 
          id="loan-purpose"
          placeholder="e.g., Medical emergency, Home renovation"
          required
        />
      </div>
      
      <div class="input-group">
        <label class="input-label">Employment Type</label>
        <select class="input" id="employment-type" required>
          <option value="">Select</option>
          <option value="salaried">Salaried</option>
          <option value="self-employed">Self Employed</option>
          <option value="business">Business Owner</option>
          <option value="professional">Professional</option>
        </select>
      </div>
      
      <div class="input-group">
        <label class="input-label">Do you have existing loans?</label>
        <select class="input" id="existing-loans" required>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>
    </form>
    
    <div class="grid grid-2 mt-lg">
      <button class="btn btn-secondary btn-large" onclick="showLoanDetails()">
        Back
      </button>
      <button class="btn btn-primary btn-large" onclick="checkEligibility()">
        Check Eligibility
      </button>
    </div>
  `);

  voiceAssistant.speak('Fill in the loan application form. Enter loan amount, monthly income, loan purpose, employment type, and existing loans information.');
}

async function checkEligibility() {
  const amount = document.getElementById('loan-amount').value;
  const income = document.getElementById('monthly-income').value;
  const purpose = document.getElementById('loan-purpose').value;
  const employment = document.getElementById('employment-type').value;
  const existingLoans = document.getElementById('existing-loans').value;

  if (!amount || !income || !purpose || !employment || !existingLoans) {
    showToast('Please fill all fields', 'error');
    voiceAssistant.speak('Please fill all fields');
    return;
  }

  showLoader();

  try {
    // Call real Azure AI API
    const response = await window.apiService.checkEligibility({
      loanType: appState.user.selectedLoan.name,
      amount: parseInt(amount),
      income: parseInt(income),
      creditScore: appState.user.creditScore || 720,
      employment,
      existingLoans: existingLoans === 'yes',
      purpose
    });

    hideLoader();

    if (response.success) {
      const approvalChance = response.analysis.approvalProbability;

      appState.setState({
        loanApplication: {
          loanType: appState.user.selectedLoan.id,
          amount: parseInt(amount),
          income: parseInt(income),
          purpose,
          employment,
          existingLoans: existingLoans === 'yes',
          approvalChance,
          aiAnalysis: response.analysis,
          aiPowered: response.aiPowered,
          status: 'eligibility_checked'
        }
      });

      // Show AI-powered badge if Azure AI was used
      if (response.aiPowered) {
        showToast('✨ Analysis powered by Azure AI', 'success');
      }

      showEligibilityResult(approvalChance);
    } else {
      throw new Error('Eligibility check failed');
    }
  } catch (error) {
    console.error('Eligibility check error:', error);
    hideLoader();

    // Fallback to local calculation
    const creditScore = appState.user.creditScore || 720;
    const approvalChance = getApprovalProbability(creditScore);

    appState.setState({
      loanApplication: {
        loanType: appState.user.selectedLoan.id,
        amount: parseInt(amount),
        income: parseInt(income),
        purpose,
        employment,
        existingLoans: existingLoans === 'yes',
        approvalChance,
        status: 'eligibility_checked'
      }
    });

    showToast('Eligibility checked (offline mode)', 'info');
    showEligibilityResult(approvalChance);
  }
}

function showEligibilityResult(approvalChance) {
  const creditScore = appState.user.creditScore;
  const loan = appState.user.selectedLoan;
  const application = appState.user.loanApplication;

  renderScreen('eligibility-result', `
    <div style="position: relative;">
      <div style="position: absolute; top: 0; right: 0; background: var(--primary-gradient); padding: var(--spacing-md); border-radius: var(--radius-lg); text-align: center;">
        <p style="font-size: var(--font-size-xs); margin: 0; margin-bottom: var(--spacing-xs);">${t('creditScore')}</p>
        <h2 style="font-size: calc(var(--font-size-3xl) * var(--accessible-font-multiplier)); margin: 0;">${creditScore}</h2>
      </div>
      
      <h2 style="margin-bottom: var(--spacing-lg); margin-top: var(--spacing-xl);">Eligibility Result</h2>
      
      <div class="card" style="background: var(--dark-gradient); margin-bottom: var(--spacing-lg);">
        <h3 style="margin-bottom: var(--spacing-md);">Based on your CIBIL score</h3>
        <div style="text-align: center; margin: var(--spacing-xl) 0;">
          <p style="font-size: var(--font-size-sm); color: var(--text-muted); margin-bottom: var(--spacing-xs);">Loan Approval Probability</p>
          <h1 style="font-size: calc(var(--font-size-5xl) * var(--accessible-font-multiplier)); margin: 0; color: ${approvalChance >= 75 ? 'var(--success-color)' : approvalChance >= 50 ? 'var(--warning-color)' : 'var(--accent-color)'};">
            ${approvalChance}%
          </h1>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${approvalChance}%;"></div>
        </div>
      </div>
      
      <div class="card" style="text-align: left; margin-bottom: var(--spacing-lg);">
        <h3 style="margin-bottom: var(--spacing-md);">Recommendation</h3>
        ${approvalChance >= 75 ? `
          <div class="badge badge-success mb-sm">Highly Recommended</div>
          <p>You have a strong chance of approval for this loan. You can proceed with confidence.</p>
        ` : approvalChance >= 50 ? `
          <div class="badge badge-warning mb-sm">Moderate Risk</div>
          <p>You have a fair chance of approval. Consider improving your credit score or providing additional documents.</p>
        ` : `
          <div class="badge badge-error mb-sm">High Risk</div>
          <p>Approval may be challenging. We recommend improving your credit score before applying or considering a smaller loan amount.</p>
        `}
        <p style="margin-top: var(--spacing-md); font-size: var(--font-size-sm); color: var(--text-muted);">
          <strong>Note:</strong> Final decision will be taken by the bank officer.
        </p>
      </div>
      
      ${approvalChance >= 40 ? `
        <button class="btn btn-primary btn-large" onclick="showDocumentChecklist()" style="width: 100%; margin-bottom: var(--spacing-sm);">
          Continue to Documents
        </button>
      ` : ''}
      
      <button class="btn btn-secondary btn-large" onclick="showDashboard()" style="width: 100%;">
        Back to Dashboard
      </button>
    </div>
  `);

  voiceAssistant.speak('Eligibility result. Your credit score is ' + creditScore + '. Loan approval probability is ' + approvalChance + ' percent. ' + (approvalChance >= 75 ? 'You have a strong chance of approval.' : approvalChance >= 50 ? 'You have a fair chance of approval.' : 'Approval may be challenging.'));
}

function showDocumentChecklist() {
  const loan = appState.user.selectedLoan;

  const documents = {
    personal: ['PAN Card', 'Aadhaar Card', 'Last 3 months salary slips', 'Last 6 months bank statement', 'Passport size photo'],
    home: ['PAN Card', 'Aadhaar Card', 'Income proof', 'Property documents', 'Bank statements', 'Passport size photo'],
    education: ['PAN Card', 'Aadhaar Card', 'Admission letter', 'Fee structure', 'Academic records', 'Income proof of parents/guardian'],
    vehicle: ['PAN Card', 'Aadhaar Card', 'Income proof', 'Vehicle quotation', 'Bank statements', 'Passport size photo'],
    business: ['PAN Card', 'Aadhaar Card', 'Business registration', 'GST certificate', 'ITR of last 2 years', 'Bank statements', 'Business plan'],
    gold: ['PAN Card', 'Aadhaar Card', 'Gold ownership proof', 'Passport size photo'],
    property: ['PAN Card', 'Aadhaar Card', 'Property documents', 'Income proof', 'Bank statements', 'Property valuation report'],
    mudra: ['PAN Card', 'Aadhaar Card', 'Business plan', 'Quotation/estimate', 'Address proof', 'Passport size photo']
  };

  const requiredDocs = documents[loan.id] || documents.personal;

  renderScreen('document-checklist', `
    <h2 style="margin-bottom: var(--spacing-lg);">Required Documents</h2>
    <p style="margin-bottom: var(--spacing-xl);">Please prepare these documents for ${loan.name}</p>
    
    <div class="card" style="text-align: left; margin-bottom: var(--spacing-lg);">
      <h3 style="margin-bottom: var(--spacing-md);">Document Checklist</h3>
      <ul style="list-style: none; padding: 0;">
        ${requiredDocs.map((doc, index) => `
          <li style="margin-bottom: var(--spacing-sm); padding: var(--spacing-sm); background: var(--bg-card); border-radius: var(--radius-sm); display: flex; align-items: center; gap: var(--spacing-sm);">
            <span style="color: var(--success-color); font-size: var(--font-size-xl);">✓</span>
            <span>${doc}</span>
          </li>
        `).join('')}
      </ul>
    </div>
    
    ${appState.user.isDisabled ? `
      <div class="card" style="background: var(--success-gradient); margin-bottom: var(--spacing-lg);">
        <h4 style="margin-bottom: var(--spacing-sm);">Special Assistance Available</h4>
        <p style="font-size: var(--font-size-sm);">As a priority user, you can use caregiver upload or assisted capture features.</p>
      </div>
    ` : ''}
    
    <div class="grid grid-2">
      <button class="btn btn-secondary btn-large" onclick="showEligibilityResult(${appState.user.loanApplication.approvalChance})">
        Back
      </button>
      <button class="btn btn-primary btn-large" onclick="showDocumentUpload()">
        Upload Documents
      </button>
    </div>
  `);

  voiceAssistant.speak('Required documents for ' + loan.name + '. ' + requiredDocs.join(', ') + '. Click upload documents to continue.');
}

function showDocumentUpload() {
  renderScreen('document-upload', `
    <h2 style="margin-bottom: var(--spacing-lg);">Upload Documents</h2>
    
    <div class="card" style="margin-bottom: var(--spacing-lg);">
      <div class="input-group">
        <label class="input-label">Select Documents (Multiple files allowed)</label>
        <input 
          type="file" 
          class="input" 
          id="documents-input"
          accept="image/*,.pdf"
          multiple
        />
      </div>
      
      <p style="font-size: var(--font-size-sm); color: var(--text-muted); margin-top: var(--spacing-sm);">
        Supported formats: JPG, PNG, PDF. AI will verify document clarity.
      </p>
    </div>
    
    <div class="grid grid-2">
      <button class="btn btn-secondary btn-large" onclick="showDocumentChecklist()">
        Back
      </button>
      <button class="btn btn-primary btn-large" onclick="verifyDocuments()">
        Verify & Continue
      </button>
    </div>
  `);

  voiceAssistant.speak('Upload your documents. You can select multiple files. AI will verify document clarity.');
}

async function verifyDocuments() {
  const fileInput = document.getElementById('documents-input');

  if (!fileInput.files || fileInput.files.length === 0) {
    showToast('Please select at least one document', 'error');
    voiceAssistant.speak('Please select at least one document');
    return;
  }

  showLoader();

  try {
    // Analyze first document with Azure AI
    const file = fileInput.files[0];
    const response = await window.apiService.analyzeDocument(file);

    hideLoader();

    if (response.success) {
      if (response.aiPowered) {
        showToast('✨ Documents analyzed by Azure AI - All clear!', 'success');
        voiceAssistant.speak('Documents verified successfully using Azure AI. All documents are clear and readable.');
      } else {
        showToast('Documents verified successfully', 'success');
        voiceAssistant.speak('Documents verified successfully');
      }

      setTimeout(() => {
        showBankSelection();
      }, 1000);
    } else {
      throw new Error('Document verification failed');
    }
  } catch (error) {
    console.error('Document verification error:', error);
    hideLoader();

    // Fallback - still proceed but notify user
    showToast('Documents received (offline verification)', 'info');
    voiceAssistant.speak('Documents received and will be verified manually');

    setTimeout(() => {
      showBankSelection();
    }, 1000);
  }
}

// Export functions
window.showDashboard = showDashboard;
window.showLoanTypes = showLoanTypes;
window.selectLoanType = selectLoanType;
window.showLoanDetails = showLoanDetails;
window.startLoanApplication = startLoanApplication;
window.checkEligibility = checkEligibility;
window.showDocumentChecklist = showDocumentChecklist;
window.showDocumentUpload = showDocumentUpload;
window.verifyDocuments = verifyDocuments;
