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
            let finalData = [planet.name, planet.diameter, planet.climate, planet.terrain, `${planet.surface_water}%`, `${planet.population} people`, planet.residents];
            let tr = document.createElement('tr');
            finalData.forEach((cell) => {
                let td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            })
            tBody.appendChild(tr)
        })

        document.querySelector('#next').onclick = function () {
            getData(data.next, displayData);
        }
        document.getElementById('previous').onclick = function () {
            getData(data.previous, displayData);
        }
    }
    getData('http://swapi.dev/api/planets', displayData)
};