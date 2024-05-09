
import { clone, defrost, update, type DeepReadonly } from '$lib/object.js';
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
        const updated = pipe(orig, defrost, update(x => {
            x.phone.storage = 1024;
            return x;
        }))
        expect(orig.phone.storage).toBe(512);
        expect(updated.phone.storage).toBe(1024);
    })
})
