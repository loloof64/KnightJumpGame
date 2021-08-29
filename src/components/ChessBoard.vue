<template>
  <div
    ref="rootElt"
    class="grid"
    @mousedown="handleDragStart"
    @mousemove="handleDrag"
    @mouseup="handleDragEnd"
  >
    <div
      class="grid_row"
      v-for="row in [0, 1, 2, 3, 4, 5, 6, 7]"
      :key="'row_' + row"
    >
      <div
        :class="classForCell(row, col)"
        v-for="col in [0, 1, 2, 3, 4, 5, 6, 7]"
        :key="'cell_' + row + col"
      ></div>
    </div>
    <div class="pieces_layer">
      <img
        id="player_knight"
        src="@/assets/chess_vectors/Chess_nlt45.svg"
        :style="{
          left: playerKnightLeft,
          top: playerKnightTop,
        }"
        width="50"
        height="50"
      />
      <img
        class="opponent_piece"
        v-for="(piece, index) in opponentPieces"
        :key="index"
        :src="opponentImageForValue(piece.value)"
        :style="{
          left: getXForCol(piece.col),
          top: getYForRow(piece.row),
        }"
        width="50"
        height="50"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";

import { generatePosition } from "@/services/PositionGenerator";

import * as BK from "@/assets/chess_vectors/Chess_kdt45.svg";
import * as BQ from "@/assets/chess_vectors/Chess_qdt45.svg";
import * as BR from "@/assets/chess_vectors/Chess_rdt45.svg";
import * as BB from "@/assets/chess_vectors/Chess_bdt45.svg";
import * as BN from "@/assets/chess_vectors/Chess_ndt45.svg";
import * as BP from "@/assets/chess_vectors/Chess_pdt45.svg";

const cellSizePx = 50;

export default {
  setup() {
    const rootElt = ref();
    const dndData = ref();

    const playerKnightPos = ref({
      col: -1000,
      row: -1000,
    });

    const opponentPieces = ref([]);

    function classForCell(row, col) {
      return (row + col) % 2 == 0
        ? { white_cell: true, black_cell: false }
        : { white_cell: false, black_cell: true };
    }

    function isPlayerKnightPos(row, col) {
      return (
        row === playerKnightPos.value.row && col === playerKnightPos.value.col
      );
    }

    function handleDragStart(event) {
      const { clientX, clientY } = event;
      const rootElementRect = rootElt.value.getBoundingClientRect();
      const rootEltX = rootElementRect.left;
      const rootEltY = rootElementRect.top;
      const evtX = clientX - rootEltX;
      const evtY = clientY - rootEltY;

      const evtCol = parseInt(Math.floor(evtX / cellSizePx));
      const evtRow = parseInt(Math.floor(evtY / cellSizePx));

      const isPlayerKnightCell =
        evtCol === playerKnightPos.value.col &&
        evtRow === playerKnightPos.value.row;

      if (!isPlayerKnightCell) return;
      dndData.value = {
        left: evtCol * cellSizePx,
        top: evtRow * cellSizePx,
      };
    }

    function handleDrag(event) {
      if (!dndData.value) return;

      const { clientX, clientY } = event;
      const rootElementRect = rootElt.value.getBoundingClientRect();
      const rootEltX = rootElementRect.left;
      const rootEltY = rootElementRect.top;
      const evtX = clientX - rootEltX;
      const evtY = clientY - rootEltY;

      dndData.value = {
        left: evtX,
        top: evtY,
      };
    }

    function handleValidMove(eventCol, eventRow) {
      const pieceOnSquare = opponentPieces.value.find(
        (item) => item.col === eventCol && item.row === eventRow
      );
      if (pieceOnSquare) {
        opponentPieces.value = opponentPieces.value.filter(
          (item) => item !== pieceOnSquare
        );
        playerKnightPos.value = {
          col: eventCol,
          row: eventRow,
        };
      } else {
        dndData.value = undefined;
      }
    }

    function handleDragEnd(event) {
      if (!dndData.value) return;

      const { clientX, clientY } = event;
      const rootElementRect = rootElt.value.getBoundingClientRect();
      const rootEltX = rootElementRect.left;
      const rootEltY = rootElementRect.top;
      const evtX = clientX - rootEltX;
      const evtY = clientY - rootEltY;

      const evtCol = parseInt(Math.floor(evtX / cellSizePx));
      const evtRow = parseInt(Math.floor(evtY / cellSizePx));

      const colInBounds = evtCol >= 0 && evtCol <= 7;
      const rowInBounds = evtRow >= 0 && evtRow <= 7;

      if (colInBounds && rowInBounds) {
        const absDeltaCol = Math.abs(playerKnightPos.value.col - evtCol);
        const absDeltaRow = Math.abs(playerKnightPos.value.row - evtRow);

        const validMove =
          absDeltaCol > 0 && absDeltaRow > 0 && absDeltaRow + absDeltaCol === 3;
        if (validMove) {
          handleValidMove(evtCol, evtRow);
        }
      }

      dndData.value = undefined;
    }

    const dndIsActive = computed(() => !!dndData.value);

    const playerKnightLeft = computed(() => {
      const newValue = dndData.value
        ? dndData.value.left
        : playerKnightPos.value.col * cellSizePx;
      return newValue + "px";
    });
    const playerKnightTop = computed(() => {
      const newValue = dndData.value
        ? dndData.value.top
        : playerKnightPos.value.row * cellSizePx;
      return newValue + "px";
    });

    function opponentImageForValue(value) {
      switch (value.toLowerCase()) {
        case "k":
          return BK;
        case "q":
          return BQ;
        case "r":
          return BR;
        case "b":
          return BB;
        case "n":
          return BN;
        case "p":
          return BP;
        default:
          return;
      }
    }

    function getXForCol(col) {
      return col * cellSizePx + "px";
    }

    function getYForRow(row) {
      return row * cellSizePx + "px";
    }

    onMounted(async () => {
      const OPPONENTS_COUNT = 10;
      const position = await generatePosition(OPPONENTS_COUNT);
      playerKnightPos.value = position.playerKnight;
      opponentPieces.value = position.opponentsPieces;
    });

    return {
      rootElt,
      isPlayerKnightPos,
      classForCell,
      handleDragStart,
      handleDrag,
      handleDragEnd,
      dndIsActive,
      dndData,
      playerKnightLeft,
      playerKnightTop,
      opponentPieces,
      opponentImageForValue,
      getXForCol,
      getYForRow,
    };
  },
};
</script>

<style scoped>
.grid {
  position: relative;
  width: 400px;
  height: 400px;
  display: grid;
  grid-template: repeat(8, 1fr) / auto;
}

.grid_row {
  display: grid;
  grid-template: auto / repeat(8, 1fr);
}

.white_cell {
  background-color: navajowhite;
}

.black_cell {
  background-color: peru;
}

.pieces_layer {
  position: absolute;
  width: 400px;
  height: 400px;
}

#player_knight {
  position: absolute;
}

.opponent_piece {
  position: absolute;
}
</style>