import { pipe } from "./pipe.js";

export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends Function ? T[P] : T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

const defrost = <T>(obj: DeepReadonly<T>): T => obj as T;

export const freeze = <T>(obj: T): DeepReadonly<T> => obj as DeepReadonly<T>;

export const clone = <T>(obj: T): DeepReadonly<T> => {
    return pipe(obj, structuredClone, freeze) as  DeepReadonly<T>
}

export const update = <T>(updater: (input: T) => T) => {
    return function (original: DeepReadonly<T>) {
        return pipe(original, defrost, structuredClone, updater, freeze)
    }
}

