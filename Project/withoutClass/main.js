import { render_bookTableBody } from "./scripts/render_bookTableBody.js";
import { LIBRARY, initLS } from "./scripts/localStorage.js";
import { openAllCards, closeAllCards } from "./scripts/render_cardDlgs_multi.js";

initLS(LIBRARY);

render_bookTableBody();


// #region Media Queries

const mq700px = window.matchMedia("(max-width: 700px)");
mq700px.addEventListener("change", (e) => {
    console.log("mediaQuery 700px triegered");
    if (e.matches) {
        openAllCards();
    } else {
        closeAllCards();
    }
});

// #endrigion


