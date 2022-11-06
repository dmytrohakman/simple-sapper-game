let elements = [];
let holesIndexes = [];
let width = 0, height = 0, holes = 0;
let openedElements = [];

const buildPlayground = () => {
    clearData();
    width = parseInt(document.getElementById('width').value) || 0;
    height = parseInt(document.getElementById('height').value) || 0;
    holes = parseInt(document.getElementById('holes').value) || 0;
    if (width === 0 || height === 0 || holes === 0) {
        alert("Please provide data!");
        return;
    }

    generateHoleList(height, width);
    generateBoard(height, width);
}

const generateBoard = (height, width) => {
    let index = 1;
    let playgroundElements = '';
    for (let i = 1; i <= height; i++) {
        let row = "<div class=\"row\">"
        for (let j = 1; j <= width; j++) {
            row += `<a class="cell" onClick="checkCell(event)" data-height-index="${i}" data-width-index="${j}" data-main-index="${index}" href="#"></a>`;

            index++;
        }
        row += "</div>"
        playgroundElements += row;
    }

    document.getElementById('playground').innerHTML = playgroundElements;
}

const generateHoleList = (height, width) => {
    while (holesIndexes.length !== holes) {
        let randomValue = getRandomInt(width * height);
        if (!holesIndexes.includes(randomValue)) {
            holesIndexes.push(randomValue);
        }
    }
}

const checkCell = (event) => {
    const cell = event.target;
    const mainIndex = parseInt(cell.dataset.mainIndex);
    const relatedElements = getRelatedElements(mainIndex);

    if (isOpenedCell(mainIndex)) {
        return;
    }

    openCell(mainIndex, calculateAmoutOfHolesRelated(mainIndex));
    proceedRelatedElements(mainIndex, relatedElements);
}

const getCellByIndex = (index) => {
    return document.querySelector(`[data-main-index="${index}"]`);
}

const isOpenedCell = (index) => {
    return openedElements.includes(index);
}

const isHole = (index) => {
    return holesIndexes.includes(index);
}

const openCell = (index, numberOfHolesNear = 0) => {
    const cell = getCellByIndex(index);

    if (holesIndexes.includes(parseInt(index))) {
        cell.style.background = 'black';
        resetGame(false);

        return;
    } else {
        cell.style.background = 'green';
        openedElements.push(index);
    }

    if (!isHole(index) && numberOfHolesNear !== 0) {
        cell.textContent = `${numberOfHolesNear}`;
    }

    if (openedElements.length + holesIndexes.length === width * height) {
        resetGame();
    }
}

const proceedRelatedElements = (mainIndex, relatedElements) => {
    if (isHole(mainIndex)) {
        return;
    }
    let relatedElementsWithNoHoles = relatedElements;
    while (relatedElementsWithNoHoles.length !== 0) {
        let relatedCellIndex = relatedElementsWithNoHoles.shift();
        if (isOpenedCell(relatedCellIndex) || isHole(relatedCellIndex)) {
            continue;
        }

        let countOfHolesNear = calculateAmoutOfHolesRelated(relatedCellIndex);
        openCell(relatedCellIndex, countOfHolesNear);

        if (countOfHolesNear === 0) {
            let relatedElements = getRelatedElements(relatedCellIndex);
            proceedRelatedElements(relatedCellIndex, relatedElements);
        }
    }
}

const getRelatedElements = (index) => {
    let cell = getCellByIndex(index);
    let widthIndex = parseInt(cell.dataset.widthIndex);
    let heightIndex = parseInt(cell.dataset.heightIndex);

    let isLeftElement = 1 === widthIndex;
    let isRightElement = width === widthIndex;
    let isFirstRow = 1 === heightIndex;
    let isLastRow = height === heightIndex;

    let elementRalated;
    if (isLeftElement) {
        if (isFirstRow) {
            elementRalated = [
                index + 1,
                index + width + 1,
                index + width
            ];
        } else if (isLastRow) {
            elementRalated = [
                index + 1,
                index - width + 1,
                index - width
            ];
        } else {
            elementRalated = [
                index + width + 1,
                index + width,
                index + 1,
                index - width + 1,
                index - width
            ];
        }
    } else if (isRightElement) {
        if (isFirstRow) {
            elementRalated = [
                index - 1,
                index + width - 1,
                index + width
            ];
        } else if (isLastRow) {
            elementRalated = [
                index - 1,
                index - width - 1,
                index - width
            ];
        } else {
            elementRalated = [
                index + width - 1,
                index + width,
                index - 1,
                index - width - 1,
                index - width
            ];
        }
    } else {
        if (isFirstRow) {
            elementRalated = [
                index - 1,
                index + 1,
                index + width - 1,
                index + width,
                index + width + 1,
            ];
        } else if (isLastRow) {
            elementRalated = [
                index - width - 1,
                index - width,
                index - width + 1,
                index - 1,
                index + 1,
            ];
        } else {
            elementRalated = [
                index - width - 1,
                index - width,
                index - width + 1,
                index - 1,
                index + 1,
                index + width - 1,
                index + width,
                index + width + 1,
            ];
        }
    }

    return elementRalated;
}

const calculateAmoutOfHolesRelated = (index) => {
    const relatedElements = getRelatedElements(index);
    let amountOfHolesAround = 0;
    for (const relatedElementsKey in relatedElements) {
        if (holesIndexes.includes(relatedElements[relatedElementsKey])) {
            amountOfHolesAround++;
        }
    }

    return amountOfHolesAround;
}

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

const clearData = () => {
    holes = 0;
    height = 0;
    width = 0;
    holesIndexes = [];
    elements = [];
    openedElements = [];
    const playground = document.getElementById('playground');
    playground.innerHTML = '';
}

const resetGame = (win = true) => {
    showHoles();
    setTimeout(function() {
        let tryAgain = win ? confirm('You win! Try again?') : confirm('You lose! Try again?');

        if (tryAgain) {
            buildPlayground();
        } else {
            clearData();
        }
    }, 50);
}

const showHoles = () => {
    for (let holeIndex in holesIndexes) {
        let hole = getCellByIndex(holesIndexes[holeIndex]);
        if (null !== hole) {
            hole.style.background = 'black';
        }
    }
}
