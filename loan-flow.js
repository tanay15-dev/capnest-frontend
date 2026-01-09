// ===== BANK SELECTION =====
const banks = [
  { id: 'hdfc', name: 'HDFC Bank', interestRate: 10.5, tenure: '12-60 months', rating: 4.5 },
  { id: 'sbi', name: 'State Bank of India', interestRate: 9.8, tenure: '12-72 months', rating: 4.3 },
  { id: 'icici', name: 'ICICI Bank', interestRate: 10.2, tenure: '12-60 months', rating: 4.4 },
  { id: 'axis', name: 'Axis Bank', interestRate: 10.8, tenure: '12-48 months', rating: 4.2 },
  { id: 'kotak', name: 'Kotak Mahindra Bank', interestRate: 11.0, tenure: '12-60 months', rating: 4.1 }
];

function showBankSelection() {
  const creditScore = appState.user.creditScore;
  const recommendedBank = banks[Math.floor(Math.random() * banks.length)];

  renderScreen('bank-selection', `
    <h2 style="margin-bottom: var(--spacing-lg);">Select Bank</h2>
    
    <div class="card" style="background: var(--warning-gradient); margin-bottom: var(--spacing-lg); text-align: left;">
      <h3 style="margin-bottom: var(--spacing-sm);">⚠️ Important: Lock System</h3>
      <p style="font-size: var(--font-size-sm);">
        When you apply to a bank, your application will be "locked" to that bank until the process completes or gets rejected. 
        You cannot apply to another bank during this time. This helps you focus and keeps everything manageable.
      </p>
    </div>
    
    <div class="card" style="background: var(--success-gradient); margin-bottom: var(--spacing-lg);">
      <h3 style="margin-bottom: var(--spacing-sm);">✨ Recommended for You</h3>
      <h2 style="margin: var(--spacing-sm) 0;">${recommendedBank.name}</h2>
      <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: var(--spacing-md); margin-top: var(--spacing-md);">
        <div>
          <p style="font-size: var(--font-size-xs); margin: 0;">Interest Rate</p>
          <p style="font-size: var(--font-size-xl); font-weight: 600; margin: 0;">${recommendedBank.interestRate}%</p>
        </div>
        <div>
          <p style="font-size: var(--font-size-xs); margin: 0;">Tenure</p>
          <p style="font-size: var(--font-size-xl); font-weight: 600; margin: 0;">${recommendedBank.tenure}</p>
        </div>
        <div>
          <p style="font-size: var(--font-size-xs); margin: 0;">Rating</p>
          <p style="font-size: var(--font-size-xl); font-weight: 600; margin: 0;">${recommendedBank.rating} ⭐</p>
        </div>
      </div>
      <button class="btn btn-primary btn-large mt-md" onclick="selectBank('${recommendedBank.id}')" style="width: 100%;">
        Apply to ${recommendedBank.name}
      </button>
    </div>
    
    <h3 style="margin-bottom: var(--spacing-md);">Other Banks</h3>
    <div class="grid grid-2" style="margin-bottom: var(--spacing-lg);">
      ${banks.filter(b => b.id !== recommendedBank.id).map(bank => `
        <div class="card">
          <h4 style="margin-bottom: var(--spacing-sm);">${bank.name}</h4>
          <p style="font-size: var(--font-size-sm); margin-bottom: var(--spacing-xs);">Interest: ${bank.interestRate}%</p>
          <p style="font-size: var(--font-size-sm); margin-bottom: var(--spacing-sm);">Tenure: ${bank.tenure}</p>
          <button class="btn btn-secondary" onclick="selectBank('${bank.id}')" style="width: 100%;">
            Select
          </button>
        </div>
      `).join('')}
    </div>
    
    <button class="btn btn-secondary btn-large" onclick="showDocumentUpload()">
      Back
    </button>
  `);

  voiceAssistant.speak('Select bank. Recommended bank is ' + recommendedBank.name + ' with interest rate ' + recommendedBank.interestRate + ' percent and tenure ' + recommendedBank.tenure);
}

