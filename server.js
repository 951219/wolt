const express = require('express');
const CSVtoJSON = require("csvtojson");

const app = express();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

var locations = [];
var pickupTimes = [];
var dates = [];

CSVtoJSON().fromFile("./locations.csv").then(source => {
    locations = source;
    console.log(`Locations loaded: ${locations.length}`);
})

CSVtoJSON().fromFile("./pickup_times.csv").then(source => {
    pickupTimes = source;

    dates = pickupTimes.map(x => {
        return x['iso_8601_timestamp'].split("T")[0];
    });

    dates = [...new Set(dates)];

    console.log(`Pickup times loaded: ${pickupTimes.length}`);
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get("/api/locations", (req, res) => {
    res.json(locations)
})

app.get("/api/times", (req, res) => {
    res.json(pickupTimes)
})

app.get("/api/dates", (req, res) => {
    res.json(dates)
})

app.get("/api/:date/:time", (req, res) => {
    var date = req.params.date;
    var time = req.params.time;

    if (dates.includes(date)) {
        res.json(true);
        // can search further
    } else (
        // abort
        res.json(false)
    );
    res.json(dates);

})
