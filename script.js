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
          btnParenthesises = document.querySelectorAll('.parenthesis'); 

    let a = '', b = '', c = 0, d = '', x = '',
        symb = '', unaryOperator = '', reserveOperator = '',
        isParenthesisOpen = false;

    /*Данный метод принимает в качестве параметра событие.
      Вставляет текст цели события в элемент div display и присваивает его одной из переменных*/
    function setValue(e) {
        let num = e.target.innerText;

        /*Если id цели события pi или eps, то преобразует переменную num в цисло-константу*/
        if(e.target.id === 'pi') {
            num = Math.PI;
        } else if(e.target.id === 'eiler') {
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
            operatorSymb = '^';
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

        if(symb) {
            x = b;
        } else {
            x = a;
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
        }
        
        displayText.textContent =  displayText.textContent.slice(0, displayText.textContent.search(x));
        displayText.textContent += unaryOperator;

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
            case '^': c = Math.pow(a, b);
                break;
            case '%': c = a % b;
                break;
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
        }
        
        if(symb) {
            b = c + '';
        } else if(!isParenthesisOpen) {
            a = c + '';
            displayNum();
        } else {
            a = c + '';
        }

        unaryOperator = '';
        
    }

    function displayNum() {
        displayText.textContent = c;
    }

    function parenthesisSet() {
        if(isParenthesisOpen) {
            d = a;
            reserveOperator = symb;
            a = '';
            symb = '';
            console.log(`a: ${a}, b: ${b}, c: ${c}, d: ${d}, symb: ${symb}, reserveOperator: ${reserveOperator}`);
        } else if(!isParenthesisOpen) {
            countBinaryFunc();
            console.log(`a: ${a}, b: ${b}, c: ${c}, d: ${d}, symb: ${symb}, reserveOperator: ${reserveOperator}`);
            b = c;
            a = d;
            symb = reserveOperator;
            console.log(`a: ${a}, b: ${b}, c: ${c}, d: ${d}, symb: ${symb}, reserveOperator: ${reserveOperator}`);
            
            
        }
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

    btnParenthesises.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(e.target.id === 'open-parenthesis') {
                isParenthesisOpen = true;
            } else {
                isParenthesisOpen = false;
            }
            displayText.textContent += e.target.innerText;
            parenthesisSet();
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
        d = ''; 
        unaryOperator = ''; 
        reserveOperator = '';
        isParenthesisOpen = false;
    });

    btnEqual.addEventListener('click', () => {
        countBinaryFunc();
        displayNum();
        symb = '';
    });
});