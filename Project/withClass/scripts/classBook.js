import { LIBRARY, LS_loadVar } from "./localStorage.js";

export class Book {
    // #region Attributes
    idx;
    idDlg;
    idBook;
    title;
    authors;        // Array
    genres;         // Array
    priceCents;
    likes;
    dislikes;
    liked;          // boolean
    publishedAt;
    summary;
    coverUrl;
    rating;
    comments;       // Array
    // #endregion

    constructor(bookObj, index) { // LSbooksList = { bookObj, bookObj, bookObj, ...}
        this.idx = index;
        this.idDlg = `idDlg${this.idx}`
        this.idBook = bookObj.id;
        this.title = bookObj.title;
        this.authors = bookObj.authors;             // Array
        this.genres = bookObj.genres;               // Array
        this.priceCents = bookObj.priceCents;
        this.likes = bookObj.likes;
        this.dislikes = bookObj.dislikes;
        this.liked = bookObj.liked;                 // boolean
        this.publishedAt = bookObj.publishedAt;
        this.summary = bookObj.summary;
        this.coverUrl = bookObj.coverUrl;
        this.rating = this.calRating(this);
        this.comments = Array.isArray(bookObj.comments) ? bookObj.comments : []; // Array

        // Create HTML-Dialog als String-Template & add it to the idSecDlgs
        this.renderDialog();
    }

    // #region Methods
    renderDialog() {
        // Achtung: innerHTML += zerstört bestehende DOM-Knoten → Listener neu binden!
        document.getElementById("idSecDlgs").innerHTML += `
            <dialog id="${this.idDlg}">
                <div class="cDlgHeader">
                    <strong id="idDlgHeaderTitle${this.idx}">${this.title}</strong>
                    <button id="idDlgHeaderCloseBTN${this.idx}">
                        <img src="./assets/images/icons/close_btn.svg" alt="close_btn.svg">
                    </button>
                </div>

                <div class="cDlgBookImg">
                    <img src=${this.coverUrl} alt="yellow-book.svg">
                </div>

                <div class="cDlgBookInfos">
                    <div class="cDlgBookInfosUp">
                        <strong><span id="idDlgBookInfosUpPrice${this.idx}">${(this.priceCents / 100).toFixed(2)}</span>&#8364;</strong>
                        <div class="cDlgRatingsEmojis">
                            <figure id="idDlgRatingFigureLikes${this.idx}">
                                <img src="./assets/images/icons/heart.svg" alt="heart.svg" ${this.liked ? ' class="highlighted"' : ''}>
                                <figcaption id="idDlgRatingLikes${this.idx}">${this.likes}</figcaption>
                            </figure>
                            <figure id="idDlgRatingFigureDislikes${this.idx}">
                                <img src="./assets/images/icons/thumbs-down.svg" alt="thumbs-down.svg">
                                <figcaption id="idDlgRatingDislikes${this.idx}">${this.dislikes}</figcaption>
                            </figure>
                        </div>
                    </div>
                    <div class="cDlgBookInfosDown">
                        <table>
                            <tr>
                                <th>Authur</th>
                                <td id="idDlgBookInfosDownAuthor${this.idx}">: ${this.authors.join(", ")}</td>
                            </tr>
                            <tr>
                                <th>ErscheinungsJahr</th>
                                <td id="idDlgBookInfosDownPublished${this.idx}">: ${this.publishedAt}</td>
                            </tr>
                            <tr>
                                <th>Genre</th>
                                <td id="idDlgBookInfosDownGenre${this.idx}">: ${this.genres.join(", ")}</td>
                            </tr>
                        </table>
                    </div>

                </div>

                <div class="cDlgCommentsArea">
                    <strong>Kommentare:</strong>
                    <div class="cWrapperDiv">
                        <!-- Einen Wrapper-Container verwenden um ganzes Table scrollbar zu machen -->
                        <table>
                            <tbody id="idDlgCommentsTableBody${this.idx}">
                                ${this.renderHtmlComments()}
                            </tbody>
                        </table>
                    </div>
                </div>

                <form id="idDlgSendCommentForm${this.idx}" class="cDlgSendCommentForm" action="">
                    <div>
                        <div>
                            <input id="idDlgInputName${this.idx}" class="cDlgInputName" type="text"
                                placeholder="name" required>
                            <input id="idDlgInputRating${this.idx}" class="cDlgInputRating" type="number" min="0"
                                max="5" placeholder="rate it" required>
                        </div>
                        <textarea id="idDlgInputComment${this.idx}" placeholder="comment ..."
                            required></textarea>
                    </div>
                    <button id="idDlgSubmitCommentBtn${this.idx}" type="submit"><img
                            src="./assets/images/icons/paper-plane.svg" alt="paper-plane.svg"></button>
                </form>

            </dialog>
        `;
    }

