// Month-year conversion.
const monthNumToName = ["January", "February", "March",
                        "April"  , "May"     , "June",
                        "July"   , "August"  , "September",
                        "October", "November", "December"]

/**
 * Adds the following keys to a bill:
 * - Month
 * - Year
 * - Cost
 */ 
export function addKeys(data) {
    // Adding new keys [month], [year], and [cost] to the data.
    for (var i = 0; i < data.length; i++) {
        var date = new Date(data[i].bill_start);
        data[i].month = monthNumToName[date.getMonth()];
        data[i].year = date.getFullYear();
        data[i].cost = (data[i].bill_transit * data[i].cost_mult).toFixed(2)
    }
    return data;
}