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

function eitherOr(firstFunction, secondFunction) {
    if (Math.random() < 0.5) {
        return firstFunction();
    } else {
        return secondFunction();
    }
}

function joinVertically(dividedBlockType, line) {
    let result = [...line];

    let indexesOfBlocks = getIndexesOf(dividedBlockType, result);

    if (indexesOfBlocks.length > 0) {
        let indexOfPickedBlock = getRandomElementOf(indexesOfBlocks);

        result.splice(indexOfPickedBlock, 1, dividedBlockType === "horizontals" ? "square" : "vertical");

        return [result, 1];
    }
}

function joinHorizontally(halfWidthBlockType, line) {
    let result = [...line];

    let indexesOfBlocks = getIndexesOf(halfWidthBlockType, result);

    if (indexesOfBlocks.length > 1) {
        let replacementBlock;
        let spaceTaken;

        let firstPick = getRandomElementOf(indexesOfBlocks);
        indexesOfBlocks.splice(indexesOfBlocks.indexOf(firstPick), 1);
        let secondPick = getRandomElementOf(indexesOfBlocks);

        if (halfWidthBlockType === "vertical") {
            replacementBlock = "square";
            spaceTaken = 1;
        } else if (halfWidthBlockType === "double") {
            replacementBlock = "horizontals";
            spaceTaken = 2;
        }

        result[firstPick] = replacementBlock;
        result.splice(secondPick, 1);

        return [result, spaceTaken];
    }
}

function generateGridMap(columns, totalItems) {
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
            let selectedBlockType = getRandomElementOf(blockTypes);
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
        let randomLineIndex = getRandomNumber(0, lines.length);
        let line = lines[randomLineIndex];
        let randomBlock = getRandomElementOf(["horizontals", "double", "vertical"]);

        let result;

        switch (randomBlock) {
            case "horizontals":
                result = joinVertically("horizontals", line);
                break;
            case "vertical":
                result = joinHorizontally("vertical", line);
                break;
            case "double":
                if (leftover > 1) {
                    result = eitherOr(
                        () => joinVertically("double", line),
                        () => joinHorizontally("double", line)
                    );
                } else {
                    result = joinVertically("double", line);
                }

                break;
        }

        if (result) {
            let [newLine, leftoverToDelete] = result;

            leftover = leftover - leftoverToDelete;
            lines[randomLineIndex] = newLine;
        }
    }

    for (let i = 0; i < lines.length; i++) {
        resultMap.push(...lines[i]);
    }

    return resultMap;
}

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

function drawGrid(root, itemTemplate, columns, data) {
    let gridMap = generateGridMap(columns, data.length);
    let result = "";
    let i = 0;
    let k = 0;

    while (k < gridMap.length) {
        console.log(i);
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

let data = Array(80)
    .fill("")
    .map((_, i) => {
        return { id: i, title: `#_${i + 1}` };
    });

drawGrid(document.querySelector("#app"), item, 5, data);

document.querySelector("#lgx").addEventListener("click", () => {
    drawGrid(document.querySelector("#app"), item, 5, data);
});

document.querySelector("#lg").addEventListener("click", () => {
    drawGrid(document.querySelector("#app"), item, 4, data);
});

document.querySelector("#md").addEventListener("click", () => {
    drawGrid(document.querySelector("#app"), item, 3, data);
});

document.querySelector("#sm").addEventListener("click", () => {
    drawGrid(document.querySelector("#app"), item, 2, data);
});
