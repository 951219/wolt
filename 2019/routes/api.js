const express = require('express');
const router = express.Router();
const CSVtoJSON = require("csvtojson");

let locations = [];
let pickupTimes = [];
let dates = [];

CSVtoJSON().fromFile("./data/locations.csv").then(source => {
    locations = source;
    console.log(`Locations loaded: ${locations.length}`);
})

CSVtoJSON().fromFile("./data/pickup_times.csv").then(source => {
    pickupTimes = source;

    dates = pickupTimes.map(x => {
        return x['iso_8601_timestamp'].split("T")[0];
    });

    dates = [...new Set(dates)];
    console.log(`Pickup times loaded: ${pickupTimes.length}`);
})

router.get("/locations", (req, res) => {
    res.status(200).json(locations)
})

router.get("/dates", (req, res) => {
    res.status(200).json(dates)
})

//getting the hours for that particular day
router.get("/getdatehours/:date/", (req, res) => {
    var date = req.params.date;
    var dateTimes = [];
    if (dates.includes(date)) {
        dateTimes = getHoursOnThatDayForFrontend(date);
        res.json(dateTimes)
    } else {
        res.json({ message: `No times for found for ${date}` })
    }
});

//getting the locationdata according the the query
router.get("/getobjects/:date/:hour/:minute", async (req, res) => {
    var date = req.params.date;
    var hour = req.params.hour;
    var minute = req.params.minute;

    if (minute.length == 1) {
        minute = "0" + minute;
    }
    var list = await getObjectsByDateTime(date, hour, minute);

    if (list) {
        res.status(200).json(list);

    } else {
        res.json({ message: "List is empty" })
    }

})

// returns hours for fronend dropdown based on the date
function getHoursOnThatDayForFrontend(date) {
    var timesOnThatDay = pickupTimes.filter(item => {
        if (item['iso_8601_timestamp'].split("T")[0] == date) {
            return item;
        }
    });

    timesOnThatDay = timesOnThatDay.map(item => {
        return item['iso_8601_timestamp'].split("T")[1].slice(0, -7);
    })

    timesOnThatDay = [...new Set(timesOnThatDay)];
    return timesOnThatDay;
}

// returns objects based on the day and the hour and minute given.
function getObjectsByDateTime(date, hour, minute) {
    var listofid = [];
    var pickupTimesResponse = pickupTimes.filter(item => {
        if (item['iso_8601_timestamp'].split("T")[0] == date &&
            item['iso_8601_timestamp'].split("T")[1].slice(0, -7) == hour &&
            item['iso_8601_timestamp'].split("T")[1].slice(3, -4) == minute &&
            !listofid.includes(item['location_id'])) {
            return item;
        }
    });

    return pickupTimesResponse;
}

module.exports = router;