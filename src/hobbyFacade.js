import { handleHttpErrors, makeOptions } from "./httpUtil";

const URL = "http://localhost:8080/CA1A2/api/hobby"

function getAll() {
    return fetch(`${URL}/list`)
        .then(handleHttpErrors);
}

function getById(id) {
    return fetch(`${URL}/id/${id}`)
        .then(handleHttpErrors);
}

function getByCategory(category) {
    return fetch(`${URL}/category/${category}`)
        .then(handleHttpErrors);
}

function getByType(type) {
    return fetch(`${URL}/type/${type}`)
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

function getByAddress(id) {
    return fetch(`${URL}/address/${id}`)
        .then(handleHttpErrors);
}

function create(hobby) {
    let opts = makeOptions("POST", hobby);
    return fetch(`${URL}`, opts)
}
     
function update(hobby) {
    let opts = makeOptions("PUT", hobby);
    return fetch(`${URL}`, opts)
        .then(handleHttpErrors);
}

function deleteHobby(id) {
    let opts = makeOptions("DELETE")
    return fetch(`${URL}/${id}`, opts)
        .then(handleHttpErrors);
}

const hobbyFacade = {
    getAll,
    getById,
    getByCategory,
    getByType,
    getByPersonId,
    getByZip,
    getByAddress,
    create,
    update,
    deleteHobby
}

export default hobbyFacade;
