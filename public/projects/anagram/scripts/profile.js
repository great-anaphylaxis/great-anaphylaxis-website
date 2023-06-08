var ROOT = localStorage.getItem('ROOT');

let username;

// the first function is called
function start() {
    // set the username variable
    username = getUsername();

    // change the title of the web page
    document.title = username + " - Anagram";

    // set the profile image to its profile image
    document.getElementById("user_image").src = getProfileImage();

    // set the username
    document.getElementById("username").appendChild(document.createTextNode(username));

    // set the bio
    setBio();
}

// function where it returns your username
function getUsername() {
    // the path
    let path = window.location.pathname.replace(ROOT, "");

    // get the username from the path and return it
    return path.replace("/u/", "").replace("/profile.html", "");
}

// function where it returns the profile picture
function getProfileImage() {
    // bro used a function to return a defined value
    return "./profile.png";
}

// get the bio of the user in "bio.json"
async function setBio() {
    // the variables needed
    let response;
    let json;

    // fetch the "database" (bio.json)
    try {
        response = await fetch("./bio.json");
    }

    // error
    catch {
        alert("ERROR! There is something wrong");
    }

    // set the response in json form
    try {
        json = await response.json();

        // set bio to the json form of the response
        document.getElementById("bio").innerText = json[0];
    }
    
    // error
    catch {
        alert("ERROR! There is something wrong");
    }
}

// call start
start();