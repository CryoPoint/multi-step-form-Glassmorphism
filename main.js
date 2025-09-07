class MultiStepForm {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.formData = {};
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateProgressBar();
    this.updateNavigationButtons();
  }

  bindEvents() {
    // Navigation buttons
    document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());
    document.getElementById('prevBtn').addEventListener('click', () => this.prevStep());
    document.getElementById('studentForm').addEventListener('submit', (e) => this.handleSubmit(e));

    // Real-time validation
    this.addRealTimeValidation();

    // Input formatting
    this.addInputFormatting();
  }

  addRealTimeValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  addInputFormatting() {
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    const countryCode = document.getElementById('countryCode');
    
    phoneInput.addEventListener('input', (e) => {
      const selectedCountry = countryCode.value;
      let value = e.target.value.replace(/\D/g, '');
      
      // Format based on country
      if (selectedCountry === '+33') { // France
        if (value.length >= 9) {
          value = value.replace(/(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
        }
      } else if (selectedCountry === '+1') { // US/Canada
        if (value.length >= 10) {
          value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        }
      } else if (selectedCountry === '+44') { // UK
        if (value.length >= 10) {
          value = value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
        }
      } else {
        // Default formatting for other countries
        if (value.length >= 8) {
          value = value.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
        }
      }
      
      e.target.value = value;
    });

    // Student ID formatting
    const studentIdInput = document.getElementById('studentId');
    studentIdInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase();
    });

    // Name capitalization
    ['firstName', 'lastName'].forEach(id => {
      const input = document.getElementById(id);
      input.addEventListener('blur', (e) => {
        e.target.value = this.capitalizeWords(e.target.value);
      });
    });
  }

  capitalizeWords(str) {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    this.clearFieldError(field);

    // Required field validation
    if (field.required && !value) {
      isValid = false;
      errorMessage = 'Ce champ est obligatoire';
    }
    // Email validation
    else if (fieldName === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Veuillez entrer une adresse email valide';
      }
    }
    // Username validation
    else if (fieldName === 'username') {
      if (value && (value.length < 3 || value.length > 20)) {
        isValid = false;
        errorMessage = 'Le nom d\'utilisateur doit contenir entre 3 et 20 caractères';
      } else if (value && !/^[a-zA-Z0-9_-]+$/.test(value)) {
        isValid = false;
        errorMessage = 'Seuls les lettres, chiffres, tirets et underscores sont autorisés';
      }
    }
    // Password validation
    else if (fieldName === 'password') {
      if (value && value.length < 8) {
        isValid = false;
        errorMessage = 'Le mot de passe doit contenir au moins 8 caractères';
      } else if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        isValid = false;
        errorMessage = 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre';
      }
    }
    // Confirm password validation
    else if (fieldName === 'confirmPassword') {
      const password = document.getElementById('password').value;
      if (value && value !== password) {
        isValid = false;
        errorMessage = 'Les mots de passe ne correspondent pas';
      }
    }
    // Phone validation
    else if (fieldName === 'phone') {
      const countryCode = document.getElementById('countryCode').value;
      const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
      let isValidPhone = false;
      
      if (value) {
        switch (countryCode) {
          case '+33': // France
            isValidPhone = /^[1-9]\d{8}$/.test(cleanPhone);
            break;
          case '+1': // US/Canada
            isValidPhone = /^\d{10}$/.test(cleanPhone);
            break;
          case '+44': // UK
            isValidPhone = /^\d{10,11}$/.test(cleanPhone);
            break;
          default:
            isValidPhone = /^\d{8,15}$/.test(cleanPhone);
        }
      }
      
      if (value && !isValidPhone) {
        isValid = false;
        errorMessage = 'Veuillez entrer un numéro de téléphone valide pour ce pays';
      }
    }
    // Date of birth validation
    else if (fieldName === 'dateOfBirth') {
      if (value) {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (birthDate > today) {
          isValid = false;
          errorMessage = 'La date de naissance ne peut pas être dans le futur';
        } else if (age < 16 || age > 100) {
          isValid = false;
          errorMessage = 'Vous devez avoir entre 16 et 100 ans';
        }
      }
    }
    // Student ID validation
    else if (fieldName === 'studentId') {
      if (value && (value.length < 5 || value.length > 15)) {
        isValid = false;
        errorMessage = 'Le numéro d\'étudiant doit contenir entre 5 et 15 caractères';
      }
    }
    // Name validation
    else if (['firstName', 'lastName'].includes(fieldName)) {
      if (value && (value.length < 2 || value.length > 50)) {
        isValid = false;
        errorMessage = 'Le nom doit contenir entre 2 et 50 caractères';
      } else if (value && !/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\s'-]+$/u.test(value)) {
        isValid = false;
        errorMessage = 'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets';
      }
    }
    // Program validation
    else if (fieldName === 'program') {
      if (value && (value.length < 2 || value.length > 100)) {
        isValid = false;
        errorMessage = 'Le programme d\'études doit contenir entre 2 et 100 caractères';
      }
    }
    // Address validation
    else if (fieldName === 'address') {
      if (value && value.length < 10) {
        isValid = false;
        errorMessage = 'Veuillez entrer une adresse complète (minimum 10 caractères)';
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
      return false;
    } else {
      this.showFieldValid(field);
      return true;
    }
  }

  showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    const errorElement = document.getElementById(`${field.name}-error`);
    
    formGroup.classList.add('error');
    formGroup.classList.remove('valid');
    
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = document.getElementById(`${field.name}-error`);
    
    formGroup.classList.remove('error');
    
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  showFieldValid(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('valid');
    formGroup.classList.remove('error');
  }

  validateCurrentStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
    const fields = currentStepElement.querySelectorAll('input, select, textarea');
    let isValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    // Special validation for step 4 (terms acceptance)
    if (this.currentStep === 4) {
      const termsCheckbox = document.getElementById('termsAccepted');
      if (!termsCheckbox.checked) {
        this.showFieldError(termsCheckbox, 'Vous devez accepter les conditions d\'utilisation');
        isValid = false;
      }
    }

    return isValid;
  }

  collectStepData() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
    const fields = currentStepElement.querySelectorAll('input, select, textarea');
    
    fields.forEach(field => {
      if (field.type === 'checkbox') {
        this.formData[field.name] = field.checked;
      } else {
        this.formData[field.name] = field.value.trim();
      }
    });
    
    // Combine country code and phone number
    if (this.currentStep === 2) {
      const countryCode = document.getElementById('countryCode').value;
      const phone = document.getElementById('phone').value;
      this.formData.fullPhone = `${countryCode} ${phone}`;
    }
  }

  nextStep() {
    if (this.validateCurrentStep()) {
      this.collectStepData();
      
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.updateSteps();
        this.updateProgressBar();
        this.updateNavigationButtons();
        
        // Generate summary on step 4
        if (this.currentStep === 4) {
          this.generateSummary();
        }
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateSteps();
      this.updateProgressBar();
      this.updateNavigationButtons();
    }
  }

  updateSteps() {
    // Update form steps
    document.querySelectorAll('.form-step').forEach(step => {
      step.classList.remove('active');
    });
    
    document.querySelector(`.form-step[data-step="${this.currentStep}"]`).classList.add('active');

    // Update progress steps
    document.querySelectorAll('.progress-steps .step').forEach((step, index) => {
      step.classList.remove('active', 'completed');
      
      if (index + 1 === this.currentStep) {
        step.classList.add('active');
      } else if (index + 1 < this.currentStep) {
        step.classList.add('completed');
      }
    });
  }

  updateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const percentage = (this.currentStep / this.totalSteps) * 100;
    progressFill.style.width = `${percentage}%`;
  }

  updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    prevBtn.style.display = this.currentStep === 1 ? 'none' : 'inline-flex';
    
    if (this.currentStep === this.totalSteps) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-flex';
    } else {
      nextBtn.style.display = 'inline-flex';
      submitBtn.style.display = 'none';
    }
  }

  generateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    const summaryData = [
      { label: 'Email', value: this.formData.email },
      { label: 'Nom d\'utilisateur', value: this.formData.username },
      { label: 'Prénom', value: this.formData.firstName },
      { label: 'Nom', value: this.formData.lastName },
      { label: 'Date de naissance', value: this.formatDate(this.formData.dateOfBirth) },
      { label: 'Téléphone', value: this.formData.fullPhone || `${this.formData.countryCode} ${this.formData.phone}` },
      { label: 'Adresse', value: this.formData.address },
      { label: 'Numéro étudiant', value: this.formData.studentId },
      { label: 'Université', value: this.getUniversityName(this.formData.university) },
      { label: 'Programme', value: this.formData.program },
      { label: 'Année d\'études', value: this.getYearOfStudyName(this.formData.yearOfStudy) }
    ];

    summaryContent.innerHTML = summaryData.map(item => `
      <div class="summary-item">
        <span class="summary-label">${item.label}:</span>
        <span class="summary-value">${item.value}</span>
      </div>
    `).join('');
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  getUniversityName(value) {
    const universities = {
      'sorbonne': 'Université de la Sorbonne',
      'sciences-po': 'Sciences Po',
      'polytechnique': 'École Polytechnique',
      'hec': 'HEC Paris',
      'autre': 'Autre'
    };
    return universities[value] || value;
  }

  getYearOfStudyName(value) {
    const years = {
      '1': '1ère année',
      '2': '2ème année',
      '3': '3ème année',
      '4': '4ème année',
      '5': '5ème année',
      'master1': 'Master 1',
      'master2': 'Master 2',
      'doctorat': 'Doctorat'
    };
    return years[value] || value;
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateCurrentStep()) {
      return;
    }

    this.collectStepData();

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Traitement en cours...';

    try {
      // Simulate API call
      await this.simulateApiCall();
      
      // Show success message
      this.showSuccessMessage();
    } catch (error) {
      this.showErrorMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.textContent = 'Valider l\'inscription';
    }
  }

  simulateApiCall() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() > 0.05) {
          console.log('Form submitted successfully:', this.formData);
          resolve();
        } else {
          reject(new Error('Simulation error'));
        }
      }, 2000);
    });
  }

  showSuccessMessage() {
    document.querySelector('.form-wrapper').innerHTML = document.getElementById('successMessage').innerHTML;
  }

  showErrorMessage(message) {
    alert(message); // In a real app, you'd show a proper error message
  }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MultiStepForm();
});

// Add some helper functions for better UX
document.addEventListener('DOMContentLoaded', () => {
  // Auto-focus first input in each step
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const target = mutation.target;
        if (target.classList.contains('form-step') && target.classList.contains('active')) {
          const firstInput = target.querySelector('input, select, textarea');
          if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
          }
        }
      }
    });
  });

  document.querySelectorAll('.form-step').forEach(step => {
    observer.observe(step, { attributes: true });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const activeElement = document.activeElement;
      if (activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        if (nextBtn.style.display !== 'none') {
          nextBtn.click();
        } else if (submitBtn.style.display !== 'none') {
          submitBtn.click();
        }
      }
    }
  });
});