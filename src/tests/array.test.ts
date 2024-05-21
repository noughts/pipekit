import { chunk, compact, filter, find, flatten, groupBy, join, map, shuffle, skip, sort, take, uniq } from '$lib/array.js';
import { pipe } from '$lib/pipe.js';
import { describe, expect, it } from 'vitest';


describe('Array Module', () => {
    it("groupBy", () => {
        const orig = [
            { id: 1, name: "hoge" },
            { id: 1, name: "fuga" },
            { id: 2, name: "piyo" }
        ]
        const res = pipe(orig, groupBy(x => x.id));
        expect(res).toStrictEqual(new Map([
            [1, [{ id: 1, name: "hoge" }, { id: 1, name: "fuga" }]],
            [2, [{ id: 2, name: "piyo" }]]
        ]));
        expect(orig).toStrictEqual([
            { id: 1, name: "hoge" },
            { id: 1, name: "fuga" },
            { id: 2, name: "piyo" }
        ]);// orig not changed
    });

    it("groupByDate", () => {
        const orig = [
            { name: "hoge", date: new Date("2021-01-01T00:00:00Z") },
            { name: "fuga", date: new Date("2021-01-01T12:30:00Z") },
            { name: "piyo", date: new Date("2021-01-02T05:00:00Z") },
            { name: "puyo", date: new Date("2021-01-02T19:00:00Z") },
        ]
        const res = pipe(orig, groupBy(x => {
            return x.date.toISOString().substring(0, 10);
        }))
        expect(res).toStrictEqual(new Map([
            ["2021-01-01", [
                { name: "hoge", date: new Date("2021-01-01T00:00:00Z") },
                { name: "fuga", date: new Date("2021-01-01T12:30:00Z") },
            ]],
            ["2021-01-02", [
                { name: "piyo", date: new Date("2021-01-02T05:00:00Z") },
                { name: "puyo", date: new Date("2021-01-02T19:00:00Z") },
            ]]
        ]));
    });

    it("skip", () => {
        const orig = [1, 2, 3, 4, 5];
        const res = pipe(orig, skip(2));
        expect(res).toStrictEqual([3, 4, 5]);
        expect(orig).toStrictEqual([1, 2, 3, 4, 5]);// orig not changed
    });

    it("chunk", () => {
        const orig = [1, 2, 3, 4, 5];
        const res = pipe(orig, chunk(2));
        expect(res).toStrictEqual([[1, 2], [3, 4], [5]]);
        expect(orig).toStrictEqual([1, 2, 3, 4, 5]);// orig not changed
    });


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

    it("compact() null", () => {
        const orig = ["hoge", null, "fuga"];
        const result = pipe(orig, compact);
        expect(result.length).toBe(2);
    })

    it("compact() undefined", () => {
        const orig = ["hoge", undefined, "fuga"];
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

    it("map with index", () => {
        type Phone = {
            brand: string;
            storage: number;
        }
        const orig: Phone[] = [
            { brand: "Apple", storage: 128 },
            { brand: "Samsung", storage: 256 },
        ];
        const result = pipe(orig,
            map<Phone, Phone>((x, i) => {
                if (i == 0) {
                    return {
                        ...x,
                        storage: 1024,
                    }
                } else {
                    return x;
                }
            })
        );
        expect(result).toStrictEqual([
            { brand: "Apple", storage: 1024 },
            { brand: "Samsung", storage: 256 },
        ]);
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

