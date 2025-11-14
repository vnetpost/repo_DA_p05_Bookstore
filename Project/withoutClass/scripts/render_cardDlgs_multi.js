// render_cardDlg.js
import { LIBRARY, LS_loadVar } from "./localStorage.js";
import { render_bookTableBody } from "./render_bookTableBody.js";

// export let lastOpenedBookObj = 0; // Hier nicht mehr noetig
const ref_idSecCardDlg = document.getElementById("idSecCardDlg");

// #region CallBack-Funcs (Handler-Funktionen) 


// #endregion



// #region Hauptfunktionen

export function openAllCards() {
    console.log("openAllCards aufgerufen...");

    ref_idSecCardDlg.classList.add("cSecCardDlgsMulti"); // um alle Dialoge darin anzuzeigen

    render_cardDlgs_multi();

    // CardDlgs exist -> showModal():
    ref_idSecCardDlg.querySelectorAll(".cCardDlgsMulti").forEach(dlg => dlg.showModal());
}

export function closeAllCards() {
    console.log("closeAllCards aufgerufen...");

    // ref_idSecCardDlg.classList.remove("cSecCardDlgsMulti");
    ref_idSecCardDlg.className = "";

    // Alle Multi-Dialoge schließen und entfernen
    ref_idSecCardDlg.querySelectorAll(".cCardDlgsMulti").forEach(dlg => {
        dlg.close();
        dlg.remove();
    });
}

function render_cardDlgs_multi() {
    // let counter = 0;

    // Sammle erst alle Dialogs dann nur einmalig einfügen
    let allDialogsHTML = "";
    LS_loadVar(LIBRARY).forEach((bookObj, index) => {
        // console.log("Rendering BookObj: ", counter++);

        allDialogsHTML += dlgTemplate(bookObj, index);

    });
    ref_idSecCardDlg.innerHTML += allDialogsHTML;

    // Dann add comments und Even-Listeners to all Dialog einzel einzel
    LS_loadVar(LIBRARY).forEach((bookObj, index) => {
        render_comments(bookObj, index);
        activateEventsForCardDlg(index);
    });
}

function activateEventsForCardDlg(index) {
    const dlg = document.getElementById(`idCardDlg${index}`);
    const closeBtn = document.getElementById(`idDlgHeaderCloseBTN${index}`);
    const likeFig = document.getElementById(`idDlgRatingFigureLikes${index}`);
    const dislikeFig = document.getElementById(`idDlgRatingFigureDislikes${index}`);
    const form = document.getElementById(`idDlgSendCommentForm${index}`);

    const booksList = LS_loadVar(LIBRARY);

    closeBtn.addEventListener('click', () => {
        console.log("triggered", index);
        dlg.close()
        dlg.classList.remove("opened");
    });

    likeFig.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!booksList[index].liked) {
            booksList[index].likes += 1;
            if (booksList[index].dislikes > 0) booksList[index].dislikes -= 1;
            booksList[index].liked = true;
            localStorage.setItem(LIBRARY.LSKey, JSON.stringify(booksList));
            // refresh just the numbers + highlight
            document.getElementById(`idDlgRatingLikes${index}`).innerText = booksList[index].likes;
            document.getElementById(`idDlgRatingDislikes${index}`).innerText = booksList[index].dislikes;
            likeFig.querySelector('img').classList.add('highlighted');
        }
    });

    dislikeFig.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (booksList[index].liked) {
            booksList[index].dislikes += 1;
            if (booksList[index].likes > 0) booksList[index].likes -= 1;
            booksList[index].liked = false;
            localStorage.setItem(LIBRARY.LSKey, JSON.stringify(booksList));
            document.getElementById(`idDlgRatingLikes${index}`).innerText = booksList[index].likes;
            document.getElementById(`idDlgRatingDislikes${index}`).innerText = booksList[index].dislikes;
            likeFig.querySelector('img').classList.remove('highlighted');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newComment = {
            "id": `cmt-${document.getElementById(`idDlgInputName${index}`).value.trim()}`,
            "name": document.getElementById(`idDlgInputName${index}`).value.trim().toUpperCase(),
            "rating": parseInt(document.getElementById(`idDlgInputRating${index}`).value.trim()),
            "text": document.getElementById(`idDlgInputComment${index}`).value.trim(),
            "createdAt": new Date().toISOString(),
        };

        const booksList = LS_loadVar(LIBRARY);
        booksList[index].comments.splice(0, 0, newComment);
        localStorage.setItem(LIBRARY.LSKey, JSON.stringify(booksList));

        e.target.reset();
        render_comments(bookObj, index)
    });

}
// #endregion

