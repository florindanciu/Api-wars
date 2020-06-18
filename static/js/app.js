window.onload = function () {

    function getData(url, callback) {
        fetch(url)
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
                residents = `<button class="btn btn-secondary btn-sm resident-btn">${planet.residents.length}</button>`
            } else {
                residents = 'No residents'
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
                        <input type="hidden" value="${planet.residents}"
                    </td>
                    <td><button class="badge badge-info" id="vote-btn">Vote</button></td>
                </tr>
            `;
            tBody.innerHTML += cell

            // Modal
            let modal = document.querySelector('.modal-overlay');
            document.querySelectorAll('.resident-btn').forEach((button) => {
                button.onclick = function (e) {
                    let residents = e.target.nextElementSibling.value.split(',')
                    let tBodyResidents = document.querySelector('.tableBodyResidents');
                    tBodyResidents.innerHTML = '';
                    residents.forEach((resident) => {
                        fetch(resident)
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

            document.querySelectorAll('[data-dismiss="modal"]').forEach((button) => {
                button.onclick = function () {
                    console.log('close');
                    modal.classList.remove('open-modal');
                };
            });

            /*
            let finalData = [planet.name, planet.diameter, planet.climate, planet.terrain, `${planet.surface_water}%`, `${planet.population} people`, `<button class="btn btn-secondary btn-sm" id="tableButtons">${planet.residents.length}</button>`];
            let tr = document.createElement('tr');
            let button = document.createElement('button')
            finalData.forEach((cell) => {
                let td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            })
            tBody.appendChild(tr)
            */
        });

        // Next and Previous page
        document.querySelector('#next').onclick = function () {
            getData(data.next, displayData);
        };
        document.querySelector('#previous').onclick = function () {
            getData(data.previous, displayData);
        };
    }

    getData('http://swapi.dev/api/planets', displayData);
}