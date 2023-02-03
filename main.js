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
        console.log(gridBlock, itemsPlaced, count);
    });

    return count;
}

function generateRGGridMap(columns, totalItems) {
    const blockTypes = ["square", "horizontals", "vertical", "double"];
    const resultMap = [];
    let itemsAbleToSet = 0;
    let itemsLeft = totalItems;
    let leftover = null;

    let perline = [];

    var i = 0;

    while (itemsLeft > 0) {
        if (itemsLeft <= 0) {
            continue;
        }

        let freeSpaceOfLine = columns;

        console.log("--------------------");

        let perlineRow = [];
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

            resultMap.push(selectedBlockType);
            i = i + 1;

            perlineRow.push(selectedBlockType);
        }
        perline.push(perlineRow);
    }

    console.log("====================");

    // let count = countPlacedItems(resultMap);
    // console.log(count - totalItems, count);

    leftover = itemsAbleToSet - totalItems;
    // let leftorver2 = count - totalItems;
    let zaza = "";

    // console.log(leftorver2);

    // if (leftorver2) {
    perline.forEach((perlineRow) => {
        // console.log(perlineRow, perlineRow.toString());
        if (leftover && perlineRow.toString().includes("vertical,vertical")) {
            perlineRow = perlineRow.toString().replace("vertical,vertical", "square");

            leftover = leftover - 1;
        }

        zaza = zaza + "," + perlineRow;
    });

    let soso = zaza.substring(1).split(",");

    console.log(soso);
    let count2 = countPlacedItems(soso);
    console.log(count2 - totalItems, count2);
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

generateRGGridMap(5, 13);

// function drawS(data) {
//     return `<div class="s">
//         <div class="item"></div>
//     </div>`;
// }

// function drawH(data) {
//     return `<div class="h">
//         <div class="item"></div>
//         <div class="item"></div>
//     </div>`;
// }

// function drawV(data) {
//     return `<div class="v">
//         <div class="item"></div>
//     </div>`;
// }

// function drawD(data) {
//     return `<div class="d">
//         <div class="item"></div>
//         <div class="item"></div>
//     </div>`;
// }

// function draw(arr) {
//     let res = "";
//     arr.forEach((elem) => {
//         switch (elem) {
//             case "s":
//                 res += drawS();
//                 break;
//             case "h":
//                 res += drawH();
//                 break;
//             case "v":
//                 res += drawV();
//                 break;
//             default:
//                 res += drawD();
//                 break;
//         }
//     });

//     return res;
// }

// let colCount = 5;

// let layoutMap = place(colCount, 4);

// document.querySelector("#app").style = `width:${colCount * 100}px`;
// document.querySelector("#app").innerHTML = draw(layoutMap);

// document.querySelectorAll(".item").forEach((elem, index) => {
//     elem.innerHTML = index + 1;
// });

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
