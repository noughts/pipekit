import { toDate, toUnixTime } from '$lib/date.js';
import { update } from '$lib/object.js';
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


describe("TypeScript Basics", () => {
    it("Composite Type", () => {
        type CouponBase = {
            name: string;
            brand: string;
        }
        type CodeCoupon = {
            conversionType: "コード"
            code: string;
        }
        type WebsiteCoupon = {
            conversionType: "Webサイトを開く"
            url: string;
        }
        type PriceChangeCoupon = {
            displayStyle: "価格変更"
            originalPrice: number;
            discountedPrice: number;
        }
        type DiscountCoupon = {
            displayStyle: "割引";
            discountedPrice: number;
        }
        type Coupon = CouponBase & (CodeCoupon | WebsiteCoupon) & (PriceChangeCoupon | DiscountCoupon);

        function changeBrand(c: Coupon) {
            return pipe(c, update(x => {
                x.brand = "coca cola"
                return x;
            }))
        }
    })

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


describe("date", () => {
    it('toDate()', () => {
        const result = pipe(1711688078 * 1000, toDate)
        expect(result).toStrictEqual(new Date(1711688078 * 1000))
        expect(pipe(result, toUnixTime)).toBe(1711688078 * 1000);
    });
}) 