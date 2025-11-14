// render_cardDlg.js
import { LIBRARY, LS_loadVar } from "./localStorage.js";

// export let lastOpenedBookObj = 0; // Hier brauche ich das nicht
const ref_idCardDlg = document.getElementById("idCardDlg");
const ref_idSecCardDlg = document.getElementById("idSecCardDlg");


// #region CallBack-Funcs (Handler-Funktionen) 
function handleCloseBtn(index) {
    const ref_idCardDlgX = document.getElementById(`idCardDlg${index}`);
    ref_idCardDlgX.classList.remove("opened");
    document.querySelector(`#idDlgRatingFigureLikes${index} img`).classList.remove("highlighted");
    ref_idCardDlgX.close();
}

// function handleLikeClick(e) {
//     e.preventDefault();
//     e.stopPropagation();

//     const idx = openedBookObj;
//     const booksList = LS_loadVar(LIBRARY);


//     if (booksList[idx].liked == false) {
//         booksList[idx].likes += 1;

//         // Verhindere negative dislikes
//         if (booksList[idx].dislikes > 0) {
//             booksList[idx].dislikes -= 1;
//         }

//         booksList[idx].liked = true;
//         localStorage.setItem(LIBRARY.LSKey, JSON.stringify(booksList));
//     }

//     render_cardDlg(idx);
// }

// function handleEscapeKey(e) {
//     if (e.key === "Escape") {
//         e.preventDefault();
//         closeCard();
//     }
// }

// function handleBackdropClick(e) {
//     if (e.target === ref_idCardDlg) {
//         closeCard();
//     }
// }

// function handleSubmitComment(e) {
//     e.preventDefault();

//     const newComment = {
//         "id": `cmt-${document.getElementById("idDlgInputName").value.trim()}`,
//         "name": document.getElementById("idDlgInputName").value.trim().toUpperCase(),
//         "rating": document.getElementById("idDlgInputRating").value.trim(),
//         "text": document.getElementById("idDlgInputComment").value.trim(),
//         "createdAt": new Date().toLocaleString(),
//     };

//     const idx = openedBookObj;
//     const booksList = LS_loadVar(LIBRARY);
//     booksList[idx].comments.splice(0, 0, newComment);
//     localStorage.setItem(LIBRARY.LSKey, JSON.stringify(booksList));

//     e.target.reset();
//     render_cardDlg(idx);
// }

// function handleDislikeClick(e) {
//     e.preventDefault();
//     e.stopPropagation();

//     const idx = openedBookObj;
//     const booksList = LS_loadVar(LIBRARY);

//     if (booksList[idx].liked == true) {
//         booksList[idx].dislikes += 1;

//         // Verhindere negative likes
//         if (booksList[idx].likes > 0) {
//             booksList[idx].likes -= 1;
//         }

//         booksList[idx].liked = false;
//         localStorage.setItem(LIBRARY.LSKey, JSON.stringify(booksList));
//     }

//     render_cardDlg(idx);
// }
// #endregion

// #region Hauptfunktionen

export function openCards() {
    ref_idSecCardDlg.classList.add("cSecCardDlgs");
    //// Ich hole mein einziges #idCardDlg-Element ab & vermehre das.
    render_cardDlgs();
    // nachdem alle CardDlgs da sind, blende sie ein:
    document.querySelectorAll(".CardDlgs")
        .forEach((renderedDlg, index) => renderedDlg.showModal());
}

