let chessboard = document.getElementById('chessboard');
let promoteDialog = document.getElementById('promoteDialog');
let stateDialog = document.getElementById('stateDialog');
let stateText = document.getElementById('state');
let stateDialogButtonList = document.getElementById('stateDialogButtonList');
let buttonbar = document.getElementById('buttonbar');
let gameType = document.getElementById('gameType');
let optknight = document.getElementById('optknight');
let optbishop = document.getElementById('optbishop');
let optrook = document.getElementById('optrook');
let optqueen = document.getElementById('optqueen');
let tileSize;
let chessboardOffset;
let chessmap = [];
let chessDots = [];
let selectedChessPiece;
let checkmap = [];
let virtualchessmap = [];
let mightBeCheckMate = true;
let virtualCheckingOfMoves = false;
let recentPawnPromote;
let recentPawnPromoteTo;
let recentCheck;
let canPiecesBeMoved = true;
let stateDialogButtons = [];
let buttonbarButtons = {};
let playAs = "white";
let turn = "white";
let perspective = "white";
let mirror = [7, 6, 5, 4, 3, 2, 1, 0];
let moves = [];
let game_type = "stockfish"; // "over the board" or "stockfish" or "view"
let stockfish;
let moveTime = 2000; // 2000
let botPromotePrefer;
let speed;
let movesArray = [];
let dataCache;

//

let pawnPastLeap = new createChessPieceInfo(undefined, 0, 0, "none", "none");
let bishops = [];
let rooks = [];
let queens = [];
let knights = [];
let pawns = [];
let kings = [];

//

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

function getFileName(path) {
    return path.replace(/^.*[\\\/]/, '');
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//

function onWindowResize() {
    tileSize = parseFloat(window.getComputedStyle(chessboard.childNodes[0]).getPropertyValue("width"));
    chessboardOffset = parseFloat(window.getComputedStyle(chessboard).getPropertyValue("margin-left"));

    updateChessPiecesPosition();
    updateChessDotsPosition();
}

function onChessPieceClick(e) {
    if (canPiecesBeMoved == true) {
        selectedChessPiece = findChessPiecePositionFromElement(e);

        hidePossibleChessMoves();

        if (game_type == "over the board") {
            if (selectedChessPiece.color == turn) {
                showPossibleChessMoves(selectedChessPiece);
            }
        }
        else if (game_type == "stockfish") {
            if (selectedChessPiece.color == turn && turn == playAs) {
                showPossibleChessMoves(selectedChessPiece);
            }
        }
        else if (game_type == "view") {

        }
    }
}

function onChessTileClick() {
    if (canPiecesBeMoved == true) {
        selectedChessPiece = undefined;
        hidePossibleChessMoves();
    }
}

function onChessDotClick(x, y) {
    if (selectedChessPiece != undefined) {
        if (selectedChessPiece.e != undefined) {
            //stockfish is moving here
            if (game_type == "stockfish" && turn != playAs) {
                if (canPiecesBeMoved == true) {
                    hidePossibleChessMoves();
                    mightBeCheckMate = true;
                    
                    let val = moveChessPieceEffect(selectedChessPiece, selectedChessPiece.x, selectedChessPiece.y, x, y);

                    if (val == undefined) {
                        moveChessPiece(selectedChessPiece.x, selectedChessPiece.y, x, y);
                        toggleTurn();
                        gameRulesEffect(turn);
                        recordMove(selectedChessPiece.x, selectedChessPiece.y, x, y);
                        botEffectIfAny();
                    }
                }
            }

            else if (game_type == "view") {
                if (canPiecesBeMoved == true) {
                    hidePossibleChessMoves();
                    mightBeCheckMate = true;
                    
                    let val = moveChessPieceEffect(selectedChessPiece, selectedChessPiece.x, selectedChessPiece.y, x, y);

                    if (val == undefined) {
                        moveChessPiece(selectedChessPiece.x, selectedChessPiece.y, x, y);
                        toggleTurn();
                        gameRulesEffect(turn);
                        recordMove(selectedChessPiece.x, selectedChessPiece.y, x, y);
                        botEffectIfAny();
                    }
                }
            }

            //player is moving here
            else {
                if (chessDots[x][y].style.display == "block") {
                    if (canPiecesBeMoved == true) {
                        hidePossibleChessMoves();
                        mightBeCheckMate = true;
                        
                        let val = moveChessPieceEffect(selectedChessPiece, selectedChessPiece.x, selectedChessPiece.y, x, y);

                        if (val == undefined) {
                            moveChessPiece(selectedChessPiece.x, selectedChessPiece.y, x, y);
                            toggleTurn();
                            gameRulesEffect(turn);
                            recordMove(selectedChessPiece.x, selectedChessPiece.y, x, y);
                            botEffectIfAny();
                        }
                    }
                }
            }
        }
    }
}

function onDragStart(e) {
    e.preventDefault();
}

//

function initializeChessboard() {
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            createChessTile(x + y);
        }
    }
}

function initializeChessDots() {
    for (let x = 0; x < 8; x++) {
        chessDots[x] = [];
        for (let y = 0; y < 8; y++) {
            chessDots[x][y] = createChessDot(x, y);
        }
    }
}

function initializeChessmap() {
    let pieces = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

    for (let x = 0; x < 8; x++) {
        chessmap[x] = [];

        for (let y = 0; y < 8; y++) {
            chessmap[x][y] = new createChessPieceInfo(undefined, x, y, "none", "none");
        }
    }

    for (let i = 0; i < 4; i++) {
        for (let x = 0; x < 8; x++) {
            if (i == 0) {
                createChessPiece(x, 0, pieces[x], "black");
            }
            else if (i == 1) {
                createChessPiece(x, 1, "pawn", "black");
            }
            else if (i == 2) {
                createChessPiece(x, 6, "pawn", "white");
            }
            else if (i == 3) {
                createChessPiece(x, 7, pieces[x], "white");
            }
        }
    }
}

function initializeChessmapWeird() {
    let pieces = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

    for (let x = 0; x < 8; x++) {
        chessmap[x] = [];

        for (let y = 0; y < 8; y++) {
            chessmap[x][y] = new createChessPieceInfo(undefined, x, y, "none", "none");
        }
    }

    for (let i = 0; i < 4; i++) {
        for (let x = 0; x < 8; x++) {
            if (i == 0) {
                createChessPiece(x, 0, "king", "black");
                chessmap[x][0].info.fitForCastling = false;
                break;
            }
            else if (i == 1) {
                break;
            }
            else if (i == 2) {
                createChessPiece(x, 6, "pawn", "white");
            }
            else if (i == 3) {
                createChessPiece(x, 7, pieces[x], "white");
            }
        }
    }
}

function initializeVirtualChessmap() {
    for (let x = 0; x < 8; x++) {
        virtualchessmap[x] = [];

        for (let y = 0; y < 8; y++) {
            virtualchessmap[x][y] = new createChessPieceInfo(undefined, x, y, "none", "none");
        }
    }
}

