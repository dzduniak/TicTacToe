"use strict";

var canvas = document.getElementById("canvas");

canvas.width = 400;
canvas.height = 400;

canvas.setAttribute("style", "position: absolute;  left: 50%;margin-left:-200px; top: 50%;margin-top:-200px;");

var c = canvas.getContext("2d");

function drawBoard(board) {
    var step = canvas.width / 3;

    c.clearRect(0, 0, canvas.width, canvas.height);

    c.strokeStyle = "black";
    c.lineWidth = 5;

    c.beginPath();
    c.moveTo(step, 0);
    c.lineTo(step, canvas.height);
    c.stroke();

    c.beginPath();
    c.moveTo(step * 2, 0);
    c.lineTo(step * 2, canvas.height);
    c.stroke();

    c.beginPath();
    c.moveTo(0, step);
    c.lineTo(canvas.width, step);
    c.stroke();

    c.beginPath();
    c.moveTo(0, step * 2);
    c.lineTo(canvas.width, step * 2);
    c.stroke();

    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            if (board[y][x] === "x") {
                c.beginPath();
                c.moveTo(step * x + 30, step * y + 30);
                c.lineTo(step * (x + 1) - 30, step * (y + 1) - 30);
                c.stroke();

                c.beginPath();
                c.moveTo(step * x + 30, step * (y + 1) - 30);
                c.lineTo(step * (x + 1) - 30, step * y + 30);
                c.stroke();
            } else if (board[y][x] === "o") {
                c.beginPath();
                c.arc(x * step + step / 2, y * step + step / 2, step / 2 - 30, 0, Math.PI * 2);
                c.stroke();
            }
        }
    }
}

var board = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];
drawBoard(board);

var draw = false;

function gameOver(board) {
    var filled = 0;

    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            if (board[y][x] === "x" || board[y][x] === "o") {
                filled++;
            }
        }
    }

    function test(player) {
        return (board[0][0] === player && board[0][1] === player && board[0][2] === player) ||
            (board[1][0] === player && board[1][1] === player && board[1][2] === player) ||
            (board[2][0] === player && board[2][1] === player && board[2][2] === player) ||
            (board[0][0] === player && board[1][0] === player && board[2][0] === player) ||
            (board[0][1] === player && board[1][1] === player && board[2][1] === player) ||
            (board[0][2] === player && board[1][2] === player && board[2][2] === player) ||
            (board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
            (board[2][0] === player && board[1][1] === player && board[0][2] === player);
    }

    draw = false

    if (test("x") || test("o"))
        return true
    else {
        if (filled === 9) {
            draw = true;
            return true;
        }
    }

    return false;
}

function empty(board) {
    var array = [];

    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            if (board[y][x] === " ") {
                array.push({x: x, y: y});
            }
        }
    }

    return array;
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function indexOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var min = arr[0];
    var minIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }

    return minIndex;
}

var choice;
function minimax(board, aiMove, depth) {
    // Scoring
    if (gameOver(board)) {
        if (draw)
            return 0;
        if (aiMove)
            return 10;
        else
            return -10;
    }

    // Backtracking
    var scores = [];
    var moves = [];

    empty(board).forEach(function (move) {
        board[move.y][move.x] = aiMove ? "x" : "o";

        scores.push(minimax(board, !aiMove, depth + 1));
        moves.push(move);

        board[move.y][move.x] = " ";
    });

    var i;
    if (!aiMove) {
        i = indexOfMax(scores);
        choice = moves[i];
        return scores[i];
    } else {
        i = indexOfMin(scores);
        choice = moves[i];
        return scores[i];
    }
}

function computerMove() {
    minimax(board, true, 0);
    board[choice.y][choice.x] = "x";
    if (gameOver(board) && !draw) {
        setTimeout(function () {
            alert("AI wins!");
        });
    }
}

function playerMove(x, y) {
    if (gameOver(board)) {
        board = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];
    } else if (board[y][x] === " ") {
        board[y][x] = "o";
        if (gameOver(board) && !draw) {
            setTimeout(function () {
                alert("You win!");
            });
        } else
            computerMove();
    }

    drawBoard(board);
}


canvas.onclick = function (event) {
    var x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;

    var step = canvas.width / 3;

    playerMove(Math.floor(x / step), Math.floor(y / step));
};