import { books } from "../assets/data/books.js";

// varObject
export const LIBRARY = { "LSKey": "libraryKey", "arr": books };

// Init one time
function initLS(varObject) {
    if (!localStorage.getItem(varObject.LSKey)) {
        localStorage.setItem(varObject.LSKey, JSON.stringify(varObject.arr));
    }
}

export function LS_loadVar(varObject) {
    const jsonData = localStorage.getItem(varObject.LSKey);
    return jsonData ? JSON.parse(jsonData) : [];
}

initLS(LIBRARY);