// #region Dialog Template
function dlgTemplate(bookObj, index) {

    return `
            <dialog id="idCardDlg${index}" class="cCardDlgsMulti opened">
                <div class="cDlgHeader">
                    <strong id="idDlgHeaderTitle${index}">${bookObj.title}</strong>
                    <button id="idDlgHeaderCloseBTN${index}"><img src="./assets/images/icons/close_btn.svg"
                            alt="close_btn.svg"></button>
                </div>

                <div class="cDlgBookImg">
                    <img src="./assets/images/icons/yellow-book.svg" alt="yellow-book.svg">
                </div>

                <div class="cDlgBookInfos">
                    <div class="cDlgBookInfosUp">
                        <strong><span id="idDlgBookInfosUpPrice${index}">${(bookObj.priceCents / 100).toFixed(2)}</span>&#8364;</strong>
                        <div class="cDlgRatingsEmojis">
                            <figure id="idDlgRatingFigureLikes${index}">
                                <img src="./assets/images/icons/heart.svg" alt="heart.svg"${bookObj.liked ? ' class="highlighted"' : ''}>
                                <figcaption id="idDlgRatingLikes${index}">${bookObj.likes}</figcaption>
                            </figure>
                            <figure id="idDlgRatingFigureDislikes${index}">
                                <img src="./assets/images/icons/thumbs-down.svg" alt="thumbs-down.svg">
                                <figcaption id="idDlgRatingDislikes${index}">${bookObj.dislikes}</figcaption>
                            </figure>
                        </div>
                    </div>
                    <div class="cDlgBookInfosDown">
                        <table>
                            <tr>
                                <th>Authur</th>
                                <td id="idDlgBookInfosDownAuthor${index}">: ${bookObj.authors.join(", ")}</td>
                            </tr>
                            <tr>
                                <th>ErscheinungsJahr</th>
                                <td id="idDlgBookInfosDownPublished${index}">: ${bookObj.publishedAt}</td>
                            </tr>
                            <tr>
                                <th>Genre</th>
                                <td id="idDlgBookInfosDownGenre${index}">: ${bookObj.genres.join(", ")}</td>
                            </tr>
                        </table>
                    </div>

                </div>

                <div class="cDlgCommentsArea">
                    <strong>Kommentare:</strong>
                    <div class="cWrapperDiv">
                        <!-- Einen Wrapper-Container verwenden um ganzes Table scrollbar zu machen -->
                        <table>
                            <tbody id="idDlgCommentsTableBody${index}">
                                <th>PLACEHOLDER ZUM TEST</th>
                                <td>: PLACEHOLDER ZUM TEST</td>
                            </tbody>
                        </table>
                    </div>
                </div>

                <form id="idDlgSendCommentForm${index}" class="cDlgSendCommentForm" action="">
                    <div>
                        <div>
                            <input id="idDlgInputName${index}" class="cDlgInputName" type="text" placeholder="Deine Name"
                                required>
                            <input id="idDlgInputRating${index}" class="cDlgInputRating" type="number" min="0" max="5"
                                placeholder="Deine Bewertung" required>
                        </div>
                        <textarea id="idDlgInputComment${index}" placeholder="Schreibe deine Kommentar ..." required></textarea>
                    </div>
                    <button id="idDlgSubmitCommentBtn${index}" type="submit"><img src="./assets/images/icons/paper-plane.svg"
                            alt="paper-plane.svg"></button>
                </form>

            </dialog>
    
    `;
}

