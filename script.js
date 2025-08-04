let screen = document.getElementById('screen');
let currentInput = '0';
let shouldResetScreen = false;

// Initialize calculator
screen.value = '0';

function appendToScreen(value) {
    if (shouldResetScreen) {
        screen.value = '';
        shouldResetScreen = false;
    }
    
    // Handle first input
    if (screen.value === '0' && value !== '.') {
        screen.value = value;
    } else {
        // Prevent multiple decimal points in a number
        if (value === '.') {
            const lastNumber = screen.value.split(/[-+*/]/).pop();
            if (lastNumber.includes('.')) {
                return;
            }
        }
        
        // Prevent multiple operators
        const lastChar = screen.value.slice(-1);
        if (['+', '-', '*', '/'].includes(value) && ['+', '-', '*', '/'].includes(lastChar)) {
            // Replace the last operator with the new one
            screen.value = screen.value.slice(0, -1) + value;
            return;
        }
        
        screen.value += value;
    }
}

function clearScreen() {
    screen.value = '0';
    currentInput = '0';
}

function clearEntry() {
    screen.value = '0';
}

function deleteLast() {
    if (screen.value.length === 1 || (screen.value.length === 2 && screen.value.startsWith('-'))) {
        screen.value = '0';
    } else {
        screen.value = screen.value.slice(0, -1);
    }
}

function calculate() {
    try {
        // Replace × with * for evaluation
        let expression = screen.value.replace(/×/g, '*');
        
        // Handle division by zero and other errors
        if (expression.includes('/0')) {
            const parts = expression.split('/');
            if (parts[1] === '0' || parts[1] === '(0)') {
                throw new Error('Division by zero');
            }
        }
        
        // Evaluate the expression
        let result = eval(expression);
        
        // Handle decimal precision
        if (result % 1 !== 0) {
            result = parseFloat(result.toFixed(10));
        }
        
        screen.value = result;
        shouldResetScreen = true;
    } catch (error) {
        screen.value = 'Error';
        shouldResetScreen = true;
    }
}

function calculateFunction(func) {
    try {
        const value = parseFloat(screen.value);
        let result;
        
        switch(func) {
            case 'sqrt':
                if (value < 0) {
                    throw new Error('Cannot calculate square root of negative number');
                }
                result = Math.sqrt(value);
                break;
            case 'pow':
                result = Math.pow(value, 2);
                break;
            case 'powTen':
                result = Math.pow(10, value);
                break;
            case 'sin':
                result = Math.sin(value * Math.PI / 180); // Convert to radians
                break;
            case 'cos':
                result = Math.cos(value * Math.PI / 180); // Convert to radians
                break;
            case 'tan':
                result = Math.tan(value * Math.PI / 180); // Convert to radians
                break;
            case 'log':
                if (value <= 0) {
                    throw new Error('Cannot calculate logarithm of non-positive number');
                }
                result = Math.log10(value);
                break;
            case 'ln':
                if (value <= 0) {
                    throw new Error('Cannot calculate natural logarithm of non-positive number');
                }
                result = Math.log(value);
                break;
            case 'factorial':
                if (value < 0 || !Number.isInteger(value)) {
                    throw new Error('Factorial is only defined for non-negative integers');
                }
                result = factorial(value);
                break;
            case 'pi':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
        }
        
        // Handle decimal precision
        if (result % 1 !== 0) {
            result = parseFloat(result.toFixed(10));
        }
        
        screen.value = result;
        shouldResetScreen = true;
    } catch (error) {
        screen.value = 'Error';
        shouldResetScreen = true;
    }
}

function factorial(n) {
    if (n === 0 || n === 1) {
        return 1;
    }
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function toggleSign() {
    if (screen.value !== '0') {
        if (screen.value.startsWith('-')) {
            screen.value = screen.value.substring(1);
        } else {
            screen.value = '-' + screen.value;
        }
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendToScreen(key);
    } else if (key === '+' || key === '-') {
        appendToScreen(key);
    } else if (key === '*') {
        appendToScreen('*');
    } else if (key === '/') {
        event.preventDefault();
        appendToScreen('/');
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape') {
        clearScreen();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Delete') {
        clearEntry();
    } else if (key === 's' || key === 'S') {
        calculateFunction('sqrt');
    } else if (key === 'p' || key === 'P') {
        calculateFunction('pow');
    } else if (key === 'l' || key === 'L') {
        calculateFunction('log');
    } else if (key === 'n' || key === 'N') {
        calculateFunction('ln');
    }
});

// Add 3D tilt effect and reflection
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    // Add reflection effect on buttons
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.background = `
                radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.2) 0%, transparent 70%),
                ${getComputedStyle(this).background}
            `;
        });
        
        button.addEventListener('mouseleave', function() {
            // Reset to original background
            this.style.background = '';
            if (this.classList.contains('number')) {
                this.style.background = 'linear-gradient(145deg, #2a2a4a, #1a1a3a)';
            } else if (this.classList.contains('operator')) {
                this.style.background = 'linear-gradient(145deg, #4a2a5a, #3a1a4a)';
            } else if (this.classList.contains('function')) {
                this.style.background = 'linear-gradient(145deg, #2a4a4a, #1a3a3a)';
            } else if (this.classList.contains('equals')) {
                this.style.background = 'linear-gradient(145deg, #2a4a6a, #1a3a5a)';
            } else if (this.classList.contains('clear')) {
                this.style.background = 'linear-gradient(145deg, #5a2a3a, #4a1a2a)';
            }
        });
    });
});