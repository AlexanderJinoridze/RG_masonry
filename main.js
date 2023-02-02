import "./style.css";

function place(cols, items) {
    const blocks = ["s", "h", "v", "d"];
    let iterationId = 0;
    let countItmes = 0;
    let initialItems = items;
    const res = [];

    while (items) {
        let blocksPerRow = cols;

        console.log("---------->->->->--");

        if (items > 0) {
            while (blocksPerRow) {
                let randBlock = blocks[Math.floor(Math.random() * blocks.length)];

                if (items < 2) {
                    randBlock = "h";
                }

                if (["h", "d"].includes(randBlock)) {
                    if (blocksPerRow < 2) {
                        randBlock = "d";
                    }

                    if (randBlock === "h") {
                        console.log("two", 2, randBlock, iterationId);
                        blocksPerRow = blocksPerRow - 2;
                    } else {
                        console.log("one", 1, randBlock, iterationId);
                        blocksPerRow = blocksPerRow - 1;
                    }

                    countItmes = countItmes + 2;
                    items = items - 2;
                } else {
                    if (blocksPerRow < 2) {
                        randBlock = "v";
                    }
                    if (randBlock === "s") {
                        console.log("two", 2, randBlock, iterationId);

                        blocksPerRow = blocksPerRow - 2;
                    } else {
                        console.log("one", 1, randBlock, iterationId);
                        blocksPerRow = blocksPerRow - 1;
                    }

                    countItmes = countItmes + 1;
                    items = items - 1;
                }

                res.push(randBlock);

                iterationId = iterationId + 1;
            }
        } else {
            items = false;
        }
    }

    console.log("count of iters", countItmes - initialItems);

    Array(countItmes - initialItems)
        .fill("")
        .forEach((_, i) => {
            var sos = Math.random() < 0.5;
            console.log(i, sos);

            if (i <= initialItems && sos) {
                console.log(res);
                res.splice(res.indexOf("h"), 1, "s");
                console.log(res);
            } else {
                console.log(res);
                res.splice(res.indexOf("d"), 1, "v");
                console.log(res);
            }
        });

    let zaza = 0;

    console.log(countItmes - initialItems, countItmes);

    // console.log(res, countItmes);
    res.forEach((resItem) => {
        // console.log(resItem, ["h", "d"].includes(resItem));
        if (["h", "d"].includes(resItem)) {
            zaza = zaza + 2;
            console.log(resItem, 2, zaza);
        } else if (["s", "v"].includes(resItem)) {
            zaza = zaza + 1;
            console.log(resItem, 1, zaza);
        }
    });

    console.log(zaza - initialItems, zaza);

    // Array(items)
    //     .fill("")
    //     .forEach((i) => {
    //         console.log(i, "zaza");
    //     });
    return res;
}

function drawS(data) {
    return `<div class="s">
        <div class="item"></div>
    </div>`;
}

function drawH(data) {
    return `<div class="h">
        <div class="item"></div>
        <div class="item"></div>
    </div>`;
}

function drawV(data) {
    return `<div class="v">
        <div class="item"></div>
    </div>`;
}

function drawD(data) {
    return `<div class="d">
        <div class="item"></div>
        <div class="item"></div>
    </div>`;
}

function draw(arr) {
    let res = "";
    arr.forEach((elem) => {
        switch (elem) {
            case "s":
                res += drawS();
                break;
            case "h":
                res += drawH();
                break;
            case "v":
                res += drawV();
                break;
            default:
                res += drawD();
                break;
        }
    });

    return res;
}

let colCount = 3;

let layoutMap = place(colCount, 13);

document.querySelector("#app").style = `width:${colCount * 100}px`;
document.querySelector("#app").innerHTML = draw(layoutMap);

document.querySelectorAll(".item").forEach((elem, index) => {
    elem.innerHTML = index + 1;
});
