// ===== INSURANCE =====
const insurancePlans = [
  {
    id: 'life',
    name: 'Life Insurance',
    icon: '❤️',
    description: 'Protect your family\'s financial future',
    coverage: '₹10L - ₹1Cr',
    premium: 'From ₹500/month',
    features: ['Death benefit', 'Tax benefits', 'Maturity benefit']
  },
  {
    id: 'health',
    name: 'Health Insurance',
    icon: '🏥',
    description: 'Cover medical expenses for you and family',
    coverage: '₹5L - ₹50L',
    premium: 'From ₹300/month',
    features: ['Cashless treatment', 'Pre & post hospitalization', 'No claim bonus']
  },
  {
    id: 'loan-protection',
    name: 'Loan Protection Insurance',
    icon: '🛡️',
    description: 'Protect your loan in case of unforeseen events',
    coverage: 'Up to loan amount',
    premium: 'From ₹200/month',
    features: ['Covers EMI payments', 'Death & disability cover', 'Critical illness cover']
  }
];

function showInsurance() {
  renderScreen('insurance', `
    <h2 style="margin-bottom: var(--spacing-lg);">${t('insurance')}</h2>
    <p style="margin-bottom: var(--spacing-xl);">Protect yourself and your loved ones</p>
    
    <div class="grid grid-2">
      ${insurancePlans.map(plan => `
        <div class="card card-interactive" onclick="showInsuranceDetails('${plan.id}')">
          <div style="font-size: var(--font-size-4xl); margin-bottom: var(--spacing-sm);">${plan.icon}</div>
          <h3 style="margin-bottom: var(--spacing-xs);">${plan.name}</h3>
          <p style="font-size: var(--font-size-sm); color: var(--text-muted); margin-bottom: var(--spacing-md);">
            ${plan.description}
          </p>
          <div style="display: flex; justify-content: space-between; gap: var(--spacing-sm); margin-top: var(--spacing-md);">
            <div class="badge badge-info">${plan.coverage}</div>
            <div class="badge badge-success">${plan.premium}</div>
          </div>
        </div>
      `).join('')}
    </div>
    
    <button class="btn btn-secondary btn-large mt-xl" onclick="showDashboard()">
      Back to Dashboard
    </button>
  `);

  voiceAssistant.speak('Insurance options. ' + insurancePlans.map(p => p.name).join(', ') + '. Select any plan to learn more.');
}

function showInsuranceDetails(planId) {
  const plan = insurancePlans.find(p => p.id === planId);

  renderScreen('insurance-details', `
    <div style="font-size: var(--font-size-5xl); margin-bottom: var(--spacing-md);">${plan.icon}</div>
    <h2 style="margin-bottom: var(--spacing-lg);">${plan.name}</h2>
    
    <div class="card" style="text-align: left; margin-bottom: var(--spacing-lg);">
      <p style="margin-bottom: var(--spacing-md);">${plan.description}</p>
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-md); margin-bottom: var(--spacing-md);">
        <div>
          <p style="font-size: var(--font-size-sm); color: var(--text-muted); margin: 0;">Coverage</p>
          <h3 style="margin: 0;">${plan.coverage}</h3>
        </div>
        <div>
          <p style="font-size: var(--font-size-sm); color: var(--text-muted); margin: 0;">Premium</p>
          <h3 style="margin: 0;">${plan.premium}</h3>
        </div>
      </div>
      
      <h4 style="margin-bottom: var(--spacing-sm);">Features:</h4>
      <ul style="padding-left: var(--spacing-lg);">
        ${plan.features.map(f => `<li style="margin-bottom: var(--spacing-xs);">${f}</li>`).join('')}
      </ul>
    </div>
    
    <p style="font-size: var(--font-size-sm); color: var(--text-muted); margin-bottom: var(--spacing-lg);">
      This is optional. You can choose insurance based on your needs.
    </p>
    
    <div class="grid grid-2">
      <button class="btn btn-secondary btn-large" onclick="showInsurance()">
        Back
      </button>
      <button class="btn btn-primary btn-large" onclick="showToast('Insurance application coming soon!', 'info'); voiceAssistant.speak('Insurance application feature coming soon');">
        Apply Now
      </button>
    </div>
  `);

  voiceAssistant.speak(plan.name + '. ' + plan.description + '. Coverage: ' + plan.coverage + '. Premium: ' + plan.premium);
}

