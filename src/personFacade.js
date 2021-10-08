import { handleHttpErrors, makeOptions } from "./httpUtil";

const URL = "http://localhost:8080/CA1A2/api/person"

function getAll() {
    return fetch(`${URL}/list`)
        .then(handleHttpErrors);
}

const personFacade = {
    getAll
}

export default personFacade;