function render_cardDlgs() {
    let counter = 0;

    LS_loadVar(LIBRARY).forEach((bookObj, index) => {
        console.log(counter++);

        //// Bevor cloning: Old Listener & cCardDlg von ref_idCardDlg entfernen
        // ref_idCardDlg.removeEventListener("keydown", handleEscapeKey);
        // ref_idCardDlg.removeEventListener("click", handleBackdropClick);
        // ref_idCardDlg.classList.remove("cCardDlg");
        const cloned_ref_idCardDlg = ref_idCardDlg.cloneNode(true);
        console.log(cloned_ref_idCardDlg);
        cloned_ref_idCardDlg.id = `idCardDlg${index}`;
        cloned_ref_idCardDlg.className = "cCardDlgs";

        // #region First adjust the old Ids for the new Element
        const new_idDlgHeaderTitle = (document.getElementById("idDlgHeaderTitle").id = `idDlgHeaderTitle${index}`);
        const new_idDlgBookInfosUpPrice = (document.getElementById("idDlgBookInfosUpPrice").id = `idDlgBookInfosUpPrice${index}`);
        const new_idDlgRatingLikes = (document.getElementById("idDlgRatingLikes").id = `idDlgRatingLikes${index}`);
        const new_idDlgRatingDislikes = (document.getElementById("idDlgRatingDislikes").id = `idDlgRatingDislikes${index}`);
        const new_idDlgBookInfosDownAuthor = (document.getElementById("idDlgBookInfosDownAuthor").id = `idDlgBookInfosDownAuthor${index}`);
        const new_idDlgBookInfosDownPublished = (document.getElementById("idDlgBookInfosDownPublished").id = `idDlgBookInfosDownPublished${index}`);
        const new_idDlgBookInfosDownGenre = document.getElementById("idDlgBookInfosDownGenre").id = `idDlgBookInfosDownGenre${index}`;

        const new_idDlgCommentsTableBody = (document.getElementById("idDlgCommentsTableBody").id = `idDlgCommentsTableBody${index}`);
        const new_idDlgHeaderCloseBTN = (document.getElementById("idDlgHeaderCloseBTN").id = `idDlgHeaderCloseBTN${index}`);
        const new_idDlgRatingFigureLikes = (document.getElementById("idDlgRatingFigureLikes").id = `idDlgRatingFigureLikes${index}`);
        const new_idDlgRatingFigureDislikes = (document.getElementById("idDlgRatingFigureDislikes").id = `idDlgRatingFigureDislikes${index}`);
        const new_idDlgSendCommentForm = (document.getElementById("idDlgSendCommentForm").id = `idDlgSendCommentForm${index}`);
        const new_idDlgInputName = (document.getElementById("idDlgInputName").id = `idDlgInputName${index}`);
        const new_idDlgInputRating = (document.getElementById("idDlgInputRating").id = `idDlgInputRating${index}`);
        const new_idDlgInputComment = (document.getElementById("idDlgInputComment").id = `idDlgInputComment${index}`);

        // #endregion

        // #region Replace Placeholders
        document.getElementById(new_idDlgHeaderTitle).innerText = bookObj.title;
        document.getElementById(new_idDlgBookInfosUpPrice).innerText = `${(bookObj.priceCents / 100).toFixed(2)}`;
        document.getElementById(new_idDlgRatingLikes).innerText = bookObj.likes;
        document.getElementById(new_idDlgRatingDislikes).innerText = `${(bookObj.priceCents / 100).toFixed(2)}`;
        document.getElementById(new_idDlgBookInfosDownAuthor).innerText = `: ${bookObj.authors.join(", ")}`;
        document.getElementById(new_idDlgBookInfosDownPublished).innerText = `: ${bookObj.publishedAt}`;
        document.getElementById(new_idDlgBookInfosDownGenre).innerText = `: ${bookObj.genres.join(", ")}`;


        // Es gibt keine vorherige comments, nur add all comments of bookObj
        const commentsList = bookObj.comments;
        commentsList.forEach((commentObj, index) => {
            const newTr = document.createElement("tr");
            newTr.innerHTML = `
                        <th>${commentObj.name}</th>
                        <td>: ${commentObj.text}</td>
        `;
            document.getElementById(new_idDlgCommentsTableBody).appendChild(newTr);
        });

        // Highlight liked books
        if (bookObj.liked) {
            document.querySelector(`#${new_idDlgRatingFigureLikes} img`).classList.add("highlighted");
        }
        // #endregion
        console.log(cloned_ref_idCardDlg);

        // activateEventsForCardDlg(index);
        ref_idSecCardDlg.appendChild(cloned_ref_idCardDlg);
    });
}

// function activateEventsForCardDlg(index) {
//     const closeBtn = document.getElementById(`idDlgHeaderCloseBTN${index}`);
//     const likeFigure = document.getElementById(`idDlgRatingFigureLikes${index}`);
//     const dislikeFigure = document.getElementById(`idDlgRatingFigureDislikes${index}`);
//     const form = document.getElementById(`idDlgSendCommentForm${index}`);


//     // Remove old Listener
//     // ref_idCardDlg.removeEventListener("keydown", handleEscapeKey); // Das brauche ich hier nicht wenn @media (max-width: 700px)
//     // ref_idCardDlg.removeEventListener("click", handleBackdropClick); // Das brauche ich nicht hier wenn @media (max-width: 700px)

//     closeBtn.removeEventListener("click", index => handleCloseBtn(index));
//     likeFigure.removeEventListener("click", handleLikeClick);
//     dislikeFigure.removeEventListener("click", handleDislikeClick);
//     form.removeEventListener("submit", handleSubmitComment);

//     // Add new Listener
//     // ref_idCardDlg.addEventListener("keydown", handleEscapeKey); // Das brauche ich nicht hier wenn @media (max-width: 700px)
//     // ref_idCardDlg.addEventListener("click", handleBackdropClick); // Das brauche ich nicht hier wenn @media (max-width: 700px)

//     closeBtn.addEventListener("click", index => handleCloseBtn(index));
//     likeFigure.addEventListener("click", handleLikeClick);
//     dislikeFigure.addEventListener("click", handleDislikeClick);
//     form.addEventListener("submit", handleSubmitComment);
// }

// #endregion

