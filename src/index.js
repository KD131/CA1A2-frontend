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

/* JS For Exercise-1 below */
function displayError(err) {
    let errorElement = document.getElementById("error");
    if (err.status) {
        err.fullError.then(e => {
            errorElement.innerHTML = `${e.code}: ${e.message}`;
        })
    }
    else {
        errorElement.innerHTML = "Network error";
    }
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
                    <button id="edit${p.id}" class="btn btn-warning" name="edit" value="${p.id}">Edit</button>
                    <button id="delete${p.id}" class="btn btn-danger" name="delete" value="${p.id}">Delete</button>
                </td>
            </tr>`;
}

function deletePerson(id) {
    personFacade.deletePerson(id)
        .then(getAllPersons)
        .catch(displayError);
}

var personsModal = new bootstrap.Modal(document.getElementById("persons_modal"));
document.getElementById("persons_table").addEventListener("click", evt => {
    let name = evt.target.name;
    switch (name) {
        case "create":
            document.querySelector("#persons_modal .modal-title").innerHTML = "Create new person"
            personsModal.toggle();
            break;
        case "edit":
            document.querySelector("#persons_modal .modal-title").innerHTML = "Edit person"
            personsModal.toggle();
            break;
        case "delete":
            deletePerson(evt.target.value);
    }
})

var phoneRowCount = 0;

function addPhoneRowToPerson() {
    let phoneRows = document.getElementById("phone-rows");
    phoneRows.innerHTML += `<div id="phone${phoneRowCount}" class="row mb-3">
                                <div class="col-6">
                                    <label class="form-label" for="phone-number${phoneRowCount}">Phone number</label>
                                    <input class="form-control" type="text" id="phone-number${phoneRowCount}" name="phone-number" placeholder="12345678">
                                </div>
                                <div class="col-3">
                                    <label class="form-label" for="phone-info${phoneRowCount}">Info</label>
                                    <input class="form-control" type="text" id="phone-info${phoneRowCount}" name="phone-info" placeholder="work">
                                </div>
                                <div class="col-3">
                                    <button type="button" class="btn btn-danger" id="phone-remove${phoneRowCount}" name="phone-remove" value="${phoneRowCount}">Remove</button>
                            </div>`;
    phoneRowCount++;
}

// could also take the element as argument based on a parent of the target.
function removePhoneRowFromPerson(i) {
    let phoneRow = document.getElementById(`phone${i}`);
    phoneRow.remove();
}

document.getElementById("phone-section").addEventListener("click", evt => {
    let name = evt.target.name;
    switch (name) {
        case "phone-add": addPhoneRowToPerson(); break;
        case "phone-remove": removePhoneRowFromPerson(evt.target.value); break;
    }
});

/* HOBBIES */
function getAllHobbies() {
    hobbyFacade.getAll()
        .then(data => {
            let dataTableString = data.map(getHobbyRow).join("");
            document.getElementById("hobbies_table").innerHTML = dataTableString;
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
            </tr>`;
}


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
