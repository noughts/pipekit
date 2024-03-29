import { find, shuffle, sort, take, uniq } from '$lib/array.js';
import { toDate, toUnixTime } from '$lib/date.js';
import { pipe } from '$lib/pipe.js';
import { describe, it, expect } from 'vitest';

describe("pipe", () => {
    it("anonymous functions", () => {
        const res = pipe(" Hoge ",
            x => x.trim(),
            x => x.length
        )
        expect(res).toBe(4);
    })
})

describe('array', () => {
    it('sort asc', () => {
        const orig = [1, 5, 2, 4, 3]
        const result = pipe(orig, sort((a, b) => a - b))
        expect(orig).toStrictEqual([1, 5, 2, 4, 3])
        expect(result).toStrictEqual([1, 2, 3, 4, 5]);
    });
    it('sort desc', () => {
        const orig = [1, 5, 2, 4, 3]
        const result = pipe(orig, sort((a, b) => b - a))
        expect(orig).toStrictEqual([1, 5, 2, 4, 3])
        expect(result).toStrictEqual([5, 4, 3, 2, 1]);
    });

    it('take', () => {
        const orig = [1, 5, 2, 4, 3]
        const result = pipe(orig, take(2))
        expect(orig).toStrictEqual([1, 5, 2, 4, 3])
        expect(result).toStrictEqual([1, 5]);
    });

    it("shuffle", () => {
        const orig = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const result = pipe(orig, shuffle);
        expect(orig).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])// orig not changed
        expect(result).not.toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    })

    it("uniq", () => {
        const orig = [{ id: 1, name: "hoge" }, { id: 1, name: "fuga" }, { id: 2, name: "piyo" }]
        const result = pipe(orig, uniq(x => x.id));
        expect(orig).toStrictEqual([{ id: 1, name: "hoge" }, { id: 1, name: "fuga" }, { id: 2, name: "piyo" }])// orig not changed
        expect(result).toStrictEqual([{ id: 1, name: "hoge" }, { id: 2, name: "piyo" }]);
    })

    it("find", () => {

        const found = pipe([1, 2, 3, 4, 5], find(x => x > 3))
        expect(found).toBe(4);

        const people = [
            { name: 'Alice', age: 30 },
            { name: 'Bob', age: 25 },
            { name: 'Charlie', age: 35 }
        ];
        const person = pipe(people, find(x => x.name === 'Bob'))
        expect(person).toStrictEqual({ name: 'Bob', age: 25 })
    })
});

describe("date", () => {
    it('toDate', () => {
        const result = pipe(1711688078 * 1000, toDate)
        expect(result).toStrictEqual(new Date(1711688078 * 1000))
        expect(pipe(result, toUnixTime)).toBe(1711688078 * 1000);
    });
}) 