// ===== TRACK STATUS =====
function showTrackStatus() {
  const application = appState.user.loanApplication;

  if (!application) {
    renderScreen('track-status', `
      <h2 style="margin-bottom: var(--spacing-lg);">${t('trackStatus')}</h2>
      
      <div class="card" style="text-align: center; padding: var(--spacing-xxl);">
        <div style="font-size: 4rem; margin-bottom: var(--spacing-md);">📋</div>
        <h3 style="margin-bottom: var(--spacing-sm);">No Applications Yet</h3>
        <p style="color: var(--text-muted);">You haven't applied for any loans yet.</p>
      </div>
      
      <button class="btn btn-primary btn-large mt-lg" onclick="showDashboard()" style="width: 100%;">
        Back to Dashboard
      </button>
    `);

    voiceAssistant.speak('No applications yet. You have not applied for any loans.');
    return;
  }

  const statusInfo = {
    'submitted': { label: 'Under Review', color: 'warning', progress: 33 },
    'approved': { label: 'Approved', color: 'success', progress: 66 },
    'disbursed': { label: 'Disbursed', color: 'success', progress: 100 },
    'rejected': { label: 'Not Approved', color: 'error', progress: 100 }
  };

  const status = statusInfo[application.status] || statusInfo['submitted'];

  renderScreen('track-status', `
    <h2 style="margin-bottom: var(--spacing-lg);">${t('trackStatus')}</h2>
    
    <div class="card" style="margin-bottom: var(--spacing-lg);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
        <div>
          <p style="font-size: var(--font-size-sm); color: var(--text-muted); margin: 0;">Application ID</p>
          <h3 style="margin: 0;">${application.applicationId}</h3>
        </div>
        <div class="badge badge-${status.color}">${status.label}</div>
      </div>
      
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${status.progress}%;"></div>
      </div>
    </div>
    
    <div class="card" style="text-align: left; margin-bottom: var(--spacing-lg);">
      <h3 style="margin-bottom: var(--spacing-md);">Application Details</h3>
      <p style="margin-bottom: var(--spacing-xs);"><strong>Loan Type:</strong> ${appState.user.selectedLoan?.name || 'N/A'}</p>
      <p style="margin-bottom: var(--spacing-xs);"><strong>Amount:</strong> ₹${application.amount?.toLocaleString() || 'N/A'}</p>
      <p style="margin-bottom: var(--spacing-xs);"><strong>Bank:</strong> ${application.selectedBank?.name || 'N/A'}</p>
      <p style="margin-bottom: var(--spacing-xs);"><strong>Submitted:</strong> ${application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'N/A'}</p>
      ${application.approvedAt ? `<p style="margin-bottom: var(--spacing-xs);"><strong>Approved:</strong> ${new Date(application.approvedAt).toLocaleDateString()}</p>` : ''}
      ${application.disbursedAt ? `<p style="margin-bottom: var(--spacing-xs);"><strong>Disbursed:</strong> ${new Date(application.disbursedAt).toLocaleDateString()}</p>` : ''}
    </div>
    
    <button class="btn btn-secondary btn-large" onclick="showDashboard()" style="width: 100%;">
      Back to Dashboard
    </button>
  `);

  voiceAssistant.speak('Application status: ' + status.label + '. Application ID: ' + application.applicationId);
}

