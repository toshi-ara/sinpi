// References:
// - https://github.com/math-io/sinpi
// - https://github.com/math-io/float64-copysign
// - https://github.com/math-io/float64-get-high-word
// - https://github.com/math-io/float64-to-words
// - https://github.com/math-io/float64-from-words
// - https://github.com/kgryte/utils-is-little-endian
//
// above files are distributed by MIT license
// NOTES //
/**
 * Notes:
 *	=> sin(-x) = -sin(x)
 *	=> sin(+n) = +0, where `n` is a positive integer
 *	=> sin(-n) = -sin(+n) = -0, where `n` is a positive integer
 *	=> cos(-x) = cos(x)
 */
// VARIABLES //
const PI = 3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679; // eslint-disable-line max-len
const PINF = Number.POSITIVE_INFINITY;
const NINF = Number.NEGATIVE_INFINITY;
// 10000000000000000000000000000000 => 2147483648 => 0x80000000
const SIGN_MASK = 0x80000000;
// 01111111111111111111111111111111 => 2147483647 => 0x7fffffff
const MAGNITUDE_MASK = 0x7fffffff;
let FLOAT64_VIEW = new Float64Array(1);
let UINT32_VIEW = new Uint32Array(FLOAT64_VIEW.buffer);
// SINPI //
/**
 * FUNCTION: sinpi( x )
 *	Computes the value of `sin(πx)`.
 *
 * @param {Number} x - input value
 * @returns {Number} function value
 */
export function sinpi(x) {
    if (isNaN(x)) {
        return NaN;
    }
    if (x === PINF || x === NINF) {
        throw new RangeError('invalid input argument. Must provide a finite number. Value: `' + x + '`.');
    }
    // Argument reduction (reduce to [0,2))...
    let r = x % 2; // sign preserving
    let ar = Math.abs(r);
    // If `x` is an integer, the mod is an integer...
    if (ar === 0 || ar === 1) {
        return copysign(0.0, r);
    }
    if (ar < 0.25) {
        return Math.sin(PI * r);
    }
    // In each of the following, we further reduce to [-π/4,π/4)...
    if (ar < 0.75) {
        ar = 0.5 - ar;
        return copysign(Math.cos(PI * ar), r);
    }
    if (ar < 1.25) {
        r = copysign(1.0, r) - r;
        return Math.sin(PI * r);
    }
    if (ar < 1.75) {
        ar = ar - 1.5;
        return -copysign(Math.cos(PI * ar), r);
    }
    r = r - copysign(2.0, r);
    return Math.sin(PI * r);
}
// COPYSIGN //
/**
 * FUNCTION: copysign( x, y )
 *	Returns a double-precision floating-point number
 *	with the magnitude of `x` and the sign of `y`.
 *
 * @param {Number} x - number from which to derive a magnitude
 * @param {Number} y - number from which to derive a sign
 * @returns {Number} a double-precision floating-point number
 */
function copysign(x, y) {
    // Split `x` into higher and lower order words:
    let xx = toWords(x);
    let hx = xx[0];
    // Turn off the sign bit of `x`:
    hx &= MAGNITUDE_MASK;
    // Extract the higher order word from `y`:
    let hy = getHighWord(y);
    // Leave only the sign bit of `y` turned on:
    hy &= SIGN_MASK;
    // Copy the sign bit of `y` to `x`:
    hx |= hy;
    // Return a new value having the same magnitude as `x`,
    // but with the sign of `y`:
    return fromWords(hx, xx[1]);
}
/**
* FUNCTION: isLittleEndian()
*	Returns a boolean indicating if an environment is little endian.
*
* @returns {Boolean} boolean indicating if an environment is little endian
*/
const ctors = {
    'uint16': Uint16Array,
    'uint8': Uint8Array
};
function isLittleEndian() {
    let uint16_view = new ctors['uint16'](1);
    // Set the uint16 view to a value
    // having distinguishable lower and higher order words.
    // 4660 => 0x1234 => 0x12 0x34 => '00010010 00110100' => (0x12,0x34) == (18,52)
    uint16_view[0] = 0x1234;
    // Create a uint8 view on top of the uint16 buffer:
    let uint8_view = new ctors['uint8'](uint16_view.buffer);
    // If little endian, the least significant byte will be first...
    return (uint8_view[0] === 0x34);
}
// HIGH WORD //
/**
 * FUNCTION: getHighWord(x)
 *	Returns an unsigned 32-bit integer corresponding to
 *	the more significant 32 bits of a double-precision floating-point number.
 *
 * @param {Number} x - input value
 * @returns {Number} higher order word
 */
function getHighWord(x) {
    const HIGH = isLittleEndian() ? 1 : 0;
    FLOAT64_VIEW[0] = x;
    return UINT32_VIEW[HIGH];
}
// TO WORDS //
/**
 * FUNCTION: toWords(x)
 *	Splits a floating-point number into a higher order word (32-bit integer)
 *	and a lower order word (32-bit integer).
 *
 * @param {Number} x - input value
 * @returns {Number[]} two-element array containing a higher order word and a lower order word
 */
function toWords(x) {
    let HIGH, LOW;
    if (isLittleEndian() === true) {
        HIGH = 1; // second index
        LOW = 0; // first index
    }
    else {
        HIGH = 0; // first index
        LOW = 1; // second index
    }
    FLOAT64_VIEW[0] = x;
    return [UINT32_VIEW[HIGH], UINT32_VIEW[LOW]];
}
// TO FLOAT64 //
/**
 * FUNCTION: fromWords(high, low)
 *	Creates a double-precision floating-point number from a higher order word (32-bit integer) and a lower order word (32-bit integer).
 *
 * @param {Number} high - higher order word (unsigned 32-bit integer)
 * @param {Number} low - lower order word (unsigned 32-bit integer)
 * @returns {Number} floating-point number
 */
function fromWords(high, low) {
    let HIGH, LOW;
    if (isLittleEndian() === true) {
        HIGH = 1; // second index
        LOW = 0; // first index
    }
    else {
        HIGH = 0; // first index
        LOW = 1; // second index
    }
    UINT32_VIEW[HIGH] = high;
    UINT32_VIEW[LOW] = low;
    return FLOAT64_VIEW[0];
}
//# sourceMappingURL=index.js.map