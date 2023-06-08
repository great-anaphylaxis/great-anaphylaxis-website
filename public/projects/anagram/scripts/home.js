// root url things
localStorage.setItem("ROOT", window.location.pathname.replace("/anagram.html", ""));
var ROOT = localStorage.getItem('ROOT');

let content = document.getElementById('content');

let posts = [];
let liked_posts = ["user!0"];
let last_unliked_post;

let allThereIsMessage = "It seems that that is all there is, come back later!";

// element creation function
function e(element, classes, parent) {
    // the element
    let e = document.createElement(element);

    // if the classes is specified
    if (classes) {
        // check if it is intended to be an id, not a class
        if (classes[0] == "#") {
            // set its id
            e.setAttribute("id", classes);
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

// post data: required data for posts
function createPostData(id, username, text, image, likes) {
    // the unique id of the post
    this.id = username + "!" + id;

    // username of the poster
    this.username = username;

    // text of the post
    this.text = text;

    // image of the post, if any
    this.image = ROOT + image;

    // how many likes the post has
    this.likes = likes;
}

// a function to create a post for the user to see
function createPost(postData) {
    // the root object

    /*root
        .post
        .postData
        .like_button
    */
    let root = {};
    root.postData = postData;

    // the post element, root element of the post
    let post = e("div", "post");
    root.post = post;

    // username of the post
    let user = e("div", "user", post);
    let username = e("a", "username", user);

    // link to profile page of the user
    username.href = ROOT + "/u/" + postData.username + "/profile.html";

    // profile image
    let profile_image = e("img", "profile_image", username);
    profile_image.src = ROOT + "/u/" + postData.username + "/profile.png";

    // set the title (tooltip) of the profile image
    profile_image.title = postData.username;

    // add hoveriness to profile image
    addHoveriness(profile_image);

    // append username to the side of profile picture
    username.appendChild(document.createTextNode(postData.username));

    // an hr element dividing the poster info and the content
    e("hr", null, post);

    // text of the post
    let text = e("div", "text", post);
    text.innerText = postData.text;

    // image variable, if an image exists;
    let img;

    // check if there is an image available in the post data
    if (postData.image) {
        // image of the post

        //its container
        let image = e("div", "image", post);

        // the image itself
        img = e("img", null, image);
        img.src = postData.image;
    }

    // the bottom bar of the post
    let bottombar = e("div", "bottombar", post);

    // like button
    let like_button = e("img", "like_button", bottombar);
    root.like_button = like_button;

    // set the title (tooltip) of the like button
    like_button.title = "Press it!";

    // if the post is liked, or found in the liked posts array
    if (IDIsInArray(postData.id, liked_posts) == true) {
        // then set heart icon to hearted
        like_button.src = ROOT + "/content/icons/heart.png";
    }
    else {
        // else, set it to empty heart
        like_button.src = ROOT + "/content/icons/empty_heart.png";
    }

    // the function called when you like a post
    let likePostFunction = e => {

        // check if you have recently unliked a post
        if (last_unliked_post != null && IDIsInArray(last_unliked_post, liked_posts) == false) {
            // get the recently unliked post
            let post = getPost(last_unliked_post);

            // then change its heart icon
            post.like_button.src = ROOT + "/content/icons/empty_heart.png";
        }

        // if this post has been liked by the user
        // or in other words, unlike it
        if (IDIsInArray(postData.id, liked_posts) == true) {
            // remove this post from the list of liked posts
            removeIDFromArray(postData.id, liked_posts);

            // change button icon
            like_button.src = ROOT + "/content/icons/unheart.png";

            // update the like counter
            postData.likes -= 1;
            like_count.innerText = (postData.likes).toLocaleString() || 0;

            // set this post to be the most recent unliked post
            last_unliked_post = postData.id;
        }

        // if it is not...
        // or in other words, like it
        else {
            // then add this post to the list of liked posts
            addIDToArray(postData.id, liked_posts);

            // change button icon
            like_button.src = ROOT + "/content/icons/heart.png";

            // update the like counter
            postData.likes += 1;
            like_count.innerText = (postData.likes).toLocaleString() || 0;
        }
    };
    
    // if the like button is clicked, then like it
    like_button.addEventListener("click", likePostFunction);

    // also, if the image is double clicked (if it has one), then like it too
    if (img) {
        img.addEventListener("dblclick", likePostFunction);
    }

    // add hoveriness to like button
    addHoveriness(like_button);

    // add bounciness to like button
    addBounciness(like_button);

    // text: how many likes a post has
    let like_count = e("div", "like_count", bottombar);
    like_count.innerText = (postData.likes).toLocaleString() || 0;

    // append to the "content" element, which all the posts reside
    content.appendChild(post);

    // add to posts array
    posts.push(root);
    return root;
}

// a thing at the end of the content
function createAllThereIs() {
    // the element
    let allThereIs = e("div", "#all_there_is");

    // text of the element
    allThereIs.innerText = allThereIsMessage;

    // append element to content
    content.appendChild(allThereIs);
}


// check if an id is in an array, then return true, otherwise false
function IDIsInArray(id, array) {
    // loop through array
    for (let i = 0; i < array.length; i++) {
        // if current element of array is the same as id, return true
        if (array[i] == id) {
            return true;
        }
    }

    // else return false
    return false;
}

// remove an id from an array, if it exists
function removeIDFromArray(id, array) {
    // loop through array
    for (let i = 0; i < array.length; i++) {
        // if current element of array is the same as id, then remove the current element
        if (array[i] == id) {
            array.splice(i, 1);

            // break the loop
            break;
        }
    }
}

// add an id to an array
function addIDToArray(id, array) {
    return array.push(id);
}

// get post that has the id stated
function getPost(id) {
    // loop through posts array
    for (let i = 0; i < posts.length; i++) {
        // the current post
        let post = posts[i];

        // if post with the same id is found, then return it
        if (post.postData.id == id) {
            return post;
        }
    }

    // else, return null
    return null;
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

// add click animation to an element
function addBounciness(element) {
    // on mouse down the element
    element.addEventListener("mousedown", e=>{
        // remove bounce class
        element.classList.remove("bounce");
    });

    // on mouse click the element
    element.addEventListener("click", e=>{
        // B O U N C E
        element.classList.add("bounce");
    });
}


// get all the posts stored in a database (or in this example, posts.json)
async function data_getPosts() {
    // fetch the "database"
    let response = await fetch(ROOT + "/data/posts.json");

    // return the response, in json form
    try {
        return response.json();
    }
    // just throw an error if it fails, not a big deal
    catch {
        alert("ERROR! There is something wrong");
    }
}

// display all the posts that are fetched
async function data_displayPosts() {
    // self explanatory
    let posts;

    // set variable posts to the fetched data
    try {
        posts = await data_getPosts();
    }
    // error if fails
    catch {
        alert("ERROR! There is something wrong");
    }

    // loop through all the posts that are fetched
    for (let i = 0; i < posts.length; i++) {
        // call the createPost function, using the data that is fetched
        createPost( new createPostData(...posts[i]) );
    }

    // the last thing of the content (at the end)
    createAllThereIs();
}


//

// displays the posts
data_displayPosts();