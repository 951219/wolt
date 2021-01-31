const express = require('express');
const fs = require('fs');
const geolib = require('geolib');


const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

const restaurants = JSON.parse(fs.readFileSync('./data/restaurants.json')).restaurants;


///discovery?lat=60.1709&lon=24.941
app.get("/discovery", async (req, res) => {

    const latitude = parseFloat(req.query.lat);
    const longitude = parseFloat(req.query.lon);
    const userLocation = { latitude, longitude };

    let restaurantsCloseToMeList = await getRestosCloseToMe(userLocation);

    let openRestos = restaurantsCloseToMeList.filter(element => element.online === true);
    let closedRestos = restaurantsCloseToMeList.filter(element => element.online === false);

    let sections = [];

    let popular = await getPopularRestaurants(openRestos, closedRestos);
    if (popular.length > 0) {
        if (popular.length > 10) {
            popular = popular.slice(0, 10);
        };
        sections.push({
            "title": "Popular Restaurants",
            "restaurants": popular
        });
    }

    let newest = await getNewestRestaurants(openRestos, closedRestos);
    if (newest.length > 0) {
        if (newest.length > 10) {
            newest = newest.slice(0, 10);
        };
        sections.push({
            "title": "New Restaurants",
            "restaurants": newest
        });
    }

    let nearby = await getNearbyRestaurants(userLocation, openRestos, closedRestos);
    if (nearby.length > 0) {
        if (nearby.length > 10) {
            nearby = nearby.slice(0, 10);
        };

        sections.push({
            "title": "Nearby Restaurants",
            "restaurants": nearby
        });
    };

    res.status(200).json({ sections });
});


async function getPopularRestaurants(openRestos, closedRestos) {
    let popularList = await openRestos.sort((a, b) => {
        if (a.popularity > b.popularity) { return -1 } else { return 1 };
    });


    if (popularList.length < 10) {
        console.log('in if');
        let closedPopularList = await closedRestos.sort((a, b) => {
            if (a.popularity > b.popularity) { return -1 } else { return 1 };
        });

        popularList.concat(closedPopularList);
    }


    console.log(popularList.length);
    return popularList;
};

// newest
async function getNewestRestaurants(openRestos, closedRestos) {

    var date = new Date();
    date.setMonth(date.getMonth() - 4);
    var year = date.getFullYear();
    var month = date.getMonth();
    if (month.length = 1) month = `0${month}`;
    var day = date.getDate();
    if (day.length = 1) day = `0${day}`;
    date = `${year}-${month}-${day}`;

    let newestList = await openRestos.filter(element => element.launch_date > date);

    newestList = await newestList.sort((a, b) => {
        if (a.launch_date > b.launch_date) { return -1 } else { return 1 };
    });

    if (newestList.length < 10) {
        let closedList = await closedRestos.filter(element => element.launch_date > date);

        closedList = await closedRestos.sort((a, b) => {
            if (a.launch_date > b.launch_date) { return -1 } else { return 1 };
        });

        newestList.concat(closedList);
    }

    return newestList;
};

// nearby
async function getNearbyRestaurants(userLocation, openRestos, closedRestos) {

    let nearbyList = await openRestos.sort((a, b) => {
        const firstRestoLocation = { latitude: a.location[1], longitude: a.location[0] };
        const secondRestoLocation = { latitude: b.location[1], longitude: b.location[0] };

        const userToFirstResto = geolib.getPreciseDistance(userLocation, firstRestoLocation);

        const userToSecondResto = geolib.getPreciseDistance(userLocation, secondRestoLocation);


        if (userToFirstResto > userToSecondResto) { return 1 } else { return -1 };
    });

    if (nearbyList.length < 10) {
        let closedNearbyList = await closedRestos.sort((a, b) => {
            const firstRestoLocation = { latitude: a.location[1], longitude: a.location[0] };
            const secondRestoLocation = { latitude: b.location[1], longitude: b.location[0] };

            const userToFirstResto = geolib.getPreciseDistance(userLocation, firstRestoLocation);

            const userToSecondResto = geolib.getPreciseDistance(userLocation, secondRestoLocation);


            if (userToFirstResto > userToSecondResto) { return 1 } else { return -1 };
        });

        nearbyList.concat(closedNearbyList);

    }

    return nearbyList;
};


// 1.5 kilometers check
async function getRestosCloseToMe(userLocation) {
    let restaurantsCloseToMeList = [];
    restaurants.forEach(element => {
        const distance = geolib.getPreciseDistance(userLocation, { latitude: element.location[1], longitude: element.location[0] });
        if (distance < 1500) {
            restaurantsCloseToMeList.push(element);
        }
    });

    return restaurantsCloseToMeList;
}

