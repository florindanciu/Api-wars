window.onload = function () {

    function getData (url, callback) {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                callback(data)
            })
    }

    function displayData (data) {
        let planets = data.results
        let tBody = document.querySelector('#table > tbody')
        tBody.innerHTML = ''
        planets.forEach((planet) => {
            let tBody = `
                <tr>
                    <td>${planet.name}</td>
                    <td>${planet.diameter / 1000}00 km</td>
                    <td>${planet.climate}</td>
                    <td>${planet.terrain}</td>
                    <td>${planet.surface_water} %</td>
                    <td>${planet.population} people</td>
                    <td><button class="badge badge-secondary" id="tableButtons">${planet.residents.length}</button></td>
                    <td><button class="badge badge-info" id="voteButtons">Vote</button></td>
                </tr>
            `
            document.querySelector('#table > tbody').innerHTML += tBody

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
        })

        document.querySelector('#next').onclick = function () {
            getData(data.next, displayData);
        }
        document.querySelector('#previous').onclick = function () {
            getData(data.previous, displayData);
        }

        // document.querySelectorAll('#tableButtons').onclick = function () {
        //     console.log(getData(data.))
        // }
    }
    getData('http://swapi.dev/api/planets', displayData)
};