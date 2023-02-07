import "./style.css";

function getRandomNumber(from = 0, to = 1) {
    return Math.floor(Math.random() * (to - from)) + from;
}

function getRandomElementOf(array) {
    return array[getRandomNumber(0, array.length)];
}

function getIndexesOf(value, array) {
    var results = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] === value) {
            results.push(i);
        }
    }

    return results;
}

function eitherOr(firstStatement, secondStatement) {
    if (Math.random() < 0.5) {
        return firstStatement;
    } else {
        return secondStatement;
    }
}

function joinVertically(dividedBlockType, randomLine, randomBlockEntries) {
    if (randomBlockEntries.length <= 0) {
        return false;
    }

    let indexOfPickedBlock = getRandomElementOf(randomBlockEntries);

    randomLine.splice(indexOfPickedBlock, 1, dividedBlockType === "horizontals" ? "square" : "vertical");

    return [randomLine, 1];
}

function joinHorizontally(halfWidthBlockType, randomLine, randomBlockEntries) {
    if (randomBlockEntries.length <= 1) {
        return false;
    }

    let replacementBlock;
    let spaceTaken;
    let firstPick = getRandomElementOf(randomBlockEntries);
    randomBlockEntries.splice(randomBlockEntries.indexOf(firstPick), 1);
    let secondPick = getRandomElementOf(randomBlockEntries);

    if (halfWidthBlockType === "vertical") {
        replacementBlock = "square";
        spaceTaken = 1;
    } else if (halfWidthBlockType === "double") {
        replacementBlock = "horizontals";
        spaceTaken = 2;
    }

    randomLine[firstPick] = replacementBlock;
    randomLine.splice(secondPick, 1);

    return [randomLine, spaceTaken];
}

function evaluateSpaceTaken(line) {
    let spaceTaken = 0;

    line.forEach((blockType) => {
        if (["square", "horizontals"].includes(blockType)) {
            spaceTaken = spaceTaken + 2;
        } else if (["vertical", "double"].includes(blockType)) {
            spaceTaken = spaceTaken + 1;
        }
    });

    return spaceTaken;
}

function stretchBlocksFullWidth(columns, line) {
    let spaceTaken = evaluateSpaceTaken(line);

    if (columns > spaceTaken) {
        let spaceToBeFilled = columns - spaceTaken;

        while (spaceToBeFilled > 0) {
            let randomBlock = getRandomElementOf(["double", "vertical"]);
            let randomBlockEntries = getIndexesOf(randomBlock, line);

            if (randomBlockEntries.length === 0) {
                continue;
            }

            let indexOfChangeBlock = getRandomElementOf(randomBlockEntries);
            let replacementBlock;

            if (line[indexOfChangeBlock] === "vertical") {
                replacementBlock = "square";
            } else if (line[indexOfChangeBlock] === "double") {
                replacementBlock = "horizontals";
            }

            line.splice(indexOfChangeBlock, 1, replacementBlock);

            spaceToBeFilled = spaceToBeFilled - 1;
        }
    }
}

function eliminateLeftover(leftover, lines) {
    while (leftover > 0) {
        let randomLineIndex = getRandomNumber(0, lines.length);
        let randomLine = [...lines[randomLineIndex]];
        let randomBlock = getRandomElementOf(["horizontals", "double", "vertical"]);
        let randomBlockEntries = getIndexesOf(randomBlock, randomLine);
        let joinMethod;

        if (randomBlock === "horizontals") {
            joinMethod = joinVertically;
        } else if (randomBlock === "vertical") {
            joinMethod = joinHorizontally;
        } else if (randomBlock === "double") {
            joinMethod = leftover > 1 ? eitherOr(joinVertically, joinHorizontally) : joinVertically;
        }

        let joinMethodOutput = joinMethod(randomBlock, randomLine, randomBlockEntries);

        if (joinMethodOutput !== false) {
            let [newLine, leftoverToDelete] = joinMethodOutput;

            lines[randomLineIndex] = newLine;
            leftover = leftover - leftoverToDelete;
        }
    }
}