function initializeCheckMap() {
    for (let x = 0; x < 8; x++) {
        checkmap[x] = [];

        for (let y = 0; y < 8; y++) {
            checkmap[x][y] = 0;
        }
    }
}

function createChessTile(color) {
    let e = document.createElement('div');

    e.classList.add('chesstile');
    e.addEventListener("mouseup", () => {onChessTileClick()});

    if (color % 2 == 0) {
        e.classList.add('whitechesstile');
    }

    else {
        e.classList.add('greenchesstile');
    }

    chessboard.appendChild(e);

    return e;
}

function createChessPiece(x, y, type, color) {
    let e = document.createElement('img');

    setChessPieceX(e, x);
    setChessPieceY(e, y);

    e.classList.add('chesspieces');
    e.addEventListener("mouseup", () => {onChessPieceClick(e)});

    e.src = "./images/chess-pieces/" + color + "_" + type + ".png";

    chessboard.appendChild(e);

    chessmap[x][y] = new createChessPieceInfo(e, x, y, type, color);

    return e;
}

function createChessDot(x, y) {
    let e = document.createElement("img");

    setChessPieceX(e, x);
    setChessPieceY(e, y);

    e.classList.add('chessdot');
    e.addEventListener("mouseup", () => {onChessDotClick(x, y)});
    e.style.display = "none";

    e.src = "./images/chessdot.png";

    chessboard.appendChild(e);

    chessDots[x][y] = e;

    return e;
}

function createChessPieceInfo(e, x, y, type, color) {
    this.e = e;
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = color;
    this.info = {};
    
    if (type == "pawn") {
        this.info = {
            canLeap: true
        };
    }
    if (type == "rook") {
        this.info = {
            fitForCastling: true
        };
    }
    if (type == "king") {
        this.info = {
            fitForCastling: true
        };
    }

    return this;
}

//

