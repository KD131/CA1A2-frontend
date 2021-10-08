import { handleHttpErrors, makeOptions } from "./httpUtil";

const URL = "http://localhost:8080/CA1A2/api/person"

function getAll() {
    return fetch(`${URL}/list`)
        .then(handleHttpErrors);
}

function getById(id) {
    return fetch(`${URL}/id/${id}`)
        .then(handleHttpErrors);
}

function getByPhone(number) {
    return fetch(`${URL}/phone/${number}`)
        .then(handleHttpErrors);
}

function getByZip(zip) {
    return fetch(`${URL}/zip/${zip}`)
        .then(handleHttpErrors);
}

function getByAddress(id) {
    return fetch(`${URL}/address/${id}`)
        .then(handleHttpErrors);
}

function create(person) {
    let opts = makeOptions("POST", person);
    return fetch(`${URL}`, opts)
}
     
function update(person) {
    let opts = makeOptions("PUT", person);
    return fetch(`${URL}`, opts)
        .then(handleHttpErrors);
}

function deletePerson(id) {
    let opts = makeOptions("DELETE")
    return fetch(`${URL}/${id}`)
        .then(handleHttpErrors);
}

const personFacade = {
    getAll
}

export default personFacade;
