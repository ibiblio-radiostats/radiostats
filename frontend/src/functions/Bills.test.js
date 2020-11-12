import { addKeys } from './Bills.js';

describe("adds three keys", () => {
    it("adds month, year, cost to an object", () => {
        const testObj = 
        [
            {
                bill_start: "2020-10-01T00:00:00Z",
                bill_transit: 1,
                cost_mult: 2,
            },
            {
                bill_start: "2020-10-31T23:59:59Z",
                bill_transit: 3,
                cost_mult: 4,
            },
            {
                bill_start: "12-4-2003",
                bill_transit: 5,
                cost_mult: 6,
            },
        ]
        const result = addKeys(testObj);

        // Expecting months.
        expect(result[0].month).toBe("October");
        expect(result[1].month).toBe("October");
        expect(result[2].month).toBe("December");

        // Expecting years.
        expect(result[0].year).toBe(2020);
        expect(result[1].year).toBe(2020);
        expect(result[2].year).toBe(2003);

        // Expecting cost.
        expect(result[0].cost).toBe("2.00");
        expect(result[1].cost).toBe("12.00");
        expect(result[2].cost).toBe("30.00");
    })
})

