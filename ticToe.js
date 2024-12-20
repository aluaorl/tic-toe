const N = 7;
const MAX_PLAYERS = 5;
const VALID_PLAYERS = [-1, 1];
const VALID_PLAYERS_SYMBOLS = ["X", "O"];
const SYMBOLS = ["😔", "🥺", "🙈"];
let currentRound = 0;
let currentPlayer = 0;
let isGameEnd = false;

const field = Array.from({ length: N }, () =>
  Array.from({ length: N }, () => " ")
);
const cells = [];

function render() {
  const fieldEl = document.getElementById("field");
  field.forEach((row, i) => {
    const rowEl = document.createElement("tr");
    row.forEach((cell, j) => {
      const cellEl = document.createElement("td");
      cellEl.addEventListener("click", () => handleCellClick(i, j));
      cellEl.innerText = getPlayerValue(cell);
      rowEl.appendChild(cellEl);
      cells.push(cellEl);
    });
    fieldEl.appendChild(rowEl);
  });
}
function ChoosePlayerCount() {
  const count = parseInt(document.getElementById("playerCount").value);
  VALID_PLAYERS.length = count;
  VALID_PLAYERS_SYMBOLS.length = count;
  Array.from({ length: count })
    .fill()
    .map((_, i) => {
      if (i < 2) {
        VALID_PLAYERS[i] = i - 1;
        VALID_PLAYERS_SYMBOLS[i] = i === 0 ? "X" : "O";
      } else {
        VALID_PLAYERS[i] = i + 1;
        VALID_PLAYERS_SYMBOLS[i] = SYMBOLS[i % SYMBOLS.length];
      }
    });
  currentRound = 0;
  currentPlayer = 0;
  isGameEnd = false;
  field.forEach((row) => row.fill(" "));
  cells.length = 0;
  const fieldEl = document.getElementById("field");
  fieldEl.innerHTML = "";
  render();
  updateInfoText();
}

function fillCell(rowIndex, colIndex, player) {
  field[rowIndex][colIndex] = player;
  const cellIndex = rowIndex * N + colIndex;
  cells[cellIndex].innerHTML = getPlayerValue(player);
}

function getPlayerValue(player) {
  const index = VALID_PLAYERS.indexOf(player);
  return index >= 0 ? VALID_PLAYERS_SYMBOLS[index] : " ";
}

function updateInfoText() {
  const player = VALID_PLAYERS[currentPlayer];
  const infoText = `Ход номер ${
    currentRound + 1
  }. Сейчас ходит ${getPlayerValue(player)}`;
  document.getElementById("result").innerText = infoText;
}

function handleCellClick(rowIndex, colIndex) {
  if (isGameEnd || field[rowIndex][colIndex] !== " ") {
    return;
  }
  const player = VALID_PLAYERS[currentRound % VALID_PLAYERS.length];
  fillCell(rowIndex, colIndex, player);
  currentRound++;
  if (isWin(rowIndex, colIndex)) {
    isGameEnd = true;
    const gameWinText = `На ходу ${currentRound} победил ${getPlayerValue(
      player
    )}`;
    showText(gameWinText);
    disableClicks();
  } else if (currentRound === N * N) {
    isGameEnd = true;
    const gameDrawText = `На ходу ${currentRound} ничья`;
    showText(gameDrawText);
    disableClicks();
  } else {
    currentPlayer = (currentPlayer + 1) % VALID_PLAYERS.length;
    updateInfoText();
  }
}
function handleButtonClick() {
  ChoosePlayerCount();
  const winRules = parseInt(document.getElementById("winThreshold").value);
  if (winRules >= 3 && winRules <= 7) {
    WIN_THRESHOLD = winRules;
  }
}
const startButton = document.getElementById("combineButton");
startButton.addEventListener("click", handleButtonClick);

function isWin(rowIndex, colIndex) {
  const currentPlayer = field[rowIndex][colIndex];

  const sequenceCheck = (filteredCells) => {
    let sequenceCount = 0;
    let isWin = false;

    filteredCells.forEach((cell) => {
      if (cell === currentPlayer) {
        sequenceCount++;
        if (sequenceCount >= WIN_THRESHOLD) {
          isWin = true;
        }
      } else {
        sequenceCount = 0;
      }
    });

    return isWin;
  };

  const horizontalCells = field[rowIndex];
  if (sequenceCheck(horizontalCells)) {
    return true;
  }

  const verticalCells = field.map((row) => row[colIndex]);
  if (sequenceCheck(verticalCells)) {
    return true;
  }

  const mainDiagonalIndex = colIndex - rowIndex;
  const mainDiagonalCells = field.map((row, index) => row[index + mainDiagonalIndex]).filter((cell) => cell !== undefined);
  if (sequenceCheck(mainDiagonalCells)) {
    return true;
  }

  const sideDiagonalIndex = colIndex + rowIndex;
  const sideDiagonalCells = field.map((row, index) => row[sideDiagonalIndex - index]).filter((cell) => cell !== undefined);
  if (sequenceCheck(sideDiagonalCells)) {
    return true;
  }

  return false;
}

function showText(text) {
  const resultEl = document.getElementById("result");
  resultEl.innerText = text;
}

function disableClicks() {
  cells.forEach((cell) => {
    cell.removeEventListener("click", () => handleCellClick());
  });
}
render();