function showPossibleChessMoves(chessPiece) {
    updateChessPiecesCache();

    let x = chessPiece.x;
    let y = chessPiece.y;

    let king = kings[0];

    if (king.color == chessPiece.color) {

    }
    else {
        king = kings[1];
    }

    if (chessPiece.type == "pawn") {
        if (chessPiece.color == "black") {
            // normal pawn move
            if (isChessPositionValid(x, y + 1)) {
                let p = getChessPieceFromPosition(x, y + 1);

                if (p.e == undefined) {
                    if (isKingVirtuallyExposed(chessPiece.color, chessPiece, x, y + 1) == false) {
                        showChessDot(x, y + 1);
                    }

                    // pawn leap
                    if (chessPiece.info.canLeap == true) {
                        let p = getChessPieceFromPosition(x, y + 2);
        
                        if (p.e == undefined) {

                            if (isKingVirtuallyExposed(chessPiece.color, chessPiece, x, y + 2) == false) {
                                showChessDot(x, y + 2);
                            }
                        }
                    }
                }
            }

            // take
            if (isChessPositionValid(x + 1, y + 1)) {
                let p = getChessPieceFromPosition(x + 1, y + 1);

                if (p.e != undefined && p.color == "white") {
                    if (isKingVirtuallyExposed(chessPiece.color, chessPiece, x + 1, y + 1) == false) {
                        showChessDot(x + 1, y + 1, true);
                    }
                }
            }

            // take
            if (isChessPositionValid(x - 1, y + 1)) {
                let p = getChessPieceFromPosition(x - 1, y + 1);

                if (p.e != undefined && p.color == "white") {
                    if (isKingVirtuallyExposed(chessPiece.color, chessPiece, x - 1, y + 1) == false) {
                        showChessDot(x - 1, y + 1, true);
                    }
                }
            }

            // en passant
            if (isChessPositionValid(x + 1, y)) {
                let p = getChessPieceFromPosition(x + 1, y);

                if (p.e != undefined && p.e == pawnPastLeap.e) {
                    if (isKingVirtuallyExposed(chessPiece.color, chessPiece, x + 1, y + 1) == false) {
                        showChessDot(x + 1, y + 1);
                    }
                }
            }

            // en passant
            if (isChessPositionValid(x - 1, y)) {
                let p = getChessPieceFromPosition(x - 1, y);

                if (p.e != undefined && p.e == pawnPastLeap.e) {
                    if (isKingVirtuallyExposed(chessPiece.color, chessPiece, x - 1, y + 1) == false) {
                        showChessDot(x - 1, y + 1);
                    }
                }
            }
        }
        else if (chessPiece.color == "white") {
            // normal pawn move
            if (isChessPositionValid(x, y - 1)) {
                let p = getChessPieceFromPosition(x, y - 1);

                if (p.e == undefined) {
                    if (isKingVirtuallyExposed(chessPiece.color, chessPiece, x, y - 1) == false) {
                        showChessDot(x, y - 1);
                    }

                    // pawn leap
                    if (chessPiece.info.canLeap == true) {
                        let p = getChessPieceFromPosition(x, y - 2);

                        if (p.e == undefined) {
                            if (isKingVirtuallyExposed(chessPiece.color, chessPiece, x, y - 2) == false) {
                                showChessDot(x, y - 2);
                            }
                        }
                    }
                }
            }

            // take
            if (isChessPositionValid(x + 1, y - 1)) {
                let p = getChessPieceFromPosition(x + 1, y - 1);

                if (p.e != undefined && p.color == "black") {
                    if (isKingVirtuallyExposed(chessPiece.color, chessPiece, x + 1, y - 1) == false) {
                        showChessDot(x + 1, y - 1, true);
                    }
                }
            }

            // take
            if (isChessPositionValid(x - 1, y - 1)) {
                let p = getChessPieceFromPosition(x - 1, y - 1);

                if (p.e != undefined && p.color == "black") {
                    if (isKingVirtuallyExposed(chessPiece.color, chessPiece, x - 1, y - 1) == false) {
                        showChessDot(x - 1, y - 1, true);
                    }
                }
            }

            // en passant
            if (isChessPositionValid(x + 1, y)) {
                let p = getChessPieceFromPosition(x + 1, y);

                if (p.e != undefined && p.e == pawnPastLeap.e) {
                    if (isKingVirtuallyExposed(chessPiece.color, chessPiece, x + 1, y - 1) == false) {
                        showChessDot(x + 1, y - 1);
                    }
                }
            }

            // en passant
            if (isChessPositionValid(x - 1, y)) {
                let p = getChessPieceFromPosition(x - 1, y);

                if (p.e != undefined && p.e == pawnPastLeap.e) {
                    if (isKingVirtuallyExposed(chessPiece.color, chessPiece, x - 1, y - 1) == false) {
                        showChessDot(x - 1, y - 1);
                    }
                }
            }
        }

        
    }

    if (chessPiece.type == "knight") {
        let moves = [
            [x - 1, y - 2],
            [x + 1, y - 2],
            [x - 1, y + 2],
            [x + 1, y + 2],
            [x + 2, y - 1],
            [x + 2, y + 1],
            [x - 2, y - 1],
            [x - 2, y + 1]
        ];
        let allowedColor;

        if (chessPiece.color == "black") {
            allowedColor = "white";
        }
        else if (chessPiece.color == "white") {
            allowedColor = "black";
        }

        for (let i = 0; i < moves.length; i++) {
            let pos = moves[i];

            if (isChessPositionValid(pos[0], pos[1])) {
                let p = getChessPieceFromPosition(pos[0], pos[1]);

                if (p.color == allowedColor || p.e == undefined) {
                    if (isKingVirtuallyExposed(chessPiece.color, chessPiece, pos[0], pos[1]) == false) {
                        // takes
                        if (p.color == allowedColor) {
                            showChessDot(pos[0], pos[1], true);
                        }
                        showChessDot(pos[0], pos[1]);
                    }
                }
            }
        }
    }

    if (chessPiece.type == "bishop") {
        let allowedColor;

        if (chessPiece.color == "black") {
            allowedColor = "white";
        }
        else if (chessPiece.color == "white") {
            allowedColor = "black";
        }

        for (let i = 0; i < 4; i++) {
            let dotx = x;
            let doty = y;

            if (i == 0) {
                dotx += 1;
                doty += 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty);
                        }
                        dotx += 1;
                        doty += 1;
                    }
                    else if (p.color == allowedColor) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty, true);
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 1) {
                dotx -= 1;
                doty -= 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty);
                        }
                        dotx -= 1;
                        doty -= 1;
                    }
                    else if (p.color == allowedColor) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty) == false) {
                            showChessDot(dotx, doty, true);
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 2) {
                dotx += 1;
                doty -= 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty);
                        }
                        dotx += 1;
                        doty -= 1;
                    }
                    else if (p.color == allowedColor) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty) == false) {
                            showChessDot(dotx, doty, true);
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 3) {
                dotx -= 1;
                doty += 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty) == false) {
                            showChessDot(dotx, doty);
                        }
                        dotx -= 1;
                        doty += 1;
                    }
                    else if (p.color == allowedColor) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty) == false) {
                            showChessDot(dotx, doty, true);
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
            }
            
        }
    }

    if (chessPiece.type == "rook") {
        let allowedColor;

        if (chessPiece.color == "black") {
            allowedColor = "white";
        }
        else if (chessPiece.color == "white") {
            allowedColor = "black";
        }

        for (let i = 0; i < 4; i++) {
            let dotx = x;
            let doty = y;

            if (i == 0) {
                dotx += 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty);
                        }
                        dotx += 1;
                    }
                    else if (p.color == allowedColor) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty, true);
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 1) {
                dotx -= 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty);
                        }
                        dotx -= 1;
                    }
                    else if (p.color == allowedColor) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty) == false) {
                            showChessDot(dotx, doty, true);
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 2) {
                doty -= 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty);
                        }
                        doty -= 1;
                    }
                    else if (p.color == allowedColor) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty) == false) {
                            showChessDot(dotx, doty, true);
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 3) {
                doty += 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty);
                        }
                        doty += 1;
                    }
                    else if (p.color == allowedColor) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty, true);
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
            }
            
        }
    }

    if (chessPiece.type == "queen") {
        let allowedColor;

        if (chessPiece.color == "black") {
            allowedColor = "white";
        }
        else if (chessPiece.color == "white") {
            allowedColor = "black";
        }

        for (let i = 0; i < 4; i++) {
            let dotx = x;
            let doty = y;

            if (i == 0) {
                dotx += 1;
                doty += 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty) == false) {
                            showChessDot(dotx, doty);
                        }
                        dotx += 1;
                        doty += 1;
                    }
                    else if (p.color == allowedColor) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty) == false) {
                            showChessDot(dotx, doty, true);
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 1) {
                dotx -= 1;
                doty -= 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty) == false) {
                            showChessDot(dotx, doty);
                        }
                        dotx -= 1;
                        doty -= 1;
                    }
                    else if (p.color == allowedColor) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty, true);
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 2) {
                dotx += 1;
                doty -= 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty) == false) {
                            showChessDot(dotx, doty);
                        }
                        dotx += 1;
                        doty -= 1;
                    }
                    else if (p.color == allowedColor) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty) == false) {
                            showChessDot(dotx, doty, true);
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 3) {
                dotx -= 1;
                doty += 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty) == false) {
                            showChessDot(dotx, doty);
                        }
                        dotx -= 1;
                        doty += 1;
                    }
                    else if (p.color == allowedColor) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty) == false) {
                            showChessDot(dotx, doty, true);
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            
            
        }

        for (let i = 0; i < 4; i++) {
            let dotx = x;
            let doty = y;

            if (i == 0) {
                dotx += 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty);
                        }
                        dotx += 1;
                    }
                    else if (p.color == allowedColor) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty, true);
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 1) {
                dotx -= 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty);
                        }
                        dotx -= 1;
                    }
                    else if (p.color == allowedColor) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty, true);
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 2) {
                doty -= 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty);
                        }
                        doty -= 1;
                    }
                    else if (p.color == allowedColor) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty, true);
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 3) {
                doty += 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty);
                        }
                        doty += 1;
                    }
                    else if (p.color == allowedColor) {
                        if (isKingVirtuallyExposed(chessPiece.color, chessPiece, dotx, doty)  == false) {
                            showChessDot(dotx, doty, true);
                        }
                        break;
                    }
                    else {
                        break;
                    }
                }
            }
            
        }
    }

    if (chessPiece.type == "king") {
        let moves = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
            [x - 1, y - 1],
            [x + 1, y + 1],
            [x - 1, y + 1],
            [x + 1, y - 1]
        ];
        let allowedColor;

        if (chessPiece.color == "black") {
            allowedColor = "white";
        }
        else if (chessPiece.color == "white") {
            allowedColor = "black";
        }

        for (let i = 0; i < moves.length; i++) {
            let pos = moves[i];

            if (isChessPositionValid(pos[0], pos[1])) {
                let p = getChessPieceFromPosition(pos[0], pos[1]);

                if (p.color == allowedColor || p.e == undefined) {
                    if (isKingVirtuallyExposed(chessPiece.color, chessPiece, pos[0], pos[1]) == false) {
                        // takes
                        if (p.color == allowedColor) {
                            showChessDot(pos[0], pos[1], true);
                        }
                        showChessDot(pos[0], pos[1]);
                    }
                }
            }
        }

        if (chessPiece.info.fitForCastling == true) {
            let rook1 = getChessPieceFromPosition(chessPiece.x - 4, chessPiece.y);
            let rook2 = getChessPieceFromPosition(chessPiece.x + 3, chessPiece.y);

            if (rook1.type == "rook" && rook1.info.fitForCastling == true) {
                let p1 = getChessPieceFromPosition(chessPiece.x - 1, chessPiece.y);
                let p2 = getChessPieceFromPosition(chessPiece.x - 2, chessPiece.y);
                let p3 = getChessPieceFromPosition(chessPiece.x - 3, chessPiece.y);

                if (p1.e == undefined && p2.e == undefined && p3.e == undefined) {
                    if (isKingExposed(chessPiece.color, p1) == false && isKingExposed(chessPiece.color, p2) == false) {
                        showChessDot(p2.x, p2.y);
                    }
                }
            }
            
            if (rook2.type == "rook" && rook2.info.fitForCastling == true) {
                let p1 = getChessPieceFromPosition(chessPiece.x + 1, chessPiece.y);
                let p2 = getChessPieceFromPosition(chessPiece.x + 2, chessPiece.y);

                if (p1.e == undefined && p2.e == undefined) {
                    if (isKingExposed(chessPiece.color, p1) == false && isKingExposed(chessPiece.color, p2) == false) {
                        showChessDot(p2.x, p2.y);
                    }
                }
            }
            
        }
    }
}

