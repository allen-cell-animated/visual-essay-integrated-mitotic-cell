import { expect } from "chai";

import { bindAll, Coordinate, Vector } from "../";

describe("General utilities", () => {
    describe("bindAll", () => {
        it("binds class methods to a class", () => {
            class Foo {
                private message = "Hello from Foo";

                constructor() {
                    bindAll(this, [this.bar]);
                }

                public bar() {
                    return this.message;
                }
            }

            const foo = new Foo();
            const bar = foo.bar;
            expect(foo.bar()).to.equal(bar());
        });

        it("does not bind a method that it was not asked to bind", () => {
            class Foo {
                private message = "Hello from Foo";

                constructor() {
                    bindAll(this, [this.bar]);
                }

                public bar() {
                    return this.message;
                }

                public baz() {
                    return this.message;
                }
            }

            const foo = new Foo();
            const baz = foo.baz;

            expect(foo.baz()).to.equal("Hello from Foo");
            expect(baz).to.throw(TypeError);
        });
    });

    describe("Vector", () => {
        describe("direction", () => {
            const testCases = [
                {
                    start: new Coordinate(0, 0),
                    end: new Coordinate(50, 0),
                    expectedDirection: 0,
                },
                {
                    start: new Coordinate(0, 0),
                    end: new Coordinate(45, 45),
                    expectedDirection: 45,
                },
                {
                    start: new Coordinate(0, 0),
                    end: new Coordinate(0, 90),
                    expectedDirection: 90,
                },
                {
                    start: new Coordinate(0, 0),
                    end: new Coordinate(-45, 45),
                    expectedDirection: 135,
                },
                {
                    start: new Coordinate(0, 0),
                    end: new Coordinate(-50, 0),
                    expectedDirection: 180,
                },
                {
                    start: new Coordinate(0, 0),
                    end: new Coordinate(45, -45),
                    expectedDirection: -45,
                },
                {
                    start: new Coordinate(0, 0),
                    end: new Coordinate(0, -90),
                    expectedDirection: -90,
                },
                {
                    start: new Coordinate(0, 0),
                    end: new Coordinate(-45, -45),
                    expectedDirection: -135,
                },
            ];

            testCases.forEach((test) => {
                it(`calculates accurate direction from ${test.start.toString()} to ${test.end.toString()}`, () => {
                    expect(new Vector(test.start, test.end).direction).to.equal(
                        test.expectedDirection
                    );
                });
            });
        });

        describe("magnitude", () => {
            const testCases = [
                {
                    start: new Coordinate(0, 0),
                    end: new Coordinate(45, 45),
                    expectedMagnitude: Math.sqrt(2 * Math.pow(45, 2)),
                },
                {
                    start: new Coordinate(45, 45),
                    end: new Coordinate(90, 90),
                    expectedMagnitude: Math.sqrt(2 * Math.pow(45, 2)),
                },
                {
                    start: new Coordinate(0, 0),
                    end: new Coordinate(45, 0),
                    expectedMagnitude: 45,
                },
                {
                    start: new Coordinate(0, 0),
                    end: new Coordinate(0, 45),
                    expectedMagnitude: 45,
                },
                {
                    start: new Coordinate(0, 0),
                    end: new Coordinate(0, -45),
                    expectedMagnitude: 45,
                },
                {
                    start: new Coordinate(0, 0),
                    end: new Coordinate(0, 0),
                    expectedMagnitude: 0,
                },
            ];

            testCases.forEach((test) => {
                it(`calculates accurate magnitude from ${test.start.toString()} to ${test.end.toString()}`, () => {
                    expect(new Vector(test.start, test.end).magnitude).to.equal(
                        test.expectedMagnitude
                    );
                });
            });
        });
    });
});
