function dlgEmptyTemplate() {

    return `
            <dialog id="idCardDlg" class="cCardDlgsMulti">
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