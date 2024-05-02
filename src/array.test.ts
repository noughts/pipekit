import { compact, filter, find, flatten, join, map, shuffle, sort, take, uniq } from '$lib/array.js';
import { pipe } from '$lib/pipe.js';
import { describe, expect, it } from 'vitest';


describe('Array Module', () => {
    it("flatten", () => {
        const orig = [[1, 2], [3, 4]];
        const res = pipe(orig, flatten);
        expect(res).toStrictEqual([1, 2, 3, 4]);
    })

    it('sort() asc', () => {
        const orig = [1, 5, 2, 4, 3]
        const result = pipe(orig, sort((a, b) => a - b))
        expect(orig).toStrictEqual([1, 5, 2, 4, 3])
        expect(result).toStrictEqual([1, 2, 3, 4, 5]);
    });
    it('sort() desc', () => {
        const orig = [1, 5, 2, 4, 3]
        const result = pipe(orig, sort((a, b) => b - a))
        expect(orig).toStrictEqual([1, 5, 2, 4, 3])
        expect(result).toStrictEqual([5, 4, 3, 2, 1]);
    });

    it('take()', () => {
        const orig = [1, 5, 2, 4, 3]
        const result = pipe(orig, take(2))
        expect(orig).toStrictEqual([1, 5, 2, 4, 3])
        expect(result).toStrictEqual([1, 5]);
    });

    it("shuffle()", () => {
        const orig = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const result = pipe(orig, shuffle);
        expect(orig).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])// orig not changed
        expect(result).not.toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    })

    it("compact()", () => {
        const orig = ["hoge", null, "fuga"];
        const result = pipe(orig, compact);
        expect(result.length).toBe(2);
    })

    describe("join()", () => {
        it("with separater", () => {
            const orig = ["a", "b", "c"];
            const result = pipe(orig, join("/"));
            expect(result).toBe("a/b/c");
        })
        it("without separater", () => {
            const orig = ["a", "b", "c"];
            const result = pipe(orig, join());
            expect(result).toBe("a,b,c");
        })
    })


    describe("filter()", () => {
        it("normal", () => {
            const orig = [{ id: 1, name: "hoge" }, { id: 1, name: "fuga" }, { id: 2, name: "piyo", age: 123 }]
            const result = pipe(orig, filter(x => x.age));
            expect(result).toStrictEqual([{ id: 2, name: "piyo", age: 123 }]);
        })
        it("immutability", () => {
            const orig = [{ id: 1, name: "hoge" }, { id: 1, name: "fuga" }, { id: 2, name: "piyo", age: 123 }]
            const result = pipe(orig, filter(x => x.age));
            expect(result).toStrictEqual([{ id: 2, name: "piyo", age: 123 }]);
        })
        it("not found", () => {
            const orig = [{ id: 1, name: "hoge" }, { id: 1, name: "fuga" }, { id: 2, name: "piyo", age: 123 }]
            const result = pipe(orig, filter(x => x.name.length > 100));
            expect(result.length).toBe(0);
        })
    })

    it("map()", () => {
        const orig = [
            { name: "hoge", phone: { brand: "Apple", storage: 128 } },
            { name: "fuga", phone: { brand: "Apple", storage: 256 } },
        ]
        const result = pipe(orig, map(x => x.phone));
        expect(result).toStrictEqual([{ brand: "Apple", storage: 128 }, { brand: "Apple", storage: 256 }]);
    })

    it("uniq()", () => {
        const orig = [{ id: 1, name: "hoge" }, { id: 1, name: "fuga" }, { id: 2, name: "piyo" }]
        const result = pipe(orig, uniq(x => x.id));
        expect(orig).toStrictEqual([{ id: 1, name: "hoge" }, { id: 1, name: "fuga" }, { id: 2, name: "piyo" }])// orig not changed
        expect(result).toStrictEqual([{ id: 1, name: "hoge" }, { id: 2, name: "piyo" }]);
    })

    describe("find()", () => {
        it("simple array", () => {
            const found = pipe([1, 2, 3, 4, 5], find(x => x > 3))
            expect(found).toBe(4);
        })
        it("objects", () => {
            const people = [
                { name: 'Alice', age: 30 },
                { name: 'Bob', age: 25 },
                { name: 'Charlie', age: 35 }
            ];
            const person = pipe(people, find(x => x.name === 'Bob'))
            expect(person).toStrictEqual({ name: 'Bob', age: 25 })
        })
        it("immutability", () => {
            const people = [
                { name: 'Alice', age: 30 },
                { name: 'Bob', age: 25 },
                { name: 'Charlie', age: 35 }
            ];
            const person = pipe(people, find(x => x.name === 'Bob'))
            expect(person).toStrictEqual({ name: 'Bob', age: 25 })
        })
        it("not found", () => {
            const people = [
                { name: 'Alice', age: 30 },
                { name: 'Bob', age: 25 },
                { name: 'Charlie', age: 35 }
            ];
            const person = pipe(people, find(x => x.name === 'Dave'))
            expect(person).toBeUndefined()
        })
    })
});

