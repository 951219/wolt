let restolist;
var list;
var isAscending = true;


fetch("./data/restaurants.json")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        restolist = data.restaurants;
        list = document.getElementById('list');
        ascending();
    })
    .catch((err) => {
        console.log(err);
    });


function createRestoList() {
    restolist.forEach((element) => {
        var item = (document.createElement("div").innerHTML =
            `<div class="container">
              <img src="${element.image}" alt="Image">
              <div class="text">
                <h4 class="top-left-text">${element.name}</h4>
                <h6 class="top-left-text2">${element.description}</h6>
              </div>
        </div>`);

        list.innerHTML += item;
    });

}

function ascending() {
    list.innerHTML = '';
    restolist.sort((a, b) => (a.name > b.name) ? 1 : -1);
    createRestoList()
    document.getElementById('sort').innerText = ('Alphabetically ascending');
}

function descending() {
    list.innerHTML = '';
    restolist.sort((a, b) => (a.name < b.name) ? 1 : -1);
    createRestoList();
    document.getElementById('sort').innerText = ('Alphabetically descending');
}


function changeState() {
    if (isAscending) {
        descending();
        isAscending = false;

    } else {
        ascending();
        isAscending = true;
    }
}