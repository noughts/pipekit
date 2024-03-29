export const toDate = (val: any) => {
    return new Date(val);
}
export const toUnixTime = (val: Date) => {
    return val.getTime();
}