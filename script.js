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
          btnEqual = document.querySelector('#equal');     

    let a = '', b = '', c = 0, symb = '', unaryOperator = '';

    /*Данный метод принимает в качестве параметра событие.
      Вставляет текст цели события в элемент div display и присваивает его одной из переменных*/
    function setValue(e) {
        let num = e.target.innerText;

        /*Если id цели события pi или eps, то преобразует переменную num в цисло-константу*/
        if(e.target.id === 'pi') {
            num = Math.PI;
        } else if(e.target.id === 'eps') {
            num = Math.E;
        }
        
        displayText.textContent += num;
            
        /*В зависимости от того есть ли в переменной symb какое либо значение, определяет какой из переменной 
          присвоить значение num*/
        if(symb) {
            b += num; 
        } else {
            a += num;
        }

        console.log(a, b, symb);
    }

    function deleteLastSymb() {
        let text = displayText.textContent;

        if(symb) {
            if(text[text.length - 1] === '+') {
                symb = '';
            } else {
                b = b.slice(0, -1);
            }
        } else {
            a = a.slice(0, -1);
        }

        displayText.textContent = text.slice(0, -1);
    }

    /*Метод, который настраивает работу стандартных операторов*/
    function setBinaryOperator(operator) {
        let text = displayText.textContent,
            textLength = text.length,
            operatorSymb = operator.innerText;

        //Если при вводе нового оператаора в переменной symb уже есть оператор, то в display он удаляется
        if(displayText.textContent[textLength - 1] === symb) {
            displayText.textContent = text.slice(0, -1);
        }

        if(operator.id === 'x-pow-y') {
            operatorSymb = 'x^y';
        }

        /*Если в переменной symb уже есть оператор, то сперва выполнится арифметическое действие 
          с уже имеющимся оператором, а только потом в переменную symb присвоится новый оператор*/
        if(symb) {
            countBinaryFunc();
            symb = operatorSymb;
        } else {
            symb = operatorSymb;
        }
        displayText.textContent += operatorSymb;
    }

    function setUnaryOperator(operator) {
        let text = displayText.textContent,
            textLength = text.length;

        if(operator.id === 'x-pow-2') {
            unaryOperator = 'xPow2';
        } else if(operator.id === 'sqrt') {
            unaryOperator = 'sqrt';
        } else {
            unaryOperator = operator.innerText;
        }

        if(displayText.textContent[textLength - 1] === symb) {
            symb = '';
        }

        if(symb) {
            countUnaryFunc();
            countBinaryFunc();
            displayNum();
        } else {
            countUnaryFunc();
            console.log(a, b, c, symb, unaryOperator);
        }
    }

    function setDott() {
        let textLength = displayText.textContent.length;

        if(displayText.textContent[textLength - 1] !== '.') {
            if(symb && !b.includes('.')) {
                b += '.'; 
                displayText.textContent += '.';
            } else if(!a.includes('.')) {
                a += '.';
                displayText.textContent += '.';
            }
        }
    }

    /*Данная функция, в зависимости от значения переменной symb, определяет какое действие 
      будет выполняться с операндами*/
    function countBinaryFunc() {
        a = +a;
        b = +b;

        switch(symb) {
            case '+': c = a + b;
                break;
            case '-': c = a - b;
                break;
            case '*': c = a * b;
                break;
            case '/': c = a / b;
                break;
            case 'x^y': c = Math.pow(a, b);
                break;
            /* case '%': c = a % b;
                break; */
        }
        
        a = c + '';
        b = '';
        symb = '';
    }

    function countUnaryFunc() {
        let operand = +a;

        if(symb) {
            operand = +b;
        }

        switch(unaryOperator) {
            case 'sin(x)': c = Math.sin(operand  * (Math.PI / 180));
                break;
            case 'cos(x)': c = Math.cos(operand  * (Math.PI / 180));
                break;
            case 'tg(x)': c = Math.tan(operand  * (Math.PI / 180));
                break;
            case 'ctg(x)': c = 1 / (Math.tan(operand  * (Math.PI / 180)));
                break;
            case 'sqrt': c = Math.sqrt(operand);
                break;
            case 'xPow2': c = Math.pow(operand, 2); 
            
        }
        
        if(symb) {
            b = c + '';
        } else {
            a = c + '';
            displayNum();
        }

        unaryOperator = '';
        
    }

    function displayNum() {
        displayText.textContent = c;
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
        displayText.textContent = '';
        a = ''; 
        b = ''; 
        c = ''; 
        symb = '';
    });

    btnEqual.addEventListener('click', () => {
        countBinaryFunc();
        displayNum();
        symb = '';
    });
});