let option1 = document.getElementById('option1');
let option2 = document.getElementById('option2');
let option3 = document.getElementById('option3');
let maindialog = document.getElementById('maindialog');
let color2 = document.getElementById('color2');
let speed3 = document.getElementById('speed3');
let noclick = document.getElementById('noclick');
let isDialogShowing = false;
let game_type;
let playAs;
let speed;

let chosenOption;
let data = {};

function optionclick(option) {
    if (isDialogShowing == false) {
        isDialogShowing = true;

        option1.style.display = "none";
        option2.style.display = "none";
        option3.style.display = "none";
        maindialog.style.display = "block";
        noclick.style.display = "block";

        if (option == "1") {
            option1.style.display = "block";

            game_type = "over the board";
        }
        else if (option == "2") {
            option2.style.display = "block";

            game_type = "stockfish";
        }
        else if (option == "3") {
            option3.style.display = "block";

            game_type = "view";
        }

        chosenOption = option;
    }
}

function dialogoutput(option) {
    if (option == "1") {
        maindialog.style.display = "none";
        noclick.style.display = "none";
        isDialogShowing = false;
    }
    else if (option == "2") {
        if (chosenOption == "1") {
            playAsOption1();
        }
        else if (chosenOption == "2") {
            playAsOption2();
        }
        else if (chosenOption == "3") {
            playAsOption3();
        }
    }
}

function playAsOption1() {
    saveInformation("game_type", game_type);
    saveInformation("playAs", "white");
    saveInformation("speed", "blitz");

    finalPlay();
}

function playAsOption2() {
    saveInformation("game_type", game_type);
    saveInformation("playAs", color2.value);
    saveInformation("speed", "blitz");

    finalPlay();
}

function playAsOption3() {
    saveInformation("game_type", game_type);
    saveInformation("playAs", "white");
    saveInformation("speed", speed3.value);

    finalPlay();
}

function finalPlay() {
    localStorage.setItem("data", JSON.stringify(data));

    window.location.href = "./game.html";
}

function saveInformation(name, value) {
    data[name] = value;
}