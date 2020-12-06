const express = require('express');
const router = express.Router();
const CSVtoJSON = require("csvtojson");

var locations = [];
var pickupTimes = [];
var dates = [];

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

router.get("/getdatetimes/:date/", (req, res) => {
    var date = req.params.date;
    var dateTimes = [];
    if (dates.includes(date)) {
        dateTimes = getTimesOnThatDayForFrontend(date);
        res.json(dateTimes)
    } else {
        res.json({ message: `No times for found for ${date}` })
    }
});

//getting the locationdata according the the query
//time sent to the endpoint should only have hour data. 11(correct), 11.10(incorrect)
router.get("/getobjects/", async (req, res) => {
    var date = req.query.date;
    var time = req.query.time;
    console.log(req.url);
    var list = await getObjectsByDateTime(date, time);

    if (list) {
        res.status(200).json(list);

    } else {
        res.json({ message: "List is empty" })
    }

})

// returns hours for fronend dropdown
function getTimesOnThatDayForFrontend(date) {
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

// returns objects based on the day and the hour given.
function getObjectsByDateTime(date, time) {
    var timesOnThatDay = pickupTimes.filter(item => {
        if (item['iso_8601_timestamp'].split("T")[0] == date &&
            item['iso_8601_timestamp'].split("T")[1].slice(0, -7) == time) {
            return item;
        }
    });
    return timesOnThatDay;
}

module.exports = router;