function hidePossibleChessMoves() {
    for (let x = 0; x < chessDots.length; x++) {
        for (let y = 0; y < chessDots.length; y++) {
            let chessDot = chessDots[x][y];

            chessDot.style.display = "none";
            chessDot.src = "./images/chessdot.png";
        }
    }
}

function showChessDot(x, y, takes = false) {
    x = clamp(x, -1, 8);

    if (x == -1 || x == 8) {
        return;
    }

    y = clamp(y, -1, 8);

    if (y == -1 || y == 8) {
        return;
    }

    mightBeCheckMate = false;
    if (virtualCheckingOfMoves == false) {
        chessDots[x][y].style.display = "block";
    }

    if (takes == true) {
        chessDots[x][y].src = "./images/chesstake.png";
    }
}

function moveChessPieceEffect(chessPiece, fromX, fromY, x, y) {
    if (chessPiece.type == "pawn") {
        if (chessPiece.color == "black") {
            if (isChessPositionValid(x, y - 1)) {
                let p = getChessPieceFromPosition(x, y - 1);

                if (p.e == pawnPastLeap.e && p.e != chessPiece.e) {
                    takeChessPiece(x, y - 1);
                }
            }

            if (fromY + 2 == y) {
                pawnPastLeap = chessPiece;
            }
            else {
                pawnPastLeap = new createChessPieceInfo(undefined, 0, 0, "none", "none");
            }

            if (y == 7) {
                if (turn != playAs && game_type == "stockfish") {
                    recentPawnPromote = new createChessPieceInfo(undefined, fromX, fromY, "none", chessPiece.color);
                    recentPawnPromoteTo = new createChessPieceInfo(undefined, x, y, "none", chessPiece.color);

                    openPromoteDialog(true);

                    return "promote";
                }

                else if (game_type == "view") {
                    recentPawnPromote = new createChessPieceInfo(undefined, fromX, fromY, "none", chessPiece.color);
                    recentPawnPromoteTo = new createChessPieceInfo(undefined, x, y, "none", chessPiece.color);

                    openPromoteDialog(true);

                    return "promote";
                }

                else {
                    openPromoteDialog();

                    recentPawnPromote = new createChessPieceInfo(undefined, fromX, fromY, "none", chessPiece.color);
                    recentPawnPromoteTo = new createChessPieceInfo(undefined, x, y, "none", chessPiece.color);

                    return "promote";
                }
            }
        }
        else if (chessPiece.color == "white") {
            if (isChessPositionValid(x, y + 1)) {
                let p = getChessPieceFromPosition(x, y + 1);

                if (p.e == pawnPastLeap.e && p.e != chessPiece.e) {
                    takeChessPiece(x, y + 1);
                }
            }
            
            if (fromY - 2 == y) {
                pawnPastLeap = chessPiece;
            }
            else {
                pawnPastLeap = new createChessPieceInfo(undefined, 0, 0, "none", "none");
            }

            if (y == 0) {
                if (turn != playAs && game_type == "stockfish") {
                    recentPawnPromote = new createChessPieceInfo(undefined, fromX, fromY, "none", chessPiece.color);
                    recentPawnPromoteTo = new createChessPieceInfo(undefined, x, y, "none", chessPiece.color);

                    openPromoteDialog(true);

                    return "promote";
                }

                else if (game_type == "view") {
                    recentPawnPromote = new createChessPieceInfo(undefined, fromX, fromY, "none", chessPiece.color);
                    recentPawnPromoteTo = new createChessPieceInfo(undefined, x, y, "none", chessPiece.color);

                    openPromoteDialog(true);

                    return "promote";
                }

                else {
                    openPromoteDialog();

                    recentPawnPromote = new createChessPieceInfo(undefined, fromX, fromY, "none", chessPiece.color);
                    recentPawnPromoteTo = new createChessPieceInfo(undefined, x, y, "none", chessPiece.color);

                    return "promote";
                }
            }
        }

        getChessPiece(chessPiece).info.canLeap = false;
    }

    if (chessPiece.type == "rook") {
        getChessPiece(chessPiece).info.fitForCastling = false;
    }

    if (chessPiece.type == "king") {
        getChessPiece(chessPiece).info.fitForCastling = false;

        if (fromX - 2 == x) {
            let p = getChessPieceFromPosition(0, y);

            moveChessPiece(p.x, y, p.x + 3, y);
        }

        if (fromX + 2 == x) {
            let p = getChessPieceFromPosition(7, y);

            moveChessPiece(p.x, y, p.x - 2, y);
        }
    }
}

