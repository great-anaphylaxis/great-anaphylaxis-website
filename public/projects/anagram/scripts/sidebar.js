var ROOT = localStorage.getItem('ROOT');

let sidebar = document.getElementById("sidebar");
let you = "newuser123";

// element creation function
function e(element, classes, parent) {
    // the element
    let e = document.createElement(element);

    // if the classes is specified
    if (classes) {
        // check if it is intended to be an id, not a class
        if (classes[0] == "#") {
            // set its id
            // that dirty thing is to remove the # from the string, then use it to set the id
            e.setAttribute("id", classes.substring(1));
        }

        // if class
        else {
            // then class it is
            e.classList.add(classes);
        }
    }
    
    // if parent is specified
    if (parent) {
        // append element to parent
        parent.appendChild(e);
    }

    // return the element
    return e;
}

// create the banner on the top of the sidebar
function createBanner(image) {
    // the banner element
    let banner = e("img", "#banner");
    banner.src = image;

    // set the title (tooltip)
    banner.title = "Anagram";

    // on click banner, then go to about page of the site
    banner.addEventListener("click", e=> {
        window.location.href = ROOT + "/about.html";
    });

    // append it to sidebar
    sidebar.appendChild(banner);
}

// create the icon on the top of the sidebar (for phones)
function createAppIcon(image) {
    // the banner element
    let banner = e("img", "#app_icon");
    banner.src = image;

    // set the title (tooltip)
    banner.title = "Anagram";

    // on click banner, then go to about page of the site
    banner.addEventListener("click", e=> {
        window.location.href = ROOT + "/about.html";
    });

    // append it to sidebar
    sidebar.appendChild(banner);
}

// create a sidebar button, D Y N A M I C A L L Y
function createSidebarButton(name, icon, path) {
    // the sidebar button (link element)
    let button = e("a", "sidebar_button");
    button.href = path;

    // set the title (tooltip)
    button.title = name;

    // the icon of the button
    let button_icon = e("img", "sidebar_button_icon", button);
    button_icon.src = icon;

    // the name of the button
    let button_title = e("div", "sidebar_button_title", button);
    button_title.innerText = name;

    // append to sidebar, so that it will be visible
    sidebar.appendChild(button);
}

// set all the given class to have a hover animation
function hoverizeClass(className) {
    // get all elements with the class
    let elements = document.getElementsByClassName(className);

    // loop through all them
    for (let i = 0; i < elements.length; i++) {
        // add to them the animation
        addHoveriness(elements[i]);
    }
}

// add hovering animations to an element
function addHoveriness(element) {
    // on mouse over the element
    element.addEventListener("mouseover", e=>{
        // expand
        element.classList.remove("collapse");
        element.classList.add("expand");
    });

    // on mouse exits the element
    element.addEventListener("mouseout", e=>{
        // collapse
        element.classList.remove("expand");
        element.classList.add("collapse");
    });
}

// the app icon (for phones)
createAppIcon(ROOT + "/content/icons/app_icon.png");

// the banner
createBanner(ROOT + "/content/banners/banner.png");

// the buttons
createSidebarButton("Home", ROOT + "/content/icons/home.png", ROOT + "/anagram.html");
createSidebarButton("You", ROOT + "/u/newuser123/profile.png", ROOT + "/u/" + you + "/profile.html");



// hoverize sidebar buttons
hoverizeClass("sidebar_button");

// hoverize the banner
addHoveriness(document.getElementById("banner"));