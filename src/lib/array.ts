import { pipe } from "./pipe.js";

export function chunk<T>(size: number) {
    return function (self: T[]) {
        const result: T[][] = [];
        for (let i = 0; i < self.length; i += size) {
            result.push(self.slice(i, i + size));
        }
        return result;
    }
}


export function flatten<T>(nestedArray: T[][]) {
    return nestedArray.flat(2) as T[];
}

export function join<T>(separator?: string | undefined) {
    return function (self: T[]) {
        return self.join(separator)
    }
}

export const sort = <T>(compareFn?: (a: T, b: T) => number) => {
    return function (self: T[]) {
        return [...self]
            .sort(compareFn)
    }
}

export const take = <T>(n: number) => {
    return function (self: T[]) {
        return self.slice(0, n)
    }
}

export const compact = <T>(array: Array<T | null | undefined>) => {
    return array.filter((item): item is T => {
        if (item) {
            return true;
        } else {
            return false;
        }
    })
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