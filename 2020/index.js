

fetch("./data/restaurants.json")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        var restolist = data.restaurants;
        console.log(restolist);
        restolist.forEach((element) => {
            var item = (document.createElement("div").innerHTML = `
            <div class="container">
              <img src="${element.image}" alt="Image" style="width:100%;">
              <div class="text">
                <h4 class="top-left-text">${element.name}</h4>
                <h6 class="top-left-text2">${element.description}</h6>
              </div>
            </div>`);

            document.getElementById("list").innerHTML += item;
        });
    })
    .catch((err) => {
        console.log(err);
    });



// // document.getElementById('sort').onClick = function () { alert('1'); };

// document.getElementById('sort').onclick = function changeContent() {

//     document.getElementById('sort').textContent = "Help me";
//     document.getElementById('sort').style = "Color: red";

// }