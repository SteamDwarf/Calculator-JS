"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const displayText = document.querySelector('.display-text'), 
          btnNums = document.querySelectorAll('.num'),
          btnConstNums = document.querySelectorAll('.const-num'),
          btnDott = document.querySelector('#dott'),
          btnPowY = document.querySelector('#x-pow-y'),
          btnClear = document.querySelector('#clear'),
          btnDelete = document.querySelector('#delete'),
          btnBinaryActions = document.querySelectorAll('[data-action="binary-action"]'),
          btnUnaryActions = document.querySelectorAll('[data-action="unary-action"]'),
          btnEqual = document.querySelector('#equal'),
          btnParenthesis = document.querySelector('.parenthesis'); 

    let a = '', b = '', c = 0, d = '', x = '', r ='',
        binaryOperator = '', unaryOperator = '', 
        reserveOperator = '', reserveOperator2 = '', reserveOperatorUnary = '';

      function displayNum() {
        displayText.textContent = c;
    }

    function refresh() {
        displayText.textContent = '';
        a = ''; b = ''; c = 0; d = ''; x = ''; r ='';
        binaryOperator = ''; unaryOperator = ''; 
        reserveOperator = ''; reserveOperator2 = ''; reserveOperatorUnary = '';
    }

     function deleteLastSymb() {
        let text = displayText.textContent;
        if(binaryOperator) {
            displayText.textContent = text.slice(0, -1);
            if(text[text.length - 1 ] === binaryOperator) {
                binaryOperator = '';
            } else {
                b = b.slice(0, -1);
            }
        } else if(a){
            a = a.slice(0, -1);
            displayText.textContent = text.slice(0, -1);
        }
        //console.log(`a: ${a}, b: ${b}, c: ${c}, d: ${d}, symb: ${binaryOperator}, reserveOperator: ${reserveOperator}`);
    }

    function setValue(e) {
        let num = e.target.innerText;

        displayText.textContent += num;

        if(e.target.id === 'pi') {
            num = Math.PI;
        } else if(e.target.id === 'eiler') {
            num = Math.E;
        }
            
        if(binaryOperator) {
            b += num; 
        } else {
            a += num;
        }
    }

    function setDott() {
        let text = displayText.textContent,
            reg = new RegExp(/[-/%.^+]$/);

        if(!text.match(reg)) {
            if(binaryOperator && !b.includes('.')) {
                b += '.'; 
                displayText.textContent += '.';
            } else if(!a.includes('.')) {
                a += '.';
                displayText.textContent += '.';
            }
        }
    }

    function setBinaryOperator(operator) {
        let text = displayText.textContent,
            textLength = text.length,
            operatorSymb = operator.innerText;

        if(displayText.textContent[textLength - 1] === binaryOperator) {
            displayText.textContent = text.slice(0, -1);
        }

        if(operator.id === 'x-pow-y') {
            operatorSymb = '^';
        }

        if(binaryOperator) {
            if(operatorSymb === '^') {
                if(d) {
                    r = d;
                    reserveOperator2 = reserveOperator;
                }
                d = a;
                a = b;
                b = '';
                reserveOperator = binaryOperator;
                binaryOperator = operatorSymb;
            } else if(operatorSymb.match(/[*/%]/) && !binaryOperator.match(/[*/%]/)) {
                d = a;
                a = b;
                b = '';
                reserveOperator = binaryOperator;
                binaryOperator = operatorSymb;
            } else {
                countBinaryFunc();
                binaryOperator = operatorSymb;
            }
        } else {
            binaryOperator = operatorSymb;
        }

        displayText.textContent += operatorSymb;
    }

    function countBinaryFunc() {
        a = +a;
        b = +b;

        switch(binaryOperator) {
            case '+': c = a + b;
                break;
            case '-': c = a - b;
                break;
            case '*': c = a * b;
                break;
            case '/': c = a / b;
                break;
            case '^': c = Math.pow(a, b);
                break;
            case '%': c = a % b;
                break;
        }

        a = c + '';
        if(d) {
            b = a;
            a = d;
            binaryOperator = reserveOperator;
            d = r;
            r = '';
            reserveOperator = reserveOperator2;
            countBinaryFunc();
        }
        b = '';
        d = '';
        r = '';
        displayNum();
    }

    function equal() {
        countBinaryFunc();
        displayNum();
        c = 0;
        binaryOperator = '';
    }

    function setUnaryOperator(operator) {
        let text = displayText.textContent,
            textLength = text.length;

        if(binaryOperator) {
            x = b;
        } else {
            x = a;
        }
    
        if(unaryOperator) {
            reserveOperatorUnary = unaryOperator;
        }

        switch(operator.id) {
            case 'x-pow-2':
                unaryOperator = `${x}^2`;
                break;
            case 'sin':
                unaryOperator = `sin(${x})`;
                break;
            case 'cos':
                unaryOperator = `cos(${x})`;
                break;
            case 'tg':
                unaryOperator = `tg(${x})`;
                break;
            case 'ctg':
                unaryOperator = `ctg(${x})`;
                break;
            case 'sqrt':
                unaryOperator = `sqrt(${x})`;
                break;
            case 'factorial':
                unaryOperator = `${x}!`;
                break;
            case 'natural-logarithm':
                unaryOperator = `ln(${x})`;
                break;
        }
        
        if(reserveOperatorUnary) {
            displayText.textContent = displayText.textContent.slice(0,displayText.textContent.indexOf(reserveOperatorUnary, 0));
            reserveOperatorUnary = '';
        } else {
            displayText.textContent =  displayText.textContent.slice(0, displayText.textContent.search(x));
        }
        displayText.textContent += unaryOperator;

        if(displayText.textContent[textLength - 1] === binaryOperator) {
            binaryOperator = '';
        }

        countUnaryFunc();
    } 

    function countUnaryFunc() {
        let operand;

        if(!binaryOperator) {
            operand = +a;
        } else {
            operand = +b;
        }

        switch(unaryOperator) {
            case `sin(${x})`: 
                c = Math.sin(operand  * (Math.PI / 180));
                break;
            case `cos(${x})`: 
                c = Math.cos(operand  * (Math.PI / 180));
                break;
            case `tg(${x})`: 
                c = Math.tan(operand  * (Math.PI / 180));
                break;
            case `ctg(${x})`: 
                c = 1 / (Math.tan(operand  * (Math.PI / 180)));
                break;
            case `sqrt(${x})`: 
                c = Math.sqrt(operand);
                break;
            case `${x}^2`: 
                c = Math.pow(operand, 2); 
                break;
            case `${x}!`: 
                c = getFactorial(); 
                break;
            case `ln(${x})`: 
                c = Math.log(operand); 
                break;
        }
        
        if(!binaryOperator) {
            a = c;
        } else {
            b = c;
        }
    } 

    function getFactorial() {
        let fact = 1;
        for(let i = 1; i <= x; i++) {
            fact *= i;
        }
        return fact;
    }

    btnNums.forEach(numBtn => {
        numBtn.addEventListener('click', (e) => {
            setValue(e);
        });
    });
    btnConstNums.forEach(numBtn => {
        numBtn.addEventListener('click', (e) => {
            setValue(e);
        });
    });
    btnBinaryActions.forEach(action => {
        action.addEventListener('click', e => {
            let operator = e.target;
            setBinaryOperator(operator);

        });
    });
    btnUnaryActions.forEach(action => {
        action.addEventListener('click', e => {
            let operator = e.target;
            setUnaryOperator(operator);
        });
    });

    btnDott.addEventListener('click', () => {
        setDott();
    });
    btnDelete.addEventListener('click', () => {
        deleteLastSymb();
    });
    btnClear.addEventListener('click', () => {
        refresh();
    });
    btnEqual.addEventListener('click', () => {
        equal();
    });
});