    renderHtmlComments() {
        const commentsList = this.comments;

        if (!Array.isArray(commentsList) || commentsList.length === 0) return "Still no comment";

        let commentsHtmlTrs = "";
        commentsList.forEach(commentObj => {
            commentsHtmlTrs += `
            <tr>
            <th>${commentObj.name}</th>
            <td>: ${commentObj.text}</td>
            </tr>
            `;
        });
        return commentsHtmlTrs;
    }

    calRating() {
        const commentsList = this.comments;
        if (!Array.isArray(commentsList) || commentsList.length === 0) return 0;

        let sum = 0;
        commentsList.forEach(commentObj => sum += Number(commentObj.userRating));
        return (sum / commentsList.length).toFixed(1);
    }

    //###########################################################################

    // #region Single Dialog
    openSingleDlg() {
        // console.log(`Openning Single Dialog... ${this.idDlg}`);

        const refDlg = document.getElementById(this.idDlg)
        refDlg.classList.add("cSingle");
        // refDlg.classList.add("opened");
        refDlg.showModal();

        this.setEventListenersSingleDlg();
    }

    closeSingleDlg() {
        // console.log(`Closing Single Dialog... ${this.idDlg}`);
        const refDlg = document.getElementById(this.idDlg)
        refDlg.classList.remove("cSingle");
        // refDlg.classList.remove("opened");
        refDlg.close();
        refDlg.remove();
    }

    setEventListenersSingleDlg() {
        const refDlg = document.getElementById(this.idDlg);
        const refCloseBtn = document.getElementById(`idDlgHeaderCloseBTN${this.idx}`);
        const refLikesFig = document.getElementById(`idDlgRatingFigureLikes${this.idx}`);
        const refDislikesFig = document.getElementById(`idDlgRatingFigureDislikes${this.idx}`);
        const refForm = document.getElementById(`idDlgSendCommentForm${this.idx}`);

        /////////////// Delete the old Listeners
        //// removeEventListener() removes exact the same listener, if:
        /////   A) The Target-Element is same
        /////   B) The Event-Type is same
        /////   C) The Callback-Function is same (NOT something else)

        // callback.bind() != callback , these removeEventListener do NOT work!

        // refDlg.removeEventListener("keydown", handleEscapeKey);
        // refDlg.removeEventListener("click", handleBackdropClick);

        // refCloseBtn.removeEventListener("click", handleCloseBtn);
        // refLikesFig.removeEventListener("click", handleLikeClick);
        // refDislikesFig.removeEventListener("click", handleDislikeClick);
        // refForm.removeEventListener("submit", handleSubmitComment);

        /////////////// Now add new listeners
        refDlg.addEventListener("keydown", handleEscapeKey.bind(this));
        refDlg.addEventListener("click", handleBackdropClick.bind(this));

        refCloseBtn.addEventListener("click", handleCloseBtn.bind(this));
        refLikesFig.addEventListener("click", handleLikeClick.bind(this));
        refDislikesFig.addEventListener("click", handleDislikeClick.bind(this));
        refForm.addEventListener("submit", handleSubmitComment.bind(this));
    }
    // #endregion Single Dialog

    //----------------------------------------------------------------------------

    // #region Multi Dialogs
    openMultiDlgs() {
        // console.log(`Openning Multi Dialogs... ${this.idDlg}`);

        document.getElementById("idSecDlgs").classList.add("cSecDlgsMulti");

        const refDlg = document.getElementById(this.idDlg)
        refDlg.classList.add("cMulti");
        refDlg.show();

        // this.setEventListenersMultiDlgs();
    }

    closeSingleDlgFromMulti() {
        // console.log(`Closing a Dialog from Multi Dialogs... ${this.idDlg}`);

        const refDlg = document.getElementById(this.idDlg)
        refDlg.classList.remove("cMulti");
        refDlg.close();
        // refDlg.remove();
    }

