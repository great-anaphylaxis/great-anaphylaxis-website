let parent = document.getElementById("parent");
let input = document.getElementById("text-input");
let send_icon = document.getElementById("icon-send");
let switch_icon = document.getElementById("icon-switch");

let isInputValid = false;
let messageSentByUser = true;

function createMessageRecieved(text) {
    let message = document.createElement('div');

    message.innerText = text;

    message.classList.add('message');
    message.classList.add('message-recieved');

    parent.appendChild(message);
}

function createMessageSent(text) {
    let message = document.createElement('div');

    message.innerText = text;

    message.classList.add('message');
    message.classList.add('message-sent');

    parent.appendChild(message);
}

function sendMessage(text) {
    if (messageSentByUser) {
        createMessageSent(text);
    }

    else {
        createMessageRecieved(text);
    }

    input.value = "";

    inputUpdate();

    parent.scrollTop = parent.scrollHeight;
}

function inputUpdate(e) {
    input.style.cssText = 'height:auto; padding:0';
    input.style.cssText = 'height:' + input.scrollHeight + 'px';

    if (input.value.replaceAll(/\s/g,'') == "") {
        send_icon.style.display = "none";
        isInputValid = false;
    }
    else {
        send_icon.style.display = "";
        isInputValid = true;
    }
}

input.addEventListener("input", e => {
    inputUpdate(e);
});

send_icon.addEventListener("click", e => {
    sendMessage(input.value);
});

switch_icon.addEventListener("click", e => {
    messageSentByUser = !messageSentByUser;

    if (messageSentByUser == true) {
        switch_icon.src = "./images/icon-switch.png";
    }
    else if (messageSentByUser == false) {
        switch_icon.src = "./images/icon-switch-active.png";
    }
})

input.addEventListener("keyup", e => {
    if (e.key == "Enter" && e.shiftKey == false) {
        if (isInputValid == true) {
            sendMessage(input.value);
        }
        else {
            input.value = "";
        }
    }
});

inputUpdate();