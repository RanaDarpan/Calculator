class Calculator {
    constructor(prevElement, currElement) {
        this.prevElement = prevElement; // Mini Display Element
        this.currElement = currElement; // Main Display Element
        this.clear(); // Clear display and assign initial values
        localStorage.setItem('time', 0);
        localStorage.setItem('name', '');
    }

    clear() {
        if (localStorage.getItem('time')) {
            // Display only first time when user uses it
            this.currElement.innerText = 'Super Calculator';
            this.prevElement.innerText = '⚡';
            localStorage.setItem('time', 1);
        }
        this.prevNumber = ''; // Previous Operand
        this.currNumber = ''; // Current Operand
        this.operation = undefined; // Operation
    }

    deleteNumber() {
        if (this.currNumber) {
            // Delete last digit of a number
            this.currNumber = this.currNumber.slice(0, -1);
        } else {
            // Move previous number to current
            this.currNumber = this.prevNumber;
            this.prevNumber = '';
            this.operation = undefined;
        }
    }

    setOperation(key) {
        if (this.currNumber === '') return;
        if (this.prevNumber !== '') this.calculate(); // Calculate if there's a previous number
        this.operation = key;
        this.prevNumber = this.currNumber;
        this.currNumber = '';
    }

    appendNumber(number) {
        if (number === '.' && this.currNumber.includes('.')) return; // Prevent multiple dots
        this.currNumber += number; // Append number
    }

    updateDisplay() {
        if (localStorage.getItem('name') === 'raj') {
            this.prevElement.innerText = 'Made by';
            this.currElement.innerText = 'Raj Patel';
            localStorage.setItem('name', '');
            return;
        }
        
        this.currElement.innerText = this.currNumber; 
        this.prevElement.innerText = this.operation ? `${this.prevNumber} ${this.operation}` : '';
    }

    calculate() {
        let num1 = parseFloat(this.prevNumber);
        let num2 = parseFloat(this.currNumber);
        if (isNaN(num2) && num1 === 4823 && this.operation === '+') {
            localStorage.setItem('name', 'raj');
        }
        if (isNaN(num1) || isNaN(num2)) return; // Check for valid numbers

        // Perform calculation based on operation
        let ans;
        switch (this.operation) {
            case '+': ans = num1 + num2; break;
            case '-': ans = num1 - num2; break;
            case 'x': ans = num1 * num2; break;
            case '÷': 
                ans = num1 / num2; 
                if (ans.toString().includes('.')) ans = ans.toFixed(2); // Round to 2 decimals
                break;
            default: return;
        }
        this.currNumber = ans; // Update current number to answer
        this.prevNumber = '';
        this.operation = undefined;
    }
}

// DOM elements
const numberBtn = document.querySelectorAll("[data-number]");
const operationBtn = document.querySelectorAll("[data-operation]");
const deleteBtn = document.querySelector("[data-delete]");
const allClearBtn = document.querySelector("[data-all-clear]");
const equalsBtn = document.querySelector("[data-equals]");
const prevElement = document.querySelector('#mini-display');
const currElement = document.querySelector('#main-display');

const calculator = new Calculator(prevElement, currElement);

// Event listeners for buttons
numberBtn.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationBtn.forEach(button => {
    button.addEventListener('click', () => {
        calculator.setOperation(button.innerText);
        calculator.updateDisplay();
    });
});

deleteBtn.addEventListener('click', () => {
    calculator.deleteNumber();
    calculator.updateDisplay();
});

allClearBtn.addEventListener('click', () => {
    calculator.clear();
});

equalsBtn.addEventListener('click', () => {
    calculator.calculate();
    calculator.updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.code.charAt(event.code.length - 1);
    if (!isNaN(key)) {
        calculator.appendNumber(key);
        calculator.updateDisplay();
    } else {
        switch (event.code) {
            case 'Delete': calculator.clear(); break;
            case 'Backspace': calculator.deleteNumber(); break;
            case 'Enter': case 'Equal': case 'NumpadEnter':
                calculator.calculate(); break;
            case 'NumpadDecimal': calculator.appendNumber('.'); break;
            case 'NumpadAdd': calculator.setOperation('+'); break;
            case 'NumpadSubtract': calculator.setOperation('-'); break;
            case 'NumpadMultiply': calculator.setOperation('x'); break;
            case 'NumpadDivide': calculator.setOperation('÷'); break;
            default: break;
        }
        calculator.updateDisplay();
    }
});
