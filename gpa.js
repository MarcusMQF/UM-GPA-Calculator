// Cursor and container effects
const cursor = document.querySelector('.custom-cursor');
const container = document.querySelector('.container');
let isInsideCard = false;

// Cursor movement and tilt effect
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    if (!isInsideCard) {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX - innerWidth / 2) / 25;
        const y = (clientY - innerHeight / 2) / 25;
        container.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    }
});

// Card hover effects
container.addEventListener('mouseenter', () => {
    isInsideCard = true;
    container.style.transform = 'none';
});

container.addEventListener('mouseleave', () => {
    isInsideCard = false;
});

// Hide/show cursor
document.addEventListener('mouseleave', () => {
    cursor.style.display = 'none';
});

document.addEventListener('mouseenter', () => {
    cursor.style.display = 'block';
});

// Calculator elements
const calculateBtn = document.querySelector('.calculate-btn');
const resetBtn = document.querySelector('.reset-btn');
const errorMessage = document.getElementById('error-message');

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    container.classList.add('shake');
    
    setTimeout(() => {
        container.classList.remove('shake');
    }, 100);

    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 3000);
}

function validateInputs() {
    const creditInputs = document.querySelectorAll('.credit-input');
    const gradeSelects = document.querySelectorAll('.grade-select');
    let hasFilledPair = false;
    
    for (let i = 0; i < creditInputs.length; i++) {
        const creditValue = creditInputs[i].value;
        const gradeValue = gradeSelects[i].value;
        
        if (creditValue || gradeValue) {
            hasFilledPair = true;
            
            // Check for negative or decimal values
            if (creditValue && (creditValue < 0 || !Number.isInteger(parseFloat(creditValue)))) {
                showError('Credits must be positive whole numbers');
                return false;
            }
        }

        if ((creditValue && !gradeValue) || (!creditValue && gradeValue)) {
            showError('Please complete both Credit and Grade for each row');
            return false;
        }
        
        if (creditValue && (parseFloat(creditValue) > 5)) {
            showError('Credit value cannot be greater than 5');
            return false;
        }
    }

    if (!hasFilledPair) {
        showError('Please fill at least one row of Credit and Grade');
        return false;
    }
    
    return true;
}

function calculateGPA() {
    const creditInputs = document.querySelectorAll('.credit-input');
    const gradeSelects = document.querySelectorAll('.grade-select');
    
    let totalCredits = 0;
    let totalGradePoints = 0;
    
    for (let i = 0; i < creditInputs.length; i++) {
        const creditValue = parseFloat(creditInputs[i].value);
        const gradeValue = parseFloat(gradeSelects[i].value);
        
        if (!isNaN(creditValue) && !isNaN(gradeValue)) {
            totalCredits += Math.round(creditValue); // Ensure whole numbers
            totalGradePoints += (Math.round(creditValue) * gradeValue);
        }
    }
    
    // Format numbers to prevent excessive decimals
    const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : "0.00";
    
    document.getElementById('total-credits').textContent = totalCredits.toString();
    document.getElementById('gpa-result').textContent = gpa;
    document.getElementById('grade-points').textContent = totalGradePoints.toFixed(2);
}

// Button event listeners
calculateBtn.addEventListener('click', () => {
    if (!validateInputs()) {
        return;
    }
    calculateGPA();
});

resetBtn.addEventListener('click', () => {
    const creditInputs = document.querySelectorAll('.credit-input');
    const gradeSelects = document.querySelectorAll('.grade-select');
    
    creditInputs.forEach(input => input.value = '');
    gradeSelects.forEach(select => select.selectedIndex = 0);
    
    document.getElementById('gpa-result').textContent = '0.00';
    document.getElementById('total-credits').textContent = '0';
    document.getElementById('grade-points').textContent = '0.00';
}); 