import "./style.css"
import "bootstrap/dist/css/bootstrap.css"
import * as bootstrap from 'bootstrap';
import '@popperjs/core';
import "./jokeFacade"
import personFacade from "./personFacade"

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

function getAllPersons() {
    personFacade.getAll()
        .then(data => {
            let dataTableString = data.map(p =>
                `<tr>
          <td>${p.id}</td>
          <td>${p.firstName}</td>
          <td>${p.lastName}</td>
          <td>${p.email}</td>
          <td>${p.address.address}</td>
          <td>${p.address.zip.city}</td>
          <td>${p.address.zip.id}</td>
        </tr>`)
                .join("");
            document.getElementById("persons_table").innerHTML = dataTableString;
        })
        .catch(displayError)
}

/* JS For Exercise-2 below */



/* JS For Exercise-3 below */


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
            break
        case "addresses_tab":
            hideAllShowOne("addresses_html");
            break
        default:
            hideAllShowOne("about_html");
            break
    }
    evt.preventDefault();
}
document.getElementById("menu").onclick = menuItemClicked;
hideAllShowOne("about_html");