function selectBank(bankId) {
  const bank = banks.find(b => b.id === bankId);

  appState.setState({
    loanApplication: {
      ...appState.user.loanApplication,
      selectedBank: bank,
      status: 'submitted',
      applicationId: 'CN' + Date.now(),
      submittedAt: new Date().toISOString()
    }
  });

  showLoader();

  setTimeout(() => {
    hideLoader();
    showToast('Application submitted to ' + bank.name, 'success');
    voiceAssistant.speak('Application submitted to ' + bank.name + '. Your application is under review.');

    setTimeout(() => {
      showApplicationReview();
    }, 1000);
  }, 2000);
}

// ===== APPLICATION REVIEW =====
function showApplicationReview() {
  const application = appState.user.loanApplication;

  renderScreen('application-review', `
    <div style="text-align: center; margin-bottom: var(--spacing-xl);">
      <div class="loader"></div>
      <h2 style="margin-top: var(--spacing-lg);">Under Bank Review</h2>
      <p style="color: var(--text-muted);">Application ID: ${application.applicationId}</p>
    </div>
    
    <div class="card" style="margin-bottom: var(--spacing-lg);">
      <h3 style="margin-bottom: var(--spacing-md);">Application Status</h3>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 50%;"></div>
      </div>
      <p style="margin-top: var(--spacing-sm); font-size: var(--font-size-sm); color: var(--text-muted);">
        Decision within 24 hours
      </p>
    </div>
    
    <div class="card" style="text-align: left;">
      <h4 style="margin-bottom: var(--spacing-md);">Application Details</h4>
      <p style="margin-bottom: var(--spacing-xs);"><strong>Loan Type:</strong> ${appState.user.selectedLoan.name}</p>
      <p style="margin-bottom: var(--spacing-xs);"><strong>Amount:</strong> ₹${application.amount.toLocaleString()}</p>
      <p style="margin-bottom: var(--spacing-xs);"><strong>Bank:</strong> ${application.selectedBank.name}</p>
      <p style="margin-bottom: var(--spacing-xs);"><strong>Status:</strong> <span class="badge badge-warning">Under Review</span></p>
      ${appState.user.isDisabled ? `
        <p style="margin-top: var(--spacing-md); color: var(--success-color);">
          ✓ Priority processing enabled
        </p>
      ` : ''}
    </div>
    
    <button class="btn btn-secondary btn-large mt-lg" onclick="simulateDecision()" style="width: 100%;">
      Simulate Decision (Demo)
    </button>
  `);

  voiceAssistant.speak('Your application is under bank review. Decision will be provided within 24 hours. Application ID is ' + application.applicationId);
}

function simulateDecision() {
  const approvalChance = appState.user.loanApplication.approvalChance;
  const isApproved = approvalChance >= 50; // Simulate based on approval chance

  showLoader();

  setTimeout(() => {
    hideLoader();

    if (isApproved) {
      appState.setState({
        loanApplication: {
          ...appState.user.loanApplication,
          status: 'approved',
          approvedAt: new Date().toISOString()
        }
      });
      showLoanApproved();
    } else {
      appState.setState({
        loanApplication: {
          ...appState.user.loanApplication,
          status: 'rejected',
          rejectedAt: new Date().toISOString(),
          rejectionReason: 'Income does not meet minimum requirements'
        }
      });
      showLoanRejected();
    }
  }, 2000);
}

