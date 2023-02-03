import "./style.css";

function getRandomNumber(from = 0, to = 1) {
    return Math.floor(Math.random() * (to - from)) + from;
}

function getRandomElementOfArray(array) {
    return array[getRandomNumber(0, array.length)];
}

function loop(times, callback) {
    Array(times)
        .fill("")
        .forEach(function (_, i) {
            callback.call(this, i);
        });
}

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
        // console.log(gridBlock, itemsPlaced, count);
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

            // resultMap.push(selectedBlockType);
            i = i + 1;

            lineContent.push(selectedBlockType);
        }
        lines.push(lineContent);
    }

    console.log("====================");

    leftover = itemsAbleToSet - totalItems;

    console.log("leftover", leftover);

    if (leftover > 0) {
        while (leftover > 0) {
            for (let i = 0; i < lines.length; i++) {
                if (leftover > 0) {
                    let line = lines[i];

                    if (line.includes("horizontals") || line.includes("double")) {
                        // Join vertically
                        // let halfChance = Math.random() < 0.5;

                        if (line.includes("horizontals")) {
                            line.splice(line.indexOf("horizontals"), 1, "square");
                        } else {
                            line.splice(line.indexOf("double"), 1, "vertical");
                        }

                        leftover = leftover - 1;
                    } else if (line.includes("vertical")) {
                        // Join horizontally
                        // if (line.includes("vertical")) {
                        // let line = ["s", "v", "v", "d"];
                        let firstFoundId = line.indexOf("vertical");
                        let nextOfSameVal = line.slice(firstFoundId + 1).indexOf("vertical");

                        if (nextOfSameVal >= 0) {
                            let nextFoundId = nextOfSameVal + 1 + firstFoundId;

                            line[firstFoundId] = "square";
                            line.splice(nextFoundId, 1);

                            leftover = leftover - 1;
                        }
                        // }
                    }
                }
            }
        }
    }

    for (let i = 0; i < lines.length; i++) {
        let lineContent = lines[i];
        resultMap.push(...lineContent);
    }

    // let count = countPlacedItems(resultMap);
    // console.log(count - totalItems, count);
    // let leftorver2 = count - totalItems;
    // let zaza = "";

    // leftover = itemsAbleToSet - totalItems;

    // let resultingArray = [];

    // console.log("leftover", leftover);
    // while (leftover > 0) {
    //     for (let i = 0; i < perline.length; i++) {
    //         let line = perline[i];
    //         // perline.forEach((line) => {
    //         console.log("------");
    //         if (leftover >= 0) {
    //             // let halfChance = Math.random() < 0.5;

    //             console.log("LINE BEFORE", line);

    //             if (line.includes("horizontals") || line.includes("double")) {
    //                 // Join vertically
    //                 // let halfChance = Math.random() < 0.5;

    //                 if (line.includes("horizontals")) {
    //                     line.splice(line.indexOf("horizontals"), 1, "square");
    //                 } else {
    //                     line.splice(line.indexOf("double"), 1, "vertical");
    //                 }

    //                 leftover = leftover - 1;
    //             } // } else if (line.includes("vertical")) {
    //             //     // Join horizontally
    //             //     // if (line.includes("vertical")) {
    //             //     // let line = ["s", "v", "v", "d"];
    //             //     let firstFoundId = line.indexOf("vertical");
    //             //     let nextOfSameVal = line.slice(firstFoundId + 1).indexOf("vertical");

    //             //     if (nextOfSameVal >= 0) {
    //             //         let nextFoundId = nextOfSameVal + 1 + firstFoundId;

    //             //         line[firstFoundId] = "square";
    //             //         line.splice(nextFoundId, 1);

    //             //         leftover = leftover - 1;
    //             //     }
    //             //     // }
    //             // }
    //         }

    //         console.log("LINE", line);

    //         resultingArray = resultingArray.concat(line);

    //         // console.log("resultingArray", resultingArray);
    //         // });
    //     }
    // }

    //console.log("RES", resultingArray);

    let itemNumber = countPlacedItems(resultMap);
    console.log(itemNumber - totalItems, itemNumber);

    // console.log(leftorver2);

    // if (leftorver2) {
    // perline.forEach((perlineRow) => {
    //     // console.log(perlineRow, perlineRow.toString());
    //     if (leftover && perlineRow.toString().includes("vertical,vertical")) {
    //         perlineRow = perlineRow.toString().replace("vertical,vertical", "square");

    //         leftover = leftover - 1;
    //     }

    //     zaza = zaza + "," + perlineRow;
    // });

    // let soso = zaza.substring(1).split(",");

    // console.log(soso);
    // }

    // leftover = itemsAbleToSet - totalItems;

    // console.log(perline, leftover, itemsAbleToSet);

    // loop(leftover, (i) => {
    //     let halfChance = Math.random() < 0.5;

    //     if (halfChance) {
    //         resultMap.splice(resultMap.indexOf("horizontals"), 1, "square");
    //     } else {
    //         resultMap.splice(resultMap.indexOf("double"), 1, "vertical");
    //     }
    // });

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

let colCount = 5;

let layoutMap = generateRGGridMap(colCount, 13);

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
