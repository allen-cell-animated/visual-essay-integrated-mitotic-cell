import { forOwn, isFunction } from "lodash";

type AnyFunction = () => any;

export function bindAll<T>(obj: T, methods: AnyFunction[]) {
    const setOfMethods = new Set(methods);
    forOwn(obj.constructor.prototype, (value, key) => {
        if (setOfMethods.has(value) && isFunction(value)) {
            Object.assign(obj, { [key]: value.bind(obj) });
        }
    });
}

export const hexToRgb = (hex: string): number[] => {
    if (!hex) {
        return [0, 0, 0];
    }
    // this was a one line chained function, but needed these checks to avoid the 'object is possibly null errors'
    const removedHex = hex
        .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => "#" + r + r + g + g + b + b)
        .substring(1);
    if (removedHex) {
        const seperated = removedHex.match(/.{2}/g);
        if (seperated) {
            return seperated.map((x: string) => parseInt(x, 16));
        }
    }
    return [0, 0, 0];
};
