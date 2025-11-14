import { Book } from "./scripts/classBook.js";
import { LIBRARY, LS_loadVar } from "./scripts/localStorage.js";
import { render_bookTableBody } from "./scripts/render_TBody.js";

// Generate Table
render_bookTableBody();

// Ziel: Ab 700px verschwindet die Tabelle und alle Book-Dialogs werden einmalig angezeigt.

// window ist das globale Browser-Objekt, das alles enthält:
// (DOM-API, Web-APIs, Variablen, Timer, LocalStorage, usw.)
// window.matchMedia() === matchMedia() : da auch ohne Präfix, gehört eigentlich zu window.
// Weil der Browser alles, was Property von window ist,
// automatisch global verfügbar macht (als „alias“).


// Ergebnis von window.matchMedia() : gibt mir ein Object von der class MediaQueryList zurück.
// MediaQueryList ist eine Browser-API-Klasse 

// THmqMax700px ist ein Instanz von MediaQueryList (kein Array oder Liste von mehreren Queries)
// , das den Zustand einer CSS-Media-Query in JS repräsentiert.(z. B. (max-width:700px))
// Warum "List"? Historischer Name – ursprünglich konnte es mehrere Queries enthalten

// Ich setze ein „Schwellwert“ ("Grenzwert", "Threshold") von class MediaQueryList für (max-width: 700px).
// was matchMedia() tut:
// Eigenschaft von MediaQueryList-Instanz: 
// Diese Instanz ist nicht passiv — sie beobachtet (listens) automatisch,
//      THmqMax700px wird AKTIV überwacht.(true / false)
//          wenn sich der Zustand der Media Query (Threshold: max-width: 700px) später ändert:
//              .matches --> (true / false)
//                  Current width: 
//                         ≤ 700px --> true 
//                         > 700px --> false
// Obwohl THmqMax700px.matches live ist, und beim aendern von Viewport-Width gemaess (max-width: 700px) 
// zwischen true & false wechselt, wird hier nur einmal verwendet und ab zweites mal wird "eventObject.matches" verwendet.
// Anstatt matchMedia() : nur mit window.innerWidth ≤ 700 px oder > 700
const THmqMax700px = window.matchMedia("(max-width: 700px)");
// console.log(THmqMax700px);
// console.log(THmqMax700px) --> MediaQueryList { media:"(max-width:700px)", matches:false, onchange:null }

export const bookInstances = [];

// "e" & "THmqMax700px" haben gleiche Property (.matches)
// Hier habe ich glueck, dass meine Funktion nur .matches braucht,
// und diese Property existiert in beiden "eventObject" & "THmqMax700px".
function handleTHmqMax700px(e) {
    console.log(e);
    //#####################
    // beim Initial-Call: "handleTHmqMax700px(THmqMax700px);" :
    // console.log(e) --> MediaQueryList { media:"(max-width:700px)", matches:false, onchange:null}
    // console.log(e.constructor.name) --> MediaQueryList

    // MediaQueryList-Instance ist kein "eventObject"
    //#####################
    // Nachdem Initial-Call beim change:
    // "e" wird automatisch vom Browser übergeben. (Ab hier ist "e" wirklich ein "eventObject")
    // console.log(e) --> MediaQueryListEvent { matches:true, media:"(max-width:700px)"  .....}
    // console.log(e.constructor.name) --> MediaQueryListEvent

    // MediaQueryListEvent repräsentiert ein Ereignis, das ausgelöst wird, wenn
    // sich der Zustand einer MediaQueryList ändert.
    // Achtung: MediaQueryListEvent ist eine Unterklasse von Event.
    //#####################
    // 💡 Hinweis:
    // Der Typ des Event-Objekts (z. B. "e") hängt immer vom Event-Typ
    // und der Quelle ab (z. B. Maus, Tastatur, MediaQuery, etc.).
    // ****** Alle Event-Klassen erben letztlich von der Basisklasse "Event".
    //##### Some Eventtypen und ihre zugehörigen Klassen:
    //  ----------------------------------------------------------------------------------------------------- 
    // | Eventtyp                  | Event-Klasse         | Beschreibung                                     |
    // |---------------------------|----------------------|--------------------------------------------------|
    // | "click"                   | MouseEvent           | enthält Mauskoordinaten, Buttons usw.            |
    // | "keydown"                 | KeyboardEvent        | enthält .key, .code usw.                         |
    // | "input"                   | InputEvent           | enthält Eingabetyp, Datenänderung usw.           |
    // | "change" (MediaQueryList) | MediaQueryListEvent  | enthält .matches und .media                      |
    // | "scroll"                  | Event                | Standard-Event ohne spezielle Eigenschaften      |
    //  ----------------------------------------------------------------------------------------------------- 
    //#####################

    if (e.matches) {
        // console.log("Viewport ≤ 700px: Create all book-Instances & their Dialogs und Listeners");
        //####################
        // Falls "Viewport > 700px" und ein Single Dialog bereits geöffnet ist dann 
        // plötzlich "Viewport < 700px", bleibt der geöffnete Dialog weiterhin im DOM-Dokument 
        // bestehen und ist weiterhin als Instanz in bookInstances vorhanden. Daher 
        // ist die Anzeige mehrerer Dialoge durcheinander. 
        // Deswegen leere ich erst zum Sicherheit bookInstances & "idSecDlgs"-Element vorher.
        cleanup();
        //####################
        // Für Multi-Dialogs müssen die Dialog-Elemente zuerst manuell erstellt und dann
        // ihre Event-Listener separat hinzugefügt werden. 
        // Grund: "parent.innerHTML +=" ersetzt den gesamten DOM-Inhalt intern, wodurch
        // alle bestehenden Event-Listener der bereits vorhandenen Elemente verloren gehen.

        // 1) Generate Dialogs
        LS_loadVar(LIBRARY).forEach((bookDic, index) => {
            const bookInst = new Book(bookDic, index);
            bookInstances.push(bookInst);
            bookInst.openMultiDlgs();
        });
        // 2) Give them Listeners
        bookInstances.forEach((bookInst) => {
            bookInst.setEventListenersMultiDlgs();
        });
        // console.log(bookInstances);
    } else {
        // console.log("Viewport > 700px: delete all book-Instances & Dialogs");
        cleanup();
    }
}

function cleanup() {
    bookInstances.length = 0;
    document.getElementById("idSecDlgs").innerHTML = "";
}

// direkt beim starten pruefen
// "e" & "THmqMax700px" haben gleiche Property (.matches)
handleTHmqMax700px(THmqMax700px);

// und auch auf Aenderungen reagieren
THmqMax700px.addEventListener("change", handleTHmqMax700px);