function dlgEmptyTemplate() {

    return `
            <dialog id="idCardDlg" class="cCardDlgSingle">
                <div class="cDlgHeader">
                    <strong id="idDlgHeaderTitle">PLACEHOLDER</strong>
                    <button id="idDlgHeaderCloseBTN"><img src="./assets/images/icons/close_btn.svg"
                            alt="close_btn.svg"></button>
                </div>

                <div class="cDlgBookImg">
                    <img src="./assets/images/icons/yellow-book.svg" alt="yellow-book.svg">
                </div>

                <div class="cDlgBookInfos">
                    <div class="cDlgBookInfosUp">
                        <strong><span id="idDlgBookInfosUpPrice">PLACEHOLDER</span>&#8364;</strong>
                        <div class="cDlgRatingsEmojis">
                            <figure id="idDlgRatingFigureLikes">
                                <img src="./assets/images/icons/heart.svg" alt="heart.svg"PLACEHOLDER>
                                <figcaption id="idDlgRatingLikes">PLACEHOLDER</figcaption>
                            </figure>
                            <figure id="idDlgRatingFigureDislikes">
                                <img src="./assets/images/icons/thumbs-down.svg" alt="thumbs-down.svg">
                                <figcaption id="idDlgRatingDislikes">PLACEHOLDER</figcaption>
                            </figure>
                        </div>
                    </div>
                    <div class="cDlgBookInfosDown">
                        <table>
                            <tr>
                                <th>Authur</th>
                                <td id="idDlgBookInfosDownAuthor">: PLACEHOLDER</td>
                            </tr>
                            <tr>
                                <th>ErscheinungsJahr</th>
                                <td id="idDlgBookInfosDownPublished">: PLACEHOLDER</td>
                            </tr>
                            <tr>
                                <th>Genre</th>
                                <td id="idDlgBookInfosDownGenre">: PLACEHOLDER</td>
                            </tr>
                        </table>
                    </div>

                </div>

                <div class="cDlgCommentsArea">
                    <strong>Kommentare:</strong>
                    <div class="cWrapperDiv">
                        <!-- Einen Wrapper-Container verwenden um ganzes Table scrollbar zu machen -->
                        <table>
                            <tbody id="idDlgCommentsTableBody">
                                <th>PLACEHOLDER ZUM TEST</th>
                                <td>: PLACEHOLDER ZUM TEST</td>
                            </tbody>
                        </table>
                    </div>
                </div>

                <form id="idDlgSendCommentForm" class="cDlgSendCommentForm" action="">
                    <div>
                        <div>
                            <input id="idDlgInputName" class="cDlgInputName" type="text" placeholder="Deine Name"
                                required>
                            <input id="idDlgInputRating" class="cDlgInputRating" type="number" min="0" max="5"
                                placeholder="Deine Bewertung" required>
                        </div>
                        <textarea id="idDlgInputComment" placeholder="Schreibe deine Kommentar ..." required></textarea>
                    </div>
                    <button id="idDlgSubmitCommentBtn" type="submit"><img src="./assets/images/icons/paper-plane.svg"
                            alt="paper-plane.svg"></button>
                </form>

            </dialog>
    
    `;
}

function render_comments(bookObj, index) {
    // console.log("Rendering BookObj.comments: ", index);
    document.getElementById(`idDlgCommentsTableBody${index}`).innerHTML = "";
    bookObj.comments.forEach(commentObj => {
        const newTr = document.createElement("tr");
        newTr.innerHTML = `
                <th>${commentObj.name}</th>
                <td>: ${commentObj.text}</td>
        `;
        document.getElementById(`idDlgCommentsTableBody${index}`).appendChild(newTr);
    });
}

// #endregion