function updateCheckMap(color) {
    updateChessPiecesCache();

    initializeCheckMap();

    if (color == "black") {
        enemyColor = "white";
    }
    else if (color == "white") {
        enemy = "black";
    }

    for (let i = 0; i < pawns.length; i++) {
        let chessPiece = pawns[i];
        let x = chessPiece.x;
        let y = chessPiece.y;

        if (chessPiece.color == color) {
            continue;
        }

        else if (chessPiece.color == "black") {
            if (isChessPositionValid(x + 1, y + 1)) {
                markAsCheck(x + 1, y + 1)
            }

            if (isChessPositionValid(x - 1, y + 1)) {
                markAsCheck(x - 1, y + 1);
            }
        }
        else if (chessPiece.color == "white") {
            if (isChessPositionValid(x + 1, y - 1)) {
                markAsCheck(x + 1, y - 1);
            }
            
            if (isChessPositionValid(x - 1, y - 1)) {
                markAsCheck(x - 1, y - 1);
            }
        }
    }

    for (let i = 0; i < knights.length; i++) {
        let chessPiece = knights[i];
        let x = chessPiece.x;
        let y = chessPiece.y;

        if (chessPiece.color == color) {
            continue;
        }

        let moves = [
            [x - 1, y - 2],
            [x + 1, y - 2],
            [x - 1, y + 2],
            [x + 1, y + 2],
            [x + 2, y - 1],
            [x + 2, y + 1],
            [x - 2, y - 1],
            [x - 2, y + 1]
        ];

        for (let j = 0; j < moves.length; j++) {
            let pos = moves[j];

            if (isChessPositionValid(pos[0], pos[1])) {
                markAsCheck(pos[0], pos[1]);
            }
        }
    }

    for (let i = 0; i < bishops.length; i++) {
        let chessPiece = bishops[i];
        let x = chessPiece.x;
        let y = chessPiece.y;

        if (chessPiece.color == color) {
            continue;
        }

        for (let i = 0; i < 4; i++) {
            let dotx = x;
            let doty = y;

            if (i == 0) {
                dotx += 1;
                doty += 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        markAsCheck(dotx, doty);
                        dotx += 1;
                        doty += 1;
                    }
                    else if (p.color == color) {
                        markAsCheck(dotx, doty);
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 1) {
                dotx -= 1;
                doty -= 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        markAsCheck(dotx, doty);
                        dotx -= 1;
                        doty -= 1;
                    }
                    else if (p.color == color) {
                        markAsCheck(dotx, doty);
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 2) {
                dotx += 1;
                doty -= 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        markAsCheck(dotx, doty);
                        dotx += 1;
                        doty -= 1;
                    }
                    else if (p.color == color) {
                        markAsCheck(dotx, doty);
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 3) {
                dotx -= 1;
                doty += 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        markAsCheck(dotx, doty);
                        dotx -= 1;
                        doty += 1;
                    }
                    else if (p.color == color) {
                        markAsCheck(dotx, doty);
                        break;
                    }
                    else {
                        break;
                    }
                }
            }
            
        }

    }

    for (let i = 0; i < rooks.length; i++) {
        let chessPiece = rooks[i];
        let x = chessPiece.x;
        let y = chessPiece.y;

        if (chessPiece.color == color) {
            continue;
        }
        
        for (let i = 0; i < 4; i++) {
            let dotx = x;
            let doty = y;

            if (i == 0) {
                dotx += 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        markAsCheck(dotx, doty);
                        dotx += 1;
                    }
                    else if (p.color == color) {
                        markAsCheck(dotx, doty);
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 1) {
                dotx -= 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        markAsCheck(dotx, doty);
                        dotx -= 1;
                    }
                    else if (p.color == color) {
                        markAsCheck(dotx, doty);
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 2) {
                doty -= 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        markAsCheck(dotx, doty);
                        doty -= 1;
                    }
                    else if (p.color == color) {
                        markAsCheck(dotx, doty);
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 3) {
                doty += 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        markAsCheck(dotx, doty);
                        doty += 1;
                    }
                    else if (p.color == color) {
                        markAsCheck(dotx, doty);
                        break;
                    }
                    else {
                        break;
                    }
                }
            }
            
        }
    }

    for (let i = 0; i < queens.length; i++) {
        let chessPiece = queens[i];
        let x = chessPiece.x;
        let y = chessPiece.y;

        if (chessPiece.color == color) {
            continue;
        }

        for (let i = 0; i < 4; i++) {
            let dotx = x;
            let doty = y;

            if (i == 0) {
                dotx += 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        markAsCheck(dotx, doty);
                        dotx += 1;
                    }
                    else if (p.color == color) {
                        markAsCheck(dotx, doty);
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 1) {
                dotx -= 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        markAsCheck(dotx, doty);
                        dotx -= 1;
                    }
                    else if (p.color == color) {
                        markAsCheck(dotx, doty);
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 2) {
                doty -= 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        markAsCheck(dotx, doty);
                        doty -= 1;
                    }
                    else if (p.color == color) {
                        markAsCheck(dotx, doty);
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 3) {
                doty += 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        markAsCheck(dotx, doty);
                        doty += 1;
                    }
                    else if (p.color == color) {
                        markAsCheck(dotx, doty);
                        break;
                    }
                    else {
                        break;
                    }
                }
            }
            
        }

        for (let i = 0; i < 4; i++) {
            let dotx = x;
            let doty = y;

            if (i == 0) {
                dotx += 1;
                doty += 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        markAsCheck(dotx, doty);
                        dotx += 1;
                        doty += 1;
                    }
                    else if (p.color == color) {
                        markAsCheck(dotx, doty);
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 1) {
                dotx -= 1;
                doty -= 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        markAsCheck(dotx, doty);
                        dotx -= 1;
                        doty -= 1;
                    }
                    else if (p.color == color) {
                        markAsCheck(dotx, doty);
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 2) {
                dotx += 1;
                doty -= 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        markAsCheck(dotx, doty);
                        dotx += 1;
                        doty -= 1;
                    }
                    else if (p.color == color) {
                        markAsCheck(dotx, doty);
                        break;
                    }
                    else {
                        break;
                    }
                }
            }

            else if (i == 3) {
                dotx -= 1;
                doty += 1;

                while (isChessPositionValid(dotx, doty)) {
                    let p = getChessPieceFromPosition(dotx, doty);

                    if (p.e == undefined) {
                        markAsCheck(dotx, doty);
                        dotx -= 1;
                        doty += 1;
                    }
                    else if (p.color == color) {
                        markAsCheck(dotx, doty);
                        break;
                    }
                    else {
                        break;
                    }
                }
            }
            
        }
    }
}

function updateChessPiecesCache() {
    pawns = [];
    knights = [];
    bishops = [];
    rooks = [];
    queens = [];
    kings = [];

    for (let x = 0; x < chessmap.length; x++) {
        for (let y = 0; y < chessmap.length; y++) {
            let chessPiece = chessmap[x][y];

            if (chessPiece.e != undefined) {
                if (chessPiece.type == "pawn") {
                    pawns.push(chessPiece);
                }
                else if (chessPiece.type == "knight") {
                    knights.push(chessPiece);
                } 
                else if (chessPiece.type == "bishop") {
                    bishops.push(chessPiece);
                }
                else if (chessPiece.type == "rook") {
                    rooks.push(chessPiece);
                }
                else if (chessPiece.type == "queen") {
                    queens.push(chessPiece);
                }
                else if (chessPiece.type == "king") {
                    kings.push(chessPiece);
                }
            }
        }
    }
}

function copyChessMapVirtually() {
    for (let x = 0; x < chessmap.length; x++) {
        for (let y = 0; y < chessmap.length; y++) {
            let p = chessmap[x][y];

            virtualchessmap[x][y] = new createChessPieceInfo(p.e, p.x, p.y, p.type, p.color);
            virtualchessmap[x][y].info = p.info;
        }
    }
}

