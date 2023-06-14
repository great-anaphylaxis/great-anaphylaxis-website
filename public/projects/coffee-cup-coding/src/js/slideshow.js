// slideshows array
let slideshows = [];

// initialize a slideshow
function initializeSlideshow(slideshow) {
    // if no buttons, then stop the function
    if (slideshow.getElementsByClassName("slideshowControls").length == 0) {
        return;
    }

    // slideshow (root) object
    let root = {};

    // the images container
    root.images = slideshow.getElementsByClassName("images")[0];

    // current slideshow index
    root.index = 0;

    // on click right
    root.right = function() {
        // set display of current image to none
        root.images.children[root.index].style.display = "none";
        
        // update index
        root.index = (root.index + 1) % root.images.children.length;
        
        // then make the new image visible
        root.images.children[root.index].style.display = "block";
        root.images.children[root.index].style.animation = "2s ease 0s show_image";
    }

    // on click left
    root.left = function() {
        // set display of current image to none
        root.images.children[root.index].style.display = "none"
        
        // update index
        root.index = (root.index - 1) == -1 ? root.images.children.length - 1 : root.index - 1;

        // then make the new image visible
        root.images.children[root.index].style.display = "block";
        root.images.children[root.index].style.animation = "2s ease 0s show_image";
    }

    // loop slideshow
    root.loop = setInterval(function() {
        root.right();
    }, 5000);

    // make the buttons functional
    slideshow.getElementsByClassName("left_button")[0].addEventListener("click", root.left);
    slideshow.getElementsByClassName("right_button")[0].addEventListener("click", root.right);

    // push root object to slideshows array (coz why not)
    slideshows.push(root);
}

// initialize all slideshows
function initializeAllSlideshows() {
    // get all the slideshows
    let slideshows = document.getElementsByClassName("slideshow");

    // loop through them
    for (let i = 0; i < slideshows.length; i++) {
        // then initialize
        initializeSlideshow(slideshows[i]);
    }
}

// call to initialize all slideshows
initializeAllSlideshows();