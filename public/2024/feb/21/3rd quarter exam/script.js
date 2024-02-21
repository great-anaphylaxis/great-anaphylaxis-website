

class Win {
    constructor(win, app = 1, barapp) {
        this.win = win;
        this.topbar = this.win.getElementsByClassName("topbar")[0];
        this.app = app;
        this.barapp = barapp;
        this.closebutton = this.topbar.getElementsByClassName("close")[0];
        
        this.closeFunction = () => {}

        this.open = function() {
            this.win.style.top = "50%";
            this.win.style.left = "50%";
            this.win.style.transform = "translate(-50%, -50%)";
            this.win.style.visibility = "visible";
            this.win.style.animation = "grow 0.1s 1";
            this.barapp.style.visibility = "visible";
        }

        this.close = function() {
            this.win.style.animation = "0.1s ease 0s 1 normal forwards running shrink";
            this.barapp.style.visibility = "hidden";

            this.closeFunction();
        }

        this.topbar.addEventListener("mousedown", e => {
            if (selectedWin == undefined) {
                selectedWin = this;

                pastX = e.pageX;
                pastY = e.pageY;

                for (let i = 0; i < iframes.length; i++) {
                    iframes[i].style.pointerEvents = "none";
                }
            }
        });

        if (app != 1) {
            this.app.addEventListener("dblclick", e => {
                this.open();
            });
        }

        this.closebutton.addEventListener("click", e => {
            this.close();
        });

        
    }
}




let mainwin = new Win(
    document.getElementById("mainwin"),
    document.getElementById("mainwinapp"),
    document.getElementById("mainwinbarapp")
);

let googlechrome = new Win(
    document.getElementById("chrome"),
    document.getElementById("chromeapp"),
    document.getElementById("chromebarapp")
);

let dialog = new Win(
    document.getElementById("dialog"),
    1,
    document.getElementById("dialogbarapp")
);

let iframes = document.querySelectorAll("iframe");
googlechrome.closeFunction = () => {
    googlechrome.win.querySelector("iframe").src = googlechrome.win.querySelector("iframe").src;
}

let startmenu = document.getElementById("startmenu");
let bottombar = document.getElementById("bottombar");
let timecounter = document.getElementById("timecounter");

document.getElementById("ok").addEventListener("click", e => {
    dialog.ok();
})

dialog.message = document.getElementById("message");

document.getElementById("startbutton").addEventListener("click", e => {
    if (window.getComputedStyle(startmenu).getPropertyValue("visibility") == "hidden") {
        startmenu.style.visibility = "visible";
        startmenu.style.animation = "growup 0.1s 1";
    }

    else {
        startmenu.style.animation = "0.1s ease 0s 1 normal forwards running shrinkup";
    }
});

document.getElementById("shutdown").addEventListener("click", e => {
    createDialog("Are you sure?", () => {

        masterinfo("Shutting down...", () => {        
            document.body.classList.add("bare");
            document.body.innerHTML = "Press CTRL+R to start again";
        });
    });
});

document.getElementById("main-form").addEventListener("submit", e => {
    e.preventDefault();
    createDialog("Form successfully submitted!", () => {
        dialog.close();
        mainwin.close();
        document.getElementById("main-form").reset();
    });
})






let selectedWin = undefined;

let pastX = 0;
let pastY = 0;

function windowFollowMouse(e) {
    if (selectedWin != undefined) {
        let x = parseFloat(window.getComputedStyle(selectedWin.win).getPropertyValue("left"));
        let y = parseFloat(window.getComputedStyle(selectedWin.win).getPropertyValue("top"));

        let deltaX = e.pageX - pastX;
        let deltaY = e.pageY - pastY;

        selectedWin.win.style.top = y + deltaY + "px";
        selectedWin.win.style.left = x + deltaX + "px";

        pastX = e.pageX;
        pastY = e.pageY;
    }
}

function createDialog(message, okFunction = () => {}) {
    dialog.message.innerText = message;
    dialog.open();
    dialog.ok = okFunction;
}

function masterinfo(message, exec = () => {}) {
    let m = document.getElementById("masterinfo");
    let b = document.getElementById("blocker");

    document.getElementById("masterinfomessage").innerText = message;
    
    b.style.visibility = "visible";
    m.style.animation = "2s ease 0s 1 normal forwards running fadein"

    setTimeout(() => {
        exec();

        m.style.animation = "1s ease 0s 1 normal forwards running fadeout";
        b.style.visibility = "hidden";
    }, 4000);
}








window.addEventListener("mousemove", e => {
    windowFollowMouse(e);
});

window.addEventListener("mouseup", e => {
    selectedWin = undefined;

    for (let i = 0; i < iframes.length; i++) {
        iframes[i].style.pointerEvents = "auto";
    }
});

window.addEventListener("mousedown", e => {
    if (e.target != startmenu && !startmenu.contains(e.target) && !bottombar.contains(e.target)) {
        startmenu.style.animation = "0.1s ease 0s 1 normal forwards running shrinkup";
    }
});

setInterval(() => {
    let date = new Date();
    let s = date.toLocaleTimeString();
    let rs = s.split(":");
    let lastrs = rs[2].substring(2);
    rs.pop();
    let time = rs.join(":") + lastrs;

    timecounter.innerText = time;
})

masterinfo("Welcome");