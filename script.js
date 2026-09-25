let display = document.querySelector(".display");
let buttons = document.querySelectorAll(".buttons button");

let currentValue = "";

buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        let value = button.innerText;

        if (value === "C") {

            currentValue = "";
            display.innerText = "";

        } else if (value === "x") {

            currentValue = currentValue.slice(0, -1);
            display.innerText = currentValue;

        } else if (value === "=") {

            let result = calculate(currentValue);

            if (result !== null) {
                currentValue = String(result);
                display.innerText = currentValue;
            }

        } else if (value === ".") {

            let parts = currentValue.split(/[+\-*/]/);
            let lastNumber = parts[parts.length - 1];

            if (!lastNumber.includes(".")) {
                currentValue += lastNumber === "" ? "0." : ".";
                display.innerText = currentValue;
            }

        } else if (value === "+/-") {

            let match = currentValue.match(/(-?\d+\.?\d*)$/);

            if (match) {

                let number = match[0];
                let start = currentValue.length - number.length;

                currentValue = number.startsWith("-")
                    ? currentValue.slice(0, start) + number.slice(1)
                    : currentValue.slice(0, start) + "-" + number;

                display.innerText = currentValue;
            }

        } else if (value === "%") {

            let match = currentValue.match(/(\d+\.?\d*)$/);

            if (match) {

                let start = currentValue.length - match[0].length;
                let number = Number(match[0]) / 100;

                currentValue =
                    currentValue.slice(0, start) + number;

                display.innerText = currentValue;
            }

        } else if ("+-*/".includes(value)) {

            if (currentValue === "") return;

            let last = currentValue.at(-1);

            if ("+-*/".includes(last)) {
                currentValue = currentValue.slice(0, -1) + value;
            } else {
                currentValue += value;
            }

            display.innerText = currentValue;

        } else {

            currentValue += value;
            display.innerText = currentValue;

        }
    });
});


function calculate(expression) {

    let numbers = [];
    let operators = [];
    let number = "";

    for (let char of expression) {

        if ("0123456789.".includes(char)) {

            number += char;

        } else if ("+-*/".includes(char)) {

            if (number === "") return null;

            numbers.push(Number(number));
            operators.push(char);
            number = "";
        }
    }

    if (number === "") return null;

    numbers.push(Number(number));


    for (let i = 0; i < operators.length; i++) {

        if (operators[i] === "*" || operators[i] === "/") {

            if (operators[i] === "/" && numbers[i + 1] === 0) {
                display.innerText = "Error";
                return null;
            }

            let result = operators[i] === "*"
                ? numbers[i] * numbers[i + 1]
                : numbers[i] / numbers[i + 1];

            numbers[i] = result;
            numbers.splice(i + 1, 1);
            operators.splice(i, 1);

            i--;
        }
    }


    let result = numbers[0];

    for (let i = 0; i < operators.length; i++) {

        result = operators[i] === "+"
            ? result + numbers[i + 1]
            : result - numbers[i + 1];
    }

    return result;
}