// ===== MANAGE LOANS =====
function showManageLoans() {
  const existingLoans = appState.user.existingLoans || [];
  const managedLoans = appState.user.managedLoans || [];
  const creditCards = appState.user.managedCreditCards || [];
  const today = new Date();

  // Calculate upcoming EMIs
  const upcomingEMIs = [];

  managedLoans.forEach(loan => {
    if (loan.dueDate) {
      const dueDate = new Date(loan.dueDate);
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      upcomingEMIs.push({
        type: 'Loan',
        name: `${loan.type} - ${loan.bank}`,
        amount: loan.emi,
        dueDate: dueDate,
        daysUntilDue: daysUntilDue,
        isDueSoon: daysUntilDue >= 0 && daysUntilDue <= 5,
        isOverdue: daysUntilDue < 0
      });
    }
  });

  creditCards.forEach(card => {
    if (card.dueDate) {
      const dueDate = new Date(card.dueDate);
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      upcomingEMIs.push({
        type: 'Credit Card',
        name: `${card.cardName} - ${card.bank}`,
        amount: card.emi,
        dueDate: dueDate,
        daysUntilDue: daysUntilDue,
        isDueSoon: daysUntilDue >= 0 && daysUntilDue <= 5,
        isOverdue: daysUntilDue < 0
      });
    }
  });

  // Sort by due date
  upcomingEMIs.sort((a, b) => a.dueDate - b.dueDate);

  renderScreen('manage-loans', `
    <h2 style="margin-bottom: var(--spacing-lg);">${t('manageLoans')}</h2>
    
    ${existingLoans.length > 0 && managedLoans.length === 0 ? `
      <div class="card" style="background: var(--primary-gradient); margin-bottom: var(--spacing-lg); text-align: left;">
        <h3 style="margin-bottom: var(--spacing-sm);">💡 Manage All Your Loans Here</h3>
        <p style="margin-bottom: var(--spacing-md);">
          We detected you have existing loans. Would you like to manage all your EMIs and get reminders in one place?
        </p>
        <button class="btn btn-primary btn-large" onclick="enableLoanManagement()" style="width: 100%;">
          Yes, Enable Loan Management
        </button>
      </div>
    ` : ''}
    
    ${managedLoans.length > 0 || creditCards.length > 0 ? `
      <!-- EMI Calendar -->
      <div class="emi-calendar">
        <h3 style="margin-bottom: var(--spacing-md);">📅 Upcoming EMI Payments</h3>
        ${upcomingEMIs.length > 0 ? upcomingEMIs.map(emi => `
          <div class="emi-item ${emi.isDueSoon ? 'due-soon' : ''} ${emi.isOverdue ? 'overdue' : ''}">
            <div>
              <div style="font-weight: 600; margin-bottom: var(--spacing-xs);">${emi.name}</div>
              <div class="emi-date">
                ${emi.isOverdue ? '⚠️ Overdue' : emi.isDueSoon ? `🔔 Due in ${emi.daysUntilDue} day${emi.daysUntilDue !== 1 ? 's' : ''}` : `Due: ${emi.dueDate.toLocaleDateString()}`}
              </div>
            </div>
            <div class="emi-amount">₹${emi.amount.toLocaleString()}</div>
          </div>
        `).join('') : '<p style="text-align: center; color: var(--text-muted);">No upcoming EMIs</p>'}
      </div>
      
      <!-- Loans Summary -->
      <div class="card" style="margin-bottom: var(--spacing-lg);">
        <h3 style="margin-bottom: var(--spacing-md);">Your Loans</h3>
        ${managedLoans.map((loan, index) => `
          <div class="loan-card">
            <div class="loan-header">
              <div>
                <div class="loan-type">${loan.type}</div>
                <div class="loan-bank">${loan.bank}</div>
              </div>
              <div style="text-align: right;">
                <p style="font-size: var(--font-size-sm); color: var(--text-muted); margin: 0;">EMI</p>
                <h3 style="margin: 0;">₹${loan.emi.toLocaleString()}</h3>
              </div>
            </div>
            <div class="loan-details">
              <div class="loan-detail-item">
                <div class="loan-detail-label">Principal</div>
                <div class="loan-detail-value">₹${(loan.amount / 100000).toFixed(1)}L</div>
              </div>
              <div class="loan-detail-item">
                <div class="loan-detail-label">Remaining</div>
                <div class="loan-detail-value">${loan.remainingTenure || 'N/A'} months</div>
              </div>
            </div>
          </div>
        `).join('')}
        
        ${creditCards.length > 0 ? `
          <h4 style="margin-top: var(--spacing-lg); margin-bottom: var(--spacing-md);">Credit Cards</h4>
          ${creditCards.map(card => `
            <div class="loan-card">
              <div class="loan-header">
                <div>
                  <div class="loan-type">${card.cardName}</div>
                  <div class="loan-bank">${card.bank}</div>
                </div>
                <div style="text-align: right;">
                  <p style="font-size: var(--font-size-sm); color: var(--text-muted); margin: 0;">Min Payment</p>
                  <h3 style="margin: 0;">₹${card.emi.toLocaleString()}</h3>
                </div>
              </div>
              <div class="loan-details">
                <div class="loan-detail-item">
                  <div class="loan-detail-label">Used</div>
                  <div class="loan-detail-value">₹${(card.used / 1000).toFixed(0)}K</div>
                </div>
                <div class="loan-detail-item">
                  <div class="loan-detail-label">Limit</div>
                  <div class="loan-detail-value">₹${(card.limit / 1000).toFixed(0)}K</div>
                </div>
              </div>
            </div>
          `).join('')}
        ` : ''}
        
        <div style="margin-top: var(--spacing-lg); padding: var(--spacing-md); background: var(--success-gradient); border-radius: var(--radius-md);">
          <p style="font-size: var(--font-size-sm); margin: 0; margin-bottom: var(--spacing-xs);">Total Monthly Payments</p>
          <h2 style="margin: 0;">₹${(managedLoans.reduce((sum, loan) => sum + loan.emi, 0) + creditCards.reduce((sum, card) => sum + card.emi, 0)).toLocaleString()}</h2>
        </div>
      </div>
      
      <div class="card" style="text-align: left; margin-bottom: var(--spacing-lg);">
        <h4 style="margin-bottom: var(--spacing-md);">Features Enabled:</h4>
        <ul style="padding-left: var(--spacing-lg);">
          <li style="margin-bottom: var(--spacing-xs);">✓ EMI reminders 5 days before due date</li>
          <li style="margin-bottom: var(--spacing-xs);">✓ Auto-pay setup available</li>
          <li style="margin-bottom: var(--spacing-xs);">✓ Track all loans in one place</li>
          <li style="margin-bottom: var(--spacing-xs);">✓ Credit score monitoring</li>
        </ul>
      </div>
    ` : existingLoans.length > 0 ? `
      <div class="card" style="text-align: center; padding: var(--spacing-xxl);">
        <div style="font-size: 4rem; margin-bottom: var(--spacing-md);">📊</div>
        <h3 style="margin-bottom: var(--spacing-sm);">Enable Loan Management</h3>
        <p style="color: var(--text-muted);">Manage all your loans and EMIs in one place</p>
      </div>
    ` : `
      <div class="card" style="text-align: center; padding: var(--spacing-xxl);">
        <div style="font-size: 4rem; margin-bottom: var(--spacing-md);">📋</div>
        <h3 style="margin-bottom: var(--spacing-sm);">No Existing Loans</h3>
        <p style="color: var(--text-muted);">You don't have any existing loans to manage</p>
      </div>
    `}
    
    <button class="btn btn-secondary btn-large" onclick="showDashboard()" style="width: 100%;">
      Back to Dashboard
    </button>
  `);

  voiceAssistant.speak('Manage loans. ' + (managedLoans.length > 0 ? 'You have ' + managedLoans.length + ' managed loans.' : 'Enable loan management to track all your EMIs in one place.'));
}

