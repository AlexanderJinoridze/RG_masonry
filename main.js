import "./style.css";

function getRandomNumber(from = 0, to = 1) {
    return Math.floor(Math.random() * (to - from)) + from;
}

function getRandomElementOfArray(array) {
    return array[getRandomNumber(0, array.length)];
}

// function loop(times, callback) {
//     Array(times)
//         .fill("")
//         .forEach(function (_, i) {
//             callback.call(this, i);
//         });
// }

function countPlacedItems(resultMap) {
    let count = 0;

    resultMap.forEach((gridBlock) => {
        let itemsPlaced = null;

        if (["horizontals", "double"].includes(gridBlock)) {
            itemsPlaced = 2;
        } else if (["square", "vertical"].includes(gridBlock)) {
            itemsPlaced = 1;
        }

        count = count + itemsPlaced;
    });

    return count;
}

function generateRGGridMap(columns, totalItems) {
    const blockTypes = ["square", "horizontals", "vertical", "double"];
    const resultMap = [];
    let itemsAbleToSet = 0;
    let itemsLeft = totalItems;
    let leftover = null;

    let lines = [];

    var i = 0;

    while (itemsLeft > 0) {
        if (itemsLeft <= 0) {
            continue;
        }

        let freeSpaceOfLine = columns;

        console.log("--------------------");

        let lineContent = [];
        while (freeSpaceOfLine > 0) {
            if (freeSpaceOfLine <= 0) {
                continue;
            }

            let selectedBlockType = getRandomElementOfArray(blockTypes);
            let spaceTaken = 0;

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

                console.log(spaceTaken, selectedBlockType, i);

                freeSpaceOfLine = freeSpaceOfLine - spaceTaken;

                if (freeSpaceOfLine < 0) {
                    continue;
                }

                itemsAbleToSet = itemsAbleToSet + 2;
                itemsLeft = itemsLeft - 2;
            } else if (["square", "vertical"].includes(selectedBlockType)) {
                if (freeSpaceOfLine < 2) {
                    selectedBlockType = "vertical";
                }

                if (selectedBlockType === "square") {
                    spaceTaken = 2;
                } else if (selectedBlockType === "vertical") {
                    spaceTaken = 1;
                }

                console.log(spaceTaken, selectedBlockType, i);

                freeSpaceOfLine = freeSpaceOfLine - spaceTaken;

                if (freeSpaceOfLine < 0) {
                    continue;
                }

                itemsAbleToSet = itemsAbleToSet + 1;
                itemsLeft = itemsLeft - 1;
            }

            i = i + 1;

            lineContent.push(selectedBlockType);
        }
        lines.push(lineContent);
    }

    console.log("====================");

    leftover = itemsAbleToSet - totalItems;

    console.log("leftover", leftover);

    while (leftover > 0) {
        for (let i = 0; i < lines.length; i++) {
            if (leftover <= 0) {
                continue;
            }

            let lineContent = lines[i];

            if (lineContent.includes("horizontals") || lineContent.includes("double")) {
                // Join vertically

                if (lineContent.includes("horizontals")) {
                    lineContent.splice(lineContent.indexOf("horizontals"), 1, "square");
                } else {
                    lineContent.splice(lineContent.indexOf("double"), 1, "vertical");
                }

                leftover = leftover - 1;
            } else if (lineContent.includes("vertical")) {
                // Join horizontally

                let firstFoundId = lineContent.indexOf("vertical");
                let nextOfSameVal = lineContent.slice(firstFoundId + 1).indexOf("vertical");

                if (nextOfSameVal >= 0) {
                    let nextFoundId = nextOfSameVal + 1 + firstFoundId;

                    lineContent[firstFoundId] = "square";
                    lineContent.splice(nextFoundId, 1);

                    leftover = leftover - 1;
                }
            }
        }
    }

    for (let i = 0; i < lines.length; i++) {
        let lineContent = lines[i];
        resultMap.push(...lineContent);
    }

    let itemNumber = countPlacedItems(resultMap);

    console.log(itemNumber - totalItems, itemNumber);

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

let colCount = 4;

let layoutMap = generateRGGridMap(colCount, 5);

console.log(layoutMap);

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
