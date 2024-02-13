import { sinpi } from "../dist/esm/index.js";

test("Check sinpi function", () => {
    const x = [
        0, 1, 2, -1, -2,
        1/3, 5/4
    ];
    const y = [
        0, 0, 0, -0, -0,
        0.8660254037844386, -0.7071067811865476
    ];


    const n = x.length;
    for (let i = 0; i < n; i++) {
        expect(sinpi(x[i])).toBeCloseTo(y[i], 12);
    }
});

