export const sort = <T>(compareFn?: (a: T, b: T) => number): (array: T[]) =>
    T[] => (array: T[]) => [...array].sort(compareFn);

export const take = <T>(n: number): (array: T[]) =>
    T[] => (array: T[]): T[] => array.slice(0, n);

export const compact = <T>(array: Array<T | null>): Array<T> =>
    array.filter((item): item is T => item !== null);

export const filter = <T>(predicate: (value: T, index: number, array: T[]) => unknown): ((array: T[]) =>
    T[]) => (array: T[]): T[] => array.filter(predicate);

export const map = <T, U>(transform: (element: T) => U): ((array: T[]) =>
    U[]) => (array: T[]): U[] => array.map(transform);

export const forEach = <T>(callback: (element: T, index: number, array: T[]) => void): ((array: T[]) => void) =>
    (array: T[]): void => array.forEach(callback);

export const uniq = <T, K>(keyFn: (item: T) => K) => (array: T[]): T[] => {
    const uniqueItems = new Map<K, T>();
    for (const item of array) {
        const key = keyFn(item);
        if (!uniqueItems.has(key)) {
            uniqueItems.set(key, item);
        }
    }
    return Array.from(uniqueItems.values());
};

export const find = <T>(predicate: (element: T) => boolean) => (array: T[]) => {
    return array.find(predicate);
}

export const first = <T>(array: T[]): T | undefined => {
    return array[0];
};
export const last = <T>(array: T[]): T | undefined => {
    return array.length > 0 ? array[array.length - 1] : undefined;
};

export const shuffle = <T>(originalArray: T[]): T[] => {
    const array = [...originalArray];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}