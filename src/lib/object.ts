import { pipe } from "./pipe.js";

export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends Function ? T[P] : T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export const defrost = <T>(obj: DeepReadonly<T>): T => obj as T;

export const freeze = <T>(obj: T): DeepReadonly<T> => obj as DeepReadonly<T>;

export const clone = <T>(obj: T) => {
    return pipe(obj, structuredClone)
}

export const update = <T>(updater: (input: T) => T) => {
    return function (original: T) {
        return pipe(original, structuredClone, updater)
    }
}

