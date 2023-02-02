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

//last date = 7

createItems("os",
"An unnamed operating system",
"My attempt at creating my own operating system. It is a 32 bit operating system with it's own bootloader. Note: It is bad and MIGHT NOT WORK ON REAL HARDWARE. But, it works on QEMU.",
2, -3
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

createItems("overwhelm",
"Overwhelm",
"A game made in a day using the Unity Game Engine. It is game very similar to a space shooter game. All arts and music made by me.",
4, 1
);

createItems("the-maze",
"The Maze of the Periodic Scale",
"A game made during the Global Game Jam 2021. Also my first game jam. The game is highly unpolished.",
0, 2
);

createItems("chat-yourself",
"Chat Yourself",
"You can chat with yourself here. I mean, why wouldn't you?",
6, 3
)

createItems("annoying-brick-breaker-game",
"Annoying Brick Breaker Game",
"A game made in a day using the Unity Game Engine.",
3, 4
);

