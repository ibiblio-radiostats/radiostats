import { sortCost, sortMonth, sortYear, sortStations } from './Sort';

let costArr = [{"cost": 0.0}, {"cost": 2.5}, {"cost":9.2}, {"cost":1.3}, {"cost": 9.1}];
let monthArr = [{"month": "August"}, {"month": "July"}, {"month": "December"}, {"month": "April"}];
let yearArr = [{"year": 1776}, {"year": 2018}, {"year": 1432}, {"year": 2020}];
let stationsArr = [{"stations": "WCPE"}, {"stations": "LPMQ"}, {"stations": "ABCD"}, {"stations": "DCEA"}];

describe("sorts costs", () => {
    it("sorts ascending", () => {
        costArr = sortCost(costArr, "asc");
        expect(costArr).toStrictEqual([{"cost": 0.0}, {"cost": 1.3}, {"cost":2.5}, {"cost":9.1}, {"cost": 9.2}]);
    })
})

describe("sorts costs", () => {
    it("sorts descending", () => {
        costArr = sortCost(costArr, "desc");
        expect(costArr).toStrictEqual([{"cost": 9.2}, {"cost": 9.1}, {"cost":2.5}, {"cost":1.3}, {"cost":0.0}]);
    })
})

describe("sorts month", () => {
    it("sorts descending", () => {
        monthArr = sortMonth(monthArr, "desc");
        expect(monthArr).toStrictEqual([{"month": "December"}, {"month": "August"}, {"month": "July"}, {"month": "April"}])
    })
})

describe("sorts month", () => {
    it("sorts ascending", () => {
        monthArr = sortMonth(monthArr, "asc");
        expect(monthArr).toStrictEqual([{"month": "April"}, {"month": "July"}, {"month": "August"}, {"month": "December"}])
    })
})

describe("sorts year", () => {
    it("sorts ascending", () => {
        yearArr = sortYear(yearArr, "asc");
        expect(yearArr).toStrictEqual([{"year": 1432}, {"year": 1776}, {"year": 2018}, {"year": 2020}]);
    })
})

describe("sorts year", () => {
    it("sorts descending", () => {
        yearArr = sortYear(yearArr, "desc");
        expect(yearArr).toStrictEqual([{"year": 2020}, {"year": 2018}, {"year": 1776}, {"year": 1432}]);
    })
})

describe("sorts station", () => {
    it("sorts ascending", () => {
        stationsArr = sortStations(stationsArr, "asc");
        expect(stationsArr).toStrictEqual([{"stations": "ABCD"}, {"stations": "DCEA"}, {"stations": "LPMQ"}, {"stations": "WCPE"}]);
    })
})

describe("sorts station", () => {
    it("sorts descending", () => {
        stationsArr = sortStations(stationsArr, "desc");
        expect(stationsArr).toStrictEqual([{"stations": "WCPE"}, {"stations": "LPMQ"}, {"stations": "DCEA"}, {"stations": "ABCD"}]);
    })
})