// ===== LOAN APPROVED =====
function showLoanApproved() {
  const application = appState.user.loanApplication;
  const loan = appState.user.selectedLoan;

  // Calculate EMI (simplified formula)
  const principal = application.amount;
  const rate = application.selectedBank.interestRate / 12 / 100;
  const tenure = 36; // 3 years default
  const emi = Math.round((principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1));

  // Start 48-hour countdown timer
  const confirmationWindow = 48 * 60 * 60 * 1000; // 48 hours in ms
  let timerExpired = false;

  renderScreen('loan-approved', `
    <div style="text-align: center; margin-bottom: var(--spacing-xl);">
      <div style="font-size: 5rem; margin-bottom: var(--spacing-md);">🎉</div>
      <h1 style="color: var(--success-color); margin-bottom: var(--spacing-sm);">${t('loanApproved')}</h1>
      <p style="color: var(--text-muted);">Application ID: ${application.applicationId}</p>
    </div>
    
    <div class="countdown-timer" id="countdown-timer">
      <h3>⏰ Confirmation Window</h3>
      <div class="countdown-display" id="countdown-display">48:00:00</div>
      <p style="font-size: var(--font-size-sm); margin: 0;">Time remaining to confirm</p>
    </div>
    
    <div class="card" style="background: var(--success-gradient); margin-bottom: var(--spacing-lg);">
      <h3 style="margin-bottom: var(--spacing-md);">Loan Details</h3>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md); text-align: center;">
        <div>
          <p style="font-size: var(--font-size-sm); margin: 0; margin-bottom: var(--spacing-xs);">Amount</p>
          <h2 style="margin: 0;">₹${application.amount.toLocaleString()}</h2>
        </div>
        <div>
          <p style="font-size: var(--font-size-sm); margin: 0; margin-bottom: var(--spacing-xs);">Interest Rate</p>
          <h2 style="margin: 0;">${application.selectedBank.interestRate}%</h2>
        </div>
        <div>
          <p style="font-size: var(--font-size-sm); margin: 0; margin-bottom: var(--spacing-xs);">Tenure</p>
          <h2 style="margin: 0;">${tenure} months</h2>
        </div>
        <div>
          <p style="font-size: var(--font-size-sm); margin: 0; margin-bottom: var(--spacing-xs);">EMI per month</p>
          <h2 style="margin: 0;">₹${emi.toLocaleString()}</h2>
        </div>
      </div>
    </div>
    
    <div class="card" style="background: var(--warning-gradient); margin-bottom: var(--spacing-lg); text-align: left;">
      <h3 style="margin-bottom: var(--spacing-sm);">⏰ Action Required</h3>
      <p style="margin-bottom: var(--spacing-sm);">
        Your loan is approved! Please confirm within <strong>48 hours</strong> to proceed with disbursement.
      </p>
      <p style="font-size: var(--font-size-sm); color: var(--text-muted);">
        The bank officer's work is on hold until you confirm. If you don't confirm within the time limit, 
        the application will be automatically closed.
      </p>
    </div>
    
    <button class="btn btn-primary btn-large" onclick="confirmDisbursement()" style="width: 100%; margin-bottom: var(--spacing-sm);">
      ${t('confirmDisbursement')}
    </button>
    
    <button class="btn btn-secondary btn-large" onclick="showDashboard()" style="width: 100%;">
      Decide Later
    </button>
  `);

  voiceAssistant.speak('Congratulations! Your loan is approved. Amount: ' + application.amount + ' rupees. EMI per month: ' + emi + ' rupees. Please confirm within 48 hours to proceed with disbursement.');

  // Initialize countdown timer
  if (window.timerService) {
    window.timerService.createCountdown(
      'disbursement-confirmation',
      confirmationWindow,
      (remaining) => {
        const display = document.getElementById('countdown-display');
        if (display && !timerExpired) {
          display.textContent = window.timerService.formatTime(remaining);
        }

        // Send reminder at 24 hours, 12 hours, 6 hours, 1 hour
        const hoursRemaining = remaining / (1000 * 60 * 60);
        if (Math.abs(hoursRemaining - 24) < 0.01 || Math.abs(hoursRemaining - 12) < 0.01 ||
          Math.abs(hoursRemaining - 6) < 0.01 || Math.abs(hoursRemaining - 1) < 0.01) {
          if (window.notificationService) {
            window.notificationService.sendReminder(
              'Loan Confirmation Reminder',
              `You have ${Math.floor(hoursRemaining)} hours left to confirm your loan disbursement.`
            );
          }
        }
      },
      () => {
        // Timer expired - auto-close application
        timerExpired = true;
        appState.setState({
          loanApplication: {
            ...appState.user.loanApplication,
            status: 'approved_not_accepted',
            expiredAt: new Date().toISOString()
          }
        });
        showLoanExpired();
      }
    );
  }
}

