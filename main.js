import "./style.css";

function getRandomNumber(from = 0, to = 1) {
    return Math.floor(Math.random() * (to - from)) + from;
}

function getRandomElementOfArray(array) {
    return array[getRandomNumber(0, array.length)];
}

function generateRGGridMap(columns, totalItems) {
    if (columns >= totalItems) {
        columns = totalItems - 1;
    }

    const blockTypes = ["square", "horizontals", "vertical", "double"];
    const resultMap = [];

    let itemsAbleToSet = 0;
    let itemsLeft = totalItems;

    let lines = [];

    while (itemsLeft > 0) {
        let freeSpaceOfLine = columns;
        let line = [];

        while (freeSpaceOfLine > 0) {
            let selectedBlockType = getRandomElementOfArray(blockTypes);
            let spaceTaken = 0;
            let itemsAffected = 0;

            if (itemsLeft < 2) {
                selectedBlockType = "vertical";
            }

            if (["horizontals", "double"].includes(selectedBlockType)) {
                if (freeSpaceOfLine < 2) {
                    selectedBlockType = "double";
                }

                if (selectedBlockType === "horizontals") {
                    spaceTaken = 2;
                } else if (selectedBlockType === "double") {
                    spaceTaken = 1;
                }

                itemsAffected = 2;
            } else if (["square", "vertical"].includes(selectedBlockType)) {
                if (freeSpaceOfLine < 2) {
                    selectedBlockType = "vertical";
                }

                if (selectedBlockType === "square") {
                    spaceTaken = 2;
                } else if (selectedBlockType === "vertical") {
                    spaceTaken = 1;
                }

                itemsAffected = 1;
            }

            freeSpaceOfLine = freeSpaceOfLine - spaceTaken;
            itemsAbleToSet = itemsAbleToSet + itemsAffected;
            itemsLeft = itemsLeft - itemsAffected;

            line.push(selectedBlockType);
        }
        lines.push(line);
    }

    let leftover = itemsAbleToSet - totalItems;

    while (leftover > 0) {
        let line = getRandomElementOfArray(lines);

        if (line.includes("horizontals") || line.includes("double")) {
            if (line.includes("horizontals")) {
                line.splice(line.indexOf("horizontals"), 1, "square");
            } else {
                line.splice(line.indexOf("double"), 1, "vertical");
            }

            leftover = leftover - 1;
        } else if (line.includes("vertical")) {
            let firstFoundId = line.indexOf("vertical");
            let nextOfSameVal = line.slice(firstFoundId + 1).indexOf("vertical");

            if (nextOfSameVal >= 0) {
                let nextFoundId = nextOfSameVal + 1 + firstFoundId;

                line[firstFoundId] = "square";
                line.splice(nextFoundId, 1);

                leftover = leftover - 1;
            }
        }
    }

    for (let i = 0; i < lines.length; i++) {
        resultMap.push(...lines[i]);
    }

    return resultMap;
}

// generateRGGridMap(5, 13);

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
            case "square":
                res += drawS();
                break;
            case "horizontals":
                res += drawH();
                break;
            case "vertical":
                res += drawV();
                break;
            default:
                res += drawD();
                break;
        }
    });

    return res;
}

let colCount = 10;

let layoutMap = generateRGGridMap(colCount, 90);

document.querySelector("#app").style = `width:${colCount * 100}px`;
document.querySelector("#app").innerHTML = draw(layoutMap);

document.querySelectorAll(".item").forEach((elem, index) => {
    elem.innerHTML = index + 1;
});

// document.querySelector("#lgx").addEventListener("click", () => {
//     let colCount = 5;

//     let layoutMap = place(colCount, 40);

//     document.querySelector("#app").style = `width:${colCount * 100}px`;
//     document.querySelector("#app").innerHTML = draw(layoutMap);

//     document.querySelectorAll(".item").forEach((elem, index) => {
//         elem.innerHTML = index + 1;
//     });
// });

// document.querySelector("#lg").addEventListener("click", () => {
//     let colCount = 4;

//     let layoutMap = place(colCount, 40);

//     document.querySelector("#app").style = `width:${colCount * 100}px`;
//     document.querySelector("#app").innerHTML = draw(layoutMap);

//     document.querySelectorAll(".item").forEach((elem, index) => {
//         elem.innerHTML = index + 1;
//     });
// });

// document.querySelector("#md").addEventListener("click", () => {
//     let colCount = 3;

//     let layoutMap = place(colCount, 40);

//     document.querySelector("#app").style = `width:${colCount * 100}px`;
//     document.querySelector("#app").innerHTML = draw(layoutMap);

//     document.querySelectorAll(".item").forEach((elem, index) => {
//         elem.innerHTML = index + 1;
//     });
// });

// document.querySelector("#sm").addEventListener("click", () => {
//     let colCount = 2;

//     let layoutMap = place(colCount, 40);

//     document.querySelector("#app").style = `width:${colCount * 100}px`;
//     document.querySelector("#app").innerHTML = draw(layoutMap);

//     document.querySelectorAll(".item").forEach((elem, index) => {
//         elem.innerHTML = index + 1;
//     });
// });
