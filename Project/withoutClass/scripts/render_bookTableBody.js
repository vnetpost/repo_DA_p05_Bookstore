import { openCard } from "./render_cardDlg_single.js";
import { LIBRARY, LS_loadVar } from "./localStorage.js";

const ref_idBookTableBody = document.getElementById("idBookTableBody");

export function render_bookTableBody() {
    ref_idBookTableBody.innerHTML = "";
    const booksList = LS_loadVar(LIBRARY);
    booksList.forEach((bookObj, index) => {

        // Adding all bookObjs to idBookTableBody:

        // <tr id="idBookRowX" class="cBookRaws">
        //     <td>Die Geheimnisse des Ozeans</td>
        //     <td>Fantasy</td>
        //     <td>Clara Meer</td>
        //     <td>4.4/5</td>
        //     <td>1999 Euro</td>
        //     <td>
        //         <button id="idBookRowBtnX">
        //              <img src="./assets/images/icons/goToBookInfos.svg" alt="goToBookInfos.svg">
        //         </button>
        //     </td>
        // </tr>

        const newTr = document.createElement("tr");
        newTr.id = `idBookRow${index}`;
        newTr.className = "cBookRaws";

        newTr.innerHTML = `
            <td>${bookObj.title}</td>
            <td>${Array.isArray(bookObj.genres) ? bookObj.genres.join(", ") : ""}</td>
            <td>${Array.isArray(bookObj.authors) ? bookObj.authors.join(", ") : ""}</td>
            <td class="cColumn4and5">${calBookRating(index)}/5</td>
            <td class="cColumn4and5">${(bookObj.priceCents / 100).toFixed(2)} &#8364;</td>
            <td>
                <button id="idBookRowBtn${index}">
                    <img src="./assets/images/icons/goToBookInfos.svg" alt="goToBookInfos.svg">
                </button>
            </td>
        `;

        ref_idBookTableBody.appendChild(newTr);

        activateEventsOnBooksTable(index);

    });
}

function activateEventsOnBooksTable(index) {
    document.getElementById(`idBookRowBtn${index}`).addEventListener("click", () => {
        openCard(index);
    });
}

function calBookRating(index) {
    const bookComments = LS_loadVar(LIBRARY)[index].comments;

    if (!Array.isArray(bookComments) || bookComments.length === 0) {
        return "Unknown rating";
    }

    let sumAllRatings = 0;
    bookComments.forEach(commentObj => sumAllRatings += commentObj.rating);
    return Number(sumAllRatings / bookComments.length).toFixed(1);;
}