function revertChessMapFromVirtuality() {
    for (let x = 0; x < chessmap.length; x++) {
        for (let y = 0; y < chessmap.length; y++) {
            let p = virtualchessmap[x][y];

            chessmap[x][y] = new createChessPieceInfo(p.e, p.x, p.y, p.type, p.color);
            chessmap[x][y].info = p.info;
        }
    }
}

function isKingExposed(color, piece) {
    updateCheckMap(color);

    let king = kings[0];

    if (piece != undefined) {
        king = piece;
    }
    else if (king.color == color) {

    }
    else {
        king = kings[1];
    }

    if (checkmap[king.x][king.y] == 0) {
        return false;
    }
    else if (checkmap[king.x][king.y] == 1) {
        return true;
    }
}

function isKingVirtuallyExposed(color, piece, x, y) {
    copyChessMapVirtually();

    let kingExposed = false;

    updateCheckMap(color);

    moveChessPieceVirtually(piece.x, piece.y, x, y);

    updateCheckMap(color);

    let king = kings[1];

    if (king.color == color) {

    }
    else {
        king = kings[0];
    }

    if (checkmap[king.x][king.y] == 0) {
        kingExposed = false;
    }
    else if (checkmap[king.x][king.y] == 1) {
        kingExposed = true;
    }

    revertChessMapFromVirtuality();

    return kingExposed;
}

function isCheckMate(color) {
    updateCheckMap(color);

    virtualCheckingOfMoves = true;

    for (let i = 0; i < pawns.length; i++) {
        let chessPiece = pawns[i];

        if (chessPiece.color == color) {
            showPossibleChessMoves(chessPiece);

            if (mightBeCheckMate == false) {
                virtualCheckingOfMoves = false;
                return false;
            }
        }
    }

    for (let i = 0; i < knights.length; i++) {
        let chessPiece = knights[i];

        if (chessPiece.color == color) {
            showPossibleChessMoves(chessPiece);

            if (mightBeCheckMate == false) {
                virtualCheckingOfMoves = false;
                return false;
            }
        }
    }

    for (let i = 0; i < bishops.length; i++) {
        let chessPiece = bishops[i];

        if (chessPiece.color == color) {
            showPossibleChessMoves(chessPiece);

            if (mightBeCheckMate == false) {
                virtualCheckingOfMoves = false;
                return false;
            }
        }
    }

    for (let i = 0; i < rooks.length; i++) {
        let chessPiece = rooks[i];

        if (chessPiece.color == color) {
            showPossibleChessMoves(chessPiece);

            if (mightBeCheckMate == false) {
                virtualCheckingOfMoves = false;
                return false;
            }
        }
    }

    for (let i = 0; i < queens.length; i++) {
        let chessPiece = queens[i];

        if (chessPiece.color == color) {
            showPossibleChessMoves(chessPiece);

            if (mightBeCheckMate == false) {
                virtualCheckingOfMoves = false;
                return false;
            }
        }
    }

    for (let i = 0; i < kings.length; i++) {
        let chessPiece = kings[i];

        if (chessPiece.color == color) {
            showPossibleChessMoves(chessPiece);

            if (mightBeCheckMate == false) {
                virtualCheckingOfMoves = false;
                return false;
            }
            else {
                virtualCheckingOfMoves = false;
                return true;
            }
        }
    }

    virtualCheckingOfMoves = false;
    return true;
}

function gameRulesEffect(color) {
    let oppositeColor;

    if (color == "black") {
        oppositeColor = "white";
    }
    else if (color == "white") {
        oppositeColor = "black";
    }

    let oppositeColorText = capitalizeFirstLetter(oppositeColor);

    updateCheckMap(color);

    let king = kings[0];

    if (king == undefined) {
        gameErrorStateDialog();
    }

    if (king.color == color) {

    }

    else {
        king = kings[1];
    }

    if (checkmap[king.x][king.y] == 1) {
        if (isCheckMate(color) == true) {
            // checkmate
            checkMateStateDialog(oppositeColorText);
            return;
        }
        else {
            // check
        }
    }
    else {
        if (isCheckMate(color) == true) {
            // stalemate
            stalemateStateDialog();
            return;
        }
    }
    
    if (pawns.length == 0) {
        if (queens.length == 0 && rooks.length == 0) {
            if (bishops.length == 1 && knights.length == 0) {
                // insufficient material
                insufficientMaterialStateDialog();
                return;
            }

            if (knights.length == 1 && bishops.length == 0) {
                // insufficient material
                insufficientMaterialStateDialog();
                return;
            }

            if (knights.length == 0 && bishops.length == 0) {
                // insufficient material
                insufficientMaterialStateDialog();
                return;
            }
        }
    }

    if (checkForThreefoldRepitition() == true) {
        // threefold repitition
        threefoldRepitionStateDialog();
        return;
    }
}

function openPromoteDialog(args) {
    if (args == true) {
        promotePiece(botPromotePrefer);
    }
    else {
        promoteDialog.style.display = "block";
        canPiecesBeMoved = false;

        optknight.src = "./images/chess-pieces/" + turn + "_knight.png";
        optbishop.src = "./images/chess-pieces/" + turn + "_bishop.png";
        optrook.src = "./images/chess-pieces/" + turn + "_rook.png";
        optqueen.src = "./images/chess-pieces/" + turn + "_queen.png";
    }
}

function promotePiece(piece) {
    promoteDialog.style.display = "none";

    if (chessmap[recentPawnPromote.x][recentPawnPromote.y].e != undefined) {
        chessmap[recentPawnPromote.x][recentPawnPromote.y].e.remove();
    }
    
    chessmap[recentPawnPromote.x][recentPawnPromote.y] = new createChessPieceInfo
    (undefined, recentPawnPromote.x, recentPawnPromote.y, "none", "none");

    canPiecesBeMoved = true;

    console.log(piece);
    createChessPiece(recentPawnPromote.x, recentPawnPromote.y, piece, recentPawnPromote.color);

    moveChessPiece(recentPawnPromote.x, recentPawnPromote.y, recentPawnPromoteTo.x, recentPawnPromoteTo.y);
    toggleTurn();
    gameRulesEffect(turn);
    recordMove(recentPawnPromote.x, recentPawnPromote.y, recentPawnPromoteTo.x, recentPawnPromoteTo.y, piece);
    botEffectIfAny();
}

function changePerspective(color) {
    perspective = color;
    onWindowResize();
}

function togglePerspective() {
    if (perspective == "white") {
        changePerspective("black");
    }
    else if (perspective == "black") {
        changePerspective("white");
    }
}