function generateGridMap(columns, totalItems) {
    const blockTypes = ["square", "horizontals", "vertical", "double"];
    const resultMap = [];

    let itemsAbleToSet = 0;
    let itemsLeft = totalItems;

    let lines = [];

    while (itemsLeft > 0) {
        let freeSpaceOfLine = columns;
        let line = [];

        while (freeSpaceOfLine > 0) {
            let selectedBlockType = getRandomElementOf(blockTypes);
            let spaceTaken = 0;
            let itemsAffected = 0;

            if (totalItems <= columns && itemsAbleToSet >= totalItems) {
                break;
            }

            if (itemsLeft < 2) {
                selectedBlockType = "vertical";
            }

            if (selectedBlockType === "square" && itemsLeft <= columns) {
                selectedBlockType = "horizontals";
            }

            if (freeSpaceOfLine < 2) {
                selectedBlockType = selectedBlockType === "square" ? "vertical" : "double";
            }

            if (["horizontals", "double"].includes(selectedBlockType)) {
                itemsAffected = 2;
            } else if (["square", "vertical"].includes(selectedBlockType)) {
                itemsAffected = 1;
            }

            if (["square", "horizontals"].includes(selectedBlockType)) {
                spaceTaken = 2;
            } else if (["vertical", "double"].includes(selectedBlockType)) {
                spaceTaken = 1;
            }

            itemsAbleToSet = itemsAbleToSet + itemsAffected;

            line.push(selectedBlockType);

            freeSpaceOfLine = freeSpaceOfLine - spaceTaken;
            itemsLeft = itemsLeft - itemsAffected;
        }

        lines.push(line);
    }

    let leftover = itemsAbleToSet - totalItems;

    eliminateLeftover(leftover, lines);

    if (totalItems === columns) {
        stretchBlocksFullWidth(columns, lines[0]);
    }

    for (let i = 0; i < lines.length; i++) {
        resultMap.push(...lines[i]);
    }

    return resultMap;
}

function drawGrid(root, itemTemplate, columns, data) {
    let gridMap = generateGridMap(columns, data.length);
    let result = "";
    let i = 0;
    let k = 0;

    while (k < gridMap.length) {
        let blockType = gridMap[k];
        let itemData = [data[i]];
        let step = 1;

        if (["horizontals", "double"].includes(blockType)) {
            itemData = data.slice(i, i + 2);
            step = 2;
        }

        result += block(blockType, itemData, itemTemplate);

        k = k + 1;
        i = i + step;
    }

    root.style = `width:${columns * 100}px`;
    root.innerHTML = result;
}

//
//
//
//--------------------------------------------------
//
//
//

function item(data) {
    return `
        <div id="${data.id}" class="item">${data.title}</div>
    `;
}

function block(type, itemData, item) {
    let content = "";

    itemData.map((data) => {
        content += item(data);
    });

    return `
        <div class="${type}">
            ${content}
        </div>
    `;
}

let data = Array(20)
    .fill("")
    .map((_, i) => {
        return { id: i, title: `#${i + 1}` };
    });

drawGrid(document.querySelector("#app"), item, 5, data);

document.querySelector("#clmn_5").addEventListener("click", () => {
    let data = Array(parseInt(document.querySelector("#items").value))
        .fill("")
        .map((_, i) => {
            return { id: i, title: `#${i + 1}` };
        });
    drawGrid(document.querySelector("#app"), item, 5, data);
});

document.querySelector("#clmn_4").addEventListener("click", () => {
    let data = Array(parseInt(document.querySelector("#items").value))
        .fill("")
        .map((_, i) => {
            return { id: i, title: `#${i + 1}` };
        });
    drawGrid(document.querySelector("#app"), item, 4, data);
});

document.querySelector("#clmn_3").addEventListener("click", () => {
    let data = Array(parseInt(document.querySelector("#items").value))
        .fill("")
        .map((_, i) => {
            return { id: i, title: `#${i + 1}` };
        });
    drawGrid(document.querySelector("#app"), item, 3, data);
});

document.querySelector("#clmn_2").addEventListener("click", () => {
    let data = Array(parseInt(document.querySelector("#items").value))
        .fill("")
        .map((_, i) => {
            return { id: i, title: `#${i + 1}` };
        });
    drawGrid(document.querySelector("#app"), item, 2, data);
});

document.querySelector("#columns").addEventListener("input", (e) => {
    let data = Array(parseInt(document.querySelector("#items").value))
        .fill("")
        .map((_, i) => {
            return { id: i, title: `#${i + 1}` };
        });

    drawGrid(document.querySelector("#app"), item, parseInt(e.target.value), data);
});

document.querySelector("#items").addEventListener("input", (e) => {
    let data = Array(parseInt(e.target.value))
        .fill("")
        .map((_, i) => {
            return { id: i, title: `#${i + 1}` };
        });

    drawGrid(document.querySelector("#app"), item, parseInt(document.querySelector("#columns").value), data);
});

// Array(10000)
//     .fill("")
//     .forEach((_, i) => {
//         // console.log(i);
//         document.querySelector("#clmn_5").click();
//     });
