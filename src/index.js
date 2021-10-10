import "./style.css"
import "bootstrap/dist/css/bootstrap.css"
import * as bootstrap from 'bootstrap';
import '@popperjs/core';
import personFacade from "./personFacade"
import hobbyFacade from "./hobbyFacade"
import addressFacade from "./addressFacade"

document.getElementById("all-content").style.display = "block"

/* 
  Add your JavaScript for all exercises Below or in separate js-files, which you must the import above
*/

/* ERROR */
const errorModalElement = document.getElementById("error_modal");
const errorModal = new bootstrap.Modal(errorModalElement);

function displayError(err) {
    let title = errorModalElement.querySelector(".modal-title");
    let body = errorModalElement.querySelector(".modal-body");
    if (err.status) {
        err.fullError.then(e => {
            title.innerHTML = e.code;
            body.innerHTML = e.message;
        })
    }
    else {
        body.innerHTML = "Network error";
    }
    errorModal.show();
}

/* PERSONS */
function getAllPersons() {
    personFacade.getAll()
        .then(data => {
            let dataTableString = data.map(getPersonRow).join("");
            document.getElementById("persons_tbody").innerHTML = dataTableString;
        })
        .catch(displayError);
}

function getPersonRow(p) {
    return `<tr>
                <td>${p.id}</td>
                <td>${p.firstName}</td>
                <td>${p.lastName}</td>
                <td>${p.email}</td>
                <td>${p.phones.map(ph =>
        `${ph.number} (${ph.info})`).join("<br>")}</td>
                <td>${p.hobbies.map(h =>
            h.name).join("<br>")}</td>
                <td>${p.address.zip.id} ${p.address.zip.city}, ${p.address.address}</td>
                <td>
                    <button id="persons_edit${p.id}" class="btn btn-warning" name="edit" value="${p.id}">Edit</button>
                    <button id="persons_delete${p.id}" class="btn btn-danger" name="delete" value="${p.id}">Delete</button>
                </td>
            </tr>`;
}

const personsModalElement = document.getElementById("persons_modal");
const personsModal = new bootstrap.Modal(personsModalElement);

function formCreatePerson() {
    document.querySelector("#persons_modal .modal-title").innerHTML = "Create new person";
    let confirmButton = document.getElementById("persons_modal_confirm");
    confirmButton.name = "create";
    confirmButton.innerHTML = "Create person";
    personsModal.toggle();
}

function formEditPerson(id) {
    document.querySelector("#persons_modal .modal-title").innerHTML = "Update person";
    let confirmButton = document.getElementById("persons_modal_confirm");
    confirmButton.name = "edit";
    confirmButton.innerHTML = "Update person";

    let form = document.getElementById("persons_form");

    personFacade.getById(id)
        .then(p => {
            form.person_id.value = p.id;
            form.first_name.value = p.firstName;
            form.last_name.value = p.lastName;
            form.email.value = p.email;
            form.address.value = p.address.address;
            form.city.value = p.address.zip.city;
            form.zip.value = p.address.zip.id;

            // assert i == phoneRowCount at start
            for (let i = 0; i < p.phones.length; i++) {
                addPhoneRowToPerson();
                form[`phone_number${i}`].value = p.phones[i].number;
                form[`phone_info${i}`].value = p.phones[i].info;
            }
        })

    personsModal.toggle();
}

function getPersonFromForm(form) {
    let person = {
        firstName: form.first_name.value,
        lastName: form.last_name.value,
        email: form.email.value,
        address: {
            address: form.address.value,
            zip: {
                id: form.zip.value,
                city: form.city.value
            }
        }
    }

    let id = form.person_id.value;
    if (id) {
        person.id = id;
    }

    let phones = [];
    let phoneCount = document.getElementById("phone_rows").childElementCount;
    if (phoneCount === 1) {
        phones.push({
            number: form.phone_number.value,
            info: form.phone_info.value
        })
    }
    else {
        for (let i = 0; i < phoneCount; i++) {
            phones.push({
                number: form.phone_number[i].value,
                info: form.phone_info[i].value
            })
        }
    }

    person.phones = phones;

    person.hobbies = [];

    return person;
}

