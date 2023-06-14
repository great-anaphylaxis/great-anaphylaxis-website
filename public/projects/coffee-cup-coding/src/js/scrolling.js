
let navbar = document.getElementsByClassName("navbar")[0];
let sections = document.getElementsByClassName("section");

let pastScrollPercent = 0;
let scrollPercent = getScrollPercent();

// get the percentage of the scroll progress
// copied somewhere else;)
function getScrollPercent() {
    return ((document.documentElement.scrollTop || document.body.scrollTop) / ((document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight)) * 100;
}

// function called when user is scrolling
function onscroll() {
    // get current scroll percent
    scrollPercent = getScrollPercent();

    // how much the scroll progress has changed since the past scroll
    let scrollDelta = scrollPercent - pastScrollPercent;

    // if no scroll
    if (scrollDelta == 0) {

    }

    // if scrolling up
    else if (scrollPercent > pastScrollPercent) {
        // to avoid executing without actually scrolling
        if (pastScrollPercent > 0) {
            navbar.style.animation = "0.5s ease 0s 1 normal forwards running hide_navbar";
        }
    }

    // if scrolling down
    else if (scrollPercent < pastScrollPercent) {
        // to avoid executing without actually scrolling
        if (pastScrollPercent > 0) {
            navbar.style.animation = "0.5s ease 0s 1 normal forwards running show_navbar";
        }
    }

    // set the past scroll percent to current scroll percent
    pastScrollPercent = scrollPercent;
}


// execute code (or animate element) when scrolled at a certain percentage
function reveal(section, percent) {
    if (scrollPercent >= percent) {
        section.style.animation = "1s ease 0s 1 normal forwards running show_section";
    }
}

// helps the reveal function, called everytime user scrolls
function revealer() {
    // if coffee-cup-coding.html
    if (document.body.dataset.name == "home") {
        reveal(sections[0], 0);
        reveal(sections[1], 10);
        reveal(sections[2], 30);
        reveal(sections[3], 60);
        reveal(sections[4], 80);
    }

    // if products.html
    else if (document.body.dataset.name == "products") {
        reveal(sections[0], 0);
        reveal(sections[1], 10);
    }

    // if unspecified
    else {
        for (let i = 0; i < sections.length; i++) {
            reveal(sections[i], 0);
        }
    }
}

// when there is a hash on the url, this function will handle it and scroll the page properly
function hashScroller() {
    if (document.body.dataset.name == "products") {
        // if products hash on products.html, then scroll to products
        if (window.location.hash == "#products") {
            sections[1].scrollIntoView();
        }
    }
}

// onscroll
document.body.onscroll = (e) => {
    onscroll();
    revealer();
};

// call for good measures
revealer();

// scroll to very start
window.scrollTo(0, 0);

// call the hash scroller function, with a timeout so that it will surely be called;)
setTimeout(()=>{
    hashScroller();
}, 10);