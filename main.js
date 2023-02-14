import "./style.css";

const getRandomNumber = (from = 0, to = 1) => {
    return Math.floor(Math.random() * (to - from)) + from;
};

const getRandomElementOf = (array) => {
    return array[getRandomNumber(0, array.length)];
};

const getIndexesOf = (value, array) => {
    return array
        .map((elem, index) => elem === value && index)
        .filter((elem) => elem !== false);
};

const eitherOr = (firstStatement, secondStatement) => {
    return Math.random() < 0.5 ? firstStatement : secondStatement;
};

const isFullWidthBlock = (blockType) => {
    return ["square", "horizontals"].includes(blockType);
};

const isHalfWidthBlock = (blockType) => {
    return ["vertical", "double"].includes(blockType);
};

const isOneItemBlock = (blockType) => {
    return ["square", "vertical"].includes(blockType);
};

const isTwoItemBlock = (blockType) => {
    return ["horizontals", "double"].includes(blockType);
};

const evaluateSpaceTaken = (line) => {
    return line.reduce((accumulator, blockType) => {
        if (isFullWidthBlock(blockType)) {
            return (accumulator = accumulator + 2);
        } else if (isHalfWidthBlock(blockType)) {
            return (accumulator = accumulator + 1);
        }
    }, 0);
};

function joinVertically(dividedBlockType, randomLine, randomBlockEntries) {
    if (randomBlockEntries.length <= 0) {
        return false;
    }

    let indexOfPickedBlock = getRandomElementOf(randomBlockEntries);

    randomLine.splice(
        indexOfPickedBlock,
        1,
        dividedBlockType === "horizontals" ? "square" : "vertical"
    );

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
        let randomBlock = getRandomElementOf([
            "horizontals",
            "double",
            "vertical",
        ]);
        let randomBlockEntries = getIndexesOf(randomBlock, randomLine);
        let joinMethod;

        if (randomBlock === "horizontals") {
            joinMethod = joinVertically;
        } else if (randomBlock === "vertical") {
            joinMethod = joinHorizontally;
        } else if (randomBlock === "double") {
            joinMethod =
                leftover > 1
                    ? eitherOr(joinVertically, joinHorizontally)
                    : joinVertically;
        }

        let joinMethodOutput = joinMethod(
            randomBlock,
            randomLine,
            randomBlockEntries
        );

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
                selectedBlockType =
                    selectedBlockType === "square" ? "vertical" : "double";
            }

            if (isTwoItemBlock(selectedBlockType)) {
                itemsAffected = 2;
            } else if (isOneItemBlock(selectedBlockType)) {
                itemsAffected = 1;
            }

            if (isFullWidthBlock(selectedBlockType)) {
                spaceTaken = 2;
            } else if (isHalfWidthBlock(selectedBlockType)) {
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

//
//
//
//--------------------------------------------------
//
//
//

function itemTemplate(data) {
    return `
        <div id="${data.id}" class="item">${data.title}</div>
    `;
}

function blockTemplate(type, itemData, item) {
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

function drawGrid(root, itemTemplate, columns, data) {
    let gridMap = generateGridMap(columns, data.length);
    let result = "";
    let i = 0;
    let k = 0;

    while (gridMap.length > k) {
        let blockType = gridMap[k];
        let itemData = [data[i]];
        let step = 1;

        if (["horizontals", "double"].includes(blockType)) {
            itemData = data.slice(i, i + 2);
            step = 2;
        }

        result += blockTemplate(blockType, itemData, itemTemplate);

        k = k + 1;
        i = i + step;
    }

    root.style = `width:${columns * 150}px`;
    root.innerHTML = result;
}

function generateData(dataLength) {
    return Array(dataLength)
        .fill("")
        .map((_, i) => {
            return { id: i, title: `#${i + 1}` };
        });
}

let columnsVal = 5;
let itemsLength = 80;

const gridRoot = document.querySelector("#app");
let data = generateData(itemsLength);

document.querySelector("#data-length").value = itemsLength;
document.querySelector("#columns").value = columnsVal;

drawGrid(gridRoot, itemTemplate, columnsVal, data);

document.querySelector("#clmns_5").addEventListener("click", () => {
    drawGrid(gridRoot, itemTemplate, 5, data);
});

document.querySelector("#clmns_4").addEventListener("click", () => {
    drawGrid(gridRoot, itemTemplate, 4, data);
});

document.querySelector("#clmns_3").addEventListener("click", () => {
    drawGrid(gridRoot, itemTemplate, 3, data);
});

document.querySelector("#clmns_2").addEventListener("click", () => {
    drawGrid(gridRoot, itemTemplate, 2, data);
});

document.querySelector("#clmns_1").addEventListener("click", () => {
    drawGrid(gridRoot, itemTemplate, 1, data);
});

document.querySelector("#columns").addEventListener("input", (e) => {
    columnsVal = parseInt(e.target.value);

    drawGrid(gridRoot, itemTemplate, columnsVal, data);
});

document.querySelector("#data-length").addEventListener("input", (e) => {
    data = generateData(parseInt(e.target.value));
    itemsLength = data.length;

    drawGrid(gridRoot, itemTemplate, columnsVal, data);
});
