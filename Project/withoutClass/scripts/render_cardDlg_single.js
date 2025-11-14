// render_cardDlg_single.js
import { LIBRARY, LS_loadVar } from "./localStorage.js";

export let lastOpenedBookObj = 0;
const ref_idCardDlg = document.getElementById("idCardDlg");
const ref_idSecCardDlg = document.getElementById("idSecCardDlg");

// #region Hendler-Funktionen
function handleCloseBtn() {
    closeCard();
}

function handleEscapeKey(e) {
    if (e.key === "Escape") {
        e.preventDefault();
        closeCard();
    }
}

function handleBackdropClick(e) {
    if (e.target === ref_idCardDlg) {
        closeCard();
    }
}

function handleSubmitComment(e) {
    e.preventDefault();

    const newComment = {
        "id": `cmt-${document.getElementById("idDlgInputName").value.trim()}`,
        "name": document.getElementById("idDlgInputName").value.trim().toUpperCase(),
        "rating": document.getElementById("idDlgInputRating").value.trim(),
        "text": document.getElementById("idDlgInputComment").value.trim(),
        "createdAt": new Date().toLocaleString(),
    };

    const idx = lastOpenedBookObj;
    const booksList = LS_loadVar(LIBRARY);
    booksList[idx].comments.splice(0, 0, newComment);
    localStorage.setItem(LIBRARY.LSKey, JSON.stringify(booksList));

    e.target.reset();
    render_cardDlg_single(idx);
}

function handleLikeClick(e) {

    e.preventDefault();
    e.stopPropagation();

    const idx = lastOpenedBookObj;
    const booksList = LS_loadVar(LIBRARY);


    if (booksList[idx].liked == false) {
        booksList[idx].likes += 1;

        // Verhindere negative dislikes
        if (booksList[idx].dislikes > 0) {
            booksList[idx].dislikes -= 1;
        }

        booksList[idx].liked = true;
        localStorage.setItem(LIBRARY.LSKey, JSON.stringify(booksList));
    }

    render_cardDlg_single(idx);
}

function handleDislikeClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const idx = lastOpenedBookObj;
    const booksList = LS_loadVar(LIBRARY);

    if (booksList[idx].liked == true) {
        booksList[idx].dislikes += 1;

        // Verhindere negative likes
        if (booksList[idx].likes > 0) {
            booksList[idx].likes -= 1;
        }

        booksList[idx].liked = false;
        localStorage.setItem(LIBRARY.LSKey, JSON.stringify(booksList));
    }

    render_cardDlg_single(idx);
}
// #endregion

// #region Hauptfunktionen
export function openCard(index) {
    lastOpenedBookObj = index;
    ref_idSecCardDlg.classList.remove("cSecCardDlgsMulti");
    ref_idCardDlg.classList.add("cCardDlgSingle");
    ref_idCardDlg.classList.add("opened");
    render_cardDlg_single(index);
    ref_idCardDlg.showModal();
}

export function closeCard() {
    ref_idCardDlg.classList.remove("cCardDlgSingle");
    ref_idCardDlg.classList.remove("opened");
    document.querySelector("#idDlgRatingFigureLikes img").classList.remove("highlighted");
    ref_idCardDlg.close();
}

function render_cardDlg_single(index) {
    const bookTarget = LS_loadVar(LIBRARY)[index];

    console.log("This book has to be openned: ", bookTarget);


    // Replace all my placeholders in the Dialog
    document.getElementById("idDlgHeaderTitle").innerText = bookTarget.title;
    document.getElementById("idDlgBookInfosUpPrice").innerText = `${(bookTarget.priceCents / 100).toFixed(2)}`;
    document.getElementById("idDlgRatingLikes").innerText = bookTarget.likes;
    document.getElementById("idDlgRatingDislikes").innerText = bookTarget.dislikes;
    document.getElementById("idDlgBookInfosDownAuthor").innerText = `: ${bookTarget.authors.join(", ")}`;
    document.getElementById("idDlgBookInfosDownPublished").innerText = `: ${bookTarget.publishedAt}`;
    document.getElementById("idDlgBookInfosDownGenre").innerText = `: ${bookTarget.genres.join(", ")}`;

    // Delete previous comments & add all comments
    const ref_idDlgCommentsTableBody = document.getElementById("idDlgCommentsTableBody")
    ref_idDlgCommentsTableBody.innerHTML = "";

    const commentsList = bookTarget.comments;
    commentsList.forEach((commentObj, index) => {
        const newTr = document.createElement("tr");
        newTr.innerHTML = `
            <th>${commentObj.name}</th>
            <td>: ${commentObj.text}</td>
        `;
        ref_idDlgCommentsTableBody.appendChild(newTr);
    });

    // Highlight liked books
    if (bookTarget.liked) {
        document.querySelector("#idDlgRatingFigureLikes img").classList.add("highlighted");
    }

    activateEventsForCardDlg();
}

function activateEventsForCardDlg() {
    const closeBtn = document.getElementById("idDlgHeaderCloseBTN");
    const likeFigure = document.getElementById("idDlgRatingFigureLikes");
    const dislikeFigure = document.getElementById("idDlgRatingFigureDislikes");
    const form = document.getElementById("idDlgSendCommentForm");


    // Old listeners entfernen
    closeBtn.removeEventListener("click", handleCloseBtn);
    ref_idCardDlg.removeEventListener("keydown", handleEscapeKey);
    ref_idCardDlg.removeEventListener("click", handleBackdropClick);
    form.removeEventListener("submit", handleSubmitComment);
    likeFigure.removeEventListener("click", handleLikeClick);
    dislikeFigure.removeEventListener("click", handleDislikeClick);

    // new listener addieren
    closeBtn.addEventListener("click", handleCloseBtn);
    ref_idCardDlg.addEventListener("keydown", handleEscapeKey);
    ref_idCardDlg.addEventListener("click", handleBackdropClick);
    form.addEventListener("submit", handleSubmitComment);
    likeFigure.addEventListener("click", handleLikeClick);
    dislikeFigure.addEventListener("click", handleDislikeClick);
}
// #endregion
