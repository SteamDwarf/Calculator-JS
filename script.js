"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const displayText = document.querySelector('.display-text'), 
          btnNums = document.querySelectorAll('.num'),
          btnConstNums = document.querySelectorAll('.const-num'),
          btnDott = document.querySelector('#dott'),
          btnAll = document.querySelectorAll('.btn'),
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
        let regConst = new RegExp(/[\deπ)!]$/);
        let regSimpleNum = new RegExp(/[)πe]$/);

        if(e.target.id === 'pi' || e.target.id === 'eiler') {
            if(!regConst.test(displayText.textContent)) {
                displayText.textContent += num;

                if(e.target.id === 'pi') {
                    num = Math.PI;
                } else if(e.target.id === 'eiler') {
                    num = Math.E;
                }
            } else {
                num = '';
            }
        } else {
            if(!regSimpleNum.test(displayText.textContent)){
                displayText.textContent += num;       
            } else {
                num = '';
            }      
        } 

        if(binaryOperator && displayText.textContent.length > 1) {
            b += num; 
        } else {
            a += num;
        }
    }

    function setDott() {
        let text = displayText.textContent,
            reg = new RegExp(/[-/%.^+]$/);

        if(!text.match(reg) && text !== '') {
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

        if(displayText.textContent[textLength - 1] !== '.') {
            if(displayText.textContent[textLength - 1] === binaryOperator) {
                displayText.textContent = text.slice(0, -1);
                binaryOperator = '';
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
                if(displayText.textContent.length === 0 && (operatorSymb === '+' || operatorSymb === '-')) {
                    a += operatorSymb;
                } else {
                    if(displayText.textContent.length === 0) {
                        a = 0;
                        displayText.textContent += a;
                    }
                    binaryOperator = operatorSymb;
                }
            }
    
            displayText.textContent += operatorSymb;
        }  
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
        unaryOperator = '';
    }

    function equal() {
        countBinaryFunc();
        displayNum();
        c = 0;
        binaryOperator = '';
        unaryOperator = '';
    }

    function setUnaryOperator(operator) {
        let text = displayText.textContent,
            textLength = text.length;

        if (displayText.textContent[textLength - 1] !== '.') {
            if(a === '' && b === '') {
                x = 0;
            } else if(b) {
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
                console.log(displayText.textContent === x);
                displayText.textContent =  displayText.textContent.slice(0, displayText.textContent.search(x));
    
            }
            displayText.textContent += unaryOperator;
    
            if(displayText.textContent[textLength - 1] === binaryOperator) {
                binaryOperator = '';
            }
    
            countUnaryFunc();
        }    
    } 

    function countUnaryFunc() {
/*         let operand;

        if(!binaryOperator) {
            operand = +a;
        } else {
            operand = +b;
        } */

        switch(unaryOperator) {
            case `sin(${x})`: 
                c = Math.sin(x  * (Math.PI / 180));
                break;
            case `cos(${x})`: 
                c = Math.cos(x  * (Math.PI / 180));
                break;
            case `tg(${x})`: 
                c = Math.tan(x  * (Math.PI / 180));
                break;
            case `ctg(${x})`: 
                c = 1 / (Math.tan(x  * (Math.PI / 180)));
                break;
            case `sqrt(${x})`: 
                c = Math.sqrt(x);
                break;
            case `${x}^2`: 
                c = Math.pow(x, 2); 
                break;
            case `${x}!`: 
                c = getFactorial(); 
                break;
            case `ln(${x})`: 
                c = Math.log(x); 
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

        if(x % 2 !== 1 && x % 2 !== 0) {
            fact = '';
            alert('Для вычисления факториала введите целое число');
            displayText.textContent = '';
        } else if(x > 1000) {
            fact = Infinity;
        } else {
            for(let i = 1; i <= x; i++) {
                fact *= i;
            }
        }

        return fact;
    }

    btnAll.forEach(btn => {
        btn.addEventListener('click', () => {
            if(displayText.textContent.includes('NaN')) {
                refresh();
            }
        });
    });

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