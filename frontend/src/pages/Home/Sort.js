const monthNameToNum = {"January": 1,   "February": 2,     "March": 3, 
                        "April"  : 4,   "May"     : 5,     "June" : 6, 
                        "July"   : 7,   "August"  : 8, "September": 9, 
                        "October": 10, "November": 11, "December": 12
                    };

// Sorts cost.
export function sortCost(array, sort) {
    var sortedArr = [];
    if (sort === "asc") {
        sortedArr = array.sort((a, b) => (a.cost - b.cost));
    } else {
        sortedArr = array.sort((a, b) => (b.cost - a.cost));
    }
    return convertArrayToObject(sortedArr);
}

// Sorts months.
export function sortMonth(array, sort) {
    var sortedArr = [];
    if (sort === "asc") {
        sortedArr = array.sort((a, b) => (monthNameToNum[a.month] - monthNameToNum[b.month]));
    } else {
        sortedArr = array.sort((a, b) => (monthNameToNum[b.month] - monthNameToNum[a.month]));
    }
    return convertArrayToObject(sortedArr);
}

// Sorts year.
export function sortYear(array, sort) {
    var sortedArr = [];
    if (sort === "asc") {
        sortedArr = array.sort((a, b) => (a.year - b.year));
    } else {
        sortedArr = array.sort((a, b) => (b.year - a.year));
    }
    return convertArrayToObject(sortedArr);
}

// Converts an array into an object.
const convertArrayToObject = (arr) => {
    var newObj = new Map();
    for (var i = 0; i < arr.length; i++) {
        newObj.set([arr[i].id], arr[i]);
    }
    return newObj.values();
};