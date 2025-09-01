let board;
let score = 0;
let rows = 4;
let columns = 4;
const boardElement = document.getElementById("board");

window.onload = function () {
    setGame();
}
document.getElementById("play-again").addEventListener("click", playAgain);

function setGame() {
    boardElement.innerHTML = "";
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    // board = [
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [4, 4, 8, 8],
    //     [4, 4, 8, 8]
    // ]
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const tile = document.createElement("div");
            tile.id = i.toString() + '-' + j.toString();
            let num = board[i][j];
            updateTile(tile, num); // ui part - instead we can directly manipulate the tile element by changing the innerText
            boardElement.append(tile);
        }
    }
    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.className = ""; //clear the classList- x2, x4, x8
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

function handleKeyUp(e) {
    if (e.key == "ArrowLeft") {
        slideLeft();
        setTwo();
    }
    else if (e.key == "ArrowRight") {
        slideRight();
        setTwo();
    }
    else if (e.key == "ArrowUp") {
        slideUp();
        setTwo();
    }
    else if (e.key == "ArrowDown") {
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText = score;
}

document.addEventListener("keyup", handleKeyUp);

function filterZero(row) {
    return row.filter(num => num !== 0); // it will create a new array except zeroes 
}

function slide(row) {
    // [0,2,2,2]
    row = filterZero(row); // get rid of zeroes -> [2,2,2]
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        } //[2,2,2]->[4,0,2]
    }
    row = filterZero(row); // [4,2]

    // add zeroes
    while (row.length < columns) {
        row.push(0);
    }//[4,2,0,0]

    return row;
}

function slideLeft() {
    for (let i = 0; i < rows; i++) {
        let row = board[i];
        row = slide(row);
        board[i] = row;
        // update the UI
        for (let j = 0; j < columns; j++) {
            const tile = document.getElementById(i.toString() + '-' + j.toString());
            let num = board[i][j];
            updateTile(tile, num);
        }
    }
}
function slideRight() {
    for (let i = 0; i < rows; i++) {
        let row = board[i];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[i] = row;

        // update the ui
        for (let j = 0; j < columns; j++) {
            const tile = document.getElementById(i.toString() + '-' + j.toString());
            let num = board[i][j];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let j = 0; j < columns; j++) {
        let row = [board[0][j], board[1][j], board[2][j], board[3][j]];
        row = slide(row);
        // for (let i = 0; i < rows; i++) {
        //     board[i][j] = row[i];
        // } written down in update ui for loop
        // update ui
        for (let i = 0; i < rows; i++) {
            board[i][j] = row[i];
            const tile = document.getElementById(i.toString() + '-' + j.toString());
            let num = board[i][j];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let j = 0; j < columns; j++) {
        let row = [board[0][j], board[1][j], board[2][j], board[3][j]];
        row.reverse();
        row = slide(row);
        row.reverse();
        // for (let i = 0; i < rows; i++) {
        //     board[i][j] = row[i];
        // } written down in update ui for loop
        // update ui
        for (let i = 0; i < rows; i++) {
            board[i][j] = row[i];
            const tile = document.getElementById(i.toString() + '-' + j.toString());
            let num = board[i][j];
            updateTile(tile, num);
        }
    }
}

function hasEmptyTile() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (board[i][j] === 0) {
                return true;
            }
        }
    }
    return false;
}
function setTwo() {
    if (!hasEmptyTile()) return;

    let found = false;
    while (!found) {
        //find random row and column to place a 2 in
        let row = Math.floor(Math.random() * rows); //0-1*4 ->0-4.. random give random value btw 0 and 1 and then we multiply it with 4 so that the number come in btw 0-4 and then we do a floor to get rid of decimal
        let col = Math.floor(Math.random() * columns);
        if (board[row][col] === 0) {
            board[row][col] = 2;
            let tile = document.getElementById(row.toString() + "-" + col.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
    // Check for game over
    if (checkGameOver()) {
        gameOver();
    }
}
function checkGameOver() {
    if (hasEmptyTile()) return false; // Still empty spots → not game over

    // Check for possible merges horizontally
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns - 1; j++) {
            if (board[i][j] === board[i][j + 1]) {
                return false; // merge possible → not game over
            }
        }
    }

    // Check for possible merges vertically
    for (let j = 0; j < columns; j++) {
        for (let i = 0; i < rows - 1; i++) {
            if (board[i][j] === board[i + 1][j]) {
                return false; // merge possible → not game over
            }
        }
    }

    return true; // no empty tile + no merge → game over
}

function playAgain() {
    score = 0;
    document.getElementById("score").innerText = score;
    setGame(); // restart game
    document.getElementById("play-again").style.display = "none"; // hide button again
}
function gameOver() {
    document.removeEventListener("keyup", handleKeyUp);
    setTimeout(() => {
        alert("Game Over! Final Score: " + score);
        document.getElementById("play-again").style.display = "inline-block"; // show button
    }, 200);
}