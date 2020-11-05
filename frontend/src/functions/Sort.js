const monthNameToNum = {"January": 1,   "February": 2,     "March": 3, 
                        "April"  : 4,   "May"     : 5,     "June" : 6, 
                        "July"   : 7,   "August"  : 8, "September": 9, 
                        "October": 10, "November": 11, "December": 12
                    };

// Sorts cost.
export function sortCost(array, sort) {
    if (sort === "asc") {
        return array.sort((a, b) => (a.cost - b.cost));
    } else {
        return array.sort((a, b) => (b.cost - a.cost));
    }
}

// Sorts months.
export function sortMonth(array, sort) {
    if (sort === "asc") {
        return array.sort((a, b) => (monthNameToNum[a.month] - monthNameToNum[b.month]));
    } else {
        return array.sort((a, b) => (monthNameToNum[b.month] - monthNameToNum[a.month]));
    }
}

// Sorts year.
export function sortYear(array, sort) {
    if (sort === "asc") {
        return array.sort((a, b) => (a.year - b.year));
    } else {
        return array.sort((a, b) => (b.year - a.year));
    }
}

// Sorts stations.
export function sortStations(array, sort) {
    if (sort === "asc") {;
        return array.sort(function(a, b) {
            var nameA = a.stations.toUpperCase();
            var nameB = b.stations.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
    } else {
        return array.sort(function(a, b) {
            var nameA = a.stations.toUpperCase();
            var nameB = b.stations.toUpperCase();
            if (nameA > nameB) {
              return -1;
            }
            if (nameA < nameB) {
              return 1;
            }
            return 0;
          });
    }
}