"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
exports.base58Encode = function (buffer) {
    if (!buffer.length)
        return '';
    var digits = [0];
    for (var i = 0; i < buffer.length; i++) {
        for (var j = 0; j < digits.length; j++) {
            digits[j] <<= 8;
        }
        digits[0] += buffer[i];
        var carry = 0;
        for (var k = 0; k < digits.length; k++) {
            digits[k] += carry;
            carry = (digits[k] / 58) | 0;
            digits[k] %= 58;
        }
        while (carry) {
            digits.push(carry % 58);
            carry = (carry / 58) | 0;
        }
    }
    for (var i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) {
        digits.push(0);
    }
    return digits.reverse().map(function (digit) {
        return ALPHABET[digit];
    }).join('');
};
//# sourceMappingURL=utils.js.map