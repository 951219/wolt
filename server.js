const fs = require('fs');
const parse = require('csv-parse');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

var locationData = [];
var pickupTimes = [];



(async function () {
    await fs.createReadStream("./locations.csv")
        .pipe(parse())
        .on('data', function (csvrow) {
            var entry = {
                "id": csvrow[0],
                "latitude": csvrow[1],
                "longitude": csvrow[2]
            }
            locationData.push(entry);
        })
        .on('end', function () {
            // removing the first item
            locationData.shift();
            console.log(`Location csv read - success : ${locationData.length}`);
        });


    await fs.createReadStream("./pickup_times.csv")
        .pipe(parse())
        .on('data', function (csvrow) {
            var entry = {
                "id": csvrow[0],
                "date": csvrow[1],
                "time": csvrow[2]
            }
            pickupTimes.push(entry);
        })
        .on('end', function () {
            // removing the first item
            pickupTimes.shift();
            console.log(`Pickup times csv read - success : ${pickupTimes.length}`);
        });

}());
function getDates() {
    var array = pickupTimes.map(x => {
        return new Date(x['date']);
    });

    return array;
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.get('/dates', async (req, res) => {
    var returnArry = getDates();
    console.log("sending Dates");
    res.send(returnArry);
});







//Get all dates without duplicates
    //For Date field

//Get all times (date)
    //For Hours field
