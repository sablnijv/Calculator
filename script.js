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
    }
});