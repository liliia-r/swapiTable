export async function getPlanets(page) {
    let resultArr = [];

    const planets = await fetch(`https://swapi.dev/api/planets/?page=${page}`)
        .then((response) => response.json())
        .then((result) => result.results)
        .catch((error) => console.error(`Planets failed to load ${error}`));

    await Promise.all(
        planets.map(async (planet) => {
            try {
                const residents = planet.residents.map((residentUrl) =>
                    fetch(residentUrl)
                );
                const mappedResidents = await Promise.all(residents);
                planet.residents = await getResidents(mappedResidents);
            } catch (error) {
                console.error("Resident failed to load", error);
            }

            planet.residents.forEach((resident) => {
                resident.species.forEach((specie) => {
                    resultArr.push({
                        planet: planet.name,
                        residentName: resident.name,
                        specie,
                    });
                });
            });
        })
    );
    return resultArr;
}

async function getResidents(mappedResidents) {
    try {
        const residentsData = await Promise.all(
            mappedResidents.map(async (mappedResident) => {
                const residentsList = await mappedResident.json();
                const species = await getSpecies(residentsList);
                return { name: residentsList.name, species };
            })
        );
        return residentsData;
    } catch (error) {
        console.error("Resident failed to load", error);
    }
}

async function getSpecies(residentsList) {
    if (!residentsList.species.length) {
        return ["Human"];
    }
    try {
        const residentsSpecies = residentsList.species.map((url) => fetch(url));
        const dataSpecies = await Promise.all(residentsSpecies);
        const parsedDataSpecies = await Promise.all(
            dataSpecies.map((item) => {
                return item.json();
            })
        );
        const speciesNames = parsedDataSpecies.map((specie) => specie.name);

        return speciesNames;
    } catch (error) {
        console.error("Error: ", `${residentsList.species} failed to load`);
    }
}
