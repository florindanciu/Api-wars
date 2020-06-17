window.onload = function () {

    fetch('https://swapi.dev/api/planets')
        .then((response) => response.json())
        .then((data) => {
            let planets = data.results
            for (let i = 0; i < planets.length; i++) {
                let result = data.results[i]
                document.createElement()
                console.log(result.terrain)
            }

        })


};