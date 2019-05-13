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

export class Coordinate {
    public static subtract(minuend: Coordinate, subtrahend: Coordinate): Coordinate {
        return new Coordinate(minuend.x - subtrahend.x, minuend.y - subtrahend.y);
    }

    private readonly _x: number;
    private readonly _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public toString(): string {
        return `<Coordinate(x=${this.x}, y=${this.y})>`;
    }
}

export class Vector {
    private readonly _direction: number; // in degrees
    private readonly _magnitude: number; // in pixel space

    constructor(start: Coordinate, end: Coordinate) {
        const vector = Coordinate.subtract(end, start);

        this._direction = Math.atan2(vector.y, vector.x) * (180 / Math.PI);
        this._magnitude = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
    }

    /**
     * Direction of the vector; inverse tangent of (y2 - y1) / (x2 - x1), converted to degree.
     */
    public get direction(): number {
        return this._direction;
    }

    /**
     * Length of the vector in pixel space; euclidean distance.
     */
    public get magnitude(): number {
        return this._magnitude;
    }
}