function createPerson() {
    let form = document.getElementById("persons_form");
    let person = getPersonFromForm(form);
    personFacade.create(person)
        .then(getAllPersons)
        .catch(displayError);
    personsModal.hide();
}

function editPerson() {
    let form = document.getElementById("persons_form");
    let person = getPersonFromForm(form);
    personFacade.update(person)
        .then(getAllPersons)
        .catch(displayError);
    personsModal.hide();
}

function deletePerson(id) {
    personFacade.deletePerson(id)
        .then(getAllPersons)
        .catch(displayError);
}

document.getElementById("persons_table").addEventListener("click", evt => {
    let name = evt.target.name;
    switch (name) {
        case "create":
            formCreatePerson();
            break;
        case "edit":
            formEditPerson(evt.target.value);
            break;
        case "delete":
            deletePerson(evt.target.value);
    }
})

var phoneRowCount = 0;

function addPhoneRowToPerson() {
    let phoneRows = document.getElementById("phone_rows");
    phoneRows.insertAdjacentHTML("beforeend",
        `<div id="phone${phoneRowCount}" class="row mb-3">
                                <div class="col-6">
                                    <label class="form-label" for="phone_number${phoneRowCount}">Phone number</label>
                                    <input class="form-control" type="text" id="phone_number${phoneRowCount}" name="phone_number" placeholder="12345678">
                                </div>
                                <div class="col-3">
                                    <label class="form-label" for="phone_info${phoneRowCount}">Info</label>
                                    <input class="form-control" type="text" id="phone_info${phoneRowCount}" name="phone_info" placeholder="work">
                                </div>
                                <div class="col-3">
                                    <button type="button" class="btn btn-danger" id="phone_remove${phoneRowCount}" name="phone_remove" value="${phoneRowCount}">Remove</button>
                            </div>`);
    phoneRowCount++;
}

// could also take the element as argument based on a parent of the target.
function removePhoneRowFromPerson(i) {
    let phoneRow = document.getElementById(`phone${i}`);
    phoneRow.remove();
}

document.getElementById("phone_section").addEventListener("click", evt => {
    let name = evt.target.name;
    switch (name) {
        case "phone_add": addPhoneRowToPerson(); break;
        case "phone_remove": removePhoneRowFromPerson(evt.target.value); break;
    }
});

document.getElementById("persons_modal_confirm").addEventListener("click", evt => {
    let name = evt.target.name;
    switch (name) {
        case "create": createPerson(); break;
        case "edit": editPerson(); break;
    }
})

function clearPersonsForm() {
    phoneRowCount = 0;
    document.getElementById("phone_rows").innerHTML = "";
    let form = document.getElementById("persons_form");
    form.person_id.value = "";
    form.first_name.value = "";
    form.last_name.value = "";
    form.email.value = "";
    form.address.value = "";
    form.city.value = "";
    form.zip.value = "";
}

personsModalElement.addEventListener("hidden.bs.modal", clearPersonsForm);



/* HOBBIES */
function getAllHobbies() {
    hobbyFacade.getAll()
        .then(data => {
            let dataTableString = data.map(getHobbyRow).join("");
            document.getElementById("hobbies_tbody").innerHTML = dataTableString;
        })
        .catch(displayError);
}

function getHobbyRow(h) {
    return `<tr>
                <td>${h.id}</td>
                <td>${h.name}</td>
                <td>${h.link}</td>
                <td>${h.category}</td>
                <td>${h.type}</td>
                <td>
                    <button id="hobbies_edit${h.id}" class="btn btn-warning" name="edit" value="${h.id}">Edit</button>
                    <button id="hobbies_delete${h.id}" class="btn btn-danger" name="delete" value="${h.id}">Delete</button>
                </td>
            </tr>`;
}

const hobbiesModalElement = document.getElementById("hobbies_modal");
const hobbiesModal = new bootstrap.Modal(hobbiesModalElement);

