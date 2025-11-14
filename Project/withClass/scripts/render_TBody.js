import { bookInstances } from "../main.js";
import { Book } from "./classBook.js";
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

        // Now newTr is in the DOM document, but still no dialog
        // A Dialog (a book instance) will be created by click on idBookRowBtnX
        document.getElementById(`idBookRowBtn${index}`).addEventListener("click", () => {
            document.getElementById("idSecDlgs").innerHTML = "";
            const bookInst = new Book(bookObj, index);
            // Wenn das Dlg in <700px geöffnet wird 
            // und sich plötzlich >700px ändert, muss die Instanz gelöscht werden
            bookInstances.push(bookInst);
            //#######################
            bookInst.openSingleDlg();
        });
    });
}

function calBookRating(index) {
    const commentsList = LS_loadVar(LIBRARY)[index].comments;
    if (!Array.isArray(commentsList) || commentsList.length === 0) return 0;

    let sum = 0;
    commentsList.forEach(commentObj => sum += Number(commentObj.userRating));
    return (sum / commentsList.length).toFixed(1);
}