import books from "../assets/data/books.js";

export const LIBRARY = { "LSKey": "libraryKey", "arr": books };

export function initLS(varObject) {
    localStorage.setItem(varObject.LSKey, JSON.stringify(varObject.arr)); // put the string in LS
}

export function LS_loadVar(varObject) {
    const jsonData = localStorage.getItem(varObject.LSKey); // Get the string
    return jsonData ? JSON.parse(jsonData) : [];
}