function formCreateHobby() {
    document.querySelector("#hobbies_modal .modal-title").innerHTML = "Create new hobby";
    let confirmButton = document.getElementById("hobbies_modal_confirm");
    confirmButton.name = "create";
    confirmButton.innerHTML = "Create hobby";
    hobbiesModal.toggle();
}

function formEditHobby(id) {
    document.querySelector("#hobbies_modal .modal-title").innerHTML = "Update hobby";
    let confirmButton = document.getElementById("hobbies_modal_confirm");
    confirmButton.name = "edit";
    confirmButton.innerHTML = "Update hobby";

    let form = document.getElementById("hobbies_form");

    hobbyFacade.getById(id)
        .then(h => {
            form.hobby_id.value = h.id;
            form.name.value = h.name;
            form.link.value = h.link;
            form.category.value = h.category;
            form.type.value = h.type;
        })

    hobbiesModal.toggle();
}

function getHobbyFromForm(form) {
    let hobby = {
        name: form.name.value,
        link: form.link.value,
        category: form.category.value,
        type: form.type.value
    }

    let id = form.hobby_id.value;
    if (id) {
        hobby.id = id;
    }
    
    return hobby;
}

function createHobby() {
    let form = document.getElementById("hobbies_form");
    let hobby = getHobbyFromForm(form);
    hobbyFacade.create(hobby)
        .then(getAllHobbies)
        .catch(displayError);
    hobbiesModal.hide();
}

function editHobby() {
    let form = document.getElementById("hobbies_form");
    let hobby = getHobbyFromForm(form);
    hobbyFacade.update(hobby)
        .then(getAllHobbies)
        .catch(displayError);
    hobbiesModal.hide();
}

function deleteHobby(id) {
    hobbyFacade.deleteHobby(id)
        .then(getAllHobbies)
        .catch(displayError);
}

document.getElementById("hobbies_table").addEventListener("click", evt => {
    let name = evt.target.name;
    switch (name) {
        case "create":
            formCreateHobby();
            break;
        case "edit":
            formEditHobby(evt.target.value);
            break;
        case "delete":
            deleteHobby(evt.target.value);
    }
})

document.getElementById("hobbies_modal_confirm").addEventListener("click", evt => {
    let name = evt.target.name;
    switch (name) {
        case "create": createHobby(); break;
        case "edit": editHobby(); break;
    }
})

function clearHobbiesForm() {
    let form = document.getElementById("hobbies_form");
    form.hobby_id.value = "";
    form.name.value = "";
    form.link.value = "";
    form.category.value = "";
    form.type.value = "";
}

hobbiesModalElement.addEventListener("hidden.bs.modal", clearHobbiesForm);



/* ADDRESSES */
function getAllAddresses() {
    addressFacade.getAll()
        .then(data => {
            let dataTableString = data.map(getAddressRow).join("");
            document.getElementById("addresses_table").innerHTML = dataTableString;
        })
        .catch(displayError);
}

function getAddressRow(a) {
    return `<tr>
                <td>${a.id}</td>
                <td>${a.address}</td>
                <td>${a.zip.id}</td>
                <td>${a.zip.city}</td>
            </tr>`;
}


/* 
Do NOT focus on the code below, UNLESS you want to use this code for something different than
the Period2-week2-day3 Exercises
*/

function hideAllShowOne(idToShow) {
    document.getElementById("about_html").style = "display:none"
    document.getElementById("persons_html").style = "display:none"
    document.getElementById("hobbies_html").style = "display:none"
    document.getElementById("addresses_html").style = "display:none"
    document.getElementById(idToShow).style = "display:block"
}

function menuItemClicked(evt) {
    const id = evt.target.id;
    switch (id) {
        case "persons_tab":
            hideAllShowOne("persons_html");
            getAllPersons();
            break
        case "hobbies_tab":
            hideAllShowOne("hobbies_html");
            getAllHobbies();
            break
        case "addresses_tab":
            hideAllShowOne("addresses_html");
            getAllAddresses();
            break
        default:
            hideAllShowOne("about_html");
            break
    }
    evt.preventDefault();
}
document.getElementById("menu").onclick = menuItemClicked;
hideAllShowOne("about_html");