// ===== LOAN EXPIRED (NOT ACCEPTED) =====
function showLoanExpired() {
  const application = appState.user.loanApplication;

  renderScreen('loan-expired', `
    <div style="text-align: center; margin-bottom: var(--spacing-xl);">
      <div style="font-size: 4rem; margin-bottom: var(--spacing-md);">⏰</div>
      <h2 style="margin-bottom: var(--spacing-sm);">Confirmation Window Expired</h2>
      <p style="color: var(--text-muted);">Application ID: ${application.applicationId}</p>
    </div>
    
    <div class="countdown-expired">
      <h3 style="margin-bottom: var(--spacing-md);">Application Status: Approved but Not Accepted</h3>
      <p style="margin-bottom: var(--spacing-sm);">
        Your loan was approved, but you did not confirm within the 48-hour window.
        The application has been automatically closed.
      </p>
    </div>
    
    <div class="card" style="text-align: left; margin-top: var(--spacing-lg);">
      <h4 style="margin-bottom: var(--spacing-md);">What You Can Do:</h4>
      <ul style="padding-left: var(--spacing-lg);">
        <li style="margin-bottom: var(--spacing-sm);">Apply again for a new loan</li>
        <li style="margin-bottom: var(--spacing-sm);">Contact support for assistance</li>
        <li style="margin-bottom: var(--spacing-sm);">Review your loan requirements</li>
      </ul>
    </div>
    
    <div class="grid grid-2 mt-lg">
      <button class="btn btn-secondary btn-large" onclick="showDashboard()">
        Back to Dashboard
      </button>
      <button class="btn btn-primary btn-large" onclick="showLoanTypes()">
        Apply Again
      </button>
    </div>
  `);

  voiceAssistant.speak('Your loan confirmation window has expired. The application has been closed. You can apply again or contact support for assistance.');
}

// ===== LOAN REJECTED =====
function showLoanRejected() {
  const application = appState.user.loanApplication;

  renderScreen('loan-rejected', `
    <div style="text-align: center; margin-bottom: var(--spacing-xl);">
      <div style="font-size: 4rem; margin-bottom: var(--spacing-md);">😔</div>
      <h2 style="margin-bottom: var(--spacing-sm);">${t('loanRejected')}</h2>
      <p style="color: var(--text-muted);">Application ID: ${application.applicationId}</p>
    </div>
    
    <div class="card" style="text-align: left; margin-bottom: var(--spacing-lg);">
      <h3 style="margin-bottom: var(--spacing-md);">Reason for Rejection</h3>
      <p>${application.rejectionReason || 'The bank could not approve your application at this time.'}</p>
    </div>
    
    <div class="card" style="text-align: left; margin-bottom: var(--spacing-lg);">
      <h3 style="margin-bottom: var(--spacing-md);">What You Can Do</h3>
      <ul style="padding-left: var(--spacing-lg);">
        <li style="margin-bottom: var(--spacing-sm);">Improve your credit score</li>
        <li style="margin-bottom: var(--spacing-sm);">Try applying for a smaller amount</li>
        <li style="margin-bottom: var(--spacing-sm);">Apply to another bank</li>
        <li style="margin-bottom: var(--spacing-sm);">Talk to our support team for guidance</li>
      </ul>
    </div>
    
    <div class="grid grid-2">
      <button class="btn btn-secondary btn-large" onclick="showDashboard()">
        Back to Dashboard
      </button>
      <button class="btn btn-primary btn-large" onclick="showHelpSupport()">
        Get Help
      </button>
    </div>
  `);

  voiceAssistant.speak('Unfortunately, your application was not approved. Reason: ' + (application.rejectionReason || 'The bank could not approve your application at this time.') + '. You can improve your credit score, try a smaller amount, or talk to our support team.');
}

