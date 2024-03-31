import { pipe } from "./pipe.js";

export const freeze = <T>(obj: T): Readonly<T> => Object.freeze(obj);

export const clone = <T>(obj: T): Readonly<T> => pipe(obj, structuredClone, freeze)

export const update = <T>(updater: (input: T) => T) => {
    return function (original: T) {
        return pipe(original, structuredClone, updater, freeze)
    }
}
