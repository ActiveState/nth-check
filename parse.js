module.exports = parse;

var ZERO = "0".charCodeAt(0);
var NINE = "9".charCodeAt(0);

function isWhitespace(code) {
    return (
        code === 9  || // '\t'
        code === 10 || // '\n'
        code === 12 || // '\f'
        code === 13 || // '\r'
        code === 32    // ' '
    );
}


function parse(formula) {
    formula = String(formula).trim().toLowerCase();

    if (formula === "even") return [2, 0];
    if (formula === "odd")  return [2, 1];

    var idx = 0;

    var a = 0;
    var sign = readSign();
    var number = readNumber();

    if (idx < formula.length && formula.charAt(idx) === "n") {
        idx++;
        a = sign * (number !== null ? number : 1);

        skipWhitespace();

        if (idx < formula.length) {
            sign = readSign();
            skipWhitespace();
            number = readNumber();
        } else {
            sign = 0;
            number = 0;
        }
    }

    if (number === null || idx < formula.length) {
        throw new SyntaxError("n-th rule couldn't be parsed ('" + formula + "')");
    }

    return [a, sign * number];

    function readSign() {
        if (formula.charAt(idx) === "-") {
            idx++;
            return -1;
        }
        if (formula.charAt(idx) === "+") {
            idx++;
        }
        return 1;
    }

    function readNumber() {
        var start = idx;
        var value = 0;

        while (idx < formula.length) {
            var code = formula.charCodeAt(idx);
            if (code >= ZERO && code <= NINE) {
                value = value * 10 + (code - ZERO);
                idx++;
            } else {
                break;
            }
        }

        return idx === start ? null : value;
    }

    function skipWhitespace() {
        while (idx < formula.length && isWhitespace(formula.charCodeAt(idx))) {
            idx++;
        }
    }
}
