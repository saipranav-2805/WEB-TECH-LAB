// Form validation script

const form = document.getElementById('registrationForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const regNumberInput = document.getElementById('regNumber');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');
const regNumberError = document.getElementById('regNumberError');

const successMessage = document.getElementById('successMessage');

// Validation functions
function validateName(name) {
    const trimmed = name.trim();
    if (!trimmed) {
        return { valid: false, message: 'Name is required' };
    }
    if (trimmed.length < 3) {
        return { valid: false, message: 'Name must be at least 3 characters' };
    }
    return { valid: true, message: '' };
}

function validateEmail(email) {
    const trimmed = email.trim();
    
    if (!trimmed) {
        return { valid: false, message: 'Email is required' };
    }
    
    if (!trimmed.includes('@')) {
        return { valid: false, message: 'Email must contain @' };
    }
    
    if (!trimmed.includes('.')) {
        return { valid: false, message: 'Email must contain .' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
        return { valid: false, message: 'Invalid email format' };
    }
    
    return { valid: true, message: '' };
}

function validatePhone(phone) {
    const trimmed = phone.trim();
    
    if (!trimmed) {
        return { valid: false, message: 'Phone is required' };
    }
    
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(trimmed)) {
        return { valid: false, message: 'Phone must be 10 digits' };
    }
    
    return { valid: true, message: '' };
}

function validateRegistrationNumber(regNumber) {
    const trimmed = regNumber.trim();
    
    if (!trimmed) {
        return { valid: false, message: 'Registration number is required' };
    }
    
    return { valid: true, message: '' };
}

// Show error
function showError(errorElement, message) {
    errorElement.textContent = message;
}

// Clear error
function clearError(errorElement) {
    errorElement.textContent = '';
}

// Form submission
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    const nameValidation = validateName(nameInput.value);
    const emailValidation = validateEmail(emailInput.value);
    const phoneValidation = validatePhone(phoneInput.value);
    const regNumberValidation = validateRegistrationNumber(regNumberInput.value);
    
    // Show/clear errors
    if (!nameValidation.valid) {
        showError(nameError, nameValidation.message);
    } else {
        clearError(nameError);
    }
    
    if (!emailValidation.valid) {
        showError(emailError, emailValidation.message);
    } else {
        clearError(emailError);
    }
    
    if (!phoneValidation.valid) {
        showError(phoneError, phoneValidation.message);
    } else {
        clearError(phoneError);
    }
    
    if (!regNumberValidation.valid) {
        showError(regNumberError, regNumberValidation.message);
    } else {
        clearError(regNumberError);
    }
    
    // If all valid, show success
    if (nameValidation.valid && emailValidation.valid && phoneValidation.valid && regNumberValidation.valid) {
        // Display form data
        document.getElementById('displayName').textContent = nameInput.value;
        document.getElementById('displayEmail').textContent = emailInput.value;
        document.getElementById('displayPhone').textContent = phoneInput.value;
        document.getElementById('displayRegNumber').textContent = regNumberInput.value;
        
        // Hide form, show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';
    }
});

