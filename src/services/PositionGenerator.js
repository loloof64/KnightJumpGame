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

    return absDeltaCol > 0 && absDeltaRow > 0 && (absDeltaCol + absDeltaRow === 3);
}

function generateValue() {
    const availableValues = ['P', 'N', 'B', 'R', 'Q', 'K'];
    return availableValues[parseInt(Math.floor(Math.random() * availableValues.length))];
}

export const OPPONENTS_MIN_COUNT = 6;
export const OPPONENTS_MAX_COUNT = 30;

function generateOpponents(playerKnightPosition, opponentsCount) {
  if (opponentsCount > OPPONENTS_MAX_COUNT)
    opponentsCount = OPPONENTS_MAX_COUNT;
  if (opponentsCount < OPPONENTS_MIN_COUNT)
    opponentsCount = OPPONENTS_MIN_COUNT;
  let opponents = [];
  let currentCell = playerKnightPosition;

  while (opponents.length < opponentsCount) {
      const nextCell = generateCell();
      if (!cellsAreConnectedBySingleKnightJump(currentCell, nextCell)) {
          continue;
      }
      if (cellOccupied(nextCell, playerKnightPosition, opponents)) {
          continue;
      }
      const value = generateValue();
      const nextOpponent = {value, ...nextCell};

      opponents.push(nextOpponent);
      currentCell = nextCell;
  }

  return opponents;
}

export function generatePosition(opponentsCount) {
  return new Promise((resolve) => {
    const playerKnightPosition = generateCell();
    const opponentsPieces = generateOpponents(playerKnightPosition, opponentsCount);

    resolve({
      playerKnight: playerKnightPosition,
      opponentsPieces,
    });
  });
}
