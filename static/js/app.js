function getData(url, callback) {
    fetch(url.replace('http:', 'https:'))
        .then((response) => response.json())
        .then((data) => {
            callback(data);
        });
}

function displayData(data) {
    let residents;
    let planets = data.results;
    let tBody = document.querySelector('#table > tbody');
    tBody.innerHTML = '';
    planets.forEach((planet) => {
        if (planet.residents.length > 0) {
            residents = `<button class="btn btn-secondary btn-sm resident-btn" value="${planet.name}">${planet.residents.length} resident(s)</button>`
        } else {
            residents = 'No known residents'
        }
        let cell = `
            <tr>
                <td>${planet.name}</td>
                <td>${planet.diameter / 1000}00 km</td>
                <td>${planet.climate}</td>
                <td>${planet.terrain}</td>
                <td>${planet.surface_water} %</td>
                <td>${planet.population} people</td>
                <td>
                    ${residents}
                    <input type="hidden" value="${planet.residents}">
                </td>
                <td>
                    <button class="btn btn-secondary btn-sm vote-btn" id="vote-button">Vote</button>
                    <input type="hidden" value="${planet.name}">
                </td>
            </tr>
        `;
        tBody.innerHTML += cell


        // Residents modal
        // Open modal
        let modal = document.querySelector('.modal-overlay');
        document.querySelectorAll('.resident-btn').forEach((button) => {
            button.onclick = function (e) {
                let planet_name = e.target.value;
                document.querySelector('.residents-title').innerHTML = `Residents of planet ${planet_name}`;
                let residents = e.target.nextElementSibling.value.split(',')
                let tBodyResidents = document.querySelector('.tableBodyResidents');
                tBodyResidents.innerHTML = '';
                residents.forEach((resident) => {
                    fetch(resident.replace('http:', 'https:'))
                        .then((response) => response.json())
                        .then((data) => {
                            let cell = `
                                <tr>
                                   <td>${data.name}</td>
                                   <td>${data.height}</td>
                                   <td>${data.mass}</td>
                                   <td>${data.hair_color}</td>
                                   <td>${data.skin_color}</td>
                                   <td>${data.eye_color}</td>
                                   <td>${data.birth_year}</td>
                                   <td>${data.gender}</td>
                                </tr>
                            `;
                            tBodyResidents.innerHTML += cell;
                        });
                })
                modal.classList.add('open-modal');
            };
        });

        // Close modal
        document.querySelectorAll('[data-dismiss="modal"]').forEach((button) => {
            button.onclick = function () {
                modal.classList.remove('open-modal');
            };
        });

        // Votes modal
        // Votes (need clarifications of handle errors)
        // Send data to Python
        let votes = document.querySelectorAll('.vote-btn')
        for (let i = 0; i < votes.length; i++) {
            votes[i].onclick = function (e) {
                let planet_name = e.target.nextElementSibling.value;
                postData('/votes', {'planet': planet_name, 'id': i});
                document.getElementById('snackbar').innerHTML = `Voted on planet ${planet_name} successfully.`
                flashMessage();
            }
        }

        // Open modal
        let modalVotes = document.querySelector('.votes');
        document.querySelector('.voting-statistics').onclick = function () {
            modalVotes.classList.add('open-modal');
            // Add data to votes statistics
            // Getting data from flask and send it with innerHtml to have data displayed without refreshing the page
            let tBodyVotes = document.querySelector('.tableBodyVotes')
            fetch('/api/votes_data')
                .then((response) => response.json())
                .then((data) => {
                    tBodyVotes.innerHTML = '';
                    data.forEach((item) => {
                        let cell = `
                            <tr>
                               <td>${item.planet_name}</td>
                               <td>${item.vote_numbers}</td>
                            </tr>
                        `;
                        tBodyVotes.innerHTML += cell;
                    })
                });
        }

        // Close modal
        document.querySelectorAll('[data-dismiss="modal-votes"]').forEach((button) => {
            button.onclick = function () {
                modalVotes.classList.remove('open-modal');
            };
        });

    });

    // Next and Previous page
    let nextButton = document.querySelector('#next');
    let previousButton = document.querySelector('#previous');

    if (data.next === null) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
        nextButton.onclick = function () {
            getData(data.next, displayData);
        };
    }

    if (data.previous === null) {
        previousButton.disabled = true;
    } else {
        previousButton.disabled = false;
        previousButton.onclick = function () {
            getData(data.previous, displayData);
        };
    }
}

// AJAX sending data to python on POST method
async function postData(url = '', data = {}) {
    const response = await fetch(url.replace('http:', 'https:'), {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    return response.json();
}

function flashMessage() {
    // Get the snackbar DIV
    let x = document.getElementById("snackbar");
    // Add the "show" class to DIV
    x.className = "show";
    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}

function flashFlaskTimeout () {
    let message = document.querySelector('.alert');
    if (message) {
        setTimeout(function () {
        message.remove();
        }, 2000)
    }
}

flashFlaskTimeout();
getData('http://swapi.dev/api/planets', displayData);