// ===== DISBURSEMENT CONFIRMATION =====
function confirmDisbursement() {
  renderScreen('confirm-disbursement', `
    <h2 style="margin-bottom: var(--spacing-lg);">Confirm Disbursement</h2>
    
    <div class="card" style="margin-bottom: var(--spacing-lg); text-align: left;">
      <h3 style="margin-bottom: var(--spacing-md);">Before We Proceed</h3>
      <p style="margin-bottom: var(--spacing-sm);">
        We need to verify your bank account for disbursement. The loan will be credited to your account 
        in the same bank (${appState.user.loanApplication.selectedBank.name}).
      </p>
      <p style="font-size: var(--font-size-sm); color: var(--text-muted);">
        If you don't have an account, we'll help you open one.
      </p>
    </div>
    
    <div class="input-group">
      <label class="input-label">Do you have an account in ${appState.user.loanApplication.selectedBank.name}?</label>
      <select class="input" id="has-account">
        <option value="yes">Yes, I have an account</option>
        <option value="no">No, I need to open an account</option>
      </select>
    </div>
    
    <div class="grid grid-2 mt-lg">
      <button class="btn btn-secondary btn-large" onclick="showLoanApproved()">
        Back
      </button>
      <button class="btn btn-primary btn-large" onclick="processDisbursement()">
        Proceed
      </button>
    </div>
  `);

  voiceAssistant.speak('Confirm disbursement. Do you have an account in ' + appState.user.loanApplication.selectedBank.name + '? Select yes or no and click proceed.');
}

function processDisbursement() {
  const hasAccount = document.getElementById('has-account').value;

  if (hasAccount === 'yes') {
    showAccountVerification();
  } else {
    showAccountOpeningAssistance();
  }
}

function showAccountVerification() {
  renderScreen('account-verification', `
    <h2 style="margin-bottom: var(--spacing-lg);">Account Verification</h2>
    
    <div class="input-group">
      <label class="input-label">Account Number</label>
      <input type="text" class="input" id="account-number" placeholder="Enter your account number" />
    </div>
    
    <div class="input-group">
      <label class="input-label">IFSC Code</label>
      <input type="text" class="input" id="ifsc-code" placeholder="Enter IFSC code" />
    </div>
    
    <div class="grid grid-2 mt-lg">
      <button class="btn btn-secondary btn-large" onclick="confirmDisbursement()">
        Back
      </button>
      <button class="btn btn-primary btn-large" onclick="verifyAndDisburse()">
        Verify & Disburse
      </button>
    </div>
  `);

  voiceAssistant.speak('Enter your account number and IFSC code for verification.');
}

function verifyAndDisburse() {
  const accountNumber = document.getElementById('account-number').value;
  const ifscCode = document.getElementById('ifsc-code').value;

  if (!accountNumber || !ifscCode) {
    showToast('Please fill all fields', 'error');
    voiceAssistant.speak('Please fill all fields');
    return;
  }

  showLoader();

  setTimeout(() => {
    hideLoader();

    appState.setState({
      loanApplication: {
        ...appState.user.loanApplication,
        status: 'disbursed',
        disbursedAt: new Date().toISOString(),
        accountNumber,
        ifscCode
      }
    });

    showDisbursementSuccess();
  }, 3000);
}

