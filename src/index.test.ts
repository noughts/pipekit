import { compact, filter, find, map, shuffle, sort, take, uniq } from '$lib/array.js';
import { toDate, toUnixTime } from '$lib/date.js';
import { clone, update, type DeepReadonly } from '$lib/object.js';
import { pipe } from '$lib/pipe.js';
import { describe, expect, it } from 'vitest';

type User = {
    id: number;
    name: string;
    phone: {
        brand: string;
        storage: number;
    }
}
type ReadonlyUser = DeepReadonly<User>

const readonlyUser: ReadonlyUser = {
    id: 1,
    name: "aa",
    phone: {
        brand: "apple",
        storage: 123,
    }
}

describe("TypeScript Basics", () => {
    it("readonly", () => {
        const user: User = {
            id: 1,
            name: "hoge",
            phone: {
                brand: "apple",
                storage: 128
            }
        }
        const userAsConst: User = {
            id: 1,
            name: "hoge",
            phone: {
                brand: "apple",
                storage: 128
            }
        } as const
        const objAsConst = {
            id: 1,
            name: "hoge",
            phone: {
                brand: "apple",
                storage: 128
            }
        } as const
        userAsConst.name = "fuga";// User type のオブジェクトを as const で定義しても変更できてしまうので意味ない
        // objAsConst.name = "aaa"// as const で　type を指定しなければ変更できない
        // objAsConst.phone.brand = "sum"// as const で　type を指定なしだとネストオブジェクトも変更できない

        const shallowReadonlyUser: Readonly<User> = {
            id: 1,
            name: "hoge",
            phone: {
                brand: "apple",
                storage: 128
            }
        }
        // readonlyUser.name = "aaa"// Readonly にすれば変更できない
        shallowReadonlyUser.phone.brand = "aaa"// Readonly でもネストされたオブジェクトは変更できる
    })

    it("Full Readonly", () => {
        type FullReadonlyUser = {
            readonly id: number;
            readonly name: string;
            readonly phone: {
                readonly brand: string;
                readonly storage: number;
            }
        }
        const user: FullReadonlyUser = {
            id: 1,
            name: "hoge",
            phone: {
                brand: "apple",
                storage: 128
            }
        }
        // user.phone.brand = "aaa";// 全てのキーに明示的に readonly をつければ変更不可

        type FullReadonlyUser2 = Readonly<{
            id: number;
            name: string;
            phone: Readonly<{
                brand: string;
                storage: number;
            }>
        }>
        const user2: FullReadonlyUser2 = {
            id: 1,
            name: "hoge",
            phone: {
                brand: "apple",
                storage: 128
            }
        }
        // user2.phone.brand = "aaa";// FullReadonlyUser2 のように定義してもよい。        
    })
})



describe("pipe()", () => {
    it("anonymous functions", () => {
        const res = pipe(" Hoge ",
            x => x.trim(),
            x => x.length
        )
        expect(res).toBe(4);
    })
})

describe("object", () => {
    it("DeepReadonly", () => {
        // readonlyUser.phone.brand = "aa";// コンパイルエラー出ます
    })
    it("ref: shallow copy", () => {
        const orig = {
            name: "John",
            phone: {
                brand: "Apple",
                storage: 512,
            }
        }
        const shallowCopy = { ...orig };
        shallowCopy.phone.storage = 1024;
        expect(orig.phone.storage).toBe(1024);
    })
    it("clone()", () => {
        const orig: User = {
            id: 123,
            name: "John",
            phone: {
                brand: "Apple",
                storage: 512,
            }
        }
        const cloned = clone(orig);
        expect(cloned.phone.storage).toBe(512);
        const modifiedCloned = pipe(cloned, update(x => {
            x.phone.storage = 1024
            return x;
        }))
        expect(orig.phone.storage).toBe(512);
        expect(cloned.phone.storage).toBe(512);
        expect(modifiedCloned.phone.storage).toBe(1024);
    })
    it("update()", () => {
        const orig: ReadonlyUser = {
            id: 123,
            name: "John",
            phone: {
                brand: "Apple",
                storage: 512,
            }
        }
        const updated = pipe(orig, update(x => {
            x.phone.storage = 1024;
            return x;
        }))
        expect(orig.phone.storage).toBe(512);
        expect(updated.phone.storage).toBe(1024);
    })
})

describe('Array Module', () => {
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

    describe("filter()", () => {
        it("normal", () => {
            const orig = [{ id: 1, name: "hoge" }, { id: 1, name: "fuga" }, { id: 2, name: "piyo", age: 123 }]
            const result = pipe(orig, filter(x => x.age));
            expect(result).toStrictEqual([{ id: 2, name: "piyo", age: 123 }]);
        })
        it("immutability", () => {
            const orig = [{ id: 1, name: "hoge" }, { id: 1, name: "fuga" }, { id: 2, name: "piyo", age: 123 }]
            const result = pipe(orig, filter(x => x.age));
            orig[2].age = 100;
            expect(result).toStrictEqual([{ id: 2, name: "piyo", age: 123 }]);// not changed
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
        orig[0].phone.storage = 1024;
        expect(result).toStrictEqual([{ brand: "Apple", storage: 128 }, { brand: "Apple", storage: 256 }]);// immutable!
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
            people[1].age = 100;
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

describe("date", () => {
    it('toDate()', () => {
        const result = pipe(1711688078 * 1000, toDate)
        expect(result).toStrictEqual(new Date(1711688078 * 1000))
        expect(pipe(result, toUnixTime)).toBe(1711688078 * 1000);
    });
}) 