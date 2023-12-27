let select = document.querySelector(".projects>select");
let list = document.querySelector(".projects");

select.addEventListener('change', () => {
    let val = select.value;
    let children = [...list.children];

    if (val == "best") {
        children.sort((a, b) => parseInt(a.dataset.quality) - parseInt(b.dataset.quality));
    }
    else if (val == "newest") {
        children.sort((a, b) => parseInt(b.dataset.date) - parseInt(a.dataset.date));
    }
    else if (val == "oldest") {
        children.sort((a, b) => parseInt(a.dataset.date) - parseInt(b.dataset.date));
    }
    
    for (let i = 0; i < children.length; i++) {
        list.removeChild(children[i]);
        list.appendChild(children[i]);
    }
});

function createItems(project, title, description, date, quality) {
    let parent0 = document.createElement("a");

    parent0.href = "/projects/" + project + "/" + project + ".html";
    parent0.dataset.date = date;
    parent0.dataset.quality = quality;

    let parent1 = document.createElement("div");
    parent1.setAttribute("class", "project");

    let image0 = document.createElement("img");
    image0.setAttribute("class", "project-image");
    image0.src = "/projects/" + project + "/" + project + ".png";

    let parent2 = document.createElement("div");
    parent2.setAttribute("class", "project-info");

    let title0 = document.createElement("div");
    title0.setAttribute("class", "ch-title");
    title0.innerText = title;

    let description0 = document.createElement("div");
    description0.setAttribute("class", "ch-description");
    description0.innerText = description;

    parent2.appendChild(title0);
    parent2.appendChild(description0);

    parent1.appendChild(image0);
    parent1.appendChild(parent2);

    parent0.appendChild(parent1);

    list.appendChild(parent0);
}

//last date = 12

createItems("os",
"An unnamed operating system",
"My attempt at creating my own operating system. It is a 32 bit operating system with it's own bootloader. Note: It has not been tested on real hardware so it MIGHT NOT WORK ON REAL HARDWARE. But, it works on QEMU (a virtual machine).",
2, -5
);

createItems("chess",
"Chess by Jhareign Solidum",
"Yeah, chess made by me! Play with yourself (or someone), or a grandmaster at chess, or I guess view chess games. Grandmaster you may ask? nah don't trust me:)",
9, -4
);

createItems("kynigito",
"Kynigito",
"Chase coins (and gems) before your time runs out. Acquire better characters for higher grace and luck.",
12, -3
);

createItems("cliff-jump-pou",
"Cliff Jump Pou Remake",
"A remake from the minigame Cliff Jump in the game Pou",
7, -2
);

createItems("skodati",
"Skodati",
"A 2D horror game made in Unity.",
5, -1
);

createItems("the-raid",
"The Raid",
"A game made during the Ludum Dare 50 Game Jam.",
1, 0
);

createItems("wordle",
"Wordle",
"A game where you guess a five letter word. Made in HTML, CSS and Javascript",
8, 1
);

createItems("coffee-cup-coding",
"Coffee Cup Coding",
"Coffee Cup Coding is part of the Great Anaphylaxis Imaginary Corporation™. Coffee Cup Coding is a coffee designed for programmers. Here is the website.",
11, 2
);

createItems("overwhelm",
"Overwhelm",
"A game made in a day using the Unity Game Engine. It is game very similar to a space shooter game. All arts and music made by me.",
4, 3
);

createItems("the-maze",
"The Maze of the Periodic Scale",
"A game made during the Global Game Jam 2021. Also my first game jam. The game is highly unpolished.",
0, 4
);

createItems("anagram",
"Anagram",
"Anagram is part of the Great Anaphylaxis Imaginary Corporation™. Anagram is a prototype front-end social media-like project created by Jhareign Solidum. The design is very basic",
10, 5
);

createItems("chat-yourself",
"Chat Yourself",
"You can chat with yourself here. I mean, why wouldn't you?",
6, 6
);

createItems("annoying-brick-breaker-game",
"Annoying Brick Breaker Game",
"A game made in a day using the Unity Game Engine.",
3, 7
);