function showAccountOpeningAssistance() {
  renderScreen('account-opening', `
    <h2 style="margin-bottom: var(--spacing-lg);">Account Opening Assistance</h2>
    
    <div class="card" style="margin-bottom: var(--spacing-lg); text-align: left;">
      <h3 style="margin-bottom: var(--spacing-md);">We're Here to Help</h3>
      <p style="margin-bottom: var(--spacing-sm);">
        Don't worry! We'll help you open an account in ${appState.user.loanApplication.selectedBank.name}.
      </p>
      <p style="font-size: var(--font-size-sm); color: var(--text-muted);">
        Your loan approval is safe and will remain on hold for 7 days while we help you with account opening.
      </p>
    </div>
    
    <div class="card" style="margin-bottom: var(--spacing-lg); text-align: left;">
      <h4 style="margin-bottom: var(--spacing-md);">Options Available:</h4>
      <ul style="padding-left: var(--spacing-lg);">
        <li style="margin-bottom: var(--spacing-sm);">Video KYC (No branch visit needed)</li>
        <li style="margin-bottom: var(--spacing-sm);">Assisted account opening</li>
        ${appState.user.isDisabled ? '<li style="margin-bottom: var(--spacing-sm); color: var(--success-color);">Doorstep service available for you</li>' : ''}
        <li style="margin-bottom: var(--spacing-sm);">Branch visit with appointment</li>
      </ul>
    </div>
    
    <button class="btn btn-primary btn-large" onclick="initiateAccountOpening()" style="width: 100%; margin-bottom: var(--spacing-sm);">
      Start Account Opening
    </button>
    
    <button class="btn btn-secondary btn-large" onclick="showDashboard()" style="width: 100%;">
      I'll Do It Later
    </button>
  `);

  voiceAssistant.speak('We will help you open an account. Options available: Video KYC, Assisted account opening, or Branch visit. Your loan approval is safe for 7 days.');
}

function initiateAccountOpening() {
  showLoader();

  setTimeout(() => {
    hideLoader();
    showToast('Account opening request submitted. You will receive a call within 24 hours.', 'success');
    voiceAssistant.speak('Account opening request submitted. You will receive a call within 24 hours.');

    setTimeout(() => {
      showDashboard();
    }, 2000);
  }, 2000);
}

function showDisbursementSuccess() {
  const application = appState.user.loanApplication;

  renderScreen('disbursement-success', `
    <div style="text-align: center; margin-bottom: var(--spacing-xl);">
      <div style="font-size: 5rem; margin-bottom: var(--spacing-md);">✅</div>
      <h1 style="color: var(--success-color); margin-bottom: var(--spacing-sm);">Disbursement Successful!</h1>
      <p style="color: var(--text-muted);">Application ID: ${application.applicationId}</p>
    </div>
    
    <div class="card" style="background: var(--success-gradient); margin-bottom: var(--spacing-lg);">
      <h3 style="margin-bottom: var(--spacing-md);">Amount Credited</h3>
      <h1 style="font-size: calc(var(--font-size-5xl) * var(--accessible-font-multiplier)); margin: var(--spacing-md) 0;">
        ₹${application.amount.toLocaleString()}
      </h1>
      <p style="font-size: var(--font-size-sm);">
        Bank: ${application.selectedBank.name}<br>
        Date: ${new Date().toLocaleDateString()}
      </p>
    </div>
    
    <div class="card" style="text-align: left; margin-bottom: var(--spacing-lg);">
      <h3 style="margin-bottom: var(--spacing-md);">Next Steps</h3>
      <ul style="padding-left: var(--spacing-lg);">
        <li style="margin-bottom: var(--spacing-sm);">Track your EMI payments in the dashboard</li>
        <li style="margin-bottom: var(--spacing-sm);">Set up auto-pay for hassle-free payments</li>
        <li style="margin-bottom: var(--spacing-sm);">Check your loan details anytime</li>
      </ul>
    </div>
    
    <button class="btn btn-primary btn-large" onclick="showDashboard()" style="width: 100%;">
      Go to Dashboard
    </button>
  `);

  voiceAssistant.speak('Disbursement successful! Amount ' + application.amount + ' rupees has been credited to your account in ' + application.selectedBank.name);
}

// Export functions
window.showBankSelection = showBankSelection;
window.selectBank = selectBank;
window.showApplicationReview = showApplicationReview;
window.simulateDecision = simulateDecision;
window.showLoanApproved = showLoanApproved;
window.showLoanExpired = showLoanExpired;
window.showLoanRejected = showLoanRejected;
window.confirmDisbursement = confirmDisbursement;
window.processDisbursement = processDisbursement;
window.verifyAndDisburse = verifyAndDisburse;
window.initiateAccountOpening = initiateAccountOpening;
