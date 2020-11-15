import { addKeys } from './Bills.js';

describe("adds three keys", () => {
    it("adds month, year, cost to an object", () => {
        const testObj = 
        [
            {
                bill_start: "01-13-1999",
                bill_transit: 1,
                cost_mult: 2,
            },
            {
                bill_start: "09-27-2001",
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
        expect(result[0].month).toBe("January");
        expect(result[1].month).toBe("September");
        expect(result[2].month).toBe("December");

        // Expecting years.
        expect(result[0].year).toBe(1999);
        expect(result[1].year).toBe(2001);
        expect(result[2].year).toBe(2003);

        // Expecting cost.
        expect(result[0].cost).toBe("2.00");
        expect(result[1].cost).toBe("12.00");
        expect(result[2].cost).toBe("30.00");
    })
})

