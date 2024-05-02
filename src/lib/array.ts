import { pipe } from "./pipe.js";

export function flatten<T>() {
    return function (nestedArray: T[][]) {
        return nestedArray.flat(2) as T[];
    }
}

export function join<T>(separator?: string | undefined) {
    return function (array: T[]) {
        return array.join(separator)
    }
}

export const sort = <T>(compareFn?: (a: T, b: T) => number) => {
    return function (array: T[]) {
        return [...array]
            .sort(compareFn)
    }
}

export const take = <T>(n: number) => {
    return function (array: T[]) {
        return array
            .slice(0, n)
    }
}

export const compact = <T>(array: Array<T | null>) => {
    return array
        .filter((item): item is T => item !== null)
}

export const filter = <T>(predicate: (value: T, index: number, array: T[]) => unknown) => {
    return function (array: T[]) {
        return array.filter(predicate);
    }
}

export const map = <T, U>(transform: (element: T) => U): ((array: T[]) => U[]) => {
    return function (array: T[]) {
        return array.map(transform);
    }
}

export const forEach = <T>(callback: (element: T, index: number, array: T[]) => void): ((array: T[]) => void) =>
    (array: T[]): void => array.forEach(callback);

export const uniq = <T, K>(keyFn: (item: T) => K) => {
    return function (array: T[]) {
        const uniqueItems = new Map<K, T>();
        for (const item of array) {
            const key = keyFn(item);
            if (!uniqueItems.has(key)) {
                uniqueItems.set(key, item);
            }
        }
        return Array.from(uniqueItems.values());
    }
}

export const find = <T>(predicate: (element: T) => boolean) => (array: T[]) => {
    return pipe(array.find(predicate));
}

export const first = <T>(array: T[]): T | undefined => {
    return array[0];
};
export const last = <T>(array: T[]): T | undefined => {
    return array.length > 0 ? array[array.length - 1] : undefined;
};

export const shuffle = <T>(originalArray: T[]) => {
    const array = [...originalArray];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}