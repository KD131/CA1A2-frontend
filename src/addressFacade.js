import { handleHttpErrors, makeOptions } from "./httpUtil";

const URL = "http://localhost:8080/CA1A2/api/address"

function getAll() {
    return fetch(`${URL}/list`)
        .then(handleHttpErrors);
}

function getById(id) {
    return fetch(`${URL}/id/${id}`)
        .then(handleHttpErrors);
}

function getByPersonId(id) {
    return fetch(`${URL}/person/${id}`)
        .then(handleHttpErrors);
}

function getByZip(zip) {
    return fetch(`${URL}/zip/${zip}`)
        .then(handleHttpErrors);
}

function create(hobby) {
    let opts = makeOptions("POST", hobby);
    return fetch(`${URL}`, opts)
        .then(handleHttpErrors);
}
     
function update(hobby) {
    let opts = makeOptions("PUT", hobby);
    return fetch(`${URL}`, opts)
        .then(handleHttpErrors);
}

function deleteAddress(id) {
    let opts = makeOptions("DELETE")
    return fetch(`${URL}/${id}`, opts)
        .then(handleHttpErrors);
}

const addressFacade = {
    getAll,
    getById,
    getByPersonId,
    getByZip,
    create,
    update,
    deleteAddress
}

export default addressFacade;