    setEventListenersMultiDlgs() {
        // console.log(`set MultiDlgs listeners for ${this.idDlg}`);

        const refDlg = document.getElementById(this.idDlg);
        const refCloseBtn = document.getElementById(`idDlgHeaderCloseBTN${this.idx}`);
        const refLikesFig = document.getElementById(`idDlgRatingFigureLikes${this.idx}`);
        const refDislikesFig = document.getElementById(`idDlgRatingFigureDislikes${this.idx}`);
        const refForm = document.getElementById(`idDlgSendCommentForm${this.idx}`);

        /////////////// Delete the old Listeners
        //// removeEventListener() removes exact the same listener, if:
        /////   A) The Target-Element is same
        /////   B) The Event-Type is same
        /////   C) The Callback-Function is same (NOT something else)

        // callback.bind() != callback , these removeEventListener do NOT work!

        // refDlg.removeEventListener("keydown", handleEscapeKey);
        // refDlg.removeEventListener("click", handleBackdropClick);

        // refCloseBtn.removeEventListener("click", handleCloseBtn);
        // refLikesFig.removeEventListener("click", handleLikeClick);
        // refDislikesFig.removeEventListener("click", handleDislikeClick);
        // refForm.removeEventListener("submit", handleSubmitComment);

        /////////////// Now add new listeners
        // refDlg.addEventListener("keydown", handleEscapeKey.bind(this));
        // refDlg.addEventListener("click", handleBackdropClick.bind(this));

        refCloseBtn.addEventListener("click", handleCloseBtn.bind(this));
        refLikesFig.addEventListener("click", handleLikeClick.bind(this));
        refDislikesFig.addEventListener("click", handleDislikeClick.bind(this));
        refForm.addEventListener("submit", handleSubmitComment.bind(this));

    }
    // #endregion Multi Dialogs
    // #endregion Methods
}
//#############################################################################################################################

// #region EvenT-Listeners Handlers
function handleEscapeKey(e) {
    if (e.key === "Escape") {
        e.preventDefault();
        this.closeSingleDlg();
    }
}

function handleBackdropClick(e) {
    if (e.target == document.getElementById(this.idDlg)) {
        this.closeSingleDlg();
    }
}

function handleCloseBtn() {
    this.closeSingleDlg();
}

function handleLikeClick() {
    // 1) Update bookInst.likes
    if (this.liked === false) this.likes += 1;
    if (this.liked === true && this.likes > 0) this.likes -= 1;
    this.liked = !this.liked;

    // 2) Put it in LS LIBRARY (comments) 
    const LSbooksList = LS_loadVar(LIBRARY);
    LSbooksList[this.idx].likes = this.likes; // update LSbooksList
    localStorage.setItem(LIBRARY.LSKey, JSON.stringify(LSbooksList));

    // 3) Put it in DOM-Element
    document.getElementById(`idDlgRatingLikes${this.idx}`).textContent = this.likes;
    document.querySelector(`#idDlgRatingFigureLikes${this.idx} img`).classList.toggle("highlighted");
    //     this.closeSingleDlg();
    //     this.renderDialog();
    //     this.openSingleDlg();
}

function handleDislikeClick() {
    // 1) Update bookInst.likes & dislikes
    if (this.liked === false) this.dislikes += 1;
    if (this.liked === true && this.likes > 0) {
        this.likes -= 1;
        if (this.dislikes > 0) this.dislikes -= 1;
    };
    this.liked = !this.liked;

    // 2) Put them in LS LIBRARY (comments) 
    const LSbooksList = LS_loadVar(LIBRARY);
    LSbooksList[this.idx].likes = this.likes; // update LSbooksList
    LSbooksList[this.idx].dislikes = this.dislikes; // update LSbooksList
    localStorage.setItem(LIBRARY.LSKey, JSON.stringify(LSbooksList));

    // 3) Put them in DOM-Elements
    document.getElementById(`idDlgRatingLikes${this.idx}`).textContent = this.likes;
    document.querySelector(`#idDlgRatingFigureLikes${this.idx} img`).classList.toggle("highlighted");

    document.getElementById(`idDlgRatingDislikes${this.idx}`).textContent = this.dislikes;

    //     this.closeSingleDlg();
    //     this.renderDialog();
    //     this.openSingleDlg();
}

function handleSubmitComment(e) {
    e.preventDefault();
    // 1) Catch the user Inputs
    const newComment = {
        "id": `cmt-${document.getElementById(`idDlgInputName${this.idx}`).value.trim()}`,
        "name": document.getElementById(`idDlgInputName${this.idx}`).value.trim().toUpperCase(),
        "userRating": document.getElementById(`idDlgInputRating${this.idx}`).value.trim(),
        "text": document.getElementById(`idDlgInputComment${this.idx}`).value.trim(),
        "createdAt": new Date().toLocaleString(),
    };

    // 2) Put them in LS LIBRARY (comments)
    const LSbooksList = LS_loadVar(LIBRARY);
    LSbooksList[this.idx].comments.splice(0, 0, newComment); // update LSbooksList
    localStorage.setItem(LIBRARY.LSKey, JSON.stringify(LSbooksList));

    // 3) Fetch from LS & put them in BookInstance.comments
    this.comments = LS_loadVar(LIBRARY)[this.idx].comments;

    // 4) Put them TRs (comments) in idDlgCommentsTableBody
    document.getElementById(`idDlgCommentsTableBody${this.idx}`).innerHTML = this.renderHtmlComments();

    e.target.reset();

    //     this.closeSingleDlg();
    //     this.renderDialog();
    //     this.openSingleDlg();
}

// #endregion EvenT-Listeners Handlers