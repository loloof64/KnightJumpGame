function generateSingleCoordinate() {
  return parseInt(Math.floor(Math.random() * 8));
}

function generateCell() {
  const col = generateSingleCoordinate();
  const row = generateSingleCoordinate();

  return { col, row };
}

function cellOccupied(cell, playerKnightPosition, opponents) {
  if (
    cell.col === playerKnightPosition.col &&
    cell.row === playerKnightPosition.row
  ) {
    return true;
  }
  if (
    opponents.find(
      (singleOpponent) =>
        cell.col === singleOpponent.col && cell.row === singleOpponent.row
    )
  ) {
    return true;
  }
  return false;
}

function cellsAreConnectedBySingleKnightJump(cell1, cell2) {
  const absDeltaCol = Math.abs(cell1.col - cell2.col);
  const absDeltaRow = Math.abs(cell1.row - cell2.row);

  return absDeltaCol > 0 && absDeltaRow > 0 && absDeltaCol + absDeltaRow === 3;
}

function generateValue() {
  const availableValues = ["P", "N", "B", "R", "Q", "K"];
  return availableValues[
    parseInt(Math.floor(Math.random() * availableValues.length))
  ];
}

export const OPPONENTS_MIN_COUNT = 6;
export const OPPONENTS_MAX_COUNT = 45;
const TIMEOUT = 1000 * 30;

function getNextOpponent({ currentCell, playerKnightPosition, opponents }) {
  const nextCell = generateCell();
  if (!cellsAreConnectedBySingleKnightJump(currentCell, nextCell)) {
    return;
  }
  if (cellOccupied(nextCell, playerKnightPosition, opponents)) {
    return;
  }
  const value = generateValue();
  const nextOpponent = { value, ...nextCell };
  return { nextOpponent, nextCell };
}

function generateOpponents(playerKnightPosition, opponentsCount) {
  return new Promise((resolve) => {
    if (opponentsCount > OPPONENTS_MAX_COUNT)
      opponentsCount = OPPONENTS_MAX_COUNT;
    if (opponentsCount < OPPONENTS_MIN_COUNT)
      opponentsCount = OPPONENTS_MIN_COUNT;
    let opponents = [];
    let currentCell = playerKnightPosition;

    let mustBreak = false;

    function activateMustBreakFlag() {
      mustBreak = true;
    }

    const breakTimeoutHandle = setTimeout(activateMustBreakFlag, TIMEOUT);

    function iteration() {
      const nextOpponentResult = getNextOpponent({
        currentCell,
        playerKnightPosition,
        opponents,
      });
      if (nextOpponentResult) {
        const {nextOpponent, nextCell} = nextOpponentResult;
        opponents.push(nextOpponent);
        currentCell = nextCell;
      }

      if (mustBreak) {
        clearTimeout(breakTimeoutHandle);
        resolve();
        return;
      } else if (opponents.length === opponentsCount) {
        clearTimeout(breakTimeoutHandle);
        resolve(opponents);
        return;
      } else {
        setTimeout(iteration, 50);
      }
    }

    iteration();
  });
}

export function generatePosition(opponentsCount) {
  return new Promise((resolve, reject) => {
    const playerKnightPosition = generateCell();
    generateOpponents(playerKnightPosition, opponentsCount).then(
      (opponentsPieces) => {

        if (!opponentsPieces) reject();

        resolve({
          playerKnight: playerKnightPosition,
          opponentsPieces,
        });
      }
    ).catch((err) => {
      console.error(err);
      reject()
    });
  });
}