function convertForRecording() {
    let recordMapData;

    for (let x = 0; x < chessmap.length; x++) {
        for (let y = 0; y < chessmap.length; y++) {
            let p = chessmap[x][y];

            if (p.type == "pawn") {
                if (p.color == "black") {
                    recordMapData += "p";
                }
                if (p.color == "white") {
                    recordMapData += "P";
                }
            }
            else if (p.type == "knight") {
                if (p.color == "black") {
                    recordMapData += "k";
                }
                if (p.color == "white") {
                    recordMapData += "K";
                }
            }
            else if (p.type == "bishop") {
                if (p.color == "black") {
                    recordMapData += "b";
                }
                if (p.color == "white") {
                    recordMapData += "B";
                }
            }
            else if (p.type == "rook") {
                if (p.color == "black") {
                    recordMapData += "r";
                }
                if (p.color == "white") {
                    recordMapData += "R";
                }
            }
            else if (p.type == "queen") {
                if (p.color == "black") {
                    recordMapData += "q";
                }
                if (p.color == "white") {
                    recordMapData += "Q";
                }
            }
            else if (p.type == "king") {
                if (p.color == "black") {
                    recordMapData += "k";
                }
                if (p.color == "white") {
                    recordMapData += "K";
                }
            }
            else {
                recordMapData += " ";
            }
        }
    }

    movesArray.push(recordMapData);
}

function checkForThreefoldRepitition() {
    let positions = {};

    for (let i = 0; i < movesArray.length; i++) {
        let pos = movesArray[i];

        if (positions[pos] == undefined) {
            positions[pos] = 1;
        }
        else {
            positions[pos] += 1;
        }
    }

    for (let i in positions) {
        if (positions[i] >= 3) {
            return true;
        }
    }
    return false;
}

//

function updateChessPiecesPosition() {
    for (let x = 0; x < chessmap.length; x++) {
        for (let y = 0; y < chessmap.length; y++) {
            let chessPiece = chessmap[x][y];

            if (chessPiece.e == undefined) {
                continue;
            }

            else {
                setChessPieceX(chessPiece.e, chessPiece.x);
                setChessPieceY(chessPiece.e, chessPiece.y);
            }
        }
    }
}

function updateChessDotsPosition() {
    for (let x = 0; x < chessDots.length; x++) {
        for (let y = 0; y < chessDots.length; y++) {
            let chessDot = chessDots[x][y];

            if (chessDot == undefined) {
                continue;
            }

            else {
                setChessPieceX(chessDot, x);
                setChessPieceY(chessDot, y);
            }
        }
    }
}

function setChessPieceX(e, x) {
    if (perspective == "white") {
        e.style.left = chessboardOffset + (x * tileSize) + "px";
    }

    else if (perspective == "black") {
        e.style.left = chessboardOffset + (mirror[x] * tileSize) + "px";
    }
}

function setChessPieceY(e, y) {
    if (perspective == "white") {
        e.style.top = (y * tileSize) + "px";
    }
    
    else if (perspective == "black") {
        e.style.top = (mirror[y] * tileSize) + "px";
    }
}

function moveChessPiece(fromX, fromY, toX, toY) {
    let fromChessPiece = chessmap[fromX][fromY];
    let toChessPiece = chessmap[toX][toY];

    if (toChessPiece.e != undefined) {
        toChessPiece.e.remove();
    }

    chessmap[toX][toY] = new createChessPieceInfo(fromChessPiece.e, toChessPiece.x, toChessPiece.y, fromChessPiece.type, fromChessPiece.color);
    chessmap[toX][toY].info = fromChessPiece.info;

    chessmap[fromX][fromY] = new createChessPieceInfo(undefined, fromChessPiece.x, fromChessPiece.y, "none", "none");

    updateChessPiecesPosition();
}

function moveChessPieceVirtually(fromX, fromY, toX, toY) {
    let fromChessPiece = chessmap[fromX][fromY];
    let toChessPiece = chessmap[toX][toY];

    chessmap[toX][toY] = new createChessPieceInfo(fromChessPiece.e, toChessPiece.x, toChessPiece.y, fromChessPiece.type, fromChessPiece.color);
    chessmap[toX][toY].info = fromChessPiece.info;

    chessmap[fromX][fromY] = new createChessPieceInfo(undefined, fromChessPiece.x, fromChessPiece.y, "none", "none");
}

function findChessPiecePositionFromElement(e) {
    for (let x = 0; x < chessmap.length; x++) {
        for (let y = 0; y < chessmap.length; y++) {
            let chessPiece = chessmap[x][y];

            if (chessPiece.e == e) {
                return chessPiece;
            }
        }
    }

    return undefined;
}

function getChessPiece(chessPiece) {
    return chessmap[chessPiece.x][chessPiece.y];
}

function isChessPositionValid(x, y) {
    x = clamp(x, -1, 8);

    if (x == -1 || x == 8) {
        return false;
    }

    y = clamp(y, -1, 8);

    if (y == -1 || y == 8) {
        return false;
    }

    return true;
}

function getChessPieceFromPosition(x, y) {
    return chessmap[x][y];
}

function takeChessPiece(x, y) {
    let chessPiece = chessmap[x][y];

    if (chessPiece.e != undefined) {
        chessPiece.e.remove();
    }
    
    chessmap[x][y] = new createChessPieceInfo(undefined, x, y, "none", "none");
}

function markAsCheck(x, y) {
    checkmap[x][y] = 1;
}

function toggleTurn() {
    if (turn == "white") {
        turn = "black";
    }
    else if (turn == "black") {
        turn = "white";
    }
}

//

function restart() {
    localStorage.setItem("data", dataCache);
    window.location.reload();
}

function stateDialogButton(text, callback) {
    this.text = text;
    this.callback = callback;

    return this;
}

function createStateDialogButton(sdb) {
    let e = document.createElement('div');

    e.classList.add("dialogbutton");
    e.addEventListener("click", sdb.callback);
    e.innerText = sdb.text;

    stateDialogButtonList.appendChild(e);

    stateDialogButtons.push(e);

    return e;
}

function openStateDialog(text, buttons) {
    closeStateDialog();

    stateDialog.style.display = "block";
    stateText.innerText = text;

    canPiecesBeMoved = false;

    if (Array.isArray(buttons) == true) {
        for (let i = 0; i < buttons.length; i++) {
            createStateDialogButton(buttons[i]);
        }
    }
    else {
        createStateDialogButton(buttons);
    }
}

function closeStateDialog() {
    stateDialog.style.display = "none";

    for (let i = 0; i < stateDialogButtons.length; i++) {
        stateDialogButtons[i].remove();
    }
}

function checkMateStateDialog(colorWinner) {
    openStateDialog("Checkmate! " + colorWinner + " wins!", [
        new stateDialogButton("Restart", ()=>{restart();}),
        new stateDialogButton("OK", ()=>{
            closeStateDialog();
            finishGameButtonbar();
        })
    ]);
}

function stalemateStateDialog() {
    openStateDialog("Stalemate! It's a draw", [
        new stateDialogButton("Restart", ()=>{restart();}),
        new stateDialogButton("OK", ()=>{
            closeStateDialog();
            finishGameButtonbar();
        })
    ]);
}

function insufficientMaterialStateDialog() {
    openStateDialog("Insuficcient material! It's a draw", [
        new stateDialogButton("Restart", ()=>{restart();}),
        new stateDialogButton("OK", ()=>{
            closeStateDialog();
            finishGameButtonbar();
        })
    ]);
}

