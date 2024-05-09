export function split(separator: string | RegExp) {
    return function (self: string) {
        return self.split(separator)
    }
}