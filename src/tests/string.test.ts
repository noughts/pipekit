import { pipe } from "$lib/pipe.js";
import { split } from "$lib/string.js";
import { describe, expect, it } from "vitest";

describe("string", () => {
    it("split", () => {
        const orig = "a,b,c";
        const result = pipe(orig, split(","));
        expect(result).toStrictEqual(["a", "b", "c"]);
    })
});