function threefoldRepitionStateDialog() {
    openStateDialog("Threefold repetition! It's a draw", [
        new stateDialogButton("Restart", ()=>{restart();}),
        new stateDialogButton("OK", ()=>{
            closeStateDialog();
            finishGameButtonbar();
        })
    ]);
}

function resignStateDialog() {

    let sdb = new stateDialogButton("Resign",
        ()=>{
            openStateDialog("Do you want to resign?", [
                new stateDialogButton("Yes", ()=>{
                    openStateDialog(capitalizeFirstLetter(turn) + " lost by resignation", [
                        new stateDialogButton("Restart", ()=>{restart();}),
                        new stateDialogButton("OK", ()=>{closeStateDialog();})
                    ]);
                    finishGameButtonbar();
                }),
                new stateDialogButton("Cancel", ()=>{closeStateDialog();})
            ]);
        }
    );

    return sdb;
}

function gameErrorStateDialog() {
    openStateDialog("Yup, of course this would happen. The game broke:)", [
        new stateDialogButton("Restart", ()=>{restart();}),
        new stateDialogButton("OK", ()=>{
            closeStateDialog();
            finishGameButtonbar();
        })
    ]);
}

function goBackButton() {

    let sdb = new stateDialogButton("Back Home",
        ()=>{
            openStateDialog("The game will be lost. Are you sure?", [
                new stateDialogButton("Yes", ()=>{window.location.href = "./chess.html"}),
                new stateDialogButton("Cancel", ()=>{closeStateDialog();})
            ]);
        }
    );

    return sdb;
}

function createButtonbarButton(sdb) {
    let e = document.createElement('div');

    e.classList.add("button");
    e.addEventListener("click", sdb.callback);
    e.innerText = sdb.text;

    buttonbar.appendChild(e);

    buttonbarButtons[sdb.text] = e;

    return e;
}

function initializeButtonbar() {
    createButtonbarButton(goBackButton());
    if (game_type != "view") {
        createButtonbarButton(resignStateDialog());
    }
    createButtonbarButton(new stateDialogButton("Flip board", ()=>{togglePerspective();}));

    if (game_type == "over the board") {
        gameType.innerText = "Over the Board";
    }
    else if (game_type == "stockfish") {
        gameType.innerText = "Chess Game";
    }

    else if (game_type == "view") {
        gameType.innerText = capitalizeFirstLetter(speed);
    }
}

function clearButtonbar() {
    for (let i in buttonbarButtons) {
        buttonbarButtons[i].remove();
    }
}

function finishGameButtonbar() {
    clearButtonbar();
    createButtonbarButton(goBackButton());
    createButtonbarButton(new stateDialogButton("Restart", ()=>{restart()}));
    createButtonbarButton(new stateDialogButton("Flip board", ()=>{togglePerspective();}));
}

//

function botEffectIfAny() {
    if ((game_type == "stockfish" && turn != playAs) || game_type == "view") {
        let movesString = moves.join(" ");

        setMoveTimeSpeed();

        stockfish.postMessage("position startpos move " + movesString);
        stockfish.postMessage("go movetime " + moveTime);
    }
}

function botMovement(e) {
    translateBotMove(e.data);
}

function convertCoordinateToUCIFriendlyFormat(fromX, fromY, x, y, piece = undefined) {
    let col = ["a", "b", "c", "d", "e", "f", "g", "h"];
    let str;

    str = "" + col[fromX] + (mirror[fromY] + 1) + col[x] + (mirror[y] + 1);

    if (piece != undefined) {
        str += piece[0];
    }

    console.log(str, piece);
    return str;
}

function recordMove(fromX, fromY, x, y, piece = undefined) {
    convertForRecording();
    moves.push(convertCoordinateToUCIFriendlyFormat(fromX, fromY, x, y, piece));
}

function translateBotMove(data) {
    data = data.split(" ");
    
    if (data[0] == "bestmove") {
        if (data[1] == "(none)") {
            return;
        }

        let botMove = data[1];
        let col = {
            "a": 0,
            "b": 1,
            "c": 2,
            "d": 3,
            "e": 4,
            "f": 5,
            "g": 6,
            "h": 7
        };
        let botMoveRaw = botMove.split("");
        let fromX = parseInt(col[botMoveRaw[0]]);
        let fromY = mirror[parseInt(botMoveRaw[1]) - 1];
        let x = parseInt(col[botMoveRaw[2]]);
        let y = mirror[parseInt(botMoveRaw[3]) - 1];
        let p;

        if (botMoveRaw[4] != undefined) {
            p = botMoveRaw[4];

            if (p == "k") {
                botPromotePrefer = "knight";
            }
            else if (p == "b") {
                botPromotePrefer = "bishop";
            }
            else if (p == "r") {
                botPromotePrefer = "rook";
            }
            else if (p == "q") {
                botPromotePrefer = "queen";
            }
        }


        selectedChessPiece = getChessPieceFromPosition(fromX, fromY);
        onChessDotClick(x, y);
    }

    else {
        return;
    }
}

function startBotIfAny() {
    if (game_type == "view" || (game_type == "stockfish" && playAs == "black")) {
        let temp = moveTime;

        moveTime = 500;
        botEffectIfAny();

        moveTime = temp;
    }
}

function setMoveTimeSpeed() {
    if (speed == "ultrabullet") {
        moveTime = random(100, 150);
    }
    else if (speed == "hyperbullet") {
        moveTime = random(200, 450);
    }
    else if (speed == "bullet") {
        moveTime = random(450, 800);
    }
    else if (speed == "blitz") {
        moveTime = random(800, 2000);
    }
    else if (speed == "rapid") {
        moveTime = random(2000, 5000);
    }
}

//

function parseInitialData() {
    if (localStorage.getItem("data") == "{}") {
        window.location.href = "./chess.html"
    }

    let data = JSON.parse(localStorage.getItem("data")) || {
        game_type: "stockfish",
        playAs: "white",
        speed: "blitz"
    };

    dataCache = JSON.stringify(data);

    game_type = data["game_type"];
    playAs = data["playAs"];
    speed = data["speed"];

    localStorage.setItem("data", "{}");
}

/////

function start() {
    parseInitialData();

    initializeChessboard();
    initializeChessmap();
    //initializeChessmapWeird();
    initializeChessDots();
    initializeCheckMap();
    initializeVirtualChessmap();
    initializeButtonbar();

    window.addEventListener("resize", () => {
        onWindowResize();
        setTimeout(() => onWindowResize, 500);
    });
    onWindowResize();
    document.addEventListener("dragstart", onDragStart);

    stockfish = new Worker("stockfish.js");
    stockfish.onmessage = (e) => {botMovement(e)};

    startBotIfAny();

    if (playAs == "black") {
        togglePerspective();
    }
}

start(); 