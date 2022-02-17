import { getPlanets } from "./fetchSwapi";

const pages = document.querySelectorAll(".pages__button");
const table = document.querySelector(".table__body");

export function getPage(event) {
    pages.forEach((page) => {
        page.classList.remove("pages__button--active");
    });
    event.target.classList.add("pages__button--active");
    const pageNumber = event.target.innerHTML;
    renderTable(pageNumber);
}

document.addEventListener("DOMContentLoaded", () => renderTable("1"));
pages.forEach((page) => {
    page.addEventListener("click", (event) => getPage(event));
});

export function createTable(el) {
    let { planet, residentName, specie } = el;
    const row = document.createElement("tr");

    let planetName = document.createElement("td");
    planetName.innerHTML = planet;

    let resident = document.createElement("td");
    resident.innerHTML = residentName;

    let speciesName = document.createElement("td");
    speciesName.innerHTML = specie;

    row.appendChild(planetName);
    row.appendChild(resident);
    row.appendChild(speciesName);
    table.appendChild(row);
}

function getLoader() {
    table.innerHTML =
        '<tr><td class="load-container" colspan="3"><div class="loader"></div></td></tr>';
}

export async function renderTable(page) {
    getLoader();
    let result = await getPlanets(page);
    table.innerHTML = "";
    result.map((element) => createTable(element));
}