function enableLoanManagement() {
  const existingLoans = appState.user.existingLoans || [];

  appState.setState({
    managedLoans: existingLoans
  });

  showToast('Loan management enabled! You will receive EMI reminders.', 'success');
  voiceAssistant.speak('Loan management enabled. You will receive EMI reminders 5 days before due date.');

  setTimeout(() => {
    showManageLoans();
  }, 1500);
}

// ===== HELP & SUPPORT =====
function showHelpSupport() {
  renderScreen('help-support', `
    <h2 style="margin-bottom: var(--spacing-lg);">${t('helpSupport')}</h2>
    
    <div class="grid grid-2">
      <div class="card card-interactive" onclick="showToast('Calling support...', 'info'); voiceAssistant.speak('Calling support');">
        <div style="font-size: var(--font-size-4xl); margin-bottom: var(--spacing-sm);">📞</div>
        <h3>Call Support</h3>
        <p style="font-size: var(--font-size-sm); color: var(--text-muted);">Talk to a human agent</p>
      </div>
      
      <div class="card card-interactive" onclick="showToast('Opening chat...', 'info'); voiceAssistant.speak('Opening chat');">
        <div style="font-size: var(--font-size-4xl); margin-bottom: var(--spacing-sm);">💬</div>
        <h3>Live Chat</h3>
        <p style="font-size: var(--font-size-sm); color: var(--text-muted);">Chat with our team</p>
      </div>
      
      <div class="card card-interactive" onclick="showToast('Opening FAQs...', 'info'); voiceAssistant.speak('Opening frequently asked questions');">
        <div style="font-size: var(--font-size-4xl); margin-bottom: var(--spacing-sm);">❓</div>
        <h3>FAQs</h3>
        <p style="font-size: var(--font-size-sm); color: var(--text-muted);">Common questions</p>
      </div>
      
      ${appState.user.isDisabled ? `
        <div class="card card-interactive" style="background: var(--success-gradient);" onclick="showToast('Requesting assisted mode...', 'info'); voiceAssistant.speak('Requesting assisted mode');">
          <div style="font-size: var(--font-size-4xl); margin-bottom: var(--spacing-sm);">🤝</div>
          <h3>Assisted Mode</h3>
          <p style="font-size: var(--font-size-sm);">Priority assistance for you</p>
        </div>
      ` : ''}
    </div>
    
    <div class="card" style="margin-top: var(--spacing-lg); text-align: left;">
      <h3 style="margin-bottom: var(--spacing-md);">Contact Information</h3>
      <p style="margin-bottom: var(--spacing-xs);"><strong>Email:</strong> support@capnest.com</p>
      <p style="margin-bottom: var(--spacing-xs);"><strong>Phone:</strong> 1800-123-4567 (Toll Free)</p>
      <p style="margin-bottom: var(--spacing-xs);"><strong>Hours:</strong> 24/7 Support Available</p>
    </div>
    
    <button class="btn btn-secondary btn-large mt-lg" onclick="showDashboard()" style="width: 100%;">
      Back to Dashboard
    </button>
  `);

  voiceAssistant.speak('Help and support. Options: Call support, Live chat, FAQs, or Assisted mode.');
}

// Export functions
window.showInsurance = showInsurance;
window.showInsuranceDetails = showInsuranceDetails;
window.showTrackStatus = showTrackStatus;
window.showManageLoans = showManageLoans;
window.enableLoanManagement = enableLoanManagement;
window.showHelpSupport = showHelpSupport;
