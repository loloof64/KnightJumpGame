import store from "../store";

function generateSingleCoordinate() {
  return parseInt(Math.floor(Math.random() * 8));
}

function generateCell() {
  const col = generateSingleCoordinate();
  const row = generateSingleCoordinate();

  return { col, row };
}

function getFreeNeighbourCells({ cell, playerKnightPosition, opponentPieces }) {
  const directions = [
    { dx: -1, dy: -2 },
    { dx: -1, dy: +2 },
    { dx: +1, dy: -2 },
    { dx: +1, dy: +2 },
    { dx: -2, dy: -1 },
    { dx: -2, dy: +1 },
    { dx: +2, dy: -1 },
    { dx: +2, dy: +1 },
  ];

  let possibilities = directions.map((item) => {
    return {
      col: item.dx + cell.col,
      row: item.dy + cell.row,
    };
  });

  possibilities = possibilities.filter(
    (item) => item.col >= 0 && item.col <= 7 && item.row >= 0 && item.row <= 7
  );

  possibilities = possibilities.filter(
    (item) =>
      !opponentPieces.find(
        (opponent) => opponent.col === item.col && opponent.row === item.row
      ) &&
      (playerKnightPosition.col !== item.col ||
        playerKnightPosition.row !== item.row)
  );

  return possibilities;
}

function generateValue() {
  const availableValues = ["P", "N", "B", "R", "Q", "K"];
  return availableValues[
    parseInt(Math.floor(Math.random() * availableValues.length))
  ];
}

export const OPPONENTS_MIN_COUNT = 6;
export const OPPONENTS_MAX_COUNT = 30;
const TIMEOUT = 1000 * 60 * 2;

function getNextOpponent({
  currentCell,
  playerKnightPosition,
  opponentPieces,
}) {
  const freeNeighbours = getFreeNeighbourCells({
    cell: currentCell,
    playerKnightPosition,
    opponentPieces,
  });
  if (freeNeighbours.length === 0) {
    return;
  }
  const nextCellIndex = parseInt(
    Math.floor(Math.random() * freeNeighbours.length)
  );
  const nextCell = freeNeighbours[nextCellIndex];
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
    let cancelRequest = false;

    function activateMustBreakFlag() {
      mustBreak = true;
    }

    function checkCancelRequest() {
      if (store.state.generationCancelRequest) {
        cancelRequest = true;
      }
    }

    const breakTimeoutHandle = setTimeout(activateMustBreakFlag, TIMEOUT);
    const checkCancelRequestIntervalHandle = setInterval(
      checkCancelRequest,
      30
    );

    function iteration() {
      const nextOpponentResult = getNextOpponent({
        currentCell,
        playerKnightPosition,
        opponentPieces: opponents,
      });
      if (nextOpponentResult) {
        const { nextOpponent, nextCell } = nextOpponentResult;
        opponents.push(nextOpponent);
        currentCell = nextCell;
        store.dispatch("incrementGenerationStepProgress");
      }

      if (mustBreak) {
        clearTimeout(breakTimeoutHandle);
        clearInterval(checkCancelRequestIntervalHandle);
        resolve("timeout");
        return;
      } else if (cancelRequest) {
        clearTimeout(breakTimeoutHandle);
        clearInterval(checkCancelRequestIntervalHandle);
        resolve("cancelled");
        return;
      } else if (opponents.length === opponentsCount) {
        clearTimeout(breakTimeoutHandle);
        clearInterval(checkCancelRequestIntervalHandle);
        resolve(opponents);
        return;
      } else {
        setTimeout(iteration, 50);
      }
    }

    iteration();
  });
}

function generateAnswerDataFromGameData(gameData) {
  let answer = [];
  answer.push(gameData);

  let playerPos = {...gameData.playerKnight};
  let opponents = [...gameData.opponentPieces];

  for (const currentOpponent of gameData.opponentPieces) {
    playerPos = { col: currentOpponent.col, row: currentOpponent.row };
    opponents.shift();

    answer.push({
      playerKnight: playerPos,
      opponentPieces: [...opponents],
    });
  }

  return answer;
}

export function generatePosition(opponentsCount) {
  return new Promise((resolve, reject) => {
    store.dispatch("setGenerationStepsCount", opponentsCount);
    store.dispatch("setOpponentPiecesCount", opponentsCount);

    const playerKnightPosition = generateCell();
    generateOpponents(playerKnightPosition, opponentsCount)
      .then((opponentPieces) => {
        if (opponentPieces === "timeout" || opponentPieces === "cancelled")
          reject(opponentPieces);

        store.dispatch("resetCancelGenerationFlag");

        const gameData = {
          playerKnight: playerKnightPosition,
          opponentPieces,
        };

        const answerData = generateAnswerDataFromGameData(gameData);

        store.dispatch("setAnswerData", answerData);

        resolve(gameData);
      })
      .catch((err) => {
        store.dispatch("resetCancelGenerationFlag");

        console.error(err);
        reject();
      });
  });
}
